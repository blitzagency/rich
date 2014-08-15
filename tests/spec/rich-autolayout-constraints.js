define(function(require, exports, module) {

jasmine.DEFAULT_TIMEOUT_INTERVAL = 30000;

describe('Auto Layout + Constraints:', function() {

    it('creates constraint', function(){
         var c = new constraints.Constraint();
         expect(c.cid).not.toEqual(undefined);
    });

    it('creates unique constraints', function(){
         var c1 = new constraints.Constraint();
         var c2 = new constraints.Constraint();
         expect(c1.cid).not.toEqual(c2.cid);
    });

    it('creates constraint with JSON', function(){
         var json = {
            item: 'foo',
            attribute: 'left',
            relatedBy: '==',
            toItem: 'superview',
            toAttribute: 'left',
            constant: 20,
            multiplier: 2,
            priority: 20
         };

         var c1 = constraints.constraintWithJSON(json);
         expect(c1.attributes).toEqual(json);
    });

    it('creates constraints with VFL', function(){
         var json = {
            item: 'foo',
            attribute: 'height',
            relatedBy: '==',
            toItem: null,
            toAttribute: null,
            constant: 200,
            multiplier: 1,
            priority: 2
         };

         var vfl = 'V:[foo(200)]';

         var c = constraints.constraintsWithVFL(vfl);
         expect(c.length).toEqual(1);
         expect(c[0].cid).not.toEqual(undefined);
         expect(c[0].attributes).toEqual(json);
    });

}); // eof describe
}); // eof define
