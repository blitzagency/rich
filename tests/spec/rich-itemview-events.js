define(function(require, exports, module) {

// Imports

var _ = require('underscore');
var $ = require('jquery');
var rich = require('rich');
var utils = require('rich/utils');
var Modifier = require('famous/core/Modifier');
var EventsView = require('app/shared/views/events-view').EventsView;
var render = require('tests/utils/time').render;
var wait = require('tests/utils/time').wait;
var colors = require('tests/utils/colors').blue;
var Setup = require('tests/utils/setup').Setup;

jasmine.DEFAULT_TIMEOUT_INTERVAL = 30000;

describe('ItemView Events:', function() {

    beforeEach(function() {
        loadFixtures('famous.html');

    });

    afterEach(function() {

    });

    it('bindings work', function(done){
        var context = new Setup(done);
        var clickSpy = jasmine.createSpy('clickSpy');

        var ClickableRect = EventsView.extend({
            events: {
                'click button': 'gotClicked'
            },
            gotClicked: clickSpy
        });

        var view = new ClickableRect();
        context.region.show(view);

        view.onShow = function(){
            view.$el.find('button').trigger('click');
            expect(clickSpy).toHaveBeenCalled();
            context.done();
        }

    });


}); // eof describe
}); // eof define
