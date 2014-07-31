var tests = [
    'tests/lib/jasmine/jasmine-jquery',
    // Load mocks and vendor init
    //'tests/mocks/init',

    'tests/spec/rich-layout',
    'tests/spec/rich-utils',

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
