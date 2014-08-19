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

jasmine.DEFAULT_TIMEOUT_INTERVAL = 30000;

describe('Auto Layout:', function() {
    var root;
    var region;
    var context;
    var $el;

    beforeEach(function() {
        loadFixtures('famous-full.html');

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

    // xit('sets explicit size on subview', function(done){
    //     var model = new Rectangle();

    //     var view = new RectangleView({
    //         model: model,
    //         constraints: [
    //             {
    //                 item: 'navigation',
    //                 attribute: 'width',
    //                 relatedBy: '==',
    //                 constant: 300,
    //             },

    //             {
    //                 item: 'navigation',
    //                 attribute: 'height',
    //                 relatedBy: '==',
    //                 constant: 100,
    //             }
    //         ]
    //     });

    //     // region.constraints = function(){
    //     //     return [
    //     //         'H:|[currentView]|',
    //     //         'V:|[currentView]|',
    //     //     ];
    //     // };

    //     view.navigation = new RectangleView({
    //         model: model,
    //        // size: [100, 200]
    //     });

    //     region.name = 'regionView';
    //     view.name = 'rectangleView';
    //     view.navigation.name = 'navigation';

    //     view.addSubview(view.navigation);
    //     region.show(view);

    //     view.onShow = function(){
    //         //expect(view.navigation.getSize()).toEqual([300, 200]);
    //         console.log(view.navigation.getSize());
    //         //done();
    //     };
    // });

    it('works', function(done){

        var view = RectangleView.extend({
            size: [100, 50]
        });

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
            childView: view,
            spacing: 1,
        });

        region.name = 'region';
        collectionView.name = 'collectionView';


        region.constraints = function(){
            return [
                'H:|[currentView]|',
                'V:|[currentView]|',
            ];
        };

        region.show(collectionView);

        collectionView.onShow = function(){
            //console.log(region.getSize());
            //console.log(collectionView.getSize());
            done();
        };


        // done();

    });


}); // eof describe
}); // eof define
