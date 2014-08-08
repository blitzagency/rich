define(function(require, exports, module) {

// Imports

var _ = require('underscore');
var $ = require('jquery');
var rich = require('rich');
var Modifier = require('famous/core/Modifier');
var Rectangle = require('app/shared/models/rectangle').Rectangle;
var RectangleView = require('app/shared/views/rectangle-view').RectangleView;
var render = require('tests/utils/time').render;
var colors = require('tests/utils/colors').blue;

jasmine.DEFAULT_TIMEOUT_INTERVAL = 30000;

describe('Auto Layout:', function() {
    var region;
    var $el;
    var context;

    beforeEach(function() {
        loadFixtures('famous.html');

        region = new rich.Region({
            el: '#famous-context'
        });


        $el = region.el;
        context = region.context;

        expect($el.length).toBe(1);
    });

    afterEach(function() {
        region.reset();
        region = null;
    });


    xit('generates layout modifiers', function(done){
        var model = new Rectangle({
            color: 'red'
        });

        var view = new rich.View({
            model: model,
            constraints: [

                {
                    item: 'navigation',
                    attribute: 'left',
                    relatedBy: '==', // '=|>=|<='
                    toItem: 'superview',
                    toAttribute: 'top',
                    constant: 10,
                },

                {
                    item: 'navigation',
                    attribute: 'right',
                    relatedBy: '==', // '=|>=|<='
                    toItem:'superview',
                    toAttribute: 'width',
                    constant: 0,
                    multiplier: 0.5
                },

                {
                    item: 'navigation',
                    attribute: 'top',
                    relatedBy: '==', // '=|>=|<='
                    toItem: 'superview',
                    toAttribute: 'top',
                    constant: 5,
                    multiplier: 1
                },
            ]
        });

        view.navigation = new RectangleView({
            model:model
        });

        view.addSubview(view.navigation);
        region.show(view);

        view.setSize([200, 200]);

        view.onShow = function(){

            expect(view._autolayout.width.value).toBe(200);
            expect(view._autolayout.height.value).toBe(200);

            expect(view.navigation._autolayout.top.value).toBe(5);
            expect(view.navigation._autolayout.height.value).toBe(195);
            expect(view.navigation._autolayout.width.value).toBe(90);
            expect(view.navigation._autolayout.left.value).toBe(10);
            done();
        };

    });

    it('generates complex layout modifiers', function(done){

        var color0 = new Rectangle({
            color: colors[0]
        });

        var color1 = new Rectangle({
            color: colors[1]
        });

        var color2 = new Rectangle({
            color: colors[2]
        });

        var color3 = new Rectangle({
            color: colors[3]
        });

        var color4 = new Rectangle({
            color: colors[4]
        });

        var color5 = new Rectangle({
            color: colors[5]
        });

        var gray = new Rectangle({
            color: '#ccc'
        });

        var view = new rich.View({
            constraints: [
                {
                    item: 'column',
                    attribute: 'width',
                    relatedBy: '==',
                    constant: 200
                },

                {
                    item: 'column',
                    attribute: 'left',
                    relatedBy: '==',
                    toItem: 'superview',
                    toAttribute: 'left',
                    constant: 0
                },

                // {
                //     item: 'content',
                //     attribute: 'left',
                //     relatedBy: '==',
                //     toItem: 'column',
                //     toAttribute: 'right',
                //     constant: 0
                // },
            ]
        });

        var column = new RectangleView({
            model: color0,

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
            ]
        });

        var footer = new RectangleView({
            model: color1,

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


            ]
        });

        var content = new RectangleView({
            model: gray
        });

        var action1 = new RectangleView({
            model: color3
        });

        var action2 = new RectangleView({
            model: color4
        });

        var action3 = new RectangleView({
            model: color4,
            constraints: [
                {
                    item: 'subaction',
                    attribute: 'top',
                    relatedBy: '==',
                    constant: 0
                },
                // {
                //     item: 'subaction',
                //     attribute: 'height',
                //     relatedBy: '==',
                //     // toItem: 'action2',
                //     // toAttribute: 'left',
                //     constant: 10
                // },
                // {
                //     item: 'subaction',
                //     attribute: 'right',
                //     relatedBy: '==',
                //     // toItem: 'action2',
                //     // toAttribute: 'left',
                //     constant: 0
                // },
                // {
                //     item: 'subaction',
                //     attribute: 'bottom',
                //     relatedBy: '==',
                //     // toItem: 'action2',
                //     // toAttribute: 'left',
                //     constant: 0
                // }
            ]
        });

        var subaction = new RectangleView({
            model: color2
        });

        action1.name = 'action1';
        action2.name = 'action2';
        action3.name = 'action3';
        subaction.name = 'subaction';


        footer.name = 'footer';
        column.name = 'column';
        view.name = 'view';
        content.name = 'content';

        view.column = column;
        view.content = content;
        view.addSubview(column);
        // view.addSubview(content);

        column.action1 = action1;
        column.addSubview(action1);

        column.footer = footer;
        column.addSubview(footer);

        footer.action2 = action2;
        footer.addSubview(action2, 3);

        footer.action3 = action3;
        footer.addSubview(action3, 3);

        action3.subaction = subaction;
        action3.addSubview(subaction);

        region.show(view);

        //view.setSize([1000, 400]);
        view.onShow = function(){
            // expect(content._autolayout.left.value).toBe(200);
            // expect(content._autolayout.right.value).toBe(0);

            // expect(column._autolayout.right.value).toBe(800);
            // expect(column._autolayout.left.value).toBe(0);

            // expect(action1._autolayout.left.value).toBe(150);
            // expect(action1._autolayout.right.value).toBe(0);
            // expect(action1._autolayout.width.value).toBe(50);
            // expect(action1._autolayout.height.value).toBe(50);

            // expect(footer._autolayout.left.value).toBe(0);
            // expect(footer._autolayout.right.value).toBe(0);
            // expect(footer._autolayout.width.value).toBe(200);
            // expect(footer._autolayout.height.value).toBe(50);


            // expect(action2._autolayout.left.value).toBe(150);
            // expect(action2._autolayout.right.value).toBe(0);
            // expect(action2._autolayout.width.value).toBe(50);

            // console.log('-- rich-autolayout-modifiers.js [Line 337]');
            // console.log('(content) L:' + content._autolayout.left.value);
            // console.log('(content) R:' + content._autolayout.right.value);
            // console.log('---');

            // console.log('---');
            // console.log('(column) L:' + column._autolayout.left.value);
            // console.log('(column) R:' + column._autolayout.right.value);

            // console.log('---');

            // console.log('(action1) L:' + action1._autolayout.left.value);
            // console.log('(action1) R:' + action1._autolayout.right.value);
            // console.log('(action1) W:' + action1._autolayout.width.value);
            // console.log('---');

            // console.log('(footer) L:' + footer._autolayout.left.value);
            // console.log('(footer) R:' + footer._autolayout.right.value);
            // console.log('(footer) W:' + footer._autolayout.width.value);
            // console.log('---');

            // console.log('(action2) L:' + action2._autolayout.left.value);
            // console.log('(action2) R:' + action2._autolayout.right.value);
            // console.log('(action2) W:' + action2._autolayout.width.value);
            // console.log('---');

            // console.log('(action3) L:' + action3._autolayout.left.value);
            // console.log('(action3) R:' + action3._autolayout.right.value);
            //console.log(footer.getSize());
            //console.log(action1._autolayout.left.value);
            // done();
        };

    });


}); // eof describe
}); // eof define
