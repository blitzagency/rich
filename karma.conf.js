// karma.conf.js
module.exports = function(config) {
  config.set({
    frameworks: ['jasmine', 'requirejs'],

    files: [
        {pattern: 'tests/common.js', included: true},
        {pattern: 'tests/fixtures/*.html', included: false},
        {pattern: 'tests/spec/rich*.js', included: false},
        {pattern: 'tests/lib/**/*.js', included: false},
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
    singleRun: false

  });
};
