jQuery(document).ready(function(){

	$("#tableWebRanking").tablesorter({
			
		widthFixed : true,
		widgets: [ 'zebra', 'cssStickyHeaders', 'filter' ],

		widgetOptions: {
			// cssStickyHeaders_addCaption    : true,
			// cssStickyHeaders_attachTo      : null,
			// cssStickyHeaders_filteredToTop : true,
			// cssStickyHeaders_offset: 0,
			
			filter_reset : '.reset',
			filter_searchFiltered : false,
		}


	});

});