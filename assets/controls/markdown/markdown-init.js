(function() {

    jQuery( document ).ready( function( $ ) {
        $(document).on('caldoza.init', function( e ) {
            var simplemde = new SimpleMDE({ element: $(".markdown")[0] });
        });
    });
});