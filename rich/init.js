define(function (require, exports, module) {
    var itemview = require('./itemview');
    var view = require('./view');
    var layouts = require('./layoutviews');
    var collectionview = require('./collections-views');
    var collectionlayout = require('./collections-layouts');
    var utils = require('./utils');
    var regions = require('./region');

    var views = {
        View: view.FamousView,

        layouts: {
            LayoutView: layouts.FamousLayoutView
        },

        items: {
            ItemView: itemview.FamousItemView
        },

        collections: {
            CollectionView: collectionview.FamousCollectionView,
            horizontalLayout: collectionlayout.horizontalLayout,
            verticalLayout: collectionlayout.verticalLayout
        }
    };

    // shortcuts
    // BAR
    exports.View = view.FamousView;
    exports.ItemView = itemview.FamousItemView;
    exports.LayoutView = layouts.FamousLayoutView;
    exports.CollectionView = collectionview.FamousCollectionView;
    exports.Region = regions.FamousRegion;

    // fully qualified
    exports.utils = utils;
    exports.views  = views;
});
