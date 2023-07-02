"use strict";

(function ($) {


    // get location saved data
    var location_data = localStorage.getItem('wpc_location');

    $(document).ready(function () {

        var obj = {};
        var wpc_booking_form_data = {};
        if (typeof wpc_form_client_data !== "undefined") {
            var wpc_form_data = JSON.parse(wpc_form_client_data);
            if ($.isArray(wpc_form_data.settings) && wpc_form_data.settings.length === 0) {
                wpc_booking_form_data = null;
            } else {
                wpc_booking_form_data = wpc_form_data.settings;
            }
        }

        var error_message = $('.wpc_error_message');
        var cancell_log_message = $('.wpc_cancell_log_message');
        var log_message = $('.wpc_log_message');
        // select location
        if (typeof location_data !== "undefined" && location_data !== null) {
            var location_data_parse = JSON.parse(location_data);
            $(".wpc_location_name").val(location_data_parse.value).html(location_data_parse.value);
            $("#filter_location option[value='" + location_data_parse.name + "']").attr("selected", true);
        } else {
            $(".location_heading").css("display", "none")
        }

        //custom tabs
        $('.wpc-food-tab-wrapper').on('click', '.wpc-tab-a', function (event) {
            event.preventDefault();
            var tab_wrpaper = $(this).closest(".wpc-food-tab-wrapper");

            tab_wrpaper.find(".wpc-tab").removeClass('tab-active');
            tab_wrpaper.find(".wpc-tab[data-id='" + $(this).attr('data-id') + "']").addClass("tab-active");
            tab_wrpaper.find(".wpc-tab-a").removeClass('wpc-active');
            $(this).parent().find(".wpc-tab-a").addClass('wpc-active');

        });

        // single page ajax
        if (typeof wc_cart_fragments_params !== "undefined") {
            var $warp_fragment_refresh = {
                url: wc_cart_fragments_params.wc_ajax_url.toString().replace('%%endpoint%%', 'get_refreshed_fragments'),
                //TODO req method is POST but req body is missing, if don't have body, should use get method
                type: 'POST',
                success: function (data) {
                    if (data && data.fragments) {
                        $.each(data.fragments, function (key, value) {
                            $(key).replaceWith(value);
                        });

                        $(document.body).trigger('wc_fragments_refreshed');

                    }

                }
            };
        }

        // set location in local storage and cancel modal

        // press ok button
        $(".wpc_modal").on('click', '.wpc-select-location', function () {
            save_location_data();
            $(".saving_warning").addClass("hide_field");
        });
        // on change location
        $(".wpc-location").on('change', function () {
            $(".saving_warning").removeClass("hide_field");
        });

        function save_location_data() {
            var wpc_location_name = $('.wpc-location option:selected').val();
            var wpc_location_value = $('.wpc-location option:selected').text();

            var local_storage_value = localStorage.getItem('wpc_location');
            var wpc_location_value = wpc_location_name == "" ? "" : wpc_location_value;

            if (!$(this).siblings(".wpc-location-store").length) {
                // save location for single vendor
                //TODO remove if/else condition, cause we setItem(same data) for both cases.
                localStorage.setItem('wpc_location', JSON.stringify({ name: wpc_location_name, value: wpc_location_value }));
                $('#filter_location').find(`option[text="${wpc_location_value}"]`).attr("selected", true);
            }

            $(".wpc_modal").fadeOut();
            $('body').removeClass('wpc_location_popup');
        }

        // on close special_menu popup, save data in local storage
        $(".special-menu-close, .wpc-motd-order-btn, .wpc-motd-product").on('click', function () {
            close_popup("", ".wpc-menu-of-the-day", ".wpc-menu-of-the-day");
            save_special_menu_data();
        });

        function save_special_menu_data() {
            var wpc_special_menu = localStorage.getItem('wpc_special_menu');
            var local_storage_menu_value = (wpc_special_menu == null || wpc_special_menu == "") ? "yes" : wpc_special_menu;

            // TODO why used expiry in localStorage? for auto-epire cookie should be used instead of localStorage.
            localStorage.setItem('wpc_special_menu', JSON.stringify({ wpc_special_menu: local_storage_menu_value, expiry: new Date() }));
        }

        //TODO if we use cookie, no need to remove it manually(btw, first of all need to know the use-case)
        if ($('.wpc-menu-of-the-day').length > 0) {
            var wpc_special_menu = localStorage.getItem('wpc_special_menu');
            var special_menu = JSON.parse(wpc_special_menu);
            wpc_special_menu = wpc_special_menu !== null ? special_menu : null;

            var expTime = special_menu != null ? special_menu.expiry : null;

            if (expTime != null) {
                let currentDate = new Date();
                let expDate = new Date(Date.parse(expTime.toString()));
                var oneDay = 24 * 60 * 60 * 1000;

                if ((currentDate - expDate) > oneDay) {
                    localStorage.removeItem('wpc_special_menu');
                }
            }

            if (wpc_special_menu == null && wpc_special_menu != "yes") {
                jQuery('.wpc-menu-of-the-day').delay(5000).fadeIn();
            } else {
                jQuery('.wpc-menu-of-the-day').fadeOut();
            }

        }


        /*--------------------------------
        // Filter location wise food
        -----------------------------------*/
        if ($("#filter_location").length !== 0) {
            getting_location_data($("#filter_location"), true);
            $(document.body).on('added_to_cart', function () {
                $("#filter_location").attr("data-cart_empty", 0);
            });
        }


        $("#filter_location").on('change', function (e) {
            e.preventDefault();
            var location = $(this).val();
            var cart_empty = $("#filter_location").data("cart_empty");
            var previous_location = localStorage.getItem("wpc_location");
            previous_location = JSON.parse(previous_location);
            // if cart has data and selected location is not equal previous location
            if (location !== "" && cart_empty == 0 &&
                (previous_location !== null && previous_location.name !== location)) {
                $("#location_change").removeClass("hide_field");
                $("body").addClass("wpc_location_popup");
                $("#filter_location option[value='" + previous_location.name + "']").attr("selected", true);
            } else {
                getting_location_data($(this), 1, 0);
            }
        });

        $(".change_yes,.change_no").on('click', function (e) {
            // cart is empty = 1 , cart is not empty = 0
            var call_ajax = 0; var clear_cart = 0;
            if ($(this).hasClass("change_yes")) {
                call_ajax = 1;
                clear_cart = 1;
            }
            else if ($(this).hasClass("change_no")) {
                var cart_empty = $("#filter_location").data("cart_empty");
                // TODO convert if/else if to ternery
                call_ajax = cart_empty ? 1 : 0
                var previous_location = localStorage.getItem("wpc_location");
                previous_location = JSON.parse(previous_location);

                $("#filter_location option[value='" + previous_location.name + "']").attr("selected", true);
            }

            getting_location_data($("#filter_location"), call_ajax, clear_cart);

            close_popup("wpc_location_popup", "#wpc_location_modal", ".location_modal");

        });

        $(".discard_booking").on("click", function () {
            $("body").addClass("wpc_location_popup");
            $("#wpc_booking_modal").removeClass("hide_field");
        });

        function close_popup(...args) {
            $('body').removeClass(args[0]);
            $(args[1]).css("display", "none")
            $(args[2]).addClass("hide_field")
        }

        function getting_location_data($this, call_ajax = false, clear_cart = 0) {
            if (typeof wpc_form_data !== "undefined") {
                // TODO remove duplicate variables;
                var location = $this.val();
                var location_name = $("#filter_location option:selected").text();
                var location_menu = $('.location_menu');

                // TODO we can use single key in obj, if key and value is same name.
                let location_data_obj = { location, clear_cart, action: 'filter_food_location' };
                if ( location_menu.length !== 0) {
                    location_data_obj.product_data = location_menu.data('product_data');
                }

                if (call_ajax) {
                    $.ajax({
                        url: wpc_form_data.wpc_ajax_url,
                        type: 'POST',
                        // TODO should use only string in api-call/req-body
                        data: location_data_obj,
                        dataType: 'html',
                        beforeSend: function () {
                            $(".food_location").addClass("loading");
                        },
                        success: function (data) {
                            if ( typeof data !== "undefined" ) {
																var response = JSON.parse(data);
                                var food_location = location_menu.find('.food_location');
                                  food_location.html("").html(response.html);

                                $("#filter_location").attr("data-cart_empty", response.cart_empty);
                                if (clear_cart == 1) {
                                    $('body').trigger('wc_fragment_refresh');
                                    $('body').trigger('wpc-mini-cart-count');
                                }

                                $("a.ajax_add_to_cart").attr("data-wpc_location_id", location);
                                $(".food_location").removeClass("loading");
                                // change store location data
                                localStorage.removeItem("wpc_location");
                                location_name = location == "" ? "" : location_name;
                                localStorage.setItem("wpc_location", JSON.stringify({ name: location, value: location_name }));

                            }
                        },

                    });
                }

            }
        }


        //====================== Reservation form actions start ================================= //

        var $wpc_booking_section = $('.reservation_section');
        var wpc_booking_date = $wpc_booking_section.find("#wpc_booking_date");

        if (wpc_booking_date.length > 0) {
            var wpc_pro_form_data = $(".wpc_calender_view").data('view');

            var inline_value = true;
            if (typeof wpc_pro_form_data !== 'undefined' && wpc_pro_form_data == 'no') {
                inline_value = false;
            }
            var reserve_status = $(".wpc-reservation-form").data('reservation_status');
            obj.wpc_booking_date = wpc_booking_date;
            obj.booking_form_type = "frontend";
            obj.inline_value = inline_value;
            obj.reserve_status = reserve_status;
            obj.wpc_form_client_data = wpc_booking_form_data;


            if (typeof reservation_form_actions == 'function') {
                reservation_form_actions($, obj);
            }
        }

        //====================== Reservation form actions end ================================= //


        //====================== Reservation  validation start ================================= //

        var booking_length = $(".reservation_form_submit").length;
        if (booking_length > 0) {

            var booking_field = ["input[name='wpc_booking_date']", "input[name='wpc_name']",
                "input[name='wpc_email']", "select[name='wpc_guest_count']", "input[name='wpc_guest_count']"];

            if (typeof $("input[name='wpc_branch']").length !== "undefined"
                && $("#wpc-branch").prop('required')) {
                booking_field.push("select[name='wpc_branch']");
            }
            $("input").not(':button,:submit,:hidden').each(function () {
                if ($(this).attr('name') == 'wpc_phone' && $(this).prop('required')) {
                    booking_field.push("input[name='wpc_phone']");
                }
                if ($(this).attr('name') == 'wpc_from_time' && $(this).prop('required')) {
                    booking_field.push("input[name='wpc_from_time']");
                }
                if ($(this).attr('name') == 'wpc_to_time' && $(this).prop('required')) {
                    booking_field.push("input[name='wpc_to_time']");
                }

            });

            $(".wpc-form-next").on('click', function () {
							var phone_field = $("input[name='wpc_phone']");
							if (( phone_field.prop('required') && phone_field.val() == "" ) && $.inArray("input[name='wpc_phone']", phone_field) === -1 ) {
									// item NOT in Array
									booking_field.push("input[name='wpc_phone']");
									validation_checking($, booking_field, ".reservation_form_submit", "wpc_booking_error", "wpc_reservation_form_disabled", ".wpc_reservation_table");
							}
            });
            if (typeof validation_checking == 'function') {
                validation_checking($, booking_field, ".reservation_form_submit", "wpc_booking_error", "wpc_reservation_form_disabled", ".wpc_reservation_table");
            }
        }

        function cancel_form_validation() {
            var cancel_form = $(".wpc_reservation_cancel_form").css('display');
            if (cancel_form == "block") {
                var cancel_form_field = ["input[name='wpc_reservation_invoice']", "input[name='wpc_cancell_email']"];
                if (typeof validation_checking == 'function') {
                    validation_checking($, cancel_form_field, ".cancell_form_submit", "wpc_cancell_error", "wpc_cancell_form_submit_disabled", ".wpc_reservation_cancel_form");
                }
            }
        }
        //====================== Reservation  validation end ================================= //

        // pop up structure

        function food_menu_modal(modal_class, body_class) {
            if (document.querySelector("." + modal_class) !== null) {
                $("." + modal_class).fadeIn();
                $('body').addClass(body_class);
            }
        }

        function food_menu_modal_close(modal_class, body_class, from_icon = true, e = null, conent_id) {
            if (from_icon == true) {
                $("." + modal_class).fadeOut();
                $('body').removeClass(body_class);
            } else {
                var container = $("#" + conent_id);
                if (!container.is(e.target) && container.has(e.target).length === 0) {
                    $("." + modal_class).fadeOut();
                    $('body').removeClass(body_class);
                }
            }
        }

        // food location popup

        food_menu_modal('wpc_modal', 'wpc_location_popup');

        $('.wpc_modal').on('click', '.wpc-close', function () {
            food_menu_modal_close('wpc_modal', 'wpc_location_popup');

            if (!$("body").hasClass("wpc_location_popup")) {
                var wpc_special_menu = localStorage.getItem('wpc_special_menu');
                wpc_special_menu = wpc_special_menu !== null ? JSON.parse(wpc_special_menu) : null;
                if (wpc_special_menu == null && wpc_special_menu != "yes" || (typeof wpc_special_menu.value !== "undefined"
                    && wpc_special_menu.value == "")) {
                    $('.wpc-menu-of-the-day').show();
                } else {
                    $('.wpc-menu-of-the-day').hide();
                }
            }
        });

        $('.wpc_booking_modal').on('click', '.wpc-close', function (e) {
            e.preventDefault();
            close_popup("", "", "#wpc_booking_modal");
            $('body').removeClass("wpc_location_popup");
        });

        // reservation from show /hide
        $('.wpc_reservation_table').on('click', '#wpc_cancel_request', function () {
            $('.wpc-reservation-form .wpc_reservation_table').slideUp();
            $('.wpc-reservation-form .wpc_reservation_cancel_form').slideDown();
            cancel_form_validation();
        });

        $('.wpc_reservation_cancel_form').on('click', '#wpc_book_table', function () {
            $('.wpc-reservation-form .wpc_reservation_cancel_form').slideUp();
            $('.wpc-reservation-form .wpc_reservation_table').slideDown();
        });

        var wpc_cart_block = $('.wpc-cart_main_block');
        // cart icon open
        wpc_cart_block.on('click', '.wpc_cart_icon, .minicart-close', function (event) {
            event.preventDefault();
            wpc_cart_block.toggleClass('cart_icon_active');
        });

        $(document).on('mouseup', function (e) {
            if (!wpc_cart_block.is(e.target) && wpc_cart_block.has(e.target).length === 0) {
                wpc_cart_block.removeClass('cart_icon_active');
            }
        });



        if (typeof wpc_form_data !== 'undefined') {
            /*****************************
             * reservation form submit
             **************************/


            var wpc_ajax_url = wpc_form_data.wpc_ajax_url;
            var wpc_reservation_form_nonce = wpc_form_data.wpc_reservation_form_nonce;
            var reserv_extra = [];

            $(".reservation_form_submit").on('click', function (e) {
                e.preventDefault();
                if ($(window).width() < 992) {
                    $('html, body').animate({ scrollTop: $(this).parents().find('.reservation_section').offset().top }, 'slow');
                }

                if ($(".wpc_success_message").length > 0) {
                    $(".wpc_success_message").css('display', 'none').html("")
                }
                var wpc_reservation_first = $(".reservation_form_first_step").val();

                if (typeof wpc_reservation_first !== 'undefined' && wpc_reservation_first == 'reservation_form_first_step') {
                    var wpc_name = $("#wpc-name").val();
                    var wpc_webhook = $("#wpc-webhook").val();
                    var wpc_email = $("#wpc-email").val();
                    var wpc_phone = $("#wpc-phone").val();
                    var wpc_booking_date = $("#wpc_booking_date").val();
                    var wpc_from_time = $("#wpc_from_time").val();
                    var wpc_to_time = $("#wpc_to_time").val();

                    var wpc_guest_count = ($('.wpc_visual_selection').length == 0) ? $("#wpc-party option:selected").val() : $('.wpc_guest_count').val();
                    var wpc_branch = $("#wpc-branch option:selected").html();
                    var wpc_message = $("textarea#wpc-message").val();

                    // booking from for check
                    $(".wpc_reservation_form_one").fadeOut(100, "linear", function () {
                        $(".wpc_reservation_form_two").fadeIn(100);
                    });

                    $(".wpc_check_name").html(wpc_name);
                    $(".wpc_check_email").html(wpc_email);


                    var wpc_check_phone = "wpc_check_phone";

                    if (wpc_phone !== "") {
                        $("." + wpc_check_phone).html("").html(wpc_phone);
                        $("#" + wpc_check_phone).removeClass("hide_field");

                    } else {
                        $("." + wpc_check_phone).html("");
                        $("#" + wpc_check_phone).addClass("hide_field");
                    }

                    $(".wpc_check_guest").html(wpc_guest_count);
                    $(".wpc_check_start_time").html(wpc_from_time);
                    $(".wpc_check_end_time").html(wpc_to_time);
                    $(".wpc_check_booking_date").html(wpc_booking_date);
                    $(".wpc_check_message").html(wpc_message);
                    $(".wpc_check_branch").html(wpc_branch);

                    if (wpc_message !== "") {
												$("#wpc_reserv_message").html('<strong>Additional Information:</strong><span class="wpc_reserv_message">'+ wpc_message + '<span>' ).css('display', 'block');
                    } else {
                        $("#wpc_reserv_message").css('display', 'none');
                    }

                }

                // reservation extra field
                if (typeof reservation_extra_field === "function") {
                    //TODO reservation_extra_field call here, also inside reservation_extra_field_list() function.
                    reserv_extra = reservation_extra_field()
                    reservation_extra_field_list();
                }

            });

            var confirm_booking_btn = $(".confirm_booking_btn");
            var cancell_form_submit = $(".cancell_form_submit");
            var another_reservation_free = $(".wpc-another-reservation-free");
            var reservation_submit_action = false;
            $(".cancell_form_submit,.confirm_booking_btn").on('click', function (e) {
                e.preventDefault();
                var cancel_form = false;
                var reservation_form = false;
                if (reservation_submit_action) {
                    return;
                }

                var wpc_invoice = $(".wpc-invoice").val();
                var wpc_email = $(".wpc_cancell_email").val();

                if (typeof wpc_invoice !== "undefined" && (wpc_invoice !== '' && wpc_email !== '')) {

                    var wpc_phone = $(".wpc_cancell_phone").val();
                    var wpc_message = $(".wpc_cancell_message").val();
                    var data = {
                        action: 'wpc_check_for_submission',
                        wpc_cancell_email: wpc_email,
                        wpc_cancell_phone: wpc_phone,
                        wpc_reservation_invoice: wpc_invoice,
                        wpc_message: wpc_message,
                        wpc_action: 'wpc_cancellation',
                    }
                    cancel_form = true;
                } else {
                    var reservation_form_second_step = $(this).data('id');
                    if (typeof reservation_form_second_step !== 'undefined' && reservation_form_second_step == 'reservation_form_second_step') {
                        //TODO clear out unnecessary variables
                        var data = {
                            action: 'wpc_check_for_submission',
                            _wpcnonce: wpc_reservation_form_nonce,
                            wpc_webhook: $(".wpc_webhook").val(),
                            wpc_name: $(".wpc_check_name").text(),
                            wpc_email: $(".wpc_check_email").text(),
                            wpc_phone: $(".wpc_check_phone").text(),
                            wpc_guest_count: $(".wpc_check_guest").text(),
                            wpc_from_time: $(".wpc_check_start_time").text(),
                            wpc_to_time: $(".wpc_check_end_time").text(),
                            wpc_booking_date: $("#wpc_booking_date").data("wpc_booking_date"),
                            wpc_message: $("textarea#wpc-message").val(),
                            wpc_branch: $(".wpc_check_branch").text(),
                            reserv_extra: reserv_extra,
                            wpc_action: 'wpc_reservation',
                        }

                        if ($(".wpc_visual_selection").length > 0) {

                            //TODO clear out unnecessary variables

                            data.wpc_visual_selection = $(".wpc_visual_selection").val();
                            data.wpc_schedule_slug = $(".wpc_schedule_slug").val();
                            data.wpc_booked_ids = $(".wpc_booked_ids").val();
                            data.wpc_booked_table_ids = $(".wpc_booked_table_ids").val();
                            data.wpc_obj_names = $(".wpc_obj_names").val();
                            data.wpc_intersected_data = $(".wpc_intersected_data").val();
                            data.wpc_mapping_data = $(".wpc_mapping_data").val();
                            data.wpc_webhook = $(".wpc_webhook").val();

                        }

                        var reservation_form = true;
                    }
                }
                if (cancel_form || reservation_form) {

                    $.ajax({
                        url: wpc_ajax_url,
                        method: 'post',
                        data: data,
                        beforeSend: function (params) {
                            reservation_submit_action = true;
                            $(".wpc-another-reservation").css("display",'none');
                            if (reservation_form) {
                                confirm_booking_btn.addClass("loading");
                            }
                            else if (cancel_form) {
                                cancell_form_submit.addClass("loading");
                            }
                        },
                        success: function (response) {
                            reservation_submit_action = false
                            if (typeof response.data.data !== "undefined" && response.data.data.form_type == 'wpc_reservation' && ($.isArray(response.data.message) && response.data.message.length > 0)) {
                                confirm_booking_btn.removeClass("loading").fadeOut();
                                another_reservation_free.fadeIn();
                                $(".edit_booking_btn").css('display', 'none');
                                error_message.css('display', 'none');
                                error_message.html('');
                                var form_type = jQuery(".form_style").data("form_type");

                                var invoice = typeof response.data.data.invoice !== "undefined" ? response.data.data.invoice : "";
                                var message = typeof response.data.message[0] !== "undefined" ? response.data.message[0] : "";
                                if (typeof reservation_success_block !== "undefined" && form_type == "pro") {
                                    var arr = { invoice: invoice, message: message };
                                    reservation_success_block(arr); 
                                } else {
                                    log_message.fadeIn().html(response.data.message[0]);
                                }

                                $("#wpc-webhook").val("");
                                $("#wpc-name").val("");
                                $("#wpc-email").val("");
                                $("#wpc-phone").val("");
                                $("#wpc_booking_date").val("");
                                $("#wpc_from_time").val("");
                                $("#wpc_to_time").val("");

                                if ($('.wpc_visual_selection').length == 0) {
                                    $("#wpc-party option:selected").removeAttr("selected");
                                } else {
                                    $('.wpc_guest_count').val('');
                                    $('.wpc_booked_ids').val('')
                                    $('.wpc_booked_table_ids').val('')
                                    $('.wpc_obj_names').val('')
                                }

                                $("#wpc-branch option:selected").removeAttr("selected");
                                $("#wpc-message").val("");

                            } else if (response.data.data.form_type == 'wpc_reservation_field_missing' && ($.isArray(response.data.message) && response.data.message.length > 0)) {
                                error_message.css('display', 'block').html(response.data.message[0]);
                            } else if (response.data.data.form_type == 'wpc_reservation_cancell' && ($.isArray(response.data.message) && response.data.message.length > 0)) {
                                error_message.css('display', 'none').html('');
                                cancell_log_message.css('display', 'block').html(response.data.message[0]);
                                cancell_form_submit.removeClass("loading").fadeOut();

                                $(".wpc_cancell_email").val("");
                                $(".wpc_cancell_phone").val("");
                                $(".wpc_cancell_message").val("");
                                $(".wpc-invoice").val("");
                                if (response.data.status_code === 200) {
                                    $(".cancell_form_submit").fadeOut('slow');
                                }

                            } else if (response.data.data.form_type == 'wpc_reservation_cancell_field_missing' && ($.isArray(response.data.message) && response.data.message.length > 0)) {
                                error_message.css('display', 'block').html(response.data.message[0]);
                                cancell_log_message.css('display', 'none');
                            }

                            $(".wpc-another-reservation").css("display",'inline');
                        },
                        complete: function () {
                            reservation_submit_action = false
                        },
                    });
                }
            });
        }

        // back to edit form
        $(".edit_booking_btn,.wpc-another-reservation-free").on('click', function (e) {
            e.preventDefault();
            const isEdit = e.target == document.getElementsByClassName('edit_booking_btn')[0] ? true : false;
            reservation_form_action(isEdit);
            // booking from for check
            $(".wpc_reservation_form_two").fadeOut(100, "linear", function () {
                $(".wpc_reservation_form_one").fadeIn(100, "linear");
            });
            $('.wpc-another-reservation-free').removeAttr("style");
            $('.confirm_booking_btn').removeAttr("style");
            $('.edit_booking_btn').removeAttr("style");
            $('.wpc_log_message').removeAttr("style");
        });

        $(".wpc-another-reservation").on('click', function (e) {
            e.preventDefault();
            $('.wpc_reservation_form .wpc-field-set').css("display", "none");
            $('.wpc_reservation_form .wpc-reservation-success').css("display", "none");
            $(".wpc-reservation-pagination li").removeClass("active");
            $('.wpc_reservation_form .wpc-field-set:first-child').fadeIn(1000);
            $(".wpc-reservation-pagination li:first-child").addClass("active");
            $('.wpc_reservation_form .wpc-field-set .wpc_reservation_info').removeAttr("style");
            $('.wpc_reservation_form .wpc-field-set .wpc_reservation_info .confirm_booking_btn').removeAttr("style");
            $('.wpc_reservation_form .wpc-field-set #wpc_reserv_message').removeAttr("style");
            // reset form and disable button
            reservation_form_action();
        });

        /**
         * Book again button action
         */
        function reservation_form_action(isEdit = false) {
            // reset form and disable button
            $("#wpc-party option[value='1']").prop("selected", true);
            if(!isEdit){
                $(".reservation_form_submit").addClass("wpc_reservation_form_disabled");
                $(".reservation_form_submit").prop("disabled",true);
            }else{
                $(".reservation_form_submit").removeClass("wpc_reservation_form_disabled");
                $(".reservation_form_submit").prop("disabled",false);
            }
        }

    });




})(jQuery);

// remove block
function remove_block( obj ) {
    jQuery(obj.parent_block).on( 'click' , obj.remove_button , function(e) {
        e.preventDefault();
        jQuery(this).parent( obj.removing_block ).remove();
    });
}
;"use strict";

/**
 * Reservation script here
 * Same task of Frontend and Backend  
 */

// Get weekly schedule day array
const get_weekly_schedule=( day_arr )=>{
    var day = jQuery.map(day_arr, function (value, index) {
        return object_key_name(value);
        
    });

    return day;
}

// Get weekly schedule day no array
const get_weekly_day_no =( disable_weekly_arr )=>{
    var disable_arr = [];
    if ( ( jQuery.isArray( disable_weekly_arr ) || typeof disable_weekly_arr === "object") && disable_weekly_arr.length>0 ) {
        jQuery.each( disable_weekly_arr, function( index , data ){
            if (data == "Sat") {
                disable_arr.push(6);
            }
            if (data == "Sun") {
                disable_arr.push(0);
            }
            if (data == "Mon") {
                disable_arr.push(1);
            }
            if (data == "Tue") {
                disable_arr.push(2);
            }
            if (data == "Wed") {
                disable_arr.push(3);
            }
            if (data == "Thu") {
                disable_arr.push(4);
            }
            if (data == "Fri") {
                disable_arr.push(5);
            }
        } )
    }

    return disable_arr;
}

// get weekly schedule 
const wpc_weekly_schedule_time = (weekly_schedule_arr, selected_day, wpc_weekly_schedule_start_time, wpc_weekly_schedule_end_time) => {
    // default response
    var response = {
        success: false,
        wpc_start_time: '',
        wpc_end_time: ''
    };
    var day = get_weekly_schedule( weekly_schedule_arr );

    if (jQuery.inArray(selected_day, day) !== -1) {
        for (let index = 0; index < weekly_schedule_arr.length; index++) {
            const element = weekly_schedule_arr[index];
            var key = object_key_name(element);
            for (let i = 0; i < key.length; i++) {
                const element = key[i];
                if (selected_day == element) {
                    response.success = true;
                    response.wpc_start_time = wpc_weekly_schedule_start_time[index];
                    response.wpc_end_time = wpc_weekly_schedule_end_time[index];
                }
            }
        }
    }

    return response;
}

// change date format to expected format
const wpc_flatpicker_date_change =(selectedDates,format)=>{
    var wpc_new_selected_date = "";
    if (jQuery.isArray(selectedDates)) {
        var wpc_date_ar = selectedDates.map(date => flatpickr.formatDate(date, format));
    }
    
    if (wpc_date_ar.length == 1 ) {
        wpc_new_selected_date = wpc_date_ar.toString();
    } else {
        wpc_new_selected_date = wpc_date_ar;
    }

    return wpc_new_selected_date;
}

// if get value 0 turn into time
function reserv_time_picker( data , format = "h:i A" ) {
    if ( 0 == data.val() && format == "h:i A" ) {
        data.val( '12:00 AM' )
    }
    else if( 0 == data.val() && format == "H:i" ){
        data.val( '00:00' )
    }
    data.timepicker('hide');
}

/**
 * Change format according to moment 
 * @param {*} wpc_date_format 
 * @returns 
 */
 function changing_format( get_date , wpc_date_format) {

    var result_date = "";
    if ( wpc_date_format !=="") {
        var change_date_format = "YYYY-MM-DD";
        
        if (wpc_date_format =="y/m/d" ) {
            change_date_format = "YY/M/D";
        }
        else if (wpc_date_format =="Y-m-d" ) {
            change_date_format = "YYYY-MM-DD";
        }
        else if (wpc_date_format =="F j, Y" || wpc_date_format =="j F Y" ) {
            change_date_format = "MMMM Do , YYYY";
        }
        else if(wpc_date_format =="m/d/Y"){
            change_date_format = "M/D/Y";
        }
        else if(wpc_date_format =="d/m/Y"){
            change_date_format = "D/M/Y";
        }
        else if (wpc_date_format =="d-m-Y" ) {
            change_date_format = "D-M-Y";
        }
        else if(wpc_date_format =="m-d-Y"){
            change_date_format = "M-D-Y";
        }
        else if(wpc_date_format =="Y.m.d"){
            change_date_format = "Y.M.D";
        }
        else if(wpc_date_format =="m.d.Y"){
            change_date_format = "M.D.Y";
        }
        else if(wpc_date_format =="d.m.Y"){
            change_date_format = "D.M.Y";
        }

        var date = moment(get_date, change_date_format );
        result_date = date.format('YYYY-MM-DD');
    }

    return result_date;
}


//====================== Reservation form validation start ================================= //
function validation_checking( $, input_arr , button_class , error_class , disable_class , key_parent) {
    var in_valid = [];    
    $.each(input_arr, function (index, value) {
        var $this = $(this); 
        var type = typeof $this.attr('type') ==="undefined" ? "select" : $this.attr('type');
        
        switch ( type ) {
            // TODO merge text|email|tel as their edge-case is same
            case 'text' :
            case 'email':
            case 'tel':
                // add error class in input
                if ( typeof $(this).val() ==="undefined" ||  $(this).val() =="" ) {
                    $(this).addClass(error_class);
                    in_valid.push(value);
                }
                break;
            case 'number' :
                // add error class in input
                if ( typeof $(this).val() ==="undefined" || parseInt( $(this).val() ) == 0 ) {
                    $(this).addClass(error_class);
                    in_valid.push(value);
                }
                break;

            case 'select':
                    if ( typeof $(value).val() ==="undefined" ||  $(this).val() =="") {
                        $(this).addClass(error_class);
                        in_valid.push(value);
                    }
                    break;

            default:
                break;
        }

        input_change_validation($ , key_parent , value  , type , error_class , button_class , disable_class )

    });

    // check if value already exist in input
    if (in_valid.length>0) {
        $(button_class).prop('disabled', true).addClass(disable_class);
    } else {
        $(button_class).prop('disabled', false).removeClass(disable_class);
    }
}

/**
 * Get validation message
 */
function get_error_message($, type, value , error_class, element='' ) {

    var response = {
        error_type: "no_error",
        message: "success",
    };
    if (value.length == 0) {
        $(this).addClass(error_class);
    } else {
        $(this).removeClass(error_class);
    }

    var wpc_form_data = JSON.parse(wpc_form_client_data);
    var wpc_error_msg = wpc_form_data.wpc_validation_message;

    switch (type) {
        case 'email':
            //TODO use short regex for email validation
            const re = /\S+@\S+\.\S+/;
            if (value.length !== 0) {
                if (re.test(String(value).toLowerCase()) == false) {
                    response.error_type = "not-valid";
                    response.message = wpc_error_msg.email;
                }
            } else {
                response.error_type = "empty";
                response.message = wpc_error_msg.error_text;
            }
            break;
        case 'tel':
            var phone_no = /^[+]*[0-9]*$/g;

            if (value.length === 0) {
                response.error_type = "empty";
                response.message = wpc_error_msg.error_text;
            } else if (value.length > 14) {
                response.error_type = "not-valid";
                response.message    = wpc_error_msg.phone.phone_invalid;
            } else if ( !value.match( phone_no ) ){
                response.error_type = "not-valid";
                response.message    = wpc_error_msg.phone.number_allowed;
            }
            break;
        case 'text':
            if (value.length === 0) {
                response.error_type = "empty";
                response.message = wpc_error_msg.error_text;
            }
            break;
        case 'number':
            var selected_val = parseInt(value);

            var min_attr = parseInt( $(element).attr('min') );
            var max_attr = parseInt( $(element).attr('max') );

            if (selected_val == 0) {
                response.error_type = "empty";
                response.message = wpc_error_msg.table_layout.empty;
            } else {
                if (selected_val < min_attr) {
                    response.error_type = "min-under";
                    response.message = wpc_error_msg.table_layout.min_invalid + min_attr;
                }
    
                if (selected_val > max_attr) {
                    response.error_type = "max-over";
                    response.message = wpc_error_msg.table_layout.max_invalid + max_attr;
                }
            }

            break;
        case 'select':
            if (value.length === 0) {
                response.error_type = "empty";
                response.message = wpc_error_msg.error_text;
            }
        default:
            break;
    }

    return response;
}

/**
 * Disable button on check input
 */
function button_disable( $ , button_class, error_class , disable_class ) {
    var length = $( error_class ).length;
    var button_submit = $( button_class );
    if (length == 0) {
        button_submit.prop('disabled', false).removeClass( disable_class );
    } else {
        button_submit.prop('disabled', true).addClass( disable_class );
    }
}

/**
 * On key up value check
 */

function input_change_validation($ , key_parent , element , type , error_class , button_class , disable_class ) {

    if ( type =="select" ) {
        $( element ).on("change", function () {
            var $this = $(this);
            var response = get_error_message( $ , type , $this.val() ,'wpc_booking_error');
            var id       = $this.attr("id");
            $("." + id ).html("");
            if (typeof response !== "undefined" && response.message !== 'success') {
                $("." + id).html(response.message);
                $this.addClass( error_class + ' wpc_has_error' );
            } else {
                $this.removeClass( error_class + ' wpc_has_error' );
            }
            button_disable( $ , button_class, "."+error_class , disable_class  );
        });

    } else if ( type =="number" ) {
        $( element ).on("change", function () {
            var $this = $(this);
            var response = get_error_message( $ , type , $this.val() ,'wpc_booking_error', element);
            var id       = $this.attr("id");

            $("." + id ).html("");
            if (typeof response !== "undefined" && response.message !== 'success') {
                if( id != 'wpc-party' ){
                    $("." + id).html(response.message);
                } else {
                    $(".wpc_error_message").css('display','block').html(response.message);
                }
                $this.addClass( error_class + ' wpc_has_error' );
            } else {
                $this.removeClass( error_class + ' wpc_has_error' );
                if( id == 'wpc-party' ){
                    $(".wpc_error_message").css('display','none').html('');
                }
            }

            button_disable( $ , button_class, "."+error_class , disable_class  );
        });
    } else {
        $( key_parent ).on("keyup", element , function () {
            var $this    = $(this);
            var response = get_error_message( $ , type , $this.val() ,'wpc_booking_error');
            var id       = $this.attr("id");

            $("." + id).html("");
            if (typeof response !== "undefined" && response.message !== 'success') {
                $("." + id).html(response.message);
                $this.addClass( error_class + ' wpc_has_error' );
            } else {
                $this.removeClass( error_class + ' wpc_has_error' );
            }
            button_disable( $ , button_class, "."+error_class , disable_class  );
        });
    }

}

//====================== Reservation form validation end ================================= //


//====================== Reservation form actions start ================================= //

/**
 * Reservation weekly, daily schedule for single slot and multi-slot
 */

// Convert for settings time
const convert24_format =( time )=>{
    var response = "";
    if ( typeof time !=="undefined" && time !=="" ) {
        if( jQuery.isArray( time.split(' ') ) ){
            response = moment(time, ["h:mm A"]).format("HH:mm");
        }
    }

    return response;
}

// convert time 12 to 24
const convert_time12to24 =(time12h)=> {
    if ( typeof time12h !=="undefined" ) {
        return moment(time12h, ["h:mm A"]).format("HH:mm");
    }
}

// convert time 24 to 12
const convert_time24to12 =(time)=> {
    return moment(time,'HH:mm').format('h:mm A');
}

// calculate time difference
const time_diff =( wpc_end_time,last_time )=>{
    var response = "00:00";
    var dt = new Date();
    var current_date = dt.getFullYear() + "/" + (dt.getMonth() + 1) + "/" + dt.getDate();
    var now  = ""+ current_date +" "+ wpc_end_time +"";
    var then = ""+ current_date +" "+ last_time +"";

    response = moment.utc(moment(now,"DD/MM/YYYY HH:mm").diff(moment(then,"DD/MM/YYYY HH:mm"))).format("HH:mm")

    return response ;
}

// check late booking
const time_diff_for_before_after_equal = (select_time, last_booking_time) => {
    var last_booking_time = last_booking_time == "00:00" ? "24:00": last_booking_time;
    var data      = "unknown";
    var startTime = moment.duration(select_time).asSeconds();
    var endTime   = moment.duration(last_booking_time).asSeconds();

    if (moment(startTime).isBefore(moment(endTime))) {
        data = "early";
    } else if (moment(startTime).isSame(moment(endTime))) {
        data = "equal";
    } else if (moment(startTime).isAfter(moment(endTime))) {
        data = "late";
    }

    return data;
}

//add one minute with the existing time
const add_minute =(time , timeFormat)=> {
    let new_time= time.split(":");
    let new_hour = new_time[0];
    let minute = new_time[1].split(" ");
    let new_minute = parseInt(minute[0]);
    let am_pm='';

    if (timeFormat == '24') {
        time = convert_time12to24(time);
        am_pm = '';
    }else{
        am_pm = ' ' + minute[1];
    }

    new_minute = (new_minute < 10) ? ("0"+ ++new_minute) : ++new_minute;
    new_time = new_hour +':'+ new_minute + am_pm;
    return new_time;
}

//generate time list based on multi slot
const multislot_time_picker =(startTime, endTime, timeFormat )=> {
    let multislotData = [];
    let multi_time_excludes = [];
    for (let i = 0; i < startTime.length; i++) {
        if ( timeFormat == '24') {
            startTime[i]    = convert_time12to24(startTime[i]);
            endTime[i]      = convert_time12to24(endTime[i]);
        }
        //add one minute to the last element of the array
        let start_time = add_minute(endTime[i] , timeFormat);

        // Don't add to the array for last element
        if( i < startTime.length-1 ){
            multi_time_excludes.push([
                start_time,
                startTime[i+1]
            ]);
        }
    }

    multislotData['multi_time_excludes'] = multi_time_excludes;

    if (timeFormat == '24') {
        multislotData['wpc_start_time'] = convert_time12to24(startTime[0]);
        multislotData['wpc_end_time']   = convert_time12to24(endTime[ endTime.length - 1]);

    } else {
        multislotData['wpc_start_time'] = startTime[0];
        multislotData['wpc_end_time'] = endTime[ endTime.length - 1];
    }
    
    return multislotData;
}

// get object key name
function object_key_name(obj){
    return Object.keys(obj);
    //TODO Object.keys() return all the keys of an object as array.
    // var key_arr = [];
    // for (var key in obj) {
    //     key_arr.push(key);
    // }
    // return key_arr;
}

// check multi slot , weekly and all day schedule
const wpc_weekly_daily_schedule =( $, wpc_booking_form_data, selected_day )=> {
    var obj={};var multislotData =[];    

    // check multislot weekly and all day schedule
    if( typeof wpc_booking_form_data.reser_multi_schedule !== 'undefined' && wpc_booking_form_data.reser_multi_schedule == "on" ){
        if ( wpc_booking_form_data.multi_diff_weekly_schedule.length <= 0 && ( typeof wpc_booking_form_data.multi_start_time[0] !=='undefined' && wpc_booking_form_data.multi_start_time[0] !=="") &&  
        ( typeof wpc_booking_form_data.multi_end_time[0] !=='undefined' &&  wpc_booking_form_data.multi_end_time[0] !=="" )  ) {
            // generate time list based on all day multislot start and end time which will be excluded from the timepicker time list for creating disableTimeRange array
            multislotData = multislot_time_picker( wpc_booking_form_data.multi_start_time, wpc_booking_form_data.multi_end_time , wpc_booking_form_data.wpc_time_format );
            obj.multi_start_time= wpc_booking_form_data.multi_start_time;
            obj.multi_end_time  = wpc_booking_form_data.multi_end_time;
            obj.multi_schedule_name  = wpc_booking_form_data.multi_schedule_name;

        }else{
            // multislot schedule for different day 
            var multislot_day_object = wpc_booking_form_data.weekly_multi_diff_times;
            
            var day = object_key_name( multislot_day_object );
            
            if (jQuery.inArray(selected_day, day) !== -1 ) {
                const element = multislot_day_object[selected_day]

                let week_start_time = element.map(function(value,index){ return value.start_time });
                let week_end_time   = element.map(function(value,index){ return value.end_time });
                let week_schedule_name   = element.map(function(value,index){ return value.schedule_name });

                multislotData = multislot_time_picker( week_start_time ,week_end_time , wpc_booking_form_data.wpc_time_format );
           
                obj.multi_start_time= week_start_time;
                obj.multi_end_time  = week_end_time;
                obj.multi_schedule_name  = week_schedule_name;
                
            }

        }

        obj.schedule_type   = "multipleslot";

        if ( typeof multislotData.wpc_start_time !=="undefined" ) {
            obj.wpc_start_time  = multislotData['wpc_start_time'];
            obj.wpc_end_time    = multislotData['wpc_end_time'];
            obj.response_type   = "success";
            wpc_booking_form_data.multi_time_excludes = multislotData['multi_time_excludes'];
            $('#wpc_booking_date').removeClass("wpc_booking_error");
            
            button_disable( $ , '.reservation_form_submit', ".wpc_booking_error" , "wpc_reservation_form_disabled" , ".wpc_reservation_table" );   
        }else{
            obj.response_type   = "error";
        }
    }
    //multislot end
    else{
        // time range for all day
        if (wpc_booking_form_data.wpc_all_day_start_time != "" && wpc_booking_form_data.wpc_all_day_end_time != "") {
            var wpc_all_day_start_time = wpc_booking_form_data.wpc_all_day_start_time;
            var wpc_all_day_end_time = wpc_booking_form_data.wpc_all_day_end_time;

            if (wpc_booking_form_data.wpc_time_format == '24') {
                obj.wpc_start_time  = convert_time12to24(wpc_all_day_start_time);
                obj.wpc_end_time    = convert_time12to24(wpc_all_day_end_time);
            } else {
                obj.wpc_start_time  = wpc_all_day_start_time;
                obj.wpc_end_time    = wpc_all_day_end_time;
            }

            obj.schedule_type   = "allday";
            obj.response_type   = "success";

            $('#wpc_booking_date').removeClass("wpc_booking_error");
            button_disable( $ , '.reservation_form_submit', ".wpc_booking_error" , "wpc_reservation_form_disabled" , ".wpc_reservation_table" );
        }
        else {
            // time range for weekly
            var weekly_schedule_arr = wpc_booking_form_data.wpc_weekly_schedule;
            var weekly_start_time = wpc_booking_form_data.wpc_weekly_schedule_start_time;
            var weekly_end_time = wpc_booking_form_data.wpc_weekly_schedule_end_time;
            var response = wpc_weekly_schedule_time(weekly_schedule_arr, selected_day, weekly_start_time, weekly_end_time);

            if (response.success == true) {
                $("#wpc_from_time").prop('disabled', false);
                $("#wpc_to_time").prop('disabled', false);
                if (wpc_booking_form_data.wpc_time_format == '24') {
                    obj.wpc_start_time  = convert_time12to24(response.wpc_start_time);
                    obj.wpc_end_time    = convert_time12to24(response.wpc_end_time);
                } else {
                    obj.wpc_start_time  = response.wpc_start_time;
                    obj.wpc_end_time    = response.wpc_end_time;
                }

                obj.schedule_type       = "weekly";
                obj.response_type       = "success";

                $('#wpc_booking_date').removeClass("wpc_booking_error");
                button_disable( $ , '.reservation_form_submit', ".wpc_booking_error" , "wpc_reservation_form_disabled" , ".wpc_reservation_table" );
            } else {
                obj.wpc_start_time  = "";
                obj.wpc_end_time    = "";
                obj.schedule_type   = "";
                obj.response_type   = "clear_date";
            }
        }

    }

    return obj;
}

// check late booking
const wpc_check_late_booking =( $, selected_time , last_booking_time , min , from_time , to_time , wpc_time_format , end_id )=> {

    var time_diff_latebooked = time_diff_for_before_after_equal( selected_time , last_booking_time );
    var error_message        = jQuery('.wpc_error_message');

    error_message.html("");

    if ( time_diff_latebooked == 'late' ) {
        var get_end_time = to_time;
        if( wpc_time_format == "h:i A" ) {
            get_end_time = convert_time24to12( to_time  );
        }
        var last_booked_message = $(".late_booking").data("late_booking");

        var response1 = last_booked_message.replace("{last_time}", get_end_time );
        var response2 = response1.replace("{last_min}", min );

        from_time.val(""); end_id.val("");
        from_time.addClass("wpc_booking_error");
        end_id.addClass("wpc_booking_error");
        button_disable( $ , '.reservation_form_submit', ".wpc_booking_error" , "wpc_reservation_form_disabled" , ".wpc_reservation_table" );
        $(".wpc_success_message").css("display","none").html("")
        error_message.css("display", "block");
        error_message.html( response2 );
        
    } else {
        error_message.css("display", "none");
        from_time.removeClass("wpc_booking_error");
        button_disable( $ , '.reservation_form_submit', ".wpc_booking_error" , "wpc_reservation_form_disabled" , ".wpc_reservation_table" );
    }
}

// If select time first check date 
function check_date_field($, wpc_error_message , from_time , to_time  ){
    // Check if date field empty
    wpc_error_message.css('display','none').html( "" );
    var date_class = $('#wpc_booking_date');
    var check_date = date_class.val();

    if ( check_date == "" ) {
        date_class.addClass('error');
        var date_missing = $(".date_missing").data("date_missing");
        wpc_error_message.css('display','block').html( date_missing );
        $('.wpc-validate-msg').css('display','block').html( date_missing );
        from_time.val("");
        to_time.val("");
        
        return;
    }
}

function multislot_time_range_validation($,multi_schedule,input_value,wpc_time_format) {
            
    var multi_start = multi_schedule.start;
    var multi_end   = multi_schedule.end;
    var multi_form_time = $("#wpc_from_time").val();
    var multi_to_time   = $("#wpc_to_time").val();

    if ( multi_schedule.start !=="" && multi_form_time !=="" && multi_to_time !=="" ) {

        var format      = "HH:mm";
        if ( wpc_time_format == '24') {
            format = ['HH:mm'];
        }else{
            format = ["h:mm A"];
        }
        var get_index   = "";
        var get_valid_i = "";

        for (let index  = 0; index < multi_start.length; index++) {
            var pair_time_start = multi_start[index];
            var pair_time_end   = multi_end[index];

            var time    = moment(input_value,format),
            beforeTime  = moment(pair_time_start,format),
            afterTime   = moment(pair_time_end,format);

            if (time.isBetween(beforeTime, afterTime)) {
                get_index = index;
            }

        }
        
    }
}

/*
* All algorithm to fetch time range 
* Based on date
*/

function get_time_range_based_on_date( $ , param_obj , obj ) {
    var wpc_start_time          = '';
    var wpc_end_time            = '';
    var multi_schedule          = { start : "" , end : "" };

    var wpc_time_format         = param_obj.wpc_time_format;
    var from_time               = param_obj.from_time;
    var to_time                 = param_obj.to_time;
    var schedule_message        = $(".wpc_success_message");

    // Show message that there is no schedule
    param_obj.wpc_error_message.css('display','none').html('');

    $('.wpc-validate-msg').css('display','none').html('');

    if ( param_obj.wpc_booking_form_data !== null  ) {

        var wpc_new_selected_date = wpc_flatpicker_date_change(param_obj.selectedDates, "Y-m-d");

        $('.wpc_check_booking_date').attr('data-wpc_check_booking_date',wpc_new_selected_date);

        if ( param_obj.wpc_booking_form_data.wpc_today ==  wpc_new_selected_date  && obj.booking_form_type =="frontend" && obj.reserve_status.status == "closed") {
            // Show message that there is no schedule
            param_obj.wpc_error_message.css('display','block').html( obj.reserve_status.message );

            return;
        }

        var response        = {};
        var exception_date  = param_obj.wpc_booking_form_data.wpc_exception_date;

        if (typeof exception_date === "undefined") {

            /**********************
            // Check exception date
            *************************/
          var get_date_data = change_date_format(param_obj.selectedDates,param_obj.wpc_date_format);

            var wpc_new_selected_date = wpc_flatpicker_date_change(param_obj.selectedDates, "D");

            response        = wpc_weekly_daily_schedule( $, param_obj.wpc_booking_form_data , wpc_new_selected_date );
            wpc_start_time  = typeof response.wpc_start_time !=="undefined" ? response.wpc_start_time : "";
            wpc_end_time    = typeof response.wpc_end_time !=="undefined" ? response.wpc_end_time : "";

        }
        else {
            if (exception_date.length > 0 && exception_date[0] !== '') {

                if ($.inArray(wpc_new_selected_date, exception_date) !== -1) {
                    // Selected date is an exception date , so find exception start and end time
                    var index = exception_date.indexOf(wpc_new_selected_date);
                    wpc_start_time  = param_obj.wpc_booking_form_data.wpc_exception_start_time[index];
                    wpc_end_time    = param_obj.wpc_booking_form_data.wpc_exception_end_time[index];
                    response.response_type = "success";

                    $('#wpc_booking_date').removeClass("wpc_booking_error");
                    button_disable( $ , '.reservation_form_submit', ".wpc_booking_error" , "wpc_reservation_form_disabled" , ".wpc_reservation_table" );
                }
                else {
                    // Selected date is not an exception date , so find schedule from weekly or daily start and end time
                    var wpc_new_selected_date = wpc_flatpicker_date_change(param_obj.selectedDates, "D");
                    response        = wpc_weekly_daily_schedule( $, param_obj.wpc_booking_form_data , wpc_new_selected_date);
                    wpc_start_time  = typeof response.wpc_start_time !=="undefined" ? response.wpc_start_time : "";
                    wpc_end_time    = typeof response.wpc_end_time !=="undefined" ? response.wpc_end_time : "";
                }

            }
            else {
                // Selected date is not an exception date , so find schedule from weekly or daily start and end time
                var wpc_new_selected_date = wpc_flatpicker_date_change(param_obj.selectedDates, "D");
                response        = wpc_weekly_daily_schedule( $, param_obj.wpc_booking_form_data, wpc_new_selected_date);
                wpc_start_time  = typeof response.wpc_start_time !=="undefined" ? response.wpc_start_time : "";
                wpc_end_time    = typeof response.wpc_end_time !=="undefined" ? response.wpc_end_time : "";

            }

        }

        if ( response !== "undefined" && response.response_type !== "undefined" &&  response.response_type == "clear_date" ) {

            // Clear date value and make disable
            $("#wpc_booking_date").val("");
            $('#wpc_booking_date').addClass("wpc_booking_error");

            // Show message that there is no schedule
            param_obj.wpc_error_message.css('display','block').html( param_obj.no_schedule_message );

            $("#wpc_from_time").prop('disabled', true);
            $("#wpc_to_time").prop('disabled', true);

        }
        else {

            // Enable date value and set start and end time to time picker
            $("#wpc_from_time").prop('disabled', false);
            $("#wpc_to_time").prop('disabled', false);

            if ( wpc_time_format !== "H:i" ) {
                wpc_start_time = convert_time12to24(wpc_start_time);
                wpc_end_time = convert_time12to24(wpc_end_time);

            }

            var checking_time       = check_time_range_validation( wpc_start_time , wpc_end_time , param_obj.selectedDates , null );
            var disable_time_rage   = param_obj.wpc_booking_form_data.multi_time_excludes;

            if ( checking_time.flag == "start_from_current" ) {
                var start     = moment(new Date());
                var step_data = typeof param_obj.wpc_booking_form_data.reserv_time_interval !=="undefined" ?
                param_obj.wpc_booking_form_data.reserv_time_interval : 30 ;
                var remainder = step_data - (start.minute() % 30);
                var get_start = moment(start).add(remainder, "minutes").format("hh:mm A");
                wpc_start_time = get_start;
            }
            else if(  checking_time.flag == "disable_time"  ){
                disable_time_rage = [ [wpc_start_time, checking_time.end_time ] ];
            }

            from_time.timepicker('option', 'minTime', wpc_start_time);
            from_time.timepicker('option', 'maxTime', wpc_end_time );

            // Disable time for multi slot and current date past time
            from_time.timepicker('option', 'disableTimeRanges', disable_time_rage );

            to_time.timepicker('option', 'minTime', wpc_start_time);
            to_time.timepicker('option', 'maxTime', wpc_end_time);

            // Disable time for multi slot and current date past time
            to_time.timepicker('option', 'disableTimeRanges', disable_time_rage );

            // Show Booking schedule according to date
            schedule_message.css('display','none').html( "" );

            if ( response !== "undefined" && response.schedule_type !== "undefined" && response.schedule_type !== "" && param_obj.wpc_error_message.html()=="" ){

                var start           = schedule_message.data("start");
                var end             = schedule_message.data("end");
                var late_booking    = schedule_message.data("late_booking");

                // show selected time slot
                if (response.schedule_type !=="multipleslot") {

                    var start_time  = wpc_time_format == 'H:i' ? convert_time12to24( wpc_start_time ) : convert_time24to12( wpc_start_time );
                    var end_time    = wpc_time_format == 'H:i' ? convert_time12to24( wpc_end_time ) : convert_time24to12( wpc_end_time );

                    if ( typeof start_time !==":undefined" &&  start_time !=="" && typeof end_time !==":undefined" &&  end_time !=="" ) {
                        schedule_message.css('display','block').html( start+" "+ start_time +"."+" "+end+" "+  end_time +". "+late_booking );
                    }
                }
                else {

                    if (response.response_type =="error") {
                        param_obj.wpc_error_message.css('display','block').html( param_obj.no_schedule_message );

                        return;
                    }

                    var message = "";

                    if ( response.multi_start_time.length > 0) {

                        // send multi slot time to check block validation
                        multi_schedule = {  start : response.multi_start_time , end : response.multi_end_time };

                        for (let index = 0; index < response.multi_start_time.length; index++) {
                            var start_shce  = response.multi_start_time[index];
                            var end_shce    = response.multi_end_time[index];
                            var schedule_no    = response.multi_schedule_name[index];

                            var start_time  = wpc_time_format == 'H:i' ? convert_time12to24( start_shce ) :  start_shce ;
                            var end_time    = wpc_time_format == 'H:i' ? convert_time12to24( end_shce ) :  end_shce ;

                            if ( start_time !==":undefined" &&  start_time !=="" && end_time !==":undefined" &&  end_time !=="" ) {                                
                                message    += "<span><strong>"+ schedule_no +"</strong> "+ start +" "+ start_time +" "+end+" "+end_time+"</span>";
                            }
                        }
                        var late_booking_message = late_booking !=="" ? "<span>"+ late_booking +"</span>" : "";
                        schedule_message.css('display','block').html( message + late_booking_message  );

                    }
                }

            }
            else{
                param_obj.wpc_error_message.css('display','block').html( param_obj.no_schedule_message );
            }
        }

    }
    else {
        $('#wpc_booking_date').removeClass("wpc_booking_error");
        // Show message that there is no schedule
        param_obj.wpc_error_message.css('display','block').html( param_obj.no_schedule_message );

    }

    return { wpc_start_time : wpc_start_time , wpc_end_time : wpc_end_time , multislot: multi_schedule }
}

/*
* Reservation form multislot seat capacity option generate
*/
function week_diff_seat_capacity_options_generate($, wpc_booking_form_data){
    if( wpc_booking_form_data.reser_multi_schedule == "on" ){

        let selected_date = moment( $('.wpc_check_booking_date').attr('data-wpc_check_booking_date') ).format('ddd');

        let wpc_format_time = 'HH:mm';
        if (wpc_booking_form_data.wpc_time_format == '24') {
            wpc_format_time = ['HH:mm'];
        }else{
            wpc_format_time = ["h:mm A"];
        }

        let wpc_from_time = moment( $('#wpc_from_time').val(), wpc_format_time );

        var seat_count = 0;

        let get_seat_capacity = new Promise( (resolve, reject) => {
            //check if different weekday based multi schedule is available or not
            if( Object.keys(wpc_booking_form_data.weekly_multi_diff_times).length > 0 ){
                //get the keys of the selected date array i.e. start_time, end_time, seat_capacity key
                const seat_capacity_by_day = Object.keys(wpc_booking_form_data.weekly_multi_diff_times)
                    .filter(key => selected_date.includes(key))
                    .reduce((obj, key) => {
                        return wpc_booking_form_data.weekly_multi_diff_times[key];
                    }, {});

                // get the seat_capacity based on start_time and end_time of the multislot    
                seat_capacity_by_day.map( (capacity) => {
                    const startTime = moment( capacity.start_time, ['h:mm A'] );
                    const endTime = moment( capacity.end_time, ['h:mm A'] );
                    if (wpc_from_time.isBetween(startTime-1, endTime+1)) {
                        seat_count = capacity.seat_capacity;
                        resolve();
                        return;
                    }
                });

            }else{

                wpc_booking_form_data.multi_start_time.map( (capacity, key) => {
                    let startTime = moment( wpc_booking_form_data.multi_start_time[key], wpc_format_time);
                    let endTime = moment( wpc_booking_form_data.multi_end_time[key], wpc_format_time);

                    if (wpc_from_time.isBetween(startTime-1, endTime+1)) {
                        seat_count = wpc_booking_form_data.multi_seat_capacity[key];
                        resolve();
                        return;
                    }
                });
            }
        });

        get_seat_capacity.then( (message) => {
            let optionElements = '';
            for(var i = 1; i <= seat_count; i++) {
                optionElements += `<option value="${i}">${i}</option>`;
            }

            $('.party.wpc-reservation-field #wpc-party').addClass('wpc_booking_error')
                .find('option').not(':first').remove().end()
                .after(optionElements);
        });

    }
}

/**
 * Reservation opening and ending time checking 
 */
function reservation_opening_ending_compare( $, params ) {
    var wpc_diff_data = "";
    if ( typeof params !=="undefined" && params.wpc_from_time !== "" && params.wpc_to_time !== "" ) {
        if ( params.wpc_time_format !== 'H:i' ) {
            let from_time = convert_time12to24( params.wpc_from_time );
            let to_time = convert_time12to24( params.wpc_to_time );
            wpc_diff_data = time_diff_for_before_after_equal(from_time, to_time);
        } else {
            wpc_diff_data = time_diff_for_before_after_equal( params.wpc_from_time, params.wpc_to_time );
        }

        var wpc_validate_msg1 = $('.wpc-validate-msg1');
        if (wpc_diff_data == 'late' || wpc_diff_data == 'equal') {
            params.log_message.fadeOut('slow');
            params.log_message.html('');
            $(".wpc_success_message").css("display", "none").html("");
            params.error_message.fadeIn('slow');
            params.error_message.css("display", "block");
            params.error_message.html( params.error_message.data('time_compare') );
            params.from_id.val(""); 
            params.to_id.val("");
            params.from_id.addClass('error wpc_booking_error');
            params.to_id.addClass('error wpc_booking_error');
            wpc_validate_msg1.fadeIn('slow');
            wpc_validate_msg1.html( params.error_message.data('time_compare') );
            button_disable( $ , '.reservation_form_submit', ".wpc_booking_error" , "wpc_reservation_form_disabled" , ".wpc_reservation_table" );   

        } else {
            params.error_message.css("display", "none");
            wpc_validate_msg1.css("display", "none");
            wpc_validate_msg1.html(' ');
            params.error_message.html('');

            params.from_id.removeClass('error wpc_booking_error');
            params.to_id.removeClass('error wpc_booking_error');
        }
    }
}

//====================== Reservation form actions end ================================= //

// check if start time is before current time or not
function check_time_range_validation( start_time , end_time , selected_day , time_format ) {
    var flag            = false;
    var start           = start_time;
    var end             = end_time;
    var now_time        = moment(new Date()).format("HH:mm");    
    var current_time    = moment.duration( now_time ).asSeconds();

    start   = convert_time12to24(start_time);
    end     = convert_time12to24(end_time);

    start           = moment.duration(start).asSeconds();
    end             = moment.duration(end).asSeconds();

    var today       = moment(new Date()).format("YYYY-MM-DD");
    var select      = wpc_flatpicker_date_change( selected_day , "Y-m-d" );

    if ( ( today == select ) &&  moment(start).isBefore(moment(current_time)) && moment(current_time).isBefore(moment(end)) ){
        flag            = "start_from_current";
    }
    
    else if ( ( today == select ) && ( moment(end).isBefore(moment(current_time)) ) ) {
        flag = "disable_time";
        end = end + 2
    }
    
    return {flag : flag , end_time : end };
}

/**
 * All reservation action
 */
 function reservation_form_actions( $ , obj ) {
    // declare class 
    var from_time = $('#wpc_from_time');
    var to_time   = $('#wpc_to_time');

    // get data from enqueue
    var wpc_booking_form_data;

    var wpc_date_format         = 'Y-m-d';

    var wpc_time_format         = 'H:i';
    var no_schedule_message     = ''; // No schedule is set from admin
    var disable_weekly_arr      = [];
    var step                    = 30;
    var is_pro_active           = false;

		var wpc_ajax_url = "";
		if ( typeof wpc_form_client_data !== "undefined" && wpc_form_client_data !== null ) {
				var client_data = JSON.parse(wpc_form_client_data);
				var wpc_ajax_url= ( client_data !== null &&  typeof client_data.wpc_ajax_url !== "undefined" && client_data.wpc_ajax_url !==null ) ? client_data.wpc_ajax_url : "" ;
		}

    if (typeof obj.wpc_form_client_data !== "undefined") {

        var wpc_form_data =  obj.wpc_form_client_data ;
        if ( typeof wpc_form_data ==="undefined" ) {
            wpc_booking_form_data = null;
        }else{
            wpc_booking_form_data = wpc_form_data;
            no_schedule_message   = wpc_booking_form_data !== null ? wpc_booking_form_data.no_schedule_message : "No schedule is set from admin";
            is_pro_active         = wpc_booking_form_data !== null ? wpc_booking_form_data.is_pro_active :  false ;
        }
    }
    // time format
    if (wpc_booking_form_data === null  ) {

        wpc_time_format = 'H:i';
        wpc_date_format = 'Y-m-d';
    }
    else {
        step                =  wpc_booking_form_data.reserv_time_interval;
        if (typeof wpc_booking_form_data.wpc_time_format == "undefined" || wpc_booking_form_data.wpc_time_format == null || wpc_booking_form_data.wpc_time_format == "") {
            wpc_time_format = 'H:i';
        } else {
            wpc_time_format = wpc_booking_form_data.wpc_time_format;
        }
        // date format
        if (wpc_booking_form_data.wpc_date_format != "") {
            wpc_date_format = wpc_booking_form_data.wpc_date_format;
        } else {
            wpc_date_format = 'Y-m-d'
        }

        // set no schedule message
        if ( wpc_booking_form_data.reserve_dynamic_message !=="" ) {
            no_schedule_message = wpc_booking_form_data.reserve_dynamic_message;
        }
        if (typeof wpc_booking_form_data.wpc_weekly_schedule !== "undefined" &&  wpc_booking_form_data.wpc_weekly_schedule !== "" && wpc_booking_form_data.reser_multi_schedule ==="") {

            var get_weekly_ar  = get_weekly_schedule(wpc_booking_form_data.wpc_weekly_schedule );
            disable_weekly_arr = get_weekly_day_no( get_weekly_ar );
        }else if ( wpc_booking_form_data.reser_multi_schedule ==="on" && typeof wpc_booking_form_data.weekly_multi_diff_times !== "undefined" && wpc_booking_form_data.weekly_multi_diff_times !== "") {
            disable_weekly_arr = get_weekly_day_no( Object.keys(wpc_booking_form_data.weekly_multi_diff_times) );
        }
    }

    var wpc_start_time      = '';
    var wpc_end_time        = '';
    var multi_schedule      = { start : "" , end : "" };

    var wpc_error_message   = $('.wpc_error_message');

    //  from time
    from_time.timepicker({
        timeFormat: wpc_time_format,
        dynamic: true,
        listWidth: 1,
        step: step, // 30 minutes.
				disableTextInput: true,
    });

    [from_time,to_time].map((item,index)=>{
        (item).on('focus',function(e){
            var get_date = $('#wpc_booking_date').val();
            get_date = changing_format(get_date, wpc_date_format );

            if ( get_date !=="" ) {

                var param_obj = {
                    wpc_error_message       : $('.wpc_error_message'),
                    selectedDates           : [new Date(get_date)],
                    wpc_booking_form_data   : wpc_booking_form_data,
                    wpc_time_format         : wpc_time_format,
                    from_time               : from_time,
                    to_time                 : to_time,
                    no_schedule_message     : no_schedule_message,
                }
                get_time_range_based_on_date( $ , param_obj , obj );

            }

        });
    });

    from_time.on('changeTime',function(){
        //check for 00 time
        reserv_time_picker( $(this) , wpc_time_format )
        // check if date is selected
        check_date_field($, wpc_error_message , from_time , to_time  );

        /********************** 
        // check late-booking 
        *************************/
        var input_value = $(this).val();

        if ( input_value !== null) {
            // the input field
            var selected_time = $(this).val();

            // custom event for get time using for react
            const startTimeEvent = new CustomEvent("getCalendarFromTime",  {
                detail: { name:  selected_time }
            });
                // To trigger the Event
            document.dispatchEvent(startTimeEvent);

            if ( typeof wpc_booking_form_data !== null ) {
							// check seat capacity
							if ( is_pro_active == true ) {
								var get_date = $('#wpc_booking_date').val();
								var wpc_booking_select_date = changing_format(get_date, wpc_date_format );
									check_seat_capacity( $ , wpc_ajax_url , wpc_booking_select_date , input_value );
							}

                var wpc_late_bookings = wpc_booking_form_data.wpc_late_bookings;
                // late bookings
                if ( wpc_end_time !== 'undefined') {
                    wpc_end_time    = convert24_format(wpc_end_time);
                    selected_time   = convert24_format(selected_time);
                }

                if (typeof wpc_late_bookings !== 'undefinded' && wpc_late_bookings == '15') {
                    var last_booking_time = time_diff(wpc_end_time, "00:14");
                    if (selected_time !== '' && selected_time !== 'undefined') {
                        wpc_check_late_booking( $ , selected_time, last_booking_time, 15 , from_time , wpc_end_time , wpc_time_format , $("#wpc_to_time") );
                    }
                } else if (typeof wpc_late_bookings !== 'undefinded' && wpc_late_bookings == '30') {

                    var last_booking_time = time_diff(wpc_end_time, "00:29");
                    if (selected_time !== '' && selected_time !== 'undefined') {
                        wpc_check_late_booking( $ ,selected_time, last_booking_time, 30 , from_time , wpc_end_time, wpc_time_format, $("#wpc_to_time")  );
                    }
                } else if (wpc_late_bookings != 'undefinded' && wpc_late_bookings == '45' ) {
                    var last_booking_time = time_diff(wpc_end_time, "00:44");
                    if ( selected_time !== '' && selected_time !== 'undefined' ) {
                        wpc_check_late_booking($, selected_time, last_booking_time, 45 , from_time , wpc_end_time , wpc_time_format, $("#wpc_to_time")   );
                    }
                } else {
                    from_time.removeClass("wpc_booking_error");
                    button_disable( $ , '.reservation_form_submit', ".wpc_booking_error" , "wpc_reservation_form_disabled" , ".wpc_reservation_table" );
                }
                /* WeekDay multislot seat capacity variation for reservation form Guest Number field */
                week_diff_seat_capacity_options_generate($, wpc_booking_form_data)
            }
            else {
                from_time.removeClass("wpc_booking_error");
            }
        }

        if ( typeof wpc_from_time !== "undefined" && typeof wpc_to_time !== "undefined"  &&  $(this).val().length > 1  && $("#wpc_to_time").val().length >1 ) {
            var obj = {
                from_id         : $("#wpc_from_time"),
                to_id           : $("#wpc_to_time"),
                wpc_from_time   : input_value,
                wpc_to_time     : $("#wpc_to_time").val(),
                wpc_time_format : wpc_booking_form_data.wpc_time_format,
                log_message     : $('.wpc_log_message'),
                error_message   : wpc_error_message,
            };
            // compare from and to time
            reservation_opening_ending_compare( $, obj );

        }

        // multi slot time schedule validation
        if ( multi_schedule.start !=="" ) {
            multislot_time_range_validation( $ , multi_schedule , input_value , wpc_booking_form_data.wpc_time_format );
        }

    });

    //  To
    to_time.timepicker({
        timeFormat  : wpc_time_format,
        listWidth   : 1,
        step        : step,
        dynamic     : true,
				disableTextInput: true,
    });

    to_time.on('changeTime',function(){
        reserv_time_picker( $(this), wpc_time_format )
        // check if date is selected
        check_date_field( $, wpc_error_message , from_time , to_time );
        var input_value     = $(this).val();
        if ( input_value !== null) {
            // custom event for get time using for react
            const endTimeEvent = new CustomEvent("getCalendarToTime",  {
                detail: { name:  input_value }
            });
                // To trigger the Event
            document.dispatchEvent(endTimeEvent);

            to_time.removeClass("wpc_booking_error");
            button_disable( $ , '.reservation_form_submit', ".wpc_booking_error" , "wpc_reservation_form_disabled" , ".wpc_reservation_table" );
        }

        if ( typeof wpc_from_time !== "undefined" && typeof wpc_to_time !== "undefined"  && $(this).val().length > 1 && $("#wpc_from_time").val().length > 1  ) {
            var obj = {
                from_id         : $("#wpc_from_time"),
                to_id           : $("#wpc_to_time"),
                wpc_from_time   : $("#wpc_from_time").val(),
                wpc_to_time     : input_value,
                wpc_time_format : wpc_booking_form_data.wpc_time_format,
                log_message     : $('.wpc_log_message'),
                error_message   : $('.wpc_error_message'),
            };
            // compare from and to time 
            reservation_opening_ending_compare( $, obj );
        }

        // multi slot time schedule validation
        if ( multi_schedule.start !=="" ) {
            multislot_time_range_validation( $ , multi_schedule , input_value , wpc_booking_form_data.wpc_time_format );
        }

    });

    /**********************
    // early bookings
    *************************/

    var reserv_form_local = "en";
    if ( wpc_booking_form_data !== null ) {
        var wpc_early_bookings  = wpc_booking_form_data.wpc_early_bookings;
        var wpc_max_day         = '';
        reserv_form_local       = typeof wpc_booking_form_data.reserv_form_local !=="undefined" ? wpc_booking_form_data.reserv_form_local : "en";

        wpc_max_day = wpc_booking_form_data.wpc_max_day ? new Date(wpc_booking_form_data.wpc_max_day) : null;

    }

    // Change from and to time based on date .
    if ( obj.wpc_booking_date.length > 0) {
        // disabling date
        var disable_date = [];
        if(wpc_booking_form_data !== null && typeof wpc_booking_form_data.wpc_holiday_date !== 'undefined' ){
            if( wpc_booking_form_data.wpc_holiday_date !== ""){
                disable_date = wpc_booking_form_data.wpc_holiday_date;
            }
        }

        var disable_weekly_data = function name(date) {
            if ( wpc_booking_form_data === null || (typeof disable_weekly_arr == 'undefined' || disable_weekly_arr.length === 0 ) ) {
                return false;
            } else {
                var selected_date = date.toLocaleDateString('en-CA');
                var exception_date_disable = ( wpc_booking_form_data !== null && typeof wpc_booking_form_data.wpc_exception_date !=="undefined" ) ? wpc_booking_form_data.wpc_exception_date : [];
                return ( ($.inArray( date.getDay() , disable_weekly_arr ) == -1 ) && ($.inArray( selected_date , exception_date_disable ) == -1 ) );
            }
        }

        disable_date.push(disable_weekly_data);

        obj.wpc_booking_date.flatpickr({
            dateFormat  : wpc_date_format,
            minDate     : "today",
            maxDate     : wpc_max_day,
            position    : "below",
            inline      : obj.inline_value,
            locale      : reserv_form_local,
            disable     : disable_date,
            onChange    : function (selectedDates, dateStr, instance) {

                var selected_date = wpc_flatpicker_date_change(selectedDates, "Y-m-d");
                obj.wpc_booking_date.attr("data-wpc_booking_date",selected_date);

              if ( is_pro_active ) {
								var check_start_time = $('#wpc_from_time').val();
								// check seat capacity
								if ( is_pro_active == true && check_start_time !=="" ) {
										check_seat_capacity( $ , wpc_ajax_url , selected_date , $('#wpc_from_time').val() );
								}
                	// custom event for get date in react
                 // To assign event
                const startEvent = new CustomEvent("getCalendarDate",  {
                    detail: { name:  selected_date }
                });
                // To trigger the Event
                document.dispatchEvent(startEvent);
              }

							wpc_error_message.css('display','none').html( "" );

							var param_obj = {
									wpc_error_message       : wpc_error_message,
									selectedDates           : selectedDates,
									wpc_booking_form_data   : wpc_booking_form_data,
									wpc_time_format         : wpc_time_format,
									from_time               : from_time,
									to_time                 : to_time,
									no_schedule_message     : no_schedule_message,
							}

							var data = get_time_range_based_on_date( $ , param_obj , obj );

							wpc_start_time  = data.wpc_start_time;
							wpc_end_time    = data.wpc_end_time;
							wpc_end_time    = data.wpc_end_time;
							multi_schedule  = { start : data.multislot.start ,end: data.multislot.end }

            }

        });

    }

    return true;
}

function check_seat_capacity($,...res) {

	// check selected date seat capacity
	if ( typeof res[0] === "undefined" ) {
			return;
	}

	var selected_date = typeof res[1] === "undefined" ? '' : res[1];
	var from_time     = typeof res[2] === "undefined" ? '' : res[2];

	var data = {
		action              : 'wpc_seat_capacity',
		selected_date       : selected_date,
		from_time           : from_time,
		wpc_action          : 'wpc_seat_status',
	}

	$.ajax({
				url: res[0],
				method: 'post',
				data: data,
				success: function (response) {
						if (typeof response.data !== "undefined" && typeof response.data.data !== "undefined" ) {
								if ( response.data.data.status == "closed" ) {

										$(".wpc_success_message").css('display','none').html("");

										$('.wpc_error_message').css('display','block').html( response.data.data.message );
										$("#wpc_from_time").val("");
										$("#wpc_to_time").val("");
										return;
								}else{
									var guest_size = response.data.data.capacity;
									$("#wpc-party").empty();
									$('<option>').val('').text('Select number of guests').appendTo('#wpc-party');
									for (let index = 1; index <= guest_size; index++) {
										$('<option>').val(index).text(index).appendTo('#wpc-party');
									}
								}
						}
				},
		});
}

;/*!
  * Bootstrap v4.0.0 (https://getbootstrap.com)
  * Copyright 2011-2018 The Bootstrap Authors (https://github.com/twbs/bootstrap/graphs/contributors)
  * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
  */
!function(t,e){"object"==typeof exports&&"undefined"!=typeof module?e(exports,require("jquery"),require("popper.js")):"function"==typeof define&&define.amd?define(["exports","jquery","popper.js"],e):e(t.bootstrap={},t.jQuery,t.Popper)}(this,function(t,e,n){"use strict";function i(t,e){for(var n=0;n<e.length;n++){var i=e[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(t,i.key,i)}}function s(t,e,n){return e&&i(t.prototype,e),n&&i(t,n),t}function r(){return(r=Object.assign||function(t){for(var e=1;e<arguments.length;e++){var n=arguments[e];for(var i in n)Object.prototype.hasOwnProperty.call(n,i)&&(t[i]=n[i])}return t}).apply(this,arguments)}e=e&&e.hasOwnProperty("default")?e.default:e,n=n&&n.hasOwnProperty("default")?n.default:n;var o,a,l,h,c,u,f,d,_,g,p,m,v,E,T,y,C,I,A,b,D,S,w,N,O,k,P=function(t){var e=!1;function n(e){var n=this,s=!1;return t(this).one(i.TRANSITION_END,function(){s=!0}),setTimeout(function(){s||i.triggerTransitionEnd(n)},e),this}var i={TRANSITION_END:"bsTransitionEnd",getUID:function(t){do{t+=~~(1e6*Math.random())}while(document.getElementById(t));return t},getSelectorFromElement:function(e){var n,i=e.getAttribute("data-target");i&&"#"!==i||(i=e.getAttribute("href")||""),"#"===i.charAt(0)&&(n=i,i=n="function"==typeof t.escapeSelector?t.escapeSelector(n).substr(1):n.replace(/(:|\.|\[|\]|,|=|@)/g,"\\$1"));try{return t(document).find(i).length>0?i:null}catch(t){return null}},reflow:function(t){return t.offsetHeight},triggerTransitionEnd:function(n){t(n).trigger(e.end)},supportsTransitionEnd:function(){return Boolean(e)},isElement:function(t){return(t[0]||t).nodeType},typeCheckConfig:function(t,e,n){for(var s in n)if(Object.prototype.hasOwnProperty.call(n,s)){var r=n[s],o=e[s],a=o&&i.isElement(o)?"element":(l=o,{}.toString.call(l).match(/\s([a-zA-Z]+)/)[1].toLowerCase());if(!new RegExp(r).test(a))throw new Error(t.toUpperCase()+': Option "'+s+'" provided type "'+a+'" but expected type "'+r+'".')}var l}};return e=("undefined"==typeof window||!window.QUnit)&&{end:"transitionend"},t.fn.emulateTransitionEnd=n,i.supportsTransitionEnd()&&(t.event.special[i.TRANSITION_END]={bindType:e.end,delegateType:e.end,handle:function(e){if(t(e.target).is(this))return e.handleObj.handler.apply(this,arguments)}}),i}(e),L=(a="alert",h="."+(l="bs.alert"),c=(o=e).fn[a],u={CLOSE:"close"+h,CLOSED:"closed"+h,CLICK_DATA_API:"click"+h+".data-api"},f="alert",d="fade",_="show",g=function(){function t(t){this._element=t}var e=t.prototype;return e.close=function(t){t=t||this._element;var e=this._getRootElement(t);this._triggerCloseEvent(e).isDefaultPrevented()||this._removeElement(e)},e.dispose=function(){o.removeData(this._element,l),this._element=null},e._getRootElement=function(t){var e=P.getSelectorFromElement(t),n=!1;return e&&(n=o(e)[0]),n||(n=o(t).closest("."+f)[0]),n},e._triggerCloseEvent=function(t){var e=o.Event(u.CLOSE);return o(t).trigger(e),e},e._removeElement=function(t){var e=this;o(t).removeClass(_),P.supportsTransitionEnd()&&o(t).hasClass(d)?o(t).one(P.TRANSITION_END,function(n){return e._destroyElement(t,n)}).emulateTransitionEnd(150):this._destroyElement(t)},e._destroyElement=function(t){o(t).detach().trigger(u.CLOSED).remove()},t._jQueryInterface=function(e){return this.each(function(){var n=o(this),i=n.data(l);i||(i=new t(this),n.data(l,i)),"close"===e&&i[e](this)})},t._handleDismiss=function(t){return function(e){e&&e.preventDefault(),t.close(this)}},s(t,null,[{key:"VERSION",get:function(){return"4.0.0"}}]),t}(),o(document).on(u.CLICK_DATA_API,'[data-dismiss="alert"]',g._handleDismiss(new g)),o.fn[a]=g._jQueryInterface,o.fn[a].Constructor=g,o.fn[a].noConflict=function(){return o.fn[a]=c,g._jQueryInterface},g),R=(m="button",E="."+(v="bs.button"),T=".data-api",y=(p=e).fn[m],C="active",I="btn",A="focus",b='[data-toggle^="button"]',D='[data-toggle="buttons"]',S="input",w=".active",N=".btn",O={CLICK_DATA_API:"click"+E+T,FOCUS_BLUR_DATA_API:"focus"+E+T+" blur"+E+T},k=function(){function t(t){this._element=t}var e=t.prototype;return e.toggle=function(){var t=!0,e=!0,n=p(this._element).closest(D)[0];if(n){var i=p(this._element).find(S)[0];if(i){if("radio"===i.type)if(i.checked&&p(this._element).hasClass(C))t=!1;else{var s=p(n).find(w)[0];s&&p(s).removeClass(C)}if(t){if(i.hasAttribute("disabled")||n.hasAttribute("disabled")||i.classList.contains("disabled")||n.classList.contains("disabled"))return;i.checked=!p(this._element).hasClass(C),p(i).trigger("change")}i.focus(),e=!1}}e&&this._element.setAttribute("aria-pressed",!p(this._element).hasClass(C)),t&&p(this._element).toggleClass(C)},e.dispose=function(){p.removeData(this._element,v),this._element=null},t._jQueryInterface=function(e){return this.each(function(){var n=p(this).data(v);n||(n=new t(this),p(this).data(v,n)),"toggle"===e&&n[e]()})},s(t,null,[{key:"VERSION",get:function(){return"4.0.0"}}]),t}(),p(document).on(O.CLICK_DATA_API,b,function(t){t.preventDefault();var e=t.target;p(e).hasClass(I)||(e=p(e).closest(N)),k._jQueryInterface.call(p(e),"toggle")}).on(O.FOCUS_BLUR_DATA_API,b,function(t){var e=p(t.target).closest(N)[0];p(e).toggleClass(A,/^focus(in)?$/.test(t.type))}),p.fn[m]=k._jQueryInterface,p.fn[m].Constructor=k,p.fn[m].noConflict=function(){return p.fn[m]=y,k._jQueryInterface},k),j=function(t){var e="carousel",n="bs.carousel",i="."+n,o=t.fn[e],a={interval:5e3,keyboard:!0,slide:!1,pause:"hover",wrap:!0},l={interval:"(number|boolean)",keyboard:"boolean",slide:"(boolean|string)",pause:"(string|boolean)",wrap:"boolean"},h="next",c="prev",u="left",f="right",d={SLIDE:"slide"+i,SLID:"slid"+i,KEYDOWN:"keydown"+i,MOUSEENTER:"mouseenter"+i,MOUSELEAVE:"mouseleave"+i,TOUCHEND:"touchend"+i,LOAD_DATA_API:"load"+i+".data-api",CLICK_DATA_API:"click"+i+".data-api"},_="carousel",g="active",p="slide",m="carousel-item-right",v="carousel-item-left",E="carousel-item-next",T="carousel-item-prev",y={ACTIVE:".active",ACTIVE_ITEM:".active.carousel-item",ITEM:".carousel-item",NEXT_PREV:".carousel-item-next, .carousel-item-prev",INDICATORS:".carousel-indicators",DATA_SLIDE:"[data-slide], [data-slide-to]",DATA_RIDE:'[data-ride="carousel"]'},C=function(){function o(e,n){this._items=null,this._interval=null,this._activeElement=null,this._isPaused=!1,this._isSliding=!1,this.touchTimeout=null,this._config=this._getConfig(n),this._element=t(e)[0],this._indicatorsElement=t(this._element).find(y.INDICATORS)[0],this._addEventListeners()}var C=o.prototype;return C.next=function(){this._isSliding||this._slide(h)},C.nextWhenVisible=function(){!document.hidden&&t(this._element).is(":visible")&&"hidden"!==t(this._element).css("visibility")&&this.next()},C.prev=function(){this._isSliding||this._slide(c)},C.pause=function(e){e||(this._isPaused=!0),t(this._element).find(y.NEXT_PREV)[0]&&P.supportsTransitionEnd()&&(P.triggerTransitionEnd(this._element),this.cycle(!0)),clearInterval(this._interval),this._interval=null},C.cycle=function(t){t||(this._isPaused=!1),this._interval&&(clearInterval(this._interval),this._interval=null),this._config.interval&&!this._isPaused&&(this._interval=setInterval((document.visibilityState?this.nextWhenVisible:this.next).bind(this),this._config.interval))},C.to=function(e){var n=this;this._activeElement=t(this._element).find(y.ACTIVE_ITEM)[0];var i=this._getItemIndex(this._activeElement);if(!(e>this._items.length-1||e<0))if(this._isSliding)t(this._element).one(d.SLID,function(){return n.to(e)});else{if(i===e)return this.pause(),void this.cycle();var s=e>i?h:c;this._slide(s,this._items[e])}},C.dispose=function(){t(this._element).off(i),t.removeData(this._element,n),this._items=null,this._config=null,this._element=null,this._interval=null,this._isPaused=null,this._isSliding=null,this._activeElement=null,this._indicatorsElement=null},C._getConfig=function(t){return t=r({},a,t),P.typeCheckConfig(e,t,l),t},C._addEventListeners=function(){var e=this;this._config.keyboard&&t(this._element).on(d.KEYDOWN,function(t){return e._keydown(t)}),"hover"===this._config.pause&&(t(this._element).on(d.MOUSEENTER,function(t){return e.pause(t)}).on(d.MOUSELEAVE,function(t){return e.cycle(t)}),"ontouchstart"in document.documentElement&&t(this._element).on(d.TOUCHEND,function(){e.pause(),e.touchTimeout&&clearTimeout(e.touchTimeout),e.touchTimeout=setTimeout(function(t){return e.cycle(t)},500+e._config.interval)}))},C._keydown=function(t){if(!/input|textarea/i.test(t.target.tagName))switch(t.which){case 37:t.preventDefault(),this.prev();break;case 39:t.preventDefault(),this.next()}},C._getItemIndex=function(e){return this._items=t.makeArray(t(e).parent().find(y.ITEM)),this._items.indexOf(e)},C._getItemByDirection=function(t,e){var n=t===h,i=t===c,s=this._getItemIndex(e),r=this._items.length-1;if((i&&0===s||n&&s===r)&&!this._config.wrap)return e;var o=(s+(t===c?-1:1))%this._items.length;return-1===o?this._items[this._items.length-1]:this._items[o]},C._triggerSlideEvent=function(e,n){var i=this._getItemIndex(e),s=this._getItemIndex(t(this._element).find(y.ACTIVE_ITEM)[0]),r=t.Event(d.SLIDE,{relatedTarget:e,direction:n,from:s,to:i});return t(this._element).trigger(r),r},C._setActiveIndicatorElement=function(e){if(this._indicatorsElement){t(this._indicatorsElement).find(y.ACTIVE).removeClass(g);var n=this._indicatorsElement.children[this._getItemIndex(e)];n&&t(n).addClass(g)}},C._slide=function(e,n){var i,s,r,o=this,a=t(this._element).find(y.ACTIVE_ITEM)[0],l=this._getItemIndex(a),c=n||a&&this._getItemByDirection(e,a),_=this._getItemIndex(c),C=Boolean(this._interval);if(e===h?(i=v,s=E,r=u):(i=m,s=T,r=f),c&&t(c).hasClass(g))this._isSliding=!1;else if(!this._triggerSlideEvent(c,r).isDefaultPrevented()&&a&&c){this._isSliding=!0,C&&this.pause(),this._setActiveIndicatorElement(c);var I=t.Event(d.SLID,{relatedTarget:c,direction:r,from:l,to:_});P.supportsTransitionEnd()&&t(this._element).hasClass(p)?(t(c).addClass(s),P.reflow(c),t(a).addClass(i),t(c).addClass(i),t(a).one(P.TRANSITION_END,function(){t(c).removeClass(i+" "+s).addClass(g),t(a).removeClass(g+" "+s+" "+i),o._isSliding=!1,setTimeout(function(){return t(o._element).trigger(I)},0)}).emulateTransitionEnd(600)):(t(a).removeClass(g),t(c).addClass(g),this._isSliding=!1,t(this._element).trigger(I)),C&&this.cycle()}},o._jQueryInterface=function(e){return this.each(function(){var i=t(this).data(n),s=r({},a,t(this).data());"object"==typeof e&&(s=r({},s,e));var l="string"==typeof e?e:s.slide;if(i||(i=new o(this,s),t(this).data(n,i)),"number"==typeof e)i.to(e);else if("string"==typeof l){if("undefined"==typeof i[l])throw new TypeError('No method named "'+l+'"');i[l]()}else s.interval&&(i.pause(),i.cycle())})},o._dataApiClickHandler=function(e){var i=P.getSelectorFromElement(this);if(i){var s=t(i)[0];if(s&&t(s).hasClass(_)){var a=r({},t(s).data(),t(this).data()),l=this.getAttribute("data-slide-to");l&&(a.interval=!1),o._jQueryInterface.call(t(s),a),l&&t(s).data(n).to(l),e.preventDefault()}}},s(o,null,[{key:"VERSION",get:function(){return"4.0.0"}},{key:"Default",get:function(){return a}}]),o}();return t(document).on(d.CLICK_DATA_API,y.DATA_SLIDE,C._dataApiClickHandler),t(window).on(d.LOAD_DATA_API,function(){t(y.DATA_RIDE).each(function(){var e=t(this);C._jQueryInterface.call(e,e.data())})}),t.fn[e]=C._jQueryInterface,t.fn[e].Constructor=C,t.fn[e].noConflict=function(){return t.fn[e]=o,C._jQueryInterface},C}(e),H=function(t){var e="collapse",n="bs.collapse",i="."+n,o=t.fn[e],a={toggle:!0,parent:""},l={toggle:"boolean",parent:"(string|element)"},h={SHOW:"show"+i,SHOWN:"shown"+i,HIDE:"hide"+i,HIDDEN:"hidden"+i,CLICK_DATA_API:"click"+i+".data-api"},c="show",u="collapse",f="collapsing",d="collapsed",_="width",g="height",p={ACTIVES:".show, .collapsing",DATA_TOGGLE:'[data-toggle="collapse"]'},m=function(){function i(e,n){this._isTransitioning=!1,this._element=e,this._config=this._getConfig(n),this._triggerArray=t.makeArray(t('[data-toggle="collapse"][href="#'+e.id+'"],[data-toggle="collapse"][data-target="#'+e.id+'"]'));for(var i=t(p.DATA_TOGGLE),s=0;s<i.length;s++){var r=i[s],o=P.getSelectorFromElement(r);null!==o&&t(o).filter(e).length>0&&(this._selector=o,this._triggerArray.push(r))}this._parent=this._config.parent?this._getParent():null,this._config.parent||this._addAriaAndCollapsedClass(this._element,this._triggerArray),this._config.toggle&&this.toggle()}var o=i.prototype;return o.toggle=function(){t(this._element).hasClass(c)?this.hide():this.show()},o.show=function(){var e,s,r=this;if(!this._isTransitioning&&!t(this._element).hasClass(c)&&(this._parent&&0===(e=t.makeArray(t(this._parent).find(p.ACTIVES).filter('[data-parent="'+this._config.parent+'"]'))).length&&(e=null),!(e&&(s=t(e).not(this._selector).data(n))&&s._isTransitioning))){var o=t.Event(h.SHOW);if(t(this._element).trigger(o),!o.isDefaultPrevented()){e&&(i._jQueryInterface.call(t(e).not(this._selector),"hide"),s||t(e).data(n,null));var a=this._getDimension();t(this._element).removeClass(u).addClass(f),this._element.style[a]=0,this._triggerArray.length>0&&t(this._triggerArray).removeClass(d).attr("aria-expanded",!0),this.setTransitioning(!0);var l=function(){t(r._element).removeClass(f).addClass(u).addClass(c),r._element.style[a]="",r.setTransitioning(!1),t(r._element).trigger(h.SHOWN)};if(P.supportsTransitionEnd()){var _="scroll"+(a[0].toUpperCase()+a.slice(1));t(this._element).one(P.TRANSITION_END,l).emulateTransitionEnd(600),this._element.style[a]=this._element[_]+"px"}else l()}}},o.hide=function(){var e=this;if(!this._isTransitioning&&t(this._element).hasClass(c)){var n=t.Event(h.HIDE);if(t(this._element).trigger(n),!n.isDefaultPrevented()){var i=this._getDimension();if(this._element.style[i]=this._element.getBoundingClientRect()[i]+"px",P.reflow(this._element),t(this._element).addClass(f).removeClass(u).removeClass(c),this._triggerArray.length>0)for(var s=0;s<this._triggerArray.length;s++){var r=this._triggerArray[s],o=P.getSelectorFromElement(r);if(null!==o)t(o).hasClass(c)||t(r).addClass(d).attr("aria-expanded",!1)}this.setTransitioning(!0);var a=function(){e.setTransitioning(!1),t(e._element).removeClass(f).addClass(u).trigger(h.HIDDEN)};this._element.style[i]="",P.supportsTransitionEnd()?t(this._element).one(P.TRANSITION_END,a).emulateTransitionEnd(600):a()}}},o.setTransitioning=function(t){this._isTransitioning=t},o.dispose=function(){t.removeData(this._element,n),this._config=null,this._parent=null,this._element=null,this._triggerArray=null,this._isTransitioning=null},o._getConfig=function(t){return(t=r({},a,t)).toggle=Boolean(t.toggle),P.typeCheckConfig(e,t,l),t},o._getDimension=function(){return t(this._element).hasClass(_)?_:g},o._getParent=function(){var e=this,n=null;P.isElement(this._config.parent)?(n=this._config.parent,"undefined"!=typeof this._config.parent.jquery&&(n=this._config.parent[0])):n=t(this._config.parent)[0];var s='[data-toggle="collapse"][data-parent="'+this._config.parent+'"]';return t(n).find(s).each(function(t,n){e._addAriaAndCollapsedClass(i._getTargetFromElement(n),[n])}),n},o._addAriaAndCollapsedClass=function(e,n){if(e){var i=t(e).hasClass(c);n.length>0&&t(n).toggleClass(d,!i).attr("aria-expanded",i)}},i._getTargetFromElement=function(e){var n=P.getSelectorFromElement(e);return n?t(n)[0]:null},i._jQueryInterface=function(e){return this.each(function(){var s=t(this),o=s.data(n),l=r({},a,s.data(),"object"==typeof e&&e);if(!o&&l.toggle&&/show|hide/.test(e)&&(l.toggle=!1),o||(o=new i(this,l),s.data(n,o)),"string"==typeof e){if("undefined"==typeof o[e])throw new TypeError('No method named "'+e+'"');o[e]()}})},s(i,null,[{key:"VERSION",get:function(){return"4.0.0"}},{key:"Default",get:function(){return a}}]),i}();return t(document).on(h.CLICK_DATA_API,p.DATA_TOGGLE,function(e){"A"===e.currentTarget.tagName&&e.preventDefault();var i=t(this),s=P.getSelectorFromElement(this);t(s).each(function(){var e=t(this),s=e.data(n)?"toggle":i.data();m._jQueryInterface.call(e,s)})}),t.fn[e]=m._jQueryInterface,t.fn[e].Constructor=m,t.fn[e].noConflict=function(){return t.fn[e]=o,m._jQueryInterface},m}(e),W=function(t){var e="dropdown",i="bs.dropdown",o="."+i,a=".data-api",l=t.fn[e],h=new RegExp("38|40|27"),c={HIDE:"hide"+o,HIDDEN:"hidden"+o,SHOW:"show"+o,SHOWN:"shown"+o,CLICK:"click"+o,CLICK_DATA_API:"click"+o+a,KEYDOWN_DATA_API:"keydown"+o+a,KEYUP_DATA_API:"keyup"+o+a},u="disabled",f="show",d="dropup",_="dropright",g="dropleft",p="dropdown-menu-right",m="dropdown-menu-left",v="position-static",E='[data-toggle="dropdown"]',T=".dropdown form",y=".dropdown-menu",C=".navbar-nav",I=".dropdown-menu .dropdown-item:not(.disabled)",A="top-start",b="top-end",D="bottom-start",S="bottom-end",w="right-start",N="left-start",O={offset:0,flip:!0,boundary:"scrollParent"},k={offset:"(number|string|function)",flip:"boolean",boundary:"(string|element)"},L=function(){function a(t,e){this._element=t,this._popper=null,this._config=this._getConfig(e),this._menu=this._getMenuElement(),this._inNavbar=this._detectNavbar(),this._addEventListeners()}var l=a.prototype;return l.toggle=function(){if(!this._element.disabled&&!t(this._element).hasClass(u)){var e=a._getParentFromElement(this._element),i=t(this._menu).hasClass(f);if(a._clearMenus(),!i){var s={relatedTarget:this._element},r=t.Event(c.SHOW,s);if(t(e).trigger(r),!r.isDefaultPrevented()){if(!this._inNavbar){if("undefined"==typeof n)throw new TypeError("Bootstrap dropdown require Popper.js (https://popper.js.org)");var o=this._element;t(e).hasClass(d)&&(t(this._menu).hasClass(m)||t(this._menu).hasClass(p))&&(o=e),"scrollParent"!==this._config.boundary&&t(e).addClass(v),this._popper=new n(o,this._menu,this._getPopperConfig())}"ontouchstart"in document.documentElement&&0===t(e).closest(C).length&&t("body").children().on("mouseover",null,t.noop),this._element.focus(),this._element.setAttribute("aria-expanded",!0),t(this._menu).toggleClass(f),t(e).toggleClass(f).trigger(t.Event(c.SHOWN,s))}}}},l.dispose=function(){t.removeData(this._element,i),t(this._element).off(o),this._element=null,this._menu=null,null!==this._popper&&(this._popper.destroy(),this._popper=null)},l.update=function(){this._inNavbar=this._detectNavbar(),null!==this._popper&&this._popper.scheduleUpdate()},l._addEventListeners=function(){var e=this;t(this._element).on(c.CLICK,function(t){t.preventDefault(),t.stopPropagation(),e.toggle()})},l._getConfig=function(n){return n=r({},this.constructor.Default,t(this._element).data(),n),P.typeCheckConfig(e,n,this.constructor.DefaultType),n},l._getMenuElement=function(){if(!this._menu){var e=a._getParentFromElement(this._element);this._menu=t(e).find(y)[0]}return this._menu},l._getPlacement=function(){var e=t(this._element).parent(),n=D;return e.hasClass(d)?(n=A,t(this._menu).hasClass(p)&&(n=b)):e.hasClass(_)?n=w:e.hasClass(g)?n=N:t(this._menu).hasClass(p)&&(n=S),n},l._detectNavbar=function(){return t(this._element).closest(".navbar").length>0},l._getPopperConfig=function(){var t=this,e={};return"function"==typeof this._config.offset?e.fn=function(e){return e.offsets=r({},e.offsets,t._config.offset(e.offsets)||{}),e}:e.offset=this._config.offset,{placement:this._getPlacement(),modifiers:{offset:e,flip:{enabled:this._config.flip},preventOverflow:{boundariesElement:this._config.boundary}}}},a._jQueryInterface=function(e){return this.each(function(){var n=t(this).data(i);if(n||(n=new a(this,"object"==typeof e?e:null),t(this).data(i,n)),"string"==typeof e){if("undefined"==typeof n[e])throw new TypeError('No method named "'+e+'"');n[e]()}})},a._clearMenus=function(e){if(!e||3!==e.which&&("keyup"!==e.type||9===e.which))for(var n=t.makeArray(t(E)),s=0;s<n.length;s++){var r=a._getParentFromElement(n[s]),o=t(n[s]).data(i),l={relatedTarget:n[s]};if(o){var h=o._menu;if(t(r).hasClass(f)&&!(e&&("click"===e.type&&/input|textarea/i.test(e.target.tagName)||"keyup"===e.type&&9===e.which)&&t.contains(r,e.target))){var u=t.Event(c.HIDE,l);t(r).trigger(u),u.isDefaultPrevented()||("ontouchstart"in document.documentElement&&t("body").children().off("mouseover",null,t.noop),n[s].setAttribute("aria-expanded","false"),t(h).removeClass(f),t(r).removeClass(f).trigger(t.Event(c.HIDDEN,l)))}}}},a._getParentFromElement=function(e){var n,i=P.getSelectorFromElement(e);return i&&(n=t(i)[0]),n||e.parentNode},a._dataApiKeydownHandler=function(e){if((/input|textarea/i.test(e.target.tagName)?!(32===e.which||27!==e.which&&(40!==e.which&&38!==e.which||t(e.target).closest(y).length)):h.test(e.which))&&(e.preventDefault(),e.stopPropagation(),!this.disabled&&!t(this).hasClass(u))){var n=a._getParentFromElement(this),i=t(n).hasClass(f);if((i||27===e.which&&32===e.which)&&(!i||27!==e.which&&32!==e.which)){var s=t(n).find(I).get();if(0!==s.length){var r=s.indexOf(e.target);38===e.which&&r>0&&r--,40===e.which&&r<s.length-1&&r++,r<0&&(r=0),s[r].focus()}}else{if(27===e.which){var o=t(n).find(E)[0];t(o).trigger("focus")}t(this).trigger("click")}}},s(a,null,[{key:"VERSION",get:function(){return"4.0.0"}},{key:"Default",get:function(){return O}},{key:"DefaultType",get:function(){return k}}]),a}();return t(document).on(c.KEYDOWN_DATA_API,E,L._dataApiKeydownHandler).on(c.KEYDOWN_DATA_API,y,L._dataApiKeydownHandler).on(c.CLICK_DATA_API+" "+c.KEYUP_DATA_API,L._clearMenus).on(c.CLICK_DATA_API,E,function(e){e.preventDefault(),e.stopPropagation(),L._jQueryInterface.call(t(this),"toggle")}).on(c.CLICK_DATA_API,T,function(t){t.stopPropagation()}),t.fn[e]=L._jQueryInterface,t.fn[e].Constructor=L,t.fn[e].noConflict=function(){return t.fn[e]=l,L._jQueryInterface},L}(e),M=function(t){var e="modal",n="bs.modal",i="."+n,o=t.fn.modal,a={backdrop:!0,keyboard:!0,focus:!0,show:!0},l={backdrop:"(boolean|string)",keyboard:"boolean",focus:"boolean",show:"boolean"},h={HIDE:"hide"+i,HIDDEN:"hidden"+i,SHOW:"show"+i,SHOWN:"shown"+i,FOCUSIN:"focusin"+i,RESIZE:"resize"+i,CLICK_DISMISS:"click.dismiss"+i,KEYDOWN_DISMISS:"keydown.dismiss"+i,MOUSEUP_DISMISS:"mouseup.dismiss"+i,MOUSEDOWN_DISMISS:"mousedown.dismiss"+i,CLICK_DATA_API:"click"+i+".data-api"},c="modal-scrollbar-measure",u="modal-backdrop",f="modal-open",d="fade",_="show",g={DIALOG:".modal-dialog",DATA_TOGGLE:'[data-toggle="modal"]',DATA_DISMISS:'[data-dismiss="modal"]',FIXED_CONTENT:".fixed-top, .fixed-bottom, .is-fixed, .sticky-top",STICKY_CONTENT:".sticky-top",NAVBAR_TOGGLER:".navbar-toggler"},p=function(){function o(e,n){this._config=this._getConfig(n),this._element=e,this._dialog=t(e).find(g.DIALOG)[0],this._backdrop=null,this._isShown=!1,this._isBodyOverflowing=!1,this._ignoreBackdropClick=!1,this._originalBodyPadding=0,this._scrollbarWidth=0}var p=o.prototype;return p.toggle=function(t){return this._isShown?this.hide():this.show(t)},p.show=function(e){var n=this;if(!this._isTransitioning&&!this._isShown){P.supportsTransitionEnd()&&t(this._element).hasClass(d)&&(this._isTransitioning=!0);var i=t.Event(h.SHOW,{relatedTarget:e});t(this._element).trigger(i),this._isShown||i.isDefaultPrevented()||(this._isShown=!0,this._checkScrollbar(),this._setScrollbar(),this._adjustDialog(),t(document.body).addClass(f),this._setEscapeEvent(),this._setResizeEvent(),t(this._element).on(h.CLICK_DISMISS,g.DATA_DISMISS,function(t){return n.hide(t)}),t(this._dialog).on(h.MOUSEDOWN_DISMISS,function(){t(n._element).one(h.MOUSEUP_DISMISS,function(e){t(e.target).is(n._element)&&(n._ignoreBackdropClick=!0)})}),this._showBackdrop(function(){return n._showElement(e)}))}},p.hide=function(e){var n=this;if(e&&e.preventDefault(),!this._isTransitioning&&this._isShown){var i=t.Event(h.HIDE);if(t(this._element).trigger(i),this._isShown&&!i.isDefaultPrevented()){this._isShown=!1;var s=P.supportsTransitionEnd()&&t(this._element).hasClass(d);s&&(this._isTransitioning=!0),this._setEscapeEvent(),this._setResizeEvent(),t(document).off(h.FOCUSIN),t(this._element).removeClass(_),t(this._element).off(h.CLICK_DISMISS),t(this._dialog).off(h.MOUSEDOWN_DISMISS),s?t(this._element).one(P.TRANSITION_END,function(t){return n._hideModal(t)}).emulateTransitionEnd(300):this._hideModal()}}},p.dispose=function(){t.removeData(this._element,n),t(window,document,this._element,this._backdrop).off(i),this._config=null,this._element=null,this._dialog=null,this._backdrop=null,this._isShown=null,this._isBodyOverflowing=null,this._ignoreBackdropClick=null,this._scrollbarWidth=null},p.handleUpdate=function(){this._adjustDialog()},p._getConfig=function(t){return t=r({},a,t),P.typeCheckConfig(e,t,l),t},p._showElement=function(e){var n=this,i=P.supportsTransitionEnd()&&t(this._element).hasClass(d);this._element.parentNode&&this._element.parentNode.nodeType===Node.ELEMENT_NODE||document.body.appendChild(this._element),this._element.style.display="block",this._element.removeAttribute("aria-hidden"),this._element.scrollTop=0,i&&P.reflow(this._element),t(this._element).addClass(_),this._config.focus&&this._enforceFocus();var s=t.Event(h.SHOWN,{relatedTarget:e}),r=function(){n._config.focus&&n._element.focus(),n._isTransitioning=!1,t(n._element).trigger(s)};i?t(this._dialog).one(P.TRANSITION_END,r).emulateTransitionEnd(300):r()},p._enforceFocus=function(){var e=this;t(document).off(h.FOCUSIN).on(h.FOCUSIN,function(n){document!==n.target&&e._element!==n.target&&0===t(e._element).has(n.target).length&&e._element.focus()})},p._setEscapeEvent=function(){var e=this;this._isShown&&this._config.keyboard?t(this._element).on(h.KEYDOWN_DISMISS,function(t){27===t.which&&(t.preventDefault(),e.hide())}):this._isShown||t(this._element).off(h.KEYDOWN_DISMISS)},p._setResizeEvent=function(){var e=this;this._isShown?t(window).on(h.RESIZE,function(t){return e.handleUpdate(t)}):t(window).off(h.RESIZE)},p._hideModal=function(){var e=this;this._element.style.display="none",this._element.setAttribute("aria-hidden",!0),this._isTransitioning=!1,this._showBackdrop(function(){t(document.body).removeClass(f),e._resetAdjustments(),e._resetScrollbar(),t(e._element).trigger(h.HIDDEN)})},p._removeBackdrop=function(){this._backdrop&&(t(this._backdrop).remove(),this._backdrop=null)},p._showBackdrop=function(e){var n=this,i=t(this._element).hasClass(d)?d:"";if(this._isShown&&this._config.backdrop){var s=P.supportsTransitionEnd()&&i;if(this._backdrop=document.createElement("div"),this._backdrop.className=u,i&&t(this._backdrop).addClass(i),t(this._backdrop).appendTo(document.body),t(this._element).on(h.CLICK_DISMISS,function(t){n._ignoreBackdropClick?n._ignoreBackdropClick=!1:t.target===t.currentTarget&&("static"===n._config.backdrop?n._element.focus():n.hide())}),s&&P.reflow(this._backdrop),t(this._backdrop).addClass(_),!e)return;if(!s)return void e();t(this._backdrop).one(P.TRANSITION_END,e).emulateTransitionEnd(150)}else if(!this._isShown&&this._backdrop){t(this._backdrop).removeClass(_);var r=function(){n._removeBackdrop(),e&&e()};P.supportsTransitionEnd()&&t(this._element).hasClass(d)?t(this._backdrop).one(P.TRANSITION_END,r).emulateTransitionEnd(150):r()}else e&&e()},p._adjustDialog=function(){var t=this._element.scrollHeight>document.documentElement.clientHeight;!this._isBodyOverflowing&&t&&(this._element.style.paddingLeft=this._scrollbarWidth+"px"),this._isBodyOverflowing&&!t&&(this._element.style.paddingRight=this._scrollbarWidth+"px")},p._resetAdjustments=function(){this._element.style.paddingLeft="",this._element.style.paddingRight=""},p._checkScrollbar=function(){var t=document.body.getBoundingClientRect();this._isBodyOverflowing=t.left+t.right<window.innerWidth,this._scrollbarWidth=this._getScrollbarWidth()},p._setScrollbar=function(){var e=this;if(this._isBodyOverflowing){t(g.FIXED_CONTENT).each(function(n,i){var s=t(i)[0].style.paddingRight,r=t(i).css("padding-right");t(i).data("padding-right",s).css("padding-right",parseFloat(r)+e._scrollbarWidth+"px")}),t(g.STICKY_CONTENT).each(function(n,i){var s=t(i)[0].style.marginRight,r=t(i).css("margin-right");t(i).data("margin-right",s).css("margin-right",parseFloat(r)-e._scrollbarWidth+"px")}),t(g.NAVBAR_TOGGLER).each(function(n,i){var s=t(i)[0].style.marginRight,r=t(i).css("margin-right");t(i).data("margin-right",s).css("margin-right",parseFloat(r)+e._scrollbarWidth+"px")});var n=document.body.style.paddingRight,i=t("body").css("padding-right");t("body").data("padding-right",n).css("padding-right",parseFloat(i)+this._scrollbarWidth+"px")}},p._resetScrollbar=function(){t(g.FIXED_CONTENT).each(function(e,n){var i=t(n).data("padding-right");"undefined"!=typeof i&&t(n).css("padding-right",i).removeData("padding-right")}),t(g.STICKY_CONTENT+", "+g.NAVBAR_TOGGLER).each(function(e,n){var i=t(n).data("margin-right");"undefined"!=typeof i&&t(n).css("margin-right",i).removeData("margin-right")});var e=t("body").data("padding-right");"undefined"!=typeof e&&t("body").css("padding-right",e).removeData("padding-right")},p._getScrollbarWidth=function(){var t=document.createElement("div");t.className=c,document.body.appendChild(t);var e=t.getBoundingClientRect().width-t.clientWidth;return document.body.removeChild(t),e},o._jQueryInterface=function(e,i){return this.each(function(){var s=t(this).data(n),a=r({},o.Default,t(this).data(),"object"==typeof e&&e);if(s||(s=new o(this,a),t(this).data(n,s)),"string"==typeof e){if("undefined"==typeof s[e])throw new TypeError('No method named "'+e+'"');s[e](i)}else a.show&&s.show(i)})},s(o,null,[{key:"VERSION",get:function(){return"4.0.0"}},{key:"Default",get:function(){return a}}]),o}();return t(document).on(h.CLICK_DATA_API,g.DATA_TOGGLE,function(e){var i,s=this,o=P.getSelectorFromElement(this);o&&(i=t(o)[0]);var a=t(i).data(n)?"toggle":r({},t(i).data(),t(this).data());"A"!==this.tagName&&"AREA"!==this.tagName||e.preventDefault();var l=t(i).one(h.SHOW,function(e){e.isDefaultPrevented()||l.one(h.HIDDEN,function(){t(s).is(":visible")&&s.focus()})});p._jQueryInterface.call(t(i),a,this)}),t.fn.modal=p._jQueryInterface,t.fn.modal.Constructor=p,t.fn.modal.noConflict=function(){return t.fn.modal=o,p._jQueryInterface},p}(e),U=function(t){var e="tooltip",i="bs.tooltip",o="."+i,a=t.fn[e],l=new RegExp("(^|\\s)bs-tooltip\\S+","g"),h={animation:"boolean",template:"string",title:"(string|element|function)",trigger:"string",delay:"(number|object)",html:"boolean",selector:"(string|boolean)",placement:"(string|function)",offset:"(number|string)",container:"(string|element|boolean)",fallbackPlacement:"(string|array)",boundary:"(string|element)"},c={AUTO:"auto",TOP:"top",RIGHT:"right",BOTTOM:"bottom",LEFT:"left"},u={animation:!0,template:'<div class="tooltip" role="tooltip"><div class="arrow"></div><div class="tooltip-inner"></div></div>',trigger:"hover focus",title:"",delay:0,html:!1,selector:!1,placement:"top",offset:0,container:!1,fallbackPlacement:"flip",boundary:"scrollParent"},f="show",d="out",_={HIDE:"hide"+o,HIDDEN:"hidden"+o,SHOW:"show"+o,SHOWN:"shown"+o,INSERTED:"inserted"+o,CLICK:"click"+o,FOCUSIN:"focusin"+o,FOCUSOUT:"focusout"+o,MOUSEENTER:"mouseenter"+o,MOUSELEAVE:"mouseleave"+o},g="fade",p="show",m=".tooltip-inner",v=".arrow",E="hover",T="focus",y="click",C="manual",I=function(){function a(t,e){if("undefined"==typeof n)throw new TypeError("Bootstrap tooltips require Popper.js (https://popper.js.org)");this._isEnabled=!0,this._timeout=0,this._hoverState="",this._activeTrigger={},this._popper=null,this.element=t,this.config=this._getConfig(e),this.tip=null,this._setListeners()}var I=a.prototype;return I.enable=function(){this._isEnabled=!0},I.disable=function(){this._isEnabled=!1},I.toggleEnabled=function(){this._isEnabled=!this._isEnabled},I.toggle=function(e){if(this._isEnabled)if(e){var n=this.constructor.DATA_KEY,i=t(e.currentTarget).data(n);i||(i=new this.constructor(e.currentTarget,this._getDelegateConfig()),t(e.currentTarget).data(n,i)),i._activeTrigger.click=!i._activeTrigger.click,i._isWithActiveTrigger()?i._enter(null,i):i._leave(null,i)}else{if(t(this.getTipElement()).hasClass(p))return void this._leave(null,this);this._enter(null,this)}},I.dispose=function(){clearTimeout(this._timeout),t.removeData(this.element,this.constructor.DATA_KEY),t(this.element).off(this.constructor.EVENT_KEY),t(this.element).closest(".modal").off("hide.bs.modal"),this.tip&&t(this.tip).remove(),this._isEnabled=null,this._timeout=null,this._hoverState=null,this._activeTrigger=null,null!==this._popper&&this._popper.destroy(),this._popper=null,this.element=null,this.config=null,this.tip=null},I.show=function(){var e=this;if("none"===t(this.element).css("display"))throw new Error("Please use show on visible elements");var i=t.Event(this.constructor.Event.SHOW);if(this.isWithContent()&&this._isEnabled){t(this.element).trigger(i);var s=t.contains(this.element.ownerDocument.documentElement,this.element);if(i.isDefaultPrevented()||!s)return;var r=this.getTipElement(),o=P.getUID(this.constructor.NAME);r.setAttribute("id",o),this.element.setAttribute("aria-describedby",o),this.setContent(),this.config.animation&&t(r).addClass(g);var l="function"==typeof this.config.placement?this.config.placement.call(this,r,this.element):this.config.placement,h=this._getAttachment(l);this.addAttachmentClass(h);var c=!1===this.config.container?document.body:t(this.config.container);t(r).data(this.constructor.DATA_KEY,this),t.contains(this.element.ownerDocument.documentElement,this.tip)||t(r).appendTo(c),t(this.element).trigger(this.constructor.Event.INSERTED),this._popper=new n(this.element,r,{placement:h,modifiers:{offset:{offset:this.config.offset},flip:{behavior:this.config.fallbackPlacement},arrow:{element:v},preventOverflow:{boundariesElement:this.config.boundary}},onCreate:function(t){t.originalPlacement!==t.placement&&e._handlePopperPlacementChange(t)},onUpdate:function(t){e._handlePopperPlacementChange(t)}}),t(r).addClass(p),"ontouchstart"in document.documentElement&&t("body").children().on("mouseover",null,t.noop);var u=function(){e.config.animation&&e._fixTransition();var n=e._hoverState;e._hoverState=null,t(e.element).trigger(e.constructor.Event.SHOWN),n===d&&e._leave(null,e)};P.supportsTransitionEnd()&&t(this.tip).hasClass(g)?t(this.tip).one(P.TRANSITION_END,u).emulateTransitionEnd(a._TRANSITION_DURATION):u()}},I.hide=function(e){var n=this,i=this.getTipElement(),s=t.Event(this.constructor.Event.HIDE),r=function(){n._hoverState!==f&&i.parentNode&&i.parentNode.removeChild(i),n._cleanTipClass(),n.element.removeAttribute("aria-describedby"),t(n.element).trigger(n.constructor.Event.HIDDEN),null!==n._popper&&n._popper.destroy(),e&&e()};t(this.element).trigger(s),s.isDefaultPrevented()||(t(i).removeClass(p),"ontouchstart"in document.documentElement&&t("body").children().off("mouseover",null,t.noop),this._activeTrigger[y]=!1,this._activeTrigger[T]=!1,this._activeTrigger[E]=!1,P.supportsTransitionEnd()&&t(this.tip).hasClass(g)?t(i).one(P.TRANSITION_END,r).emulateTransitionEnd(150):r(),this._hoverState="")},I.update=function(){null!==this._popper&&this._popper.scheduleUpdate()},I.isWithContent=function(){return Boolean(this.getTitle())},I.addAttachmentClass=function(e){t(this.getTipElement()).addClass("bs-tooltip-"+e)},I.getTipElement=function(){return this.tip=this.tip||t(this.config.template)[0],this.tip},I.setContent=function(){var e=t(this.getTipElement());this.setElementContent(e.find(m),this.getTitle()),e.removeClass(g+" "+p)},I.setElementContent=function(e,n){var i=this.config.html;"object"==typeof n&&(n.nodeType||n.jquery)?i?t(n).parent().is(e)||e.empty().append(n):e.text(t(n).text()):e[i?"html":"text"](n)},I.getTitle=function(){var t=this.element.getAttribute("data-original-title");return t||(t="function"==typeof this.config.title?this.config.title.call(this.element):this.config.title),t},I._getAttachment=function(t){return c[t.toUpperCase()]},I._setListeners=function(){var e=this;this.config.trigger.split(" ").forEach(function(n){if("click"===n)t(e.element).on(e.constructor.Event.CLICK,e.config.selector,function(t){return e.toggle(t)});else if(n!==C){var i=n===E?e.constructor.Event.MOUSEENTER:e.constructor.Event.FOCUSIN,s=n===E?e.constructor.Event.MOUSELEAVE:e.constructor.Event.FOCUSOUT;t(e.element).on(i,e.config.selector,function(t){return e._enter(t)}).on(s,e.config.selector,function(t){return e._leave(t)})}t(e.element).closest(".modal").on("hide.bs.modal",function(){return e.hide()})}),this.config.selector?this.config=r({},this.config,{trigger:"manual",selector:""}):this._fixTitle()},I._fixTitle=function(){var t=typeof this.element.getAttribute("data-original-title");(this.element.getAttribute("title")||"string"!==t)&&(this.element.setAttribute("data-original-title",this.element.getAttribute("title")||""),this.element.setAttribute("title",""))},I._enter=function(e,n){var i=this.constructor.DATA_KEY;(n=n||t(e.currentTarget).data(i))||(n=new this.constructor(e.currentTarget,this._getDelegateConfig()),t(e.currentTarget).data(i,n)),e&&(n._activeTrigger["focusin"===e.type?T:E]=!0),t(n.getTipElement()).hasClass(p)||n._hoverState===f?n._hoverState=f:(clearTimeout(n._timeout),n._hoverState=f,n.config.delay&&n.config.delay.show?n._timeout=setTimeout(function(){n._hoverState===f&&n.show()},n.config.delay.show):n.show())},I._leave=function(e,n){var i=this.constructor.DATA_KEY;(n=n||t(e.currentTarget).data(i))||(n=new this.constructor(e.currentTarget,this._getDelegateConfig()),t(e.currentTarget).data(i,n)),e&&(n._activeTrigger["focusout"===e.type?T:E]=!1),n._isWithActiveTrigger()||(clearTimeout(n._timeout),n._hoverState=d,n.config.delay&&n.config.delay.hide?n._timeout=setTimeout(function(){n._hoverState===d&&n.hide()},n.config.delay.hide):n.hide())},I._isWithActiveTrigger=function(){for(var t in this._activeTrigger)if(this._activeTrigger[t])return!0;return!1},I._getConfig=function(n){return"number"==typeof(n=r({},this.constructor.Default,t(this.element).data(),n)).delay&&(n.delay={show:n.delay,hide:n.delay}),"number"==typeof n.title&&(n.title=n.title.toString()),"number"==typeof n.content&&(n.content=n.content.toString()),P.typeCheckConfig(e,n,this.constructor.DefaultType),n},I._getDelegateConfig=function(){var t={};if(this.config)for(var e in this.config)this.constructor.Default[e]!==this.config[e]&&(t[e]=this.config[e]);return t},I._cleanTipClass=function(){var e=t(this.getTipElement()),n=e.attr("class").match(l);null!==n&&n.length>0&&e.removeClass(n.join(""))},I._handlePopperPlacementChange=function(t){this._cleanTipClass(),this.addAttachmentClass(this._getAttachment(t.placement))},I._fixTransition=function(){var e=this.getTipElement(),n=this.config.animation;null===e.getAttribute("x-placement")&&(t(e).removeClass(g),this.config.animation=!1,this.hide(),this.show(),this.config.animation=n)},a._jQueryInterface=function(e){return this.each(function(){var n=t(this).data(i),s="object"==typeof e&&e;if((n||!/dispose|hide/.test(e))&&(n||(n=new a(this,s),t(this).data(i,n)),"string"==typeof e)){if("undefined"==typeof n[e])throw new TypeError('No method named "'+e+'"');n[e]()}})},s(a,null,[{key:"VERSION",get:function(){return"4.0.0"}},{key:"Default",get:function(){return u}},{key:"NAME",get:function(){return e}},{key:"DATA_KEY",get:function(){return i}},{key:"Event",get:function(){return _}},{key:"EVENT_KEY",get:function(){return o}},{key:"DefaultType",get:function(){return h}}]),a}();return t.fn[e]=I._jQueryInterface,t.fn[e].Constructor=I,t.fn[e].noConflict=function(){return t.fn[e]=a,I._jQueryInterface},I}(e),x=function(t){var e="popover",n="bs.popover",i="."+n,o=t.fn[e],a=new RegExp("(^|\\s)bs-popover\\S+","g"),l=r({},U.Default,{placement:"right",trigger:"click",content:"",template:'<div class="popover" role="tooltip"><div class="arrow"></div><h3 class="popover-header"></h3><div class="popover-body"></div></div>'}),h=r({},U.DefaultType,{content:"(string|element|function)"}),c="fade",u="show",f=".popover-header",d=".popover-body",_={HIDE:"hide"+i,HIDDEN:"hidden"+i,SHOW:"show"+i,SHOWN:"shown"+i,INSERTED:"inserted"+i,CLICK:"click"+i,FOCUSIN:"focusin"+i,FOCUSOUT:"focusout"+i,MOUSEENTER:"mouseenter"+i,MOUSELEAVE:"mouseleave"+i},g=function(r){var o,g;function p(){return r.apply(this,arguments)||this}g=r,(o=p).prototype=Object.create(g.prototype),o.prototype.constructor=o,o.__proto__=g;var m=p.prototype;return m.isWithContent=function(){return this.getTitle()||this._getContent()},m.addAttachmentClass=function(e){t(this.getTipElement()).addClass("bs-popover-"+e)},m.getTipElement=function(){return this.tip=this.tip||t(this.config.template)[0],this.tip},m.setContent=function(){var e=t(this.getTipElement());this.setElementContent(e.find(f),this.getTitle());var n=this._getContent();"function"==typeof n&&(n=n.call(this.element)),this.setElementContent(e.find(d),n),e.removeClass(c+" "+u)},m._getContent=function(){return this.element.getAttribute("data-content")||this.config.content},m._cleanTipClass=function(){var e=t(this.getTipElement()),n=e.attr("class").match(a);null!==n&&n.length>0&&e.removeClass(n.join(""))},p._jQueryInterface=function(e){return this.each(function(){var i=t(this).data(n),s="object"==typeof e?e:null;if((i||!/destroy|hide/.test(e))&&(i||(i=new p(this,s),t(this).data(n,i)),"string"==typeof e)){if("undefined"==typeof i[e])throw new TypeError('No method named "'+e+'"');i[e]()}})},s(p,null,[{key:"VERSION",get:function(){return"4.0.0"}},{key:"Default",get:function(){return l}},{key:"NAME",get:function(){return e}},{key:"DATA_KEY",get:function(){return n}},{key:"Event",get:function(){return _}},{key:"EVENT_KEY",get:function(){return i}},{key:"DefaultType",get:function(){return h}}]),p}(U);return t.fn[e]=g._jQueryInterface,t.fn[e].Constructor=g,t.fn[e].noConflict=function(){return t.fn[e]=o,g._jQueryInterface},g}(e),K=function(t){var e="scrollspy",n="bs.scrollspy",i="."+n,o=t.fn[e],a={offset:10,method:"auto",target:""},l={offset:"number",method:"string",target:"(string|element)"},h={ACTIVATE:"activate"+i,SCROLL:"scroll"+i,LOAD_DATA_API:"load"+i+".data-api"},c="dropdown-item",u="active",f={DATA_SPY:'[data-spy="scroll"]',ACTIVE:".active",NAV_LIST_GROUP:".nav, .list-group",NAV_LINKS:".nav-link",NAV_ITEMS:".nav-item",LIST_ITEMS:".list-group-item",DROPDOWN:".dropdown",DROPDOWN_ITEMS:".dropdown-item",DROPDOWN_TOGGLE:".dropdown-toggle"},d="offset",_="position",g=function(){function o(e,n){var i=this;this._element=e,this._scrollElement="BODY"===e.tagName?window:e,this._config=this._getConfig(n),this._selector=this._config.target+" "+f.NAV_LINKS+","+this._config.target+" "+f.LIST_ITEMS+","+this._config.target+" "+f.DROPDOWN_ITEMS,this._offsets=[],this._targets=[],this._activeTarget=null,this._scrollHeight=0,t(this._scrollElement).on(h.SCROLL,function(t){return i._process(t)}),this.refresh(),this._process()}var g=o.prototype;return g.refresh=function(){var e=this,n=this._scrollElement===this._scrollElement.window?d:_,i="auto"===this._config.method?n:this._config.method,s=i===_?this._getScrollTop():0;this._offsets=[],this._targets=[],this._scrollHeight=this._getScrollHeight(),t.makeArray(t(this._selector)).map(function(e){var n,r=P.getSelectorFromElement(e);if(r&&(n=t(r)[0]),n){var o=n.getBoundingClientRect();if(o.width||o.height)return[t(n)[i]().top+s,r]}return null}).filter(function(t){return t}).sort(function(t,e){return t[0]-e[0]}).forEach(function(t){e._offsets.push(t[0]),e._targets.push(t[1])})},g.dispose=function(){t.removeData(this._element,n),t(this._scrollElement).off(i),this._element=null,this._scrollElement=null,this._config=null,this._selector=null,this._offsets=null,this._targets=null,this._activeTarget=null,this._scrollHeight=null},g._getConfig=function(n){if("string"!=typeof(n=r({},a,n)).target){var i=t(n.target).attr("id");i||(i=P.getUID(e),t(n.target).attr("id",i)),n.target="#"+i}return P.typeCheckConfig(e,n,l),n},g._getScrollTop=function(){return this._scrollElement===window?this._scrollElement.pageYOffset:this._scrollElement.scrollTop},g._getScrollHeight=function(){return this._scrollElement.scrollHeight||Math.max(document.body.scrollHeight,document.documentElement.scrollHeight)},g._getOffsetHeight=function(){return this._scrollElement===window?window.innerHeight:this._scrollElement.getBoundingClientRect().height},g._process=function(){var t=this._getScrollTop()+this._config.offset,e=this._getScrollHeight(),n=this._config.offset+e-this._getOffsetHeight();if(this._scrollHeight!==e&&this.refresh(),t>=n){var i=this._targets[this._targets.length-1];this._activeTarget!==i&&this._activate(i)}else{if(this._activeTarget&&t<this._offsets[0]&&this._offsets[0]>0)return this._activeTarget=null,void this._clear();for(var s=this._offsets.length;s--;){this._activeTarget!==this._targets[s]&&t>=this._offsets[s]&&("undefined"==typeof this._offsets[s+1]||t<this._offsets[s+1])&&this._activate(this._targets[s])}}},g._activate=function(e){this._activeTarget=e,this._clear();var n=this._selector.split(",");n=n.map(function(t){return t+'[data-target="'+e+'"],'+t+'[href="'+e+'"]'});var i=t(n.join(","));i.hasClass(c)?(i.closest(f.DROPDOWN).find(f.DROPDOWN_TOGGLE).addClass(u),i.addClass(u)):(i.addClass(u),i.parents(f.NAV_LIST_GROUP).prev(f.NAV_LINKS+", "+f.LIST_ITEMS).addClass(u),i.parents(f.NAV_LIST_GROUP).prev(f.NAV_ITEMS).children(f.NAV_LINKS).addClass(u)),t(this._scrollElement).trigger(h.ACTIVATE,{relatedTarget:e})},g._clear=function(){t(this._selector).filter(f.ACTIVE).removeClass(u)},o._jQueryInterface=function(e){return this.each(function(){var i=t(this).data(n);if(i||(i=new o(this,"object"==typeof e&&e),t(this).data(n,i)),"string"==typeof e){if("undefined"==typeof i[e])throw new TypeError('No method named "'+e+'"');i[e]()}})},s(o,null,[{key:"VERSION",get:function(){return"4.0.0"}},{key:"Default",get:function(){return a}}]),o}();return t(window).on(h.LOAD_DATA_API,function(){for(var e=t.makeArray(t(f.DATA_SPY)),n=e.length;n--;){var i=t(e[n]);g._jQueryInterface.call(i,i.data())}}),t.fn[e]=g._jQueryInterface,t.fn[e].Constructor=g,t.fn[e].noConflict=function(){return t.fn[e]=o,g._jQueryInterface},g}(e),V=function(t){var e="bs.tab",n="."+e,i=t.fn.tab,r={HIDE:"hide"+n,HIDDEN:"hidden"+n,SHOW:"show"+n,SHOWN:"shown"+n,CLICK_DATA_API:"click.bs.tab.data-api"},o="dropdown-menu",a="active",l="disabled",h="fade",c="show",u=".dropdown",f=".nav, .list-group",d=".active",_="> li > .active",g='[data-toggle="tab"], [data-toggle="pill"], [data-toggle="list"]',p=".dropdown-toggle",m="> .dropdown-menu .active",v=function(){function n(t){this._element=t}var i=n.prototype;return i.show=function(){var e=this;if(!(this._element.parentNode&&this._element.parentNode.nodeType===Node.ELEMENT_NODE&&t(this._element).hasClass(a)||t(this._element).hasClass(l))){var n,i,s=t(this._element).closest(f)[0],o=P.getSelectorFromElement(this._element);if(s){var h="UL"===s.nodeName?_:d;i=(i=t.makeArray(t(s).find(h)))[i.length-1]}var c=t.Event(r.HIDE,{relatedTarget:this._element}),u=t.Event(r.SHOW,{relatedTarget:i});if(i&&t(i).trigger(c),t(this._element).trigger(u),!u.isDefaultPrevented()&&!c.isDefaultPrevented()){o&&(n=t(o)[0]),this._activate(this._element,s);var g=function(){var n=t.Event(r.HIDDEN,{relatedTarget:e._element}),s=t.Event(r.SHOWN,{relatedTarget:i});t(i).trigger(n),t(e._element).trigger(s)};n?this._activate(n,n.parentNode,g):g()}}},i.dispose=function(){t.removeData(this._element,e),this._element=null},i._activate=function(e,n,i){var s=this,r=("UL"===n.nodeName?t(n).find(_):t(n).children(d))[0],o=i&&P.supportsTransitionEnd()&&r&&t(r).hasClass(h),a=function(){return s._transitionComplete(e,r,i)};r&&o?t(r).one(P.TRANSITION_END,a).emulateTransitionEnd(150):a()},i._transitionComplete=function(e,n,i){if(n){t(n).removeClass(c+" "+a);var s=t(n.parentNode).find(m)[0];s&&t(s).removeClass(a),"tab"===n.getAttribute("role")&&n.setAttribute("aria-selected",!1)}if(t(e).addClass(a),"tab"===e.getAttribute("role")&&e.setAttribute("aria-selected",!0),P.reflow(e),t(e).addClass(c),e.parentNode&&t(e.parentNode).hasClass(o)){var r=t(e).closest(u)[0];r&&t(r).find(p).addClass(a),e.setAttribute("aria-expanded",!0)}i&&i()},n._jQueryInterface=function(i){return this.each(function(){var s=t(this),r=s.data(e);if(r||(r=new n(this),s.data(e,r)),"string"==typeof i){if("undefined"==typeof r[i])throw new TypeError('No method named "'+i+'"');r[i]()}})},s(n,null,[{key:"VERSION",get:function(){return"4.0.0"}}]),n}();return t(document).on(r.CLICK_DATA_API,g,function(e){e.preventDefault(),v._jQueryInterface.call(t(this),"show")}),t.fn.tab=v._jQueryInterface,t.fn.tab.Constructor=v,t.fn.tab.noConflict=function(){return t.fn.tab=i,v._jQueryInterface},v}(e);!function(t){if("undefined"==typeof t)throw new TypeError("Bootstrap's JavaScript requires jQuery. jQuery must be included before Bootstrap's JavaScript.");var e=t.fn.jquery.split(" ")[0].split(".");if(e[0]<2&&e[1]<9||1===e[0]&&9===e[1]&&e[2]<1||e[0]>=4)throw new Error("Bootstrap's JavaScript requires at least jQuery v1.9.1 but less than v4.0.0")}(e),t.Util=P,t.Alert=L,t.Button=R,t.Carousel=j,t.Collapse=H,t.Dropdown=W,t.Modal=M,t.Popover=x,t.Scrollspy=K,t.Tab=V,t.Tooltip=U,Object.defineProperty(t,"__esModule",{value:!0})});
//# sourceMappingURL=bootstrap.min.js.map
;/*
 Copyright (C) Federico Zivolo 2017
 Distributed under the MIT License (license terms are at http://opensource.org/licenses/MIT).
 */(function(e,t){'object'==typeof exports&&'undefined'!=typeof module?module.exports=t():'function'==typeof define&&define.amd?define(t):e.Popper=t()})(this,function(){'use strict';function e(e){return e&&'[object Function]'==={}.toString.call(e)}function t(e,t){if(1!==e.nodeType)return[];var o=window.getComputedStyle(e,null);return t?o[t]:o}function o(e){return'HTML'===e.nodeName?e:e.parentNode||e.host}function n(e){if(!e||-1!==['HTML','BODY','#document'].indexOf(e.nodeName))return window.document.body;var i=t(e),r=i.overflow,p=i.overflowX,s=i.overflowY;return /(auto|scroll)/.test(r+s+p)?e:n(o(e))}function r(e){var o=e&&e.offsetParent,i=o&&o.nodeName;return i&&'BODY'!==i&&'HTML'!==i?-1!==['TD','TABLE'].indexOf(o.nodeName)&&'static'===t(o,'position')?r(o):o:window.document.documentElement}function p(e){var t=e.nodeName;return'BODY'!==t&&('HTML'===t||r(e.firstElementChild)===e)}function s(e){return null===e.parentNode?e:s(e.parentNode)}function d(e,t){if(!e||!e.nodeType||!t||!t.nodeType)return window.document.documentElement;var o=e.compareDocumentPosition(t)&Node.DOCUMENT_POSITION_FOLLOWING,i=o?e:t,n=o?t:e,a=document.createRange();a.setStart(i,0),a.setEnd(n,0);var l=a.commonAncestorContainer;if(e!==l&&t!==l||i.contains(n))return p(l)?l:r(l);var f=s(e);return f.host?d(f.host,t):d(e,s(t).host)}function a(e){var t=1<arguments.length&&void 0!==arguments[1]?arguments[1]:'top',o='top'===t?'scrollTop':'scrollLeft',i=e.nodeName;if('BODY'===i||'HTML'===i){var n=window.document.documentElement,r=window.document.scrollingElement||n;return r[o]}return e[o]}function l(e,t){var o=2<arguments.length&&void 0!==arguments[2]&&arguments[2],i=a(t,'top'),n=a(t,'left'),r=o?-1:1;return e.top+=i*r,e.bottom+=i*r,e.left+=n*r,e.right+=n*r,e}function f(e,t){var o='x'===t?'Left':'Top',i='Left'==o?'Right':'Bottom';return+e['border'+o+'Width'].split('px')[0]+ +e['border'+i+'Width'].split('px')[0]}function m(e,t,o,i){return X(t['offset'+e],t['scroll'+e],o['client'+e],o['offset'+e],o['scroll'+e],ne()?o['offset'+e]+i['margin'+('Height'===e?'Top':'Left')]+i['margin'+('Height'===e?'Bottom':'Right')]:0)}function c(){var e=window.document.body,t=window.document.documentElement,o=ne()&&window.getComputedStyle(t);return{height:m('Height',e,t,o),width:m('Width',e,t,o)}}function h(e){return de({},e,{right:e.left+e.width,bottom:e.top+e.height})}function g(e){var o={};if(ne())try{o=e.getBoundingClientRect();var i=a(e,'top'),n=a(e,'left');o.top+=i,o.left+=n,o.bottom+=i,o.right+=n}catch(e){}else o=e.getBoundingClientRect();var r={left:o.left,top:o.top,width:o.right-o.left,height:o.bottom-o.top},p='HTML'===e.nodeName?c():{},s=p.width||e.clientWidth||r.right-r.left,d=p.height||e.clientHeight||r.bottom-r.top,l=e.offsetWidth-s,m=e.offsetHeight-d;if(l||m){var g=t(e);l-=f(g,'x'),m-=f(g,'y'),r.width-=l,r.height-=m}return h(r)}function u(e,o){var i=ne(),r='HTML'===o.nodeName,p=g(e),s=g(o),d=n(e),a=t(o),f=+a.borderTopWidth.split('px')[0],m=+a.borderLeftWidth.split('px')[0],c=h({top:p.top-s.top-f,left:p.left-s.left-m,width:p.width,height:p.height});if(c.marginTop=0,c.marginLeft=0,!i&&r){var u=+a.marginTop.split('px')[0],b=+a.marginLeft.split('px')[0];c.top-=f-u,c.bottom-=f-u,c.left-=m-b,c.right-=m-b,c.marginTop=u,c.marginLeft=b}return(i?o.contains(d):o===d&&'BODY'!==d.nodeName)&&(c=l(c,o)),c}function b(e){var t=window.document.documentElement,o=u(e,t),i=X(t.clientWidth,window.innerWidth||0),n=X(t.clientHeight,window.innerHeight||0),r=a(t),p=a(t,'left'),s={top:r-o.top+o.marginTop,left:p-o.left+o.marginLeft,width:i,height:n};return h(s)}function y(e){var i=e.nodeName;return'BODY'===i||'HTML'===i?!1:'fixed'===t(e,'position')||y(o(e))}function w(e,t,i,r){var p={top:0,left:0},s=d(e,t);if('viewport'===r)p=b(s);else{var a;'scrollParent'===r?(a=n(o(e)),'BODY'===a.nodeName&&(a=window.document.documentElement)):'window'===r?a=window.document.documentElement:a=r;var l=u(a,s);if('HTML'===a.nodeName&&!y(s)){var f=c(),m=f.height,h=f.width;p.top+=l.top-l.marginTop,p.bottom=m+l.top,p.left+=l.left-l.marginLeft,p.right=h+l.left}else p=l}return p.left+=i,p.top+=i,p.right-=i,p.bottom-=i,p}function E(e){var t=e.width,o=e.height;return t*o}function v(e,t,o,i,n){var r=5<arguments.length&&void 0!==arguments[5]?arguments[5]:0;if(-1===e.indexOf('auto'))return e;var p=w(o,i,r,n),s={top:{width:p.width,height:t.top-p.top},right:{width:p.right-t.right,height:p.height},bottom:{width:p.width,height:p.bottom-t.bottom},left:{width:t.left-p.left,height:p.height}},d=Object.keys(s).map(function(e){return de({key:e},s[e],{area:E(s[e])})}).sort(function(e,t){return t.area-e.area}),a=d.filter(function(e){var t=e.width,i=e.height;return t>=o.clientWidth&&i>=o.clientHeight}),l=0<a.length?a[0].key:d[0].key,f=e.split('-')[1];return l+(f?'-'+f:'')}function x(e,t,o){var i=d(t,o);return u(o,i)}function O(e){var t=window.getComputedStyle(e),o=parseFloat(t.marginTop)+parseFloat(t.marginBottom),i=parseFloat(t.marginLeft)+parseFloat(t.marginRight),n={width:e.offsetWidth+i,height:e.offsetHeight+o};return n}function L(e){var t={left:'right',right:'left',bottom:'top',top:'bottom'};return e.replace(/left|right|bottom|top/g,function(e){return t[e]})}function S(e,t,o){o=o.split('-')[0];var i=O(e),n={width:i.width,height:i.height},r=-1!==['right','left'].indexOf(o),p=r?'top':'left',s=r?'left':'top',d=r?'height':'width',a=r?'width':'height';return n[p]=t[p]+t[d]/2-i[d]/2,n[s]=o===s?t[s]-i[a]:t[L(s)],n}function T(e,t){return Array.prototype.find?e.find(t):e.filter(t)[0]}function C(e,t,o){if(Array.prototype.findIndex)return e.findIndex(function(e){return e[t]===o});var i=T(e,function(e){return e[t]===o});return e.indexOf(i)}function N(t,o,i){var n=void 0===i?t:t.slice(0,C(t,'name',i));return n.forEach(function(t){t.function&&console.warn('`modifier.function` is deprecated, use `modifier.fn`!');var i=t.function||t.fn;t.enabled&&e(i)&&(o.offsets.popper=h(o.offsets.popper),o.offsets.reference=h(o.offsets.reference),o=i(o,t))}),o}function k(){if(!this.state.isDestroyed){var e={instance:this,styles:{},arrowStyles:{},attributes:{},flipped:!1,offsets:{}};e.offsets.reference=x(this.state,this.popper,this.reference),e.placement=v(this.options.placement,e.offsets.reference,this.popper,this.reference,this.options.modifiers.flip.boundariesElement,this.options.modifiers.flip.padding),e.originalPlacement=e.placement,e.offsets.popper=S(this.popper,e.offsets.reference,e.placement),e.offsets.popper.position='absolute',e=N(this.modifiers,e),this.state.isCreated?this.options.onUpdate(e):(this.state.isCreated=!0,this.options.onCreate(e))}}function W(e,t){return e.some(function(e){var o=e.name,i=e.enabled;return i&&o===t})}function B(e){for(var t=[!1,'ms','Webkit','Moz','O'],o=e.charAt(0).toUpperCase()+e.slice(1),n=0;n<t.length-1;n++){var i=t[n],r=i?''+i+o:e;if('undefined'!=typeof window.document.body.style[r])return r}return null}function P(){return this.state.isDestroyed=!0,W(this.modifiers,'applyStyle')&&(this.popper.removeAttribute('x-placement'),this.popper.style.left='',this.popper.style.position='',this.popper.style.top='',this.popper.style[B('transform')]=''),this.disableEventListeners(),this.options.removeOnDestroy&&this.popper.parentNode.removeChild(this.popper),this}function D(e,t,o,i){var r='BODY'===e.nodeName,p=r?window:e;p.addEventListener(t,o,{passive:!0}),r||D(n(p.parentNode),t,o,i),i.push(p)}function H(e,t,o,i){o.updateBound=i,window.addEventListener('resize',o.updateBound,{passive:!0});var r=n(e);return D(r,'scroll',o.updateBound,o.scrollParents),o.scrollElement=r,o.eventsEnabled=!0,o}function A(){this.state.eventsEnabled||(this.state=H(this.reference,this.options,this.state,this.scheduleUpdate))}function M(e,t){return window.removeEventListener('resize',t.updateBound),t.scrollParents.forEach(function(e){e.removeEventListener('scroll',t.updateBound)}),t.updateBound=null,t.scrollParents=[],t.scrollElement=null,t.eventsEnabled=!1,t}function I(){this.state.eventsEnabled&&(window.cancelAnimationFrame(this.scheduleUpdate),this.state=M(this.reference,this.state))}function R(e){return''!==e&&!isNaN(parseFloat(e))&&isFinite(e)}function U(e,t){Object.keys(t).forEach(function(o){var i='';-1!==['width','height','top','right','bottom','left'].indexOf(o)&&R(t[o])&&(i='px'),e.style[o]=t[o]+i})}function Y(e,t){Object.keys(t).forEach(function(o){var i=t[o];!1===i?e.removeAttribute(o):e.setAttribute(o,t[o])})}function F(e,t,o){var i=T(e,function(e){var o=e.name;return o===t}),n=!!i&&e.some(function(e){return e.name===o&&e.enabled&&e.order<i.order});if(!n){var r='`'+t+'`';console.warn('`'+o+'`'+' modifier is required by '+r+' modifier in order to work, be sure to include it before '+r+'!')}return n}function j(e){return'end'===e?'start':'start'===e?'end':e}function K(e){var t=1<arguments.length&&void 0!==arguments[1]&&arguments[1],o=le.indexOf(e),i=le.slice(o+1).concat(le.slice(0,o));return t?i.reverse():i}function q(e,t,o,i){var n=e.match(/((?:\-|\+)?\d*\.?\d*)(.*)/),r=+n[1],p=n[2];if(!r)return e;if(0===p.indexOf('%')){var s;switch(p){case'%p':s=o;break;case'%':case'%r':default:s=i;}var d=h(s);return d[t]/100*r}if('vh'===p||'vw'===p){var a;return a='vh'===p?X(document.documentElement.clientHeight,window.innerHeight||0):X(document.documentElement.clientWidth,window.innerWidth||0),a/100*r}return r}function G(e,t,o,i){var n=[0,0],r=-1!==['right','left'].indexOf(i),p=e.split(/(\+|\-)/).map(function(e){return e.trim()}),s=p.indexOf(T(p,function(e){return-1!==e.search(/,|\s/)}));p[s]&&-1===p[s].indexOf(',')&&console.warn('Offsets separated by white space(s) are deprecated, use a comma (,) instead.');var d=/\s*,\s*|\s+/,a=-1===s?[p]:[p.slice(0,s).concat([p[s].split(d)[0]]),[p[s].split(d)[1]].concat(p.slice(s+1))];return a=a.map(function(e,i){var n=(1===i?!r:r)?'height':'width',p=!1;return e.reduce(function(e,t){return''===e[e.length-1]&&-1!==['+','-'].indexOf(t)?(e[e.length-1]=t,p=!0,e):p?(e[e.length-1]+=t,p=!1,e):e.concat(t)},[]).map(function(e){return q(e,n,t,o)})}),a.forEach(function(e,t){e.forEach(function(o,i){R(o)&&(n[t]+=o*('-'===e[i-1]?-1:1))})}),n}function z(e,t){var o,i=t.offset,n=e.placement,r=e.offsets,p=r.popper,s=r.reference,d=n.split('-')[0];return o=R(+i)?[+i,0]:G(i,p,s,d),'left'===d?(p.top+=o[0],p.left-=o[1]):'right'===d?(p.top+=o[0],p.left+=o[1]):'top'===d?(p.left+=o[0],p.top-=o[1]):'bottom'===d&&(p.left+=o[0],p.top+=o[1]),e.popper=p,e}for(var V=Math.min,_=Math.floor,X=Math.max,Q=['native code','[object MutationObserverConstructor]'],J=function(e){return Q.some(function(t){return-1<(e||'').toString().indexOf(t)})},Z='undefined'!=typeof window,$=['Edge','Trident','Firefox'],ee=0,te=0;te<$.length;te+=1)if(Z&&0<=navigator.userAgent.indexOf($[te])){ee=1;break}var i,oe=Z&&J(window.MutationObserver),ie=oe?function(e){var t=!1,o=0,i=document.createElement('span'),n=new MutationObserver(function(){e(),t=!1});return n.observe(i,{attributes:!0}),function(){t||(t=!0,i.setAttribute('x-index',o),++o)}}:function(e){var t=!1;return function(){t||(t=!0,setTimeout(function(){t=!1,e()},ee))}},ne=function(){return void 0==i&&(i=-1!==navigator.appVersion.indexOf('MSIE 10')),i},re=function(e,t){if(!(e instanceof t))throw new TypeError('Cannot call a class as a function')},pe=function(){function e(e,t){for(var o,n=0;n<t.length;n++)o=t[n],o.enumerable=o.enumerable||!1,o.configurable=!0,'value'in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}return function(t,o,i){return o&&e(t.prototype,o),i&&e(t,i),t}}(),se=function(e,t,o){return t in e?Object.defineProperty(e,t,{value:o,enumerable:!0,configurable:!0,writable:!0}):e[t]=o,e},de=Object.assign||function(e){for(var t,o=1;o<arguments.length;o++)for(var i in t=arguments[o],t)Object.prototype.hasOwnProperty.call(t,i)&&(e[i]=t[i]);return e},ae=['auto-start','auto','auto-end','top-start','top','top-end','right-start','right','right-end','bottom-end','bottom','bottom-start','left-end','left','left-start'],le=ae.slice(3),fe={FLIP:'flip',CLOCKWISE:'clockwise',COUNTERCLOCKWISE:'counterclockwise'},me=function(){function t(o,i){var n=this,r=2<arguments.length&&void 0!==arguments[2]?arguments[2]:{};re(this,t),this.scheduleUpdate=function(){return requestAnimationFrame(n.update)},this.update=ie(this.update.bind(this)),this.options=de({},t.Defaults,r),this.state={isDestroyed:!1,isCreated:!1,scrollParents:[]},this.reference=o.jquery?o[0]:o,this.popper=i.jquery?i[0]:i,this.options.modifiers={},Object.keys(de({},t.Defaults.modifiers,r.modifiers)).forEach(function(e){n.options.modifiers[e]=de({},t.Defaults.modifiers[e]||{},r.modifiers?r.modifiers[e]:{})}),this.modifiers=Object.keys(this.options.modifiers).map(function(e){return de({name:e},n.options.modifiers[e])}).sort(function(e,t){return e.order-t.order}),this.modifiers.forEach(function(t){t.enabled&&e(t.onLoad)&&t.onLoad(n.reference,n.popper,n.options,t,n.state)}),this.update();var p=this.options.eventsEnabled;p&&this.enableEventListeners(),this.state.eventsEnabled=p}return pe(t,[{key:'update',value:function(){return k.call(this)}},{key:'destroy',value:function(){return P.call(this)}},{key:'enableEventListeners',value:function(){return A.call(this)}},{key:'disableEventListeners',value:function(){return I.call(this)}}]),t}();return me.Utils=('undefined'==typeof window?global:window).PopperUtils,me.placements=ae,me.Defaults={placement:'bottom',eventsEnabled:!0,removeOnDestroy:!1,onCreate:function(){},onUpdate:function(){},modifiers:{shift:{order:100,enabled:!0,fn:function(e){var t=e.placement,o=t.split('-')[0],i=t.split('-')[1];if(i){var n=e.offsets,r=n.reference,p=n.popper,s=-1!==['bottom','top'].indexOf(o),d=s?'left':'top',a=s?'width':'height',l={start:se({},d,r[d]),end:se({},d,r[d]+r[a]-p[a])};e.offsets.popper=de({},p,l[i])}return e}},offset:{order:200,enabled:!0,fn:z,offset:0},preventOverflow:{order:300,enabled:!0,fn:function(e,t){var o=t.boundariesElement||r(e.instance.popper);e.instance.reference===o&&(o=r(o));var i=w(e.instance.popper,e.instance.reference,t.padding,o);t.boundaries=i;var n=t.priority,p=e.offsets.popper,s={primary:function(e){var o=p[e];return p[e]<i[e]&&!t.escapeWithReference&&(o=X(p[e],i[e])),se({},e,o)},secondary:function(e){var o='right'===e?'left':'top',n=p[o];return p[e]>i[e]&&!t.escapeWithReference&&(n=V(p[o],i[e]-('right'===e?p.width:p.height))),se({},o,n)}};return n.forEach(function(e){var t=-1===['left','top'].indexOf(e)?'secondary':'primary';p=de({},p,s[t](e))}),e.offsets.popper=p,e},priority:['left','right','top','bottom'],padding:5,boundariesElement:'scrollParent'},keepTogether:{order:400,enabled:!0,fn:function(e){var t=e.offsets,o=t.popper,i=t.reference,n=e.placement.split('-')[0],r=_,p=-1!==['top','bottom'].indexOf(n),s=p?'right':'bottom',d=p?'left':'top',a=p?'width':'height';return o[s]<r(i[d])&&(e.offsets.popper[d]=r(i[d])-o[a]),o[d]>r(i[s])&&(e.offsets.popper[d]=r(i[s])),e}},arrow:{order:500,enabled:!0,fn:function(e,o){if(!F(e.instance.modifiers,'arrow','keepTogether'))return e;var i=o.element;if('string'==typeof i){if(i=e.instance.popper.querySelector(i),!i)return e;}else if(!e.instance.popper.contains(i))return console.warn('WARNING: `arrow.element` must be child of its popper element!'),e;var n=e.placement.split('-')[0],r=e.offsets,p=r.popper,s=r.reference,d=-1!==['left','right'].indexOf(n),a=d?'height':'width',l=d?'Top':'Left',f=l.toLowerCase(),m=d?'left':'top',c=d?'bottom':'right',g=O(i)[a];s[c]-g<p[f]&&(e.offsets.popper[f]-=p[f]-(s[c]-g)),s[f]+g>p[c]&&(e.offsets.popper[f]+=s[f]+g-p[c]);var u=s[f]+s[a]/2-g/2,b=t(e.instance.popper,'margin'+l).replace('px',''),y=u-h(e.offsets.popper)[f]-b;return y=X(V(p[a]-g,y),0),e.arrowElement=i,e.offsets.arrow={},e.offsets.arrow[f]=Math.round(y),e.offsets.arrow[m]='',e},element:'[x-arrow]'},flip:{order:600,enabled:!0,fn:function(e,t){if(W(e.instance.modifiers,'inner'))return e;if(e.flipped&&e.placement===e.originalPlacement)return e;var o=w(e.instance.popper,e.instance.reference,t.padding,t.boundariesElement),i=e.placement.split('-')[0],n=L(i),r=e.placement.split('-')[1]||'',p=[];switch(t.behavior){case fe.FLIP:p=[i,n];break;case fe.CLOCKWISE:p=K(i);break;case fe.COUNTERCLOCKWISE:p=K(i,!0);break;default:p=t.behavior;}return p.forEach(function(s,d){if(i!==s||p.length===d+1)return e;i=e.placement.split('-')[0],n=L(i);var a=e.offsets.popper,l=e.offsets.reference,f=_,m='left'===i&&f(a.right)>f(l.left)||'right'===i&&f(a.left)<f(l.right)||'top'===i&&f(a.bottom)>f(l.top)||'bottom'===i&&f(a.top)<f(l.bottom),c=f(a.left)<f(o.left),h=f(a.right)>f(o.right),g=f(a.top)<f(o.top),u=f(a.bottom)>f(o.bottom),b='left'===i&&c||'right'===i&&h||'top'===i&&g||'bottom'===i&&u,y=-1!==['top','bottom'].indexOf(i),w=!!t.flipVariations&&(y&&'start'===r&&c||y&&'end'===r&&h||!y&&'start'===r&&g||!y&&'end'===r&&u);(m||b||w)&&(e.flipped=!0,(m||b)&&(i=p[d+1]),w&&(r=j(r)),e.placement=i+(r?'-'+r:''),e.offsets.popper=de({},e.offsets.popper,S(e.instance.popper,e.offsets.reference,e.placement)),e=N(e.instance.modifiers,e,'flip'))}),e},behavior:'flip',padding:5,boundariesElement:'viewport'},inner:{order:700,enabled:!1,fn:function(e){var t=e.placement,o=t.split('-')[0],i=e.offsets,n=i.popper,r=i.reference,p=-1!==['left','right'].indexOf(o),s=-1===['top','left'].indexOf(o);return n[p?'left':'top']=r[o]-(s?n[p?'width':'height']:0),e.placement=L(t),e.offsets.popper=h(n),e}},hide:{order:800,enabled:!0,fn:function(e){if(!F(e.instance.modifiers,'hide','preventOverflow'))return e;var t=e.offsets.reference,o=T(e.instance.modifiers,function(e){return'preventOverflow'===e.name}).boundaries;if(t.bottom<o.top||t.left>o.right||t.top>o.bottom||t.right<o.left){if(!0===e.hide)return e;e.hide=!0,e.attributes['x-out-of-boundaries']=''}else{if(!1===e.hide)return e;e.hide=!1,e.attributes['x-out-of-boundaries']=!1}return e}},computeStyle:{order:850,enabled:!0,fn:function(e,t){var o=t.x,i=t.y,n=e.offsets.popper,p=T(e.instance.modifiers,function(e){return'applyStyle'===e.name}).gpuAcceleration;void 0!==p&&console.warn('WARNING: `gpuAcceleration` option moved to `computeStyle` modifier and will not be supported in future versions of Popper.js!');var s,d,a=void 0===p?t.gpuAcceleration:p,l=r(e.instance.popper),f=g(l),m={position:n.position},c={left:_(n.left),top:_(n.top),bottom:_(n.bottom),right:_(n.right)},h='bottom'===o?'top':'bottom',u='right'===i?'left':'right',b=B('transform');if(d='bottom'==h?-f.height+c.bottom:c.top,s='right'==u?-f.width+c.right:c.left,a&&b)m[b]='translate3d('+s+'px, '+d+'px, 0)',m[h]=0,m[u]=0,m.willChange='transform';else{var y='bottom'==h?-1:1,w='right'==u?-1:1;m[h]=d*y,m[u]=s*w,m.willChange=h+', '+u}var E={"x-placement":e.placement};return e.attributes=de({},E,e.attributes),e.styles=de({},m,e.styles),e.arrowStyles=de({},e.offsets.arrow,e.arrowStyles),e},gpuAcceleration:!0,x:'bottom',y:'right'},applyStyle:{order:900,enabled:!0,fn:function(e){return U(e.instance.popper,e.styles),Y(e.instance.popper,e.attributes),e.arrowElement&&Object.keys(e.arrowStyles).length&&U(e.arrowElement,e.arrowStyles),e},onLoad:function(e,t,o,i,n){var r=x(n,t,e),p=v(o.placement,r,t,e,o.modifiers.flip.boundariesElement,o.modifiers.flip.padding);return t.setAttribute('x-placement',p),U(t,{position:'absolute'}),o},gpuAcceleration:void 0}}},me});
//# sourceMappingURL=popper.min.js.map

;/*! Magnific Popup - v1.1.0 - 2016-02-20
* http://dimsemenov.com/plugins/magnific-popup/
* Copyright (c) 2016 Dmitry Semenov; */
!function(a){"function"==typeof define&&define.amd?define(["jquery"],a):a("object"==typeof exports?require("jquery"):window.jQuery||window.Zepto)}(function(a){var b,c,d,e,f,g,h="Close",i="BeforeClose",j="AfterClose",k="BeforeAppend",l="MarkupParse",m="Open",n="Change",o="mfp",p="."+o,q="mfp-ready",r="mfp-removing",s="mfp-prevent-close",t=function(){},u=!!window.jQuery,v=a(window),w=function(a,c){b.ev.on(o+a+p,c)},x=function(b,c,d,e){var f=document.createElement("div");return f.className="mfp-"+b,d&&(f.innerHTML=d),e?c&&c.appendChild(f):(f=a(f),c&&f.appendTo(c)),f},y=function(c,d){b.ev.triggerHandler(o+c,d),b.st.callbacks&&(c=c.charAt(0).toLowerCase()+c.slice(1),b.st.callbacks[c]&&b.st.callbacks[c].apply(b,a.isArray(d)?d:[d]))},z=function(c){return c===g&&b.currTemplate.closeBtn||(b.currTemplate.closeBtn=a(b.st.closeMarkup.replace("%title%",b.st.tClose)),g=c),b.currTemplate.closeBtn},A=function(){a.magnificPopup.instance||(b=new t,b.init(),a.magnificPopup.instance=b)},B=function(){var a=document.createElement("p").style,b=["ms","O","Moz","Webkit"];if(void 0!==a.transition)return!0;for(;b.length;)if(b.pop()+"Transition"in a)return!0;return!1};t.prototype={constructor:t,init:function(){var c=navigator.appVersion;b.isLowIE=b.isIE8=document.all&&!document.addEventListener,b.isAndroid=/android/gi.test(c),b.isIOS=/iphone|ipad|ipod/gi.test(c),b.supportsTransition=B(),b.probablyMobile=b.isAndroid||b.isIOS||/(Opera Mini)|Kindle|webOS|BlackBerry|(Opera Mobi)|(Windows Phone)|IEMobile/i.test(navigator.userAgent),d=a(document),b.popupsCache={}},open:function(c){var e;if(c.isObj===!1){b.items=c.items.toArray(),b.index=0;var g,h=c.items;for(e=0;e<h.length;e++)if(g=h[e],g.parsed&&(g=g.el[0]),g===c.el[0]){b.index=e;break}}else b.items=a.isArray(c.items)?c.items:[c.items],b.index=c.index||0;if(b.isOpen)return void b.updateItemHTML();b.types=[],f="",c.mainEl&&c.mainEl.length?b.ev=c.mainEl.eq(0):b.ev=d,c.key?(b.popupsCache[c.key]||(b.popupsCache[c.key]={}),b.currTemplate=b.popupsCache[c.key]):b.currTemplate={},b.st=a.extend(!0,{},a.magnificPopup.defaults,c),b.fixedContentPos="auto"===b.st.fixedContentPos?!b.probablyMobile:b.st.fixedContentPos,b.st.modal&&(b.st.closeOnContentClick=!1,b.st.closeOnBgClick=!1,b.st.showCloseBtn=!1,b.st.enableEscapeKey=!1),b.bgOverlay||(b.bgOverlay=x("bg").on("click"+p,function(){b.close()}),b.wrap=x("wrap").attr("tabindex",-1).on("click"+p,function(a){b._checkIfClose(a.target)&&b.close()}),b.container=x("container",b.wrap)),b.contentContainer=x("content"),b.st.preloader&&(b.preloader=x("preloader",b.container,b.st.tLoading));var i=a.magnificPopup.modules;for(e=0;e<i.length;e++){var j=i[e];j=j.charAt(0).toUpperCase()+j.slice(1),b["init"+j].call(b)}y("BeforeOpen"),b.st.showCloseBtn&&(b.st.closeBtnInside?(w(l,function(a,b,c,d){c.close_replaceWith=z(d.type)}),f+=" mfp-close-btn-in"):b.wrap.append(z())),b.st.alignTop&&(f+=" mfp-align-top"),b.fixedContentPos?b.wrap.css({overflow:b.st.overflowY,overflowX:"hidden",overflowY:b.st.overflowY}):b.wrap.css({top:v.scrollTop(),position:"absolute"}),(b.st.fixedBgPos===!1||"auto"===b.st.fixedBgPos&&!b.fixedContentPos)&&b.bgOverlay.css({height:d.height(),position:"absolute"}),b.st.enableEscapeKey&&d.on("keyup"+p,function(a){27===a.keyCode&&b.close()}),v.on("resize"+p,function(){b.updateSize()}),b.st.closeOnContentClick||(f+=" mfp-auto-cursor"),f&&b.wrap.addClass(f);var k=b.wH=v.height(),n={};if(b.fixedContentPos&&b._hasScrollBar(k)){var o=b._getScrollbarSize();o&&(n.marginRight=o)}b.fixedContentPos&&(b.isIE7?a("body, html").css("overflow","hidden"):n.overflow="hidden");var r=b.st.mainClass;return b.isIE7&&(r+=" mfp-ie7"),r&&b._addClassToMFP(r),b.updateItemHTML(),y("BuildControls"),a("html").css(n),b.bgOverlay.add(b.wrap).prependTo(b.st.prependTo||a(document.body)),b._lastFocusedEl=document.activeElement,setTimeout(function(){b.content?(b._addClassToMFP(q),b._setFocus()):b.bgOverlay.addClass(q),d.on("focusin"+p,b._onFocusIn)},16),b.isOpen=!0,b.updateSize(k),y(m),c},close:function(){b.isOpen&&(y(i),b.isOpen=!1,b.st.removalDelay&&!b.isLowIE&&b.supportsTransition?(b._addClassToMFP(r),setTimeout(function(){b._close()},b.st.removalDelay)):b._close())},_close:function(){y(h);var c=r+" "+q+" ";if(b.bgOverlay.detach(),b.wrap.detach(),b.container.empty(),b.st.mainClass&&(c+=b.st.mainClass+" "),b._removeClassFromMFP(c),b.fixedContentPos){var e={marginRight:""};b.isIE7?a("body, html").css("overflow",""):e.overflow="",a("html").css(e)}d.off("keyup"+p+" focusin"+p),b.ev.off(p),b.wrap.attr("class","mfp-wrap").removeAttr("style"),b.bgOverlay.attr("class","mfp-bg"),b.container.attr("class","mfp-container"),!b.st.showCloseBtn||b.st.closeBtnInside&&b.currTemplate[b.currItem.type]!==!0||b.currTemplate.closeBtn&&b.currTemplate.closeBtn.detach(),b.st.autoFocusLast&&b._lastFocusedEl&&a(b._lastFocusedEl).focus(),b.currItem=null,b.content=null,b.currTemplate=null,b.prevHeight=0,y(j)},updateSize:function(a){if(b.isIOS){var c=document.documentElement.clientWidth/window.innerWidth,d=window.innerHeight*c;b.wrap.css("height",d),b.wH=d}else b.wH=a||v.height();b.fixedContentPos||b.wrap.css("height",b.wH),y("Resize")},updateItemHTML:function(){var c=b.items[b.index];b.contentContainer.detach(),b.content&&b.content.detach(),c.parsed||(c=b.parseEl(b.index));var d=c.type;if(y("BeforeChange",[b.currItem?b.currItem.type:"",d]),b.currItem=c,!b.currTemplate[d]){var f=b.st[d]?b.st[d].markup:!1;y("FirstMarkupParse",f),f?b.currTemplate[d]=a(f):b.currTemplate[d]=!0}e&&e!==c.type&&b.container.removeClass("mfp-"+e+"-holder");var g=b["get"+d.charAt(0).toUpperCase()+d.slice(1)](c,b.currTemplate[d]);b.appendContent(g,d),c.preloaded=!0,y(n,c),e=c.type,b.container.prepend(b.contentContainer),y("AfterChange")},appendContent:function(a,c){b.content=a,a?b.st.showCloseBtn&&b.st.closeBtnInside&&b.currTemplate[c]===!0?b.content.find(".mfp-close").length||b.content.append(z()):b.content=a:b.content="",y(k),b.container.addClass("mfp-"+c+"-holder"),b.contentContainer.append(b.content)},parseEl:function(c){var d,e=b.items[c];if(e.tagName?e={el:a(e)}:(d=e.type,e={data:e,src:e.src}),e.el){for(var f=b.types,g=0;g<f.length;g++)if(e.el.hasClass("mfp-"+f[g])){d=f[g];break}e.src=e.el.attr("data-mfp-src"),e.src||(e.src=e.el.attr("href"))}return e.type=d||b.st.type||"inline",e.index=c,e.parsed=!0,b.items[c]=e,y("ElementParse",e),b.items[c]},addGroup:function(a,c){var d=function(d){d.mfpEl=this,b._openClick(d,a,c)};c||(c={});var e="click.magnificPopup";c.mainEl=a,c.items?(c.isObj=!0,a.off(e).on(e,d)):(c.isObj=!1,c.delegate?a.off(e).on(e,c.delegate,d):(c.items=a,a.off(e).on(e,d)))},_openClick:function(c,d,e){var f=void 0!==e.midClick?e.midClick:a.magnificPopup.defaults.midClick;if(f||!(2===c.which||c.ctrlKey||c.metaKey||c.altKey||c.shiftKey)){var g=void 0!==e.disableOn?e.disableOn:a.magnificPopup.defaults.disableOn;if(g)if(a.isFunction(g)){if(!g.call(b))return!0}else if(v.width()<g)return!0;c.type&&(c.preventDefault(),b.isOpen&&c.stopPropagation()),e.el=a(c.mfpEl),e.delegate&&(e.items=d.find(e.delegate)),b.open(e)}},updateStatus:function(a,d){if(b.preloader){c!==a&&b.container.removeClass("mfp-s-"+c),d||"loading"!==a||(d=b.st.tLoading);var e={status:a,text:d};y("UpdateStatus",e),a=e.status,d=e.text,b.preloader.html(d),b.preloader.find("a").on("click",function(a){a.stopImmediatePropagation()}),b.container.addClass("mfp-s-"+a),c=a}},_checkIfClose:function(c){if(!a(c).hasClass(s)){var d=b.st.closeOnContentClick,e=b.st.closeOnBgClick;if(d&&e)return!0;if(!b.content||a(c).hasClass("mfp-close")||b.preloader&&c===b.preloader[0])return!0;if(c===b.content[0]||a.contains(b.content[0],c)){if(d)return!0}else if(e&&a.contains(document,c))return!0;return!1}},_addClassToMFP:function(a){b.bgOverlay.addClass(a),b.wrap.addClass(a)},_removeClassFromMFP:function(a){this.bgOverlay.removeClass(a),b.wrap.removeClass(a)},_hasScrollBar:function(a){return(b.isIE7?d.height():document.body.scrollHeight)>(a||v.height())},_setFocus:function(){(b.st.focus?b.content.find(b.st.focus).eq(0):b.wrap).focus()},_onFocusIn:function(c){return c.target===b.wrap[0]||a.contains(b.wrap[0],c.target)?void 0:(b._setFocus(),!1)},_parseMarkup:function(b,c,d){var e;d.data&&(c=a.extend(d.data,c)),y(l,[b,c,d]),a.each(c,function(c,d){if(void 0===d||d===!1)return!0;if(e=c.split("_"),e.length>1){var f=b.find(p+"-"+e[0]);if(f.length>0){var g=e[1];"replaceWith"===g?f[0]!==d[0]&&f.replaceWith(d):"img"===g?f.is("img")?f.attr("src",d):f.replaceWith(a("<img>").attr("src",d).attr("class",f.attr("class"))):f.attr(e[1],d)}}else b.find(p+"-"+c).html(d)})},_getScrollbarSize:function(){if(void 0===b.scrollbarSize){var a=document.createElement("div");a.style.cssText="width: 99px; height: 99px; overflow: scroll; position: absolute; top: -9999px;",document.body.appendChild(a),b.scrollbarSize=a.offsetWidth-a.clientWidth,document.body.removeChild(a)}return b.scrollbarSize}},a.magnificPopup={instance:null,proto:t.prototype,modules:[],open:function(b,c){return A(),b=b?a.extend(!0,{},b):{},b.isObj=!0,b.index=c||0,this.instance.open(b)},close:function(){return a.magnificPopup.instance&&a.magnificPopup.instance.close()},registerModule:function(b,c){c.options&&(a.magnificPopup.defaults[b]=c.options),a.extend(this.proto,c.proto),this.modules.push(b)},defaults:{disableOn:0,key:null,midClick:!1,mainClass:"",preloader:!0,focus:"",closeOnContentClick:!1,closeOnBgClick:!0,closeBtnInside:!0,showCloseBtn:!0,enableEscapeKey:!0,modal:!1,alignTop:!1,removalDelay:0,prependTo:null,fixedContentPos:"auto",fixedBgPos:"auto",overflowY:"auto",closeMarkup:'<button title="%title%" type="button" class="mfp-close">&#215;</button>',tClose:"Close (Esc)",tLoading:"Loading...",autoFocusLast:!0}},a.fn.magnificPopup=function(c){A();var d=a(this);if("string"==typeof c)if("open"===c){var e,f=u?d.data("magnificPopup"):d[0].magnificPopup,g=parseInt(arguments[1],10)||0;f.items?e=f.items[g]:(e=d,f.delegate&&(e=e.find(f.delegate)),e=e.eq(g)),b._openClick({mfpEl:e},d,f)}else b.isOpen&&b[c].apply(b,Array.prototype.slice.call(arguments,1));else c=a.extend(!0,{},c),u?d.data("magnificPopup",c):d[0].magnificPopup=c,b.addGroup(d,c);return d};var C,D,E,F="inline",G=function(){E&&(D.after(E.addClass(C)).detach(),E=null)};a.magnificPopup.registerModule(F,{options:{hiddenClass:"hide",markup:"",tNotFound:"Content not found"},proto:{initInline:function(){b.types.push(F),w(h+"."+F,function(){G()})},getInline:function(c,d){if(G(),c.src){var e=b.st.inline,f=a(c.src);if(f.length){var g=f[0].parentNode;g&&g.tagName&&(D||(C=e.hiddenClass,D=x(C),C="mfp-"+C),E=f.after(D).detach().removeClass(C)),b.updateStatus("ready")}else b.updateStatus("error",e.tNotFound),f=a("<div>");return c.inlineElement=f,f}return b.updateStatus("ready"),b._parseMarkup(d,{},c),d}}});var H,I="ajax",J=function(){H&&a(document.body).removeClass(H)},K=function(){J(),b.req&&b.req.abort()};a.magnificPopup.registerModule(I,{options:{settings:null,cursor:"mfp-ajax-cur",tError:'<a href="%url%">The content</a> could not be loaded.'},proto:{initAjax:function(){b.types.push(I),H=b.st.ajax.cursor,w(h+"."+I,K),w("BeforeChange."+I,K)},getAjax:function(c){H&&a(document.body).addClass(H),b.updateStatus("loading");var d=a.extend({url:c.src,success:function(d,e,f){var g={data:d,xhr:f};y("ParseAjax",g),b.appendContent(a(g.data),I),c.finished=!0,J(),b._setFocus(),setTimeout(function(){b.wrap.addClass(q)},16),b.updateStatus("ready"),y("AjaxContentAdded")},error:function(){J(),c.finished=c.loadError=!0,b.updateStatus("error",b.st.ajax.tError.replace("%url%",c.src))}},b.st.ajax.settings);return b.req=a.ajax(d),""}}});var L,M=function(c){if(c.data&&void 0!==c.data.title)return c.data.title;var d=b.st.image.titleSrc;if(d){if(a.isFunction(d))return d.call(b,c);if(c.el)return c.el.attr(d)||""}return""};a.magnificPopup.registerModule("image",{options:{markup:'<div class="mfp-figure"><div class="mfp-close"></div><figure><div class="mfp-img"></div><figcaption><div class="mfp-bottom-bar"><div class="mfp-title"></div><div class="mfp-counter"></div></div></figcaption></figure></div>',cursor:"mfp-zoom-out-cur",titleSrc:"title",verticalFit:!0,tError:'<a href="%url%">The image</a> could not be loaded.'},proto:{initImage:function(){var c=b.st.image,d=".image";b.types.push("image"),w(m+d,function(){"image"===b.currItem.type&&c.cursor&&a(document.body).addClass(c.cursor)}),w(h+d,function(){c.cursor&&a(document.body).removeClass(c.cursor),v.off("resize"+p)}),w("Resize"+d,b.resizeImage),b.isLowIE&&w("AfterChange",b.resizeImage)},resizeImage:function(){var a=b.currItem;if(a&&a.img&&b.st.image.verticalFit){var c=0;b.isLowIE&&(c=parseInt(a.img.css("padding-top"),10)+parseInt(a.img.css("padding-bottom"),10)),a.img.css("max-height",b.wH-c)}},_onImageHasSize:function(a){a.img&&(a.hasSize=!0,L&&clearInterval(L),a.isCheckingImgSize=!1,y("ImageHasSize",a),a.imgHidden&&(b.content&&b.content.removeClass("mfp-loading"),a.imgHidden=!1))},findImageSize:function(a){var c=0,d=a.img[0],e=function(f){L&&clearInterval(L),L=setInterval(function(){return d.naturalWidth>0?void b._onImageHasSize(a):(c>200&&clearInterval(L),c++,void(3===c?e(10):40===c?e(50):100===c&&e(500)))},f)};e(1)},getImage:function(c,d){var e=0,f=function(){c&&(c.img[0].complete?(c.img.off(".mfploader"),c===b.currItem&&(b._onImageHasSize(c),b.updateStatus("ready")),c.hasSize=!0,c.loaded=!0,y("ImageLoadComplete")):(e++,200>e?setTimeout(f,100):g()))},g=function(){c&&(c.img.off(".mfploader"),c===b.currItem&&(b._onImageHasSize(c),b.updateStatus("error",h.tError.replace("%url%",c.src))),c.hasSize=!0,c.loaded=!0,c.loadError=!0)},h=b.st.image,i=d.find(".mfp-img");if(i.length){var j=document.createElement("img");j.className="mfp-img",c.el&&c.el.find("img").length&&(j.alt=c.el.find("img").attr("alt")),c.img=a(j).on("load.mfploader",f).on("error.mfploader",g),j.src=c.src,i.is("img")&&(c.img=c.img.clone()),j=c.img[0],j.naturalWidth>0?c.hasSize=!0:j.width||(c.hasSize=!1)}return b._parseMarkup(d,{title:M(c),img_replaceWith:c.img},c),b.resizeImage(),c.hasSize?(L&&clearInterval(L),c.loadError?(d.addClass("mfp-loading"),b.updateStatus("error",h.tError.replace("%url%",c.src))):(d.removeClass("mfp-loading"),b.updateStatus("ready")),d):(b.updateStatus("loading"),c.loading=!0,c.hasSize||(c.imgHidden=!0,d.addClass("mfp-loading"),b.findImageSize(c)),d)}}});var N,O=function(){return void 0===N&&(N=void 0!==document.createElement("p").style.MozTransform),N};a.magnificPopup.registerModule("zoom",{options:{enabled:!1,easing:"ease-in-out",duration:300,opener:function(a){return a.is("img")?a:a.find("img")}},proto:{initZoom:function(){var a,c=b.st.zoom,d=".zoom";if(c.enabled&&b.supportsTransition){var e,f,g=c.duration,j=function(a){var b=a.clone().removeAttr("style").removeAttr("class").addClass("mfp-animated-image"),d="all "+c.duration/1e3+"s "+c.easing,e={position:"fixed",zIndex:9999,left:0,top:0,"-webkit-backface-visibility":"hidden"},f="transition";return e["-webkit-"+f]=e["-moz-"+f]=e["-o-"+f]=e[f]=d,b.css(e),b},k=function(){b.content.css("visibility","visible")};w("BuildControls"+d,function(){if(b._allowZoom()){if(clearTimeout(e),b.content.css("visibility","hidden"),a=b._getItemToZoom(),!a)return void k();f=j(a),f.css(b._getOffset()),b.wrap.append(f),e=setTimeout(function(){f.css(b._getOffset(!0)),e=setTimeout(function(){k(),setTimeout(function(){f.remove(),a=f=null,y("ZoomAnimationEnded")},16)},g)},16)}}),w(i+d,function(){if(b._allowZoom()){if(clearTimeout(e),b.st.removalDelay=g,!a){if(a=b._getItemToZoom(),!a)return;f=j(a)}f.css(b._getOffset(!0)),b.wrap.append(f),b.content.css("visibility","hidden"),setTimeout(function(){f.css(b._getOffset())},16)}}),w(h+d,function(){b._allowZoom()&&(k(),f&&f.remove(),a=null)})}},_allowZoom:function(){return"image"===b.currItem.type},_getItemToZoom:function(){return b.currItem.hasSize?b.currItem.img:!1},_getOffset:function(c){var d;d=c?b.currItem.img:b.st.zoom.opener(b.currItem.el||b.currItem);var e=d.offset(),f=parseInt(d.css("padding-top"),10),g=parseInt(d.css("padding-bottom"),10);e.top-=a(window).scrollTop()-f;var h={width:d.width(),height:(u?d.innerHeight():d[0].offsetHeight)-g-f};return O()?h["-moz-transform"]=h.transform="translate("+e.left+"px,"+e.top+"px)":(h.left=e.left,h.top=e.top),h}}});var P="iframe",Q="//about:blank",R=function(a){if(b.currTemplate[P]){var c=b.currTemplate[P].find("iframe");c.length&&(a||(c[0].src=Q),b.isIE8&&c.css("display",a?"block":"none"))}};a.magnificPopup.registerModule(P,{options:{markup:'<div class="mfp-iframe-scaler"><div class="mfp-close"></div><iframe class="mfp-iframe" src="//about:blank" frameborder="0" allowfullscreen></iframe></div>',srcAction:"iframe_src",patterns:{youtube:{index:"youtube.com",id:"v=",src:"//www.youtube.com/embed/%id%?autoplay=1"},vimeo:{index:"vimeo.com/",id:"/",src:"//player.vimeo.com/video/%id%?autoplay=1"},gmaps:{index:"//maps.google.",src:"%id%&output=embed"}}},proto:{initIframe:function(){b.types.push(P),w("BeforeChange",function(a,b,c){b!==c&&(b===P?R():c===P&&R(!0))}),w(h+"."+P,function(){R()})},getIframe:function(c,d){var e=c.src,f=b.st.iframe;a.each(f.patterns,function(){return e.indexOf(this.index)>-1?(this.id&&(e="string"==typeof this.id?e.substr(e.lastIndexOf(this.id)+this.id.length,e.length):this.id.call(this,e)),e=this.src.replace("%id%",e),!1):void 0});var g={};return f.srcAction&&(g[f.srcAction]=e),b._parseMarkup(d,g,c),b.updateStatus("ready"),d}}});var S=function(a){var c=b.items.length;return a>c-1?a-c:0>a?c+a:a},T=function(a,b,c){return a.replace(/%curr%/gi,b+1).replace(/%total%/gi,c)};a.magnificPopup.registerModule("gallery",{options:{enabled:!1,arrowMarkup:'<button title="%title%" type="button" class="mfp-arrow mfp-arrow-%dir%"></button>',preload:[0,2],navigateByImgClick:!0,arrows:!0,tPrev:"Previous (Left arrow key)",tNext:"Next (Right arrow key)",tCounter:"%curr% of %total%"},proto:{initGallery:function(){var c=b.st.gallery,e=".mfp-gallery";return b.direction=!0,c&&c.enabled?(f+=" mfp-gallery",w(m+e,function(){c.navigateByImgClick&&b.wrap.on("click"+e,".mfp-img",function(){return b.items.length>1?(b.next(),!1):void 0}),d.on("keydown"+e,function(a){37===a.keyCode?b.prev():39===a.keyCode&&b.next()})}),w("UpdateStatus"+e,function(a,c){c.text&&(c.text=T(c.text,b.currItem.index,b.items.length))}),w(l+e,function(a,d,e,f){var g=b.items.length;e.counter=g>1?T(c.tCounter,f.index,g):""}),w("BuildControls"+e,function(){if(b.items.length>1&&c.arrows&&!b.arrowLeft){var d=c.arrowMarkup,e=b.arrowLeft=a(d.replace(/%title%/gi,c.tPrev).replace(/%dir%/gi,"left")).addClass(s),f=b.arrowRight=a(d.replace(/%title%/gi,c.tNext).replace(/%dir%/gi,"right")).addClass(s);e.click(function(){b.prev()}),f.click(function(){b.next()}),b.container.append(e.add(f))}}),w(n+e,function(){b._preloadTimeout&&clearTimeout(b._preloadTimeout),b._preloadTimeout=setTimeout(function(){b.preloadNearbyImages(),b._preloadTimeout=null},16)}),void w(h+e,function(){d.off(e),b.wrap.off("click"+e),b.arrowRight=b.arrowLeft=null})):!1},next:function(){b.direction=!0,b.index=S(b.index+1),b.updateItemHTML()},prev:function(){b.direction=!1,b.index=S(b.index-1),b.updateItemHTML()},goTo:function(a){b.direction=a>=b.index,b.index=a,b.updateItemHTML()},preloadNearbyImages:function(){var a,c=b.st.gallery.preload,d=Math.min(c[0],b.items.length),e=Math.min(c[1],b.items.length);for(a=1;a<=(b.direction?e:d);a++)b._preloadItem(b.index+a);for(a=1;a<=(b.direction?d:e);a++)b._preloadItem(b.index-a)},_preloadItem:function(c){if(c=S(c),!b.items[c].preloaded){var d=b.items[c];d.parsed||(d=b.parseEl(c)),y("LazyLoad",d),"image"===d.type&&(d.img=a('<img class="mfp-img" />').on("load.mfploader",function(){d.hasSize=!0}).on("error.mfploader",function(){d.hasSize=!0,d.loadError=!0,y("LazyLoadError",d)}).attr("src",d.src)),d.preloaded=!0}}}});var U="retina";a.magnificPopup.registerModule(U,{options:{replaceSrc:function(a){return a.src.replace(/\.\w+$/,function(a){return"@2x"+a})},ratio:1},proto:{initRetina:function(){if(window.devicePixelRatio>1){var a=b.st.retina,c=a.ratio;c=isNaN(c)?c():c,c>1&&(w("ImageHasSize."+U,function(a,b){b.img.css({"max-width":b.img[0].naturalWidth/c,width:"100%"})}),w("ElementParse."+U,function(b,d){d.src=a.replaceSrc(d,c)}))}}}}),A()});
;/**
 * Minified by jsDelivr using Terser v3.14.1.
 * Original file: /gh/stevenschobert/instafeed.js@2.0.0rc1/src/instafeed.js
 *
 * Do NOT use SRI with dynamically generated files! More information: https://www.jsdelivr.com/using-sri-with-dynamic-files
 */
!function(e,t){"function"==typeof define&&define.amd?define([],t):"object"==typeof exports&&"string"!=typeof exports.nodeName?module.exports=t():e.Instafeed=t()}(this,function(){function e(e,t){if(!e)throw new Error(t)}function t(t){e(!t||"object"==typeof t,"options must be an object, got "+t+" ("+typeof t+")");var o={accessToken:null,accessTokenTimeout:5e3,after:null,apiTimeout:5e3,debug:!1,error:null,filter:null,limit:null,mock:!1,render:null,sort:null,success:null,target:"instafeed",template:'<a href="{{link}}"><img title="{{caption}}" src="{{image}}" /></a>',templateBoundaries:["{{","}}"],transform:null};if(t)for(var n in o)void 0!==t[n]&&(o[n]=t[n]);e("string"==typeof o.target||"object"==typeof o.target,"target must be a string or DOM node, got "+o.target+" ("+typeof o.target+")"),e("string"==typeof o.accessToken||"function"==typeof o.accessToken,"accessToken must be a string or function, got "+o.accessToken+" ("+typeof o.accessToken+")"),e("number"==typeof o.accessTokenTimeout,"accessTokenTimeout must be a number, got "+o.accessTokenTimeout+" ("+typeof o.accessTokenTimeout+")"),e("number"==typeof o.apiTimeout,"apiTimeout must be a number, got "+o.apiTimeout+" ("+typeof o.apiTimeout+")"),e("boolean"==typeof o.debug,"debug must be true or false, got "+o.debug+" ("+typeof o.debug+")"),e("boolean"==typeof o.mock,"mock must be true or false, got "+o.mock+" ("+typeof o.mock+")"),e("object"==typeof o.templateBoundaries&&2===o.templateBoundaries.length&&"string"==typeof o.templateBoundaries[0]&&"string"==typeof o.templateBoundaries[1],"templateBoundaries must be an array of 2 strings, got "+o.templateBoundaries+" ("+typeof o.templateBoundaries+")"),e(!o.template||"string"==typeof o.template,"template must null or string, got "+o.template+" ("+typeof o.template+")"),e(!o.error||"function"==typeof o.error,"error must be null or function, got "+o.error+" ("+typeof o.error+")"),e(!o.after||"function"==typeof o.after,"after must be null or function, got "+o.after+" ("+typeof o.after+")"),e(!o.success||"function"==typeof o.success,"success must be null or function, got "+o.success+" ("+typeof o.success+")"),e(!o.filter||"function"==typeof o.filter,"filter must be null or function, got "+o.filter+" ("+typeof o.filter+")"),e(!o.transform||"function"==typeof o.transform,"transform must be null or function, got "+o.transform+" ("+typeof o.transform+")"),e(!o.sort||"function"==typeof o.sort,"sort must be null or function, got "+o.sort+" ("+typeof o.sort+")"),e(!o.render||"function"==typeof o.render,"render must be null or function, got "+o.render+" ("+typeof o.render+")"),e(!o.limit||"number"==typeof o.limit,"limit must be null or number, got "+o.limit+" ("+typeof o.limit+")"),this._state={running:!1},this._options=o}return t.prototype.run=function(){var e=this,t=null,o=null,n=null,r=null;return this._debug("run","options",this._options),this._debug("run","state",this._state),this._state.running?(this._debug("run","already running, skipping"),!1):(this._state.running=!0,this._debug("run","getting dom node"),(t="string"==typeof this._options.target?document.getElementById(this._options.target):this._options.target)?(this._debug("run","got dom node",t),this._debug("run","getting access token"),this._getAccessToken(function(s,i){if(s)return e._debug("onTokenReceived","error",s),void e._fail(new Error("error getting access token: "+s.message));o="https://graph.instagram.com/me/media?fields=caption,id,media_type,media_url,permalink,thumbnail_url,timestamp,username&access_token="+i,e._debug("onTokenReceived","request url",o),e._makeApiRequest(o,function(o,s){if(o)return e._debug("onResponseReceived","error",o),void e._fail(new Error("api request error: "+o.message));e._debug("onResponseReceived","data",s),e._success(s);try{n=e._processData(s),e._debug("onResponseReceived","processed data",n)}catch(t){return void e._fail(t)}if(e._options.mock)e._debug("onResponseReceived","mock enabled, skipping render");else{try{r=e._renderData(n),e._debug("onResponseReceived","html content",r)}catch(t){return void e._fail(t)}t.innerHTML=r}e._finish()})}),!0):(this._fail(new Error("no element found with ID "+this._options.target)),!1))},t.prototype._processData=function(e){var t="function"==typeof this._options.transform,o="function"==typeof this._options.filter,n="function"==typeof this._options.sort,r="number"==typeof this._options.limit,s=[],i=null,a=null,u=null,c=null;if(this._debug("processData","hasFilter",o,"hasTransform",t,"hasSort",n,"hasLimit",r),"object"!=typeof e||"object"!=typeof e.data||e.data.length<=0)return null;for(var l=0;l<e.data.length;l++){if(a=this._getItemData(e.data[l]),t)try{u=this._options.transform(a),this._debug("processData","transformed item",a,u)}catch(e){throw this._debug("processData","error calling transform",e),new Error("error in transform: "+e.message)}else u=a;if(o){try{c=this._options.filter(u),this._debug("processData","filter item result",u,c)}catch(e){throw this._debug("processData","error calling filter",e),new Error("error in filter: "+e.message)}c&&s.push(u)}else s.push(u)}if(n)try{s.sort(this._options.sort)}catch(e){throw this._debug("processData","error calling sort",e),new Error("error in sort: "+e.message)}return r&&(i=s.length-this._options.limit,this._debug("processData","checking limit",s.length,this._options.limit,i),i>0&&s.splice(s.length-i,i)),s},t.prototype._getItemData=function(e){var t=null,o=null;switch(e.media_type){case"IMAGE":t="image",o=e.media_url;break;case"VIDEO":t="video",o=e.thumbnail_url;break;case"CAROUSEL_ALBUM":t="album",o=e.media_url}return{caption:e.caption,id:e.id,image:o,link:e.permalink,model:e,timestamp:e.timestamp,type:t,username:e.username}},t.prototype._renderData=function(e){var t="string"==typeof this._options.template,o="function"==typeof this._options.render,n=null,r=null,s="";if(this._debug("renderData","hasTemplate",t,"hasRender",o),"object"!=typeof e||e.length<=0)return null;for(var i=0;i<e.length;i++){if(n=e[i],o)try{r=this._options.render(n,this._options),this._debug("renderData","custom render result",n,r)}catch(e){throw this._debug("renderData","error calling render",e),new Error("error in render: "+e.message)}else t&&(r=this._basicRender(n));r?s+=r:this._debug("renderData","render item did not return any content",n)}return s},t.prototype._basicRender=function(e){for(var t=new RegExp(this._options.templateBoundaries[0]+"([\\s\\w.]+)"+this._options.templateBoundaries[1],"gm"),o=this._options.template,n=null,r="",s=0,i=null,a=null;null!==(n=t.exec(o));)i=n[1],r+=o.slice(s,n.index),(a=this._valueForKeyPath(i,e))&&(r+=a.toString()),s=t.lastIndex;return s<o.length&&(r+=o.slice(s,o.length)),r},t.prototype._valueForKeyPath=function(e,t){for(var o=/([\w]+)/gm,n=null,r=t;null!==(n=o.exec(e));){if("object"!=typeof r)return null;r=r[n[1]]}return r},t.prototype._fail=function(e){!this._runHook("error",e)&&console&&"function"==typeof console.error&&console.error(e),this._state.running=!1},t.prototype._finish=function(){this._runHook("after"),this._state.running=!1},t.prototype._success=function(e){this._runHook("success",e),this._state.running=!1},t.prototype._makeApiRequest=function(e,t){var o=!1,n=this,r=null,s=function(e,n){o||(o=!0,t(e,n))};(r=new XMLHttpRequest).timeout=this._options.apiTimeout,r.ontimeout=function(e){s(new Error("api request timed out"))},r.onerror=function(e){s(new Error("api connection error"))},r.onload=function(e){var t=r.getResponseHeader("Content-Type"),o=null;if(n._debug("apiRequestOnLoad","loaded",e),n._debug("apiRequestOnLoad","response status",r.status),n._debug("apiRequestOnLoad","response content type",t),t.indexOf("application/json")>=0)try{o=JSON.parse(r.responseText)}catch(e){return n._debug("apiRequestOnLoad","json parsing error",e,r.responseText),void s(new Error("error parsing response json"))}200===r.status?s(null,o):o&&o.error?s(new Error(o.error.code+" "+o.error.message)):s(new Error("status code "+r.status))},r.open("GET",e,!0),r.send()},t.prototype._getAccessToken=function(e){var t=!1,o=this,n=null,r=function(o,r){t||(t=!0,clearTimeout(n),e(o,r))};if("function"==typeof this._options.accessToken){this._debug("getAccessToken","calling accessToken as function"),n=setTimeout(function(){o._debug("getAccessToken","timeout check",t),r(new Error("accessToken timed out"),null)},this._options.accessTokenTimeout);try{this._options.accessToken(function(e,n){o._debug("getAccessToken","received accessToken callback",t,e,n),r(e,n)})}catch(e){this._debug("getAccessToken","error invoking the accessToken as function",e),r(e,null)}}else this._debug("getAccessToken","treating accessToken as static",typeof this._options.accessToken),r(null,this._options.accessToken)},t.prototype._debug=function(){var e=null;this._options.debug&&console&&"function"==typeof console.log&&((e=[].slice.call(arguments))[0]="[Instafeed] ["+e[0]+"]",console.log.apply(null,e))},t.prototype._runHook=function(e,t){var o=!1;if("function"==typeof this._options[e])try{this._options[e](t),o=!0}catch(t){this._debug("runHook","error calling hook",e,t)}return o},t});
//# sourceMappingURL=/sm/7375005df0262afee46d9909b531249f68a482b6940d7c04cd41df598818e2c9.map
;/**
 * Owl Carousel v2.2.1
 * Copyright 2013-2017 David Deutsch
 * Licensed under  ()
 */
!function(a,b,c,d){function e(b,c){this.settings=null,this.options=a.extend({},e.Defaults,c),this.$element=a(b),this._handlers={},this._plugins={},this._supress={},this._current=null,this._speed=null,this._coordinates=[],this._breakpoint=null,this._width=null,this._items=[],this._clones=[],this._mergers=[],this._widths=[],this._invalidated={},this._pipe=[],this._drag={time:null,target:null,pointer:null,stage:{start:null,current:null},direction:null},this._states={current:{},tags:{initializing:["busy"],animating:["busy"],dragging:["interacting"]}},a.each(["onResize","onThrottledResize"],a.proxy(function(b,c){this._handlers[c]=a.proxy(this[c],this)},this)),a.each(e.Plugins,a.proxy(function(a,b){this._plugins[a.charAt(0).toLowerCase()+a.slice(1)]=new b(this)},this)),a.each(e.Workers,a.proxy(function(b,c){this._pipe.push({filter:c.filter,run:a.proxy(c.run,this)})},this)),this.setup(),this.initialize()}e.Defaults={items:3,loop:!1,center:!1,rewind:!1,mouseDrag:!0,touchDrag:!0,pullDrag:!0,freeDrag:!1,margin:0,stagePadding:0,merge:!1,mergeFit:!0,autoWidth:!1,startPosition:0,rtl:!1,smartSpeed:250,fluidSpeed:!1,dragEndSpeed:!1,responsive:{},responsiveRefreshRate:200,responsiveBaseElement:b,fallbackEasing:"swing",info:!1,nestedItemSelector:!1,itemElement:"div",stageElement:"div",refreshClass:"owl-refresh",loadedClass:"owl-loaded",loadingClass:"owl-loading",rtlClass:"owl-rtl",responsiveClass:"owl-responsive",dragClass:"owl-drag",itemClass:"owl-item",stageClass:"owl-stage",stageOuterClass:"owl-stage-outer",grabClass:"owl-grab"},e.Width={Default:"default",Inner:"inner",Outer:"outer"},e.Type={Event:"event",State:"state"},e.Plugins={},e.Workers=[{filter:["width","settings"],run:function(){this._width=this.$element.width()}},{filter:["width","items","settings"],run:function(a){a.current=this._items&&this._items[this.relative(this._current)]}},{filter:["items","settings"],run:function(){this.$stage.children(".cloned").remove()}},{filter:["width","items","settings"],run:function(a){var b=this.settings.margin||"",c=!this.settings.autoWidth,d=this.settings.rtl,e={width:"auto","margin-left":d?b:"","margin-right":d?"":b};!c&&this.$stage.children().css(e),a.css=e}},{filter:["width","items","settings"],run:function(a){var b=(this.width()/this.settings.items).toFixed(3)-this.settings.margin,c=null,d=this._items.length,e=!this.settings.autoWidth,f=[];for(a.items={merge:!1,width:b};d--;)c=this._mergers[d],c=this.settings.mergeFit&&Math.min(c,this.settings.items)||c,a.items.merge=c>1||a.items.merge,f[d]=e?b*c:this._items[d].width();this._widths=f}},{filter:["items","settings"],run:function(){var b=[],c=this._items,d=this.settings,e=Math.max(2*d.items,4),f=2*Math.ceil(c.length/2),g=d.loop&&c.length?d.rewind?e:Math.max(e,f):0,h="",i="";for(g/=2;g--;)b.push(this.normalize(b.length/2,!0)),h+=c[b[b.length-1]][0].outerHTML,b.push(this.normalize(c.length-1-(b.length-1)/2,!0)),i=c[b[b.length-1]][0].outerHTML+i;this._clones=b,a(h).addClass("cloned").appendTo(this.$stage),a(i).addClass("cloned").prependTo(this.$stage)}},{filter:["width","items","settings"],run:function(){for(var a=this.settings.rtl?1:-1,b=this._clones.length+this._items.length,c=-1,d=0,e=0,f=[];++c<b;)d=f[c-1]||0,e=this._widths[this.relative(c)]+this.settings.margin,f.push(d+e*a);this._coordinates=f}},{filter:["width","items","settings"],run:function(){var a=this.settings.stagePadding,b=this._coordinates,c={width:Math.ceil(Math.abs(b[b.length-1]))+2*a,"padding-left":a||"","padding-right":a||""};this.$stage.css(c)}},{filter:["width","items","settings"],run:function(a){var b=this._coordinates.length,c=!this.settings.autoWidth,d=this.$stage.children();if(c&&a.items.merge)for(;b--;)a.css.width=this._widths[this.relative(b)],d.eq(b).css(a.css);else c&&(a.css.width=a.items.width,d.css(a.css))}},{filter:["items"],run:function(){this._coordinates.length<1&&this.$stage.removeAttr("style")}},{filter:["width","items","settings"],run:function(a){a.current=a.current?this.$stage.children().index(a.current):0,a.current=Math.max(this.minimum(),Math.min(this.maximum(),a.current)),this.reset(a.current)}},{filter:["position"],run:function(){this.animate(this.coordinates(this._current))}},{filter:["width","position","items","settings"],run:function(){var a,b,c,d,e=this.settings.rtl?1:-1,f=2*this.settings.stagePadding,g=this.coordinates(this.current())+f,h=g+this.width()*e,i=[];for(c=0,d=this._coordinates.length;c<d;c++)a=this._coordinates[c-1]||0,b=Math.abs(this._coordinates[c])+f*e,(this.op(a,"<=",g)&&this.op(a,">",h)||this.op(b,"<",g)&&this.op(b,">",h))&&i.push(c);this.$stage.children(".active").removeClass("active"),this.$stage.children(":eq("+i.join("), :eq(")+")").addClass("active"),this.settings.center&&(this.$stage.children(".center").removeClass("center"),this.$stage.children().eq(this.current()).addClass("center"))}}],e.prototype.initialize=function(){if(this.enter("initializing"),this.trigger("initialize"),this.$element.toggleClass(this.settings.rtlClass,this.settings.rtl),this.settings.autoWidth&&!this.is("pre-loading")){var b,c,e;b=this.$element.find("img"),c=this.settings.nestedItemSelector?"."+this.settings.nestedItemSelector:d,e=this.$element.children(c).width(),b.length&&e<=0&&this.preloadAutoWidthImages(b)}this.$element.addClass(this.options.loadingClass),this.$stage=a("<"+this.settings.stageElement+' class="'+this.settings.stageClass+'"/>').wrap('<div class="'+this.settings.stageOuterClass+'"/>'),this.$element.append(this.$stage.parent()),this.replace(this.$element.children().not(this.$stage.parent())),this.$element.is(":visible")?this.refresh():this.invalidate("width"),this.$element.removeClass(this.options.loadingClass).addClass(this.options.loadedClass),this.registerEventHandlers(),this.leave("initializing"),this.trigger("initialized")},e.prototype.setup=function(){var b=this.viewport(),c=this.options.responsive,d=-1,e=null;c?(a.each(c,function(a){a<=b&&a>d&&(d=Number(a))}),e=a.extend({},this.options,c[d]),"function"==typeof e.stagePadding&&(e.stagePadding=e.stagePadding()),delete e.responsive,e.responsiveClass&&this.$element.attr("class",this.$element.attr("class").replace(new RegExp("("+this.options.responsiveClass+"-)\\S+\\s","g"),"$1"+d))):e=a.extend({},this.options),this.trigger("change",{property:{name:"settings",value:e}}),this._breakpoint=d,this.settings=e,this.invalidate("settings"),this.trigger("changed",{property:{name:"settings",value:this.settings}})},e.prototype.optionsLogic=function(){this.settings.autoWidth&&(this.settings.stagePadding=!1,this.settings.merge=!1)},e.prototype.prepare=function(b){var c=this.trigger("prepare",{content:b});return c.data||(c.data=a("<"+this.settings.itemElement+"/>").addClass(this.options.itemClass).append(b)),this.trigger("prepared",{content:c.data}),c.data},e.prototype.update=function(){for(var b=0,c=this._pipe.length,d=a.proxy(function(a){return this[a]},this._invalidated),e={};b<c;)(this._invalidated.all||a.grep(this._pipe[b].filter,d).length>0)&&this._pipe[b].run(e),b++;this._invalidated={},!this.is("valid")&&this.enter("valid")},e.prototype.width=function(a){switch(a=a||e.Width.Default){case e.Width.Inner:case e.Width.Outer:return this._width;default:return this._width-2*this.settings.stagePadding+this.settings.margin}},e.prototype.refresh=function(){this.enter("refreshing"),this.trigger("refresh"),this.setup(),this.optionsLogic(),this.$element.addClass(this.options.refreshClass),this.update(),this.$element.removeClass(this.options.refreshClass),this.leave("refreshing"),this.trigger("refreshed")},e.prototype.onThrottledResize=function(){b.clearTimeout(this.resizeTimer),this.resizeTimer=b.setTimeout(this._handlers.onResize,this.settings.responsiveRefreshRate)},e.prototype.onResize=function(){return!!this._items.length&&(this._width!==this.$element.width()&&(!!this.$element.is(":visible")&&(this.enter("resizing"),this.trigger("resize").isDefaultPrevented()?(this.leave("resizing"),!1):(this.invalidate("width"),this.refresh(),this.leave("resizing"),void this.trigger("resized")))))},e.prototype.registerEventHandlers=function(){a.support.transition&&this.$stage.on(a.support.transition.end+".owl.core",a.proxy(this.onTransitionEnd,this)),this.settings.responsive!==!1&&this.on(b,"resize",this._handlers.onThrottledResize),this.settings.mouseDrag&&(this.$element.addClass(this.options.dragClass),this.$stage.on("mousedown.owl.core",a.proxy(this.onDragStart,this)),this.$stage.on("dragstart.owl.core selectstart.owl.core",function(){return!1})),this.settings.touchDrag&&(this.$stage.on("touchstart.owl.core",a.proxy(this.onDragStart,this)),this.$stage.on("touchcancel.owl.core",a.proxy(this.onDragEnd,this)))},e.prototype.onDragStart=function(b){var d=null;3!==b.which&&(a.support.transform?(d=this.$stage.css("transform").replace(/.*\(|\)| /g,"").split(","),d={x:d[16===d.length?12:4],y:d[16===d.length?13:5]}):(d=this.$stage.position(),d={x:this.settings.rtl?d.left+this.$stage.width()-this.width()+this.settings.margin:d.left,y:d.top}),this.is("animating")&&(a.support.transform?this.animate(d.x):this.$stage.stop(),this.invalidate("position")),this.$element.toggleClass(this.options.grabClass,"mousedown"===b.type),this.speed(0),this._drag.time=(new Date).getTime(),this._drag.target=a(b.target),this._drag.stage.start=d,this._drag.stage.current=d,this._drag.pointer=this.pointer(b),a(c).on("mouseup.owl.core touchend.owl.core",a.proxy(this.onDragEnd,this)),a(c).one("mousemove.owl.core touchmove.owl.core",a.proxy(function(b){var d=this.difference(this._drag.pointer,this.pointer(b));a(c).on("mousemove.owl.core touchmove.owl.core",a.proxy(this.onDragMove,this)),Math.abs(d.x)<Math.abs(d.y)&&this.is("valid")||(b.preventDefault(),this.enter("dragging"),this.trigger("drag"))},this)))},e.prototype.onDragMove=function(a){var b=null,c=null,d=null,e=this.difference(this._drag.pointer,this.pointer(a)),f=this.difference(this._drag.stage.start,e);this.is("dragging")&&(a.preventDefault(),this.settings.loop?(b=this.coordinates(this.minimum()),c=this.coordinates(this.maximum()+1)-b,f.x=((f.x-b)%c+c)%c+b):(b=this.settings.rtl?this.coordinates(this.maximum()):this.coordinates(this.minimum()),c=this.settings.rtl?this.coordinates(this.minimum()):this.coordinates(this.maximum()),d=this.settings.pullDrag?-1*e.x/5:0,f.x=Math.max(Math.min(f.x,b+d),c+d)),this._drag.stage.current=f,this.animate(f.x))},e.prototype.onDragEnd=function(b){var d=this.difference(this._drag.pointer,this.pointer(b)),e=this._drag.stage.current,f=d.x>0^this.settings.rtl?"left":"right";a(c).off(".owl.core"),this.$element.removeClass(this.options.grabClass),(0!==d.x&&this.is("dragging")||!this.is("valid"))&&(this.speed(this.settings.dragEndSpeed||this.settings.smartSpeed),this.current(this.closest(e.x,0!==d.x?f:this._drag.direction)),this.invalidate("position"),this.update(),this._drag.direction=f,(Math.abs(d.x)>3||(new Date).getTime()-this._drag.time>300)&&this._drag.target.one("click.owl.core",function(){return!1})),this.is("dragging")&&(this.leave("dragging"),this.trigger("dragged"))},e.prototype.closest=function(b,c){var d=-1,e=30,f=this.width(),g=this.coordinates();return this.settings.freeDrag||a.each(g,a.proxy(function(a,h){return"left"===c&&b>h-e&&b<h+e?d=a:"right"===c&&b>h-f-e&&b<h-f+e?d=a+1:this.op(b,"<",h)&&this.op(b,">",g[a+1]||h-f)&&(d="left"===c?a+1:a),d===-1},this)),this.settings.loop||(this.op(b,">",g[this.minimum()])?d=b=this.minimum():this.op(b,"<",g[this.maximum()])&&(d=b=this.maximum())),d},e.prototype.animate=function(b){var c=this.speed()>0;this.is("animating")&&this.onTransitionEnd(),c&&(this.enter("animating"),this.trigger("translate")),a.support.transform3d&&a.support.transition?this.$stage.css({transform:"translate3d("+b+"px,0px,0px)",transition:this.speed()/1e3+"s"}):c?this.$stage.animate({left:b+"px"},this.speed(),this.settings.fallbackEasing,a.proxy(this.onTransitionEnd,this)):this.$stage.css({left:b+"px"})},e.prototype.is=function(a){return this._states.current[a]&&this._states.current[a]>0},e.prototype.current=function(a){if(a===d)return this._current;if(0===this._items.length)return d;if(a=this.normalize(a),this._current!==a){var b=this.trigger("change",{property:{name:"position",value:a}});b.data!==d&&(a=this.normalize(b.data)),this._current=a,this.invalidate("position"),this.trigger("changed",{property:{name:"position",value:this._current}})}return this._current},e.prototype.invalidate=function(b){return"string"===a.type(b)&&(this._invalidated[b]=!0,this.is("valid")&&this.leave("valid")),a.map(this._invalidated,function(a,b){return b})},e.prototype.reset=function(a){a=this.normalize(a),a!==d&&(this._speed=0,this._current=a,this.suppress(["translate","translated"]),this.animate(this.coordinates(a)),this.release(["translate","translated"]))},e.prototype.normalize=function(a,b){var c=this._items.length,e=b?0:this._clones.length;return!this.isNumeric(a)||c<1?a=d:(a<0||a>=c+e)&&(a=((a-e/2)%c+c)%c+e/2),a},e.prototype.relative=function(a){return a-=this._clones.length/2,this.normalize(a,!0)},e.prototype.maximum=function(a){var b,c,d,e=this.settings,f=this._coordinates.length;if(e.loop)f=this._clones.length/2+this._items.length-1;else if(e.autoWidth||e.merge){for(b=this._items.length,c=this._items[--b].width(),d=this.$element.width();b--&&(c+=this._items[b].width()+this.settings.margin,!(c>d)););f=b+1}else f=e.center?this._items.length-1:this._items.length-e.items;return a&&(f-=this._clones.length/2),Math.max(f,0)},e.prototype.minimum=function(a){return a?0:this._clones.length/2},e.prototype.items=function(a){return a===d?this._items.slice():(a=this.normalize(a,!0),this._items[a])},e.prototype.mergers=function(a){return a===d?this._mergers.slice():(a=this.normalize(a,!0),this._mergers[a])},e.prototype.clones=function(b){var c=this._clones.length/2,e=c+this._items.length,f=function(a){return a%2===0?e+a/2:c-(a+1)/2};return b===d?a.map(this._clones,function(a,b){return f(b)}):a.map(this._clones,function(a,c){return a===b?f(c):null})},e.prototype.speed=function(a){return a!==d&&(this._speed=a),this._speed},e.prototype.coordinates=function(b){var c,e=1,f=b-1;return b===d?a.map(this._coordinates,a.proxy(function(a,b){return this.coordinates(b)},this)):(this.settings.center?(this.settings.rtl&&(e=-1,f=b+1),c=this._coordinates[b],c+=(this.width()-c+(this._coordinates[f]||0))/2*e):c=this._coordinates[f]||0,c=Math.ceil(c))},e.prototype.duration=function(a,b,c){return 0===c?0:Math.min(Math.max(Math.abs(b-a),1),6)*Math.abs(c||this.settings.smartSpeed)},e.prototype.to=function(a,b){var c=this.current(),d=null,e=a-this.relative(c),f=(e>0)-(e<0),g=this._items.length,h=this.minimum(),i=this.maximum();this.settings.loop?(!this.settings.rewind&&Math.abs(e)>g/2&&(e+=f*-1*g),a=c+e,d=((a-h)%g+g)%g+h,d!==a&&d-e<=i&&d-e>0&&(c=d-e,a=d,this.reset(c))):this.settings.rewind?(i+=1,a=(a%i+i)%i):a=Math.max(h,Math.min(i,a)),this.speed(this.duration(c,a,b)),this.current(a),this.$element.is(":visible")&&this.update()},e.prototype.next=function(a){a=a||!1,this.to(this.relative(this.current())+1,a)},e.prototype.prev=function(a){a=a||!1,this.to(this.relative(this.current())-1,a)},e.prototype.onTransitionEnd=function(a){if(a!==d&&(a.stopPropagation(),(a.target||a.srcElement||a.originalTarget)!==this.$stage.get(0)))return!1;this.leave("animating"),this.trigger("translated")},e.prototype.viewport=function(){var d;return this.options.responsiveBaseElement!==b?d=a(this.options.responsiveBaseElement).width():b.innerWidth?d=b.innerWidth:c.documentElement&&c.documentElement.clientWidth?d=c.documentElement.clientWidth:console.warn("Can not detect viewport width."),d},e.prototype.replace=function(b){this.$stage.empty(),this._items=[],b&&(b=b instanceof jQuery?b:a(b)),this.settings.nestedItemSelector&&(b=b.find("."+this.settings.nestedItemSelector)),b.filter(function(){return 1===this.nodeType}).each(a.proxy(function(a,b){b=this.prepare(b),this.$stage.append(b),this._items.push(b),this._mergers.push(1*b.find("[data-merge]").addBack("[data-merge]").attr("data-merge")||1)},this)),this.reset(this.isNumeric(this.settings.startPosition)?this.settings.startPosition:0),this.invalidate("items")},e.prototype.add=function(b,c){var e=this.relative(this._current);c=c===d?this._items.length:this.normalize(c,!0),b=b instanceof jQuery?b:a(b),this.trigger("add",{content:b,position:c}),b=this.prepare(b),0===this._items.length||c===this._items.length?(0===this._items.length&&this.$stage.append(b),0!==this._items.length&&this._items[c-1].after(b),this._items.push(b),this._mergers.push(1*b.find("[data-merge]").addBack("[data-merge]").attr("data-merge")||1)):(this._items[c].before(b),this._items.splice(c,0,b),this._mergers.splice(c,0,1*b.find("[data-merge]").addBack("[data-merge]").attr("data-merge")||1)),this._items[e]&&this.reset(this._items[e].index()),this.invalidate("items"),this.trigger("added",{content:b,position:c})},e.prototype.remove=function(a){a=this.normalize(a,!0),a!==d&&(this.trigger("remove",{content:this._items[a],position:a}),this._items[a].remove(),this._items.splice(a,1),this._mergers.splice(a,1),this.invalidate("items"),this.trigger("removed",{content:null,position:a}))},e.prototype.preloadAutoWidthImages=function(b){b.each(a.proxy(function(b,c){this.enter("pre-loading"),c=a(c),a(new Image).one("load",a.proxy(function(a){c.attr("src",a.target.src),c.css("opacity",1),this.leave("pre-loading"),!this.is("pre-loading")&&!this.is("initializing")&&this.refresh()},this)).attr("src",c.attr("src")||c.attr("data-src")||c.attr("data-src-retina"))},this))},e.prototype.destroy=function(){this.$element.off(".owl.core"),this.$stage.off(".owl.core"),a(c).off(".owl.core"),this.settings.responsive!==!1&&(b.clearTimeout(this.resizeTimer),this.off(b,"resize",this._handlers.onThrottledResize));for(var d in this._plugins)this._plugins[d].destroy();this.$stage.children(".cloned").remove(),this.$stage.unwrap(),this.$stage.children().contents().unwrap(),this.$stage.children().unwrap(),this.$element.removeClass(this.options.refreshClass).removeClass(this.options.loadingClass).removeClass(this.options.loadedClass).removeClass(this.options.rtlClass).removeClass(this.options.dragClass).removeClass(this.options.grabClass).attr("class",this.$element.attr("class").replace(new RegExp(this.options.responsiveClass+"-\\S+\\s","g"),"")).removeData("owl.carousel")},e.prototype.op=function(a,b,c){var d=this.settings.rtl;switch(b){case"<":return d?a>c:a<c;case">":return d?a<c:a>c;case">=":return d?a<=c:a>=c;case"<=":return d?a>=c:a<=c}},e.prototype.on=function(a,b,c,d){a.addEventListener?a.addEventListener(b,c,d):a.attachEvent&&a.attachEvent("on"+b,c)},e.prototype.off=function(a,b,c,d){a.removeEventListener?a.removeEventListener(b,c,d):a.detachEvent&&a.detachEvent("on"+b,c)},e.prototype.trigger=function(b,c,d,f,g){var h={item:{count:this._items.length,index:this.current()}},i=a.camelCase(a.grep(["on",b,d],function(a){return a}).join("-").toLowerCase()),j=a.Event([b,"owl",d||"carousel"].join(".").toLowerCase(),a.extend({relatedTarget:this},h,c));return this._supress[b]||(a.each(this._plugins,function(a,b){b.onTrigger&&b.onTrigger(j)}),this.register({type:e.Type.Event,name:b}),this.$element.trigger(j),this.settings&&"function"==typeof this.settings[i]&&this.settings[i].call(this,j)),j},e.prototype.enter=function(b){a.each([b].concat(this._states.tags[b]||[]),a.proxy(function(a,b){this._states.current[b]===d&&(this._states.current[b]=0),this._states.current[b]++},this))},e.prototype.leave=function(b){a.each([b].concat(this._states.tags[b]||[]),a.proxy(function(a,b){this._states.current[b]--},this))},e.prototype.register=function(b){if(b.type===e.Type.Event){if(a.event.special[b.name]||(a.event.special[b.name]={}),!a.event.special[b.name].owl){var c=a.event.special[b.name]._default;a.event.special[b.name]._default=function(a){return!c||!c.apply||a.namespace&&a.namespace.indexOf("owl")!==-1?a.namespace&&a.namespace.indexOf("owl")>-1:c.apply(this,arguments)},a.event.special[b.name].owl=!0}}else b.type===e.Type.State&&(this._states.tags[b.name]?this._states.tags[b.name]=this._states.tags[b.name].concat(b.tags):this._states.tags[b.name]=b.tags,this._states.tags[b.name]=a.grep(this._states.tags[b.name],a.proxy(function(c,d){return a.inArray(c,this._states.tags[b.name])===d},this)))},e.prototype.suppress=function(b){a.each(b,a.proxy(function(a,b){this._supress[b]=!0},this))},e.prototype.release=function(b){a.each(b,a.proxy(function(a,b){delete this._supress[b]},this))},e.prototype.pointer=function(a){var c={x:null,y:null};return a=a.originalEvent||a||b.event,a=a.touches&&a.touches.length?a.touches[0]:a.changedTouches&&a.changedTouches.length?a.changedTouches[0]:a,a.pageX?(c.x=a.pageX,c.y=a.pageY):(c.x=a.clientX,c.y=a.clientY),c},e.prototype.isNumeric=function(a){return!isNaN(parseFloat(a))},e.prototype.difference=function(a,b){return{x:a.x-b.x,y:a.y-b.y}},a.fn.owlCarousel=function(b){var c=Array.prototype.slice.call(arguments,1);return this.each(function(){var d=a(this),f=d.data("owl.carousel");f||(f=new e(this,"object"==typeof b&&b),d.data("owl.carousel",f),a.each(["next","prev","to","destroy","refresh","replace","add","remove"],function(b,c){f.register({type:e.Type.Event,name:c}),f.$element.on(c+".owl.carousel.core",a.proxy(function(a){a.namespace&&a.relatedTarget!==this&&(this.suppress([c]),f[c].apply(this,[].slice.call(arguments,1)),this.release([c]))},f))})),"string"==typeof b&&"_"!==b.charAt(0)&&f[b].apply(f,c)})},a.fn.owlCarousel.Constructor=e}(window.Zepto||window.jQuery,window,document),function(a,b,c,d){var e=function(b){this._core=b,this._interval=null,this._visible=null,this._handlers={"initialized.owl.carousel":a.proxy(function(a){a.namespace&&this._core.settings.autoRefresh&&this.watch()},this)},this._core.options=a.extend({},e.Defaults,this._core.options),this._core.$element.on(this._handlers)};e.Defaults={autoRefresh:!0,autoRefreshInterval:500},e.prototype.watch=function(){this._interval||(this._visible=this._core.$element.is(":visible"),this._interval=b.setInterval(a.proxy(this.refresh,this),this._core.settings.autoRefreshInterval))},e.prototype.refresh=function(){this._core.$element.is(":visible")!==this._visible&&(this._visible=!this._visible,this._core.$element.toggleClass("owl-hidden",!this._visible),this._visible&&this._core.invalidate("width")&&this._core.refresh())},e.prototype.destroy=function(){var a,c;b.clearInterval(this._interval);for(a in this._handlers)this._core.$element.off(a,this._handlers[a]);for(c in Object.getOwnPropertyNames(this))"function"!=typeof this[c]&&(this[c]=null)},a.fn.owlCarousel.Constructor.Plugins.AutoRefresh=e}(window.Zepto||window.jQuery,window,document),function(a,b,c,d){var e=function(b){this._core=b,this._loaded=[],this._handlers={"initialized.owl.carousel change.owl.carousel resized.owl.carousel":a.proxy(function(b){if(b.namespace&&this._core.settings&&this._core.settings.lazyLoad&&(b.property&&"position"==b.property.name||"initialized"==b.type))for(var c=this._core.settings,e=c.center&&Math.ceil(c.items/2)||c.items,f=c.center&&e*-1||0,g=(b.property&&b.property.value!==d?b.property.value:this._core.current())+f,h=this._core.clones().length,i=a.proxy(function(a,b){this.load(b)},this);f++<e;)this.load(h/2+this._core.relative(g)),h&&a.each(this._core.clones(this._core.relative(g)),i),g++},this)},this._core.options=a.extend({},e.Defaults,this._core.options),this._core.$element.on(this._handlers)};e.Defaults={lazyLoad:!1},e.prototype.load=function(c){var d=this._core.$stage.children().eq(c),e=d&&d.find(".owl-lazy");!e||a.inArray(d.get(0),this._loaded)>-1||(e.each(a.proxy(function(c,d){var e,f=a(d),g=b.devicePixelRatio>1&&f.attr("data-src-retina")||f.attr("data-src");this._core.trigger("load",{element:f,url:g},"lazy"),f.is("img")?f.one("load.owl.lazy",a.proxy(function(){f.css("opacity",1),this._core.trigger("loaded",{element:f,url:g},"lazy")},this)).attr("src",g):(e=new Image,e.onload=a.proxy(function(){f.css({"background-image":'url("'+g+'")',opacity:"1"}),this._core.trigger("loaded",{element:f,url:g},"lazy")},this),e.src=g)},this)),this._loaded.push(d.get(0)))},e.prototype.destroy=function(){var a,b;for(a in this.handlers)this._core.$element.off(a,this.handlers[a]);for(b in Object.getOwnPropertyNames(this))"function"!=typeof this[b]&&(this[b]=null)},a.fn.owlCarousel.Constructor.Plugins.Lazy=e}(window.Zepto||window.jQuery,window,document),function(a,b,c,d){var e=function(b){this._core=b,this._handlers={"initialized.owl.carousel refreshed.owl.carousel":a.proxy(function(a){a.namespace&&this._core.settings.autoHeight&&this.update()},this),"changed.owl.carousel":a.proxy(function(a){a.namespace&&this._core.settings.autoHeight&&"position"==a.property.name&&this.update()},this),"loaded.owl.lazy":a.proxy(function(a){a.namespace&&this._core.settings.autoHeight&&a.element.closest("."+this._core.settings.itemClass).index()===this._core.current()&&this.update()},this)},this._core.options=a.extend({},e.Defaults,this._core.options),this._core.$element.on(this._handlers)};e.Defaults={autoHeight:!1,autoHeightClass:"owl-height"},e.prototype.update=function(){var b=this._core._current,c=b+this._core.settings.items,d=this._core.$stage.children().toArray().slice(b,c),e=[],f=0;a.each(d,function(b,c){e.push(a(c).height())}),f=Math.max.apply(null,e),this._core.$stage.parent().height(f).addClass(this._core.settings.autoHeightClass)},e.prototype.destroy=function(){var a,b;for(a in this._handlers)this._core.$element.off(a,this._handlers[a]);for(b in Object.getOwnPropertyNames(this))"function"!=typeof this[b]&&(this[b]=null)},a.fn.owlCarousel.Constructor.Plugins.AutoHeight=e}(window.Zepto||window.jQuery,window,document),function(a,b,c,d){var e=function(b){this._core=b,this._videos={},this._playing=null,this._handlers={"initialized.owl.carousel":a.proxy(function(a){a.namespace&&this._core.register({type:"state",name:"playing",tags:["interacting"]})},this),"resize.owl.carousel":a.proxy(function(a){a.namespace&&this._core.settings.video&&this.isInFullScreen()&&a.preventDefault()},this),"refreshed.owl.carousel":a.proxy(function(a){a.namespace&&this._core.is("resizing")&&this._core.$stage.find(".cloned .owl-video-frame").remove()},this),"changed.owl.carousel":a.proxy(function(a){a.namespace&&"position"===a.property.name&&this._playing&&this.stop()},this),"prepared.owl.carousel":a.proxy(function(b){if(b.namespace){var c=a(b.content).find(".owl-video");c.length&&(c.css("display","none"),this.fetch(c,a(b.content)))}},this)},this._core.options=a.extend({},e.Defaults,this._core.options),this._core.$element.on(this._handlers),this._core.$element.on("click.owl.video",".owl-video-play-icon",a.proxy(function(a){this.play(a)},this))};e.Defaults={video:!1,videoHeight:!1,videoWidth:!1},e.prototype.fetch=function(a,b){var c=function(){return a.attr("data-vimeo-id")?"vimeo":a.attr("data-vzaar-id")?"vzaar":"youtube"}(),d=a.attr("data-vimeo-id")||a.attr("data-youtube-id")||a.attr("data-vzaar-id"),e=a.attr("data-width")||this._core.settings.videoWidth,f=a.attr("data-height")||this._core.settings.videoHeight,g=a.attr("href");if(!g)throw new Error("Missing video URL.");if(d=g.match(/(http:|https:|)\/\/(player.|www.|app.)?(vimeo\.com|youtu(be\.com|\.be|be\.googleapis\.com)|vzaar\.com)\/(video\/|videos\/|embed\/|channels\/.+\/|groups\/.+\/|watch\?v=|v\/)?([A-Za-z0-9._%-]*)(\&\S+)?/),d[3].indexOf("youtu")>-1)c="youtube";else if(d[3].indexOf("vimeo")>-1)c="vimeo";else{if(!(d[3].indexOf("vzaar")>-1))throw new Error("Video URL not supported.");c="vzaar"}d=d[6],this._videos[g]={type:c,id:d,width:e,height:f},b.attr("data-video",g),this.thumbnail(a,this._videos[g])},e.prototype.thumbnail=function(b,c){var d,e,f,g=c.width&&c.height?'style="width:'+c.width+"px;height:"+c.height+'px;"':"",h=b.find("img"),i="src",j="",k=this._core.settings,l=function(a){e='<div class="owl-video-play-icon"></div>',d=k.lazyLoad?'<div class="owl-video-tn '+j+'" '+i+'="'+a+'"></div>':'<div class="owl-video-tn" style="opacity:1;background-image:url('+a+')"></div>',b.after(d),b.after(e)};if(b.wrap('<div class="owl-video-wrapper"'+g+"></div>"),this._core.settings.lazyLoad&&(i="data-src",j="owl-lazy"),h.length)return l(h.attr(i)),h.remove(),!1;"youtube"===c.type?(f="//img.youtube.com/vi/"+c.id+"/hqdefault.jpg",l(f)):"vimeo"===c.type?a.ajax({type:"GET",url:"//vimeo.com/api/v2/video/"+c.id+".json",jsonp:"callback",dataType:"jsonp",success:function(a){f=a[0].thumbnail_large,l(f)}}):"vzaar"===c.type&&a.ajax({type:"GET",url:"//vzaar.com/api/videos/"+c.id+".json",jsonp:"callback",dataType:"jsonp",success:function(a){f=a.framegrab_url,l(f)}})},e.prototype.stop=function(){this._core.trigger("stop",null,"video"),this._playing.find(".owl-video-frame").remove(),this._playing.removeClass("owl-video-playing"),this._playing=null,this._core.leave("playing"),this._core.trigger("stopped",null,"video")},e.prototype.play=function(b){var c,d=a(b.target),e=d.closest("."+this._core.settings.itemClass),f=this._videos[e.attr("data-video")],g=f.width||"100%",h=f.height||this._core.$stage.height();this._playing||(this._core.enter("playing"),this._core.trigger("play",null,"video"),e=this._core.items(this._core.relative(e.index())),this._core.reset(e.index()),"youtube"===f.type?c='<iframe width="'+g+'" height="'+h+'" src="//www.youtube.com/embed/'+f.id+"?autoplay=1&rel=0&v="+f.id+'" frameborder="0" allowfullscreen></iframe>':"vimeo"===f.type?c='<iframe src="//player.vimeo.com/video/'+f.id+'?autoplay=1" width="'+g+'" height="'+h+'" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>':"vzaar"===f.type&&(c='<iframe frameborder="0"height="'+h+'"width="'+g+'" allowfullscreen mozallowfullscreen webkitAllowFullScreen src="//view.vzaar.com/'+f.id+'/player?autoplay=true"></iframe>'),a('<div class="owl-video-frame">'+c+"</div>").insertAfter(e.find(".owl-video")),this._playing=e.addClass("owl-video-playing"))},e.prototype.isInFullScreen=function(){var b=c.fullscreenElement||c.mozFullScreenElement||c.webkitFullscreenElement;return b&&a(b).parent().hasClass("owl-video-frame")},e.prototype.destroy=function(){var a,b;this._core.$element.off("click.owl.video");for(a in this._handlers)this._core.$element.off(a,this._handlers[a]);for(b in Object.getOwnPropertyNames(this))"function"!=typeof this[b]&&(this[b]=null)},a.fn.owlCarousel.Constructor.Plugins.Video=e}(window.Zepto||window.jQuery,window,document),function(a,b,c,d){var e=function(b){this.core=b,this.core.options=a.extend({},e.Defaults,this.core.options),this.swapping=!0,this.previous=d,this.next=d,this.handlers={"change.owl.carousel":a.proxy(function(a){a.namespace&&"position"==a.property.name&&(this.previous=this.core.current(),this.next=a.property.value)},this),"drag.owl.carousel dragged.owl.carousel translated.owl.carousel":a.proxy(function(a){a.namespace&&(this.swapping="translated"==a.type)},this),"translate.owl.carousel":a.proxy(function(a){a.namespace&&this.swapping&&(this.core.options.animateOut||this.core.options.animateIn)&&this.swap()},this)},this.core.$element.on(this.handlers)};e.Defaults={animateOut:!1,animateIn:!1},e.prototype.swap=function(){if(1===this.core.settings.items&&a.support.animation&&a.support.transition){this.core.speed(0);var b,c=a.proxy(this.clear,this),d=this.core.$stage.children().eq(this.previous),e=this.core.$stage.children().eq(this.next),f=this.core.settings.animateIn,g=this.core.settings.animateOut;this.core.current()!==this.previous&&(g&&(b=this.core.coordinates(this.previous)-this.core.coordinates(this.next),d.one(a.support.animation.end,c).css({left:b+"px"}).addClass("animated owl-animated-out").addClass(g)),f&&e.one(a.support.animation.end,c).addClass("animated owl-animated-in").addClass(f))}},e.prototype.clear=function(b){a(b.target).css({left:""}).removeClass("animated owl-animated-out owl-animated-in").removeClass(this.core.settings.animateIn).removeClass(this.core.settings.animateOut),this.core.onTransitionEnd()},e.prototype.destroy=function(){var a,b;for(a in this.handlers)this.core.$element.off(a,this.handlers[a]);for(b in Object.getOwnPropertyNames(this))"function"!=typeof this[b]&&(this[b]=null)},
a.fn.owlCarousel.Constructor.Plugins.Animate=e}(window.Zepto||window.jQuery,window,document),function(a,b,c,d){var e=function(b){this._core=b,this._timeout=null,this._paused=!1,this._handlers={"changed.owl.carousel":a.proxy(function(a){a.namespace&&"settings"===a.property.name?this._core.settings.autoplay?this.play():this.stop():a.namespace&&"position"===a.property.name&&this._core.settings.autoplay&&this._setAutoPlayInterval()},this),"initialized.owl.carousel":a.proxy(function(a){a.namespace&&this._core.settings.autoplay&&this.play()},this),"play.owl.autoplay":a.proxy(function(a,b,c){a.namespace&&this.play(b,c)},this),"stop.owl.autoplay":a.proxy(function(a){a.namespace&&this.stop()},this),"mouseover.owl.autoplay":a.proxy(function(){this._core.settings.autoplayHoverPause&&this._core.is("rotating")&&this.pause()},this),"mouseleave.owl.autoplay":a.proxy(function(){this._core.settings.autoplayHoverPause&&this._core.is("rotating")&&this.play()},this),"touchstart.owl.core":a.proxy(function(){this._core.settings.autoplayHoverPause&&this._core.is("rotating")&&this.pause()},this),"touchend.owl.core":a.proxy(function(){this._core.settings.autoplayHoverPause&&this.play()},this)},this._core.$element.on(this._handlers),this._core.options=a.extend({},e.Defaults,this._core.options)};e.Defaults={autoplay:!1,autoplayTimeout:5e3,autoplayHoverPause:!1,autoplaySpeed:!1},e.prototype.play=function(a,b){this._paused=!1,this._core.is("rotating")||(this._core.enter("rotating"),this._setAutoPlayInterval())},e.prototype._getNextTimeout=function(d,e){return this._timeout&&b.clearTimeout(this._timeout),b.setTimeout(a.proxy(function(){this._paused||this._core.is("busy")||this._core.is("interacting")||c.hidden||this._core.next(e||this._core.settings.autoplaySpeed)},this),d||this._core.settings.autoplayTimeout)},e.prototype._setAutoPlayInterval=function(){this._timeout=this._getNextTimeout()},e.prototype.stop=function(){this._core.is("rotating")&&(b.clearTimeout(this._timeout),this._core.leave("rotating"))},e.prototype.pause=function(){this._core.is("rotating")&&(this._paused=!0)},e.prototype.destroy=function(){var a,b;this.stop();for(a in this._handlers)this._core.$element.off(a,this._handlers[a]);for(b in Object.getOwnPropertyNames(this))"function"!=typeof this[b]&&(this[b]=null)},a.fn.owlCarousel.Constructor.Plugins.autoplay=e}(window.Zepto||window.jQuery,window,document),function(a,b,c,d){"use strict";var e=function(b){this._core=b,this._initialized=!1,this._pages=[],this._controls={},this._templates=[],this.$element=this._core.$element,this._overrides={next:this._core.next,prev:this._core.prev,to:this._core.to},this._handlers={"prepared.owl.carousel":a.proxy(function(b){b.namespace&&this._core.settings.dotsData&&this._templates.push('<div class="'+this._core.settings.dotClass+'">'+a(b.content).find("[data-dot]").addBack("[data-dot]").attr("data-dot")+"</div>")},this),"added.owl.carousel":a.proxy(function(a){a.namespace&&this._core.settings.dotsData&&this._templates.splice(a.position,0,this._templates.pop())},this),"remove.owl.carousel":a.proxy(function(a){a.namespace&&this._core.settings.dotsData&&this._templates.splice(a.position,1)},this),"changed.owl.carousel":a.proxy(function(a){a.namespace&&"position"==a.property.name&&this.draw()},this),"initialized.owl.carousel":a.proxy(function(a){a.namespace&&!this._initialized&&(this._core.trigger("initialize",null,"navigation"),this.initialize(),this.update(),this.draw(),this._initialized=!0,this._core.trigger("initialized",null,"navigation"))},this),"refreshed.owl.carousel":a.proxy(function(a){a.namespace&&this._initialized&&(this._core.trigger("refresh",null,"navigation"),this.update(),this.draw(),this._core.trigger("refreshed",null,"navigation"))},this)},this._core.options=a.extend({},e.Defaults,this._core.options),this.$element.on(this._handlers)};e.Defaults={nav:!1,navText:["prev","next"],navSpeed:!1,navElement:"div",navContainer:!1,navContainerClass:"owl-nav",navClass:["owl-prev","owl-next"],slideBy:1,dotClass:"owl-dot",dotsClass:"owl-dots",dots:!0,dotsEach:!1,dotsData:!1,dotsSpeed:!1,dotsContainer:!1},e.prototype.initialize=function(){var b,c=this._core.settings;this._controls.$relative=(c.navContainer?a(c.navContainer):a("<div>").addClass(c.navContainerClass).appendTo(this.$element)).addClass("disabled"),this._controls.$previous=a("<"+c.navElement+">").addClass(c.navClass[0]).html(c.navText[0]).prependTo(this._controls.$relative).on("click",a.proxy(function(a){this.prev(c.navSpeed)},this)),this._controls.$next=a("<"+c.navElement+">").addClass(c.navClass[1]).html(c.navText[1]).appendTo(this._controls.$relative).on("click",a.proxy(function(a){this.next(c.navSpeed)},this)),c.dotsData||(this._templates=[a("<div>").addClass(c.dotClass).append(a("<span>")).prop("outerHTML")]),this._controls.$absolute=(c.dotsContainer?a(c.dotsContainer):a("<div>").addClass(c.dotsClass).appendTo(this.$element)).addClass("disabled"),this._controls.$absolute.on("click","div",a.proxy(function(b){var d=a(b.target).parent().is(this._controls.$absolute)?a(b.target).index():a(b.target).parent().index();b.preventDefault(),this.to(d,c.dotsSpeed)},this));for(b in this._overrides)this._core[b]=a.proxy(this[b],this)},e.prototype.destroy=function(){var a,b,c,d;for(a in this._handlers)this.$element.off(a,this._handlers[a]);for(b in this._controls)this._controls[b].remove();for(d in this.overides)this._core[d]=this._overrides[d];for(c in Object.getOwnPropertyNames(this))"function"!=typeof this[c]&&(this[c]=null)},e.prototype.update=function(){var a,b,c,d=this._core.clones().length/2,e=d+this._core.items().length,f=this._core.maximum(!0),g=this._core.settings,h=g.center||g.autoWidth||g.dotsData?1:g.dotsEach||g.items;if("page"!==g.slideBy&&(g.slideBy=Math.min(g.slideBy,g.items)),g.dots||"page"==g.slideBy)for(this._pages=[],a=d,b=0,c=0;a<e;a++){if(b>=h||0===b){if(this._pages.push({start:Math.min(f,a-d),end:a-d+h-1}),Math.min(f,a-d)===f)break;b=0,++c}b+=this._core.mergers(this._core.relative(a))}},e.prototype.draw=function(){var b,c=this._core.settings,d=this._core.items().length<=c.items,e=this._core.relative(this._core.current()),f=c.loop||c.rewind;this._controls.$relative.toggleClass("disabled",!c.nav||d),c.nav&&(this._controls.$previous.toggleClass("disabled",!f&&e<=this._core.minimum(!0)),this._controls.$next.toggleClass("disabled",!f&&e>=this._core.maximum(!0))),this._controls.$absolute.toggleClass("disabled",!c.dots||d),c.dots&&(b=this._pages.length-this._controls.$absolute.children().length,c.dotsData&&0!==b?this._controls.$absolute.html(this._templates.join("")):b>0?this._controls.$absolute.append(new Array(b+1).join(this._templates[0])):b<0&&this._controls.$absolute.children().slice(b).remove(),this._controls.$absolute.find(".active").removeClass("active"),this._controls.$absolute.children().eq(a.inArray(this.current(),this._pages)).addClass("active"))},e.prototype.onTrigger=function(b){var c=this._core.settings;b.page={index:a.inArray(this.current(),this._pages),count:this._pages.length,size:c&&(c.center||c.autoWidth||c.dotsData?1:c.dotsEach||c.items)}},e.prototype.current=function(){var b=this._core.relative(this._core.current());return a.grep(this._pages,a.proxy(function(a,c){return a.start<=b&&a.end>=b},this)).pop()},e.prototype.getPosition=function(b){var c,d,e=this._core.settings;return"page"==e.slideBy?(c=a.inArray(this.current(),this._pages),d=this._pages.length,b?++c:--c,c=this._pages[(c%d+d)%d].start):(c=this._core.relative(this._core.current()),d=this._core.items().length,b?c+=e.slideBy:c-=e.slideBy),c},e.prototype.next=function(b){a.proxy(this._overrides.to,this._core)(this.getPosition(!0),b)},e.prototype.prev=function(b){a.proxy(this._overrides.to,this._core)(this.getPosition(!1),b)},e.prototype.to=function(b,c,d){var e;!d&&this._pages.length?(e=this._pages.length,a.proxy(this._overrides.to,this._core)(this._pages[(b%e+e)%e].start,c)):a.proxy(this._overrides.to,this._core)(b,c)},a.fn.owlCarousel.Constructor.Plugins.Navigation=e}(window.Zepto||window.jQuery,window,document),function(a,b,c,d){"use strict";var e=function(c){this._core=c,this._hashes={},this.$element=this._core.$element,this._handlers={"initialized.owl.carousel":a.proxy(function(c){c.namespace&&"URLHash"===this._core.settings.startPosition&&a(b).trigger("hashchange.owl.navigation")},this),"prepared.owl.carousel":a.proxy(function(b){if(b.namespace){var c=a(b.content).find("[data-hash]").addBack("[data-hash]").attr("data-hash");if(!c)return;this._hashes[c]=b.content}},this),"changed.owl.carousel":a.proxy(function(c){if(c.namespace&&"position"===c.property.name){var d=this._core.items(this._core.relative(this._core.current())),e=a.map(this._hashes,function(a,b){return a===d?b:null}).join();if(!e||b.location.hash.slice(1)===e)return;b.location.hash=e}},this)},this._core.options=a.extend({},e.Defaults,this._core.options),this.$element.on(this._handlers),a(b).on("hashchange.owl.navigation",a.proxy(function(a){var c=b.location.hash.substring(1),e=this._core.$stage.children(),f=this._hashes[c]&&e.index(this._hashes[c]);f!==d&&f!==this._core.current()&&this._core.to(this._core.relative(f),!1,!0)},this))};e.Defaults={URLhashListener:!1},e.prototype.destroy=function(){var c,d;a(b).off("hashchange.owl.navigation");for(c in this._handlers)this._core.$element.off(c,this._handlers[c]);for(d in Object.getOwnPropertyNames(this))"function"!=typeof this[d]&&(this[d]=null)},a.fn.owlCarousel.Constructor.Plugins.Hash=e}(window.Zepto||window.jQuery,window,document),function(a,b,c,d){function e(b,c){var e=!1,f=b.charAt(0).toUpperCase()+b.slice(1);return a.each((b+" "+h.join(f+" ")+f).split(" "),function(a,b){if(g[b]!==d)return e=!c||b,!1}),e}function f(a){return e(a,!0)}var g=a("<support>").get(0).style,h="Webkit Moz O ms".split(" "),i={transition:{end:{WebkitTransition:"webkitTransitionEnd",MozTransition:"transitionend",OTransition:"oTransitionEnd",transition:"transitionend"}},animation:{end:{WebkitAnimation:"webkitAnimationEnd",MozAnimation:"animationend",OAnimation:"oAnimationEnd",animation:"animationend"}}},j={csstransforms:function(){return!!e("transform")},csstransforms3d:function(){return!!e("perspective")},csstransitions:function(){return!!e("transition")},cssanimations:function(){return!!e("animation")}};j.csstransitions()&&(a.support.transition=new String(f("transition")),a.support.transition.end=i.transition.end[a.support.transition]),j.cssanimations()&&(a.support.animation=new String(f("animation")),a.support.animation.end=i.animation.end[a.support.animation]),j.csstransforms()&&(a.support.transform=new String(f("transform")),a.support.transform3d=j.csstransforms3d())}(window.Zepto||window.jQuery,window,document);
;/**!
 * easy-pie-chart
 * Lightweight plugin to render simple, animated and retina optimized pie charts
 *
 * @license 
 * @author Robert Fleischmann <rendro87@gmail.com> (http://robert-fleischmann.de)
 * @version 2.1.7
 **/
!function(a,b){"function"==typeof define&&define.amd?define(["jquery"],function(a){return b(a)}):"object"==typeof exports?module.exports=b(require("jquery")):b(jQuery)}(this,function(a){var b=function(a,b){var c,d=document.createElement("canvas");a.appendChild(d),"object"==typeof G_vmlCanvasManager&&G_vmlCanvasManager.initElement(d);var e=d.getContext("2d");d.width=d.height=b.size;var f=1;window.devicePixelRatio>1&&(f=window.devicePixelRatio,d.style.width=d.style.height=[b.size,"px"].join(""),d.width=d.height=b.size*f,e.scale(f,f)),e.translate(b.size/2,b.size/2),e.rotate((-0.5+b.rotate/180)*Math.PI);var g=(b.size-b.lineWidth)/2;b.scaleColor&&b.scaleLength&&(g-=b.scaleLength+2),Date.now=Date.now||function(){return+new Date};var h=function(a,b,c){c=Math.min(Math.max(-1,c||0),1);var d=0>=c?!0:!1;e.beginPath(),e.arc(0,0,g,0,2*Math.PI*c,d),e.strokeStyle=a,e.lineWidth=b,e.stroke()},i=function(){var a,c;e.lineWidth=1,e.fillStyle=b.scaleColor,e.save();for(var d=24;d>0;--d)d%6===0?(c=b.scaleLength,a=0):(c=.6*b.scaleLength,a=b.scaleLength-c),e.fillRect(-b.size/2+a,0,c,1),e.rotate(Math.PI/12);e.restore()},j=function(){return window.requestAnimationFrame||window.webkitRequestAnimationFrame||window.mozRequestAnimationFrame||function(a){window.setTimeout(a,1e3/60)}}(),k=function(){b.scaleColor&&i(),b.trackColor&&h(b.trackColor,b.trackWidth||b.lineWidth,1)};this.getCanvas=function(){return d},this.getCtx=function(){return e},this.clear=function(){e.clearRect(b.size/-2,b.size/-2,b.size,b.size)},this.draw=function(a){b.scaleColor||b.trackColor?e.getImageData&&e.putImageData?c?e.putImageData(c,0,0):(k(),c=e.getImageData(0,0,b.size*f,b.size*f)):(this.clear(),k()):this.clear(),e.lineCap=b.lineCap;var d;d="function"==typeof b.barColor?b.barColor(a):b.barColor,h(d,b.lineWidth,a/100)}.bind(this),this.animate=function(a,c){var d=Date.now();b.onStart(a,c);var e=function(){var f=Math.min(Date.now()-d,b.animate.duration),g=b.easing(this,f,a,c-a,b.animate.duration);this.draw(g),b.onStep(a,c,g),f>=b.animate.duration?b.onStop(a,c):j(e)}.bind(this);j(e)}.bind(this)},c=function(a,c){var d={barColor:"#ef1e25",trackColor:"#f9f9f9",scaleColor:"#dfe0e0",scaleLength:5,lineCap:"round",lineWidth:3,trackWidth:void 0,size:110,rotate:0,animate:{duration:1e3,enabled:!0},easing:function(a,b,c,d,e){return b/=e/2,1>b?d/2*b*b+c:-d/2*(--b*(b-2)-1)+c},onStart:function(a,b){},onStep:function(a,b,c){},onStop:function(a,b){}};if("undefined"!=typeof b)d.renderer=b;else{if("undefined"==typeof SVGRenderer)throw new Error("Please load either the SVG- or the CanvasRenderer");d.renderer=SVGRenderer}var e={},f=0,g=function(){this.el=a,this.options=e;for(var b in d)d.hasOwnProperty(b)&&(e[b]=c&&"undefined"!=typeof c[b]?c[b]:d[b],"function"==typeof e[b]&&(e[b]=e[b].bind(this)));"string"==typeof e.easing&&"undefined"!=typeof jQuery&&jQuery.isFunction(jQuery.easing[e.easing])?e.easing=jQuery.easing[e.easing]:e.easing=d.easing,"number"==typeof e.animate&&(e.animate={duration:e.animate,enabled:!0}),"boolean"!=typeof e.animate||e.animate||(e.animate={duration:1e3,enabled:e.animate}),this.renderer=new e.renderer(a,e),this.renderer.draw(f),a.dataset&&a.dataset.percent?this.update(parseFloat(a.dataset.percent)):a.getAttribute&&a.getAttribute("data-percent")&&this.update(parseFloat(a.getAttribute("data-percent")))}.bind(this);this.update=function(a){return a=parseFloat(a),e.animate.enabled?this.renderer.animate(f,a):this.renderer.draw(a),f=a,this}.bind(this),this.disableAnimation=function(){return e.animate.enabled=!1,this},this.enableAnimation=function(){return e.animate.enabled=!0,this},g()};a.fn.easyPieChart=function(b){return this.each(function(){var d;a.data(this,"easyPieChart")||(d=a.extend({},b,a(this).data()),a.data(this,"easyPieChart",new c(this,d)))})}});
;jQuery(document).ready(function($){"use strict";$(window).on('scroll',function(){if($(window).scrollTop()>250){$('.navbar-sticky').addClass('sticky fade_down_effect');}else{$('.navbar-sticky').removeClass('sticky fade_down_effect');}});$('.dropdown > a').on('click',function(e){e.preventDefault();if($(window).width()>991)
{location.href=this.href;}
var dropdown=$(this).parent('.dropdown');dropdown.find('>.dropdown-menu').slideToggle('show');$(this).toggleClass('opened');return false;});$(window).on('scroll',function(){if($(window).scrollTop()>$(window).height()){$(".BackTo").fadeIn('slow');}else{$(".BackTo").fadeOut('slow');}});$("body, html").on("click",".BackTo",function(e){e.preventDefault();$('html, body').animate({scrollTop:0},800);});$(function(){$('.review-chart').easyPieChart({scaleColor:"",lineWidth:3,lineCap:'butt',barColor:'#bc906b',trackColor:"rgba(0,0,0, .30)",size:35,animate:35});});$(window).on('load',function(){setTimeout(()=>{$('#preloader').addClass('loaded');},1000);});$('.preloader-cancel-btn').on('click',function(e){e.preventDefault();if(!($('#preloader').hasClass('loaded'))){$('#preloader').addClass('loaded');}});if($('#instafeed').length>0){var InstagramToken=$('#instafeed').data('token'),limit=$('#instafeed').data('media-count');var feed=new Instafeed({accessToken:InstagramToken,limit:Number(limit),template:'<a href="{{link}}" target="_blank"><img title="{{caption}}" src="{{image}}" /></a>',transform:function(item){var d=new Date(item.timestamp);item.date=[d.getDate(),d.getMonth(),d.getYear()].join('/');return item;}});feed.run();}});