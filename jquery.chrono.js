/* 
 * jQuery Chrono plugin
 * by Arthur Klepchukov - arthur.klepchukov@gmail.com
 * Released under the BSD license (BSD_LICENSE.txt)
 */

(function($) {
  $.after = function() {
    var timer = create_timer(arguments);
    return setTimeout(timer.callback, timer.when);
  };
  
  $.every = function() {
    var timer = create_timer(arguments);
    return setInterval(timer.callback, timer.when);
  }
})(jQuery);

// Testable namespace for helpers
var jQueryChrono = (function() {
  var defaults = {
        delay: 4, // https://developer.mozilla.org/en/window.setTimeout#Minimum_delay_and_timeout_nesting
        units: "milliseconds"
      },
      ms  = 1,
      sec = ms  * 1000,
      min = sec * 60,
      hr  = min * 60,
      day = hr  * 24,
      valid_units = {
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
      }
  
  function create_timer() {
    var delay = null, units = null, closure = null;
    
    if (arguments.length < 2 || arguments.length > 3) {
      $.error("jQuery.after and jQuery.every expect at least 2 and at most 3 arguments");
    }
    
    // 1. Parse the arguments
    
    if (typeof arguments[0] === "number") {
      delay = arguments[0];
    } else if (typeof arguments[0] === "string") {
      delay = parseFloat(arguments[0], 10);
      if (isNaN(delay)) {
        $.error("jQuery.after and jQuery.every expect a numerical first argument");
      }
      
      // strips the number, in case there are units following it
      units = arguments[0].replace(delay, '');
      if (units === "") { // this argument is just digits
        units = null;
      } else if (!valid_units[units]) {
        $.error("jQuery.after and jQuery.every expect a valid time unit argument (e.g. ms, sec, etc.)");
      }
    } else {
      $.error("jQuery.after and jQuery.every expect a numerical first argument");
    }
    
    if ($.isFunction(arguments[1])) {
      closure = arguments[1];
      if (units === null) { // first argument was just a number, no units
        units = defaults.units;
      }
    } else if (typeof arguments[1] === "string") {
      if (units === null) { // first argument was just a number, no units
        units = arguments[1];
      } else {
        $.error("jQuery.after and jQuery.every expect only one time unit argument (e.g. ms, sec, etc.)");
      }
    } else {
      $.error("jQuery.after and jQuery.every expect a function or a string as their second argument");
    }
    
    if (closure === null) {
      if ($.isFunction(arguments[2])) {
        closure = arguments[2];
      } else {
        $.error("jQuery.after and jQuery.every expect one function as their last argument");
      }
    } else if ($.isFunction(arguments[2])) {
      $.error("jQuery.after and jQuery.every expect one function as their last argument");
    }
    
    // 2. Validate the arguments
    
    if (delay < defaults.delay) {
      delay = defaults.delay;
    }
    
    if (!valid_units[units]) {
      $.error("jQuery.after and jQuery.every expect a valid time unit argument (e.g. ms, sec, etc.)");
    }
    
    return {
      when : delay * valid_units[units],
      callback : closure
    }
  }
  
  return {
    defaults : defaults,
    valid_units : valid_units,
    create_timer : create_timer
  }
})();