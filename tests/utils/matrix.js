define(function (require, exports, module) {

var _ = require('underscore');
var $ = require('jquery');
var css = require('./css');


function getTransformMatrix($el){
    var computed = css.getComputedStyle($el);
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

function getTranslation(matrix){
    if (matrix instanceof $){
        matrix = getTransformMatrix(matrix);
    }

    if(matrix.length == 16){
        return getTranslation3D(matrix);
    }

    if(matrix.length == 6){
        return getTranslation2D(matrix);
    }

    return {x: null, y: null, z: null};
}

function getTranslation2D(matrix){
    // [a, c, b, d, tx, ty]
    return {x: matrix[4], y: matrix[5], z: 0};
}

function getTranslation3D(matrix){
    // [a1, b1, c1, d1, a2, b2, c2, d2, a3, b3, c3, d3, tx, ty, tz, d4]
    return {x: matrix[12], y: matrix[13], z: matrix[14]};
}

exports.getTransformMatrix = getTransformMatrix;
exports.getTranslation = getTranslation;

});
