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
    var SimplePlugin = require('./scroll-drivers/simple').SimplePlugin;
    var BouncePlugin = require('./scroll-drivers/bounce').BouncePlugin;

    GenericSync.register({
        "touch": TouchSync,
        "scroll": ScrollSync,
        "mouse": MouseSync
    });

    var DIRECTION_X = GenericSync.DIRECTION_X;
    var DIRECTION_Y = GenericSync.DIRECTION_Y;

    var ScrollView = FamousView.extend({
        renderable: null,
        nestedSubviews: true,
        _hasStalledCount: 0,
        _previousPosition: [0, 0],
        _directionalLockEnabled: true,
        _scrollEnabled: true,

        constructor: function(options) {
            // this.setNeedsDisplay(true);
            options || (options = {});
            _.bindAll(this, '_onScrollUpdate', '_onScrollStart', '_onScrollEnd', 'triggerScrollUpdate');

            this._positionX = new Transitionable(0);
            this._positionY = new Transitionable(0);

            // physics
            this._particle = new Particle();


            // transitionables setup
            var self = this;
            this._particle.positionFrom(function() {
                return [self._positionX.get(), self._positionY.get()];
            });

            // scrollable wrapper
            this._scrollableView = new FamousView({
                modifier: this._particle
            });

            this.contentSize = options.contentSize || this.contentSize || [0, 0];

            FamousView.prototype.constructor.apply(this, arguments);
            this._scrollHandler = new EventHandler();

            // set up the scroll plugin
            var ScrollPlugin = options.scrollPlugin || BouncePlugin;
            this._plugin = new BouncePlugin(this);

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

        onShow: function() {
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

        setScrollPosition: function(x, y, limit, transition) {
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
                this._positionY.set(y, transition, obj.callback);
                return obj.deferred;
            } else {
                this._positionY.halt();
                this._positionX.set(x);
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
                self.trigger('scroll:update', self.getScrollPosition());
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
            this.setScrollPosition(this._positionX.get(), this._positionY.get(), true);
        },

        _onFamousRender: function() {
            var pos = this._particle.getPosition();
            if (this._previousPosition) {
                var yChange = Math.round(this._previousPosition[1] - pos[1]);
                var xChange = Math.round(this._previousPosition[0] - pos[0]);
                if (!xChange && !yChange) {
                    this._hasStalledCount++;
                    if (this._hasStalledCount > 10) {
                        this._scrollableView.setNeedsDisplay(false);
                        this.trigger('scroll:bouncecomplete', this.getScrollPosition());
                        this._scrollableView.off(events.RENDER, this.triggerScrollUpdate);
                    }
                } else {
                    this._hasStalledCount = 0;
                }
            }
            this._previousPosition = pos;

        },

        _bindScrollEvents: function() {
            var events = ['touchstart', 'touchmove', 'touchend', 'mousewheel', 'wheel', 'mousedown', 'mousemove', 'mouseup'];
            var self = this;
            _.each(events, function(type) {
                this.$el.on(type, function(e) {
                    self._interacted = true;
                    self._scrollHandler.emit(type, e.originalEvent);
                });
            }, this);

            this.sync = new GenericSync({
                "scroll": {},
                "touch": {},
                "mouse": {
                    scale: 5
                }
            });

            if (this._scrollEnabled) {
                this.sync.on('start', this._onScrollStart);
                this.sync.on('update', this._onScrollUpdate);
                this.sync.on('end', this._onScrollEnd);
            }


            this._scrollHandler.pipe(this.sync);
        },

        _onScrollStart: function(data) {
            this.setNeedsDisplay(true);
            this._scrollableView.setNeedsDisplay(true);
            this._scrollDirection = null;
            this.trigger('scroll:start', this.getScrollPosition());
        },


        _onScrollEnd: function(data) {
            this.setNeedsDisplay(false);
            this._scrollableView.setNeedsDisplay(false);
            this.trigger('scroll:end', this.getScrollPosition());
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

        _onScrollUpdate: function(data) {
            // this._plugin.onScrollUpdate(data);
            var delta = data.delta;
            this._setScrollDirection(delta);

            // normalize the data based on direction

            if(this.direction == DIRECTION_Y){
                delta[0] = 0;
                if(this._scrollDirection == 'x' && this.getDirectionalLockEnabled())return;
            }else if(this.direction == DIRECTION_X){
                delta[1] = 0;
                if(this._scrollDirection == 'y' && this.getDirectionalLockEnabled())return;
            }

            var pos = this._particle.getPosition();
            var gotoPosX = this._positionX.get() + delta[0];
            var gotoPosY = this._positionY.get() + delta[1];
            var contentSize = this.getContentSize();
            var containerSize = this.getSize();
            var scrollableDistanceX = contentSize[0] - containerSize[0];
            var scrollableDistanceY = contentSize[1] - containerSize[1];

            var isPastTop = gotoPosY > 0;
            var isPastBottom = scrollableDistanceY + gotoPosY < 0;
            var isPastLeft = gotoPosX > 0;
            var isPastRight = scrollableDistanceX + gotoPosX < 0;

            var isOutOfBoundsY = isPastTop || isPastBottom;
            var isOutOfBoundsX = isPastLeft || isPastRight;

            var anchorPoint = [gotoPosX, gotoPosY, 0];
            var isPastLimits = false;

            var outOfBoundsX = gotoPosX;
            var outofBoundsY = gotoPosY;

            var shouldScroll =  this._shouldScroll(contentSize, containerSize);
            if(!shouldScroll)return;

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

            // this gets rid of the flutter when you're already going out of bounds
            if(this._hasSpring && isPastLimits){
                return;
            }

            // we check with the plugin to see if it wants to limit the position of the
            // scroll when we are updating via scroll
            this.setScrollPosition(gotoPosX, gotoPosY, this._plugin.shouldLimitPastBounds());
            this._plugin.updateLimits(isPastLimits, outOfBoundsX, outofBoundsY, anchorPoint);
            this.trigger('scroll:update', this.getScrollPosition());
        },

    });

    exports.ScrollView = ScrollView;
    exports.DIRECTION_X = DIRECTION_X;
    exports.DIRECTION_Y = DIRECTION_Y;
});
