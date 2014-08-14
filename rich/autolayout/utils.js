define(function (require, exports, module) {

var backbone = require('backbone');
var autolayout = require('./init');
var c = autolayout.cassowary;
var vfl = require('./vfl');


function hashJSONConstraints(json, view){
    var data = [];

    for(var i = 0; i < json.length; i++){
        var each = json[i];
        data.push(serializeConstraintJSON(each, view));
    }

    data.sort();

    // we could ACTUALLY hash this, but it would require a dependency on a hash
    // lib, for now we are just leaving it. adding a hash lib here should
    // break nothing if it's required.
    var hash = data.join('|');
    return hash;
}

function serializeConstraintJSON(json, view){
    var item = _.isString(json.item) ? view[json.item] : json.item;

    var attribute = json.attribute || '';
    var relatedBy = json.relatedBy;
    var toAttribute = json.toAttribute || null;
    var constant = json.constant || 0;
    var multiplier = json.multiplier || 1;
    var toItem;

    if(json.toItem === undefined){
        toItem = null;
    } else {
        if(json.toItem == 'superview'){
            toItem = item.superview.cid;
        } else {
            toItem = _.isString(json.toItem) ? view[json.toItem].cid : json.toItem.cid;
        }
    }

    return [item.cid, attribute, relatedBy, toItem, toAttribute, constant, multiplier].join(':');
}


function getRelation(relation){
    switch(constraint.relation){
        case 'equal':
            return '==';
        case 'greaterOrEqual':
            return '>=';
        case 'lessOrEqual':
            return '<=';
        default:
            return '==';
    }
}

exports.constraintsFromJson = function(json, view){
    // item: 'navigation',
    // attribute: 'width',
    // relatedBy: '==', // '==|>=|<='
    // toItem: 'superview', //'null is superview'
    // toAttribute: 'width',
    // multiplier: 0.5,
    // constant: 0
    // console.log(json)

    var item = _.isString(json.item) ? view[json.item] : json.item;
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
    } else {

        if(_.isUndefined(json.toItem)){
            toItem = view;
        } else {
            toItem = _.isString(json.toItem) ? view[json.toItem] : json.toItem;
        }
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
    var askingForParentsSize = toAttribute.name == 'width' || toAttribute.name == 'height';


    if((itemIsAncestor && !askingForParentsSize) || !toAttribute){
        // enter this block if you are asking to relate to your parents
        // left/right/top/bottom, as those in relative space will
        // always be 0's
        rightExpression = constant;
    } else {
        var result = buildExpression(item, itemAttribute, toItem, toAttribute, multiplier, constant);
        rightExpression = result.rightExpression;
        leftExpression = result.leftExpression;
        stays = result.stays;
    }

    var historyKey = item.cid;
    var history = toItem._constraintRelations.get(historyKey);

    if(!history){
        history = new backbone.Model();
        toItem._constraintRelations.set(historyKey, history);
    }

    if(toAttribute){
        var val = history.get(toAttribute.name) || 1;
        history.set(toAttribute.name, val++);
    }

    var constraint = related(
        leftExpression,
        rightExpression,
        strength,
        2
    );

    return {
        constraint: constraint,
        stays: stays,
        solver: item._solver,
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

exports.VFLToJSON = function(str){
    var response = [];
    var parsed = vfl.parse(str);
    var template, i, j, out, constraints;
    var cascadeLimit = parsed.cascade.length - 2;
    var output = {
        item: null,
        attribute: null,
        relatedBy: null,
        toItem: 'superview',
        toAttribute: null,
        multiplier: 1,
        constant: 0,
    };

    var orientation = parsed.orientation;
    var innerAttribute = 'left';
    var outterAttribute = 'right';
    if(orientation != 'horizontal'){
        innerAttribute = 'top';
        outterAttribute = 'bottom';
    }

    // first run through everything and handle the left/right's
    for (i = 0; i < cascadeLimit; i += 2) {
        // store things here temporarily
        template = {
            element:parsed.cascade[i].view,
            toElement: parsed.cascade[i + 2].view
        };
        constraints = parsed.cascade[i + 1];
        out = _.clone(output);

        for (j = 0; j < constraints.length; j++) {
            constraint = _.extend({}, template, constraints[j]);
            if(constraint.constant == 'default'){
                console.log('handle default space');
            }
            out.relatedBy = getRelation(constraint.relation);
        }
        if(_.isNull(constraint.element)){
            // left/top
            out.attribute = innerAttribute;
            out.item = constraint.toElement;
            out.toAttribute = innerAttribute;
        }else if(_.isNull(constraint.toElement)){
            // right/bottom
            out.attribute = outterAttribute;
            out.toAttribute = outterAttribute;
            out.item = constraint.element;
        }else{
            // related to something else...
            out.toItem = constraint.element;
            out.item = constraint.toElement;
            out.attribute = innerAttribute;
            out.toAttribute = outterAttribute;
        }
        out.constant = constraint.constant;
        response.push(out);


    }

    // handle the parts like foo(100) (width)
    for (i = 0; i < cascadeLimit; i += 2) {
        constraints = parsed.cascade[i].constraints;
        if (!constraints || !constraints.length) {
            continue;
        }
        template = {
            element: parsed.cascade[i].view
        };
        for (j = 0; j < constraints.length; j++) {
            constraint = _.extend({}, template, constraints[j]);
        }

        out = _.clone(output);

        out.item = template.element;
        out.attribute = parsed.orientation == 'vertical' ? 'height' : 'width';
        out.constant = constraint.constant;
        out.relatedBy = getRelation(constraint.relation);
        if(constraint.view){
            out.toItem = constraint.view;
            out.toAttribute = out.attribute;
        }else{
            delete out.toItem;
            delete out.toAttribute;
        }
        response.push(out);
    }
    return response;
};


exports.serializeConstraintJSON = serializeConstraintJSON;
exports.hashJSONConstraints = hashJSONConstraints;

});
