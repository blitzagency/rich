define(function(require, exports, module) {

// Imports

var _ = require('underscore');
var $ = require('jquery');
var rich = require('rich');
var Modifier = require('famous/core/Modifier');



describe('View:', function() {
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


    it('invalidates subviews', function(){
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

}); // eof describe
}); // eof define
