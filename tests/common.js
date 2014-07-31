require.config({
  baseUrl: './',

  paths : {
    'marionette': 'lib/vendor/backbone/marionette',
  },

   packages: [

        {
            location: '../rich',
            name: 'rich',
            main: 'init'
        },

        {
            location: 'lib/vendor/famous',
            name: 'famous',
        },

        {
            location: 'lib/vendor/jquery',
            name: 'jquery',
            main:'jquery'
        },

        {
            location: 'lib/vendor/animation/greensock',
            name: 'greensock',
            main:'greensock'
        },

        {
            location: 'lib/vendor/backbone',
            name: 'backbone',
            main:'backbone'
        },

        {
            location: 'lib/vendor/require/hbs',
            name: 'hbs',
            main:'hbs'
        }
    ],

    map: {
        '*': {
            'underscore': 'lib/vendor/underscore/lodash',
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
