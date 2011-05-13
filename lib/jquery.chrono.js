/**
 * @fileOverview The jQuery Chrono plugin
 * Copyright (c) 2011 Arthur Klepchukov
 * Licensed under the BSD license (BSD_LICENSE.txt)
 *
 * @author <a href="mailto:first-name.last-name@gmail.com">Arthur Klepchukov</a>
 * @version 1.0
 */

/*global jQuery, $ */ 
var jQueryChrono;

/**
 * The extended jQuery library
 * @name jQuery
 * @class the extended jQuery library
 * @exports $ as jQuery
 */

(function($) {
  /**
   * Syntactic sugar for setTimeout.
   * <pre>
   *    setTimeout(function() { ... }, 300000); // becomes:
   *    $.after(5, "minutes", function() { ... });
   *    
   *    // other valid calls:
   *    $.after(100, function() { ... }); // 100 milliseconds
   *    $.after("9.7", function() { ... }); // 9.7 milliseconds
   *    $.after("50sec", function() { ... }); // 50 seconds
   *    $.after("33", "hours", function() { ... }); // 33 hours
   * </pre>
   * Valid time units include: 
   * <strong>millisecond, second, minute, hour, & day</strong><br />
   * along with all their common abbreviations and pluralizations.<br />
   * (See full list of valid time units: {@link jQueryChrono-valid_units})
   * @name jQuery.after
   */
  function after() {
    var timer = jQueryChrono.create_timer.apply(this, arguments);
    return setTimeout(timer.callback, timer.when);
  }
  
  /**
   * Syntactic sugar for setTimeout.
   * <pre>
   *    setInterval(function() { ... }, 300000); // becomes:
   *    $.every(5, "minutes", function() { ... });
   * </pre>
   * Supports the same syntax and arguments as {@link jQuery.after}
   * @name jQuery.every
   */
  function every() {
    var timer = jQueryChrono.create_timer.apply(this, arguments);
    return setInterval(timer.callback, timer.when);
  }
  
  $.extend({
    after : after,
    every : every
  });
}(jQuery));

/**
 * @namespace Testable namespace for helpers
 */
jQueryChrono = (function() {
  /**
   * Reasonable defaults (delay: 4, units: ms), based on how Mozilla works with timers:
   * https://developer.mozilla.org/en/window.setTimeout#Minimum_delay_and_timeout_nesting
   * @constant
   */
  var defaults = {
        delay: 4,
        units: "milliseconds"
      },
      // each supported unit, in milliseconds
      ms  = 1,
      sec = ms  * 1000,
      min = sec * 60,
      hr  = min * 60,
      day = hr  * 24;
      
  /**
   * The supported units of time:<br />
   *  millisecond, milliseconds, ms,<br />
   *  second, seconds, sec, secs, s,<br />
   *  minute, minutes, min, mins, m,<br />
   *  hour, hours, hr, hrs, h,<br />
   *  day, days, d
   * @constant
   */
  var valid_units = {
        "millisecond" : ms,
        "milliseconds": ms,
        "ms"          : ms,
        
        "second"      : sec,
        "seconds"     : sec,
        "sec"         : sec,
        "secs"        : sec,
        "s"           : sec,
        
        "minute"      : min,
        "minutes"     : min,
        "min"         : min,
        "mins"        : min,
        "m"           : min,
        
        "hour"        : hr,
        "hours"       : hr,
        "hr"          : hr,
        "hrs"         : hr,
        "h"           : hr,
        
        "day"         : day,
        "days"        : day,
        "d"           : day
      };
  
  /**
   * Parses a numerical delay from the given arguments.
   * 
   * @param {Object} parsed The arguments parsed so far
   * @param {arguments} args The original arguments from the caller
   *  (e.g. {@link jQueryChrono.create_timer})
   * @throws Exception if the delay is not a number
   * @returns {Object} The parsed parameter updated with the parsed delay
   */
  function parse_delay(parsed, args) {
    if (typeof args[0] === "string") {
      parsed.delay = parseFloat(args[0], 10);
    } else {
      parsed.delay = args[0];
    }
    
    if (typeof parsed.delay !== "number" || isNaN(parsed.delay)) {
      $.error("$.after and $.every - Require a numerical delay as the 1st argument");
    }
    
    return parsed;
  }

  /**
   * Parses a units string from the given arguments.
   * 
   * @param {Object} parsed The arguments parsed so far
   * @param {arguments} args The original arguments from the caller
   *  (e.g. {@link jQueryChrono.create_timer})
   * @throws Exception if the units are not a key of {@link jQueryChrono-valid_units}
   * @returns {Object} The parsed parameter updated with the parsed units
   */
  function parse_units(parsed, args) {
    if (typeof args[0] === "string" && parsed.delay !== null) {
      parsed.units = args[0].replace(parsed.delay, "") || null; // "9.7sec" || "9.7"
    }
    if (typeof args[1] === "string") {
      parsed.units = args[1];
    }
    if (parsed.units === null && args.length === 2) { // no units specified
      parsed.units = defaults.units;
    }
    
    if (typeof valid_units[parsed.units] !== "number") {
      $.error("$.after and $.every - Require a valid unit of time as the 2nd argument");
    }
    
    return parsed;
  }
  
  /**
   * Parses a callback function from the given arguments.
   * 
   * @param {Object} parsed The arguments parsed so far
   * @param {arguments} args The original arguments from the caller
   *  (e.g. {@link jQueryChrono.create_timer})
   * @throws Exception if the callback is not a function
   * @returns {Object} The parsed parameter updated with the parsed callback
   */
  function parse_callback(parsed, args) {
    parsed.callback = args[args.length - 1];
    
    if (!$.isFunction(parsed.callback)) {
      $.error("$.after and $.every - Require a callback as the last argument");
    }
    
    return parsed;
  }
  
  /** @scope jQueryChrono */
  return {
    defaults : defaults,
    valid_units : valid_units,
    /**
     * Accepts more human-readable arguments for creating JavaScript timers and 
     * converts them to values that can be inspected and passed along to 
     * setTimeout or setInterval.<br />
     * If the time when the timer should run is negative or faster than 
     * the default ({@link jQueryChrono-defaults}), 
     * it uses the default delay and default units.
     *
     * @param {Number|String} delay|delay+units 
     *  Combined with units, represents when a timer should run.<br />
     *  Units can be specified as part of this argument as a suffix of the string and 
     *  must represent a valid unit of time ({@link jQueryChrono-valid_units}).
     * @param {String} [units] 
     *  Combined with the delay, represents when a timer should run.
     *  If present, must be a valid unit of time ({@link jQueryChrono-valid_units}).
     * @param {Function} callback 
     *  Represents the code to be executed when the timer is ready.
     * 
     * @returns {Object} An object with a valid "delay", a valid "units" string, 
     *  a time, in milliseconds, of "when" the timer should run, and 
     *  a "callback" that the timer should execute when it's ready.
     * @static
     */
    create_timer : function() {
      var parsed = {
        delay : null,
        units : null,
        when : null,
        callback : null
      };
    
      if (arguments.length < 2 || arguments.length > 3) {
        $.error("$.after and $.every - Accept only 2 or 3 arguments");
      }
    
      parsed = parse_delay(parsed, arguments);
      parsed = parse_units(parsed, arguments);
      parsed = parse_callback(parsed, arguments);
    
      // Reset to defaults, if necessary
      if (parsed.delay < defaults.delay && parsed.units === defaults.units) {
        parsed.delay = defaults.delay;
      }
      if (parsed.delay < 0) {
        parsed.delay = defaults.delay;
        parsed.units = defaults.units;
      }
    
      parsed.when = parsed.delay * valid_units[parsed.units];
    
      return parsed;
    }
  };
}());