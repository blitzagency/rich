define(function(require, exports, module) {

// Imports

var _ = require('underscore');
var $ = require('jquery');
var rich = require('rich');
var Modifier = require('famous/core/Modifier');



describe('Layout:', function() {
    var region;
    var $el;

    beforeEach(function() {
        loadFixtures('famous.html');

        region = new rich.Region({
            el: '#famous-context'
        });

        $el = region.el;
        expect($el.length).toBe(1);
    });

    afterEach(function() {
        region = null;
    });


    it('invalidates on resize', function(done){

        var view = new rich.View();

        spyOn(region, 'invalidateLayout').and.callThrough();
        region.show(view);

        window.dispatchEvent(new Event('resize'));

        setTimeout(function(){
            expect(region.invalidateLayout.calls.count()).toBe(1);
            done();
        }, 10);
    });

}); // eof describe
}); // eof define
