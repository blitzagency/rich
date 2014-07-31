define(function(require, exports, module) {

// Imports

var _ = require('underscore');
var $ = require('jquery');
var rich = require('rich');
var Modifier = require('famous/core/Modifier');

describe('Utils:', function() {
    var region;
    var $el;

    beforeEach(function() {
        loadFixtures('famous.html');

        region = new rich.Region({
            el: '#famous-context'
        });

        $el = region.el;
        expect($el.length).toBe(1);
    });

    afterEach(function() {
        region = null;
    });


    it('modifierWithTransform', function(){

        var modifier = rich.utils.modifierWithTransform({
            transform: [0, 0, 0]
        });

        expect(modifier).not.toBe(undefined);

    });

}); // eof describe
}); // eof define
