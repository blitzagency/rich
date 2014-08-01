define(function(require, exports, module) {

// Imports

var _ = require('underscore');
var $ = require('jquery');
var rich = require('rich');
var matrix = require('tests/utils/matrix');
var Modifier = require('famous/core/Modifier');
var Transform = require('famous/core/Transform');
var Rectangle = require('app/shared/models/rectangle').Rectangle;
var RectangleView = require('app/shared/views/rectangle-view').RectangleView;




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

        context.add(view);

        setTimeout(function(){
            expect(view.$el).not.toBe(undefined);
            expect($el.children().length).toBe(1);
            done();
        }, 60);
    });


    it('uses className', function(done){
        var model = new Rectangle({
            size: [300, 500]
        });

        var view = new RectangleView({model: model, className: 'foo'});

        context.add(view);

        setTimeout(function(){
            expect(view.$el.hasClass('foo')).toBe(true);
            done();
        }, 60);
    });


    it('uses className as function', function(done){
        var model = new Rectangle({
            size: [300, 500],
        });

        var className = function(){
            return 'bar';
        };

        var view = new RectangleView({model: model, className: className});

        context.add(view);

        setTimeout(function(){
            expect(view.$el.hasClass('bar')).toBe(true);
            done();
        }, 60);
    });


    it('uses modifier', function(done){
        var model = new Rectangle({
            size: [300, 500],
        });

        var modifier = new Modifier({
            transform: Transform.translate(10, 20, 30)
        });

        var view = new RectangleView({model: model, modifier: modifier});

        context.add(view);

        setTimeout(function(){
            var value = matrix.getTranslation(view.$el);

            expect(value).toEqual({
                x: 10, y: 20, z: 30
            });

            done();
        }, 60);
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
