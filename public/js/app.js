(function($, document, window){
	$(document).ready(function () {
		$("[data-background]").each(function(){
			var retina = window.devicePixelRatio > 1;
			var bg = $(this).data("background");
			if (retina) {
				var retinabg = bg.replace(".jpg","@2x.jpg");
				$(this).css("background-image","url("+retinabg+")");
			}
            else {
				$(this).css("background-image","url("+bg+")");
			}

		});

		$("[data-bg-color]").each(function(){
			var bg = $(this).data("bg-color");
			$(this).css("background-color",bg);
		});

		$(".slider").flexslider({
			directionNav: false,
			controlNav: true,
		});

		$(".quote-slider").flexslider({
			directionNav: true,
			controlNav: false,
			prevText: "<i class='fa fa-caret-left'></i>",
			nextText: "<i class='fa fa-caret-right'></i>",
		});

		var eventCarousel = $(".event-carousel");
		eventCarousel.owlCarousel({
			autoPlay: 3000,
			rewindNav: false,
			items : 4,
			itemsDesktop : [1199,3],
			itemsDesktopSmall : [979,3]

		});

		$("#event-next").click(function(e){
			e.preventDefault();
			eventCarousel.trigger('owl.next');
		});

        $("#event-prev").click(function(e){
			e.preventDefault();
			eventCarousel.trigger('owl.prev');
		});

		var $container = $('.filterable-items');

		$container.imagesLoaded(function(){
		    $container.isotope({
		        filter: '*',
		        layoutMode: 'fitRows',
		        animationOptions: {
		            duration: 750,
		            easing: 'linear',
		            queue: false
		        }
		    });
		});

        $('.filterable-nav a').click(function(e){
	    	e.preventDefault();
	        $('.filterable-nav .current').removeClass('current');
	        $(this).addClass('current');

	        var selector = $(this).attr('data-filter');
	        $container.isotope({
	            filter: selector,
	            animationOptions: {
	                duration: 750,
	                easing: 'linear',
	                queue: false
	            }
	         });
	         return false;
	    });

	    $('.mobile-filter').change(function(){

	        var selector = $(this).val();
	        $container.isotope({
	            filter: selector,
	            animationOptions: {
	                duration: 750,
	                easing: 'linear',
	                queue: false
	            }
	         });
	         return false;
	    });

	    initLightbox({
	    	selector : '.filterable-item a',
	    	overlay: true,
	    	closeButton: true,
	    	arrow: true
	    });

	    $(".mobile-menu").append($(".main-navigation .menu").clone());
	    $(".toggle-menu").click(function(){
	    	$(".mobile-menu").slideToggle();
	    });

	    /*
        if( $(".map").length ){
			$('.map').gmap3({
				map: {
					options: {
						maxZoom: 14,
						scrollwheel: false
					}
				},
				marker:{
					address: "40 Sibley St, Detroit",
				}
			},
			"autofit" );
	    }
        */
	});

	$(window).ready(function () {

	});

    function clearMessages () {
        $('#notsentmessage').hide()
        $('#errormessage').hide()
        $('#sendmessage').hide()
        $('#sendingmessage').hide()
    }

    $("form.newsletter-form").submit((evt) => {
        function clearInputs () {
            $('form.newsletter-form #email').val('')
        }

        clearMessages()

        console.log('Submitting newsletter form')

        evt.preventDefault()

        var state = $('form.newsletter-form #email').val()

        if (!state) {
            $('#notsentmessage.ns').show()
            $('#errormessage.ns').hide()
            $('#sendmessage.ns').hide()

            $.scrollTo($('#scroll-after-post.ns'))

            return;
        }

        $('#sendingmessage.ns').show()

        $.ajax({
            url: 'newsletter',
            dataType: 'json',
            type: 'POST',
            data: $("form.newsletter-form").serialize(),
            success: function (data) {
                $('#notsentmessage.ns').hide()
                $('#errormessage.ns').hide()
                $('#sendmessage.ns').show()
                $('#sendingmessage.ns').hide()

                clearInputs()

                $.scrollTo($('#scroll-after-post.ns'))
            },
            error: function (err) {
                $('#sendingmessage.ns').show()
                $('#notsentmessage.ns').hide()
                $('#errormessage.ns').show()
                $('#sendingmessage.ns').hide()

                // clearInputs()

                $.scrollTo($('#scroll-after-post.ns'))
            }
        })

        return false
    })

    $('form.upload-form').submit((evt) => {
        function clearInputs () {
            $('form.upload-form #name').val('')
            $('form.upload-form #stage_name').val('')
            $('form.upload-form #email').val('')
            $('form.upload-form #website').val('')
            $('form.upload-form #message').val('')
            $('form.upload-form #song_name').val('')
            $('form.upload-form #song').val('')
        }

        clearMessages()

        console.log('Submitting song upload')

        evt.preventDefault()

        var state = $('form.upload-form #name').val() &&
                    // $('form.upload-form #stage_name').val() &&
                    $('form.upload-form #email').val() &&
                    // $('form.upload-form #website').val() &&
                    // $('form.upload-form #message').val() &&
                    $('form.upload-form #song_name').val() &&
                    $('form.upload-form #song').val()

        if (!state) {
            $('#notsentmessage').show()
            $('#errormessage').hide()
            $('#sendmessage').hide()

            $.scrollTo($('#scroll-after-post'))

            return;
        }

        $('#sendingmessage').show()

        formData = new FormData($('form.upload-form')[0])

        $.ajax({
            url: 'upload',
            type: 'POST',
            contentType: false,
            data: formData,
            async: true,
            processData: false,
            success: function (data) {
                $('#notsentmessage').hide()
                $('#errormessage').hide()
                $('#sendmessage').show()
                $('#sendingmessage').hide()

                clearInputs()

                $.scrollTo($('#scroll-after-post'))
            },
            error: function (err) {
                $('#notsentmessage').hide()
                $('#errormessage').show()
                $('#sendmessage').hide()
                $('#sendingmessage').hide()

                // clearInputs()

                $.scrollTo($('#scroll-after-post'))
            }
        })

        return false
    })

    $("form.contact-form").submit((evt) => {
        function clearInputs () {
            $('form.contact-form #name').val('')
            $('form.contact-form #email').val('')
            $('form.contact-form #message').val('')
            $('form.contact-form #subject').val('')
        }

        clearMessages()

        console.log('Submitting contact form')

        evt.preventDefault()

        var state = $('form.contact-form #name').val() &&
                    $('form.contact-form #email').val() &&
                    $('form.contact-form #message').val() &&
                    $('form.contact-form #subject').val()

        if (!state) {
            $('#notsentmessage').show()
            $('#errormessage').hide()
            $('#sendmessage').hide()

            $.scrollTo($('#scroll-after-post'))

            return;
        }

        $('#sendingmessage').show()

        $.ajax({
            url: 'contact',
            dataType: 'json',
            type: 'POST',
            data: $("form.contact-form").serialize(),
            success: function (data) {
                $('#notsentmessage').hide()
                $('#errormessage').hide()
                $('#sendmessage').show()
                $('#sendingmessage').hide()

                clearInputs()

                $.scrollTo($('#scroll-after-post'))
            },
            error: function (err) {
                $('#notsentmessage').hide()
                $('#errormessage').show()
                $('#sendmessage').hide()
                $('#sendingmessage').hide()

                // clearInputs()

                $.scrollTo($('#scroll-after-post'))
            }
        })

        return false
    })

    if (window.audiojs) {
        audiojs.events.ready(function () {
            var as = audiojs.createAll()
        })
    }
})(jQuery, document, window);
