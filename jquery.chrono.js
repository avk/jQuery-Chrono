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
  }
  
  function create_timer() {
    var delay = null, units = null, closure = $.noop;
    
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
    } else {
      $.error("jQuery.after and jQuery.every expect a numerical first argument");
    }
    
    // 2. Validate the arguments
    
    if (delay < defaults.delay) {
      delay = defaults.delay;
    }
    
    return {
      when : delay,
      callback : closure
    }
  }
  
  return {
    defaults : defaults,
    create_timer : create_timer
  }
})();