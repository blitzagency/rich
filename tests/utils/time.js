define(function (require, exports, module) {

var $ = require('jquery');
var rich = require('rich/utils');

function wait(timeout){
    var d = $.Deferred();

    setTimeout(function(){
        d.resolve();
    }, timeout);

    return d.promise();
}

function render(timeout){

    if(timeout){
        return wait(timeout);
    }

    var d = $.Deferred();

    rich.postrenderOnce(function(){
        d.resolve();
    });

    return d.promise();
}

exports.render = render;
exports.wait = wait;

});
