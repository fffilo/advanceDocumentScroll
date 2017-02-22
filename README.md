Advance Document Scroll
=======================

Adds scroll events (`advancedocumentscrollinit`, `advancedocumentscrollstart`, `advancedocumentscroll`, `advancedocumentscrollstop`) to document element.

## Usage

	document.addEventListener("advancedocumentscrollinit", function(e) {
		// triggers on page load if document scroll position is not zero
		console.log(e);
	}, false);

	document.addEventListener("advancedocumentscrollstart", function(e) {
		// triggers when user starts scrolling
		console.log(e);
	}, false);

	document.addEventListener("advancedocumentscroll", function(e) {
		// triggers when user scrolls
		console.log(e);
	}, false);

	document.addEventListener("advancedocumentscrollend", function(e) {
		// triggers when user ends scrolling
		console.log(e);
	}, false);
