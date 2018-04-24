$(".header__actions__btn-mobile-menu").click(function () {
	$(".mobile-menu__wrap").fadeIn(100);
	$("body").css({
		"overflow": "hidden"
	})
	$(".mobile-menu").addClass("mobile-menu_opened");
});

$(".mobile-menu__btn-close").click(function () {
	$(".mobile-menu__wrap").fadeOut(100);
	$("body").css({
		"overflow": "auto"
	})
	$(".mobile-menu").removeClass("mobile-menu_opened");
});