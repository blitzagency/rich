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


jasmine.DEFAULT_TIMEOUT_INTERVAL = 30000;

describe('ItemView Events:', function() {
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
        region.reset();
        region = null;
    });


    it('bindings work', function(done){

        var clickSpy = jasmine.createSpy('clickSpy');

        var ClickableRect = EventsView.extend({
            events: {
                'click button': 'gotClicked'
            },
            gotClicked: clickSpy
        });

        var view = new ClickableRect();
        region.show(view);

        view.onShow = function(){
            view.$el.find('button').trigger('click');
            expect(clickSpy).toHaveBeenCalled();
            done();
        }

    });


}); // eof describe
}); // eof define
