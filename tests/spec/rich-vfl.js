define(function(require, exports, module) {

// Imports

var $ = require('jquery');
var rich = require('rich');
var Engine = require('famous/core/Engine');
var Modifier = require('famous/core/Modifier');
var Transform = require('famous/core/Transform');
var Rectangle = require('app/shared/models/rectangle').Rectangle;
var RectangleView = require('app/shared/views/rectangle-view').RectangleView;
var colors = require('tests/utils/colors').blue;
var VFLToJSON = require('rich/autolayout/utils').VFLToJSON;

describe('Visual Format Language:', function() {

    var region;
    var $el;
    var context;

    beforeEach(function() {
        loadFixtures('famous.html');
        $('#jasmine-fixtures').css({height: '100%'});

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


    it('converts simple to JSON', function(){

        var vfl = '|-50-[purpleBox]-50-|';
        var json = VFLToJSON(vfl);

        var output = [
            {
                "item": "purpleBox",
                "attribute": "left",
                "relatedBy": "==",
                "toItem": "superview",
                "toAttribute": "left",
                "multiplier": 1,
                "constant": 50
            },
            {
                "item": "purpleBox",
                "attribute": "right",
                "relatedBy": "==",
                "toItem": "superview",
                "toAttribute": "right",
                "multiplier": 1,
                "constant": 50
            }
        ];
        expect(JSON.stringify(json)).toEqual(JSON.stringify(output));
        // console.log(JSON.stringify(json, null, '\t'));

    });


    it('converts simple double to JSON', function(){

        var vfl = '|-50-[purpleBox]-50-[blueBox]-50-|';
        var json = VFLToJSON(vfl);

        var output = [
            {
                "item": "purpleBox",
                "attribute": "left",
                "relatedBy": "==",
                "toItem": "superview",
                "toAttribute": "left",
                "multiplier": 1,
                "constant": 50
            },
            {
                "item": "blueBox",
                "attribute": "left",
                "relatedBy": "==",
                "toItem": "purpleBox",
                "toAttribute": "right",
                "multiplier": 1,
                "constant": 50
            },
            {
                "item": "blueBox",
                "attribute": "right",
                "relatedBy": "==",
                "toItem": "superview",
                "toAttribute": "right",
                "multiplier": 1,
                "constant": 50
            }
        ];
        expect(JSON.stringify(json)).toEqual(JSON.stringify(output));


    });


    it('converts simple with width to JSON', function(){
        var vfl = '|-50-[purpleBox(100)]-50-|';
        var json = VFLToJSON(vfl);

        var output = [
            {
                "item": "purpleBox",
                "attribute": "left",
                "relatedBy": "==",
                "toItem": "superview",
                "toAttribute": "left",
                "multiplier": 1,
                "constant": 50
            },
            {
                "item": "purpleBox",
                "attribute": "right",
                "relatedBy": "==",
                "toItem": "superview",
                "toAttribute": "right",
                "multiplier": 1,
                "constant": 50
            },
            {
                "item": "purpleBox",
                "attribute": "width",
                "relatedBy": "==",
                "multiplier": 1,
                "constant": 100
            }
        ];

        // console.log(vfl)
        // console.log(JSON.stringify(json, null, '\t'));
        expect(JSON.stringify(json)).toEqual(JSON.stringify(output));
    });


    it('converts simple with greater than width to JSON', function(){
        var vfl = '|-50-[purpleBox(>=100)]-50-|';
        var json = VFLToJSON(vfl);

        var output = [
            {
                "item": "purpleBox",
                "attribute": "left",
                "relatedBy": "==",
                "toItem": "superview",
                "toAttribute": "left",
                "multiplier": 1,
                "constant": 50
            },
            {
                "item": "purpleBox",
                "attribute": "right",
                "relatedBy": "==",
                "toItem": "superview",
                "toAttribute": "right",
                "multiplier": 1,
                "constant": 50
            },
            {
                "item": "purpleBox",
                "attribute": "width",
                "relatedBy": ">=",
                "multiplier": 1,
                "constant": 100
            }
        ];

        // console.log(vfl)
        // console.log(JSON.stringify(json, null, '\t'));
        expect(JSON.stringify(json)).toEqual(JSON.stringify(output));
    });


    it('converts simple with less than width to JSON', function(){
        var vfl = '|-50-[purpleBox(<=100)]-50-|';
        var json = VFLToJSON(vfl);

        var output = [
            {
                "item": "purpleBox",
                "attribute": "left",
                "relatedBy": "==",
                "toItem": "superview",
                "toAttribute": "left",
                "multiplier": 1,
                "constant": 50
            },
            {
                "item": "purpleBox",
                "attribute": "right",
                "relatedBy": "==",
                "toItem": "superview",
                "toAttribute": "right",
                "multiplier": 1,
                "constant": 50
            },
            {
                "item": "purpleBox",
                "attribute": "width",
                "relatedBy": "<=",
                "multiplier": 1,
                "constant": 100
            }
        ];

        // console.log(vfl)
        // console.log(JSON.stringify(json, null, '\t'));
        expect(JSON.stringify(json)).toEqual(JSON.stringify(output));
    });


    it('converts crazy to JSON', function(){
        var vfl = '|[whiteBox1][blackBox4(redBox)]|';
        var json = VFLToJSON(vfl);

        var output = [
            {
                "item": "whiteBox1",
                "attribute": "left",
                "relatedBy": "==",
                "toItem": "superview",
                "toAttribute": "left",
                "multiplier": 1,
                "constant": 0
            },
            {
                "item": "blackBox4",
                "attribute": "left",
                "relatedBy": "==",
                "toItem": "whiteBox1",
                "toAttribute": "right",
                "multiplier": 1,
                "constant": 0
            },
            {
                "item": "blackBox4",
                "attribute": "right",
                "relatedBy": "==",
                "toItem": "superview",
                "toAttribute": "right",
                "multiplier": 1,
                "constant": 0
            },
            {
                "item": "blackBox4",
                "attribute": "width",
                "relatedBy": "==",
                "toItem": "redBox",
                "toAttribute": "width",
                "multiplier": 1
            }
        ];

        // console.log(vfl)
        // console.log(JSON.stringify(json, null, '\t'));
        // console.log(JSON.stringify(output, null, '\t'));
        // karma is forcing me to stringify or it's erroring
        expect(JSON.stringify(json)).toEqual(JSON.stringify(output));
    });


    it('converts crazy to JSON', function(){
        var vfl = 'V:|[whiteBox1][blackBox4(redBox)]|';
        var json = VFLToJSON(vfl);

        var output = [
            {
                "item": "whiteBox1",
                "attribute": "top",
                "relatedBy": "==",
                "toItem": "superview",
                "toAttribute": "top",
                "multiplier": 1,
                "constant": 0
            },
            {
                "item": "blackBox4",
                "attribute": "top",
                "relatedBy": "==",
                "toItem": "whiteBox1",
                "toAttribute": "bottom",
                "multiplier": 1,
                "constant": 0
            },
            {
                "item": "blackBox4",
                "attribute": "bottom",
                "relatedBy": "==",
                "toItem": "superview",
                "toAttribute": "bottom",
                "multiplier": 1,
                "constant": 0
            },
            {
                "item": "blackBox4",
                "attribute": "height",
                "relatedBy": "==",
                "toItem": "redBox",
                "toAttribute": "height",
                "multiplier": 1
            }
        ];

        // console.log(vfl)
        // console.log(JSON.stringify(json, null, '\t'));
        expect(JSON.stringify(json)).toEqual(JSON.stringify(output));
    });

    it('uses vfl when initializing view constraints', function(done){
        var color0 = new Rectangle({
            color: colors[0]
        });

        var color1 = new Rectangle({
            color: colors[1]
        });

        var box0 = new RectangleView({
            model: color0,
            constraints: [
                'V:[box1(200)]|'
            ]
        });

        var box1 = new RectangleView({
            model: color1,
        });

        box0.name = 'box0';
        box1.name = 'box1';

        box0.box1 = box1;
        box0.addSubview(box1);

        region.show(box0);

        box0.onShow = function(){

            expect(box0._autolayout.left.value).toBe(0);
            expect(box0._autolayout.right.value).toBe(0);
            expect(box0._autolayout.width.value).toBe(1000);
            expect(box0._autolayout.height.value).toBe(800);

            expect(box1._autolayout.left.value).toBe(0);
            expect(box1._autolayout.right.value).toBe(0);
            expect(box1._autolayout.width.value).toBe(1000);
            expect(box1._autolayout.height.value).toBe(200);
            expect(box1._autolayout.top.value).toBe(600);
            expect(box1._autolayout.bottom.value).toBe(0);
            done();
        };

    });

    it('uses mixed vfl + json when initializing view constraints', function(done){
        var color0 = new Rectangle({
            color: colors[0]
        });

        var color1 = new Rectangle({
            color: colors[1]
        });

        var box0 = new RectangleView({
            model: color0,
            constraints: [
                '|-20-[box1]',

                {
                    item: 'box1',
                    attribute: 'height',
                    relatedBy: '==',
                    constant: 200
                },

                'V:[box1]|',

            ]
        });

        var box1 = new RectangleView({
            model: color1,
        });

        box0.name = 'box0';
        box1.name = 'box1';

        box0.box1 = box1;
        box0.addSubview(box1);

        region.show(box0);

        box0.onShow = function(){

            expect(box0._autolayout.left.value).toBe(0);
            expect(box0._autolayout.right.value).toBe(0);
            expect(box0._autolayout.width.value).toBe(1000);
            expect(box0._autolayout.height.value).toBe(800);

            expect(box1._autolayout.left.value).toBe(20);
            expect(box1._autolayout.right.value).toBe(0);
            expect(box1._autolayout.width.value).toBe(980);
            expect(box1._autolayout.height.value).toBe(200);
            expect(box1._autolayout.top.value).toBe(600);
            expect(box1._autolayout.bottom.value).toBe(0);
            done();
        };

    });


    //
    // // it('converts crazy to JSON', function(){
    //     var vfl = '';
    //     var json = VFLToJSON(vfl);

    //     // var output = ;

    //     // console.log(vfl)
    //     console.log(JSON.stringify(json, null, '\t'));
    //     // expect(JSON.stringify(json)).toEqual(JSON.stringify(output));
    // });

}); // eof describe
}); // eof define
