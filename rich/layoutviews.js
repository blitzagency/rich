define(function (require, exports, module) {
    var _ = require('underscore');
    var RenderNode = require('famous/core/RenderNode');
    var Modifier = require('famous/core/Modifier');
    var Transform = require('famous/core/Transform');
    var marionette = require('marionette');
    var FamousItemView = require('./itemview').FamousItemView;
    var View = require('./view').FamousView;
    var events = require('./events');
    var throwError = require('./helpers').throwError;

    var obj = {};
    _.extend(obj, marionette.LayoutView.prototype, FamousItemView.prototype);

    var FamousLayoutView = FamousItemView.extend(obj);

    FamousLayoutView = FamousLayoutView.extend({
        constructor: function(options){
            options = options || {};
            this._firstRender = true;

            this.__init__ = function(context){
                _.each(this.regions, function(each, key){
                    if(_.isFunction(each)){
                        this.regions[key] = each.extend({
                            superview: this,
                            context: context
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
            this.invalidateView();
        },

        createRenderNode: function(){
            var root = FamousItemView.prototype.createRenderNode.apply(this);
            var relative = root;

            if(this.nestedSubviews){
                relative = this.container;
            }

            if(this.constraints && !this._constraints){
                this._buildConstraints();
            }
            _.each(this.getRegions(), function(region, name){

                var node = new RenderNode(region);

                if(this._constraints){
                    var constraint = this._constraints[name];
                    relative.add(constraint).add(node);
                }else{
                    relative.add(node);
                }

            }, this);

            return root;
        },

        invalidateLayout: function(){
            FamousItemView.prototype.invalidateLayout.call(this);

            _.each(this.getRegions(), function(region){
                region.invalidateLayout();
            }, this);
        },

        _newModifier: function(){
            return {
                transform: [0, 0, 0],
                origin: [0, 0],
                size: [undefined, undefined],
                opacity: [1]
            }
        },

        _buildConstraints: function(){
            this._constraints = {};
            _.each(this.constraints, function(constraint){
                this._constraints[constraint.target] = this._constraints[constraint.target] || this._newModifier();

                var modifierObj = this._constraints[constraint.target];
                this._buildModifierForConstraint(modifierObj, constraint);
            }, this);
        },

        _buildModifierForConstraint: function(modifierObj, constraint){
            // target: 'demo',
            // attribute: 'width',
            // to: 'superview',
            // toAttribute: 'width',
            // value: '50%'


            var toStr = constraint['to'];
            var to = this[toStr];
            var toSize = to.getSize();
            var toAttribute = constraint['toAttribute'];
            var toIsSize = toAttribute == 'width' || toAttribute == 'height';

            var target = this[constraint['target']];
            var attribute = constraint['attribute'];
            var destIsSize = attribute == 'width' || attribute == 'height';


            var toValue;
            // console.log(destIsSize)
            var value = constraint['value'];
            var unit = value.indexOf('%') > -1 ? '%' : 'px';
            value = value.replace('%', '').replace('px', '');


            // kick for back constraints
            if(unit == 'px' && toIsSize){
                throwError('Bad Constraint Combination');
            }




            // width and height logic
            if(toAttribute == 'width'){
                toValue = toSize[0];
            }
            if(toAttribute == 'height'){
                toValue = toSize[1];
            }

            if(toIsSize && unit == '%'){
                toValue = toValue * value * .01;
            }

            if(toAttribute == 'top'){
                if(toStr == 'superview'){
                    toValue = 0;
                }
            }
            if(toAttribute == 'right'){

            }
            if(toAttribute == 'bottom'){

            }
            if(toAttribute == 'left'){
                if(toStr == 'superview'){
                    toValue = 0;
                }
            }

            // {
            //     transform: [],
            //     origin: [],
            //     size: [],
            //     opacity: []
            // }
            // set value on modifier
            if(attribute == 'width'){
                // DINO YOU ARE WORKING HERE!
                modifierObj['size'][0] = toValue;
            }

            // console.log(toValue)
        },

        destroy: function(){
            marionette.LayoutView.prototype.destroy.call(this);
            View.prototype.destroy.call(this);
        }
    });

    exports.FamousLayoutView = FamousLayoutView;
});
