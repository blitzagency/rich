define(function(require, exports, module) {

var marionette = require('marionette');
var PhysicsEngine = require('famous/physics/PhysicsEngine');


var SimpleDriver = marionette.Controller.extend({
    scrollDamp: 0.4,
    mobileScrollDamp: 1,
    initialize: function(scrollView) {
        this.scrollView = scrollView;

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

    },
});

exports.SimpleDriver = SimpleDriver;

});
