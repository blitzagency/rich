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
    var item = view[json.item]; // navigation

    var toItem;
    if(json.toItem == 'superview'){
        toItem = view; //'rectangle'
    }else{
        toItem = view[json.toItem] || view;
    }
    var toAttribute = toItem._autolayout[json.toAttribute] || false;
    // console.log(toAttribute)
    var multiplier = json.multiplier || 1;
    var constant = json.constant || 0;

    if(!toAttribute){
        // throw error
    }
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
    // var expression = new c.Expression(toAttribute);
    // expression.times(multiplier);
    var expression = c.Expression.fromVariable(toAttribute).times(multiplier);

    console.log(expression)

    // return autolayout.eq(itemAttribute, 500, autolayout.required);

    // console.log(expression)
    // var times = autolayout.times(multiplier, toAttribute, autolayout.weak, 0);
    // var solve =  autolayout.plus(times, constant, autolayout.weak, 0);

    // @adam, this works...
    // return related(
    //     itemAttribute,
    //     500,
    //     autolayout.weak,
    //     2
    // );

    // this doesn't...
    return related(
        itemAttribute,
        expression,
        autolayout.weak,
        2
    );



};

});
