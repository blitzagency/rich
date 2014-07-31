define(function(require, exports, module) {

var ApplicationDelegate = require('./delegate').ApplicationDelegate;
var famous = require('app/famous/core');

function main(options){
    var app = this;

    app.addRegions({
        window: famous.Region.extend({
            el: 'body'
        }),
    });

    new ApplicationDelegate({app: app});
}

exports.main = main;
});
