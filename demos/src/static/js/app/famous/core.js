define(function (require, exports, module) {

var $ = require('jquery');
var Engine = require('famous/core/Engine');
var rich = require('rich');


var context = Engine.createContext($('#window')[0]);

exports.context = context;
exports.Region = rich.Region.extend({context: context});

});
