{
    /*
     * All build file options are documented here:
     * https://github.com/jrburke/r.js/blob/master/build/example.build.js
     */

    /*
     * The top level directory that contains your app.
     * If this option is used then it assumed your scripts are in a
     * subdirectory under this path.
     */
    appDir: './src',

    /*
     * By default, all modules are located relative to this path. If baseUrl
     * is not explicitly set, then all modules are loaded relative to
     * the directory that holds the build file. If appDir is set, then
     * baseUrl should be specified as relative to the appDir.
     */
    // baseUrl: './src',

    /*
     * The directory path to save the output. If not specified, then
     * the path will default to be a directory called "build" as a sibling
     * to the build file.
     */
    //dir: './dist',

    /*
     * If you prefer the "main" JS file configuration
     * to be read for the build so that you do not have to duplicate the values
     * in a separate configuration, set this property to the location of that
     * main / config JS file. The first requirejs({}), require({}),
     * requirejs.config({}), or require.config({}) call found in that
     * file will be used.
     */
    mainConfigFile: 'src/static/js/common.js',

    /*
    * How to optimize all the JS files in the build output directory.
    * Right now only the following values
    * are supported:
    * - "uglify": (default) uses UglifyJS to minify the code.
    * - "uglify2": in version 2.1.2+. Uses UglifyJS2.
    * - "none": no minification will be done.
    */
    optimize: 'uglify2',

    /*
     * Uglify2 Options
     * For possible values see:
     * http://lisperator.net/uglifyjs/codegen
     * http://lisperator.net/uglifyjs/compress
     */
    uglify2: {
        output: {
            beautify: false // true outputs more readble minified code
        },
        compress: {
            sequences     : true,  // join consecutive statemets with the “comma operator”
            properties    : true,  // optimize property access: a["foo"] → a.foo
            dead_code     : true,  // discard unreachable code
            drop_debugger : true,  // discard “debugger” statements
            unsafe        : true,  // some unsafe optimizations (see below)
            conditionals  : true,  // optimize if-s and conditional expressions
            comparisons   : true,  // optimize comparisons
            evaluate      : true,  // evaluate constant expressions
            booleans      : true,  // optimize boolean expressions
            loops         : true,  // optimize loops
            unused        : true,  // drop unused variables/functions
            hoist_funs    : true,  // hoist function declarations
            hoist_vars    : false, // hoist variable declarations
            if_return     : true,  // optimize if-s followed by return/continue
            join_vars     : true,  // join var declarations
            cascade       : true,  // try to cascade `right` into `left` in sequences
            side_effects  : true,  // drop side-effect-free statements
            warnings      : false,  // warn about potentially dangerous optimizations/code
            global_defs   : {}     // global definitions
        }
    },

    /*
     * CSS Optimizations.
     * - standard: @import inlining, comment removal and line returns.
     * - standard.keepLines: like "standard" but keeps line returns.
     * - standard.keepComments: keeps the file comments, but removes line returns.
     * - standard.keepComments.keepLines: keeps the file comments and line returns.
     * - none: skip CSS optimizations.
     */
    // CSS compression is handled by compass / scss
    optimizeCss: 'none',
    removeCombined: true,
    inlineText: true,
    skipDirOptimize: true,

    pragmasOnSave: {
        //removes Handlebars.Parser code (used to compile template strings) set
        //it to `false` if you need to parse template strings even after build
        excludeHbsParser : true,
        // kills the entire plugin set once it's built.
        excludeHbs: true,
        // removes i18n precompiler, handlebars and json2
        excludeAfterBuild: true
    },


    /*
     * List the modules that will be optimized. All their immediate and deep
     * dependencies will be included in the module's file when the build is done.
     */
    /*
     * List the modules that will be optimized. All their immediate and deep
     * dependencies will be included in the module's file when the build is done.
     */
    modules: [

        {
            name: 'common',
            include: [
            'app/renderer',
            'app/vent',
            'backbone',
            'handlebars',
            'hbs',
            'jquery',
            'marionette',
            'underscore'
            ]
        },
        {
            name: 'main',
            exclude: ['common']
        }
    ]
}