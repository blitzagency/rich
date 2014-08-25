[Famo.us]: https://github.com/famous/famous "Famo.us"
[Marionette.js]: https://github.com/marionettejs/backbone.marionette "Marionette.js"
[Demos]: https://github.com/blitzagency/rich/tree/develop/demos/src/static/js/app/demos "Demos"
[Cassowary]: https://github.com/slightlyoff/cassowary.js/ "Cassowary"
[Backbone]: http://backbonejs.org/ "Backbone"
[BLITZ]: http://www.blitzagency.com/ "BLITZ"

Rich
=======

[![Build Status](https://travis-ci.org/blitzagency/rich.svg?branch=develop)](https://travis-ci.org/blitzagency/rich)

Welcome to Rich, a GitHub Repo.

_(Rich + Famo.us - get it?)_

## Get Started Now

https://github.com/blitzagency/rich-bootstrap

## Demos
 * [Rich Demos](http://blitzagency.github.io/rich/demos/src/)


## About
Rich is [BLITZ][]'s take on a [Famo.us][] + [Marionette.js][] framework.  It allows you to write code that looks and feels like [Marionette.js][] but with all of the power of [Famo.us].

We are currently in very active development, it's only 4 weeks old (as of 2014-08-21), and things WILL change on a daily/weekly basis.  This includes core api, adding/removing of things, and a huge amount of instability.  Please keep this in mind if you decide to try things out.

Did we get some things wrong? You bet. Did we get some things right? We don't know yet =)

It is an open source project, so please feel free to rant/rave/contribute as you see fit. Bugs are always welcome, as are better ways to handle some of the problems we are trying to solve. By no means, for example, are we masters of [Cassowary][] yet.

## Approach
The intent behind Rich is to keep [Marionette.js][] intact where it makes sense but backing it with [Famo.us].  We have kept nearly all [Marionette.js][] logic and are currently built on top of the latest [Marionette.js][], 2.1.0 at the time of this writing.

## Why Marionette?
We love vanilla Backbone but the the fact is you pretty much need to write something like a [Marionette.js][] to make it vanilla Backbone even more productive. Rather than write that ourselves, we'd rather stand on the shoulders of the people who have already considered the ins and outs of that. Additionally, we have standardized our own internal workflow when it comes to HTML UI around [Marionette.js][], so it made sense for us to keep our devs in familiar territory.


## What do I get?
Rich follows the same ideology as [Marionette.js][] but due to how [Famo.us] rolls, we had to tweek a few things.  First off we don't have LayoutViews(Layouts for those using Marionette 1.x).  The concept of a layout isn't really needed due to Rich's constraints system.  Normally you would use a layout to hold containers for things and then position those containers where you want them.  This way you have sections of your site that you can swap content in and out of.  In Rich, we substitute that same concept with constraints and `subviews` (more on that later, but for now think of constraints as inspired by Apple's autolayout).

With Rich you currently get View, ItemView, CollectionView, and Regions as your display primatives.  Each of them have slight tweeks and things you'll want to read up on.  More to come on each of these later.

## What are these constraints you speak of?
[Famo.us] is powerful...very powerful.  But it can get a bit time consuming to position things in relation to other things, this is why we implemented constraints.  Constraints allow you to create a view, give it a height, width, top, right, bottom or left, and then if you want to have a 2nd view always be positioned in relation to that first view...done.
A quick example:

```javascript
var MyView = new rich.ItemView.extend({
    template: 'myview.html',

    constraints:[
        {
            item: 'view1',
            attribute: 'width',
            relatedBy: '==',
            toItem: 'superview',
            toAttribute: 'width',
            multiplier: 0.5
        },
        {
            item: 'view1',
            attribute: 'height',
            constant: 125,
            relatedBy: '==',
        },
        {
            item: 'view2',
            attribute: 'left',
            relatedBy: '==',
            toItem: 'view1',
            toAttribute: 'right'
        },
        {
            item: 'view2',
            attribute: 'top',
            relatedBy: '==',
            toItem: 'view1',
            toAttribute: 'bottom'
        },
    ],
    initialize: function(){
        this.view1 = new rich.ItemView();
        this.view2 = new rich.ItemView();
    }
});

```

in this case, you can see that the first view's width is half of it's parent view, and it's height is a static value at 125px.

You can check out a more comprehensive example of this [here](https://github.com/dinopetrone/rich-todo/blob/master/src/static/js/app/todo/constraints/todo-layout.js) and [here](https://github.com/dinopetrone/rich-todo/blob/master/src/static/js/app/todo/views/todo-layout.js#L17-L23)

One of the powerful things that you can do with this is responsive constraints based on other variables (ex: window.outerWidth).  Example [here](https://github.com/dinopetrone/rich-todo/blob/master/src/static/js/app/todo/views/todo-layout.js#L18).

And due to how rich sets up it's initial containers, we automatically listen for a resize of that container and  handle the rebuild of the constraints when needed.

Rich's constraints system is backed by [Cassowary][] which is the same algorithm that Apple derived their Autolayout sytem from in OSX and iOS.  And just to make it a little extra special, we incorporated Apple's visual formatting language to allow for quick constraints.  Here's a quick example:


```javascript
var MyView = new rich.ItemView.extend({
    template: 'myview.html',

    constraints:[
        '|-20-[view1(>120)]-20-[view2(200)]-|',
    ],

    initialize: function(){
        this.view1 = new rich.ItemView();
        this.view2 = new rich.ItemView();
    }
});

```

As you can see, VFL is extremely powerful and allows you to do some really quick constraints.  In this we said we want view1 to be 20px from the left, have a width greater than 120px, have a 20px right padding, then view2 has a 200px width and is butted up agaist the right wall and view1's right side.  As you can see it's quick and easy to read as well.  At a single glance you can see how this view would be layed out.


## Can I have multiple [Famo.us] context's?
YUP!  most of the time you'll only need 1, and you do want to be careful regarding the number of context containers you create as they get expensive.  [Heres an example](https://github.com/dinopetrone/rich-todo/blob/master/src/static/js/app/app.js#L6-L10) of how you would go about initializing a context and adding your initial view into it.  We wanted to keep the same feel of how you would go about regeistering a region, but obviously rich is a tad different, so it initialization is a tad different than a region.

## Regions? Yup!
A region is a container like it is in [Marionette.js][]. In a normal Marionette application you add regions at the top level of your application using `app.addRegions({...})`, with Rich it's slighty different.  We do not use a Region on the top level, instead we use a `rich.View` that is initialized using `app.addRichContexts({...})`.

In rich, a Region is just a view with some boilerplate around only allowing 1 subview to be added, it does, however, get all of the events of a normal Marionette Region and as a reference to it's currentView via `myRegion.currentView`.

*Initializing your root region(s) in Marionette*

```javascript
app.addRegions({
  window: "#main-content"
});

```

*Initializing your root View(s) in Rich*
```javascript
app.addRichContexts({
    window: "#main-content"
});
```

*Using regions in your views*

```javascript
var MyView = new rich.ItemView.extend({
    template: 'myview.html',

    initialize: function(){
        this.fooRegion = new rich.Region();
    },

    onShow: function(){
        this.fooRegion.show(new OtherView());
    }
});

```

This is very helpful when you have a section of your site that you'd like to have constrained to a certain height and width and you want to swap content in and out of it easily.  You would just add a constraint to the region, and toss content in and out of the region and the content will auto fill up the size of it's region.

Revisiting the last example from above, lets enforce that our region is 300x200:

*Using regions in your views with constraints*

```javascript
var MyView = new rich.ItemView.extend({
    template: 'myview.html',

    constraints:[
        {
            item: 'fooRegion',
            attribute: 'width',
            relatedBy: '==',
            constant: 300
        },

        {
            item: 'fooRegion',
            attribute: 'height',
            relatedBy: '==',
            constant: 200
        }
    ],

    initialize: function(){
        this.fooRegion = new rich.Region();
    },

    onShow: function(){
        this.fooRegion.show(new OtherView());
    }
});
```

*Same as above, but using VFL*
```javascript
var MyView = new rich.ItemView.extend({
    template: 'myview.html',

    constraints:[
        'H:[fooRegion(300)]',
        'V:[fooRegion(200)]'
    ],

    initialize: function(){
        this.fooRegion = new rich.Region();
    },

    onShow: function(){
        this.fooRegion.show(new OtherView());
    }
});

```

## View
Everything in rich extends our base view.  Rich's base view is required because of how it handles the view hierarchy.  You construct the hierarchy by creating a view, and adding a view inside of that view.  Example:


```javascript
var MyView = new rich.ItemView.extend({
    template: 'myview.html',

    initialize: function(){
        this.chidView = new OtherView();
        this.addSubview(this.chidView);
    }
});

```

It's also completely valid to just have an empty view, that does nothing but hold subviews, note that rich.View does not require a template.

```javascript
var MyView = new rich.View.extend({
    constraints:[
        {
            item: 'childView',
            attribute: 'left',
            relatedBy: '==',
            toItem: 'superview',
            toAttribute: 'left',
            constant: 20
        },

        'V:[chidView(200)]',
        'H:[chidView(100)]',

    ], // yes, you can mix styles when defining the intrinsic constraints on a view.

    initialize: function(){
        this.chidView = new OtherView();
        this.addSubview(this.chidView);
    }
});

```

Why did we go this path?  Because everything is a view, we have the ability to have the views talk to eachother up and down the tree.  This is how we handle view invalidation, for example.  Every view, similar to a [Famo.us] view/surface has a render() function.  Every rich view will, by default, store a cached version of it's own render() result.  When render is called it will return that cache.  If a view updates, it will trigger an event up to it's parent. That parent then grabs the update from the child, reaches into it's own cached render response and patches it.  Thus only modifying the parts that are required and not incurring the cost of a full rerender each render cycle.

In addition, the base view allows the constraints system to have a hierarchical structure as well. If I have a parent size [100x100], it's children will all inherit that size.  If I add a constraint to any child down the tree the children will inherit the parents size.

At it's core, our base view allows rich to tightly couple things enough to allow it to make enough assumptions to do a ton of work for you.  I don't know about you, but I like when work is done for me. :)


#### Nested Subviews

There are times, when you may need to set `overflow:hidden` to get some masking of your views. In [Famo.us][] you would solve this using a ContainerSurface. We solve it the same way in Rich, however we will create the container suerface for you, so you don't need to import it.

```css
.overflow-me{
    overflow: hidden;
}
```

```javascript
var MyView = rich.View.extend({
    nestedSubviews: true,
    className: 'overflow-me',

    initialize: function(){
        this.foo = new OtherView();
        this.addSubview(this.foo);
    }
});
```

Note the `nestedSubviews` attribute. This will effectively create a new ContainerSurface for you and each subview you will be added as a child of that ConatinerSurface. Please be advised, use of `nestedSubviews` aka ContainerSurfaces is expensive, don't use them all over.


## Modifiers
Rich allows for modifiers just like [Famo.us] does.  Rich's approach on modifiers is that they are attached to views.  Here is an example of a view with a modifier on it:

```javascript
var MyView = rich.ItemView.extend({
    template: 'myview.html',

    modifier: function(){
        return new Modifier()
    }
});

```

Which is great! What if I need to add a bunch of modifiers?

```javascript
var MyView = new rich.ItemView.extend({
    template: 'myview.html',

    modifier: function(){
        return [new Modifier(), new Modifier(), new Modifier()]
    }
});

```
`modifier` uses underscore's `_.result()` when it is read, so you can have `modifier` be a function that returns an array, or just have it equal to an array, or just have it equal a single modifier.

```javascript
var mod1 = new Modifier();
var mod2 = new Modifier();
var mod3 = new Modifier();

var MyView = new rich.ItemView.extend({
    template: 'myview.html',

    modifier: [mod1, mod2]
});

var OtherView = new rich.ItemView.extend({
    template: 'otherview.html',

    modifier: mod1
});

var AnotherView = new rich.ItemView.extend({
    template: 'anotherview.html',

    modifier: function(){
        return new Modifier();
    }
});
```

Or, if you want to use the famous physics engine, you can also have it return the result of a particle:

```javascript
var mod1 = new Modifier();
var particle = new Particle();

var MyView = new rich.ItemView.extend({
    constraints: [mod1, particle]
});
```


## Transitions
because rich caches the render() response we have modified how you interact with modifiers.  If you don't need to do anything fancy, you can just call `myView.setTransform(transform, transition)` and rich will handle it for you.  If you need to target a specific modifier, you must pass an index to as a 3rd argument.  `myView.setTransform(transform, transition, 1)`.  To find out when it's completed, we made the response of setTransform be a promise.  So you would do something like this:

```javascript
myView.setTransform(transform, transition, 1).then(function(){
    console.log('called')
});
```

But...lets say you need to get fancy, and you have a particle that's in the engine that needs to be rendering every frame. All you need to do is the following:

```javascript
var particle = new Particle()

var myView = new rich.ItemView({
    constraints: particle,
    needsDisplay: true
});
```

This will trigger the need for this view to be updated every frame via the `needsDisplay` attribute.  Keep in mind this should only be turned on when you need the view rendered.  Setting it to true on all views will basically kill all of the caching that's taking place in your views.

## CollectionView
Rich's CollectionView extends [Marionette.js][]'s CollectionView, but it has a very different way of handling the actual DOM representation.  Yes, this works as you think it would using [Backbone][] Collections and [Backbone][] Models, go nuts.

A vanilla CollectionView will look and act exactly the same as it's [Marionette.js][] equivelant aside from the fact that you can inject a modifier on it and get crazy with animations.


## Examples
- [Standard Todo app](http://dinopetrone.github.io/rich-todo/src/)


## Getting Started
Download this repo, [Famo.us], and [Marionette.js][], and off you go.  [Demos][] can be viewed by running `$ make serve` from inside of the demos directory.

