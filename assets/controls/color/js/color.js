(function( $ ) {

    // Add Color Picker to all inputs that have 'color-field' class
    $(function() {
        $(document).on('caldoza.init', function () {
            $('.color-field').wpColorPicker();
        });
    });
     
})( jQuery );