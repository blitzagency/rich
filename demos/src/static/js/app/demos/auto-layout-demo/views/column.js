define(function (require, exports, module) {

var rich = require('rich');
var utils = require('app/utils');
var RectangleView = require('app/shared/views/rectangle-view').RectangleView;
var Rectangle = require('app/shared/models/rectangle').Rectangle;
var Footer = require('./footer').Footer;

var Column = RectangleView.extend({
    autoLayoutTransition: {
        duration: 500
    },

    constraints: [
        {
            item: 'action1',
            attribute: 'height',
            relatedBy: '==',
            constant: 50
        },

        {
            item: 'action1',
            attribute: 'width',
            relatedBy: '==',
            constant: 50
        },

        {
            item: 'action1',
            attribute: 'right',
            relatedBy: '==',
            toItem: 'superview',
            toAttribute: 'right',
            constant: 0
        },

        {
            item: 'footer',
            attribute: 'bottom',
            relatedBy: '==',
            toItem: 'superview',
            toAttribute: 'bottom',
            constant: 0
        },

        {
            item: 'footer',
            attribute: 'height',
            relatedBy: '==',
            constant: 50
        },

        {
            item: 'footer',
            attribute: 'width',
            relatedBy: '==',
            toItem: 'superview',
            toAttribute: 'width',
        },
    ],

    initialize: function(){
        var color1 = new Rectangle({
            color: utils.colors.blue[1]
        });

        var color3 = new Rectangle({
            color: utils.colors.blue[3]
        });

        var action1 = new RectangleView({
            model: color3
        });

        var footer = new Footer({
            model: color1
        });

        this.addSubview(action1);
        this.addSubview(footer);
    },
});

exports.Column = Column;

});
