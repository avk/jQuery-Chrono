jQuery Chrono plugin
====================

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

Usage
-----

These are all valid calls:

```js
    $.after(100, function() { ... });           // 100 milliseconds
    $.after("9.7", function() { ... });         // 9.7 milliseconds
    $.after("50sec", function() { ... });       // 50 seconds
    $.after(7, "mins", function() { ... });     // 7 minutes
    $.after("33", "hours", function() { ... }); // 33 hours
```

`$.every`, for creating intervals, has the same exact syntax as `$.after`.

Valid time units include:  

* millisecond (default)

* second 

* minute 

* hour

* day

along with all their common abbreviations and pluralizations.

Meta
----

_Licensed under the 3-clause **BSD license** (BSD_LICENSE.txt)_

Copyright (c) 2011, Arthur Klepchukov (at gmail)
