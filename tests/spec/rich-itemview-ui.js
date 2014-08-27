define(function(require, exports, module) {

// Imports

var _ = require('underscore');
var $ = require('jquery');
var rich = require('rich');
var Modifier = require('famous/core/Modifier');
var EventsView = require('app/shared/views/events-view').EventsView;
var render = require('tests/utils/time').render;
var wait = require('tests/utils/time').wait;
var colors = require('tests/utils/colors').blue;
var Setup = require('tests/utils/setup').Setup;


jasmine.DEFAULT_TIMEOUT_INTERVAL = 30000;

describe('ItemView UI:', function() {

    beforeEach(function() {
        loadFixtures('famous.html');

    });

    afterEach(function() {

    });


    it('checks UI object', function(done){
        var context = new Setup(done);
        var region = context.region;
        var root = context.root;

        var ClickableRect = EventsView.extend({
            events: {
            },
        });

        var view = new ClickableRect();
        region.show(view);

        view.onShow = function(){
            context.done();
        };

    });


}); // eof describe
}); // eof define
