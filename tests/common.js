require.config({
  baseUrl: './',

  paths : {
    'marionette': 'demos/src/static/js/vendor/backbone/marionette',
  },

   packages: [

        {
            location: 'rich',
            name: 'rich',
            main: 'init'
        },

        {
            location: 'demos/src/static/js/app',
            name: 'app',
        },

        {
            location: 'demos/src/static/js/vendor/famous',
            name: 'famous',
        },

        {
            location: 'demos/src/static/js/vendor/jquery',
            name: 'jquery',
            main:'jquery'
        },

        {
            location: 'demos/src/static/js/vendor/animation/greensock',
            name: 'greensock',
            main:'greensock'
        },

        {
            location: 'demos/src/static/js/vendor/backbone',
            name: 'backbone',
            main:'backbone'
        },

        {
            location: 'demos/src/static/js/vendor/require/hbs',
            name: 'hbs',
            main:'hbs'
        }
    ],

    map: {
        '*': {
            'underscore': 'demos/src/static/js/vendor/underscore/lodash',
            'handlebars': 'hbs/handlebars'
        }
    },

  hbs: {
        templateExtension : 'html',
        // if disableI18n is `true` it won't load locales and the i18n helper
        // won't work as well.
        disableI18n : true,
  },

  shim : {

    'backbone': {
        'deps': ['jquery', 'underscore'],
        'exports': 'Backbone'
    },

    'backbone/stickit' : {
      'deps' : ['backbone'],
      'exports' : 'Stickit'
    },

    'jquery/mockjax': {
        'deps': ['jquery'],
        'exports': 'jquery'
    },

    'jquery/jquery.scrollmagic': {
        'deps': ['jquery'],
        'exports': 'jquery'
    },

    'jquery/jquery.scrollmagic.debug': {
        'deps': ['jquery', 'jquery/jquery.scrollmagic'],
        'exports': 'jquery'
    },

    'marionette': {
        'deps': ['jquery', 'underscore', 'backbone'],
        'exports': 'Marionette'
    }
  }

});
