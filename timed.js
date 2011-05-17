/**
 * Timed
 * Copyright (c) 2011 Jarvis Badgley, Arthur Klepchukov
 * https://github.com/ChiperSoft/Timed
 * Licensed under the BSD license (BSD_LICENSE.txt)
 *
 * @author <a href="mailto:chipersoft@gmail.com">Jarvis Badgley</a>
 * @version 1.0
 */


!function (context, doc) {
	/**
	 * Reasonable defaults (delay: 4, units: ms), based on how Mozilla works with timers:
	 * https://developer.mozilla.org/en/window.setTimeout#Minimum_delay_and_timeout_nesting
	 * @constant
	 */
	var defaults = {
		delay: 4,
		units: "milliseconds"
	};
	
	// each supported unit, in milliseconds
	var ms	= 1,
		sec = ms	* 1000,
		min = sec	* 60,
		hr	= min	* 60,
		day = hr	* 24;
			
	//supported unit formats.
	var valid_units = {
		millisecond		: ms,
		milliseconds	: ms,
		ms				: ms,

		second			: sec,
		seconds			: sec,
		sec				: sec,
		secs			: sec,
		s				: sec,

		minute			: min,
		minutes			: min,
		min				: min,
		mins			: min,
		m				: min,

		hour			: hr,
		hours			: hr,
		hr				: hr,
		hrs				: hr,
		h				: hr,

		day				: day,
		days			: day,
		d				: day
	};
	
	
	/**
	 * Accepts more human-readable arguments for creating JavaScript timers and 
	 * converts them to values that can be inspected and passed along to 
	 * setTimeout or setInterval.
	 * If the time when the timer should run is negative or faster than 
	 * the default it uses the default delay and default units.
	 */
	function create_timer() {
		var parsed = {
			delay : null,
			units : null,
			when : null,
			callback : null
		}, ac = arguments.length,
			name,
			timer;
	
		if ( (ac < 2) || ac > 3) throw ("Timed.after and Timed.every - Accept only 2 or 3 arguments");
		
		
		//parse callback function
		parsed.callback = arguments[ac - 1];
		if (typeof parsed.callback !== 'function') throw ("Timed.after and Timed.every - Require a callback as the last argument");
		
		
		//if the first arg is an array, run this function on each item and return the value, else do normal arg calls
		if (arguments[0] instanceof Array) {
			//create a baseline for the units
			parsed.units = 'milliseconds';
			
			for (name in arguments[0]) {
				timer = create_timer.apply(this, [arguments[0][name][0], arguments[0][name][1], parsed.callback]);
				parsed.delay += timer.when;
			}
		} else {
			//parse delay field
			parsed.delay = (typeof arguments[0] === "string") ? parseFloat(arguments[0], 10) : arguments[0];
			if (typeof parsed.delay !== "number" || isNaN(parsed.delay)) throw ("Timed.after and Timed.every - Require a numerical delay as the 1st argument");
	
	
	
			//parse units field
			if (typeof arguments[0] === "string" && parsed.delay !== null) { //find units in "50sec" style delays
				parsed.units = arguments[0].replace(/[^a-z]*/, "") || null;
			}
			if (typeof arguments[1] === "string") {
				parsed.units = arguments[1];
			}
			if (parsed.units === null && ac === 2) { // no units specified
				parsed.units = defaults.units;
			}
			
			if (typeof valid_units[parsed.units] !== "number") throw ("Timed.after and Timed.every - Require a valid unit of time as the 2nd argument");		
	
	
		
			// Reset to defaults, if necessary
			if (parsed.delay < defaults.delay && parsed.units === defaults.units) {
				parsed.delay = defaults.delay;
			}
			if (parsed.delay < 0) {
				parsed.delay = defaults.delay;
				parsed.units = defaults.units;
			}
		}
		
		parsed.when = parsed.delay * valid_units[parsed.units];
		
		return parsed;
	}
	

	var Timed = {
		/**
		 * Syntactic sugar for setTimeout.
		 *		setTimeout(function() { ... }, 300000); // becomes:
		 *		Timed.after(5, "minutes", function() { ... });
		 *
		 *		// other valid calls:
		 *		Timed.after(100, function() { ... }); // 100 milliseconds
		 *		Timed.after("9.7", function() { ... }); // 9.7 milliseconds
		 *		Timed.after("50sec", function() { ... }); // 50 seconds
		 *		Timed.after("33", "hours", function() { ... }); // 33 hours
		 *
		 * Valid time units include millisecond, second, minute, hour, & day
		 * along with all their common abbreviations and pluralizations.
		 */
		after : function after() {
			var timer = create_timer.apply(this, arguments);
			return setTimeout(timer.callback, timer.when);
		},

		/**
		 * Syntactic sugar for setTimeout.
		 *
		 *		setInterval(function() { ... }, 300000); // becomes:
		 *		Timed.every(5, "minutes", function() { ... });
		 *
		 * Supports the same syntax and arguments as Timed.after
		 */
		every : function every() {
			var timer = create_timer.apply(this, arguments);
			return setInterval(timer.callback, timer.when);
		}
	};

	var oldTimed = context.Timed;
	Timed.noConflict = function () {
		context.Timed = oldTimed;
		return this;
	};
	context.Timed = Timed;

}(this, document);