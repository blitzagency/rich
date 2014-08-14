define(function(require, exports, module) {

// Imports

var _ = require('underscore');
var $ = require('jquery');
var rich = require('rich');
var Modifier = require('famous/core/Modifier');
var Scrollview = require('rich/scrollview').Scrollview;
var Rectangle = require('app/shared/models/rectangle').Rectangle;
var RectangleView = require('app/shared/views/rectangle-view').RectangleView;

jasmine.DEFAULT_TIMEOUT_INTERVAL = 30000;

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


    it('scrolls', function(done){
        var model = new Rectangle();
        var view = new RectangleView({
            model: model
        });

        var scrollview = new Scrollview();
        scrollview.addSubview(view);
        region.show(scrollview);


        done()
    });

}); // eof describe
}); // eof define
