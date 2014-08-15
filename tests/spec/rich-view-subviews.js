define(function(require, exports, module) {

// Imports

var _ = require('underscore');
var $ = require('jquery');
var rich = require('rich');
var backbone = require('backbone');
var Modifier = require('famous/core/Modifier');
var Transform = require('famous/core/Transform');
var Rectangle = require('app/shared/models/rectangle').Rectangle;
var RectangleView = require('app/shared/views/rectangle-view').RectangleView;
var matrix = require('tests/utils/matrix');
var css = require('tests/utils/css');
var render = require('tests/utils/time').render;
var colors = require('tests/utils/colors').blue;
var scroll = require('rich/scrollview/scrollview');

jasmine.DEFAULT_TIMEOUT_INTERVAL = 30000;

describe('View Subview:', function() {
    var region;
    var context;
    var $el;

    beforeEach(function() {
        loadFixtures('famous.html');

        region = new rich.Region({
            el: '#famous-context'
        });

        $el = region.el;
        context = region.context;
        expect($el.length).toBe(1);
        expect(context).not.toBe(undefined);
        //jasmine.DEFAULT_TIMEOUT_INTERVAL = 20000;
    });


    afterEach(function() {
        region = null;
    });


    xit('handles invalidate on multiple modifiers', function(done){

        // collection view
        var model = new Rectangle({
            color:'red'
        });

        var parent = new rich.View();

        var mod1 = new Modifier();
        mod1.transformFrom(function(){
            return Transform.translate(10, 10, 0);
        });

        var mod2 = new Modifier();
        mod2.transformFrom(function(){
            return Transform.rotateZ(0.1);
        });

        var ChildView = RectangleView.extend({
            initialize: function(){

            },
        });

        var ParentCollView = rich.CollectionView.extend({
            childView:ChildView,
            modifier: [mod1, mod2],
            modifierForViewAtIndex:function(){
                return new Modifier();
            }
        });

        var collection = new backbone.Collection();
        collection.add(model);

        var parentView = new ParentCollView({
            collection:collection
        });


        // layout
        var ParentLayout = rich.LayoutView.extend({
            regions:{
                scrollContainer: rich.Region.extend({
                    size: [1000, 800]
                })
            },
            onShow: function(){
                var foo = new rich.ItemView();
                // console.log(parentView)
                foo.addSubview(parentView);
                this.scrollContainer.show(foo);
            },
        });




        var scrollView = new scroll.ScrollView({
            contentSize: [2000, 2200],
            direction: scroll.DIRECTION_Y
        });


        scrollView.on('scroll:update', function(){
            parentView.invalidateView();
        });

        var parentLayout = new ParentLayout();

        region.show(parentLayout);
        // parentLayout.scrollContainer.show(scrollView);

        render().then(function(){
            parentView.invalidateView();
            done();
        });
    });

    it('builds correct spec based on view with child', function(done){

        var blue = new Rectangle({
            color: 'blue'
        });
        var red = new Rectangle({
            color: 'red'
        });


        var view = new rich.View();


        var subview1 = new RectangleView({
            model: red,
            // modifier: new Modifier()
        });

        // var subview2 = new RectangleView({
        //     model: red,
        //     modifier: new Modifier()
        // });

        view.name = 'view';
        subview1.name = 'subview1';
        // subview2.name = 'subview2';


        view.addSubview(subview1);
        // view.addSubview(subview2);

        region.show(view);

        render().then(function(){
            var spec = view.render();
            // target 1 = view's constraint modifier
            // target 2 = subviews constraint modifier
            // target 3 = subviews modifier
            expect(spec.target.target.target).toBe(subview1.getFamousId());
            done();
        });
    });

    it('builds correct spec based on view with multiple children', function(done){

        var blue = new Rectangle({
            color: 'blue'
        });
        var red = new Rectangle({
            color: 'red'
        });


        var view = new rich.View();


        var subview1 = new RectangleView({
            model: red,
            modifier: new Modifier()
        });

        var subview2 = new RectangleView({
            model: blue,
            modifier: new Modifier()
        });

        view.name = 'view';
        subview1.name = 'subview1';
        subview2.name = 'subview2';


        view.addSubview(subview1);
        view.addSubview(subview2);

        region.show(view);

        render().then(function(){
            var spec = view.render();

            //        Modivier  Constraint  Modifier
            //             V         V      V
            expect(spec.target[0].target.target).toBe(subview1.getFamousId());
            expect(spec.target[1].target.target).toBe(subview2.getFamousId());

            done();
        });
    });

    it('builds correct spec after invalidate based on view with child', function(done){

        var blue = new Rectangle({
            color: 'blue'
        });
        var red = new Rectangle({
            color: 'red'
        });


        var view = new rich.View();


        var subview1 = new RectangleView({
            model: red,
            // modifier: new Modifier()
        });

        // var subview2 = new RectangleView({
        //     model: red,
        //     modifier: new Modifier()
        // });

        view.name = 'view';
        subview1.name = 'subview1';
        // subview2.name = 'subview2';


        view.addSubview(subview1);
        // view.addSubview(subview2);

        region.show(view);

        render().then(function(){
            subview1.invalidateView();
            var spec = view.render();
            // target 1 = view's constraint modifier
            // target 2 = subviews constraint modifier
            // target 3 = subviews modifier
            expect(spec.target.target.target).toBe(subview1.getFamousId());
            done();
        });
    });

    it('builds correct spec after invalidate based on view with multiple children', function(done){

        var blue = new Rectangle({
            color: 'blue'
        });
        var red = new Rectangle({
            color: 'red'
        });


        var view = new rich.View();


        var subview1 = new RectangleView({
            model: red,
            modifier: new Modifier()
        });

        var subview2 = new RectangleView({
            model: blue,
            modifier: new Modifier()
        });

        view.name = 'view';
        subview1.name = 'subview1';
        subview2.name = 'subview2';


        view.addSubview(subview1);
        view.addSubview(subview2);

        region.show(view);

        render().then(function(){
            subview1.invalidateView();
            subview2.invalidateView();
            var spec = view.render();

            //        Modivier  Constraint  Modifier
            //             V         V      V
            expect(spec.target[0].target.target).toBe(subview1.getFamousId());
            expect(spec.target[1].target.target).toBe(subview2.getFamousId());
            done();
        });
    });

    it('builds correct spec after render, based on view with multiple children', function(done){

        var blue = new Rectangle({
            color: 'blue'
        });
        var red = new Rectangle({
            color: 'red'
        });


        var view = new rich.View();


        var subview1 = new RectangleView({
            model: red,
            modifier: new Modifier()
        });

        var subview2 = new RectangleView({
            model: blue,
            modifier: new Modifier()
        });

        view.name = 'view';
        subview1.name = 'subview1';
        subview2.name = 'subview2';

        view.addSubview(subview1);
        region.show(view);


        render().then(function(){
            var spec = view.render();
            expect(spec.target.target.target).toBe(subview1.getFamousId());
            view.addSubview(subview2);

            render().then(function(){
                var spec = view.render();
                //        Modivier  Constraint  Modifier
                //             V         V      V
                expect(spec.target[0].target.target).toBe(subview1.getFamousId());
                expect(spec.target[1].target.target).toBe(subview2.getFamousId());
                done();
            });
        });
    });

    it('builds correct spec after render, based on child with multiple modifiers', function(done){

        var blue = new Rectangle({
            color: 'blue'
        });
        var red = new Rectangle({
            color: 'red'
        });


        var view = new rich.View();


        var subview1 = new RectangleView({
            model: red,
            modifier: new Modifier()
        });


        var subview2 = new RectangleView({
            model: blue,
            modifier: [new Modifier(), new Modifier(), new Modifier()]
        });

        view.name = 'view';
        subview1.name = 'subview1';
        subview2.name = 'subview2';

        view.addSubview(subview1);
        region.show(view);


        render().then(function(){
            var spec = view.render();
            expect(spec.target.target.target).toBe(subview1.getFamousId());
            view.addSubview(subview2);

            render().then(function(){
                var spec = view.render();
                expect(spec.target[0].target.target).toBe(subview1.getFamousId());
                expect(spec.target[1].target.target.target.target).toBe(subview2.getFamousId());
                done();
            });
        });
    });

    it('builds correct spec after render, based on child and parent with multiple modifiers', function(done){

        var blue = new Rectangle({
            color: 'blue'
        });
        var red = new Rectangle({
            color: 'red'
        });


        var view = new rich.View();


        var subview1 = new RectangleView({
            model: red,
            modifier: [new Modifier(), new Modifier(), new Modifier()]
        });


        var subview2 = new RectangleView({
            model: blue,
            modifier: [new Modifier(), new Modifier(), new Modifier()]
        });

        var subview3 = new RectangleView({
            model: blue,
            modifier: [new Modifier(), new Modifier(), new Modifier()]
        });

        subview1.addSubview(subview2);
        view.addSubview(subview1);
        region.show(view);


        render().then(function(){
            subview2.addSubview(subview3);

            render().then(function(){
                var spec = view.render();
                var firstArr = spec.target.target.target.target.target;
                expect(firstArr[0]).toBe(subview1.getFamousId());
                expect(firstArr[1].target.target.target.target[0]).toBe(subview2.getFamousId());
                expect(firstArr[1].target.target.target.target[1].target.target.target.target).toBe(subview3.getFamousId());
                done();
            });
        });
    });




}); // eof describe
}); // eof define
