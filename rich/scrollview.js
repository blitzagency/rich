define(function (require, exports, module) {
    var rich = require('rich');
    var FamousScrollview = require('famous/views/Scrollview');
    var RenderNode = require('famous/core/RenderNode');

    var Scrollview = rich.View.extend({

        constructor: function(options){
            // this.setNeedsDisplay(true);
            options || (options = {});

            rich.View.prototype.constructor.apply(this, arguments);

            // this.addSubview(this._scrollableView);
        },

        createRenderNode: function(){
            this._scrollableView = new FamousScrollview();
            var root = new RenderNode();
            var relative = root;
            var context = this.context;

            relative = this.applyModifiers([this._autolayoutModifier], root);
            if(this.modifier){
                var modifiers = _.result(this, 'modifier');
                relative = this.applyModifiers(modifiers, relative);

                this._modifier = modifiers;
            }

            var views = [];

            this.children.each(function(view){
                var needsTrigger = false;
                if(!view.context){
                     needsTrigger = true;
                }
                view.context = context;

                if(needsTrigger){
                    view.triggerMethod('context');
                }
                views.push(view);
                // relative.add(view);
            }, this);

            this._scrollableView.sequenceFrom(views);

            if(this._scrollableView){
                relative = relative.add(this._scrollableView);
            }

            if(!this.renderable && this.getTemplate()){
                this.renderable = this.initializeRenderable();
            }

            if(this.renderable){
                relative.add(this.renderable);
            }



            return root;
        },


    });

    exports.Scrollview  = Scrollview;
});
