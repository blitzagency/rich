define(function(require, exports, module) {

// Imports

var _ = require('underscore');
var $ = require('jquery');
var rich = require('rich');
var Modifier = require('famous/core/Modifier');



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
    });

    afterEach(function() {
        region = null;
    });

    it('uses size', function(){

        var region = new rich.Region({context: context, size: [20, 20]});
        expect(region.getSize()).toEqual([20, 20]);
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
