define(function (require, exports, module) {
    require('./cassowary/c');
    var utils = require('./utils');

    var cassowary = c;
    delete c;
    var weak = exports.weak = cassowary.Strength.weak;
    var medium = exports.medium = cassowary.Strength.medium;
    var strong = exports.strong = cassowary.Strength.strong;
    var required = exports.required = cassowary.Strength.required;

    var eq  = function(a1, a2, strength, w) {
      return new cassowary.Equation(a1, a2, strength || weak, w||0);
    };
    var neq = function(a1, a2, a3) { return new cassowary.Inequality(a1, a2, a3); };
    var geq = function(a1, a2, str, w) { return new cassowary.Inequality(a1, cassowary.GEQ, a2, str, w); };
    var leq = function(a1, a2, str, w) { return new cassowary.Inequality(a1, cassowary.LEQ, a2, str, w); };

    var stay = function(v, strength, weight) {
      return new cassowary.StayConstraint(v, strength || weak, weight || 1.0);
    };
    var weakStay     = function(v, w) { return stay(v, weak, w); };
    var mediumStay   = function(v, w) { return stay(v, medium, w); };
    var strongStay   = function(v, w) { return stay(v, strong, w); };
    var requiredStay = function(v, w) { return stay(v, required, w); };

    var plus  = function(a1, a2) { return cassowary.plus(a1, a2); };
    var minus = function(a1, a2) { return cassowary.minus(a1, a2); };
    var times = function(a1, a2) { return cassowary.times(a1, a2); };
    var div   = function(a1, a2) { return cassowary.divide(a1, a2); };
    var cv    = function(n, val) {
      return new cassowary.Variable({ name: n, value: val });
    };


    module.exports.cassowary = cassowary;
    exports.eq = eq;
    exports.neq = neq;
    exports.geq = geq;
    exports.leq = leq;
    exports.stay = stay;
    exports.weakStay = weakStay;
    exports.mediumStay = mediumStay;
    exports.strongStay = strongStay;
    exports.requiredStay = requiredStay;
    exports.plus = plus;
    exports.minus = minus;
    exports.times = times;
    exports.div = div;
    exports.cv = cv;
    exports.constraintsFromJson = utils.constraintsFromJson;
});
