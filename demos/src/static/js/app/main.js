define(function(require, exports, module) {

var ApplicationDelegate = require('./delegate').ApplicationDelegate;
var rich = require('rich');

function main(options){
    var app = this;

    app.addRichContexts({
        window: {
            el: 'body'
        }
    });

    new ApplicationDelegate({app: app});
}

exports.main = main;
});
