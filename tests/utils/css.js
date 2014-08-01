define(function (require, exports, module) {

function getComputedStyle($el){
    return window.getComputedStyle($el[0], null);
}

exports.getComputedStyle = getComputedStyle;

});
