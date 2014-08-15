define(function (require, exports, module) {

var _ = require('underscore');
var $ = require('jquery');
var marionette = require('marionette');
var backbone = require('backbone');
var RenderNode = require('famous/core/RenderNode');
var ContainerSurface = require('famous/surfaces/ContainerSurface');
var Modifier = require('famous/core/Modifier');
var Transform = require('famous/core/Transform');
var Engine = require('famous/core/Engine');
var Transitionable = require("famous/transitions/Transitionable");
var events = require('./events');
var autolayout = require('./autolayout/init');
var constraintsFromJson = require('./autolayout/utils').constraintsFromJson;
var hashJSONConstraints = require('rich/autolayout/utils').hashJSONConstraints;
var VFLToJSON = require('rich/autolayout/utils').VFLToJSON;

// only the props we need for the modifier
var CONSTRAINT_PROPS = ['width', 'height', 'top', 'left'];


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
        var richOptions = ['autolayoutTransition', 'constraints', 'context', 'modifier', 'nestedSubviews'];
        var propertyOptions = ['size'];
        var styleOptions = ['zIndex'];

        // conform to famous surface property structure,
        // the naming here is unfortunate for now.
        this.properties = {properties: {}};

        _.extend(this, _.pick(options, viewOptions.concat(styleOptions, richOptions)));
        _.extend(this.properties, _.pick(options, propertyOptions));

        this.properties.size = _.result(this.properties, 'size') || _.result(this, 'size');
        this.properties.properties.zIndex = this.zIndex;

        this._constraints = [];

        this._initializeAutolayout();
        this.initialize.apply(this, arguments);

        /* <<< END backbone.View() */
        marionette.MonitorDOMRefresh(this);
        this.listenTo(this, 'show', this.onShowCalled);
        /* <<< END marionette.View() override */

    },

    _initializeAutolayout: function(){

        this._autolayout = {};

        this._initializeAutolayoutDefaults();
        this._initializeAutolayoutModifier();
    },

    _initializeAutolayoutModifier: function(){
        this._autolayoutModifier = new Modifier();
        // setup the autolayout modifier to move w/ a transitionable
        this._autolayoutTransitionables = {};

        _.each(CONSTRAINT_PROPS, function(prop){
            this._autolayoutTransitionables[prop] = new Transitionable(this._autolayout[prop].value);
        }, this);

        this._autolayoutModifier.transformFrom(function(){
            // return Transform.translate(this._autolayout.left.value, this._autolayout.top.value, 0);
            return Transform.translate(this._autolayoutTransitionables.left.get(),
                                       this._autolayoutTransitionables.top.get(),
                                       0);
        }.bind(this));

        this._autolayoutModifier.sizeFrom(function(){
            // return [this._autolayout.width.value, this._autolayout.height.value];
            return [
                this._autolayoutTransitionables.width.get(),
                this._autolayoutTransitionables.height.get()
            ];
        }.bind(this));
    },

    _mapAutolayout: function(){
        _.each(CONSTRAINT_PROPS, function(prop){
            // this isn't a literal return because we are in an _.each, it'll just kick out this loop
            if(this._autolayoutTransitionables[prop].get() == this._autolayout[prop].value) return;
            var animation = this.getAutolayoutTransitionForProperty(prop);
            if(this._hasSetInitialProp && animation && animation.duration){
                var mod = this._prepareModification(animation.duration, false);
                this._autolayoutTransitionables[prop].halt();
                this._autolayoutTransitionables[prop].set(this._autolayout[prop].value, animation, mod.callback);
            }else{
                this._autolayoutTransitionables[prop].set(this._autolayout[prop].value);
            }
        }, this);
        if(!this._hasSetInitialProp){
            this._hasSetInitialProp = true;
        }
    },

    getAutolayoutTransitionForProperty: function(property){
        if(this.autolayoutTransition){
            return this.autolayoutTransition;
        }
        return null;
    },

    _initializeAutolayoutDefaults: function(w, h){
        w = w || 0;
        h = h || 0;

        if(this.properties.size){
            w = this.properties.size[0] || 0;
            h = this.properties.size[1] || 0;
        }

        this._constraintRelations = new backbone.Model({});
        this._autolayout.width = autolayout.cv('width', w);
        this._autolayout.height = autolayout.cv('height', h);
        this._autolayout.top = autolayout.cv('top', 0);
        this._autolayout.right = autolayout.cv('right', 0);
        this._autolayout.bottom = autolayout.cv('bottom', 0);
        this._autolayout.left = autolayout.cv('left', 0);
    },

    _initializeRelationships: function(){
        if(this._relationshipsInitialized || !this.superview) return;

        this._relationshipsInitialized = true;
        // console.log('_initializeRelationships -> ' + this.name);
        var solver = this._solver = new autolayout.cassowary.SimplexSolver();

        var vars = this._autolayout;
        var superview = this.superview._autolayout;

        // add some loose constraints about top/left/bottom/right
        var top = autolayout.geq(vars.top, 0, autolayout.weak, 1);
        var right = autolayout.geq(vars.right, 0, autolayout.weak, 1);
        var bottom = autolayout.geq(vars.bottom, 0, autolayout.weak, 1);
        var left = autolayout.geq(vars.left, 0, autolayout.weak, 1);
        var pullLeft = autolayout.eq(vars.left, 0, autolayout.weak, 1);
        var pullTop = autolayout.eq(vars.top, 0, autolayout.weak, 1);

        solver.addStay(vars.width, autolayout.weak, 0);
        solver.addStay(vars.height, autolayout.weak, 0);

        solver.addConstraint(pullLeft);
        solver.addConstraint(pullTop);
        solver.addConstraint(left);
        solver.addConstraint(top);
        solver.addConstraint(right);
        solver.addConstraint(bottom);

        if(superview.width)
            solver.addStay(superview.width, autolayout.weak);

        if(superview.height)
            solver.addStay(superview.height, autolayout.weak);

        if(superview.top)
            solver.addStay(superview.top, autolayout.weak);

        if(superview.right)
            solver.addStay(superview.right, autolayout.weak);

        if(superview.bottom)
            solver.addStay(superview.bottom, autolayout.weak);

        if(superview.left)
            solver.addStay(superview.left, autolayout.weak);


        if(!this.properties.size){
            solver.addEditVar(vars.width);
            solver.addEditVar(vars.height);
            solver.beginEdit();
            solver.suggestValue(vars.width, superview.width.value);
            solver.suggestValue(vars.height, superview.height.value);
            solver.resolve();
            solver.endEdit();
        }

        solver.addConstraint(
            autolayout.eq(
                autolayout.plus(vars.width, vars.right).plus(vars.left),
                this.superview._autolayout.width,
                autolayout.weak, 0)
        );

        solver.addConstraint(
            autolayout.eq(
                autolayout.plus(vars.height, vars.bottom).plus(vars.top),
                this.superview._autolayout.height,
                autolayout.weak, 0)
        );
    },

    _initializeConstraints: function(){
        var constraints = _.result(this, 'constraints');
        var wantsInitialize;
        var shouldClearConstraints = false;
        var key;

        this._initializeRelationships();

        if(constraints === undefined && this._constraints.length === 0){
            this._mapAutolayout();
            return;
        }

        if(constraints){
            key = hashJSONConstraints(constraints, this);
            shouldClearConstraints = key != this._currentConstraintKey;
        }

        if(shouldClearConstraints) {
            this._currentConstraintKey = key;
            wantsInitialize = constraints;
        } else {
            wantsInitialize = this._constraints;
        }

        this._constraints = [];

        this.children.each(function(child){
            child._initializeRelationships();
        });

        this.addConstraints(wantsInitialize);

        this._constraintsInitialized = true;
        this._mapAutolayout();
    },

    updateVariables: function(variables, values){

        var solver = this._solver;

        _.each(variables, function(each, index){
            solver.addEditVar(each);
        });

        solver.beginEdit();

        _.each(variables, function(each, index){
            solver.suggestValue(each, values[index]);
        });

        solver.resolve();
        solver.endEdit();
        this._mapAutolayout();
    },

    _processAffectedRelationships: function(json, changes){
        var key = _.isString(json.item) ? this[json.item].cid : json.item.cid;
        var item = this.children.findByCid(key); //this[json.item];
        var relations = item._constraintRelations;

        if(relations.hasChanged()){
            changes[key] || (changes[key] = {});

            var host = changes[key];

            _.each(relations.changed, function(value){
                _.extend(host, value.changed);
            });

            // force the reset of the changed attributes
            relations.changed = {};
        }
    },

    _resolveConstraintDependencies: function(changes){
        var view;
        var target;
        var variables;
        var values;

        if(!_.isEmpty(changes)){

            _.each(changes, function(value, key){
                view = this.children.findByCid(key);
                target = view._constraintRelations;

                variables = [];
                values = [];

                // create the companion attrs:
                if(_.has(value, 'right') || _.has(value, 'left')){

                    variables = variables.concat([
                        view._autolayout.left,
                        view._autolayout.right]);

                    values = values.concat([
                        view._autolayout.left.value,
                        view._autolayout.right.value]);
                }

                if(_.has(value, 'top') || _.has(value, 'bottom')){
                    variables = variables.concat([
                        view._autolayout.top,
                        view._autolayout.bottom]);

                    values = values.concat([
                        view._autolayout.top.value,
                        view._autolayout.bottom.value]);
                }

                _.each(target.keys(), function(key){
                    var each = this.children.findByCid(key);
                    each.updateVariables(variables, values);
                }, this);

            }, this);
        }
    },

    addConstraints: function(constraints){

        var i;
        var each;
        var result;
        var items = constraints.slice(0);
        var changes = {};

        var addStay = function(solver){
            return function(stay){
                solver.addStay(stay, autolayout.weak, 10);
            };
        };

        // first we deal with any VFL items
        // converting them to JSON and merging them
        // back into the items array
        for(i = 0; i < items.length; i++){
            each = items[i];

            if(_.isString(each)){
                result = VFLToJSON(each);
                var args = [i, 1].concat(result);
                Array.prototype.splice.apply(items, args);
            }
        }

        // everything should be JSON by this point.
        for(i = 0; i < items.length; i++){
            each = items[i];

            var obj = constraintsFromJson(each, this);
            var solver = obj.solver;

            this._processAffectedRelationships(each, changes);
            this._constraints.push(each);

            if(obj.stays){
                _.each(obj.stays, addStay(solver));
            }

            solver.addConstraint(obj.constraint);
        }

        this._resolveConstraintDependencies(changes);

        if(this.root){
            this.invalidateLayout();
            this.triggerRichInvalidate();
        }
    },

    addConstraint: function(constraint){
        var changes = {};

        var addStay = function(solver){
            return function(stay){
                solver.addStay(stay, autolayout.weak, 10);
            };
        };

        if(_.isString(constraint)){
            var result = VFLToJSON(constraint);
            this.addConstraints(result);
            return;
        }

        var obj = constraintsFromJson(constraint, this);
        var solver = obj.solver;

        this._processAffectedRelationships(constraint, changes);
        this._constraints.push(constraint);

        if(obj.stays){
            _.each(obj.stays, addStay(solver));
        }

        solver.addConstraint(obj.constraint);
        this._resolveConstraintDependencies(changes);

        if(this.root){
            this.invalidateLayout();
            this.triggerRichInvalidate();
        }

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
            if(!this._constraintsInitialized){
                this._initializeConstraints();
            }
            this._render();
        }
        return this._spec;
    },

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

        relative = this.applyModifiers([this._autolayoutModifier], root);
        if(this.modifier){
            var modifiers = _.result(this, 'modifier');
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
        var modLength = this._getModifierLength();
        var arr;

        if(this._spec === null) this._spec = [];

        var spec = view._spec;

        var childSpecStartPoint = this._spec;

        while(modLength){
            modLength --;
            childSpecStartPoint = childSpecStartPoint.target;
        }

        if(_.isArray(childSpecStartPoint)){
            arr = childSpecStartPoint;
        }else{
            // in this case your going to have to reach down the number
            // of modifiers that this view has, and replace that target
            // with the responce from the views's spec.
            modLength = this._getModifierLength();
            var node = this._spec;
            while(modLength){
                modLength --;
                if(modLength == 0){
                    node.target = view._spec;
                    this.triggerRichInvalidate();
                    return;
                }
                node = node.target;
            }
        }


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

        var viewModifierLen = view._getModifierLength();

        for(var i=1; i < arr.length; i++){
            var obj = arr[i];
            var id;
            var depth = viewModifierLen;
            while(depth){
                obj = obj.target;
                depth --;
            }
            // console.log(obj)
            if(_.isNumber(obj)){
                id = obj;
            }else if(_.isArray(obj)){
                id = obj[0];
            } else if(_.isObject(obj)){
                // these aren't the droids your looking for
                break;
            }else{
                debugger;
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

    _getModifierLength: function(){
        var modifiersLen = 0;
        if(_.isArray(this._modifier)){
            modifiersLen = this._modifier.length;
        }else if(this._modifier){
            modifiersLen = 1;
        }
        modifiersLen += this._autolayoutModifier ? 1 : 0;
        return modifiersLen;
    },

    removeSubview: function(view){
        view.superview = null;
        view.context = null;
        view.invalidateLayout();

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
        // TODO: We shouldn't need this anymore. (properties.size
        // since it's in the _autolayout, will need to factor it out);

        this.properties.size = value;
        var vars = this._autolayout;

        // if(this._solver){
        //     var variables = [vars.width, vars.height];
        //     this.updateVariables(variables, value);
        // } else {
        //     console.log('HERE', value);
        //     vars.width.value = value[0];
        //     vars.height.value = value[1];
        // }

        this.invalidateLayout();
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

            if(!renderable._currentTarget){
                renderable.setup(context._allocator);
            }

            var $el = $(renderable._currentTarget);

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

    invalidateLayout: function(){

        this._constraintsInitialized = false;
        this._relationshipsInitialized = false;
        this._initializeAutolayoutDefaults();

        this.children.each(function(subview){
            subview.invalidateLayout();
        });

        if(this.root){
            this.root = null;
        }

    },

    invalidateView: function(){
        this._render();
        this.triggerRichInvalidate();
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
