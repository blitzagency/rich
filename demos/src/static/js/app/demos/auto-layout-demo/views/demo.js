define(function (require, exports, module) {

var rich = require('rich');
var _ = require('underscore');
var backbone = require('backbone');
var autolayout = require('rich/autolayout/init');
var utils = require('app/utils');
var RectangleView = require('app/shared/views/rectangle-view').RectangleView;
var Rectangle = require('app/shared/models/rectangle').Rectangle;
var Column = require('./column').Column;
var Content = require('./content').Content;
var Action = require('./action').Action;
var Footer = require('./footer').Footer;

var AutoLayoutDemo = rich.View.extend({
    autoLayoutTransition: {
        duration: 500
    },

    constraints: {},

    initialize: function(){

    },


});

exports.AutoLayoutDemo = AutoLayoutDemo;

});
