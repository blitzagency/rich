define(function(require, exports, module) {

var marionette = require('marionette');
var PhysicsEngine = require('famous/physics/PhysicsEngine');
var Spring = require('famous/physics/forces/Spring');
var Drag = require('famous/physics/forces/Drag');
var Engine = require('famous/core/Engine');

var SimpleDriver = marionette.Controller.extend({
    scrollDamp: 0.4,
    mobileScrollDamp: 1,
    strength: 0.005,
    mobileStrength:0.003,
    constructor: function(scrollView) {
        marionette.Controller.prototype.constructor.apply(this, arguments);
        this.scrollView = scrollView;
        this._spring = new Spring({
            period: 300,
            dampingRatio: 1
        });

        this._friction = new Drag({
            forceFunction: Drag.FORCE_FUNCTIONS.LINEAR,
        });

        this._drag = new Drag({
            forceFunction: Drag.FORCE_FUNCTIONS.QUADRATIC,
        });

        // you must add a particle to a phyisics engine to have it work
        // correctly
        this._physicsEngine = new PhysicsEngine();
        this._physicsEngine.addBody(this.scrollView._particle);
    },

    shouldLimitPastBounds: function(){
        return true;
    },

    dampenDelta: function(delta, type){
        var damp;
        if(type == 'touchmove'){
            damp = this.mobileScrollDamp;
        }else{
            damp = this.scrollDamp;
        }
        delta[0] = delta[0] * damp;
        delta[1] = delta[1] * damp;
        return delta;
    },

    // no op...we already told it to stop if you hit limits
    updateParticle: function(isPastLimits, springAnchor){
        if(this._throwMod){
            this._throwMod.callback();
        }
    },

    wantsThrow: function(velocity){
        var type = this.scrollView._scrollType;


        // we only want to add velocity if you're touch or click
        if(type == 'wheel' || type == 'mouseup')return;
        if(this._throwMod){
            this._throwMod.callback();
        }

        // remove all previous physics
        this._physicsEngine.detachAll();
        this.scrollView._particle.setVelocity(0);

        var strength = type == 'touchend' ? this.mobileStrength : this.strength;

        this._friction.setOptions({
            strength: strength
        });

        this._drag.setOptions({
            strength: strength
        });

        this.scrollView.unbindParticle();
        this._throwMod = this._prepareThrowModification();

        this._throwMod.deferred.then(function(){
            this.scrollView.bindParticle();
        }.bind(this));

        velocity = this.scrollView._normalizeVector(velocity);
        this._physicsEngine.attach([this._drag, this._friction], this.scrollView._particle);
        this.scrollView._particle.setVelocity([0, -10]);

    },

    _updateScrollviewVariables: function(){
        var delta = [];
        var pos = this.scrollView._particle.getPosition();
        delta[0] = this.scrollView._positionX.get() - pos[0];
        delta[1] = this.scrollView._positionY.get() - pos[1];
        var boundsInfo = this.scrollView.getBoundsInfo(delta);
        if(!boundsInfo.isPastLimits){
            this.scrollView._positionX.set(pos[0]);
            this.scrollView._positionY.set(pos[1]);
        }
        return delta;
    },

    _prepareThrowModification: function() {
        var deferred = $.Deferred();

        var tick = function() {
            var delta = this._updateScrollviewVariables();
            var boundsInfo = this.scrollView.getBoundsInfo(delta);

            if(boundsInfo.isPastLimits && !this._thrownPastLimits){
                this._physicsEngine.detachAll();
                this.scrollView._particle.setVelocity(0);
                this.scrollView.setScrollPosition(boundsInfo.anchorPoint[0], boundsInfo.anchorPoint[1]);
                callback();
                this._thrownPastLimits = true;
            }

            this.scrollView._scrollableView.invalidateView();
            this.scrollView.triggerScrollUpdate();
            var v = this.scrollView._particle.getVelocity();
            if(Math.abs(v[0]) < 0.001 && Math.abs(v[1]) < 0.001){
                callback();
            }
        }.bind(this);

        var callback = function() {
            Engine.removeListener('prerender', tick);
            deferred.resolve(this);
            this._thrownPastLimits = false;
        }.bind(this);

        Engine.on('prerender', tick);

        return {
            deferred: deferred.promise(),
            callback: callback
        };
    },
});

exports.SimpleDriver = SimpleDriver;

});
