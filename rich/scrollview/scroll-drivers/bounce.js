define(function(require, exports, module) {

var PhysicsEngine = require('famous/physics/PhysicsEngine');
var Particle = require('famous/physics/bodies/Particle');
var Spring = require('famous/physics/forces/Spring');
var Drag = require('famous/physics/forces/Drag');
var TouchSync = require('famous/inputs/TouchSync');
var ScrollSync = require('famous/inputs/ScrollSync');
var MouseSync = require('famous/inputs/MouseSync');
var events = require('../../events');
var SimpleDriver = require('./simple').SimpleDriver;
var GenericSync = require('famous/inputs/GenericSync');

var BounceDriver = SimpleDriver.extend({
    _hasSpring: false,
    initialize: function(scrollView) {
        this.scrollView = scrollView;
        this._spring = new Spring({
            period: 300,
            dampingRatio: 1
        });

        // for later...add friction and drag when scrolling (throw?)
        // this._friction = new Drag({
        //     forceFunction: Drag.FORCE_FUNCTIONS.LINEAR,
        //     strength: 0.0001
        // });

        // this._drag = new Drag({
        //     forceFunction: Drag.FORCE_FUNCTIONS.QUADRATIC,
        //     strength: 0.0001
        // });

        this._physicsEngine = new PhysicsEngine();
        this._physicsEngine.addBody(this.scrollView._particle);
    },

    shouldLimitPastBounds: function(){
        return false;
    },

    updateLimits: function(isPastLimits, anchorPoint) {
        var springOptions = {
            anchor: anchorPoint
        };

        if (isPastLimits) {
            this._spring.setOptions(springOptions);

            if (this._hasSpring) {
                // update spring
            } else {
                // add a spring
                this.scrollView.unbindParticle();
                this.scrollView._particle.setVelocity(0);
                this._physicsEngine.attach([this._spring], this.scrollView._particle);
                this._hasSpring = true;
                this.scrollView._scrollableView.setNeedsDisplay(true);
                this.scrollView._scrollableView.on(events.RENDER, this.scrollView.triggerScrollUpdate);
            }

            this.scrollView._positionX.set(anchorPoint[0]);
            this.scrollView._positionY.set(anchorPoint[1]);

        } else {
            if (this._hasSpring) {
                this._physicsEngine.detachAll();
                this.scrollView.bindParticle();
                this.scrollView._particle.setVelocity(0);
                this._hasSpring = false;
                this.scrollView._scrollableView.setNeedsDisplay(false);
                this.scrollView._scrollableView.off(events.RENDER, this.scrollView.triggerScrollUpdate);
            }
        }
    },
});

exports.BounceDriver = BounceDriver;

});
