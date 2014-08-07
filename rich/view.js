define(function (require, exports, module) {

var _ = require('underscore');
var $ = require('jquery');
var marionette = require('marionette');
var backbone = require('backbone');
var RenderNode = require('famous/core/RenderNode');
var ContainerSurface = require('famous/surfaces/ContainerSurface');
var Surface = require('famous/core/Surface');
var Modifier = require('famous/core/Modifier');
var Transform = require('famous/core/Transform');
var Entity = require('famous/core/Entity');
var Context = require('famous/core/Context');
var Engine = require('famous/core/Engine');
var events = require('./events');
var autolayout = require('./autolayout/init');
var constraintsFromJson = require('./autolayout/utils').constraintsFromJson;

var FamousView = marionette.View.extend({

    //size: null,
    nestedSubviews: false,
    template: false,
    modifier: null,
    zIndex: 1,
    superview: null,
    subviews: null,
    root: null,
    context: null,
    _spec: null,
    _needsDisplay: false,

    // we need to own initialize, this includes marionette.View()
    // AND backbone.View()
    constructor: function(options){
        options || (options = {});

        this.children = new backbone.ChildViewContainer();
        this._autolayoutModifier = new Modifier();


        /* >>> BEGIN marionette.View() override */
         _.bindAll(this, 'render');

        // this exposes view options to the view initializer
        // this is a backfill since backbone removed the assignment
        // of this.options
        // at some point however this may be removed
        this.options = _.extend({}, _.result(this, 'options'), _.isFunction(options) ? options.call(this) : options);
        // parses out the @ui DSL for events
        this.events = this.normalizeUIKeys(_.result(this, 'events'));

        if (_.isObject(this.behaviors)) {
          new marionette.Behaviors(this);
        }

        // we explicitely defer the full backbone.View initialization
        // till later... we only need parts of it now.

        /* >>> BEGIN backbone.View() override */

        // we are literally taking everything from Backbone.View's constructor
        // except _ensureElement and delegateEvents
        // the famous context may not be available on this view yet,
        // in which case we cannot cerate the famous element ($el)
        // and we can't delegateEvents if we have no $el.

        this.cid = _.uniqueId('view');

        // duplicating this from backbone, don't readily see another way to grab it. =(
        // we only add 'context' for a convenience

        var viewOptions = ['model', 'collection', 'el', 'id', 'attributes', 'className', 'tagName', 'events'];
        var richOptions = ['constraints', 'context', 'modifier', 'nestedSubviews'];
        var propertyOptions = ['size'];
        var styleOptions = ['zIndex'];

        // conform to famous surface property structure,
        // the naming here is unfortunate for now.
        this.properties = {properties: {}};

        _.extend(this, _.pick(options, viewOptions.concat(styleOptions, richOptions)));
        _.extend(this.properties, _.pick(options, propertyOptions));

        this.properties.size = _.result(this.properties, 'size') || _.result(this, 'size');
        this.properties.properties.zIndex = this.zIndex;
        this._initializeAutolayout();
        this.initialize.apply(this, arguments);

        /* <<< END backbone.View() */
        marionette.MonitorDOMRefresh(this);
        this.listenTo(this, 'show', this.onShowCalled);
        /* <<< END marionette.View() override */

    },

    _initializeAutolayout: function(){
        var al = this._autolayout = {};
        var w = 0;
        var h = 0;

        if(this.properties.size){
            w = this.properties.size[0] || 0;
            h = this.properties.size[1] || 0;
        }

        this._constraintRelations = {};
        this._autolayout.width = autolayout.cv('width', w);
        this._autolayout.height = autolayout.cv('height', h);
        this._autolayout.top = autolayout.cv('top', 0);
        this._autolayout.right = autolayout.cv('right', 0);
        this._autolayout.bottom = autolayout.cv('bottom', 0);
        this._autolayout.left = autolayout.cv('left', 0);
        this._solver = new autolayout.cassowary.SimplexSolver();

        this._autolayoutModifier.transformFrom(function(){
            return Transform.translate(al.left.value, al.top.value, 0);
        });

        this._autolayoutModifier.sizeFrom(function(){
            return [al.width, al.height];
        });

        // add some loose constraints about top/left/bottom/right
        var top = autolayout.geq(this._autolayout.top, 0, autolayout.weak, 1);
        var right = autolayout.geq(this._autolayout.right, 0, autolayout.weak, 1);
        var bottom = autolayout.geq(this._autolayout.bottom, 0, autolayout.weak, 1);
        var left = autolayout.geq(this._autolayout.left, 0, autolayout.weak, 1);
        var pullLeft = autolayout.eq(this._autolayout.left, 0, autolayout.weak, 1);
        var pullTop = autolayout.eq(this._autolayout.top, 0, autolayout.weak, 1);

        // if(this.properties.size){
        //     this._solver.addStay(this._autolayout.width, autolayout.required, 0);
        //     this._solver.addStay(this._autolayout.height, autolayout.required, 0);
        // }

        this._solver.addStay(this._autolayout.width, autolayout.weak, 0);
        this._solver.addStay(this._autolayout.height, autolayout.weak, 0);

        this._solver.addConstraint(pullLeft);
        this._solver.addConstraint(pullTop);
        this._solver.addConstraint(left);
        this._solver.addConstraint(top);
        this._solver.addConstraint(right);
        this._solver.addConstraint(bottom);
    },

    _initializeConstraints: function(){
        if(this._constraintsInitialized) return;

        if(!this.superview) return;

        var vars = this._autolayout;
        var superview = this.superview._autolayout;

        if(superview.right)
            this._solver.addStay(superview.right, autolayout.weak);

        if(superview.left)
            this._solver.addStay(superview.left, autolayout.weak);

        if(superview.width)
            this._solver.addStay(superview.width, autolayout.weak);

        if(superview.height)
            this._solver.addStay(superview.height, autolayout.weak);

        if(superview.top)
            this._solver.addStay(superview.top, autolayout.weak);

        if(superview.bottom)
            this._solver.addStay(superview.bottom, autolayout.weak);


        if(!this.properties.size){
            //console.log('---- inheriting size from superview', this.cid);
            this._solver.addEditVar(vars.width);
            this._solver.addEditVar(vars.height);
            this._solver.beginEdit();
            this._solver.suggestValue(vars.width, superview.width.value);
            this._solver.suggestValue(vars.height, superview.height.value);
            this._solver.resolve();
            this._solver.endEdit();
        }

        this._solver.addConstraint(
            autolayout.eq(
                autolayout.plus(this._autolayout.width, this._autolayout.right).plus(this._autolayout.left),
                this.superview._autolayout.width,
                autolayout.weak, 0)
        );

        this._solver.addConstraint(
            autolayout.eq(
                autolayout.plus(this._autolayout.height, this._autolayout.bottom).plus(this._autolayout.top),
                this.superview._autolayout.height,
                autolayout.weak, 0)
        );

        // this._solver.addConstraint(
        //     autolayout.eq(
        //         autolayout.plus(this._autolayout.width, this._autolayout.right).plus(this._autolayout.left),
        //         this.superview._autolayout.width),
        //     autolayout.weak, 0
        // );

        // this._solver.addConstraint(
        //     autolayout.eq(
        //         autolayout.plus(this._autolayout.height, this._autolayout.bottom).plus(this._autolayout.top),
        //         this.superview._autolayout.height),
        //     autolayout.weak, 0
        // );

        _.each(this.constraints, this.addConstraintFromJson, this);

        this._constraintsInitialized = true;
    },

    addConstraintFromJson: function(json){

        var view = this[json.item];

        if(!view._constraintsInitialized){
            view._initializeConstraints();
        }

        view.addConstraint(constraintsFromJson(json, this));
    },

    addConstraint: function(options){


        if(options.stays){
            _.each(options.stays, function(stay){
                this._solver.addStay(stay, autolayout.weak, 10);
            }, this);
        }

        this._solver.addConstraint(options.constraint);
        this._updateConstraintVariables();
    },

    _updateConstraintVariables: function(){
        var vars = this._autolayout;
        _.each(this._constraintRelations, function(value){
            //console.log(this.name, value.name)
            var solver = value._solver;

            var valueWidth = vars.width.value;
            var valueHeight = vars.height.value;
            var valueTop = vars.top.value;
            var valueRight = vars.right.value;
            var valueBottom = vars.bottom.value;
            var valueLeft = vars.left.value;

            solver.addEditVar(vars.width);
            solver.addEditVar(vars.height);
            solver.addEditVar(vars.top);
            solver.addEditVar(vars.right);
            solver.addEditVar(vars.bottom);
            solver.addEditVar(vars.left);

            solver.beginEdit();
            solver.suggestValue(vars.width, valueWidth);
            solver.suggestValue(vars.height, valueHeight);
            solver.suggestValue(vars.top, valueTop);
            solver.suggestValue(vars.right, valueRight);
            solver.suggestValue(vars.bottom, valueBottom);
            solver.suggestValue(vars.left, valueLeft);
            solver.resolve();
            solver.endEdit();

        }, this);
    },

    _prepareModification: function(duration, requireModifier){
        if(requireModifier !== false) requireModifier = true;

        var deferred = $.Deferred();

        if(!this.modifier && requireModifier){
            throw new Error('Please set a modifier on the view');
        }

        var self = this;

        var tick = function(){
            self._render();
        };

        var callback = function(){
            Engine.removeListener('postrender', tick);
            deferred.resolve(this);
        }.bind(this);

        if(!duration){
            this._render();
        }else{
            Engine.on('postrender', tick);
        }

        return {deferred: deferred.promise(), callback: callback};
    },

    setTransform: function(transform, transition, index){
        index || (index = 0);

        var target;
        var duration = transition && transition.duration ? transition.duration : null;
        var obj = this._prepareModification(duration);

        if(_.isArray(this._modifier)){
            target = this._modifier[index];
        } else {
            target = this._modifier;
        }

        target.setTransform(transform, transition, obj.callback);

        return obj.deferred;
    },

    getFamousId: function(){
        if(this.renderable){
            return this.renderable.id;
        }

        return null;
    },

    render: function(){
        if(this.root === null || this.needsDisplay()){
            this._render();
        }
        return this._spec;
    },

    invalidateLayout: function(){
        var superviewSize = this.superview.getSize();
        // TODO need to recalculate the constraints.

        this.children.each(function(subview){
            subview.invalidateLayout();
        });
    },

    invalidateView: function(){
        this._render();
        this.triggerRichInvalidate();
    },

    // invalidate: function(){
    //     this._render();
    //     this.triggerRichInvalidate();
    // },

    _render: function(){
        var spec;
        this.root = this.createRenderNode();

        spec = this.root.render();
        this._spec = spec;
        this.triggerRichRender();
    },

    triggerRichRender: function(){
        this.trigger(events.RENDER, this);
    },

    triggerRichInvalidate: function(){
        this.trigger(events.INVALIDATE, this);
    },

    needsDisplay: function(){
        return this._needsDisplay;
    },

    setNeedsDisplay: function(value){
        this._needsDisplay = value;
    },

    resetNestedNode: function(container){
        var resetNode = new RenderNode();
        var currentNode = container.context._node;
        resetNode._prevResults = currentNode._prevResults || {};
        resetNode._resultCache = resetNode._prevResults;
        container.context._node = resetNode;
    },

    createNestedNode: function(context){
        var container = new ContainerSurface(this.properties);

        if(!this.renderable){
            this._ensureElement(container, context);
        }

        if (this.className){
            container.addClass(_.result(this, 'className'));
        }

        return container;
    },

    applyModifiers: function(modifiers, node){
        if(_.isArray(modifiers)){

            _.each(modifiers, function(modifier){
                node = node.add(modifier);
            });

        } else {
            node = node.add(modifiers);
        }

        return node;
    },

    createRenderNode: function(){
        var root = new RenderNode();
        var relative = root;
        var context = this.context;

        if(this.modifier){
            var modifiers = _.result(this, 'modifier');
            relative = this.applyModifiers([this._autolayoutModifier], root);
            relative = this.applyModifiers(modifiers, relative);

            this._modifier = modifiers;
        }

        if(this.nestedSubviews){
            if(!this.container){
                this.container = this.createNestedNode(this.context);
            }

            this.resetNestedNode(this.container);

            relative.add(this.container);
            context = this.container.context;
            relative = this.container;
        }

        if(!this.renderable && this.getTemplate()){
            this.renderable = this.initializeRenderable();
        }

        if(this.renderable){
            relative.add(this.renderable);
        }

        this.children.each(function(view){
            var needsTrigger = false;
            if(!view.context){
                 needsTrigger = true;
            }
            view.context = context;

            if(needsTrigger){
                view.triggerMethod('context');
            }
            relative.add(view);
        }, this);

        return root;
    },

    addSubview: function(view, zIndex){
        view.superview = this;
        if(this.context){
            view._initializeConstraints();
        }else{
            this.once('context', view._initializeConstraints.bind(view));
        }

        function setZIndex(value){
            view.zIndex = value;
            view.properties.properties.zIndex = value;
        }

        if(!zIndex && view.zIndex <= this.zIndex){
            setZIndex(this.zIndex + 1);
        } else if(zIndex){
            setZIndex(zIndex);
        }

        this.listenTo(view, events.INVALIDATE, this.subviewDidChange);
        this.children.add(view);

        if(this.root){
            this.invalidateView();
        }
    },

    subviewDidChange: function(view){
        // consider an alternate way to index this information?
        // so we don't have to step through the array each time?
        // might not be worth it, might be worth it.
        // we'd need to keep that index up to date, so it
        // might be more housekeeping than is worth it.

        if(this._spec === null) this._spec = [];

        var spec = view._spec;

        var arr = this._spec.target || this._spec;
        var famousId = view.getFamousId();

        // this is a view without a renderable
        if(famousId === null && _.isArray(this._spec)){

            if(_.isNull(spec) || _.isArray(spec)){
                this._spec = spec;
            } else {
                this._spec.push(spec);
            }
            this.triggerRichInvalidate();
            return;
        }

        for(var i=1; i < arr.length; i++){
            var obj = arr[i];
            var id;

            if(_.isNumber(obj)){
                id = obj;
            } else if (_.isNumber(obj.target)){
                id = obj.target;
            } else if(_.isArray(obj.target)) {
                id = obj.target[0];
            } else {
                console.log(obj);
                throw new Error('An unexpected error occured '+
                                'when updating render spec.');
            }

            if(id == famousId){
                arr[i] = spec;
                break;
            }
        }

        this.triggerRichInvalidate();
    },

    removeSubview: function(view){
        view.superview = null;
        view.context = null;

        this.children.remove(view);
        this.stopListening(view, events.INVALIDATE, this.subviewDidChange);

        if(this.root){
            this.invalidateView();
        }
    },

    removeFromSuperview: function(){
        this.superview.removeSubview(this);
    },

    setSize: function(value){
        this.properties.size = value;

        this._initializeConstraints();

        var vars = this._autolayout;

        this._solver.addEditVar(vars.width);
        this._solver.addEditVar(vars.height);

        this._solver.beginEdit();
        this._solver.suggestValue(vars.width, value[0]);
        this._solver.suggestValue(vars.height, value[1]);
        this._solver.resolve();
        this._solver.endEdit();

        this._updateConstraintVariables();

        if(this.root){
            this.invalidateView();
        }
    },

    getSize: function(){
        return [this._autolayout.width.value, this._autolayout.height.value];
    },

    // Ensure that the View has a DOM element to render into.
    // If `this.el` is a string, pass it through `$()`, take the first
    // matching element, and re-assign it to `el`. Otherwise, create
    // an element from the `id`, `className` and `tagName` properties.
    _ensureElement: function(renderable, context) {
      if (!this.el) {
        // this wrongly assumes it will always have a
        // .commit function. Will need to poribably rethink this.

        if(!renderable._currTarget){
            renderable.setup(context._allocator);
        }

        var $el = $(renderable._currTarget);

        if (this.className){
            var className = _.result(this, 'className');
            $el.addClass(className);
            renderable.addClass(className);
        }

        var attrs = _.extend({}, _.result(this, 'attributes'));
        if (this.id) attrs.id = _.result(this, 'id');

        // var $el = Backbone.$('<' + _.result(this, 'tagName') + '>').attr(attrs);
        $el.attr(attrs);
        this.setElement($el, false);
      } else {
        this.setElement(_.result(this, 'el'), false);
      }

      // this is a new event for rich.
      // a FamousView with nestedSubviews will have
      // an $el, but a FamousView that does not have
      // nestedSubviews enabled will not have an $el.
      // onElement is what you want if you need to know about
      // weather or not an element is available.
      this.triggerMethod('element', this);
    },

    // override Backbone.View.remove()
    remove: function(){
        // Famo.us recycles elements, removing the $el
        // here has a high chance of causing problems.
        // otherwise this is basically the same as
        // Backbone.View.remove()

        // this.$el.remove();
        this.children = null;
        this.root = null;
        if(this.$el){
            this.undelegateEvents();
        }
        this.stopListening();
        return this;
    },

});
exports.FamousView = FamousView;

});
