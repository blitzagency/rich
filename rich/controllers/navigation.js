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

                setTimeout(function(){
                    console.log(this.getSize());
                    this.addConstraints(constraints);
                }.bind(this), 1000);
                // utils.defer(function(){


                // });
            }
        },

        _initializeConstraints: function(){
            //debugger;
            rich.View.prototype._initializeConstraints.apply(this, arguments);
        },

        pushView: function(view){
            var outConstraint;
            var inConstraint = this.preparePushInConstraint(view);

            if(this.topView){
                outConstraint = this.preparePushOutConstraint(this.topView);

                var index = this._views.length - 1;
                var tmp = this._views[index];

                tmp.positionConstraint = outConstraint;
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

                if(outConstraint){
                    this.addConstraint(outConstraint);
                }

            }.bind(this));
        },

        popView: function(){
            if(this._views.length > 1){
                var views = this._views;
                var previousIndex = views.length - 2;

                var outConstraint = this.preparePopOutConstraint(this.topView);

                this.listenTo(this.topView, 'autolayoutTransition:complete', function(view, prop){
                    view.navigationController = null;
                    view.destroy();

                    this.prepareSubviewRemove(view);
                    this.topView = views[previousIndex];
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
            view.autolayoutTransition = {
                duration: this.transitionDuration,
                curve: Easing.outQuad
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
