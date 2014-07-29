define(function (require, exports, module) {

    var Modifier = require('famous/core/Modifier');
    var Transform = require('famous/core/Transform');

    function horizontalLayout(options){
        options || (options = {});

        var padding = options.padding || 0;

        return function(view, index){
            var size = view.getSize();
            var offset = index * (size[0] + padding);

            return new Modifier({
                transform: Transform.translate(offset, 0, 0)
            });
        };
    }

    function verticalLayout(options){
        options || (options = {});

        var padding = options.padding || 0;

        return function(view, index){
            var size = view.getSize();
            var offset = index * (size[1] + padding);

            return new Modifier({
                transform: Transform.translate(0, offset, 0)
            });
        };
    }

    exports.horizontalLayout = horizontalLayout;
    exports.verticalLayout = verticalLayout;
});
