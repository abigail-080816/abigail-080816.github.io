(function($) {

	var	$window = $(window),
		$body = $('body');

	// Breakpoints.
	breakpoints({
		default:   ['1681px',   null       ],
		xlarge:    ['1281px',   '1680px'   ],
		large:     ['981px',    '1280px'   ],
		medium:    ['737px',    '980px'    ],
		small:     ['481px',    '736px'    ],
		xsmall:    ['361px',    '480px'    ],
		xxsmall:   [null,       '360px'    ]
	});

	// Play initial animations on page load.
	$window.on('load', function() {
		window.setTimeout(function() {
			$body.removeClass('is-preload');
		}, 100); //Dating 100
	});

	// Hack: Enable IE workarounds.
	if (browser.name == 'ie')
		$body.addClass('is-ie');

	// Mobile?
	if (browser.mobile)
		$body.addClass('is-mobile');

	// Scrolly.
	$('.scrolly')
		.scrolly({
			offset: 100
		});

	// Polyfill: Object fit.
	if (!browser.canUse('object-fit')) {

		$('.image[data-position]').each(function() {

			var $this = $(this),
				$img = $this.children('img');

			// Apply img as background.
			$this
				.css('background-image', 'url("' + $img.attr('src') + '")')
				.css('background-position', $this.data('position'))
				.css('background-size', 'cover')
				.css('background-repeat', 'no-repeat');

			// Hide img.
			$img.css('opacity', '0');

		});

		$('.gallery > a').each(function() {

			var $this = $(this),
				$img = $this.children('img');

			// Apply img as background.
			$this
				.css('background-image', 'url("' + $img.attr('src') + '")')
				.css('background-position', 'center')
				.css('background-size', 'cover')
				.css('background-repeat', 'no-repeat');

			// Hide img.
			$img.css('opacity', '0');

		});

	}

	// Gallery.
	$('.gallery')
		.on('click', 'a', function(event) {

			var $a = $(this),
				$gallery = $a.parents('.gallery'),
				$modal = $gallery.children('.modal'),
				$modalImg = $modal.find('img'),
				$modalIframe = $modal.find('iframe'),
				href = $a.attr('href');

			// Not an image or video? Bail.
			if (!href.match(/\.(jpg|gif|png|mp4)$/))
				return;

			// Prevent default.
			event.preventDefault();
			event.stopPropagation();

			// Locked? Bail.
			if ($modal[0]._locked)
				return;

			// Lock.
			$modal[0]._locked = true;

			// Set src for image or iframe.
			if (href.match(/\.(mp4)$/)) {
				$modalImg.hide();
				$modalIframe.attr('src', href).show();
			} else {
				$modalIframe.hide();
				$modalImg.attr('src', href).show();
			}

			// Set visible.
			$modal.addClass('visible');

			// Focus.
			$modal.focus();

			// Delay.
			setTimeout(function() {
				// Unlock.
				$modal[0]._locked = false;
			}, 600);

		})
		.on('click', '.modal', function(event) {

			var $modal = $(this),
				$modalImg = $modal.find('img'),
				$modalIframe = $modal.find('iframe');

			// Locked? Bail.
			if ($modal[0]._locked)
				return;

			// Already hidden? Bail.
			if (!$modal.hasClass('visible'))
				return;

			// Stop propagation.
			event.stopPropagation();

			// Lock.
			$modal[0]._locked = true;

			// Clear visible, loaded.
			$modal.removeClass('loaded');

			// Delay.
			setTimeout(function() {

				$modal.removeClass('visible');

				setTimeout(function() {
					// Clear src.
					$modalImg.attr('src', '');
					$modalIframe.attr('src', '');

					// Unlock.
					$modal[0]._locked = false;

					// Focus.
					$body.focus();

				}, 475);

			}, 125);

		})
		.on('keypress', '.modal', function(event) {

			var $modal = $(this);

			// Escape? Hide modal.
			if (event.keyCode == 27)
				$modal.trigger('click');

		})
		.on('mouseup mousedown mousemove', '.modal', function(event) {

			// Stop propagation.
			event.stopPropagation();

		})
		.prepend('<div class="modal" tabIndex="-1"><div class="inner"><img src="" /><iframe src="" frameborder="0" allowfullscreen></iframe></div></div>')
		.find('img')
		.on('load', function(event) {

			var $modalImg = $(this),
				$modal = $modalImg.parents('.modal');

			setTimeout(function() {

				// No longer visible? Bail.
				if (!$modal.hasClass('visible'))
					return;

				// Set loaded.
				$modal.addClass('loaded');

			}, 275);

		})
		.end()
		.find('iframe')
		.on('load', function(event) {

			var $modalIframe = $(this),
				$modal = $modalIframe.parents('.modal');

			setTimeout(function() {

				// No longer visible? Bail.
				if (!$modal.hasClass('visible'))
					return;

				// Set loaded.
				$modal.addClass('loaded');

			}, 275);

		});

})(jQuery);
