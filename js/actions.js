(function ($) {
    $(function () {

        if ($('.alert-flash').length) {
            setTimeout(function () {
                $('.alert-flash').animate({opacity: 1.0}, 3000).fadeOut("slow");
            }, 2000);
        }

        if ($('#user-birthday').length) {
            $('#user-birthday').removeClass('form-control krajee-datepicker');
        }

        var changeCartData = function (cartTotal) {
            var fullCartBox = $('.main-content__cart__full-cart');
            $(fullCartBox).find('span.main-content__cart__full-cart__quantity').html(cartTotal.quantity);
            $(fullCartBox).find('span.main-content__cart__full-cart__amount__value span').html(cartTotal.amount.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1 "));
            if (cartTotal.quantity > 0) {
                $('.main-content__cart__empty-cart').addClass('hidden');
                $(fullCartBox).removeClass('hidden');
            } else {
                $('.main-content__cart__empty-cart').removeClass('hidden');
                $(fullCartBox).addClass('hidden');
            }
            if ($('.header__cart__badge').length)
                $('.header__cart__badge').html(cartTotal.quantity);
        };

        var toCart = function (that) {
            var parentBox;
            var product;
            var action = 'addToCart';
            var isSet = 0;
            var help = 0;
            var subscribe = 0;

            if ($(that).hasClass('it-set')) {
                parentBox = $(that).parents('.single-set');
                product = $(parentBox).attr('data-set');
                isSet = 1;
            } else if ($(that).hasClass('it-help-set')) {
                parentBox = $(that).parents('.single-help-set');
                product = $(parentBox).data('set');
                help = $(parentBox).data('help');
                action = 'addHelpSetToCart';
            } else {
                if ($(that).hasClass('is-subscribe')) {
                    subscribe = 1;
                }
                parentBox = $(that).parents('.single-product');
                product =  $(parentBox).attr('data-product');
            }
            var currentCount = parseInt($(parentBox).find('input.counter-value').val());
            var newCount = 0;

            if (!$(that).hasClass('delete-product') && !$(that).hasClass('is-subscribe')) {
                if ($(that).hasClass('counter-minus')) {
                    if (currentCount)
                        newCount = currentCount - 1;
                } else if ($(that).hasClass('counter-plus')) {
                    newCount = currentCount + 1;
                } else {
                    newCount = currentCount;
                }
            }

            $.ajax({
                url: '/cart/add',
                data: {
                    action: action,
                    product: product,
                    count: newCount,
                    isSet: isSet,
                    help: help,
                    subscribe: subscribe
                },
                dataType: 'json',
                type: 'POST',
                success: function (response) {
                    if (response.error == 0) {
                        var cartTotal = response.data.total;
                        var totalCartAmount = response.tariff.totalCartAmount;
                        var tariffAmount = response.tariff.orderTariff;
                        var products = response.data.cart;
                        var sets = response.data.sets;
                        var helpSets = response.data.helpSets;

                        if (products !== undefined) {
                            for (key in products) {
                                if (key == product) {
                                    qty = products[key].qty;
                                    if ($(parentBox).attr('data-list') == 1 && qty == 0) {
                                        $(parentBox).find('div.main-cart__cart-content__product__count').addClass('hidden');
                                        $(parentBox).find('span.put-to-cart').removeClass('hidden');
                                        qty = 1;
                                    }
                                    $(parentBox).find('input.counter-value').val(qty);
                                    $(parentBox).find('span.product-total-amount').html(products[key].prc.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1 "));
                                }
                            }
                        }

                        if (sets !== undefined) {
                            for (key in sets) {
                                if (key == product) {
                                    qty = sets[key].qty;
                                    if ($(parentBox).attr('data-list') == 1 && qty == 0) {
                                        $(parentBox).find('div.main-cart__cart-content__product__count').addClass('hidden');
                                        $(parentBox).find('span.put-set-to-cart').removeClass('hidden');
                                        qty = 1;
                                    }
                                    $(parentBox).find('input.counter-value').val(qty);
                                    $(parentBox).find('span.product-total-amount').html(sets[key].prc.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1 "));
                                }
                            }
                        }

                        if (helpSets !== undefined) {
                            for (key in helpSets) {
                                if (key == product) {
                                    qty = helpSets[key].qty;
                                    if (qty == 0) {
                                        $(parentBox).find('div.main-cart__cart-content__product__count').addClass('hidden');
                                        $(parentBox).find('span.put-help-set-to-cart').removeClass('hidden');
                                        qty = 1;
                                    }
                                    $(parentBox).find('input.counter-value').val(qty);
                                    $(parentBox).find('span.product-total-amount').html(helpSets[key].prc.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1 "));
                                }
                            }
                        }

                        if ($(parentBox).attr('data-list') == 0) {
                            if (cartTotal.amount == 0) {
                                $('.main-cart__cart-content').remove();
                            } else {
                                $('.cart-total-amount').html(totalCartAmount.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1 "));
                                $('.order-tariff-value').html(tariffAmount.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1 "))
                            }
                        }
                        changeCartData(cartTotal);
                    }
                },
                error: function (xhr, error, status) {
                    xhr.responseText;
                }
            });
        };

        $('body')
            .on('click', '.put-to-cart', function () {
                var that = this;
                var productBox = $(this).parents('.single-product-box');
                var product = $(productBox).attr('data-product');
                $.ajax({
                    url: '/cart/add',
                    data: {
                        action: 'addToCart',
                        product: product
                    },
                    type: 'POST',
                    success: function (response) {
                        var dataResponse = $.parseJSON(response);
                        if (dataResponse.error == 0) {
                            var cartTotal = dataResponse.data.total;
                            changeCartData(cartTotal);
                            $(that).addClass('hidden');
                            $(productBox).find('div.main-cart__cart-content__product__count').removeClass('hidden');
                        }
                    },
                    error: function (xhr, error, status) {
                        xhr.responseText;
                    }
                });
            })
            .on('click', '.put-set-to-cart', function () {
                var that = this;
                var setBox = $(this).parents('.main-content__sets-box');
                var set = $(this).attr('data-set');
                $.ajax({
                    url: '/cart/add',
                    data: {
                        action: 'addSetToCart',
                        set: set
                    },
                    dataType: 'json',
                    type: 'POST',
                    success: function (response) {
                        if (response.error == 0) {
                            var cartTotal = response.data.total;
                            changeCartData(cartTotal);
                            $(that).addClass('hidden');
                            $(setBox).find('div.main-cart__cart-content__product__count').removeClass('hidden');
                        }
                    },
                    error: function (xhr) {
                        xhr.responseText;
                    }
                });
            })
            .on('click', '.put-help-set-to-cart', function () {
                var that = this;
                var setBox = $(this).parents('.main-our-help__family-box__set-box');
                var set = $(this).data('set');
                var help = $(this).data('help');
                $.ajax({
                    url: '/cart/add',
                    data: {
                        action: 'addHelpSetToCart',
                        product: set,
                        help: help
                    },
                    dataType: 'json',
                    type: 'POST',
                    success: function (response) {
                        var cartTotal = response.data.total;
                        changeCartData(cartTotal);
                        $(that).addClass('hidden');
                        $(setBox).find('div.main-cart__cart-content__product__count').removeClass('hidden');
                    },
                    error: function (xhr) {
                        xhr.responseText;
                    }
                });
            })
            .on('click', '.products-for-help-set', function () {
                var help = $(this).data('help');
                $.ajax({
                    url: 'cart/add',
                    data: {
                        action: 'helpToSession',
                        help: help
                    },
                    type: 'POST',
                    success: function (response) {
                        if (response == 1)
                            window.location.href = '/';
                    },
                    error: function (xhr) {
                        xhr.responseText;
                    }
                });
            })
            .on('click', '.reply-order-again', function () {
                var order = $(this).attr('data-order');
                var popupBox = $('.main-my-orders__reply-order-popup');
                $(popupBox).find('.reply-choose-order').attr('data-order', order);
                $('.main-my-orders__reply-order-popup').css({"display":"flex"});
                $("body,html").animate({scrollTop:172}, 800);
            })
            .on('click', '.cancel-choose-order', function () {
                var popupBox = $('.main-my-orders__reply-order-popup');
                $(popupBox).find('.reply-choose-order').attr('data-order', 0);
                $(popupBox).css({"display":"none"});
            })
            .on('click', '.reply-choose-order', function () {
                var order = $(this).attr('data-order');
                $.ajax({
                    url: '/cart/add',
                    data: {
                        action: 'addOrderToCart',
                        order: order
                    },
                    type: 'POST',
                    success: function (response) {
                        var dataResponse = $.parseJSON(response);
                        if (dataResponse.error == 0) {
                            var cartTotal = dataResponse.data.total;
                            changeCartData(cartTotal);
                            document.location.href = '/cart';
                        }
                    },
                    error: function (xhr, error, status) {
                        xhr.responseText;
                    }
                });
            })
            .on('click', '.cart-counter', function () {
                toCart(this);
            })
            .on('keyup', 'input.counter-value', function () {
                toCart(this);
            })
            .on('click', '.delete-product', function () {
                toCart(this);
                if ($(this).hasClass('it-set'))
                    $(this).parents('.single-set').remove();
                else if ($(this).hasClass('it-help-set'))
                    $(this).parents('.single-help-set').remove();
                else
                    $(this).parents('.single-product').remove();
            })
            .on('click', '.main-profile__profile-content__box__info__choose', function () {
                $('#user-sex').val($(this).attr('data-sex'));
            })
            .on('click', '.main-registration__buyer-type__set-type', function () {
                if (!$(this).hasClass('active')) {
                    $(this).addClass('active').siblings('.main-registration__buyer-type__set-type').removeClass('active');
                    var subClass = $(this).attr('data-type');
                    $('.dynamic-div').each(function (key, elem) {
                        if ($(elem).hasClass(subClass))
                            $(elem).removeClass('hidden');
                        else
                            $(elem).addClass('hidden');
                    });
                }
            })
            .on('keyup', '.to-email', function () {
                $('.for-email-field').val($(this).val());
            })
            .on('click', 'input.set-accept-offer', function () {
                if ($(this).prop('checked'))
                    $('input#registrationform-accept_offer').val(1);
                else
                    $('input#registrationform-accept_offer').val(0);
            })
            .on('click', 'input.set-accept-spam', function () {
                if ($(this).prop('checked'))
                    $('input#registrationform-accept_spam').val(1);
                else
                    $('input#registrationform-accept_spam').val(0);
            })
            .on('click', 'input.set-accept-my-data', function () {
                if ($(this).prop('checked'))
                    $('input#registrationform-accept_my_data').val(1);
                else
                    $('input#registrationform-accept_my_data').val(0);
            })
            .on('click', '.main-registration__legal-entity-request__variables__set-variable', function () {
                if (!$(this).hasClass('active')) {
                    $(this).addClass('active').siblings('.main-registration__legal-entity-request__variables__set-variable').removeClass('active');
                    $('input#registrationform-requestaboutcompany').val($(this).attr('data-request'));
                }
            })
            .on('click', '.remember-me-label', function () {
                if($('input#'+$(this).attr('for')).prop("checked")) {
                    $('#loginform-rememberme').val(0);
                } else {
                    $('#loginform-rememberme').val(1);
                }
            })
            .on('click', '.main-profile__profile-content__box__avatar-main', function () {
                $('input#user-avatarfile').trigger('click');
            })
            .on('change', 'input#user-avatarfile', function () {
                var data = new FormData();
                data.append("file", this.files[0]);
                data.append("action", 'change-avatar');
                $.ajax({
                    url: '/cabinet',
                    type: 'POST',
                    data: data,
                    cache: false,
                    dataType: 'json',
                    processData: false,
                    contentType: false,
                    success: function(response, textStatus, jqXHR) {
                        if (response.success == 1 && response.way) {
                            $('.main-profile__profile-content__box__avatar').html('<img class="img-circle main-profile__profile-content__box__avatar-source" src="/'+ response.way +'" />');
                            $('.main-profile__profile-content__box__avatar-change').show();
                        }
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        jqXHR.responseText;
                    }
                })
            })
            .on('click', '.single-faq', function () {
                if (!$(this).hasClass('active')) {
                    var iconBox = $(this).find('.faq-active');
                    $('.faq-active').removeClass('active');
                    $(iconBox).addClass('active');
                    $(this).addClass('active').siblings('.single-faq').removeClass('active');
                } else {
                    $('.faq-active').removeClass('active');
                    $(this).removeClass('active');
                }
            })
            .on('click', '.main-donate__donate-variables__set-variable', function () {
                if (!$(this).hasClass('active'))
                    $(this).addClass('active').siblings('.main-donate__donate-variables__set-variable').removeClass('active');
            })
            .on('click', '.change-faq-group', function () {
                if (!$(this).hasClass('active')) {
                    var that = this;
                    var group = $(this).attr('data-faq-group');
                    $.ajax({
                        url: '/faq',
                        data: {
                            action: 'changeFaqGroup',
                            group: group
                        },
                        type: 'POST',
                        success: function (response) {
                            $('.main-faq__questions-box').html(response);
                            $('.change-faq-group').removeClass('active');
                            $(that).addClass('active');
                        },
                        error: function (xhr) {
                            xhr.responseText;
                        }
                    });
                }
            })
            // .on('click', '.header__mobile-menu', function (event) {
            //     var iBox = $(this).find('i');
            //     if ($(iBox).hasClass('fa-bars'))
            //         $('.header__mm-items').removeClass('hidden');
            //     else
            //         $('.header__mm-items').addClass('hidden');

            //     $(iBox).toggleClass('fa-bars').toggleClass('fa-times');

            //     event.stopPropagation();
            // })
            // .on('click', '.header__mm-items', function () {
            //     $('.header__mobile-menu').trigger('click');
            // })
            // .on('click', 'close-mobile-menu', function (event) {
            //     $('.header__mobile-menu').trigger('click');
            //     event.stopPropagation();
            // })
            .on('click', '.auto-build-product-list', function () {
                if ($('#reports-datereport').val()) {
                    var that = this;
                    $('.auto-build-product-list-notice').addClass('hidden').html('');
                    var dateReport = $('#reports-datereport').val();
                    $.ajax({
                        url: '/crm/reports',
                        data: {
                            action: 'calculateProductList',
                            date: dateReport
                        },
                        type: 'POST',
                        success: function (response) {
                            if (response != 0) {
                                $('.auto-build-product-list-notice').html(response).removeClass('hidden');
                            }
                        },
                        error: function (xhr) {
                            xhr.responseText;
                        }
                    });
                } else {
                    $('.auto-build-product-list-notice').html('Для автоматического построения таблицы необходимо заполнить Дату Отчета').removeClass('hidden');
                }
            })
            .on('click', '.social-share', function () {
                var url = '';
                if ($(this).hasClass('vk-share')) {
                    url  = 'https://vk.com/share.php?';
                    url += 'url=' + encodeURIComponent($('.social-meta.url').val());
                    //url += '&image='+encodeURIComponent($('.social-meta.vk.image').val());
                    url += '&title=' + encodeURIComponent($('.social-meta.title').val());
                    url += '&noparse=false';
                } else if ($(this).hasClass('fb-share')) {
                    url  = 'http://www.facebook.com/sharer.php?s=100';
                    url += '&p[title]='     + encodeURIComponent($('.social-meta.title').val());
                    url += '&p[summary]='   + encodeURIComponent($('.social-meta.description').val());
                    url += '&p[images][0]=' + encodeURIComponent($('.social-meta.image').val());
                    url += '&p[url]='       + encodeURIComponent($('.social-meta.url').val());
                } else if ($(this).hasClass('ok-share')) {
                    url = 'https://connect.ok.ru/offer?';
                    url += 'url='+encodeURIComponent($('.social-meta.vk.url').val());
                    url += '&description='+encodeURIComponent($('.social-meta.description').val());
                }
                window.open(url,'','toolbar=0,status=0,width=626,height=436');
            })
            .on('click', '.show-more-press', function () {
                $.ajax({
                    url: '/for-media',
                    data: {
                        action: 'show-more-press',
                        iteration: $(this).attr('data-iteration')
                    },
                    type: 'POST',
                    dataType: 'json',
                    success: function (response) {
                        if (response.articles) {
                            $('.main-media__press-articles').append(response.articles);
                        }
                        if (response.need_more === true) {
                            $('.show-more-press').attr('data-iteration', response.iteration);
                        } else {
                            $('.main-media__show-more-box').remove();
                        }
                    },
                    error: function (xhr) {
                        xhr.responseText;
                    }
                });
            })
            .on('click', '.show-more-helps', function () {
                $.ajax({
                    url: '/our-help',
                    data: {
                        action: 'show-more-help',
                        iteration: $(this).attr('data-iteration')
                    },
                    type: 'POST',
                    dataType: 'json',
                    success: function (response) {
                        if (response.articles) {
                            $('.main-our-help__families').append(response.articles);
                        }
                        if (response.need_more === true) {
                            $('.show-more-helps').attr('data-iteration', response.iteration);
                        } else {
                            $('.main-our-help__show-more-box').remove();
                        }
                    },
                    error: function (xhr) {
                        xhr.responseText;
                    }
                });
            })
            .on('click', '#accept-subscribe', function () {
                $('.main-cart__subscribe__action').toggleClass('active');
            })

            .on('click', '.add-product-to-report', function () {
                $.ajax({
                    url: '/crm/reports',
                    data: {
                        action: 'addNewPosition'
                    },
                    type: 'POST',
                    success: function (response) {
                        $('.product-list-table-box').append(response);
                    },
                    error: function (xhr) {
                        xhr.responseText;
                    }
                })
            })
            .on('click', '.pre-save', function () {
                var len = $('.single-product-table').length;
                if (len) {
                    var productItem = '';
                    var e;
                    for (var i = 0; i < len; i++) {
                        e = $('.single-product-table')[i];
                        productItem += '{"product":"' + $(e).find('#item-product-name').val() + '","value":"' + $(e).find('#item-product-value').val() + '","measure":"' + $(e).find('#item-product-measure').val() + '"},';
                    }
                    $('#reports-tablereport').val('['+productItem.substring(0, productItem.length - 1)+']');
                }
                $('.save-report').trigger('click');
            })
            .on('click', '.family-box_show-more', function () {
                var parent = $(this).parents('.family-box_hidden-description');
                var iBox = $(this).find('i');
                if (!$(this).hasClass('hide-more')) {
                    $(iBox).removeClass('fa-ellipsis-h').addClass('fa-angle-double-up');
                    $(this).addClass('hide-more');
                    var fullDescription = $(parent).find('.family-box_full-description')[0];
                    var needHeight = (fullDescription.clientHeight + 10) + 'px';
                    $(parent).css({"overflow": "initial", "max-height": needHeight});
                } else {
                    $(iBox).removeClass('fa-angle-double-up').addClass('fa-ellipsis-h');
                    $(this).removeClass('hide-more');
                    $(parent).css({"overflow": "hidden", "max-height": "156px"});
                }
            })
        ;

        $('.show-help-details').hover(
            function () {
                $(this).find('span.help-details').fadeIn(300);
            },
            function () {
                $(this).find('span.help-details').fadeOut(300);
            }
        );

        if ($('.family-box_hidden-description').length > 0) {
            $('.family-box_hidden-description').each(function (key, elem) {
                fullDescription = $(elem).find('.family-box_full-description')[0];
                if (fullDescription.clientHeight > 166) {
                    $(elem).find('.family-box_show-more').removeClass('hidden');
                } else {
                    $(elem).find('.family-box_show-more').remove();
                }
            });
        }

    })
})(jQuery);