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

