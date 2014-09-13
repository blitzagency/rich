define(function (require, exports, module) {
    var _ = require('underscore');
    var rich = require('rich');
    var Easing = require('famous/transitions/Easing');
    var constraintWithJSON = require('rich/autolayout/constraints').constraintWithJSON;
    var utils = require('rich/utils');


    var NavigationController = rich.View.extend({
        topView: null,
        transitionDuration: 230,
        _views: null,

        constructor: function(options){
            options || (options = {});

            rich.View.prototype.constructor.apply(this, arguments);
            this._views = [];

            if(options.view){
                var view = options.view;
                var constraints = this.preparePushConstraints(view);

                this.prepareSubviewAdd(view);
                this.preparePushView(view);
                this.addConstraints(constraints);
            }
        },

        pushView: function(view){
            var wantsOut = false;
            var inConstraint = this.preparePushInConstraint(view);

            if(this.topView){
                var index = this._views.length - 1;
                wantsOut = {
                    view: this._views[index].view,
                    index: index
                };
            }

            var constraints = [].concat(
                this.preparePushConstraints(view),
                inConstraint
            );

            this.preparePushView(view);
            this.prepareSubviewAdd(view);

            this.addConstraints(constraints);

            utils.defer(function(){
                this.removeConstraint(inConstraint);

                if(wantsOut){

                    var outConstraint = this.preparePushOutConstraint(wantsOut.view);
                    var tmp = this._views[wantsOut.index];
                    tmp.positionConstraint = outConstraint;
                    this.addConstraint(outConstraint);
                }
            }.bind(this));
        },

        popView: function(){
            if(this._views.length > 1){
                var views = this._views;
                var previousIndex = views.length - 2;

                var outConstraint = this.preparePopOutConstraint(this.topView);

                this.listenToOnce(this.topView, 'autolayoutTransition:complete', function(view, prop){
                    view.navigationController = null;
                    this.prepareSubviewRemove(view);
                    this.topView = views[previousIndex].view;
                    this.invalidateView();
                    views.pop();

                }.bind(this));

                this.addConstraint(outConstraint);
                this.removeConstraint(views[previousIndex].positionConstraint);
            }
        },

        preparePushView: function(view){
            this.topView = view;

            view.navigationController = this;

            var autolayoutTransition = {
                duration: this.transitionDuration,
                curve: Easing.outQuad
            };

            view.getAutolayoutTransitionForProperty = function(property){
                if(property == 'left' || property == 'right'){
                    return autolayoutTransition;
                }

                return null;
            };

            this._views.push({
                view: view,
                positionConstraint: null
            });
        },

        preparePushInConstraint: function(view){
            return constraintWithJSON({
                item: view,
                attribute: 'left',
                relatedBy: '==',
                toItem: this,
                toAttribute: 'width',
                constant: 0
            });
        },

        preparePushOutConstraint: function(view){
            return constraintWithJSON({
                item: view,
                attribute: 'right',
                relatedBy: '==',
                toItem: this,
                toAttribute: 'width',
                constant: 0
            });
        },

        preparePushConstraints: function(view){
            var c1 = constraintWithJSON({
                item: view,
                attribute: 'width',
                relatedBy: '==',
                toItem: this,
                toAttribute: 'width',
                constant: 0
            });

            var c2 = constraintWithJSON({
                item: view,
                attribute: 'height',
                relatedBy: '==',
                toItem: this,
                toAttribute: 'height',
                constant: 0
            });

            return [c1, c2];
        },

        preparePopOutConstraint: function(view){
            return constraintWithJSON({
                item: view,
                attribute: 'left',
                relatedBy: '==',
                toItem: this,
                toAttribute: 'width',
                constant: 0
            });
        },

    });

    exports.NavigationController = NavigationController;
});
