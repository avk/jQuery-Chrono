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
  
  module("create_timer return values");
  
  test("expects a callback function", function() {
    var timer = jQueryChrono.create_timer();
    ok($.isFunction(timer.callback));
  });
  
  test("expects a number for when the timer should run, that's > the default", function() {
    var timer = jQueryChrono.create_timer();
    strictEqual(typeof timer.when, "number");
    ok(timer.when >= jQueryChrono.defaults.delay);
  });
  
  
});