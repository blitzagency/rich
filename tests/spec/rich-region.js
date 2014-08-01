define(function(require, exports, module) {

// Imports

var _ = require('underscore');
var $ = require('jquery');
var rich = require('rich');
var Modifier = require('famous/core/Modifier');
var Rectangle = require('app/shared/models/rectangle').Rectangle;
var RectangleView = require('app/shared/views/rectangle-view').RectangleView;
var render = require('tests/utils/time').render;
var wait = require('tests/utils/time').wait;
var css = require('tests/utils/css');
var colors = require('tests/utils/colors').blue;



describe('Region:', function() {
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

        jasmine.DEFAULT_TIMEOUT_INTERVAL = 20000;
    });

    afterEach(function() {
        region = null;
    });

    it('uses size', function(){
        var region = new rich.Region({context: context, size: [20, 20]});
        expect(region.getSize()).toEqual([20, 20]);
    });

    it('uses default zIndex', function(done){

        var region = new rich.Region({context: context, zIndex: 3});
        var rect1 = new Rectangle({
            tx: 0,
            ty: 0,
            size: [200, 200],
            color: colors[3]
        });

        var rect1View = new RectangleView({model: rect1});
        region.show(rect1View);

        render().then(function(){
            var value = css.getZIndex(rect1View.$el);
            expect(value).toBe(4);
            done();
        });

    });

    it('uses size as function', function(){

        var obj = {
            size: function(){
                return [20, 20];
            }
        };

        var spy = spyOn(obj, 'size').and.callThrough();

        var region = new rich.Region({context: context, size: obj.size});

        expect(spy).toHaveBeenCalled();
        expect(region.getSize()).toEqual([20, 20]);
    });


    it('invalidates layout on resize', function(done){

        var view = new rich.View();

        spyOn(region, 'invalidateLayout').and.callThrough();
        region.show(view);

        window.dispatchEvent(new Event('resize'));

        setTimeout(function(){
            expect(region.invalidateLayout.calls.count()).toBe(1);
            done();
        }, 10);
    });

    it('throws on invalid initialization', function(){

        function action(){
            // no el, no context should explode.
            new rich.Region();
        }

        expect(action).toThrow();
    });

}); // eof describe
}); // eof define
