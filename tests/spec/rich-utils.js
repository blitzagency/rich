define(function(require, exports, module) {

// Imports

var $ = require('jquery');
var rich = require('rich');
var Engine = require('famous/core/Engine');
var Modifier = require('famous/core/Modifier');
var Transform = require('famous/core/Transform');
var Rectangle = require('app/shared/models/rectangle').Rectangle;
var RectangleView = require('app/shared/views/rectangle-view').RectangleView;
var utils = require('rich/utils');

describe('Utils:', function() {

    it('initializes root view with tag', function(){

        var options = {
            el: 'body'
        };

        var view = utils.initializeRichContext(options);
        expect(view).not.toBe(undefined);

    });


    it('initializes root view with selector', function(){
        loadFixtures('famous.html');

        var options = {
            el: '#jasmine-fixtures'
        };

        var view = utils.initializeRichContext(options);
        expect(view).not.toBe(undefined);
    });



    it('modifierWithTransform with array', function(){

        var modifier = utils.modifierWithTransform({
            transform: [10, 10, 10]
        });

        expect(modifier).not.toBe(undefined);
        expect(modifier instanceof Modifier).toBe(true);

    });

    it('modifierWithTransform with func', function(){

        var modifier = utils.modifierWithTransform({
            transform: function(){return Transform.translate(10, 10, 10);}
        });

        expect(modifier).not.toBe(undefined);
        expect(modifier instanceof Modifier).toBe(true);

    });

    it('modifierWithSize', function(){

        var modifier = utils.modifierWithSize({
            size: [10, 10]
        });

        expect(modifier).not.toBe(undefined);
        expect(modifier instanceof Modifier).toBe(true);

    });

    it('modifierWithOpacity', function(){

        var modifier = utils.modifierWithOpacity({
            opacity: 1
        });

        expect(modifier).not.toBe(undefined);
        expect(modifier instanceof Modifier).toBe(true);

    });

    it('modifierWithOrigin', function(){

        var modifier = utils.modifierWithOrigin({
            origin: [0, 0]
        });

        expect(modifier).not.toBe(undefined);
        expect(modifier instanceof Modifier).toBe(true);

    });

    it('modifierWithAlign', function(){

        var modifier = utils.modifierWithAlign({
            align: 50
        });

        expect(modifier).not.toBe(undefined);
        expect(modifier instanceof Modifier).toBe(true);

    });

    it('postrenderOnce', function(done){
        var context = Engine.createContext();
        var handler = jasmine.createSpy('handler');

        utils.postrenderOnce(handler);

        setTimeout(function(){
            expect(handler.calls.count()).toBe(1);
            done();
        }, 500);
    });

    it('getViewSize', function(){
        var model = new Rectangle({
            size: [300, 500]
        });

        var view = new RectangleView({model: model});

        var size = utils.getViewSize(view);
        expect(size[0]).toBe(300);
        expect(size[1]).toBe(500);
    });

}); // eof describe
}); // eof define
