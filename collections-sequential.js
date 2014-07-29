define(function (require, exports, module) {

var RenderNode = require('famous/core/RenderNode');
var ContainerSurface = require('famous/surfaces/ContainerSurface');
var FamousView = require('./view').FamousView;
var layouts = require('./collections-layouts');


var SequentialView = FamousView.extend({

    constructor: function(options){
        options  || (options = {});

        this.layout = options.layout || this.layout;
        FamousView.prototype.constructor.apply(this, arguments);
    },

    createNestedNode: function(context){
        if(!this.container){
            this.container = new ContainerSurface(this.properties);

            if(!this.renderable){
                this._ensureElement(this.container, context);
            }

            if (this.className){
                this.container.addClass(_.result(this, 'className'));
            }
        }

        return this.container;
    },

    createRenderNode: function(){

        if(!this.modifierForViewAtIndex){
            throw new Error('SequentialView\'s must have '+
                            'modifierForIndex(view, index) set');
        }

        var root = new RenderNode();
        var relative = root;
        var context = this.context;

        if(this.modifier){
            relative = root.add(_.result(this, 'modifier'));
        }

        if(this.nestedSubviews){
            var container = this.createNestedNode(context);
            container.context._node = new RenderNode();

            relative.add(container);
            context = container.context;
            relative = container;
        }

        this.children.each(function(view, index){
            view.context = context;
            view.superview = this;

            var node = new RenderNode();
            var modifier = this.modifierForViewAtIndex(view, index);

            if(modifier){
                node.add(modifier).add(view);
            } else {
                node.add(view);
            }

            relative.add(node);

        }, this);

        return root;
    },

    addSubview: function(view){

        if(this.sizeForViewAtIndex){
            size = this.sizeForViewAtIndex(view, index);
            view.properties.size = size;
        }

        FamousView.prototype.addSubview.call(this, view);
    }
});

var VerticalSequentialView = SequentialView.extend({
    constructor: function(options){
        options || (options = {});

        this.modifierForViewAtIndex = layouts.verticalLayout({padding: options.padding});
        SequentialView.prototype.constructor.apply(this, arguments);
    }
});


var HorizontalSequentialView = SequentialView.extend({
    constructor: function(options){
        options || (options = {});

        this.modifierForViewAtIndex = layouts.horizontalLayout({padding: options.padding});
        SequentialView.prototype.constructor.apply(this, arguments);
    }
});


exports.SequentialView = SequentialView;
exports.VerticalSequentialView = VerticalSequentialView;
exports.HorizontalSequentialView = HorizontalSequentialView;

});
