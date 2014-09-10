define(function (require, exports, module) {
    var _ = require('underscore');
    var Easing = require('famous/transitions/Easing');
    var RenderNode = require('famous/core/RenderNode');
    var StateModifier = require('famous/modifiers/StateModifier');
    var Transform = require('famous/core/Transform');
    var View = require('../view').FamousView;
    var constraintsWithVFL = require('rich/autolayout/constraints').constraintsWithVFL;
    var constraintWithJSON = require('rich/autolayout/constraints').constraintWithJSON;
    var utils = require('rich/utils');

    var NavigationController = View.extend({
        topView: null,
        name: 'NavigationController',

        transitionDuration: 200,
        _transitionNodes: null,
        _isPop: false,
        _isPush: false,
        _sequence: null,
        _index: -1,
        _views: null,


        constructor: function(options){
            View.prototype.constructor.apply(this, arguments);

            this._views = [];
        },

        pushView: function(view){
            var outConstraint;
            var inConstraint;

            if(this.topView){

                outConstraint = constraintWithJSON({
                    item: this.topView,
                    attribute: 'right',
                    relatedBy: '==',
                    toItem: this,
                    toAttribute: 'width',
                    constant: 0
                });

                var index = this._views.length - 1;
                var tmp = this._views[index];

                tmp.positionConstraint = outConstraint;
            }

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
            });

            inConstraint = constraintWithJSON({
                item: view,
                attribute: 'left',
                relatedBy: '==',
                toItem: this,
                toAttribute: 'width',
                constant: 0
            });

            var constraints = [].concat(c1, c2, inConstraint);

            this._isPush = true;
            this.topView = view;

            view.autolayoutTransition = {
                duration: 1000,
                curve: Easing.outQuad
            };

            this._views.push({
                view: view,
                positionConstraint: null
            });

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

                var outConstraint = constraintWithJSON({
                    item: this.topView,
                    attribute: 'left',
                    relatedBy: '==',
                    toItem: this,
                    toAttribute: 'width',
                    constant: 0
                });

                this.listenTo(this.topView, 'autolayoutTransition:complete', function(view, prop){

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

    });

    exports.NavigationController = NavigationController;
});
