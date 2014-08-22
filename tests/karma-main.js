var tests = [
    'tests/vendor/jasmine/jasmine-jquery',
    // Load mocks and vendor init
    //'tests/mocks/init',

    // 'tests/spec/rich-autolayout-constraints',
    // 'tests/spec/rich-autolayout-modifiers',
    // 'tests/spec/rich-autolayout-utils',
    // 'tests/spec/rich-autolayout',
    // 'tests/spec/rich-collectionview',
    // 'tests/spec/rich-itemview-events',
    // 'tests/spec/rich-region',
    // 'tests/spec/rich-view-animate',
    // 'tests/spec/rich-scrollview',
    // 'tests/spec/rich-utils',
    'tests/spec/rich-vfl',
    'tests/spec/rich-view-className',
    'tests/spec/rich-view-constraints',
    'tests/spec/rich-view-core',
    'tests/spec/rich-view-size',
    'tests/spec/rich-view-subviews',
    'tests/spec/rich-view-zindex',

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
