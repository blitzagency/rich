define(function(require, exports, module) {
    var marionette = require('marionette');
    var Surface = require('famous/core/Surface');
    var FamousView = require('../view').FamousView;
    var GenericSync = require('famous/inputs/GenericSync');
    var Engine = require('famous/core/Engine');
    var Particle = require('famous/physics/bodies/Particle');
    var TouchSync = require('famous/inputs/TouchSync');
    var ScrollSync = require('famous/inputs/ScrollSync');
    var MouseSync = require('famous/inputs/MouseSync');
    var EventHandler = require('famous/core/EventHandler');
    var Transitionable = require("famous/transitions/Transitionable");
    var events = require('../events');
    var SimpleDriver = require('./scroll-drivers/simple').SimpleDriver;


    GenericSync.register({
        "touch": TouchSync,
        "scroll": ScrollSync,
        // "mouse": MouseSync
    });

    var DIRECTION_X = GenericSync.DIRECTION_X;
    var DIRECTION_Y = GenericSync.DIRECTION_Y;

    var ScrollView = FamousView.extend({
        renderable: null,
        nestedSubviews: true,
        _hasStalledCount: 0,
        _idleIncrement: 0,
        _directionalLockEnabled: true,
        _scrollEnabled: true,

        constructor: function(options) {
            options || (options = {});
            _.bindAll(this, '_onScrollUpdate', '_onScrollStart', '_onScrollEnd', 'triggerScrollUpdate');

            this._positionX = new Transitionable(0);
            this._positionY = new Transitionable(0);

            // physics
            this._particle = new Particle();


            // transitionables setup
            this.bindParticle();

            // scrollable wrapper
            this._scrollableView = new FamousView({
                modifier: this._particle
            });

            this.contentSize = options.contentSize || this.contentSize || [0, 0];

            FamousView.prototype.constructor.apply(this, arguments);
            this._scrollHandler = new EventHandler();

            // set up the scroll driver
            var ScrollDriver = options.scrollDriver || SimpleDriver;
            this._driver = new ScrollDriver(this);

            // options
            this.direction = options.direction;

            this.hidesOverflow = _.isUndefined(options.hidesOverflow) ? true : options.hidesOverflow;

            this.perspective = options.perspective || false;

            //Should be .on('context') TODO
            this.on('show', this.wantsSetPerspective);

            if (!_.isUndefined(options.directionalLockEnabled)) {
                this._directionalLockEnabled = options.directionalLockEnabled;
            }
            if (!_.isUndefined(options.scrollEnabled)) {
                this._scrollEnabled = options.scrollEnabled;
            }

            this.listenTo(this._scrollableView, events.RENDER, this._onFamousRender);
        },

        bindParticle: function(){
            var self = this;
            this._particle.positionFrom(function() {
                return [self._positionX.get(), self._positionY.get()];
            });
        },

        unbindParticle: function(){
            this._particle.positionFrom(null);
        },

        wantsSetPerspective: function() {
            if (this.perspective) {
                this.container.context.setPerspective(this.perspective);
            }
        },

        setDirectionalLockEnabled: function(val) {
            this._directionalLockEnabled = val;
        },

        getDirectionalLockEnabled: function() {
            return this._directionalLockEnabled;
        },

        setScrollEnabled: function(val) {
            this._scrollEnabled = val;
            if (!this.sync) return;
            if (this._scrollEnabled) {
                this.sync.on('start', this._onScrollStart);
                this.sync.on('update', this._onScrollUpdate);
                this.sync.on('end', this._onScrollEnd);
            } else {
                this.sync.removeListener('start', this._onScrollStart);
                this.sync.removeListener('update', this._onScrollUpdate);
                this.sync.removeListener('end', this._onScrollEnd);
            }
        },

        getScrollEnabled: function() {
            return this._scrollEnabled;
        },

        getContentSize: function() {
            return _.result(this, 'contentSize');
        },

        onContext: function() {
            // had to put this here to not get a backbone error...not sure why
            // it can't go in onRender but w/e
            FamousView.prototype.addSubview.apply(this, [this._scrollableView]);
        },

        onElement: function() {
            if (this.hidesOverflow) {
                this.$el.css({
                    overflow: 'hidden',
                    // border: '1px solid red',
                });
            }

            // we have to map the events into an event handler so it conforms
            // to how famous wants things, this listens to all these events and has
            // the event handler dispatch them out
            this._bindScrollEvents();

        },

        getScrollPosition: function() {
            return [this._positionX.get(), this._positionY.get()];
        },

        _cleanScrollPosition: function(x, y) {
            var contentSize = this.getContentSize();
            var containerSize = this.getSize();

            var xLimit = -Math.max(contentSize[0] - containerSize[0], 0);
            var yLimit = -Math.max(contentSize[1] - containerSize[1], 0);
            x = Math.max(x, xLimit);
            x = Math.min(x, 0);

            y = Math.max(y, yLimit);
            y = Math.min(y, 0);
            return [x, y];
        },

        setScrollPosition: function(x, y, transition, limit) {
            limit = _.isUndefined(limit) ? true : limit;
            if (limit) {
                var pos = this._cleanScrollPosition(x, y);
                xLimited = pos[0];
                yLimited = pos[1];
                x = xLimited;
                y = yLimited;
            }
            // don't let the scroll position be anything crazy

            if (transition) {
                var obj = this._prepareScrollModification(transition.duration);
                this._scrollAnimationCallback = obj.callback;
                this._positionY.set(y, transition, obj.callback);
                this._positionX.set(x, transition, obj.callback);
                return obj.deferred;
            } else {
                this._positionX.halt();
                this._positionY.halt();
                this._positionX.set(x, {
                    duration: 0
                });
                this._positionY.set(y, {
                    duration: 0
                });
                this._scrollableView.invalidateView();
            }
        },

        _prepareScrollModification: function(duration) {
            var deferred = $.Deferred();

            var self = this;

            var tick = function() {
                self.triggerScrollUpdate();
                self.invalidateView();
                self._scrollableView.invalidateView();
            };

            var callback = function() {
                Engine.removeListener('postrender', tick);
                deferred.resolve(this);
            }.bind(this);
            if (!duration) {
                this.invalidateView();
            } else {
                Engine.on('postrender', tick);
            }

            return {
                deferred: deferred.promise(),
                callback: callback
            };
        },



        addSubview: function(view) {
            this._scrollableView.addSubview(view);
            // this.listenTo(view, events.INVALIDATE, this.update);
        },

        removeSubview: function(v) {
            this._scrollableView.removeSubview(view);
            this.update();
        },

        update: function() {
            this.setScrollPosition(this._positionX.get(), this._positionY.get(), null, true);
        },

        _onFamousRender: function() {
            var v = this._particle.getVelocity();
            var xVelocity = Math.round(Math.abs(v[0])*1000);
            var yVelocity = Math.round(Math.abs(v[1])*1000);

            // famous requires that you get the position every frame or else
            // it won't update the value of that item.  this normally happens
            // by doing a positionFrom, but because we turn that on and off
            // we have to manually get the position for it to update each frame
            this._particle.getPosition();


            if(!yVelocity && !xVelocity){
                this._idleIncrement ++;
            }else{
                this._idleIncrement = 0;
            }
            // if the velocity has sat at 0 for 300 frames, kill the render
            if(this._idleIncrement > 300){
                this._scrollableView.setNeedsDisplay(false);
            }
        },

        _bindScrollEvents: function() {
            var events = ['touchstart', 'touchmove', 'touchend', 'mousewheel', 'wheel'];
            var self = this;
            _.each(events, function(type) {
                this.$el.on(type, function(e) {
                    self._scrollType = type;
                    self._scrollHandler.emit(type, e.originalEvent);
                });
            }, this);

            this.sync = new GenericSync({
                "scroll": {},
                "touch": {}
            });

            if (this._scrollEnabled) {
                this.sync.on('start', this._onScrollStart);
                this.sync.on('update', this._onScrollUpdate);
                this.sync.on('end', this._onScrollEnd);
            }


            this._scrollHandler.pipe(this.sync);
        },

        _onScrollStart: function(data) {
            this._scrollableView.setNeedsDisplay(true);
            this._scrollDirection = null;
            this._idleIncrement = 0;
            this.trigger('scroll:start', this.getScrollPosition());
        },


        _onScrollEnd: function(data) {
            this.trigger('scroll:end', this.getScrollPosition());
            this._driver.wantsThrow(data.velocity);
        },

        _setScrollDirection: function(delta) {
            if (!this._scrollDirection) {
                var x = Math.abs(delta[0]);
                var y = Math.abs(delta[1]);
                if (x > y) {
                    this._scrollDirection = 'x';
                } else {
                    this._scrollDirection = 'y';
                }
            }
        },

        triggerScrollUpdate: function(){
            this.trigger('scroll:update', this.getScrollPosition());
        },

        _shouldScroll: function(contentSize, containerSize) {

            if (this.direction == DIRECTION_X) {
                if (contentSize[0] > containerSize[0]) return true;
            } else if (this.direction == DIRECTION_Y) {
                if (contentSize[1] > containerSize[1]) return true;
            } else {
                // need more testing around this
                return true;
            }
            return false;
        },


        _normalizeVector: function(position){
            // normalize the data based on direction
            if(this.direction == DIRECTION_Y){
                position[0] = 0;
                if(this._scrollDirection == 'x' && this.getDirectionalLockEnabled())return;
            }else if(this.direction == DIRECTION_X){
                position[1] = 0;
                if(this._scrollDirection == 'y' && this.getDirectionalLockEnabled())return;
            }
            return position;
        },

        clearScrollAnimations: function(){
            if(this._scrollAnimationCallback){
                this._scrollAnimationCallback();
            }
        },

        getBoundsInfo: function(delta){
            var gotoPosX = this._positionX.get() + delta[0];
            var gotoPosY = this._positionY.get() + delta[1];
            var contentSize = this.getContentSize();
            var containerSize = this.getSize();
            var scrollableDistanceX = contentSize[0] - containerSize[0];
            var scrollableDistanceY = contentSize[1] - containerSize[1];

            var isPastTop = gotoPosY >= 0;
            var isPastBottom = scrollableDistanceY + gotoPosY <= 0;
            var isPastLeft = gotoPosX >= 0;
            var isPastRight = scrollableDistanceX + gotoPosX <= 0;

            var isOutOfBoundsY = isPastTop || isPastBottom;
            var isOutOfBoundsX = isPastLeft || isPastRight;

            var anchorPoint = [gotoPosX, gotoPosY, 0];
            var isPastLimits = false;

            var outOfBoundsX = gotoPosX;
            var outofBoundsY = gotoPosY;
            if(isOutOfBoundsX && this.direction != DIRECTION_Y){
                outOfBoundsX = isPastRight ? -scrollableDistanceX : 0;
                anchorPoint[0] = outOfBoundsX;
                isPastLimits = true;
            }
            if(isOutOfBoundsY && this.direction != DIRECTION_X){
                outofBoundsY = isPastBottom ? -scrollableDistanceY : 0;
                anchorPoint[1] = outofBoundsY;
                isPastLimits = true;
            }

            return {
                gotoPosX: gotoPosX,
                gotoPosY: gotoPosY,
                isPastLimits: isPastLimits,
                anchorPoint: anchorPoint,
                contentSize: contentSize,
                containerSize: containerSize
            };
        },

        _onScrollUpdate: function(data) {

            // if you were animating a scroll, this will kill it
            this.clearScrollAnimations();

            var delta = data.delta;

            // cache the direction for all future movement until you start again
            this._setScrollDirection(delta);

            // depending on the direction you are scrolling, this will normalize the data
            // setting the other direction to 0, stopping any scroll in that direction
            delta = this._normalizeVector(delta);

            // dampen the delta so it feels right between mobile and desktop
            delta = this._driver.dampenDelta(data.delta, this._scrollType);

            // run calculations based on variables, spit back needed data
            var boundsInfo = this.getBoundsInfo(delta);


            // stop scrolling if size doesn't warrent it
            var shouldScroll =  this._shouldScroll(boundsInfo.contentSize, boundsInfo.containerSize);
            if(!shouldScroll)return;


            // we check with the driver to see if it wants to limit the position of the
            // scroll when we are updating via scroll
            this.setScrollPosition(boundsInfo.gotoPosX, boundsInfo.gotoPosY, null, this._driver.shouldLimitPastBounds());

            // give the driver an opportunity to take control of the particle
            // add a bounce for example
            this._driver.updateParticle(boundsInfo.isPastLimits, boundsInfo.anchorPoint, data.velocity);


            // trigger event handler
            this.triggerScrollUpdate();
        },

    });

    exports.ScrollView = ScrollView;
    exports.DIRECTION_X = DIRECTION_X;
    exports.DIRECTION_Y = DIRECTION_Y;
});
