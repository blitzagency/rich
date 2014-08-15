define(function(require, exports, module) {

// Imports

var _ = require('underscore');
var $ = require('jquery');
var Rectangle = require('app/shared/models/rectangle').Rectangle;
var RectangleView = require('app/shared/views/rectangle-view').RectangleView;
var colors = require('tests/utils/colors').blue;
var utils = require('rich/autolayout/utils');
var constraintWithJSON = require('rich/autolayout/constraints').constraintWithJSON;


describe('Auto Layout + Utils:', function() {

    it('serializes JSON constraint with strings for item/toItem', function(){

        var color0 = new Rectangle({
            color: colors[0]
        });

        var color1 = new Rectangle({
            color: colors[1]
        });

        var view0 = new RectangleView({
            model: color0
        });

        var view1 = new RectangleView({
            model: color1
        });

        view0.view1 = view1;
        view0.addSubview(view1);

        var json = {
            item: 'view1',
            attribute: 'left',
            relatedBy: '==',
            toItem: 'superview',
            toAttribute: 'left',
            constant: 20,
            multiplier: 2
        };

        var data = utils.serializeConstraintJSON(json, view0);

        // view#:left:==:view#:left:20:1
        expect(data).toBe(view1.cid + ':left:==:' + view0.cid + ':left:20:2');
    });

    it('serializes JSON constraint with objects for item/toItem', function(){

        var color0 = new Rectangle({
            color: colors[0]
        });

        var color1 = new Rectangle({
            color: colors[1]
        });

        var view0 = new RectangleView({
            model: color0
        });

        var view1 = new RectangleView({
            model: color1
        });

        view0.view1 = view1;
        view0.addSubview(view1);

        var json = {
            item: view1,
            attribute: 'left',
            relatedBy: '==',
            toItem: view0,
            toAttribute: 'left',
            constant: 20,
            multiplier: 2
        };

        var data = utils.serializeConstraintJSON(json, view0);

        // view#:left:==:view#:left:20:1
        expect(data).toBe(view1.cid + ':left:==:' + view0.cid + ':left:20:2');
    });

    it('serializes JSON constraint with no toItem/toAttribute', function(){

        var color0 = new Rectangle({
            color: colors[0]
        });

        var color1 = new Rectangle({
            color: colors[1]
        });

        var view0 = new RectangleView({
            model: color0
        });

        var view1 = new RectangleView({
            model: color1
        });

        view0.view1 = view1;
        view0.addSubview(view1);

        var json = {
            item: view1,
            attribute: 'width',
            relatedBy: '==',
            constant: 100
        };

        var data = utils.serializeConstraintJSON(json, view0);

        expect(data).toBe(view1.cid + ':width:==:::100:1');
    });

    it('serializes JSON constraint with default constant', function(){

        var color0 = new Rectangle({
            color: colors[0]
        });

        var color1 = new Rectangle({
            color: colors[1]
        });

        var view0 = new RectangleView({
            model: color0
        });

        var view1 = new RectangleView({
            model: color1
        });

        view0.view1 = view1;
        view0.addSubview(view1);

        var json = {
            item: view1,
            attribute: 'left',
            relatedBy: '==',
            toItem: view0,
            toAttribute: 'left', // no constant
            multiplier: 2
        };

        var data = utils.serializeConstraintJSON(json, view0);

        expect(data).toBe(view1.cid + ':left:==:' + view0.cid + ':left:0:2');
    });

    it('serializes JSON constraint with default multiplier', function(){

        var color0 = new Rectangle({
            color: colors[0]
        });

        var color1 = new Rectangle({
            color: colors[1]
        });

        var view0 = new RectangleView({
            model: color0
        });

        var view1 = new RectangleView({
            model: color1
        });

        view0.view1 = view1;
        view0.addSubview(view1);

        var json = { // no multiplier
            item: view1,
            attribute: 'left',
            relatedBy: '==',
            toItem: view0,
            toAttribute: 'left',
            constant: 20
        };

        var data = utils.serializeConstraintJSON(json, view0);

        expect(data).toBe(view1.cid + ':left:==:' + view0.cid + ':left:20:1');
    });

    it('hashes JSON constraints', function(){

        var color0 = new Rectangle({
            color: colors[0]
        });

        var color1 = new Rectangle({
            color: colors[1]
        });

        var view0 = new RectangleView({
            model: color0
        });

        var view1 = new RectangleView({
            model: color1
        });

        view0.view1 = view1;
        view0.addSubview(view1);

        var c1 = constraintWithJSON({
                item: view1,
                attribute: 'width',
                relatedBy: '==',
                constant: 100
            });

        var c2 = constraintWithJSON({
            // no multiplier
            item: view1,
            attribute: 'left',
            relatedBy: '==',
            toItem: view0,
            toAttribute: 'left',
            constant: 20
        });

        var data = utils.hashConstraints([c1, c2], view0);

        //'view#:left:==:view#:left:20:1|view#:width:==:::100:1'
        var result = view1.cid + ':left:==:' +
                     view0.cid + ':left:20:1|' +
                     view1.cid + ':width:==:::100:1';
        expect(data).toBe(result);
    });

}); // eof describe
}); // eof define
