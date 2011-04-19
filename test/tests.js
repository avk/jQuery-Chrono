$(function() {
  function doesNotRaise(callback, message) {
    function StubError() {};
    raises(function() {
      callback();
      throw new StubError();
    }, StubError, message);
  }
  
  module("public interface");
  
  test("$.after is a valid function", function() {
    ok($.isFunction($.after));
  });
  
  test("$.every is a valid function", function() {
    ok($.isFunction($.every));
  });
  
  module("defaults");
  
  test("default delay should be 4", function() {
    // https://developer.mozilla.org/en/window.setTimeout#Minimum_delay_and_timeout_nesting
    equals(jQueryChrono.defaults.delay, 4);
  });
  
  test("default units should be milliseconds", function() {
    // https://developer.mozilla.org/en/window.setTimeout#Minimum_delay_and_timeout_nesting
    equals(jQueryChrono.defaults.units, "milliseconds");
  });
  
  module("units");
  
  test("must recognize milliseconds", function() {
    var units = ["millisecond", "milliseconds", "ms"];
    $.each(units, function(i, unit) {
      ok(jQueryChrono.valid_units[unit], "recognizes " + unit);
    });
  });
  
  test("must recognize seconds", function() {
    var units = ["second", "seconds", "sec", "secs", "s"];
    $.each(units, function(i, unit) {
      ok(jQueryChrono.valid_units[unit], "recognizes " + unit);
    });
  });
  
  test("must recognize minutes", function() {
    var units = ["minute", "minutes", "min", "mins", "m"];
    $.each(units, function(i, unit) {
      ok(jQueryChrono.valid_units[unit], "recognizes " + unit);
    });
  });
  
  test("must recognize hours", function() {
    var units = ["hour", "hours", "hr", "hrs", "h"];
    $.each(units, function(i, unit) {
      ok(jQueryChrono.valid_units[unit], "recognizes " + unit);
    });
  });
  
  test("must recognize days", function() {
    var units = ["day", "days", "d"];
    $.each(units, function(i, unit) {
      ok(jQueryChrono.valid_units[unit], "recognizes " + unit);
    });
  });
  
  module("create_timer function signature", {
    setup : function() {
      this.stub_timer = jQueryChrono.create_timer(jQueryChrono.defaults.delay, 
                                                  jQueryChrono.defaults.units,
                                                  $.noop)
    }
  });
  
  test("returns a 'callback' function", function() {
    ok($.isFunction(this.stub_timer.callback));
  });
  
  test("returns a number for 'when' the timer should run", function() {
    strictEqual(typeof this.stub_timer.when, "number");
  });
  
  test("numerical argument must be a factor of the 'when' returned value", function() {
    var delay, timer;
    
    delay = 27;
    timer = jQueryChrono.create_timer(delay, "ms", $.noop);
    strictEqual(timer.when / delay, 1, "accepts integers");
    
    delay = 57.5;
    timer = jQueryChrono.create_timer(delay, "sec", $.noop);
    strictEqual(timer.when / 1000, delay, "accepts floats");
    
    delay = "27";
    timer = jQueryChrono.create_timer(delay + "min", $.noop);
    strictEqual(timer.when / parseInt(delay, 10), 60000, "accepts integers in strings");
    
    delay = "57.5";
    timer = jQueryChrono.create_timer(delay + "ms", $.noop);
    strictEqual(timer.when / 1, parseFloat(delay, 10), "accepts floats in strings");
  });
  
  test("unit argument must be a factor of the 'when' returned value", function() {
    var delay, timer;
    
    delay = 27;
    timer = jQueryChrono.create_timer(delay, "s", $.noop);
    strictEqual(timer.when / 1000, delay, "works as second argument");
    
    delay = "33.3";
    timer = jQueryChrono.create_timer(delay + "min", $.noop);
    strictEqual(timer.when / 60000, parseFloat(delay, 10), "works as first argument");
  });
  
  test("accepts only 2 or 3 arguments", function() {
    raises(function() {
      jQueryChrono.create_timer();
    }, "cannot accept no arguments");

    raises(function() {
      jQueryChrono.create_timer(50);
    }, "cannot accept 1 argument");

    doesNotRaise(function() {
      jQueryChrono.create_timer(50, $.noop);
    }, "can accept 2 arguments");

    doesNotRaise(function() {
      jQueryChrono.create_timer(50, "ms", $.noop);
    }, "can accept 3 arguments");

    raises(function() {
      jQueryChrono.create_timer(50, "ms", $.noop, $.noop);
    }, "cannot accept > 3 arguments");
  });
  
  module("create_timer: 1st argument");

  test("must be a number or a string", function() {
    raises(function() {
      jQueryChrono.create_timer($.noop, $.noop);
    });
    
    raises(function() {
      jQueryChrono.create_timer(true, $.noop);
    });
    
    doesNotRaise(function() {
      jQueryChrono.create_timer(50, $.noop);
      jQueryChrono.create_timer(50.2, $.noop);
    });
    
    doesNotRaise(function() {
      jQueryChrono.create_timer("50", $.noop);
      jQueryChrono.create_timer("50.2", $.noop);
      jQueryChrono.create_timer("50.2ms", $.noop);
    });
  });
  
  test("if numerical argument <= the default delay, return default delay", function() {
    var timer;
    timer = jQueryChrono.create_timer(1, $.noop);
    strictEqual(timer.when, jQueryChrono.defaults.delay);
    
    timer = jQueryChrono.create_timer(-7, $.noop);
    strictEqual(timer.when, jQueryChrono.defaults.delay);
    
    timer = jQueryChrono.create_timer(-50.2, $.noop);
    strictEqual(timer.when, jQueryChrono.defaults.delay);
    
    timer = jQueryChrono.create_timer("-37", $.noop);
    strictEqual(timer.when, jQueryChrono.defaults.delay);
    
    timer = jQueryChrono.create_timer("-50ms", $.noop);
    strictEqual(timer.when, jQueryChrono.defaults.delay);
  });
  
  test("if a string, it must start with a number", function() {
    raises(function() {
      jQueryChrono.create_timer("abc", $.noop);
    });
    
    raises(function() {
      jQueryChrono.create_timer("x50x", $.noop);
    });
    
    doesNotRaise(function() {
      jQueryChrono.create_timer("50", $.noop);
      jQueryChrono.create_timer("-49.2ms", $.noop);
    });
  });
  
  test("if a string with non-numerical characters, it must contain a valid time unit", function() {
    raises(function() {
      jQueryChrono.create_timer("6xxx", $.noop);
    });
    
    doesNotRaise(function() {
      jQueryChrono.create_timer("9sec", $.noop);
    });
  });
  
  module("create_timer: 2nd argument");
  
  test("must be a function or a string", function() {
    raises(function() {
      jQueryChrono.create_timer(5, 50, $.noop);
    });
    
    raises(function() {
      jQueryChrono.create_timer(5, true, $.noop);
    });
    
    doesNotRaise(function() {
      jQueryChrono.create_timer(5, $.noop);
    });
    
    doesNotRaise(function() {
      jQueryChrono.create_timer(5, "ms", $.noop);
      jQueryChrono.create_timer(5, "seconds", $.noop);
      jQueryChrono.create_timer(5, "hour", $.noop);
    });
  });
  
  test("if function, return it as callback", function() {
    var fn = function() {}, timer = jQueryChrono.create_timer(5, fn);
    strictEqual(timer.callback, fn);
  });
  
  test("if function and units weren't in first argument, use default time unit", function() {
    var delay = 5, timer = jQueryChrono.create_timer(delay, $.noop);
    strictEqual(timer.when / delay, 1);
  });
  
  test("if function and units were in first argument, don't use default time unit", function() {
    var delay = 13, timer = jQueryChrono.create_timer(delay + "min", $.noop);
    strictEqual(timer.when / 60000, delay);
  });
  
  test("if string, must be a valid time unit", function() {
    raises(function() {
      jQueryChrono.create_timer(5, "xxx", $.noop);
    });
    
    doesNotRaise(function() {
      jQueryChrono.create_timer(5, "sec", $.noop);
    });
  });
  
  test("if units were in first argument, must not be a string", function() {
    raises(function() {
      jQueryChrono.create_timer("5ms", "sec", $.noop);
    });
  });
  
  test("if units were not in first argument, must be set here", function() {
    var timer = jQueryChrono.create_timer("11", "sec", $.noop);
    strictEqual(timer.when / 11, 1000);
  });
  
  module("create_timer: 3rd argument");
  
  test("must be a function", function() {
    raises(function() {
      jQueryChrono.create_timer(5, "sec", "nope");
    });
    
    doesNotRaise(function() {
      jQueryChrono.create_timer(7, "min", $.noop);
    });
  });
  
  test("if function, return it as callback", function() {
    var fn = function() {}, timer = jQueryChrono.create_timer(9, 'hours', fn);
    strictEqual(timer.callback, fn);
  });
  
  test("if function was in second argument, must not be set", function() {
    raises(function() {
      var fn = function() {}, timer = jQueryChrono.create_timer(9, fn, fn);
    });
    
    doesNotRaise(function() {
      var fn = function() {}, timer = jQueryChrono.create_timer(9, fn);
    });
  });
});