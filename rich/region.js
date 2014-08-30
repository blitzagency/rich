define(function (require, exports, module) {

var _ = require('underscore');
var marionette = require('marionette');
var View = require('./view').FamousView;
var utils = require('./utils');

var obj = {};
_.extend(obj, marionette.Region.prototype, View.prototype);

var Region = View.extend(obj);

Region = Region.extend({

    constraints: function() {
        if(!this.currentView) return;

        return [
            'H:|[currentView]|',
            'V:|[currentView]|',
        ];
    },

    // Displays a backbone view instance inside of the region.
    // Handles calling the `render` method for you. Reads content
    // directly from the `el` attribute. Also calls an optional
    // `onShow` and `close` method on your view, just after showing
    // or just before closing the view, respectively.
    // The `preventClose` option can be used to prevent a view from being destroyed on show.
    show: function(view, options){
        var showOptions = options || {};
        var isDifferentView = view !== this.currentView;
        var preventDestroy =  !!showOptions.preventDestroy;
        var forceShow = !!showOptions.forceShow;

        // we are only changing the view if there is a view to change to begin with
        var isChangingView = !!this.currentView;

        // only destroy the view if we don't want to preventDestroy and the view is different
        var _shouldDestroyView = !preventDestroy && isDifferentView;

        if (_shouldDestroyView) {
            this.empty();
        }

        var _shouldShowView = isDifferentView || forceShow;

        if (_shouldShowView) {

            if (isChangingView) {
                this.triggerMethod('before:swap', view);
            }

            this.triggerMethod('before:show', view);
            this.triggerMethod.call(view, 'before:show');

            if(this.currentView){
                // this is a rich specific segment
                // need to be sure the view is not in the render tree
                this.prepareSubviewRemove(this.currentView);
            }

            this.currentView = view;

            if (isChangingView) {
                this.triggerMethod('swap', view);
            }

            if (isDifferentView) {
                this.open(view);
            }

        }
        return this;
    },

    open: function(view){

        this.prepareSubviewAdd(view);

        // this that have nestedSubviews
        // will break if we don't ensure a context is present
        // also, if no context is present, we have yet to be
        // rendered anyway.
        if(this.context){
            this.invalidateLayout();
            this.invalidateView();
        }
    },

    addSubview: function(){
        throw new Error('Regions do not expose addSubview, use myRegion.show()');
    },

    removeSubview: function(){
        throw new Error('Regions do not expose removeSubview, use myRegion.show()');
    },

    // this is the default, i'll need to likely add stuff
    empty: function() {
        var view = this.currentView;
        if (!view || view.isDestroyed) { return; }

        this.triggerMethod('before:empty', view);

        this.prepareSubviewRemove(view);

        // call 'destroy' or 'remove', depending on which is found
        if (view.destroy) { view.destroy(); }
        else if (view.remove) { view.remove(); }

        this.triggerMethod('empty', view);

        delete this.currentView;
    },

    remove: function(){

        if(this.currentView){
            this.empty();
        }

        View.prototype.remove.apply(this, arguments);
    }
});

exports.Region = Region;

});
