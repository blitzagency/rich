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
    var toAttribute;
    var multiplier = json.multiplier || 1;
    var constant = json.constant || 0;
    var itemAttribute = item._autolayout[json.attribute];
    var leafs = false;
    var related;
    var solve;
    var strength = autolayout.weak;
    var stays = [];

    if(json.toItem == 'superview'){
        toItem = view;
    }else{
        toItem = view[json.toItem] || view;
    }

    toAttribute = toItem._autolayout[json.toAttribute] || false;


    // what kind of equation do we need:
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

    if(!toAttribute){
        solve = constant;
        // do we want to set a strength if they are only modifying a prop?
        // strength = autolayout.strong;
    } else {
        var result = buildExpression(item, toItem, toAttribute, multiplier, constant);
        solve = result.expression;
        stays = result.stays;
        toItem._constraintRelations[item.cid] = item;
    }

    var constraint = related(
        itemAttribute,
        solve,
        strength,
        2
    );

    return {
        constraint: constraint,
        stays: stays
    };
};

function buildExpression(item, toItem, toAttribute, multiplier, constant){
    var value = toAttribute;
    var stays = [toAttribute];

    // lets get contextual. If item and toItem share the same
    // superview left, right, top and bottom are in relation
    // to each other not the walls of their superview.
    itemsAreLeaves = (item.superview == toItem.superview);

    console.log('-- expression for \'' + item.name + '\' -> \'' + toItem.name + '\'');

    if(itemsAreLeaves){
        console.log('-- laeves \'' + item.name + '\' & \'' + toItem.name + '\'');

        switch(toAttribute.name){
            case 'right':
                value = autolayout.plus(toItem._autolayout.left, toItem._autolayout.width);
                stays = [toItem._autolayout.left, toItem._autolayout.width];
                break;

            case 'bottom':
                value = autolayout.plus(toItem._autolayout.top, toItem._autolayout.height);
                stays = [toItem._autolayout.top, toItem._autolayout.height];
                break;
        }
    }

    var times = autolayout.times(multiplier, value, autolayout.weak, 0);
    var expression = autolayout.plus(times, constant, autolayout.weak, 0);

    return {
        expression: expression,
        stays: stays
    };
}

});
