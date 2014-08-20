define(function (require, exports, module) {

var rich = require('rich');
var backbone = require('backbone');

var NavigationView = require('app/navigation/views/navigation-view').NavigationView;
var NavigationModel = require('app/navigation/models/navigation').NavigationModel;

// examples
var Action4 = require('app/demos/action-4/views/long-view').demo.js;

var AppContainer = rich.View.extend({
    constraints: [
        {
            item: 'navigation',
            attribute: 'height',
            relatedBy: '==',
            constant: 100
        },
        {
            item: 'contentRegion',
            attribute: 'top',
            relatedBy: '==',
            constant: 100
        },
        {
            item: 'contentRegion',
            attribute: 'height',
            relatedBy: '==',
            toItem:'superview',
            toAttribute: 'height',
            constant: -100,
        },
    ],
    initialize : function(){

        var navigation = this.navigation = new NavigationView({
            collection: new backbone.Collection([
                new NavigationModel({
                    label: 'Constraints Layout',
                    view: Action4
                })
            ])
        });
        this.listenTo(navigation, 'childview:navigate', this.onNavigate);


        var contentRegion = this.contentRegion = new rich.View();

        this.addSubview(this.contentRegion);
        this.addSubview(navigation);
    },

    onNavigate: function(view){
        var model = view.model;
        var LoadView = model.get('view');
        var view = new LoadView();
        if(this._currentView) {
            this.contentRegion.removeSubview(view);
        }
        this.contentRegion.addSubview(view);
        this._currentView = view;
    },


});

exports.AppContainer = AppContainer;

});
