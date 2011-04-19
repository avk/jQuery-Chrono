/* 
 * jQuery Chrono plugin
 * by Arthur Klepchukov - arthur.klepchukov@gmail.com
 * Released under the BSD license (BSD_LICENSE.txt)
 */

(function($) {
  $.after = function() {
    return jQueryChrono.create_timer("after", arguments);
  };
  
  $.every = function() {
    return jQueryChrono.create_timer("every", arguments);
  }
})(jQuery);

// Testable namespace for helpers
var jQueryChrono = (function() {
  var defaults = {
    delay: 4, // https://developer.mozilla.org/en/window.setTimeout#Minimum_delay_and_timeout_nesting
    units: "milliseconds"
  }
  
  function create_timer() {
    return null;
  }
  
  return {
    defaults : defaults,
    create_timer : create_timer
  }
})();