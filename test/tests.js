$(function() {
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
  
  module("create_timer return values", {
    setup : function() {
      this.stub_timer = jQueryChrono.create_timer(jQueryChrono.defaults.delay, 
                                                  jQueryChrono.defaults.units,
                                                  $.noop)
    }
  });
  
  test("expects a callback function", function() {
    ok($.isFunction(this.stub_timer.callback));
  });
  
  test("expects a number for when the timer should run, that's > the default", function() {
    strictEqual(typeof this.stub_timer.when, "number");
    ok(this.stub_timer.when >= jQueryChrono.defaults.delay);
  });
  
  module("arguments to create_timer");

  test("must take 2 or 3 arguments", function() {
    raises(function() {
      jQueryChrono.create_timer();
    }, "cannot accept no arguments");

    raises(function() {
      jQueryChrono.create_timer(50);
    }, "cannot accept 1 argument");

    function StubError() {};
    raises(function() {
      jQueryChrono.create_timer(50, $.noop);
      throw new StubError();
    }, StubError, "can accept 2 arguments");

    raises(function() {
      jQueryChrono.create_timer(50, "ms", $.noop);
      throw new StubError();
    }, StubError, "can accept 3 arguments");

    raises(function() {
      jQueryChrono.create_timer(50, "ms", $.noop, $.noop);
    }, "cannot accept > 3 arguments");
  });
});