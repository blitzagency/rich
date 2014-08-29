// karma.conf.js
module.exports = function(config) {

  // var customLaunchers = {
  //   sl_chrome: {
  //     base: 'SauceLabs',
  //     browserName: 'chrome',
  //     platform: 'OS X 10.9',
  //     version: '35'
  //   }
  // };

  // if (!process.env.SAUCE_USERNAME) {
  //   if (!fs.existsSync('sauce.json')) {
  //     console.log('Create a sauce.json with your credentials based on the sauce-sample.json file.');
  //     process.exit(1);
  //   } else {
  //     process.env.SAUCE_USERNAME = require('./sauce').username;
  //     process.env.SAUCE_ACCESS_KEY = require('./sauce').accessKey;
  //   }
  // }

  config.set({
    frameworks: ['jasmine', 'requirejs'],

    files: [
        {pattern: 'tests/common.js', included: true},
        {pattern: 'tests/fixtures/*.html', included: false},
        {pattern: 'tests/fixtures/test.css', included: true},
        {pattern: 'tests/spec/*.js', included: false},
        {pattern: 'tests/vendor/**/*.js', included: false},
        {pattern: 'tests/utils/*.js', included: false},
        {pattern: 'rich/**/*.js', included: false},
        {pattern: 'demos/src/static/js/**/*.js', included: false},
        {pattern: 'demos/src/static/js/**/*.html', included: false},
        {pattern: 'demos/src/static/css/styles.css', included: true},

        'tests/karma-main.js'
    ],

    preprocessors: {
        'rich/**/*.js': 'coverage'
    },

    exclude: [
        '**/karma.conf.js'
    ],

    reporters: ['dots'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['Chrome'],
    // browsers: ['Firefox'],
    // browsers: ['Safari'],
    // browsers: ['Chrome', 'Firefox'],
    singleRun: false,
    plugins : [
        'karma-chrome-launcher',
        'karma-firefox-launcher',
        'karma-safari-launcher',
        'karma-sauce-launcher',
        'karma-jasmine',
        'karma-coverage',
        'karma-requirejs'
    ],
    // sauceLabs: {
    //     testName: 'Web App Unit Tests'
    // },
    // captureTimeout: 120000,
    // customLaunchers: customLaunchers,
    // browsers: Object.keys(customLaunchers),
  });
};
