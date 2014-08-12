var tests = [
    'tests/vendor/jasmine/jasmine-jquery',
    // Load mocks and vendor init
    //'tests/mocks/init',

    'tests/spec/rich-vfl',
    // 'tests/spec/rich-view-subviews',
    // 'tests/spec/rich-autolayout',
    // 'tests/spec/rich-autolayout-modifiers',
    // 'tests/spec/rich-layout',
    // 'tests/spec/rich-region',
    // 'tests/spec/rich-utils',
    // 'tests/spec/rich-view-className',
    // 'tests/spec/rich-view-core',
    // 'tests/spec/rich-view-size',
    // 'tests/spec/rich-view-zindex',

];

requirejs.config({
    baseUrl: '/base',

    shim: {
        'tests/vendor/jasmine/jasmine-jquery': {
            'deps': ['jquery']
        },
    },

    deps: tests,

    callback: function(){
        jasmine.getFixtures().fixturesPath = '/base/tests/fixtures';
        window.__karma__.start();
    }
});
