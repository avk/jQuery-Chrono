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
  
  test("returns a number for 'when' the timer should run, that's > the default", function() {
    strictEqual(typeof this.stub_timer.when, "number");
    ok(this.stub_timer.when >= jQueryChrono.defaults.delay);
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
  
  module("create_timer: first argument");

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
  
  test("if a number, it can't be less than the default delay", function() {
    var timer = jQueryChrono.create_timer(-7, $.noop);
    strictEqual(timer.when, jQueryChrono.defaults.delay);
  });
  
  test("if a string, it must contain a number >= the default delay", function() {
    var timer;
    
    raises(function() {
      jQueryChrono.create_timer("abc", $.noop);
    });
    
    timer = jQueryChrono.create_timer("-37", $.noop);
    strictEqual(timer.when, jQueryChrono.defaults.delay);
    
    timer = jQueryChrono.create_timer("-50ms", $.noop);
    strictEqual(timer.when, jQueryChrono.defaults.delay);
  });
  
  test("must be a factor of the 'when' returned value", function() {
    var delay, timer;
    
    delay = 27;
    timer = jQueryChrono.create_timer(delay, "ms", $.noop);
    strictEqual(timer.when % delay, 0, "accepts integers");
    
    delay = 57.5;
    timer = jQueryChrono.create_timer(delay, "ms", $.noop);
    strictEqual(timer.when / 1, delay, "accepts floats");
    
    delay = "27";
    timer = jQueryChrono.create_timer(delay + "ms", $.noop);
    strictEqual(timer.when % parseInt(delay, 10), 0, "accepts integers in strings");
    
    delay = "57.5";
    timer = jQueryChrono.create_timer(delay + "ms", $.noop);
    strictEqual(timer.when / 1, parseFloat(delay, 10), "accepts floats in strings");
  });
  
  test("if a stringified number, it must use the default time unit", function() {
    var delay = "8", timer = jQueryChrono.create_timer(delay, $.noop);
    strictEqual(timer.when / parseInt(delay, 10), 1);
  });
  
  test("if a string with non-numerical characters, it must contain a valid time unit", function() {
    raises(function() {
      jQueryChrono.create_timer("6xxx", $.noop);
    });
    
    doesNotRaise(function() {
      jQueryChrono.create_timer("9sec", $.noop);
    });
  });
  
});