
0.12.0 / 2014-04-25 
==================

  * fix forbidden errors with grunt-connect
  * if responsive and cssAnimate, don't change container left position
  * renamed $().slider to $().slide

0.11.1 / 2014-04-24 
==================

  * updated bower dependencies

0.11.0 / 2014-04-24 
==================

  * fixed path for tests
  * Updated build script.
  * Updated classes to fit our code style.
  * Added responsive option.
  * Added tests.
  * Fixed paths in tests.
  * Updated path. Added option to pass in base class.
  * Updated paths on example pages.
  * Merge branch 'feature/rename' into feature/css-animate
  * Renamed to slide.
  * Added autoprefixer and transition mixins.
  * Fixed flickering issue with some effects.
  * WIP - Improved animations.
  * WIP - Better example page.
  * WIP - More animation styles work now.
  * WIP - css animations.
  * Merge pull request #8 from jgallen23/feature/wrap-tests
  * Fixed tests and added tests for wrap and resize.

0.10.0 / 2014-03-06
==================

 * Merge pull request #6 from jgallen23/bug/wrap
 * Wrap actually works.

0.9.0 / 2014-03-06
==================

 * Merge pull request #5 from jgallen23/bug/pixels-are-units-too
 * jquery should be smart enough to use px by default...

0.8.0 / 2014-02-26
==================

 * Merge pull request #4 from jgallen23/bug/indicator-multiple-bind
 * Only binds indicators once.

0.7.0 / 2014-02-25
==================

 * Merge pull request #3 from jgallen23/feature/flex-width
 * Adds updateWidth method to help support responsiveness.

0.6.0 / 2013-09-10 
==================

  * support for clicking indicators, disable with indicatorClick: false
  * getPageCount method call
  * updated for latest bower and grunt plugins

0.5.1 / 2013-07-09 
==================

 * Merge branch 'bug/margin-left-needs-px'
 * Added 'px' to margin-left since the value wasn't being accepted without it.

0.5.0 / 2013-07-09 
==================

  * Merge branch 'feature/previews'
  * Added this.previews check to updatePreviews method.
  * Added some tests for previews.
  * Added previews

0.4.1 / 2013-06-25 
==================

  * added main to bower

0.4.0 / 2013-06-24 
==================

  * added ability to pass in indicators elements to highlight current page
  * [grunt] tweaks
  * Merge branch 'feature/grunt0.4'
  * updated grunt config and bower
  * [grunt] fixed mocha
  * [grunt] added plato and grunt reports
  * [component] moved blanket and assert to devDependencies
  * [grunt] updated to 0.4

0.3.3 / 2013-02-24 
==================

  * [lib/slider] wrap in jQuery closure

0.3.2 / 2013-02-15 
==================

  * [test] update tests to consider padding/margin between items
  * [lib] use outerWidth instead of width

0.3.1 / 2013-02-15 
==================

  * [lib] make sure mouse events dont start/stop unless auto is set
  * [test] tests mouseover/out triggering auto slide

0.3.0 / 2013-01-06 
==================

  * [grunt] added server to ci task
  * [example] updated example to use auto
  * [lib] added option for auto and autoDelay
  * [test] added blanket.js for coverage
  * [example] updated example to show beforeSlide event

0.2.0 / 2013-01-04 
==================

  * [lib] added ability to pass in first page as option
  * [lib] data-action="go" data-page="#" will auto bind
  * [lib] pass pageNumber to event handlers

0.1.1 / 2013-01-04 
==================

  * [bower] updated fidel version dep
  * [docs] updated readme
  * [example] removed old files

0.1.0 / 2013-01-03 
==================

  * [package] added package.json to install dev deps
  * [test] added test suite
  * [grunt] setup reloadr and mocha
  * [bower] updated fidel dep version
  * [example] updated
  * [lib] added additional methods, made more generic

0.0.2 / 2012-12-12 
==================

  * removed components dir

0.0.1 / 2012-12-11 
==================

  * updated for latest version of fidel
  * grunt integration
  * initial commit
