define(function (require, exports, module) {

var autolayout = require('./init');
var c = autolayout.cassowary;

exports.constraintsFromJson = function(json, view){
    // item: 'navigation',
    // attribute: 'width',
    // relatedBy: '==', // '==|>=|<='
    // toItem: 'superview', //'null is superview'
    // toAttribute: 'width',
    // multiplier: 0.5,
    // constant: 0
    // console.log(json)
    var item = view[json.item];

    var toItem;
    if(json.toItem == 'superview'){
        toItem = view;
    }else{
        toItem = view[json.toItem] || view;
    }
    var toAttribute = toItem._autolayout[json.toAttribute] || false;
    // console.log(toAttribute)
    var multiplier = json.multiplier || 1;
    var constant = json.constant || 0;

    var itemAttribute = item._autolayout[json.attribute];

    var related;
    switch(json.relatedBy){
        case '==':
            related = autolayout.eq;
            break;
        case '>=':
            related = autolayout.geq;
            break;
        case '<=':
            related = autolayout.leq;
            break;
        default:
            related = autolayout.eq;
            break;
    }


    var solve;
    var strength = autolayout.weak;

    if(!toAttribute){
        solve = constant;
        // do we want to set a strength if they are only modifying a prop?
        // strength = autolayout.strong;
    }else{
        var times = autolayout.times(multiplier, toAttribute, autolayout.weak, 0);
        solve =  autolayout.plus(times, constant, autolayout.weak, 0);
    }

    var constraint = related(
        itemAttribute,
        solve,
        strength,
        2
    );

    return {
        constraint: constraint,
        stay: toAttribute
    };
};

});
