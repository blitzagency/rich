define(function (require, exports, module) {
    var marionette  = require('marionette');
    var Surface = require('famous/core/Surface');
    var FamousView = require('./view').FamousView;
    var GenericSync = require('famous/inputs/GenericSync');
    var PhysicsEngine = require('famous/physics/PhysicsEngine');
    var Particle = require('famous/physics/bodies/Particle');
    var Spring = require('famous/physics/forces/Spring');
    var TouchSync = require('famous/inputs/TouchSync');
    var ScrollSync = require('famous/inputs/ScrollSync');
    var EventHandler = require('famous/core/EventHandler');
    var Transitionable = require("famous/transitions/Transitionable");
    var events = require('./events');


    GenericSync.register({
        "touch"  : TouchSync,
        "scroll" : ScrollSync
    });

    var DIRECTION_X = GenericSync.DIRECTION_X;
    var DIRECTION_Y = GenericSync.DIRECTION_Y;

    var ScrollView  = FamousView.extend({
        renderable: null,
        nestedSubviews: true,
        _hasSpring: false,
        _hasStalledCount:0,
        _previousPosition:[0,0],
        _directionalLockEnabled: true,
        _scrollEnabled: true,

        constructor: function(options){
            // this.setNeedsDisplay(true);
            options || (options = {});
            _.bindAll(this, '_onScrollUpdate', '_onScrollStart', '_onScrollEnd', '_onSpringRender');

            this._positionX = new Transitionable(0);
            this._positionY = new Transitionable(0);

            // physics
            this._particle = new Particle();
            this._spring = new Spring();
            this._physicsEngine = new PhysicsEngine();
            this._physicsEngine.addBody(this._particle);

            // scrollable wrapper
            this._scrollableView = new FamousView({modifier: this._particle});
            this.contentSize = options.contentSize || this.contentSize || [0, 0];

            FamousView.prototype.constructor.apply(this, arguments);
            this._scrollHandler = new EventHandler();

            // options
            this.direction = options.direction;

            if(!_.isUndefined(options.directionalLockEnabled)){
                this._directionalLockEnabled = options.directionalLockEnabled;
            }
            if(!_.isUndefined(options.scrollEnabled)){
                this._scrollEnabled = options.scrollEnabled;
            }

            this.listenTo(this._scrollableView, events.RENDER, this._onFamousRender);
        },

        setDirectionalLockEnabled: function(val){
            this._directionalLockEnabled = val;
        },

        getDirectionalLockEnabled: function(){
            return this._directionalLockEnabled;
        },

        setScrollEnabled: function(val){
            this._scrollEnabled = val;
            if(!this.sync)return;
            if(this._scrollEnabled){
                this.sync.on('start', this._onScrollStart);
                this.sync.on('update', this._onScrollUpdate);
                this.sync.on('end', this._onScrollEnd);
            }else{
                this.sync.removeListener('start', this._onScrollStart);
                this.sync.removeListener('update', this._onScrollUpdate);
                this.sync.removeListener('end', this._onScrollEnd);
            }
        },

        getScrollEnabled: function(){
            return this._scrollEnabled;
        },

        getContentSize: function(){
            return _.result(this, 'contentSize');
        },

        onShow: function(){
            // had to put this here to not get a backbone error...not sure why
            // it can't go in onRender but w/e
            FamousView.prototype.addSubview.apply(this, [this._scrollableView]);
        },

        onElement: function(){

            this.$el.css({
                overflow:'hidden'
                // border: '1px solid red'
            });

            // we have to map the events into an event handler so it conforms
            // to how famous wants things, this listens to all these events and has
            // the event handler dispatch them out
            this._bindScrollEvents();

        },

        getScrollPosition: function(){
            return [this._positionX.get(), this._positionY.get()];
        },

        _cleanScrollPosition: function(x, y){

            var contentSize = this.getContentSize();
            var containerSize = this.getSize();
            var xLimit = - Math.max(contentSize[0] - containerSize[0], 0);
            var yLimit = - Math.max(contentSize[1] - containerSize[1], 0);
            x = Math.max(x, xLimit);
            x = Math.min(x, 0);

            y = Math.max(y, yLimit);
            y = Math.min(y, 0);
            return [x, y];
        },

        setScrollPosition: function(x, y, limit, transition){
            limit = _.isUndefined(limit) ? true : limit;
            if(limit){
                var pos = this._cleanScrollPosition(x, y);
                xLimited = pos[0];
                yLimited = pos[1];
                x = xLimited;
                y = yLimited;
            }

            // don't let the scroll position be anything crazy
            this._positionX.set(x);
            this._positionY.set(y);
            this._particle.setPosition([x, y]);
            this._scrollableView.invalidateView();
        },

        addSubview: function(view){
            this._scrollableView.addSubview(view);
            this.listenTo(view, events.INVALIDATE, this.update);
        },

        removeSubview: function(v){
            this._scrollableView.removeSubview(view);
            this.update();
        },

        update: function(){
            this.setScrollPosition(this._positionX.get(), this._positionY.get(), true);
        },

        _onFamousRender: function(){
            var pos = this._particle.getPosition();
            if(this._previousPosition){
                var yChange = Math.round(this._previousPosition[1] - pos[1]);
                var xChange = Math.round(this._previousPosition[0] - pos[0]);
                if(!xChange && !yChange){
                    this._hasStalledCount ++ ;
                    if(this._hasStalledCount > 10){
                        this._scrollableView.setNeedsDisplay(false);
                        this.trigger('scroll:bouncecomplete', this.getScrollPosition());
                        this._scrollableView.off(events.RENDER, this._onSpringRender);
                    }
                }else{
                    this._hasStalledCount = 0;
                }
            }
            this._previousPosition = pos;

        },

        _bindScrollEvents: function(){
            var events = ['touchstart', 'touchmove', 'touchend', 'mousewheel', 'wheel'];
            var self = this;
            _.each(events, function(type){
                this.$el.on(type, function(e){
                    self._scrollHandler.emit(type, e.originalEvent);
                });
            }, this);

            this.sync = new GenericSync(
                ["scroll", "touch"]
            );

            if(this._scrollEnabled){
                this.sync.on('start', this._onScrollStart);
                this.sync.on('update', this._onScrollUpdate);
                this.sync.on('end', this._onScrollEnd);
            }


            this._scrollHandler.pipe(this.sync);
        },


        _onScrollEnd: function(data){
            this.trigger('scroll:end',this.getScrollPosition());
        },

        _onScrollStart: function(data){
            this._scrollDirection = null;
            this.trigger('scroll:start', this.getScrollPosition());
        },

        _setScrollDirection: function(delta){
            if(!this._scrollDirection){
                var x = Math.abs(delta[0]);
                var y = Math.abs(delta[1]);
                if(x > y){
                    this._scrollDirection = 'x';
                }else{
                    this._scrollDirection = 'y';
                }
            }
        },

        _updateSpring: function(addSpring, xSpringPos, ySpringPos, springAnchor){
            var springOptions = {
                anchor: springAnchor,
                period: 500,
                dampingRatio: 1
            };

            if(addSpring){
                this._spring.setOptions(springOptions);
                if(this._hasSpring){
                    // update spring
                }else{
                    // add a spring
                    this._particle.setVelocity(0);
                    this._physicsEngine.attach([this._spring], this._particle);
                    this._hasSpring = true;
                    this._scrollableView.setNeedsDisplay(true);
                    this._scrollableView.on(events.RENDER, this._onSpringRender);
                }
                this._positionY.set(ySpringPos);
                this._positionX.set(xSpringPos);
            }else{
                if(this._hasSpring){
                    this._physicsEngine.detachAll();
                    this._particle.setVelocity(0);
                    this._hasSpring = false;
                    this._scrollableView.setNeedsDisplay(false);
                    this._scrollableView.off(events.RENDER, this._onSpringRender);
                }
            }
        },

        _onSpringRender: function(){
            // this triggers an update for when the spring is updating
            this.trigger('scroll:update', this.getScrollPosition());
        },

        _shouldScroll: function(contentSize, containerSize){

            if(this.direction == DIRECTION_X){
                if(contentSize[0] > containerSize[0])return true;
            }else if (this.direction == DIRECTION_Y){
                if(contentSize[1] > containerSize[1])return true;
            }else{
                // need more testing around this
                return true;
            }
            return false;
        },

        _onScrollUpdate: function(data){
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

            var springAnchor = [gotoPosX, gotoPosY, 0];
            var addSpring = false;

            var xSpringPos = gotoPosX;
            var ySpringPos = gotoPosY;

            var shouldScroll =  this._shouldScroll(contentSize, containerSize);
            if(!shouldScroll)return;

            if(isOutOfBoundsX && this.direction != DIRECTION_Y){
                xSpringPos = isPastRight ? -scrollableDistanceX : 0;
                springAnchor[0] = xSpringPos;
                addSpring = true;
            }
            if(isOutOfBoundsY && this.direction != DIRECTION_X){
                ySpringPos = isPastBottom ? -scrollableDistanceY : 0;
                springAnchor[1] = ySpringPos;
                addSpring = true;
            }

            // this gets rid of the flutter when you're already going out of bounds
            if(this._hasSpring && addSpring){
                return;
            }

            this.setScrollPosition(gotoPosX, gotoPosY, false);
            this._updateSpring(addSpring, xSpringPos, ySpringPos, springAnchor);
            this.trigger('scroll:update', this.getScrollPosition());
        },

    });

    exports.ScrollView  = ScrollView;
    exports.DIRECTION_X = DIRECTION_X;
    exports.DIRECTION_Y = DIRECTION_Y;
});
