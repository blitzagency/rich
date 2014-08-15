define(function(require, exports, module) {

var marionette = require('marionette');
var PhysicsEngine = require('famous/physics/PhysicsEngine');


var SimpleDriver = marionette.Controller.extend({

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

    // no op...we already told it to stop if you hit limits
    updateLimits: function(isPastLimits, springAnchor){

    },
});

exports.SimpleDriver = SimpleDriver;

});
