define(function (require, exports, module) {

function getComputedStyle($el){
    return window.getComputedStyle($el[0], null);
}

function getTransformMatrix($el){
    var computed = getComputedStyle($el);
    var transform = computed.getPropertyValue("-webkit-transform") ||
                    computed.getPropertyValue("-moz-transform") ||
                    computed.getPropertyValue("-ms-transform") ||
                    computed.getPropertyValue("-o-transform") ||
                    computed.getPropertyValue("transform");

    var values = transform.split('(')[1];
        values = values.split(')')[0];
        values = values.split(',');

    return _.map(values, function(each){
        return parseInt(each, 10);
    });
}

function getOpacity($el){
    var computed = getComputedStyle($el);
    var opacity = computed.getPropertyValue("opacity");
    return parseFloat(opacity, 10);
}

function getOrigin($el){
    var computed = getComputedStyle($el);
    var origin = computed.getPropertyValue("-webkit-transform-origin") ||
                    computed.getPropertyValue("-moz-transform-origin") ||
                    computed.getPropertyValue("-ms-transform-origin") ||
                    computed.getPropertyValue("-o-transform-origin") ||
                    computed.getPropertyValue("transform-origin");

    var values = origin.split(' ');
    // var values = transform.split('(')[1];
    //     values = values.split(')')[0];
    //     values = values.split(',');

    return _.map(values, function(each){
        return parseInt(each, 10);
    });
}


function getZIndex($el){
    var computed = getComputedStyle($el);
    return parseInt(computed.getPropertyValue('z-index'), 10);
}

function getSize($el){
    var computed = getComputedStyle($el);
    var width = computed.getPropertyValue('width');
    var height = computed.getPropertyValue('height');

    return [parseInt(width, 10), parseInt(height, 10)];
}

// http://stackoverflow.com/questions/1740700/how-to-get-hex-color-value-rather-than-rgb-value
function rgb2hex(rgb) {
    rgb = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);

    function hex(x) {
        return ("0" + parseInt(x, 10).toString(16)).slice(-2);
    }

    return "#" + hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3]);
}

exports.getComputedStyle = getComputedStyle;
exports.getTransformMatrix = getTransformMatrix;
exports.getZIndex = getZIndex;
exports.getSize = getSize;
exports.rgb2hex = rgb2hex;
exports.getOrigin = getOrigin;
exports.getOpacity = getOpacity;

});
