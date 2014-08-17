define(function (require, exports, module) {
    var _ = require('underscore');
    var marionette = require('marionette');
    var View = require('rich/view').FamousView;
    var Engine = require('famous/core/Engine');

    _.extend(marionette.Application.prototype, {

        addContentViews: function(obj){
            _.each(obj, function(value, key){
                this[key] = this.richInitializeContentView(value);
            }, this);
        },

        richInitializeContentView: function(options){

            var $el;
            var context;
            var contentView;
            var constraints = options.constraints || null;

            if(typeof options.el == 'string'){
                $el = $(options.el);
            }

            context = Engine.createContext($el[0]);
            contentView = new View({
                context: context,
                constraints: constraints,
                size: context.getSize()
            });

            contentView.name = 'contentView';
            contentView.superview = {_isRoot: true, _autolayout: {}};

            context.add(contentView);

            var resizeHandler = function(){
                var size = context.getSize();

                var variables = [
                    contentView._autolayout.width,
                    contentView._autolayout.height
                ];

                contentView.updateVariables(variables, size);
                contentView.invalidateLayout();
            };

            context.on('resize', resizeHandler);

            return contentView;
        }
    });

});
