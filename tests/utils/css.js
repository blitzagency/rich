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

exports.getComputedStyle = getComputedStyle;
exports.getTransformMatrix = getTransformMatrix;
exports.getZIndex = getZIndex;
exports.getSize = getSize;

});
