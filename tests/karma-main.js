var tests = [
    'lib/jasmine/jasmine-jquery',
    // Load mocks and vendor init
    //'tests/mocks/init',

    'spec/rich-layout',

];

requirejs.config({
    baseUrl: '/base/tests',

    shim: {
        'lib/jasmine/jasmine-jquery': {
            'deps': ['jquery']
        },
    },

    deps: tests,

    callback: function(){
        jasmine.getFixtures().fixturesPath = '/base/tests/fixtures';
        window.__karma__.start();
    }
});
