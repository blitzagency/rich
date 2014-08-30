define(function (require, exports, module) {

    var _ = require('underscore');
    var backbone = require('backbone');
    var utils = require('./utils');

    function constraintWithJSON(json){
        return new Constraint(json);
    }


    function constraintsWithVFL(vfl, views){
        var result = [];
        json = utils.VFLToJSON(vfl);

        for(var i = 0; i < json.length; i++){
            var each = json[i];

            if(views){
                each.item = views[each.item] || each.item;
                each.toItem = views[each.toItem] || each.toItem;
            }

            result.push(constraintWithJSON(each));
        }


        return result;
    }

    var Constraint = backbone.Model.extend({
        _constraint: null,
        _stays: null,
        _solver: null,
        _item: null,

        defaults: {
            item: null,
            attribute: null,
            relatedBy: '==',
            toItem: null,
            toAttribute: null,
            constant: 0,
            multiplier: 1,
            priority: 5,
        },

        constructor: function(){
            backbone.Model.prototype.constructor.apply(this, arguments);
        },

        prepare: function(view){
            var obj = utils.constraintsFromJson(this.attributes, view);
            this._constraint = obj.constraint;
            this._stays = obj.stays;
            this._solver = obj.item._solver;
            this._item = obj.item;
            this._json = obj.json;
        }
    });

    exports.Constraint = Constraint;
    exports.constraintsWithVFL = constraintsWithVFL;
    exports.constraintWithJSON = constraintWithJSON;
});
