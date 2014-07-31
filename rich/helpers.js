define(function (require, exports, module) {

function throwError(message, name) {
    var error = new Error(message);
    error.name = name || 'Error';
    throw error;
}

exports.throwError = throwError;

});
