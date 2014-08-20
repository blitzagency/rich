define(function (require, exports, module) {

var rich = require('rich');
var utils = require('app/utils');
var Rectangle = require('app/shared/models/rectangle').Rectangle;
var RectangleView = require('app/shared/views/rectangle-view').RectangleView;


var Action = RectangleView.extend({
    autoLayoutTransition: {
        duration: 500
    },

    constraints: [
        // {
        //     item: 'action4',
        //     attribute: 'top',
        //     relatedBy: '==',
        //     constant: 0
        // },
        {
            item: 'action4',
            attribute: 'height',
            relatedBy: '==',
            // toItem: 'action2',
            // toAttribute: 'left',
            constant: 10
        },
        {
            item: 'action4',
            attribute: 'width',
            relatedBy: '==',
            // toItem: 'action2',
            // toAttribute: 'left',
            constant: 10
        },

        {
            item: 'action4',
            attribute: 'right',
            relatedBy: '==',
            // toItem: 'action2',
            // toAttribute: 'left',
            constant: 0
        },
        {
            item: 'action4',
            attribute: 'bottom',
            relatedBy: '==',
            // toItem: 'action2',
            // toAttribute: 'left',
            constant: 0
        }
    ],

    initialize: function(){
        var color2 = new Rectangle({
            color: utils.colors.blue[2]
        });

        var action4 = new RectangleView({
            model: color2
        });

        this.addSubview(action4);
    },
});

exports.Action = Action;

});
