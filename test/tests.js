$(function() {
  
module("defaults");
  
  test("default delay should be 4", function() {
    // https://developer.mozilla.org/en/window.setTimeout#Minimum_delay_and_timeout_nesting
    strictEqual(jQueryChrono.defaults.delay, 4);
  });
  
  test("default units should be milliseconds", function() {
    // https://developer.mozilla.org/en/window.setTimeout#Minimum_delay_and_timeout_nesting
    strictEqual(jQueryChrono.defaults.units, "milliseconds");
  });
  
module("units");
  
  test("must recognize milliseconds", function() {
    var units = ["millisecond", "milliseconds", "ms"];
    $.each(units, function(i, unit) {
      strictEqual(jQueryChrono.valid_units[unit], 1, "recognizes " + unit);
    });
  });
  
  test("must recognize seconds", function() {
    var units = ["second", "seconds", "sec", "secs", "s"];
    $.each(units, function(i, unit) {
      strictEqual(jQueryChrono.valid_units[unit], 1000, "recognizes " + unit);
    });
  });
  
  test("must recognize minutes", function() {
    var units = ["minute", "minutes", "min", "mins", "m"];
    $.each(units, function(i, unit) {
      strictEqual(jQueryChrono.valid_units[unit], 1000 * 60, "recognizes " + unit);
    });
  });
  
  test("must recognize hours", function() {
    var units = ["hour", "hours", "hr", "hrs", "h"];
    $.each(units, function(i, unit) {
      strictEqual(jQueryChrono.valid_units[unit], 1000 * 60 * 60, "recognizes " + unit);
    });
  });
  
  test("must recognize days", function() {
    var units = ["day", "days", "d"];
    $.each(units, function(i, unit) {
      strictEqual(jQueryChrono.valid_units[unit], 1000 * 60 * 60 * 24, "recognizes " + unit);
    });
  });
  
module("parsing arguments");
  
  test("accepts a positive integer as a delay", function() {
    var delay = 50, fn = $.noop,
        args = jQueryChrono.create_timer(delay, fn);
    strictEqual(args.delay, delay);
  });
  
  test("accepts a positive float as a delay", function() {
    var delay = 50.5, fn = $.noop,
        args = jQueryChrono.create_timer(delay, fn);
    strictEqual(args.delay, delay);
  });
  
  test("does not accept non-numerical delays", function() {
    var invalid_delays = [ [], true, NaN, "xyz", {}, $.noop, null ];
    $.each(invalid_delays, function(i, invalid_delay) {
      raises(function() {
        jQueryChrono.create_timer(invalid_delay, $.noop);
      }, invalid_delay + " is an invalid delay");
    });
  });
  
  test("does not accept invalid units", function() {
    var invalid_units = [ 1997, [], true, NaN, "xyz", {}, $.noop, null ];
    $.each(invalid_units, function(i, invalid_unit) {
      raises(function() {
        jQueryChrono.create_timer(5, invalid_unit, $.noop);
      }, invalid_unit + " is an invalid unit");
    });
  });
  
  test("does not accept invalid units without a delay", function() {
    var invalid_units = [ [], true, NaN, "xyz", {}, $.noop, null ];
    $.each(invalid_units, function(i, invalid_unit) {
      raises(function() {
        jQueryChrono.create_timer(invalid_unit, $.noop);
      }, invalid_unit + " is an invalid unit");
    });
  });
  
  test("does not accept anything other than a function for a callback", function() {
    var invalid_callbacks = [ 1997, [], true, NaN, "xyz", {}, null ];
    $.each(invalid_callbacks, function(i, invalid_callback) {
      raises(function() {
        jQueryChrono.create_timer(5, invalid_callback);
      }, invalid_callback + " is an invalid callback");
    });
  });
  
module("parsing arguments: defaults");
  
  test("uses the default units if none provided", function() {
    var delay = 50, fn = $.noop, 
        args = jQueryChrono.create_timer(delay, fn);
    strictEqual(args.units, jQueryChrono.defaults.units);
  });
  
  test("uses the default delay if none provided and units are ms", function() {
    var units = "ms", fn = $.noop, 
        args = jQueryChrono.create_timer(units, fn);
    strictEqual(args.delay, jQueryChrono.defaults.delay);
  });
  
  test("uses 1 instead of the default delay if none provided but units are not ms", function() {
    var delay = 1, units = "mins", fn = $.noop, 
        args = jQueryChrono.create_timer(units, fn);
    strictEqual(args.delay, delay);
  });
  
  test("uses the default delay if the delay < the default delay and the units are the default units", function() {
    var delay = jQueryChrono.defaults.delay - 1, 
        units = jQueryChrono.defaults.units, 
        fn = $.noop,
        args = jQueryChrono.create_timer(delay, units, fn);
    strictEqual(args.delay, jQueryChrono.defaults.delay);
  });
  
  test("does not use the default delay if the delay < the default delay but the units are NOT the default units", function() {
    var delay = jQueryChrono.defaults.delay - 1, 
        units = "days", 
        fn = $.noop,
        args = jQueryChrono.create_timer(delay, units, fn);
    strictEqual(args.delay, delay);
  });
  
  test("uses the default delay and default units given a negative integer delay", function() {
    var delay = -50, units = "days", fn = $.noop,
        args = jQueryChrono.create_timer(delay, units, fn);
    strictEqual(args.delay, jQueryChrono.defaults.delay);
    strictEqual(args.units, jQueryChrono.defaults.units);
  });
  
  test("uses the default delay and default units given a negative float delay", function() {
    var delay = -50.5, units = "hours", fn = $.noop,
        args = jQueryChrono.create_timer(delay, units, fn);
    strictEqual(args.delay, jQueryChrono.defaults.delay);
    strictEqual(args.units, jQueryChrono.defaults.units);
  });
  
module("valid arguments");
  
  test("does not accept < 2 arguments", function() {
    raises(function() {
      jQueryChrono.create_timer($.noop);
    });
  });
  
  test("does not accept > 3 arguments", function() {
    raises(function() {
      jQueryChrono.create_timer(5, "s", $.noop, $.noop);
    });
  });
  
  test("accepts a delay and a callback", function() {
    var delay = 50, fn = $.noop, units = jQueryChrono.defaults.units,
        args = jQueryChrono.create_timer(delay, fn);
    strictEqual(args.delay, delay, "recognizes delay");
    strictEqual(args.units, units, "recognizes unit");
    strictEqual(args.callback, fn, "recognizes function");
  });
  
  test("accepts a delay string and a callback", function() {
    var delay = 50, fn = $.noop, units = jQueryChrono.defaults.units,
        args = jQueryChrono.create_timer(delay.toString(), fn);
    strictEqual(args.delay, delay, "recognizes delay");
    strictEqual(args.units, units, "recognizes unit");
    strictEqual(args.callback, fn, "recognizes function");
  });
  
  test("accepts a unit and a callback", function() {
    var delay = 1, units = "minute", fn = $.noop,
        args = jQueryChrono.create_timer(units, fn);
    strictEqual(args.delay, delay, "recognizes delay");
    strictEqual(args.units, units, "recognizes unit");
    strictEqual(args.callback, fn, "recognizes function");
  });
  
  test("accepts a delay string with a unit and a callback", function() {
    var delay = 50, units = "s", fn = $.noop,
        args = jQueryChrono.create_timer(delay + units, fn);
    strictEqual(args.delay, delay, "recognizes delay");
    strictEqual(args.units, units, "recognizes unit");
    strictEqual(args.callback, fn, "recognizes function");
  });
  
  test("accepts a delay followed by a unit and a callback", function() {
    var delay = 50, units = "s", fn = $.noop,
        args = jQueryChrono.create_timer(delay, units, fn);
    strictEqual(args.delay, delay, "recognizes delay");
    strictEqual(args.units, units, "recognizes unit");
    strictEqual(args.callback, fn, "recognizes function");
  });
  
  test("accepts a delay string followed by a unit and a callback", function() {
    var delay = 50, units = "s", fn = $.noop,
        args = jQueryChrono.create_timer(delay.toString(), units, fn);
    strictEqual(args.delay, delay, "recognizes delay");
    strictEqual(args.units, units, "recognizes unit");
    strictEqual(args.callback, fn, "recognizes function");
  });
  
  test("accepts a delay and a unit in a string without a space followed by a callback", function() {
    var delay = 50, units = 'sec', fn = $.noop,
        args = jQueryChrono.create_timer(delay.toString() + units, fn);
    strictEqual(args.delay, delay, "recognizes delay");
    strictEqual(args.units, units, "recognizes unit");
    strictEqual(args.callback, fn, "recognizes function");
  });
  
  test("accepts a delay and a unit in a string with a space followed by a callback", function() {
    var delay = 50, units = 'sec', fn = $.noop,
        args = jQueryChrono.create_timer(delay + " " + units, fn);
    strictEqual(args.delay, delay, "recognizes delay");
    strictEqual(args.units, units, "recognizes unit");
    strictEqual(args.callback, fn, "recognizes function");
  });
  
module("valid arguments: comma-separated delays with units");
  
  test("accepts a sequence followed by a callback as a delay of minimum units", function() {
    var delay = '2 hours, 1 minute, 50 seconds', fn = $.noop,
        args = jQueryChrono.create_timer(delay, fn);
    strictEqual(args.delay, 7310, "recognizes delay");
    strictEqual(args.units, 'seconds', "recognizes unit");
    strictEqual(args.callback, fn, "recognizes function");
  });
  
  test("tolerates a sequence followed by anything other than a callback", function() {
    var delay = '5 hours, 36 minutes', fn = $.noop,
        args = jQueryChrono.create_timer(delay, "randomness", fn);
    strictEqual(args.delay, 336, "recognizes delay");
    strictEqual(args.units, 'minutes', "recognizes unit");
    strictEqual(args.callback, fn, "recognizes function");
  });
  
  test("does not accept a sequence with empty values at the end", function() {
    var delay = '5 hours, 36 minutes,', fn = $.noop;
    raises(function() {
      args = jQueryChrono.create_timer(delay, fn);
    });
  });
  
  test("does not accept a sequence with empty values at the beginning", function() {
    var delay = ',5 hours, 36 minutes', fn = $.noop;
    raises(function() {
      args = jQueryChrono.create_timer(delay, fn);
    });
  });
  
  test("does not accept sequence of delays with invalid units", function() {
    var delay = '3 hours, 36 xom', fn = $.noop;
    raises(function() {
      jQueryChrono.create_timer(delay, fn);
    });
  });
  
  test("does not accept sequence of delays without units", function() {
    var delay = '3, 36', fn = $.noop;
    raises(function() {
      jQueryChrono.create_timer(delay, fn);
    });
  });
  
  test("does not accept sequence of units without delays", function() {
    var delay = 'min, sec', fn = $.noop;
    raises(function() {
      jQueryChrono.create_timer(delay, fn);
    });
  });
  
module("timer calculation");
  
  test("returns a number for when the new timer should run at", function() {
    var timer = jQueryChrono.create_timer(jQueryChrono.defaults.delay, $.noop);
    strictEqual(typeof timer.when, "number");
  });
  
  test("delay must be a factor of when the new timer should run", function() {
    var delay = 423.8, units = 'sec', fn = $.noop,
        timer = jQueryChrono.create_timer(delay, units, fn);
    
    strictEqual(timer.when / parseFloat(jQueryChrono.valid_units[units], 10), delay);
  });
  
  test("units must be a factor of when the new timer should run", function() {
    var delay = 757, units = 'hour', fn = $.noop,
        timer = jQueryChrono.create_timer(delay, units, fn);
    
    strictEqual(timer.when / parseFloat(delay, 10), jQueryChrono.valid_units[units]);
  });
  
module("public interface");
  
  test("$.after is a valid function", function() {
    ok($.isFunction($.after));
  });
  
  test("$.every is a valid function", function() {
    ok($.isFunction($.every));
  });
  
  test("jQueryChrono.after is a valid function", function() {
    ok(jQueryChrono.after === $.after);
  });
  
  test("jQueryChrono.every is a valid function", function() {
    ok(jQueryChrono.every === $.every);
  });
  
  test("can create a one-time timer with $.after", function() {
    var milliseconds = 10,
        html = "test data set by $.after";

    expect(1);

    // sets fixture to value of "html"
    $.after(milliseconds, function() {
      $("#qunit-fixture").html(html);
    });

    QUnit.stop(); // wait for all timers to finish

    // checks that fixture is set to value of "html"
    setTimeout(function() {
      deepEqual($("#qunit-fixture").html(), html);

      QUnit.start(); // all timers have finished
    }, milliseconds + 1); // check shortly after $.after completes
  });
  
  test("can create an interval timer with $.every", function() {
    var milliseconds = 7,
        interval = null,
        iterations = 3,
        current_iteration = 1;

    expect(1);

    // appends number of milliseconds to fixture, "iterations" times
    interval = $.every(milliseconds, function() {
      $("#qunit-fixture").append(milliseconds.toString());

      if (current_iteration === iterations) {
        clearInterval(interval);
      }
      current_iteration += 1;
    });

    QUnit.stop(); // wait for all timers to finish

    // checks that milliseconds appears exactly "iterations" times in fixture
    setTimeout(function() {
      var pattern = new RegExp("^"+ milliseconds +"{"+ iterations +"}$");
      ok(pattern.test($("#qunit-fixture").html()));

      QUnit.start(); // all timers have finished
    }, (milliseconds) * (iterations + 3)); // check shortly after $.every completes
  });
  
});
