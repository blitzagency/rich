define(function (require, exports, module) {
    var _ = require('underscore');
    var marionette = require('marionette');
    var utils = require('rich/utils');

    _.extend(marionette.Application.prototype, {

        addRichContexts: function(obj){
            _.each(obj, function(options, key){

                if(_.isString(options)){
                    options = {el: options};
                }

                this[key] = utils.initializeRichContext(options);
            }, this);
        }
    });
});
