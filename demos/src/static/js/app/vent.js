define(function(require, exports, module) {

var backbone = require('backbone');
var marionette = require('marionette');

var vent = new backbone.Wreqr.EventAggregator();

exports.vent = vent;

});

