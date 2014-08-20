define(function (require, exports, module) {

var _ = require('underscore');

function autolayout(view, options){
    options || (options = {});

    nodes = options.nodes || 'whtrbl';
    label = options.label || view.cid;

    var prefix = '(' + label + ') ';
    var flags = {
        WIDTH: 1,
        HEIGHT: 1 << 1,
        TOP: 1 << 2,
        RIGHT: 1 << 3,
        BOTTOM: 1 << 4,
        LEFT: 1 << 5,
    };


    var selected = 0;

    _.each(nodes, function(key){
        key = key.toUpperCase();

        switch(key){
            case 'W':
                selected = selected | flags.WIDTH;
                break;

            case 'H':
                selected = selected | flags.HEIGHT;
                break;

            case 'T':
                selected = selected | flags.TOP;
                break;

            case 'R':
                selected = selected | flags.RIGHT;
                break;

            case 'B':
                selected = selected | flags.BOTTOM;
                break;

            case 'L':
                selected = selected | flags.LEFT;
                break;
        }
    });

    if(selected === 0) return;

    if(selected & flags.WIDTH)
        console.log(prefix + 'W:' + view._autolayout.width.value);

    if(selected & flags.HEIGHT)
        console.log(prefix + 'H:' + view._autolayout.height.value);

    if(selected & flags.TOP)
        console.log(prefix + 'T:' + view._autolayout.top.value);

    if(selected & flags.RIGHT)
        console.log(prefix + 'R:' + view._autolayout.right.value);

    if(selected & flags.BOTTOM)
        console.log(prefix + 'B:' + view._autolayout.bottom.value);

    if(selected & flags.LEFT)
        console.log(prefix + 'L:' + view._autolayout.left.value);

    console.log('---');
}

exports.autolayout = autolayout;

});
