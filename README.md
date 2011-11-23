jQuery Chrono plugin (version 1.2)
==================================

jQuery Chrono provides syntactic sugar around JavaScript's native 
`setTimeout` and `setInterval` functions.

To execute some code in 5 minutes, instead of writing:

```js
    setTimeout(function() { ... }, 300000); // how many zeros is that?
```

or the slightly more readable:

```js
    setTimeout(function() { ... }, 5 * 60 * 1000); // 5... (multiplies in head) min
```

now you can just write:

```js
    $.after(5, "minutes", function() { ... }); // :)
````

`setTimeout` becomes `$.after` and `setInterval` becomes `$.every`.

If you don't have jQuery, you can use the aliases `jQueryChrono.every` and
`jQueryChrono.after`.

Usage
-----

These are all valid calls:

```js
    $.after(100, function() { ... });           // 100 milliseconds
    $.after("9.7", function() { ... });         // 9.7 milliseconds
    $.after("50sec", function() { ... });       // 50 seconds
    $.after("1 minute", function() { ... });       // 1 minute
    $.after(7, "mins", function() { ... });     // 7 minutes
    $.after("33", "hours", function() { ... }); // 33 hours
    $.after("minute", function() { ... });      // 1 minute
    $.after("1 hour, 2 minutes, 15 seconds", function() { ... }); // 1:02:15 hours
    $.after("1min, 15 s", function() { ... }); // 1:15 minutes
```

`$.every`, for creating intervals, has the same exact syntax as `$.after`.

Valid time units include:  

* millisecond (default)

* second 

* minute 

* hour

* day

along with all their common abbreviations and pluralizations.

jQuery Version
--------------

This project works with jQuery 1.4+ (see __test/test.html__) but as of version 1.2, also works without jQuery.

Contributing
------------

* Add relevant QUnit tests and make sure all existing tests pass (in __test/tests.js__)

* Update the JsDoc (__doc/__) with:

  java -jar tools/jsdoc-toolkit/jsrun.jar tools/jsdoc-toolkit/app/run.js -a -t=tools/jsdoc-toolkit/templates/jsdoc/ -d=doc/ lib/jquery.chrono.js

* Update the minified file (__lib/jquery.chrono.min.js__) with:

  java -jar tools/yuicompressor-2.4.6/build/yuicompressor-2.4.6.jar -o lib/jquery.chrono.min.js lib/jquery.chrono.js

Meta
----

_Licensed under the 3-clause **BSD license** (BSD_LICENSE.txt)_

Copyright (c) 2011, Arthur Klepchukov (at gmail)
