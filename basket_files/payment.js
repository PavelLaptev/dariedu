$(document).ready(function(){

    /* cart */

    $('.cart-pay-action').click(function () {
        if (!$(this).hasClass('in-progress')) {
            $(this).addClass('in-progress');
            $(this).html('Производится оплата...');
            $.ajax({
                url: '/cart',
                data: {
                    action: 'createPayment'
                },
                type: 'POST',
                dataType: 'json',
                success: function (response) {
                    if (response.error == 0) {
                        window.location.href = response.data.response.confirmation.confirmation_url;
                    }
                },
                error: function (xhr) {
                    xhr.responseText;
                }
            });
        }
    });


    /* subscribe */
    var showSum = function (amount) {
        $('.need-another-amount').hide();

        if (amount == 0) {
            $('.another-amount-value').addClass('field-is-empty');
        } else {
            $('.another-amount-value').val(amount);
            $('.another-amount-value').removeClass('field-is-empty');
        }
        $('.another-amount').show();
    };

    var checkEmail = function () {
        var emailPattern = /^[a-z0-9_-]+@[a-z0-9-]+\.[a-z]{2,6}$/i;
        var mailField = $('.is-email-field');
        if (mailField.val().search(emailPattern)) {
            mailField.addClass('field-is-empty');
            return false;
        } else {
            return true;
        }
    };

    var checkAmount = function () {
        var amountPattern = /^[0-9]+$/;
        var amountField = $('.another-amount-value');
        // var amount = $(amountField).val();
        if (amountField.val().search(amountPattern)) {
            amountField.addClass('field-is-empty');
            return false
        }
        /* else {
            if (parseInt(amount) < 50 || parseInt(amount) > 50000) {
                amountField.addClass('field-is-empty');
                return false;
            } else {
                return true;
            }
        }*/
        return true;
    };


    $('.main-subscribes')
        .on('click', '.variant-item', function () {
            if (!$(this).hasClass('it-my-subscribe')) {
                var amount = parseInt($(this).attr('data-amount'));
                $(this).addClass('active').siblings('.variant-item').removeClass('active');
                showSum(amount);
            }
        })
        .on('click', '.main-subscribes__subscribe-amount__text', function () {
            showSum(100);
        })
        .on('click', '.subscribe-button', function () {
            if (!$(this).hasClass('in-progress')) {
                var noError = true;
                var subscribeEmail = $('.subscribe-email').val();
                var subscribeAmount = $('.another-amount-value').val();

                if (!subscribeAmount || subscribeAmount == 0) {
                    noError = false;
                    showSum(0);
                }
                if (!subscribeEmail) {
                    noError = false;
                    $('.subscribe-email').addClass('field-is-empty');
                }

                if (noError) {
                    if (checkEmail() && checkAmount()) {
                        $(this).addClass('in-progress');
                        var variantId = 0;
                        var userId = 0;

                        if ($('.variant-item.active').length) {
                            variantId = $('.variant-item.active').attr('data-variant');
                        }
                        if ($('.subscribe-email').attr('data-user')) {
                            userId = $('.subscribe-email').attr('data-user');
                        }

                        $.ajax({
                            /*url: '/subscribe', */
                            url: '/',
                            data: {
                                action: 'set-subscribe',
                                variant: variantId,
                                user: userId,
                                email: subscribeEmail,
                                amount: subscribeAmount
                            },
                            dataType: 'json',
                            type: 'POST',
                            success: function (response) {
                                if (response.error == 0) {
                                    window.location.href = response.data.response.confirmation.confirmation_url;
                                }
                            },
                            error: function (xhr) {
                                console.log(xhr.responseText);
                            }
                        });

                    }
                }
            }
        })
        .on('click', '.unsubscribe-button', function () {
            var variantId = $(this).attr('data-variant');
            var userId = $(this).attr('data-user');
            $.ajax({
                url: '/cabinet/my-subscribes',
                data: {
                    action: 'unSubscribe',
                    variant: variantId,
                    user: userId
                },
                type: 'POST',
                success: function (response) {
                    if (response == 1) {

                    } else {

                    }
                },
                error: function (xhr) {
                    xhr.responseText;
                }
            });
        })
        .on('click', '.free-unsubscribe', function () {
            if (!$(this).hasClass('in-progress')) {
                $(this).addClass('in-progress');
                var subscribeId = $(this).attr('data-subscribe');
                var parentBox = $(this).parent();
                $.ajax({
                    url: '/cabinet/my-subscribes',
                    data: {
                        action: 'freeUnSubscribe',
                        subscribe: subscribeId
                    },
                    type: 'POST',
                    success: function (response) {
                        if (response == 1) {
                            $(parentBox).remove();
                        }
                    },
                    error: function (xhr) {
                        xhr.responseText;
                    }
                });
            }
        })
        .on('keyup', '.field-is-empty', function () {
            if ($(this).val()) {
                $(this).removeClass('field-is-empty');
            }
        })
        .on('keyup', '.another-amount-value', function () {
            $('.variant-item').removeClass('active');
            if (checkAmount($(this).val())) {
                var amount = $(this).val();
                $('.variant-item').filter(function () {
                    return $(this).attr('data-amount') == amount && !$(this).hasClass('it-my-subscribe');
                }).addClass('active').siblings('.variant-item').removeClass('active');
            }
        })
    ;
});