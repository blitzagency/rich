define(function (require, exports, module) {
    var GenericSync = require('famous/inputs/GenericSync');
    // had to reimport these vs grabbing from scrollview due to cirular imports
    var DIRECTION_X = GenericSync.DIRECTION_X;
    var DIRECTION_Y = GenericSync.DIRECTION_Y;

    return {
        normalizeVector: function(vector, direction){
            // normalize the data based on direction
            if(direction == DIRECTION_Y){
                vector[0] = 0;
                if(this._scrollDirection == 'x' && this.getDirectionalLockEnabled())return [0, 0];
            }else if(direction == DIRECTION_X){
                vector[1] = 0;
                if(this._scrollDirection == 'y' && this.getDirectionalLockEnabled())return [0, 0];
            }
            return vector;
        }
    }
});
