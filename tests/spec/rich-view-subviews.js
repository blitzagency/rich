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
var scroll = require('rich/scrollview');

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


    it('handles invalidate on multiple modifiers', function(done){

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


}); // eof describe
}); // eof define
