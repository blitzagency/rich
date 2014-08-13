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

describe('View + Constraints:', function() {

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


    it('updates layout after adding constraint', function(done){
        var color0 = new Rectangle({
            color: colors[0]
        });

        var color1 = new Rectangle({
            color: colors[1]
        });

        var box0 = new RectangleView({
            model: color0,
            constraints: []
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
            expect(box1._autolayout.height.value).toBe(0);
            expect(box1._autolayout.top.value).toBe(800);
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
