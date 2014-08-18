define(function (require, exports, module) {
    var _ = require('underscore');
    var marionette = require('marionette');
    var View = require('rich/view').FamousView;
    var Engine = require('famous/core/Engine');
    var utils = require('rich/utils');

    _.extend(marionette.Application.prototype, {

        addContentViews: function(obj){
            _.each(obj, function(options, key){
                this[key] = utils.initializeRootView(options);
            }, this);
        }
    });
});
