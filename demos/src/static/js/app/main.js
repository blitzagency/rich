define(function(require, exports, module) {

var ApplicationDelegate = require('./delegate').ApplicationDelegate;
var rich = require('rich');

function main(options){
    var app = this;

    // app.addRegions({
    //     window: famous.Region.extend({
    //         el: 'body'
    //     }),
    // });

    app.addContentViews({
        window: {
            el: 'body',
            constraints: [
                {
                    item: 'navigation',
                    attribute: 'height',
                    relatedBy: '==',
                    constant: 100
                },

                {
                    item: 'navigation',
                    attribute: 'top',
                    relatedBy: '==',
                    toItem: 'superview',
                    toAttribute: 'top',
                    constant: 0
                }
            ]
        }
    });

    new ApplicationDelegate({app: app});
}

exports.main = main;
});
