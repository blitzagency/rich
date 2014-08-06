define(function (require, exports, module) {
    var marionette  = require('marionette');
    var RenderNode = require('famous/core/RenderNode');
    var ContainerSurface = require('famous/surfaces/ContainerSurface');
    var FamousItemView = require('./itemview').FamousItemView;
    var FamousView = require('./view').FamousView;


    var obj = {};
    _.extend(obj, marionette.CollectionView.prototype, FamousItemView.prototype);

    var FamousCollectionView = FamousItemView.extend(obj);

    FamousCollectionView = FamousCollectionView.extend({
        modifierForViewAtIndex: null,
        sizeForEmptyView: null,
        sizeForViewAtIndex: null,
        _subviewModifiers:{},

        constructor: function(options){
            options || (options = {});

            FamousView.prototype.constructor.apply(this, arguments);

            if(options.modifierForViewAtIndex){
                this.modifierForViewAtIndex = options.modifierForViewAtIndex;
            }

            this._initialEvents();
            //this.initRenderBuffer();
        },

        initializeRenderable: function(){
            return null;
        },

        // Configured the initial events that the collection view
        // binds to.
        _initialEvents: function() {

            // the only reason we are overriding this methods is to change
            // the behavior of the 'reset' handler.
            if (this.collection) {
                this.listenTo(this.collection, 'add', this._onCollectionAdd);
                this.listenTo(this.collection, 'remove', this._onCollectionRemove);
                this.listenTo(this.collection, 'reset', this._famousReset);

                if (this.sort) {
                    this.listenTo(this.collection, 'sort', this._sortViews);
                }
            }
        },

        _famousReset: function(){
            this.root = null;
            this.triggerRichInvalidate();
        },

        render: function(){
            if(!this.root || this.needsDisplay()){

                this._ensureViewIsIntact();
                this.triggerMethod('before:render', this);
                this._renderChildren();
                this.triggerMethod('render', this);
            }

            return this._spec;
        },

        // Internal method. Separated so that CompositeView can have
        // more control over events being triggered, around the rendering
        // process
        _renderChildren: function() {
            this.destroyEmptyView();
            this.destroyChildren();

            if (this.isEmpty(this.collection)) {
                this.showEmptyView();
            } else {
                this.triggerMethod('before:render:collection', this);
                // this.startBuffering();
                this.showCollection();
                // this.endBuffering();
                this.triggerMethod('render:collection', this);
            }

            this._render();
        },

        createRenderNode: function(){
            if(!this.modifierForViewAtIndex){
                throw new Error('CollectionView must have '+
                                'modifierForIndex(view, index) set');
            }

            var root = new RenderNode();
            var relative = root;
            var context = this.context;

            if(this.modifier){
                var modifiers = _.result(this, 'modifier');
                relative = this.applyModifiers(modifiers, root);

                this._modifier = modifiers;
            }

            if(this.nestedSubviews){
                if(!this.container){
                    this.container = new ContainerSurface(this.properties);

                    if (this.className){
                        this.container.addClass(_.result(this, 'className'));
                    }
                }

                this.container.context._node = new RenderNode();

                relative.add(this.container);
                context = this.container.context;
                relative = this.container;
            }

            this.children.each(function(view, index){
                view.context = context;
                view.superview = this;
                var node = new RenderNode();

                var modifier = this.modifierForViewAtIndex(view, index);
                this._subviewModifiers[view.cid] = modifier;

                if(modifier){
                    node.add(modifier).add(view);
                } else {
                    node.add(view);
                }

                relative.add(node);

            }, this);

            return root;
        },

        subviewDidChange: function(view){
            var renderNode = new RenderNode();
            var modifier = this._subviewModifiers[view.cid];
            renderNode.add(modifier).add(view);
            var obj = {
                _spec: renderNode.render(),
                getFamousId: view.getFamousId
            };
            FamousItemView.prototype.subviewDidChange.apply(this, [obj]);
        },

        // Internal method to destroy an existing emptyView instance
        // if one exists. Called when a collection view has been
        // rendered empty, and then a child is added to the collection.
        destroyEmptyView: function() {
            if (this._showingEmptyView) {
                this.destroyChildren();
                delete this._showingEmptyView;
            }
        },

        // Render and show the emptyView. Similar to addChild method
        // but "child:added" events are not fired, and the event from
        // emptyView are not forwarded
        addEmptyView: function(child, EmptyView){

            // get the emptyViewOptions, falling back to childViewOptions
            var emptyViewOptions = this.getOption('emptyViewOptions') ||
                                   this.getOption('childViewOptions');

            if (_.isFunction(emptyViewOptions)){
                emptyViewOptions = emptyViewOptions.call(this);
            }

            // build the empty view
            var view = this.buildChildView(child, EmptyView, emptyViewOptions);

            // trigger the 'before:show' event on `view` if the collection view
            // has already been shown
            if (this._isShown){
                this.triggerMethod.call(view, 'before:show');
            }

            // Store the `emptyView` like a `childView` so we can properly
            // remove and/or close it later

            /**
             * RICH CHANGE: from this.children.add(view) to this.addSubview(view)
             * Effecitively does the same thing, but we need to register
             * our subviews for our rendering needs
             */

            if(this.sizeForEmptyView){
                size = this.sizeForEmptyView(view);
                view.properties.size = size;
            }

            this.addSubview(view);

            // call the 'show' method if the collection view
            // has already been shown
            if (this._isShown){
                this.triggerMethod.call(view, 'show');
            }
        },

        // Internal Method. Add the view to children and render it at
        // the given index.
        _addChildView: function(view, index) {
            // set up the child view event forwarding
            this.proxyChildEvents(view);

            this.triggerMethod('before:add:child', view);

            // Store the child view itself so we can properly
            // remove and/or destroy it later

            /**
             * RICH CHANGE: from this.children.add(view) to this.addSubview(view)
             * Effecitively does the same thing, but we need to register
             * our subviews for our rendering needs
             */

            if(this.sizeForViewAtIndex){
                size = this.sizeForViewAtIndex(view, index);
                view.properties.size = size;
            }

            this.addSubview(view);

            if (true || this._isShown && !this.isBuffering){
                if (_.isFunction(view.triggerMethod)) {
                    view.triggerMethod('show');
                } else {
                    Marionette.triggerMethod.call(view, 'show');
                }
            }

            this.triggerMethod('add:child', view);
        },

        // Remove the child view and destroy it.
        // This function also updates the indices of
        // later views in the collection in order to keep
        // the children in sync with the collection.
        removeChildView: function(view) {
            if (view) {
                this.triggerMethod('before:remove:child', view);
                // call 'destroy' or 'remove', depending on which is found
                if (view.destroy) { view.destroy(); }
                else if (view.remove) { view.remove(); }

                this.stopListening(view);

                /**
                 * RICH CHANGE: from this.children.remove(view) to
                 * this.removeSubview(view).
                 */
                this.removeSubview(view);
                this.triggerMethod('remove:child', view);

                // decrement the index of views after this one
                this._updateIndices(view, false);
            }
        },

        startBuffering: function(){
            // noop for now
        },

        endBuffering: function(){
            // noop for now
        },
    });

    exports.FamousCollectionView = FamousCollectionView;
});
