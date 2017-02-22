;(function() {

	/**
	 * Calculate document scroll size
	 *
	 * @return {Object}
	 */
	var _calcSize = function() {
		return {
			x: document.documentElement.scrollWidth  || document.body.scrollWidth,
			y: document.documentElement.scrollHeight || document.body.scrollHeight
		}
	}

	/**
	 * Calculate document viewport
	 *
	 * @return {Object}
	 */
	var _calcViewport = function() {
		return {
			x: document.documentElement.clientWidth  || document.body.clientWidth,
			y: document.documentElement.clientHeight || document.body.clientHeight
		}
	}

	/**
	 * Calculate document scroll position
	 *
	 * @return {Object}
	 */
	var _calcPosition = function() {
		return {
			x: (window.pageXOffset || document.documentElement.scrollLeft || document.body.scrollLeft) - (document.documentElement.clientLeft || 0),
			y: (window.pageYOffset || document.documentElement.scrollTop  || document.body.scrollTop)  - (document.documentElement.clientTop  || 0)
		}
	}

	/**
	 * Set document scroll position (x)
	 *
	 * @param  {Number} value
	 * @return {Void}
	 */
	var _setPositionX = function(value) {
		if (typeof value !== "number") return;

		document.documentElement.scrollLeft = value;
		document.body.scrollLeft            = value;
	}

	/**
	 * Set document scroll position (y)
	 *
	 * @param  {Number} value
	 * @return {Void}
	 */
	var _setPositionY = function(value) {
		if (typeof value !== "number") return;

		document.documentElement.scrollTop  = value;
		document.body.scrollTop             = value;
	}

	/**
	 * Set document scroll position:
	 * pass x,y parameters to method or
	 * object with x and/or y attributes
	 *
	 * @param  {Mixed} x
	 * @param  {Mixed} y
	 * @return {Void}
	 */
	var _setPosition = function(x, y) {
		if (typeof x === "number") _setPositionX(x);
		if (typeof y === "number") _setPositionY(y);
		if (typeof x === "object") _setPositionX(x.x);
		if (typeof x === "object") _setPositionY(x.y);
	}

	/**
	 * Document scroll event handler:
	 * recalculates advanceDocumentScroll.position
	 * and triggers custom events
	 *
	 * @param  {Object} e
	 * @return {Void}
	 */
	var _handleScroll = function(e) {
		// get new position
		var position = _calcPosition();

		// trigger event on page load
		if (position.x === lib.currentPosition.x && position.y === lib.currentPosition.y) {
			return _trigger("advancedocumentscrollinit", e);
		}

		// set old position
		lib.lastPosition = lib.currentPosition;

		// trigger start
		if (lib._stopDetection.interval === -1) {
			lib.startPosition = {
				x: lib.lastPosition.x,
				y: lib.lastPosition.y
			}

			_trigger("advancedocumentscrollstart", e);
		}

		// set new position
		lib.currentPosition = position;

		// trigger scroll
		_trigger("advancedocumentscroll", e);

		// scroll event stop detection
		clearInterval(lib._stopDetection.interval);
		lib._stopDetection.interval = setTimeout(_handleStop, lib._stopDetection.timeout, e);
	}

	/**
	 * Document end scroll event handler:
	 * triggers custom event
	 *
	 * @param  {Object} e
	 * @return {Void}
	 */
	var _handleStop = function(e) {
		_trigger("advancedocumentscrollend", e);

		// clear
		lib.startPosition = null;
		lib._stopDetection.interval = -1;
	}

	/**
	 * Trigger custom event
	 *
	 * @param  {String} eventName
	 * @param  {Object} originalEvent
	 * @return {Void}
	 */
	var _trigger = function(eventName, originalEvent) {
		var event, detail = {
			originalEvent: originalEvent,
			size: lib.size(),
			viewport: lib.viewport(),
			startPosition: lib.startPosition,
			currentPosition: lib.currentPosition,
			lastPosition: lib.lastPosition
		}

		// init custom event
		if (typeof window.CustomEvent === "function") {
			event = new CustomEvent(eventName, { "detail": detail });
		}
		else {
			// ie fallback
			event = document.createEvent("CustomEvent");
			event.initCustomEvent(eventName, true, true, detail);
		}

		// dispatch event
		document.dispatchEvent(event);
	}

	/**
	 * Advance scroll object
	 *
	 * @type {Object}
	 */
	var lib = {
		_stopDetection: {
			interval: -1,
			timeout: 100,
		},
		size: _calcSize,
		viewport: _calcViewport,
		startPosition: null,
		currentPosition: _calcPosition(),
		lastPosition: _calcPosition(),
		setPosition: _setPosition
	}
	window.advanceDocumentScroll = lib;

	// init...
	document.addEventListener("scroll", _handleScroll, false);

})();
