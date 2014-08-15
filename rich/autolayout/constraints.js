define(function (require, exports, module) {

    var _ = require('underscore');
    var backbone = require('backbone');
    var utils = require('./utils');

    function constraintWithJSON(json){
        return new Constraint(json);
    }


    function constraintsWithVFL(vfl){
        var result = [];
        json = utils.VFLToJSON(vfl);

        for(var i = 0; i < json.length; i++){
            result.push(constraintWithJSON(json[i]));
        }

        return result;
    }

    var Constraint = backbone.Model.extend({
        _constraint: null,
        _stays: null,
        _solver: null,

        defaults: {
            item: null,
            attribute: null,
            relatedBy: '==',
            toItem: null,
            toAttribute: null,
            constant: 0,
            multiplier: 1,
            priority: 2,
        },

        constructor: function(){
            backbone.Model.prototype.constructor.apply(this, arguments);
        },

        prepare: function(view){
            var obj = utils.constraintsFromJson(this.attributes, view);
            this._constraint = obj.constraint;
            this._stays = obj.stays;
            this._solver = obj.solver;
        }
    });

    exports.Constraint = Constraint;
    exports.constraintsWithVFL = constraintsWithVFL;
    exports.constraintWithJSON = constraintWithJSON;
});
