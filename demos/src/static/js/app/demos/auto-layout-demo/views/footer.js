define(function (require, exports, module) {

var rich = require('rich');
var utils = require('app/utils');
var RectangleView = require('app/shared/views/rectangle-view').RectangleView;
var Rectangle = require('app/shared/models/rectangle').Rectangle;
var Action = require('./action').Action;

var Footer = RectangleView.extend({
    autoLayoutTransition: {
        duration: 500
    },

    constraints: [

        {
            item: 'action2',
            attribute: 'width',
            relatedBy: '==',
            constant: 50
        },

        {
            item: 'action2',
            attribute: 'height',
            relatedBy: '==',
            constant: 50
        },

        {
            item: 'action2',
            attribute: 'right',
            relatedBy: '==',
            toItem: 'superview',
            toAttribute: 'right',
            constant: 0
        },


        {
            item: 'action3',
            attribute: 'width',
            relatedBy: '==',
            constant: 50
        },

        {
            item: 'action3',
            attribute: 'height',
            relatedBy: '==',
            constant: 50
        },

        {
            item: 'action3',
            attribute: 'right',
            relatedBy: '==',
            toItem: 'action2',
            toAttribute: 'left',
            constant: 10
        },
    ],

    initialize: function(){
        var color4 = new Rectangle({
            color: utils.colors.blue[4]
        });

        var color5 = new Rectangle({
            color: utils.colors.blue[5]
        });

        var action2 = new RectangleView({
            model: color4
        });

        var action3 = new Action({
            model: color5
        });

        this.addSubview(action2, 3);
        this.addSubview(action3, 3);

    },
});

exports.Footer = Footer;

});
