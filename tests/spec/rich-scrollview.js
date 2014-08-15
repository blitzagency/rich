define(function(require, exports, module) {

// Imports

var _ = require('underscore');
var $ = require('jquery');
var rich = require('rich');
var Modifier = require('famous/core/Modifier');
var scroll = require('rich/scrollview');
var Rectangle = require('app/shared/models/rectangle').Rectangle;
var LongView = require('app/shared/views/long-view').LongView;

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
        var view = new LongView({
            model: model
        });
        var scrollView = new scroll.ScrollView({
            contentSize: [2000, 2200],
            direction: scroll.DIRECTION_Y
        });

        scrollView.addSubview(view);
        region.show(scrollView);


        // done()
    });

}); // eof describe
}); // eof define
