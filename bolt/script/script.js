jQuery(document).ready(function(){

	//STICKY HEADER
	jQuery(window).scroll(function() {    
	    var scroll = jQuery(window).scrollTop();
	    if (scroll >= 1) {
	        jQuery(".site-header").addClass("scrolled");
	    } else {
	        jQuery(".site-header").removeClass("scrolled");
	    }
	});


	$('.client-carousel').owlCarousel({
		loop: true,
		margin: 10,
		nav: true,
		autoplay: true,
    	autoplayTimeout: 3000,
		responsive: {
			0: {
				items: 4,
				margin: 10,
			},
			576: {
				items: 4,
				margin: 30,
			},
			768: {
				items: 5,
				margin: 30,
			},
			992: {
				items: 6,
				margin: 30,
			},
			1200: {
				items: 6,
				margin: 40,
			},
			1400: {
				items: 8,
				margin: 60,
			}
		}
	});

}); //Script End
