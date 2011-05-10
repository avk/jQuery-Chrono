/* 
 * jQuery Chrono plugin
 * by Arthur Klepchukov - arthur.klepchukov@gmail.com
 * Released under the BSD license (BSD_LICENSE.txt)
 */

(function($) {
  $.after = function() {
    var timer = jQueryChrono.create_timer(arguments);
    return setTimeout(timer.callback, timer.when);
  };
  
  $.every = function() {
    var timer = jQueryChrono.create_timer(arguments);
    return setInterval(timer.callback, timer.when);
  };
})(jQuery);

// Testable namespace for helpers
var jQueryChrono = (function() {
  // Reasonable defaults, based on how Mozilla works with timers:
  // https://developer.mozilla.org/en/window.setTimeout#Minimum_delay_and_timeout_nesting
  var defaults = {
        delay: 4,
        units: "milliseconds"
      },
      // each supported unit, in milliseconds
      ms  = 1,
      sec = ms  * 1000,
      min = sec * 60,
      hr  = min * 60,
      day = hr  * 24,
      // keys are all the valid strings of each supported unit
      // values are the key unit, in milliseconds
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
  
  function parse_callback(parsed, args) {
    parsed.callback = args[args.length - 1];
    
    if (!$.isFunction(parsed.callback)) {
      $.error("$.after and $.every - Require a callback as the last argument");
    }
    
    return parsed;
  }
  
  function create_timer() {
    var parsed = {
      delay : null,
      units : null,
      when : null,
      callback : null
    }
    
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
  
  return {
    defaults : defaults,
    valid_units : valid_units,
    create_timer : create_timer
  }
})();