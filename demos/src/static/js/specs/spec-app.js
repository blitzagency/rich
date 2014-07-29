define(function(require, exports, module) {

describe('my description', function() {

     beforeEach(function() {
        loadFixtures('template.html');
    });

    it('should succeed', function() {
        var $node = $('#foo');
        console.log($node.text());
        expect(true).toBe(true);
    });

});
});