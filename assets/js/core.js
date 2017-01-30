var CLDZA_LMAN = {};

(function() {

    jQuery( document ).ready( function( $ ){

       $( document ).on('caldoza.init', function() {
           $('[data-default]').each(function () {
                var field = $(this);
                field.val(field.data('default'));
            });
        });

       $( window ).load( function() {
            // main init
            $(document).trigger('caldoza.init');
        });
    });


})( window );