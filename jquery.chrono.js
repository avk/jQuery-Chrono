/* 
 * jQuery Chrono plugin
 * by Arthur Klepchukov - arthur.klepchukov@gmail.com
 * Released under the BSD license (BSD_LICENSE.txt)
 */

(function($) {
  $.fn.after = function() {
    return jQueryChrono.create_timer("after", arguments);
  }
  
  $.fn.every = function() {
    return jQueryChrono.create_timer("every", arguments);
  }
})(jQuery);

// Testable namespace for helpers
var jQueryChrono = {
  defaults : {},
  create_timer : function() { return null; }
}