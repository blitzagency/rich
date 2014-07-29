define(function (require, exports, module) {
    var _ = require('underscore');
    var Easing = require('famous/transitions/Easing');
    var RenderNode = require('famous/core/RenderNode');
    var StateModifier = require('famous/modifiers/StateModifier');
    var Transform = require('famous/core/Transform');
    var FamousView = require('../view').FamousView;

    var NavigationController = FamousView.extend({
        topView: null,
        nestedSubviews: true,
        name: 'NavigationController',

        transitionDuration: 200,
        _transitionNodes: null,
        _isPop: false,
        _isPush: false,
        _sequence: null,
        _index: -1,
        _views: null,


        constructor: function(options){
            FamousView.prototype.constructor.apply(this, arguments);

            var size = this.getSize();
            this._views = [];
        },

        pushView: function(view){
            this._isPush = true;

            this.topView = view;
            this._views.push(view);

            if(this.root){
                this.invalidate();
            }
        },

        popView: function(){
            if(this._views.length > 1){
                this._isPop = true;

                if(this.root){
                    this.invalidate();
                }
            }
        },

        onElement: function(){
           this.$el.css({
               overflow:'hidden'
           });
        },

        createRenderNode: function(){
            var root = new RenderNode();
            var relative = root;
            var context = this.context;

            if(this.modifier){
                var modifiers = _.result(this, 'modifier');
                relative = this.applyModifiers(modifiers, root);

                this._modifier = modifiers;
            }

            if(this.nestedSubviews){
                if(!this.container){
                    this.container = this.createNestedNode(this.context);
                }

                relative.add(this.container);
                context = this.container.context;
                relative = this.container;
            }

            var container = this.container;

            if(this._isPush || this._isPop){

                if(this._transitionNodes === null){
                    this._transitionNodes = this.createTransitionNodes();
                    this._transitionNodes.complete.then(this.transitionsComplete.bind(this));

                    container.add(this._transitionNodes.currentView);
                    container.add(this._transitionNodes.nextView);
                }

            } else if(this.topView) {

                this.resetNestedNode(this.container);
                var transforms = this.getPushTransforms();

                for(var i = 0; i < this._views.length - 1; i++){
                    var node = new RenderNode();

                    var modifier = new StateModifier({
                        transform: transforms.transitionOutEnd
                    });

                    node.add(modifier).add(this._views[i]);
                    container.add(node);
                }

                container.add(this.topView);
            }

            return root;
        },

        transitionsComplete: function(){
            this._transitionNodes = null;

            if(this._isPop){
                var view = this._views.pop();
                this.topView = this._views[this._views.length - 1];
                view.destroy();
            }

            this._isPush = false;
            this._isPop = false;

            this.invalidate();
        },

        _getViews: function(){
            var nextView = null;
            var currentView = null;
            var currentViewIndex = this._views.length - 2;
            var result = {nextView: null, currentView: null};

            if(this._isPush){
                nextView = this.topView;

                if(currentViewIndex >= 0){
                    currentView = this._views[currentViewIndex];
                }

                result.nextView = nextView;
                result.currentView = currentView;
            }

            else if(this._isPop){

                currentView = this.topView;

                if(currentViewIndex >= 0){
                    nextView = this._views[currentViewIndex];
                }

                result.nextView = nextView;
                result.currentView = currentView;
            }

            else {
                result.currentView = this.topView;
            }

            return result;

        },

        getPushTransforms: function(){
            var width = this.getSize()[0];

            return {
                transitionInStart: Transform.translate(width, 0, 0),
                transitionInEnd: Transform.identity,
                transitionOutStart: Transform.identity,
                transitionOutEnd: Transform.translate(-1 * width, 0, 0),
            };
        },

        getPopTransforms: function(){
            var width = this.getSize()[0];

            return {
                transitionInStart: Transform.translate(-1 * width, 0, 0),
                transitionInEnd: Transform.identity,
                transitionOutStart: Transform.identity,
                transitionOutEnd: Transform.translate(width, 0, 0),
            };
        },

        createTransitionNodes: function(){
            var duration = this.transitionDuration;
            var views = this._getViews();
            var transitionIn = null;
            var transitionOut = null;
            var nodeIn = null;
            var nodeOut = null;

            var transforms = this._isPush ? this.getPushTransforms() : this.getPopTransforms();

            var requireModifier = false;
            var animationHandler = this._prepareModification(duration, requireModifier);

            if(views.currentView){
                transitionOut = new StateModifier({
                    transform: transforms.transitionOutStart
                });

                transitionOut.setTransform(
                    transforms.transitionOutEnd,
                    {duration: duration, curve: Easing.outQuad}
                );

                views.nextView.context = this.container.context;

                nodeOut = new RenderNode();
                nodeOut.add(transitionOut).add(views.currentView);
            }

            transitionIn = new StateModifier({
                transform: transforms.transitionInStart
            });

            transitionIn.setTransform(
                transforms.transitionInEnd,
                {duration: duration, curve: Easing.outQuad},
                animationHandler.callback
            );

            views.nextView.context = this.container.context;

            nodeIn = new RenderNode();
            nodeIn.add(transitionIn).add(views.nextView);

            return {
                currentView: nodeOut,
                nextView: nodeIn,
                complete: animationHandler.deferred
            };
        }
    });

    exports.NavigationController = NavigationController;
});
