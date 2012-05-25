
(function($, undefined) {

	/**
	 * Infinite progress bar based on the design/idea
	 * of the Windows Phone 7.5 progress bar
	 *
	 * Author: Patrick Timm, patrick@isharp.dk
	 * Version: 2012-05-25
	 *
	 * Requires:
	 * jQuery 1.7.2
	 * jQueryUI 1.8.20
	 * 		- Core
	 *		- Widget
	 *		- Effects Core
	 */
	$.widget("ui.wpprogress", {
	
		"options": {
			/**
			 * The background color to use for the bubbles
			 * Default = "#00f"
			 * @type String
			 */
			"bubbleBackgroundColor": "#00f",
			
			/**
			 * Whether to enable debugging features.
			 * Default = false
			 * @type Boolean
			 */
			"enableDebug": false
		},
		
		/**
		 * Stores original values for CSS properties
		 * that we override, so we can restore them
		 * during "destroy"
		 * @type Hash (css-property => value)
		 */
		"_originalCss": {},
		
		/**
		 * Current state
		 * @type String
		 */
		"_state": "stopped",
		
		/**
		 * Initialization method
		 */
		"_create": function() {
			this.$element = $(this.element);
			
			// get and store CSS values for properties
			// that we override
			this._originalCss["position"] = this.$element.css("position");
			this._originalCss["overflow-x"] = this.$element.css("overflow-x");
			
			// override CSS properties
			this.$element.css("position", "relative");
			this.$element.css("overflow-x", "hidden");
			
			// generate the UI
			this._makeUi();
		},
		
		/**
		 * Generates the UI elements
		 */
		"_makeUi": function() {
		
			// used for outputting duration values
			// when debug is enabled
			this.$duration = $("<span></span>");
			this.$element.append(this.$duration);
		
			this._bubbles = [
				this._makeBubble(),
				this._makeBubble(),
				this._makeBubble(),
				this._makeBubble(),
				this._makeBubble()
			];
			
			for (var x in this._bubbles) {
				this.$element.append(this._bubbles[x]);
			}
		},
		
		/**
		 * Generates a jQuery element representing
		 * a bubble.
		 *
		 * @returns jQuery
		 */
		"_makeBubble": function() {
			return $("<div></div>")
						.css({
							"position": "absolute",
							"background-color": this.options.bubbleBackgroundColor,
							"width": "5px",
							"height": "5px",
							"display": "inline-block",
							"border-radius": "3px"
						})
						.hide();
		},
		
		/**
		 * Center the given bubble vertically
		 * within the given container
		 *
		 * @param jQuery The bubble element
		 * @param jQuery The container element
		 *
		 * @returns void
		 */
		"_centerBubbleInParent": function($bubble, $container) {
			var conHeight = $container.innerHeight();
			
			var bHeight = $bubble.outerHeight();
			var pos = (conHeight / 2) - (bHeight / 2);
			
			$bubble.css("top", pos);
		},
		
		/**
		 * Contains values used when initializing
		 * the animation.
		 * The values are calculated each time "start"
		 * is called.
		 * @type Hash
		 */
		"_animationProperties": {
		},
		
		/**
		 * Start the "progress bar"
		 */
		"start": function() {
		
			var pWidth = this.$element.innerWidth();
			var bWidth = this._bubbles[0].outerWidth();
			
			var props = {};
			
			props["numBubbles"] = this._bubbles.length;
			props["repeatFn"] = $.proxy(function() { this._restart(); }, this);
			props["pWidth"] = pWidth;
			props["duration"] = this._getDuration(pWidth);
			props["bWidth"] = bWidth;
			props["bubbleSpacing"] = 1.5 * bWidth;
			props["pCenter"] = pWidth/2 - ((props["bubbleSpacing"] * props["numBubbles"]) / 2);
			
			// make sure bubbles are vertically centered
			for (var x in this._bubbles) {
				this._centerBubbleInParent(this._bubbles[x], this.$element);
			}
			
			// output duration (for debugging)
			if (this.options.enableDebug === true) {
				this.$duration.text(props["duration"]);
			}
			
			// store the animation properties
			this._animationProperties = props;
		
			// update state
			this._state = "running";
			
			// start the animation loop
			this._animate();
		},
		
		/**
		 * Start animation
		 */
		"_animate": function() {
			var props = this._animationProperties;
			
			var finalBubbleIndex = props["numBubbles"] - 1;
			var curRepeatFn = null;
		
			for (var x in this._bubbles) {
				// calculate offset, so that the right-most bubble
				// (aka "the first bubble") has the largest offset
				offset = (props["numBubbles"] - x) * props["bubbleSpacing"];
				
				// the last bubble should have a "complete" method
				// that restarts the animation
				if (x == finalBubbleIndex) {
					curRepeatFn = props["repeatFn"];
				}
				
				this._bubbles[x]
					.css("left", -props["bWidth"])
					.css("opacity", 0)
					.show()
					.delay(x * 95) // delay each bubble animation, so they do not clump together
					.animate({
						"left": props["pCenter"] + offset,
						"opacity": 1
					}, props["duration"], "easeOutCirc")
					.animate({
						"left": props["pWidth"] + props["bWidth"] + offset,
						"opacity": 0
					}, props["duration"], "easeInSine", curRepeatFn);
			}
		},
		
		/**
		 * Width-range to duration table
		 * @type Hash (width => duration)
		 */
		"_durations": {
			0: 600,
			500: 900,
			1000: 1200
		},
		
		/**
		 * Get duration for width
		 *
		 * @param Number The width of the container
		 *
		 * @returns Int
		 */
		"_getDuration": function(width) {

			var lastX = -1;
			for (var x in this._durations) {
				// if width is greater than X
				// then X is a valid candidate
				if (width >= x) {
					lastX = x;
				}
				
				// if width is less than X, and
				// lastX is defined, then lastX
				// is the correct candidate
				else if (width < x && lastX > -1) {
					return this._durations[lastX];
				}
			}
			
			// no more entries... use last valid candidate
			return this._durations[lastX];
		},
		
		/**
		 * Restart animation if state allows it.
		 */
		"_restart": function() {
			if (this._state == "running") {
				this._animate();
			}
		},
		
		/**
		 * Stop the "progress bar"
		 */
		"stop": function() {
			this._state = "stopped";
			
			for (var x in this._bubbles) {
				this._bubbles[x]
					.stop()
					.clearQueue()
					.hide();
			}
		},
		
		/**
		 * Destroy the widget instance and return
		 * everything to it's original state
		 */
		"_destroy": function() {
			this.$element.css(this._originalCss);
			$.Widget.prototype.destroy.apply(this, arguments);
		}
	});

})(jQuery);
