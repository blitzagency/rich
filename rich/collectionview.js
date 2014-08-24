define(function (require, exports, module) {
    var backbone = require('backbone');
    var marionette  = require('marionette');
    var RenderNode = require('famous/core/RenderNode');
    var ContainerSurface = require('famous/surfaces/ContainerSurface');
    var FamousItemView = require('./itemview').FamousItemView;
    var FamousView = require('./view').FamousView;
    var utils = require('rich/utils');
    var constraintWithJSON = require('rich/autolayout/constraints').constraintWithJSON;

    var obj = {};
    _.extend(obj, marionette.CollectionView.prototype, FamousView.prototype);

    var CollectionView = FamousItemView.extend(obj);

    CollectionView = CollectionView.extend({
        orientation: 'vertical',
        spacing: 0,
        _lazyAdd: null,
        _lazyRemove: null,

        constructor: function(options){
            options || (options = {});

            var collectionOptions = ['orientation', 'spacing', 'sizeForViewAtIndex'];
            _.extend(this, _.pick(options, collectionOptions));

            FamousView.prototype.constructor.apply(this, arguments);

            this._lazyAdd = [];
            this._lazyRemove = [];

            this._initialEvents();
        },

        _lazyRender: function(){
            if(this._lazy) return;

            this._lazy = true;

            utils.defer(function(){

                this._lazy = false;

                if(this._lazyAdd.length || this._lazyRemove.length){
                    this.render();
                }

            }.bind(this));
        },

        // Configured the initial events that the collection view
        // binds to.
        _initialEvents: function() {
            // the only reason we (rich) are overriding this method is to change
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
            this.isResetting = true;
            this.destroyEmptyView();
            this.destroyChildren();

            this._constraints = [];
            this.isResetting = false;

            this.invalidateLayout();

            this.render();
            this.triggerRichInvalidate();
        },

        _renderWorkflow: function(){
            this._ensureViewIsIntact();
            this.triggerMethod('before:render', this);
            this._renderChildren();
            this.triggerMethod('render', this);
        },

        render: function(){
            if(this._richDirty){
                if(this._lazyAdd.length || this._lazyRemove.length){
                    this.processChanges();
                    this.trigger('change', this);
                } else {
                    this._renderWorkflow();
                }
            }
            else if(!this.root || this.needsDisplay()){
                this._renderWorkflow();
            }
            return this._spec;
        },

        // Internal method. Separated so that CompositeView can have
        // more control over events being triggered, around the rendering
        // process
        _renderChildren: function() {

            this.destroyEmptyView();

            if(!this.isEmpty(this.collection) && this.children.length > 0){
                this._render();
                return;
            }

            //this.destroyChildren();

            if (this.isEmpty(this.collection)) {
                this.showEmptyView();
            } else {
                this.triggerMethod('before:render:collection', this);
                this.showCollection();
                this.triggerMethod('render:collection', this);
            }

            this._render();
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

            this._richDirty = true;
            this._lazyAdd.push(view);
            this._lazyRender();

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

            this._richDirty = true;
            this._lazyAdd.push(view);
            this._lazyRender();

            this.triggerMethod('add:child', view);
        },

        createVerticalConstraints: function(view, index){
            var size = this.sizeForViewAtIndex(view, index);
            var constraints = [];

            constraints.push(constraintWithJSON({
                item: view,
                attribute: 'width',
                relatedBy: '==',
                toItem: this,
                toAttribute: 'width',
            }));

            constraints.push(constraintWithJSON({
                item: view,
                attribute: 'height',
                relatedBy: '==',
                constant: size[1],
            }));

            if(index === 0){
                constraints.push(constraintWithJSON({
                    item: view,
                    attribute: 'top',
                    relatedBy: '==',
                    toItem: this,
                    toAttribute: 'top',
                    constant: 0,
                }));
            } else {
                constraints.push(constraintWithJSON({
                    item: view,
                    attribute: 'top',
                    relatedBy: '==',
                    toItem: this.children.findByIndex(index - 1),
                    toAttribute: 'bottom',
                    constant: this.spacing
                }));
            }

            return constraints;
        },

        createHorizontalConstraints: function(view, index){
            var size = this.sizeForViewAtIndex(view, index);
            var constraints = [];

            constraints.push(constraintWithJSON({
                item: view,
                attribute: 'height',
                relatedBy: '==',
                toItem: this,
                toAttribute: 'height'
            }));

            constraints.push(constraintWithJSON({
                item: view,
                attribute: 'width',
                relatedBy: '==',
                constant: size[0]
            }));

            if(index === 0){
                constraints.push(constraintWithJSON({
                    item: view,
                    attribute: 'left',
                    relatedBy: '==',
                    toItem: this,
                    toAttribute: 'left',
                    constant: 0
                }));
            } else {
                constraints.push(constraintWithJSON({
                    item: view,
                    attribute: 'left',
                    relatedBy: '==',
                    toItem: this.children.findByIndex(index - 1),
                    toAttribute: 'right',
                    constant: this.spacing
                }));
            }

            return constraints;
        },

        sizeForViewAtIndex: function(view, index){
            return view.getSize();
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

                this._richDirty = true;

                if(this.isResetting)
                    this.prepareSubviewRemove(view);
                else
                    this._lazyRemove.push(view);

                this.triggerMethod('remove:child', view);

                // decrement the index of views after this one
                this._updateIndices(view, false);

                if(!this.isResetting)
                    this._lazyRender();
            }

            return view;
        },

        processChanges: function(){
            var adds = this._lazyAdd;
            var removes = this._lazyRemove;
            var i;

            for(i = 0; i < removes.length; i++){
                this.prepareSubviewRemove(removes[i]);
            }

            for(i = 0; i < adds.length; i++){
                this.prepareSubviewAdd(adds[i]);
            }

            this._lazyAdd = [];
            this._lazyRemove = [];

            var constraints = this._processIntrinsicConstraints(
                _.result(this, 'constraints')
            );

            var action = this.orientation == 'vertical' ?
                this.createVerticalConstraints.bind(this) :
                this.createHorizontalConstraints.bind(this);

            this.children.each(function(view, index){
                constraints = constraints.concat(action(view, index));
            }, this);

            this._constraints = constraints;

            this.invalidateLayout();
            this.invalidateView();

            this._richDirty = false;
        }
    });

    exports.CollectionView = CollectionView;
});
