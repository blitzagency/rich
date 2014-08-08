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
    var leftExpression = itemAttribute;
    var rightExpression;
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
    var itemIsAncestor = (item.superview == toItem);
    var isSize = itemAttribute.name == 'width' || itemAttribute.name == 'height';

    // console.log(itemIsAncestor)
    if((itemIsAncestor && !isSize) || !toAttribute){
        rightExpression = constant;
        stays = [toItem._autolayout.height, toItem._autolayout.width];
        // do we want to set a strength if they are only modifying a prop?
        // strength = autolayout.strong;
    } else {
        var result = buildExpression(item, itemAttribute, toItem, toAttribute, multiplier, constant);
        rightExpression = result.rightExpression;
        leftExpression = result.leftExpression;
        stays = result.stays;
        toItem._constraintRelations[item.cid] = item;
    }
    // console.log(item.name)
    if(item.name == 'action4'){
        console.log('action4')
        console.log(item.superview._autolayout.width.value)
    }

    if(item.name == 'footer'){
        console.log('footer')
        console.log(item.superview._autolayout.width.value)
    }
    var constraint = related(
        leftExpression,
        rightExpression,
        strength,
        2
    );

    return {
        constraint: constraint,
        stays: stays
    };
};

function buildExpression(item, itemAttribute, toItem, toAttribute, multiplier, constant){
    var leftExpression = itemAttribute;
    var rightExpression;
    var value = toAttribute;
    var stays = [toAttribute];

    // lets get contextual. If item and toItem share the same
    // superview left, right, top and bottom are in relation
    // to each other not the walls of their superview.
    var itemsAreLeaves = (item.superview == toItem.superview);

    if(itemsAreLeaves){

        switch(toAttribute.name){
            case 'right':
                value = autolayout.plus(toItem._autolayout.left, toItem._autolayout.width);
                stays = [toItem._autolayout.left, toItem._autolayout.width, toItem._autolayout.right];

                if(itemAttribute.name == 'right'){
                    leftExpression = autolayout.plus(item._autolayout.left, item._autolayout.width);
                }
                break;

            case 'bottom':
                value = autolayout.plus(toItem._autolayout.top, toItem._autolayout.height);
                stays = [toItem._autolayout.top, toItem._autolayout.height, toItem._autolayout.bottom];

                if(itemAttribute.name == 'bottom'){
                    leftExpression = autolayout.plus(item._autolayout.top, item._autolayout.height);
                }
                break;

            case 'left':
                value = autolayout.plus(toItem._autolayout.right, toItem._autolayout.width);
                stays = [toItem._autolayout.right, toItem._autolayout.width, toItem._autolayout.right];

                if(itemAttribute.name == 'left'){
                    leftExpression = autolayout.plus(item._autolayout.right, item._autolayout.width);
                }
                break;

            case 'top':
                value = autolayout.plus(toItem._autolayout.bottom, toItem._autolayout.height);
                stays = [toItem._autolayout.bottom, toItem._autolayout.height, toItem._autolayout.bottom];

                if(itemAttribute.name == 'top'){
                    leftExpression = autolayout.plus(item._autolayout.bottom, item._autolayout.height);
                }
                break;
        }
    }
    // } else {
    //     switch(toAttribute.name){
    //         case 'right':


    //             constant = -1 * constant;
    //             leftExpression = autolayout.plus(item._autolayout.left, item._autolayout.width);
    //             value = autolayout.plus(toItem._autolayout.left, toItem._autolayout.width);

    //             stays = [toItem._autolayout.left, toItem._autolayout.right];

    //             if(item.name == 'action2'){
    //                 // console.log('-- autolayout.utils.js [Line 147]');
    //                 // console.log(toItem.name);
    //                 // console.log(toItem._autolayout.left.value);
    //                 // console.log(toItem._autolayout.width.value);
    //                 // console.log(toItem.superview.name)
    //                 // console.log(toItem.superview._autolayout.left.value)
    //                 // console.log(toItem.superview._autolayout.right.value)
    //                 // console.log(toItem.superview._autolayout.width.value)
    //                 // console.log(item.name);
    //                 // console.log(item._autolayout.left.value);
    //                 // console.log(item._autolayout.right.value);
    //                 // console.log(item._autolayout.width.value);
    //             }
    //         break;
    //     }
    // }

    var times = autolayout.times(multiplier, value, autolayout.weak, 0);
    rightExpression = autolayout.plus(times, constant, autolayout.weak, 0);

    return {
        rightExpression: rightExpression,
        leftExpression: leftExpression,
        stays: stays
    };
}

});
