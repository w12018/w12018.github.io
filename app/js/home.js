;
jQuery(function ($) {

    "use strict";

    var M_POINT = 576;
    var glw = $(window).width();
    var mobile = glw < M_POINT;

    
    function refresh() {

    }

    refresh();    

    $('.preloader').addClass('ready');

    // Window resize
    $(window).on('resize', function () {
        glw = $(this).width();
        mobile = glw < M_POINT;

        refresh();
    });

    // Window scroll
    $(window).on('scroll', function () {

    });
});