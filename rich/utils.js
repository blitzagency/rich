define(function (require, exports, module) {
var _ = require('underscore');
var Engine = require('famous/core/Engine');

function getViewSize(view){
    var className = _.result(view, 'className');
    var fragment = document.createDocumentFragment();
    var div = document.createElement('div');

    div.setAttribute('class', className);
    div.setAttribute('style', 'visibility:hidden; position:absolute;');

    div.innerHTML = view.renderHTML();

    fragment.appendChild(div);

    document.body.appendChild(fragment);
    var rect = div.getBoundingClientRect();
    document.body.removeChild(div);

    return [rect.width, rect.height];
}

function postrenderOnce(callback){
    var postrender = function(){
        Engine.removeListener('postrender', postrender);
        callback();
    };

    Engine.on('postrender', postrender);
}

exports.getViewSize = getViewSize;
exports.postrenderOnce = postrenderOnce;

});
