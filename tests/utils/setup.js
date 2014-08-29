define(function (require, exports, module) {
    var $ = require('jquery');
    var _ = require('underscore');
    var rich = require('rich');
    var utils = require('rich/utils');

    function Setup(el, done){

        if(_.isFunction(el)){
            done = el;
            el = null;
        }

        this._done = done;

        this.root = this.initializeRoot(el);
        this.region = this.initializeRegion(this.root);
        this.context = this.root.context;
        this.$el = $(this.context.container);

        this.root.constraints = [
            {
                item: this.region,
                attribute: 'width',
                relatedBy: '==',
                toItem: this.root,
                toAttribute: 'width'
            },

            {
                item: this.region,
                attribute: 'height',
                relatedBy: '==',
                toItem: this.root,
                toAttribute: 'height'
            }
        ];
    }

    Setup.prototype.initializeRoot = function(el){
        el || (el = '#famous-context');

        var root = utils.initializeRichContext({
            el: el
        });

        return root;
    };

    Setup.prototype.initializeRegion = function(root){
        var region = new rich.Region();
        root.addSubview(region);
        return region;
    };

    Setup.prototype.done = function(){
        this.cleanup();

        if(this._done)
            this._done();
    };

    Setup.prototype.cleanup = function(){
        utils.disposeRichContext(this.root);

        var resize = this.root.context._eventOutput.listeners['resize'][0];

        _.each(this.root.context._eventOutput.listeners['resize'], function(handler){
            this.root.context._eventOutput.removeListener('resize', handler);
        }, this);

        this.root.destroy();
        this.region.destroy();

        this.root = null;
        this.region = null;
    };

    exports.Setup = Setup;
});
