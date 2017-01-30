
var caldoza_edit_state = false;

(function($){

    $( document ).on( 'caldoza.init', init_caldoza_ajax );

    function init_caldoza_ajax(){
        var spinner;
        $('.caldoza-ajax').baldrick({
            'request': window.location.href,
            before : function( el, ev ){
                if( spinner ){
                    spinner.remove();
                }
                spinner = $( '<span class="caldoza-ajax spinner"></span>' );
                if( ev.originalEvent && ev.originalEvent.explicitOriginalTarget ){
                    //$( ev.originalEvent.explicitOriginalTarget ).prop('disabled', 'disabled' ).addClass('disabled');
                    spinner.addClass('inline');
                }
                $(el).find('.caldoza-title').append( spinner );
            },
            callback : function( obj, ev ){

                if( ev && ev.originalEvent && ev.originalEvent.explicitOriginalTarget ) {
                    spinner.removeClass( 'spinner' ).addClass('dashicons dashicons-yes');
                    setTimeout( function(){
                        spinner.fadeOut( 1000, function(){
                            spinner.remove();
                        });
                    }, 1000 );

                    $(ev.originalEvent.explicitOriginalTarget).prop('disabled', false).removeClass('disabled');
                }else{
                    spinner.remove();
                    obj.params.trigger.find('.ajax-triggered').removeClass('ajax-triggered');
                }
                caldoza_edit_state = false;
            }
        });
    };

    jQuery( document ).ready( function() {



        $('form.caldoza-ajax').each( function(){
            var form = $( this );
            if( form.data('autosave') ){
                $( document ).on('caldoza.save', function(){
                    form.trigger( 'submit' );
                })
                form.on('change', '[name]', function( e ){
                    $(this).addClass('ajax-triggered');
                    $( document ).trigger('caldoza.save');
                })
            }else{
                form.on( 'change', '[name]', function(){
                    caldoza_edit_state = true;
                });
            }

        });
    })

    // check for a button




    window.onbeforeunload = function(e) {

        if( false === caldoza_edit_state ){ return; }

        var dialogText = 'confirm';
        e.returnValue = dialogText;
        return dialogText;
    };

})(jQuery);
