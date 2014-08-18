define(function (require, exports, module) {
    var application = require('./application');
    var view = require('./view');
    var itemview = require('./itemview');
    var layouts = require('./layoutviews');
    var collectionview = require('./collections-views');
    var collectionlayout = require('./collections-layouts');
    var utils = require('./utils');
    var regions = require('./region');

    // var views = {
    //     View: view.FamousView,

    //     layouts: {
    //         LayoutView: layouts.FamousLayoutView
    //     },

    //     items: {
    //         ItemView: itemview.FamousItemView
    //     },

    //     collections: {
    //         CollectionView: collectionview.FamousCollectionView,
    //         horizontalLayout: collectionlayout.horizontalLayout,
    //         verticalLayout: collectionlayout.verticalLayout
    //     }
    // };

    // shortcuts
    exports.View = view.FamousView;
    exports.ItemView = itemview.FamousItemView;
    exports.LayoutView = layouts.FamousLayoutView;
    exports.CollectionView = collectionview.FamousCollectionView;
    exports.Region = regions.Region;
    exports.regionClassWithConfig = regions.regionClassWithConfig;

    // fully qualified
    exports.utils = utils;
    //exports.views  = views;
});
