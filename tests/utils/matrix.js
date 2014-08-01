define(function (require, exports, module) {

var _ = require('underscore');
var $ = require('jquery');
var css = require('./css');


function getTranslation(matrix){
    if (matrix instanceof $){
        matrix = css.getTransformMatrix(matrix);
        console.log(matrix);
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

exports.getTranslation = getTranslation;

});
