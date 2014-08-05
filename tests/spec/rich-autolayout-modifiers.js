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



describe('Auto Layout:', function() {
    var region;
    var $el;

    beforeEach(function() {
        loadFixtures('famous.html');

        region = new rich.Region({
            el: '#famous-context'
        });

        $el = region.el;
        expect($el.length).toBe(1);
    });

    afterEach(function() {
        region.reset();
        region = null;
    });


    it('generates layout modifiers', function(done){
        var model = new Rectangle();

        var view = new RectangleView({
            model: model,
        });
        view.navigation = new RectangleView({
            model:model,
            size: [100, 200]
        });
        view.addSubview(view.navigation);
        region.show(view);

        view.onShow = function(){
            expect(view.navigation.getSize()).toEqual([100, 200]);
            done();
        };

        // constraints: [
        //         {
        //             item: 'navigation',
        //             attribute: 'width',
        //             relatedBy: '==', // '=|>=|<='
        //             toItem: 'superview', //'null is superview'
        //             toAttribute: 'width',
        //             multiplier: 0.5,
        //             constant: 0
        //         },
        //         {
        //             item: 'navigation',
        //             attribute: 'height',
        //             relatedBy: '==', // '=|>=|<='
        //             toItem: 'superview', //'null is superview'
        //             toAttribute: 'height',
        //             multiplier: 0.5,
        //             constant: 0
        //         }
        //     ]
    });


}); // eof describe
}); // eof define
