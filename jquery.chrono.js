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
    return {
      when : defaults.delay,
      callback : $.noop
    }
  }
  
  return {
    defaults : defaults,
    create_timer : create_timer
  }
})();