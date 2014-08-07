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


    it('generates layout modifiers', function(done){
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


}); // eof describe
}); // eof define
