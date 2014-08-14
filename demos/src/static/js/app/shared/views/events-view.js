define(function (require, exports, module) {

var rich = require('rich');
var StateModifier = require('famous/modifiers/StateModifier');
var Transform = require('famous/core/Transform');

var template = require('hbs!../templates/events-view');

var EventsView = rich.ItemView.extend({
    template : template,

});

exports.EventsView = EventsView;

});
