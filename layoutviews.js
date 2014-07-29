define(function (require, exports, module) {
    var _ = require('underscore');
    var RenderNode = require('famous/core/RenderNode');
    var marionette = require('marionette');
    var FamousItemView = require('./itemview').FamousItemView;
    var View = require('./view').FamousView;
    var events = require('./events');

    var obj = {};
    _.extend(obj, marionette.LayoutView.prototype, FamousItemView.prototype);

    var FamousLayoutView = FamousItemView.extend(obj);

    FamousLayoutView = FamousLayoutView.extend({
        constructor: function(options){
            options = options || {};
            this._firstRender = true;

            this.__init__ = function(){

                _.each(this.regions, function(each, key){
                    if(_.isFunction(each)){
                        this.regions[key] = each.extend({
                            superview: this
                        });
                    }
                }, this);

                FamousItemView.prototype.constructor.call(this, options);
                this._initializeRegions();

                _.each(this.getRegions(), function(region){
                    this.listenTo(region, events.INVALIDATE, this.regionDidChange);
                }, this);

            }.bind(this);
        },

        regionDidChange: function(region){
            // there is a better way to do this
            // only the region changed, but we are going
            // to invalidate the whole view.
            //
            // TODO: just replace the section of the _spec
            // with the new region spec
            this.invalidate();
        },

        createRenderNode: function(){
            var root = FamousItemView.prototype.createRenderNode.apply(this);
            var relative = root;

            if(this.nestedSubviews){
                relative = this.container;
            }

            _.each(this.getRegions(), function(region){
                var node = new RenderNode(region);
                relative.add(node);
            }, this);

            return root;
        },

        destroy: function(){
            marionette.LayoutView.prototype.destroy.call(this);
            View.prototype.destroy.call(this);
        }
    });

    exports.FamousLayoutView = FamousLayoutView;
});
