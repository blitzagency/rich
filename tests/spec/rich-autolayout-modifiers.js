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
        var model = new Rectangle({
            color: 'red'
        });

        var view = new rich.View({
            model: model,
            constraints: [
                {
                    item: 'navigation',
                    attribute: 'height',
                    relatedBy: '==', // '=|>=|<='
                    constant: 300
                },

                // {
                //     item: 'navigation',
                //     attribute: 'width',
                //     relatedBy: '==', // '=|>=|<='
                //     constant: 50,
                //     multiplier: 1
                // },
                {
                    item: 'navigation',
                    attribute: 'right',
                    relatedBy: '==', // '=|>=|<='
                    toItem:'superview',
                    toAttribute: 'width',
                    constant: 0,
                    multiplier: .5
                },
                {
                    item: 'navigation',
                    attribute: 'top',
                    relatedBy: '==', // '=|>=|<='
                    constant: 10,
                    multiplier: 1
                },
            ]
        });
        view.navigation = new RectangleView({
            model:model
        });
        view.addSubview(view.navigation);
        region.show(view);

        view.onShow = function(){
            // var size = rich.utils.getViewSize(view);
            // console.log(size)
            view.setSize([200, 200]);
            done();

        };

    });


}); // eof describe
}); // eof define
