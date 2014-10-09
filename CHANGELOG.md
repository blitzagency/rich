### v.NEXT _PENDING RELEASE_ [view commit logs](https://github.com/blitzagency/rich/compare/v0.0.4...HEAD)

* Features
  * Updated to Famo.us v0.3.0 
  
  * View now has a utility function for telling it's children to fill up the size
    of their parent:  `view.fillWithSubview(otherView, zIndex)`

  * Autolayout transitions now trigger autolayoutTransition:complete passing the view and prop (top, left, etc)
  
  * When intrinsic constraints are changed `onConstraintsReset` will be triggered on the view.
  
  * When a subview is removed, it will now remove any constraints that were applied to it.
  
  * New controller: NavigationController (might be renamed to PushPopViewController)
  
  * Views now have a `getBounds` which will return an object in the form:
    ```javascript
    {width: #, height: #, top: #, right: #, bottom: #, left: #}
    ```
  
  * The `rich.utils.defer` function has been updated to alow it to also enable debouncing
  
  * New view function `invalidateAll` is a debounced way to invalidate both layout and view

* Fixes
  * Cleaned up methods for updating modifier to make them DRY.
  
  * Fixes bug in scrollview where the type of scroll was not being passed
  
  * Defers processing of added constraints if no root is present
  
  * Add/remove constraint(s) now calls `invalidateAll`
  
  * `View.remove` is more complete
  
  * `_richAutolayoutDestroy` will rebuild the _autolayout object if the view has not been destroyed.
  
  * `_richDestroy` has been cleaned up
  
  * When applying constriants for the first time, the _autolayoutTransitionables will be updated to the latest values     if the the view has not been rendered previously.
  
  * When constraint dependencies are resolved, width and height are now passed in addition to top/bottom or right/left
  
  * Constraint dependencies are resolved earlier in the constraint pipeline


### v0.0.4 [view commit logs](https://github.com/blitzagency/rich/compare/v0.0.3...v0.0.4)

* Fixes
  * Fixes critical error in constraint dependancies (_resolveConstraintDependencies)


### v0.0.3 [view commit logs](https://github.com/blitzagency/rich/compare/v0.0.2...v0.0.3)

* Features

  * Unit tests are now run using the following SuaceLabs provided
    browsers: Chrome, Safari, Firefox, IE 11

  * Views no longer attempt to fill their parent by default. Contraints
    must be specified for all views. **WARNING: This is a backwards
    incompatible change**

  * `rich.Region` has now sets an intrinsic constriant on `currentView`
    with: `V:|[currentView]|` `H:|[currentView]|`, thus only the region's
    width, height, top, etc constraints need be set. The **shown** view will
    automatically fill up the space allocated to the region.

  * `rich.autolayout.constraints.constraintsWithVFL` now takes a second,
    optional, argument providing a context for the view names to be
    mapped. For example:

    ```javascript
    var foo = new MyView();
    var constraints = constraintsWithVFL('V:|[view]|', {view: foo});
    ```

  * A view's intrinsic constraints `constraints:` can now return an
    array of `rich.autolayout.constraints.Constraint` objects in
    addition to VFL or JSON.

  * Clean up on rich scrollview codebase, made driver reach into scrollview
    less by passing it's required variables in via options.

* Fixes

  * When the root view is destroyed, the resize listener will be removed.

  * When a region is destroyed, it's `currentView`, if present, is also
    destroyed.

  * Adds better `null|undefined` handling during `_initializeConstraints`

  * When creating a rich context during app initialization, handle the
    special case when `body` is passed as the el.



### v0.0.2 [view commit logs](https://github.com/blitzagency/rich/compare/v0.0.1...v0.0.2)

* Fixes

  * Do not attempt to render if a view is destoryed

### v0.0.1

* Features

  * Initial Release
    * View Heriarchy
    * Autolayout System powered by Cassowary
    * Visual Format Language
    * Unit Tests

