$(document).ready(function () { 

	// Extend the jQuery object with a .filterizr method
	Filterizr.installAsJQueryPlugin($);

	// Use Filterizr as a jQuery plugin
	$('.filter-container').filterizr({
		filter: 'all',
		filterOutCss: {
			// opacity: 0,
			// transform: 'scale(0.5)'
		},
		filterInCss: {
			// opacity: 0,
			// transform: 'scale(1)'
		},
		gridItemsSelector: '.col-6',
		layout: 'sameSize',
	});
   
});