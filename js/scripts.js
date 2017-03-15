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
	if ( $('body').width() < 1920 ) {
		var x = $('body').width()/1920;
	} else {
		var x = 1;
	}
	if ( $('body').height() < 900 ) {
		var y = $('body').height()/900;
	} else {
		var y = 1;
	}
	$('[data-scalable]').each(function() {
		var t = $(this);
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
	});
}
function scrollable() {
	$('[data-scrollable]').each(function() {
		var t = $(this);
		t.next('.scroll-control').remove();
		var w = t.width();
		var container = $(this).find('.list');
		container.css({
			marginLeft: 0
		});
		t.find('.item').outerWidth(w/t.attr('data-scrollable'));
		t.after('<div class="scroll-control"></div>');
		var control = t.next('.scroll-control');
		control.slider({
			min: 0,
			max: eval(t.find('.item').size()-t.attr('data-scrollable')),
			slide: function(event, ui) {
				container.stop().animate({
					marginLeft: -ui.value*w/t.attr('data-scrollable')
				});
			}
		});
	});
	scale();
}
$(function() {
	setImgCover($('.img-cover'));
	setImgContain($('.img-contain'));
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
	$('.item-category .pic, .section .item-new, [data-scrollable="3"] .portfolio__list .pic').tilt({
		maxTilt: 4
	});
	$('.fullpage').fullpage({
		anchors: ['welcome', 'sauna', 'spa', 'interior', 'store', 'portfolio', 'news', 'benefits'],
		css3: true,
		navigation: true,
		onLeave: function(index, nextIndex, direction) {
			$('#fp-nav a').removeClass('done');
			for ( var i=1; i<=nextIndex; i++ ) {
				$('#fp-nav li:nth-child('+i+') a').addClass('done');
			}
		},
		afterResize: function() {
			scale();
		}
	});
	scale();
	$(window).on('resize', function() {
		if ( $('.wrapper').length ) {
			scale();
		}
		scrollable();
	});
	$(window).trigger('resize');
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
	/*
	if ( $('.slider').length > 0 ) {
		slider();
		$('.slider').bind('swipeleft', function() {
			$('.slider .next').trigger('click');
		});
		$('.slider').bind('swiperight', function() {
			$('.slider .prev').trigger('click');
		});
	}
	if ( $('.card').length > 0 ) {
		$('.card .photos').slides({
			generatePagination: true,
			generateNextPrev: true,
			container: 'container',
			effect: 'slide',
			slideSpeed: 500,
			slideEasing: 'easeInOutQuad',
			play: 10000,
			pause: 2500,
		});
		$('.card .photos').bind('swipeleft', function() {
			$('.card .photos .next').trigger('click');
		});
		$('.card .photos').bind('swiperight', function() {
			$('.card .photos .prev').trigger('click');
		});
	}
	if ( $('.similar').length > 0 ) {
		$('.similar ul').jcarousel({
			scroll: 5,
			animation: 500,
			easing: 'easeInOutQuad',
			wrap: 'circular'
		});
		$('.similar .jcarousel-container').bind('swipeleft', function() {
			$('.similar .jcarousel-container .jcarousel-next').trigger('click');
		});
		$('.similar .jcarousel-container').bind('swiperight', function() {
			$('.similar .jcarousel-container .jcarousel-prev').trigger('click');
		});
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
	var c = 0;
	$('header').load(function() {
		console.log('asdasd');
	});*/
});
