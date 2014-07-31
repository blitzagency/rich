define(function (require, exports, module) {
var _ = require('underscore');
var Engine = require('famous/core/Engine');
var Modifier = require('famous/core/Modifier');
var Transform = require('famous/core/Transform');


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


function modifierWithTransform(config, modifier){
    modifier = modifier || new Modifier();

    if (config.transform){
        var transform;
        var candidate = config.transform;

        if(_.isArray(candidate)){
            var x = 0;
            var y = 0;
            var z = 0;

            x = config.transform[0] || x;
            y = config.transform[1] || y;
            z = config.transform[2] || z;

            transform = Transform.translate.apply(Transform, [x, y, z]);
        } else if(_.isFunction(candidate)){
            transform = candidate;
        }

        if(transform){
            modifier.transformFrom(transform);
        }
    }

    return modifier;
}


function modifierWithSize(config, modifier){
    modifier = modifier || new Modifier();

    if (config.size){
        modifier.sizeFrom(config.size);
    }

    return modifier;
}


function modifierWithOpacity(config, modifier){
    modifier = modifier || new Modifier();

    if (config.opacity){
        modifier.opacityFrom(config.opacity);
    }

    return modifier;
}


function modifierWithOrigin(config, modifier){
    modifier = modifier || new Modifier();

    if (config.origin){
        modifier.originFrom(config.origin);
    }

    return modifier;
}


function modifierWithAlign(config, modifier){
    modifier = modifier || new Modifier();

    if (config.align){
        modifier.alignFrom(config.align);
    }

    return modifier;
}

function modifierWithConfig(config){
    // config is:
    // {
    //    transform: ...
    //    origin: ...
    //    align: ...
    //    size: ...
    //    opacity: ...
    // }
    modifier = modifier || new Modifier();

    modifierWithOpacity(config, modifier);
    modifierWithOrigin(config, modifier);
    modifierWithSize(config, modifier);
    modifierWithTransform(config, modifier);

    return modifier;
}


exports.getViewSize = getViewSize;
exports.postrenderOnce = postrenderOnce;
exports.modifierWithTransform = modifierWithTransform;
exports.modifierWithSize = modifierWithSize;
exports.modifierWithOpacity = modifierWithOpacity;
exports.modifierWithOrigin = modifierWithOrigin;
exports.modifierWithAlign = modifierWithAlign;
exports.modifierWithConfig = modifierWithConfig;

});
