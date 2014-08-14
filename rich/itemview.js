define(function (require, exports, module) {
    var marionette  = require('marionette');
    var Surface = require('famous/core/Surface');
    var FamousView = require('./view').FamousView;
    var $ = require('jquery');


    var obj = {};
    _.extend(obj, marionette.ItemView.prototype, FamousView.prototype);

    var FamousItemView = FamousView.extend(obj);

    FamousItemView = FamousItemView.extend({
        renderable: null,

        constructor: function(options){
            FamousView.prototype.constructor.apply(this, arguments);
        },

        shouldInitializeRenderable: function(){
            return true;
        },

        initializeRenderable: function(){
            var renderable = new Surface(this.properties);
            renderable.deploy = this._deploy.bind(this);
            return renderable;
        },

        renderHTML: function(){
            var data = this.serializeData();
            data = this.mixinTemplateHelpers(data);
            var template = this.getTemplate();
            var html = marionette.Renderer.render(template, data);
            return html;
        },


        _deploy: function(target){
            var context = this.context;
            if(this.nestedSubviews){
                context = this.container.context;
            }

            if(!this.renderable){
                this.triggerMethod("before:render", this);
                this.triggerMethod("render", this);
                return;
            }

            this._ensureElement(this.renderable, context);
            this.delegateEvents();

            this.isClosed = false;

            this.triggerMethod("before:render", this);

            var html = this.renderHTML();

            this.$el.html(html);
            this.bindUIElements();

            this.triggerMethod("render", this);

        }

    });

    exports.FamousItemView = FamousItemView;
});
