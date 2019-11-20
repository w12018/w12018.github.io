;
jQuery(function ($) {

    "use strict";

    // Window resize
    $(window).on('resize', function () {
        
    });

    // Window scroll
    $(window).on('scroll', function () {

        // top button
        if ($(this).scrollTop() > $(this).height()) {
            $(".go-top").addClass("active");
        } else {
            $(".go-top").removeClass("active");
        }
    });
});
