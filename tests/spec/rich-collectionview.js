define(function(require, exports, module) {

// Imports

var $ = require('jquery');
var _ = require('underscore');
var backbone = require('backbone');
var rich = require('rich');
var utils = require('rich/utils');
var Rectangle = require('app/shared/models/rectangle').Rectangle;
var RectangleView = require('app/shared/views/rectangle-view').RectangleView;
var render = require('tests/utils/time').render;
var wait = require('tests/utils/time').wait;
var colors = require('tests/utils/colors').blue;



describe('Auto Layout:', function() {
    var root;
    var region;
    var context;
    var $el;

    beforeEach(function() {
        loadFixtures('famous.html');

        root = utils.initializeRichContext({
            el: '#famous-context'
        });

        region = new rich.Region();
        root.addSubview(region);

        $el = $(root.context.container);
        context = root.context;

        expect($el.length).toBe(1);
    });

    afterEach(function() {
        utils.disposeRichContext(root);
        region = null;
        root = null;
    });

    it('works', function(done){



        var color0 = new Rectangle({
            color: colors[7]
        });

        var color1 = new Rectangle({
            color: colors[6]
        });

        var color2 = new Rectangle({
            color: colors[5]
        });

        var color3 = new Rectangle({
            color: colors[4]
        });

        var collection = new backbone.Collection([
            color0, color1, color2, color3]);


        var collectionView = new rich.CollectionView({
            collection: collection,
            orientation: 'vertical',
            childView: RectangleView,
        });

        region.constraints = function(){
            // return [
            //     {
            //         item: collectionView,
            //         attribute: 'width',
            //         relatedBy: '==',
            //         constant: 200
            //     },

            //     {
            //         item: collectionView,
            //         attribute: 'height',
            //         relatedBy: '==',
            //         constant: 200
            //     }
            // ];
        };

        region.show(collectionView);

        collectionView.onShow = function(){
            console.log(region.getSize());
            console.log(collectionView.getSize());
        };


        // done();

    });


}); // eof describe
}); // eof define
