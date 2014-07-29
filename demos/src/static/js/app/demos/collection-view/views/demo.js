 define(function (require, exports, module) {

var backbone = require('backbone');
var rich = require('rich');
var Modifier = require('famous/core/Modifier');
var Transform = require('famous/core/Transform');
var app = require('app/famous/core');
var ActionsView = require('./actions-view').ActionsView;
var ButtonCollectionView = require('./collection-view').ButtonCollectionView;


var actionsModifier = new Modifier({
        transform: Transform.translate(0, 0, 0)
});

var collectionModifier = new Modifier({
        transform: Transform.translate(0, 60, 0)
});

var CollectionViewDemo = rich.LayoutView.extend({

    regions:{
        actions: app.Region.extend({modifier: actionsModifier}),
        list: app.Region.extend({modifier: collectionModifier})
    },

    shouldInitializeRenderable: function(){
        return false;
    },

    onShow : function(){
        this.data = new backbone.Collection();
        this.actionsView = new ActionsView();
        this.collectionView = new ButtonCollectionView({collection: this.data});

        this.listenTo(this.actionsView, 'add', this.wantsAddButton);
        this.listenTo(this.collectionView, 'childview:remove', this.wantsRemoveButton);

        this.actions.show(this.actionsView);
        this.list.show(this.collectionView);
    },

    wantsAddButton: function(){
        this.data.add({label: 'option'});
    },

    wantsRemoveButton: function(view){
        this.data.remove(view.model);
    }
});

exports.CollectionViewDemo = CollectionViewDemo;

});
