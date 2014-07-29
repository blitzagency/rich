// karma.conf.js
module.exports = function(config) {
  config.set({
    frameworks: ['jasmine', 'requirejs'],

    files: [
        {pattern: 'src/static/js/common.js', included: true},
        {pattern: 'src/static/js/app/**/*.js', included: false},
        {pattern: 'src/static/js/app/**/*.html', included: false},
        {pattern: 'src/static/js/vendor/**/*.js', included: false, served: true},
        {pattern: 'src/static/js/specs/**/*.js', included: false, served: true},
        {pattern: 'src/static/js/specs/**/*.html', included: false, served: true},

        'src/static/js/karma-main.js'
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