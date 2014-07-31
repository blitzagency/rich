var tests = [
    'tests/lib/jasmine/jasmine-jquery',

    'tests/spec/rich-layout',

];

requirejs.config({
    baseUrl: '/base',

    shim: {
        'tests/lib/jasmine/jasmine-jquery': {
            'deps': ['jquery']
        },
    },

    deps: tests,

    callback: function(){
        jasmine.getFixtures().fixturesPath = '/base/tests/fixtures';
        window.__karma__.start();
    }
});
