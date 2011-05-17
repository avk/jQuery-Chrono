Timed
====================

Timed provides syntactic sugar around JavaScript's native 
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
    Timed.after(5, "minutes", function() { ... }); // :)
````

`setTimeout` becomes `Timed.after` and `setInterval` becomes `Timed.every`.

Usage
-----

These are all valid calls:

```js
    Timed.after(100, function() { ... });           // 100 milliseconds
    Timed.after("9.7", function() { ... });         // 9.7 milliseconds
    Timed.after("50sec", function() { ... });       // 50 seconds
    Timed.after(7, "mins", function() { ... });     // 7 minutes
    Timed.after("33", "hours", function() { ... }); // 33 hours
    Timed.after([
    	["1", "minute"],
    	[34, "seconds"],
    	[100, "milliseconds"]
    ], function() { ... });
```

`Timed.every`, for creating intervals, has the same exact syntax as `$.after`.

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

Copyright (c) 2011, Jarvis Badgley (chipersoft at gmail), Arthur Klepchukov (at gmail)
