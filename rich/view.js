define(function (require, exports, module) {

var _ = require('underscore');
var $ = require('jquery');
var utils = require('rich/utils');
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
var hashConstraints = require('rich/autolayout/utils').hashConstraints;
var constraintsWithVFL = require('rich/autolayout/constraints').constraintsWithVFL;
var constraintWithJSON = require('rich/autolayout/constraints').constraintWithJSON;
var Constraint = require('rich/autolayout/constraints').Constraint;

// only the props we need for the modifier
var CONSTRAINT_PROPS = ['width', 'height', 'top', 'left'];


var FamousView = marionette.View.extend({

    nestedSubviews: false,
    template: false,
    modifier: null,
    zIndex: 1,
    superview: null,
    root: null,
    context: null,
    _isRoot: false,
    _spec: null,
    _needsDisplay: false,

    // we need to own initialize, this includes marionette.View()
    // AND backbone.View()
    constructor: function(options){
        options || (options = {});

        this.children = new backbone.ChildViewContainer();

        /* >>> BEGIN marionette.View() override */
         _.bindAll(this, 'render', 'invalidateView');

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

        // is now here so we can get access to superview when size is called
        this.properties.size = _.result(this.properties, 'size') || _.result(this, 'size');
        this.properties.properties.zIndex = this.zIndex;

        this._constraints = [];
        this._constraintsIndex = {};

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

                mod.deferred.then(function(){
                    this.trigger('autolayoutTransition:complete', this, prop);
                }.bind(this));

                this._autolayoutTransitionables[prop].halt();
                this._autolayoutTransitionables[prop].set(this._autolayout[prop].value, animation, mod.callback);
            } else {
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
        var solver = this._solver = new autolayout.cassowary.SimplexSolver();
        var self = this;

        this._solver.addConstraint = function(){
            autolayout.cassowary.SimplexSolver.prototype.addConstraint.apply(solver, arguments);
        };

        var vars = this._autolayout;
        var superview = this.superview._autolayout;

        if(superview.width)
            solver.addStay(superview.width, autolayout.weak, 10);

        if(superview.height)
            solver.addStay(superview.height, autolayout.weak, 10);

        if(superview.top)
            solver.addStay(superview.top, autolayout.weak, 10);

        if(superview.right)
            solver.addStay(superview.right, autolayout.weak, 10);

        if(superview.bottom)
            solver.addStay(superview.bottom, autolayout.weak, 10);

        if(superview.left)
            solver.addStay(superview.left, autolayout.weak, 10);

        if(this._isRoot){
            solver.addStay(vars.width, autolayout.weak, 10);
            solver.addStay(vars.height, autolayout.weak, 10);
        } else {
            this._initializeSize(this.properties.size, solver);
        }
    },

    _initializeSize: function(size, solver){
        var vars = this._autolayout;
        var superview = this.superview._autolayout;
        var variables;
        var superSize = this.superview.getSize();
        var description = 0;

        // [0, 0] should be Top Left
        solver.addConstraint(autolayout.eq(vars.top, 0, autolayout.weak, 0));
        solver.addConstraint(autolayout.eq(vars.left, 0, autolayout.weak, 0));

        if(size && size[0]){
            solver.addConstraint(autolayout.eq(vars.width, size[0], autolayout.weak, 0));
        }

        if(size && size[1]){
            solver.addConstraint(autolayout.eq(vars.height, size[1], autolayout.weak, 0));
        }

        var right = autolayout.minus(superview.width, autolayout.plus(vars.width, vars.left));
        var bottom = autolayout.minus(superview.height.value, autolayout.plus(vars.height, vars.top));

        solver.addConstraint(autolayout.eq(vars.right, right, autolayout.weak, 0));
        solver.addConstraint(autolayout.eq(vars.bottom, bottom, autolayout.weak, 0));
    },

    _processIntrinsicConstraints: function(constraints){
        var tmp = [];

        if(!constraints) return tmp;

        for(var i = 0; i < constraints.length; i++){
            var each = constraints[i];

            if(_.isString(each)){
                tmp = tmp.concat(constraintsWithVFL(each));

            } else if (each instanceof Constraint){
                tmp.push(each);

            } else {
                tmp.push(constraintWithJSON(each));
            }
        }

        return tmp;
    },

    _initializeConstraints: function(){
        var constraints = _.result(this, 'constraints');
        var wantsInitialize;
        var shouldClearConstraints = false;
        var key;

        this._constraintsInitialized = true;
        this._initializeRelationships();

        var hasNoConstraints = constraints === null || constraints === undefined;
        hasNoConstraints = hasNoConstraints ? this._constraints.length === 0 : false;

        if(hasNoConstraints){
            this._mapAutolayout();
            return;
        }

        if(constraints){
            constraints = this._processIntrinsicConstraints(constraints);
            key = hashConstraints(constraints, this);
            shouldClearConstraints = key != this._currentConstraintKey;
        }

        if(shouldClearConstraints) {
            this._currentConstraintKey = key;
            wantsInitialize = constraints;
        } else {
            wantsInitialize = this._constraints;
        }

        this._constraints = [];
        this._constraintsIndex = {};

        this.children.each(function(child){
            child._initializeRelationships();
        });

        this.addConstraints(wantsInitialize);

        this._constraintsInitialized = true;
        this._mapAutolayout();
    },

    updateVariables: function(variables, values){
        if(variables.length === 0 || values.length === 0)return;
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
                    // because the key could be a sibling or a child,
                    // we need to look in both places for it
                    var each = this.children.findByCid(key) ||
                               view.children.findByCid(key);

                    each.updateVariables(variables, values);
                }, this);

            }, this);
        }
    },

    addConstraints: function(constraints){
        var i;
        var each;
        var result;
        var changes = {};

        var addStay = function(solver){
            return function(stay){
                solver.addStay(stay, autolayout.weak, 10);
            };
        };

        var hasNoRoot = this.root ? true : false;

        for(i = 0; i < constraints.length; i++){
            each = constraints[i];

            if(hasNoRoot){
                this._constraintsIndex[each.cid] = this._constraints.length;
                this._constraints.push(each);
                continue;
            }

            each.prepare(this);
            this._processAffectedRelationships(each.attributes, changes);

            this._constraintsIndex[each.cid] = this._constraints.length;
            this._constraints.push(each);

            if(each._stays){
                _.each(each._stays, addStay(each._solver));
            }

            each._solver.addConstraint(each._constraint);
        }

        this._resolveConstraintDependencies(changes);

        if(this.root){
            this.invalidateLayout();
            this.invalidateView();
        }
    },

    addConstraint: function(constraint){
        var changes = {};

        var addStay = function(solver){
            return function(stay){
                solver.addStay(stay, autolayout.weak, 10);
            };
        };

        constraint.prepare(this);

        this._processAffectedRelationships(constraint.attributes, changes);

        this._constraintsIndex[constraint.cid] = this._constraints.length;
        this._constraints.push(constraint);

        if(constraint._stays){
            _.each(constraint._stays, addStay(constraint._solver));
        }

        constraint._solver.addConstraint(constraint._constraint);

        this._resolveConstraintDependencies(changes);

        if(this.root){
            this.invalidateLayout();
            this.invalidateView();
        }
    },

    removeConstraints: function(constraints){
        for(var i = 0; i < constraints.length; i++){

            var constraint = constraints[i];
            var index = this._constraintsIndex[constraint.cid];
            var target;

            if(index === undefined) continue;
            target = this._constraints.splice(index, 1)[0];
            target._solver.removeConstraint(target._constraint);

            // a new solver is going to be created currently.
            // we can get fancier with this since we have the stays
            // and the constraint. Currently cassowary does not have a
            // removeStay, but Stay's are just StayConstraints IIRC
            // (will need) to check. We could just ensure our stays are
            // added as StayConstraints, would require some refactoring.

            target._constraint = null;
            target._solver = null;
            target._stays = null;
            target._item = null;

            // bookkeeping - very costly bookkeeping
            // not happy with this at all, need to look into
            // ways to handle this withough all this overhead.
            delete this._constraintsIndex[constraint.cid];
            for(var j = index; j < this._constraints.length; j++){
                var each = this._constraints[j];
                this._constraintsIndex[each.cid] = j;
            }
        }

        if(this.root){
            this.invalidateLayout();
            this.invalidateView();
        }
    },

    removeConstraint: function(constraint){
        var index = this._constraintsIndex[constraint.cid];
        var target;

        if(index === undefined) return;

        target = this._constraints.splice(index, 1)[0];
        target._solver.removeConstraint(target._constraint);

        // a new solver is going to be created currently.
        // we can get fancier with this since we have the stays
        // and the constraint. Currently cassowary does not have a
        // removeStay, but Stay's are just StayConstraints IIRC
        // (will need) to check. We could just ensure our stays are
        // added as StayConstraints, would require some refactoring.

        target._constraint = null;
        target._solver = null;
        target._stays = null;
        target._item = null;

        // bookkeeping
        delete this._constraintsIndex[constraint.cid];
        for(var i = index; i < this._constraints; i++){
            var each = this._constraints[i];
            this._constraintsIndex[each.cid] = i;
        }

        if(this.root){
            this.invalidateLayout();
            this.invalidateView();
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
            Engine.removeListener('postrender', callback);
            deferred.resolve(this);
        }.bind(this);

        if(!duration){
            this.invalidateView();
            Engine.on('postrender', callback);
        }else{
            Engine.on('postrender', tick);
        }

        return {deferred: deferred.promise(), callback: callback};
    },

    _animateModifier: function(type, args, transition, index){
        index || (index = 0);

        var target;
        var duration = transition && transition.duration ? transition.duration : 0;

        var obj = this._prepareModification(duration);

        if(_.isArray(this._modifier)){
            target = this._modifier[index];
        } else {
            target = this._modifier;
        }

        if(!duration){
            target[type](args);
            this.invalidateView();
        }else{
            target[type](args, transition, obj.callback);
        }

        return obj.deferred;
    },

    setTransform: function(transform, transition, index){
        return this._animateModifier('setTransform', transform, transition, index);
    },

    setOpacity: function(opacity, transition, index){
        return this._animateModifier('setOpacity', opacity, transition, index);
    },

    setOrigin: function(origin, transition, index){
        return this._animateModifier('setOrigin', origin, transition, index);
    },

    setAlign: function(align, transition, index){
        return this._animateModifier('setAlign', align, transition, index);
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

    _render: function(){
        if(this.isDestroyed) return;
        var spec;
        if(!this._constraintsInitialized){
            this._initializeConstraints();
        }

        this.root = this.createRenderNode();

        spec = this.root.render();
        this._spec = spec;
        this.triggerRichRender();

        if(!this._isShown){
            this._isShown = true;
            utils.postrenderOnce(function(){
                this.triggerMethod('show');
            }.bind(this));
        }
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
        if(value){
            Engine.on('postrender', this.invalidateView);
        }else{
            Engine.removeListener('postrender', this.invalidateView);
        }
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

    prepareSubviewAdd: function(view, zIndex){
        view.superview = this;
        // view._initializeRelationships();
        this._richDestroyed = false;

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
    },

    addSubview: function(view, zIndex){
        this.prepareSubviewAdd(view, zIndex);

        if(this.root){
            this.invalidateView();
        }
    },

    fillWithSubview: function(view, zIndex){
        this.addSubview(view, zIndex);
        // view._initializeRelationships();
        var c1 = constraintsWithVFL('|[view]|', {view: view});
        var c2 = constraintsWithVFL('V:|[view]|', {view: view});
        this.addConstraints([].concat(c1, c2));
    },

    prepareSubviewRemove: function(view){
        this.children.remove(view);
        this.stopListening(view, events.INVALIDATE, this.subviewDidChange);

        utils.defer(function(){
            view.invalidateLayout();
            view._richDestroy();
        });
    },

    removeSubview: function(view){
        this.prepareSubviewRemove(view);

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
                    if(_.isNumber(node.target)){
                        // you were given an event from a sub view of a
                        // containerview...do nothing, the sub view already took
                        // care of it
                        return;
                    }
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
                continue;
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
        //     vars.width.value = value[0];
        //     vars.height.value = value[1];
        // }

        if(this.root){
            this.invalidateLayout();
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
        // this is rather destructive and it's results are
        // very expensive. We can most certainly can find a
        // better way to handle this.
        // this._constraintsInitialized = false;
        // this._relationshipsInitialized = false;
        // this._initializeAutolayoutDefaults();
        this._constraintsInitialized = false;

        if(!this.isDestroyed){
            this.children.each(function(subview){
                subview._constraintsInitialized = false;
                subview._relationshipsInitialized = false;
                subview._currentConstraintKey = null;
                subview._initializeAutolayoutDefaults();
                subview.invalidateLayout();
            });
        }

        if(this.root){
            this.root = null;
        }
    },

    invalidateView: function(){
        this._render();
        this.triggerRichInvalidate();
    },

    _richDestroy: function(){
        this._isShown = false;
        this.superview = null;
        this.context = null;
        this.root = null;
        this.children = null;
        this._richAutolayoutDestroy();
        this._richDestroyed = true;
    },

    _richAutolayoutDestroy: function(){
        this._solver = null;
        this._autolayout = {};
        this._constraints = [];
        this._constraintsIndex = {};
        this._constraintRelations = null;
        this._superviewConstraints = [];
    },

    // override Backbone.View.remove()
    remove: function(){
        // Famo.us recycles elements, removing the $el
        // here has a high chance of causing problems.
        // otherwise this is basically the same as
        // Backbone.View.remove()

        // this.$el.remove();

        if(this.$el){
            this.undelegateEvents();
        }

        this.stopListening();

        if(!this._richDestroyed)
            this._richDestroy();

        return this;
    },

});

exports.FamousView = FamousView;

});
