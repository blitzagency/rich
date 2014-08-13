define(function(require, exports, module) {

// Imports

var $ = require('jquery');
var rich = require('rich');
var Engine = require('famous/core/Engine');
var Modifier = require('famous/core/Modifier');
var Transform = require('famous/core/Transform');
var Rectangle = require('app/shared/models/rectangle').Rectangle;
var RectangleView = require('app/shared/views/rectangle-view').RectangleView;
var VFLToJSON = require('rich/autolayout/utils').VFLToJSON;

describe('Visual Format Language:', function() {

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
