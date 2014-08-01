define(function(require, exports, module) {

// Imports

var _ = require('underscore');
var $ = require('jquery');
var rich = require('rich');
var Modifier = require('famous/core/Modifier');
var Transform = require('famous/core/Transform');
var Rectangle = require('app/shared/models/rectangle').Rectangle;
var RectangleView = require('app/shared/views/rectangle-view').RectangleView;
var matrix = require('tests/utils/matrix');
var render = require('tests/utils/time').render;
var colors = require('tests/utils/colors').blue;


describe('View:', function() {
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


    it('renders view', function(done){
        var model = new Rectangle({
            size: [300, 500]
        });

        var view = new RectangleView({model: model});
        view.context = context;

        context.add(view);

        render().then(function(){
            expect(view.$el).not.toBe(undefined);
            expect($el.children().length).toBe(1);
            done();
        });
    });


    it('uses className', function(done){
        var model = new Rectangle({
            size: [300, 500]
        });

        var view = new RectangleView({model: model, className: 'foo'});
        view.context = context;

        context.add(view);

        render().then(function(){
            expect(view.$el.hasClass('foo')).toBe(true);
            done();
        });
    });


    it('uses className as function', function(done){
        var model = new Rectangle({
            size: [300, 500],
        });

        var className = function(){
            return 'bar';
        };

        var view = new RectangleView({model: model, className: className});
        view.context = context;

        context.add(view);

        render().then(function(){
            expect(view.$el.hasClass('bar')).toBe(true);
            done();
        });
    });


    it('uses modifier', function(done){
        var model = new Rectangle({
            size: [300, 500],
        });

        var modifier = new Modifier({
            transform: Transform.translate(10, 20, 30)
        });

        var view = new RectangleView({model: model, modifier: modifier});
        view.context = context;

        context.add(view);

        render().then(function(){
            var value = matrix.getTranslation(view.$el);

            expect(value).toEqual({
                x: 10, y: 20, z: 30
            });

            done();
        });
    });

    it('adds subviews', function(done){
        var rect1 = new Rectangle({
            tx: 0,
            ty: 0,
            size: [200, 200],
            color: colors[3]
        });

        var rect2 = new Rectangle({
            tx: 20,
            ty: 20,
            size: [100, 100],
            color: colors[5]
        });

        var rect3 = new Rectangle({
            tx: 20,
            ty: 20,
            size: [50, 50],
            color: colors[7],
            content: 'click'
        });

        var rect1View = new RectangleView({model: rect1});
        var rect2View = new RectangleView({model: rect2});
        var rect3View = new RectangleView({model: rect3});

        rect2View.addSubview(rect3View);
        rect1View.addSubview(rect2View);

        rect1View.context = context;
        context.add(rect1View);

        render().then(function(){
            var value1 = matrix.getTranslation(rect1View.$el);
            var value2 = matrix.getTranslation(rect2View.$el);
            var value3 = matrix.getTranslation(rect3View.$el);

            expect(value1).toEqual({
                x: 0, y: 0, z: 0
            });

            expect(value2).toEqual({
                x: 20, y: 20, z: 0
            });

            expect(value3).toEqual({
                x: 40, y: 40, z: 0
            });

            done();
        });
    });

    it('adds nested subviews', function(done){

        var rect1 = new Rectangle({
            tx: 0,
            ty: 0,
            size: [200, 200],
            color: colors[3]
        });

        var rect2 = new Rectangle({
            tx: 20,
            ty: 20,
            size: [100, 100],
            color: colors[5]
        });

        var rect3 = new Rectangle({
            tx: 20,
            ty: 20,
            size: [50, 50],
            color: colors[7],
            content: 'click'
        });

        var view = new rich.View({nestedSubviews: true});

        var rect1View = new RectangleView({model: rect1});
        var rect2View = new RectangleView({model: rect2});
        var rect3View = new RectangleView({model: rect3});

        view.addSubview(rect1View);
        view.addSubview(rect2View);
        view.addSubview(rect3View);


        view.context = context;
        context.add(view);

        render().then(function(){
            expect(view.$el).not.toBe(undefined);

            // <div class="famous-group famous-container-group">
            expect(view.$el.children().length).toBe(1);
            expect(view.$el.find('.famous-group > .famous-surface').length).toBe(3);

            var value1 = matrix.getTranslation(rect1View.$el);
            var value2 = matrix.getTranslation(rect2View.$el);
            var value3 = matrix.getTranslation(rect3View.$el);

            expect(value1).toEqual({
                x: 0, y: 0, z: 0
            });

            expect(value2).toEqual({
                x: 20, y: 20, z: 0
            });

            expect(value3).toEqual({
                x: 20, y: 20, z: 0
            });

            done();
        });
    });


    it('invalidates subview layouts', function(){
        // top to bottom
        var view1 = new rich.View();
        var view2 = new rich.View();
        var view3a = new rich.View();
        var view3b = new rich.View();
        var view4 = new rich.View();

        view1.addSubview(view2);
        view2.addSubview(view3a);
        view2.addSubview(view3b);
        view3a.addSubview(view4);

        spyOn(view2, 'invalidateLayout').and.callThrough();
        spyOn(view3a, 'invalidateLayout').and.callThrough();
        spyOn(view3b, 'invalidateLayout').and.callThrough();
        spyOn(view4, 'invalidateLayout').and.callThrough();

        region.show(view1);
        view1.invalidateLayout();

        expect(view2.invalidateLayout.calls.count()).toBe(1);
        expect(view3a.invalidateLayout.calls.count()).toBe(1);
        expect(view3b.invalidateLayout.calls.count()).toBe(1);
        expect(view4.invalidateLayout.calls.count()).toBe(1);
    });


    it('invalidates subview', function(){
        // bottom to top
        var view1 = new rich.View();
        var view2 = new rich.View();
        var view3 = new rich.View();
        var view4 = new rich.View();

        // need to add the spies here, once a subview is added
        // the event listener will be bound.
        spyOn(view1, 'subviewDidChange').and.callThrough();
        spyOn(view2, 'subviewDidChange').and.callThrough();
        spyOn(view3, 'subviewDidChange').and.callThrough();

        view1.addSubview(view2);
        view2.addSubview(view3);
        view3.addSubview(view4);

        region.show(view1);
        view4.invalidateView();

        expect(view1.subviewDidChange.calls.count()).toBe(1);
        expect(view2.subviewDidChange.calls.count()).toBe(1);
        expect(view3.subviewDidChange.calls.count()).toBe(1);
    });

}); // eof describe
}); // eof define
