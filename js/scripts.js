function setImgCover(e) {
	e.each(function() {
		$(this).parent().css({
			'background': 'url("'+$(this).attr('src')+'") no-repeat center center',
			'background-size': 'cover'
		});
	});
}
function setImgContain(e) {
	e.each(function() {
		$(this).parent().css({
			'background': 'url("'+$(this).attr('src')+'") no-repeat center center',
			'background-size': 'contain'
		});
	});
}
function scale() {
	if ( $('body').width() < 1920 && Modernizr.mq('(min-width:961px)') ) {
		var x = $('body').width()/1920;
	} else {
		var x = 1;
	}
	if ( $('body').height() < 900 && Modernizr.mq('(min-width:961px)') ) {
		var y = $('body').height()/900;
	} else {
		var y = 1;
	}
	$('[data-scalable]').each(function() {
		var t = $(this);
		if ( Modernizr.mq('(min-width:961px)') ) {
			if ( t.attr('data-scalable') == 'axis-x' ) {
				var s = x;
				t.css({
					'-webkit-transform': 'scale('+s+')',
					'transform': 'scale('+s+')',
				});
			}
			if ( t.attr('data-scalable') == 'axis-both' ) {
				if ( x > y ) {
					var s = y;
				} else {
					var s = x;
				}
				t.css({
					'-webkit-transform': 'scale('+s+')',
					'transform': 'scale('+s+')',
				});
				if ( t.attr('data-fullheight') !== undefined ) {
					t.css({
						'height': ($('.section').height()-100)/s
					});
				}
			}
			if ( t.hasClass('wrapper') ) {
				t.css({
					marginBottom: -t.outerHeight()*(1-s)
				});
			}
		} else {
			t.css({
				'-webkit-transform': 'scale(1)',
				'transform': 'scale(1)',
				marginBottom: 0
			});
		}
	});
}
function videoScale() {
	var v = $('.video-bg video');
	var x = v.attr('width');
	var y = v.attr('height');
	var ratio = x/y;
	var w = $('.video-bg').width();
	var h = $('.video-bg').height();
	if (  w/h > ratio ) {
		v.css({
			'left': '0',
			'top': -(w/x*y-h)*0.5+'px',
			'transform': 'scale('+w/x+')',
			'-webkit-transform': 'scale('+w/x+')'
		});
	}
	else {
		v.css({
			'left': -(h/y*x-w)*0.5+'px',
			'top': '0',
			'transform': 'scale('+h/y+')',
			'-webkit-transform': 'scale('+h/y+')'
		});
	}
}
function videoPlay() {
	$('.video-bg video')[0].play();
}
$(function() {
	setImgCover($('.img-cover'));
	setImgContain($('.img-contain'));
	var isMobile = false;
	var justSwitched = false;
	function detectDevice() {
		var temp = isMobile;
		if ( Modernizr.mq('(max-width:960px)') ) {
			isMobile = true;
		} else {
			isMobile = false;
		}
		if ( temp == isMobile ) {
			justSwitched = false;
		} else {
			justSwitched = true;
		}
	}
	$('input, textarea').each(function() {
		$(this).data('holder', $(this).attr('placeholder'));
		$(this).focusin(function() {
			$(this).attr('placeholder', '');
		});
		$(this).focusout(function() {
			$(this).attr('placeholder', $(this).data('holder'));
		});
	});
	$('.section--pic').tilt({
		maxTilt: 2
	});
	$('.section--preview .pic').tilt({
		maxTilt: 10
	});
	$('.catalog-item img, .portfolio__list .pic').tilt({
		maxTilt: 3
	});
	$('.item-category .pic, [data-scrollable="3"] .portfolio__list .pic').tilt({
		maxTilt: 4
	});
	var checkBrowser = navigator.userAgent.toLowerCase(); 
	if ( checkBrowser.indexOf('safari') != -1 && checkBrowser.indexOf('chrome') < 0 ) { 
		var isCssAnimation = false;
	} else {
		var isCssAnimation = true;
	}
	if ( $('.video-bg').length ) {
		videoScale();
		videoPlay();
	}
	scale();
	function setFullPage() {
		$('.fullpage').fullpage({
			anchors: ['welcome', 'sauna', 'spa', 'interior', 'store', 'portfolio', 'news', 'benefits'],
			css3: isCssAnimation,
			navigation: true,
			onLeave: function(index, nextIndex, direction) {
				$('#fp-nav a').removeClass('done');
				for ( var i=1; i<=nextIndex; i++ ) {
					$('#fp-nav li:nth-child('+i+') a').addClass('done');
				}
				if ( nextIndex == 1 && $('.video-bg').length ) {
					videoPlay();
				}
			},
			afterResize: function() {
				scale();
				if ( $('.video-bg').length ) {
					videoScale();
				}
			}
		});
	}
	setFullPage();
	$(window).on('resize', _.debounce(function() {
		detectDevice();
		if ( $('.wrapper').length ) {
			scale();
		}
		scrollable();
		if ( justSwitched ) {
			if ( isMobile ) {
				if ( $('.fullpage-wrapper').length && !$('.fp-destroyed').length ) {
					$.fn.fullpage.destroy('all');
				}
			} else {
				setFullPage();
			}
		}
	}, 100));
	$(window).trigger('resize');
	function scrollable() {
		$('[data-scrollable]').each(function() {
			var t = $(this);
			t.next('.scroll-control').remove();
			var w = t.width();
			var container = $(this).find('.list');
			container.css({
				marginLeft: 0
			});
			if ( !isMobile ) {
				var ratio = parseInt(t.attr('data-scrollable-desktop'));
			} else {
				var ratio = parseInt(t.attr('data-scrollable-mobile'));
			}
			t.find('.item').outerWidth(w/ratio);
			t.after('<div class="scroll-control"></div>');
			var control = t.next('.scroll-control');
			control.slider({
				min: 0,
				max: eval(t.find('.item').size()-ratio),
				slide: function(event, ui) {
					container.stop().animate({
						marginLeft: -ui.value*w/ratio
					});
				},
				change: function(event, ui) {
					container.stop().animate({
						marginLeft: -ui.value*w/ratio
					});
				}
			});
		});
		scale();
	}
	$('.portfolio__list').on('swipeleft', function() {
		var t = $(this).parents('.portfolio').next('.scroll-control');
		var v = t.slider('value');
		t.slider('value',v+1);
	});
	$('.portfolio__list').on('swiperight', function() {
		var t = $(this).parents('.portfolio').next('.scroll-control');
		var v = t.slider('value');
		t.slider('value',v-1);
	});
	if ( $('.material-info').length ) {
		$('.material-info').each(function() {
			var t = $(this);
			t.css({
				'background': '#ffffff url("'+t.find('img.bg').attr('src')+'") no-repeat right bottom'
			})
		});
	}
	var showSubDelay;
	$('.nav--item_sub').on('mouseenter', function() {
		var t = $(this);
		t.find('.subnav').remove();
		$('.temp .subnav').clone().appendTo(t);
		showSubDelay = setTimeout(function() {
			t.find('.subnav').stop().slideDown(300);
			$('.header').css({
				zIndex: 20
			});
		}, 300);
	});
	$('.nav--item_sub').on('mouseleave', function() {
		var t = $(this);
		clearTimeout(showSubDelay);
		setTimeout(function() {
			t.find('.subnav').stop().slideUp(300);
		}, 100);
		setTimeout(function() {
			$('.header').css({
				zIndex: 10
			});
		}, 400);
	});
	$('.nav-footer h5, .category-item h5').on('click', function(e) {
		e.preventDefault();
		$(this).toggleClass('is-active');
	});
});