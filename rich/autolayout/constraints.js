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
        }
    });

    exports.Constraint = Constraint;
    exports.constraintsWithVFL = constraintsWithVFL;
    exports.constraintWithJSON = constraintWithJSON;
});
