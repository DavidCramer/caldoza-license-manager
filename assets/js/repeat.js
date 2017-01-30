(function($){

    jQuery( document ).ready( function(){

        function reseset_attributes(el, name, index, id_parts, type) {
            $(el).find("[" + name + "]").each(function () {
                $(this)[type]( name, function (idx, attr) {
                    var parts = attr.split('-'),
                        old_attr = parts.join('-');
                    parts[ id_parts.length - 1 ] = index;
                    attr = parts.join('-');
                    if( name == 'id') {
                        var classnames = $('.' + old_attr );
                        classnames.removeClass( old_attr ).addClass( attr.replace( /\d+/g, 0 ) );
                    }
                    return attr;
                });
            });
        }

        function reset_repeatable_index( id ){
            var wrapper = $('[data-caldoza-template="'+ id + '"'),
                id_parts = id.split('-');

            wrapper.children().each( function( index, el ){
                id_parts[id_parts.length - 1 ] = index;
                var new_id = id_parts.join('-');
                reseset_attributes(el, 'name', index, id_parts, 'attr');
                reseset_attributes(el, 'data-caldoza-template', index, id_parts, 'attr');
                reseset_attributes(el, 'id', index, id_parts, 'prop');
                reseset_attributes(el, 'for', index, id_parts, 'attr');
                //reseset_attributes(el, 'data-for', index, id_parts, 'attr');
            })
        }

        $( document ).on('click', '[data-caldoza-repeat]', function( e ){
            var clicked = $( this ),
                id = clicked.data('caldozaRepeat'),
                template = '';
            template = $( '#' + id + '-tmpl' ).html();
            template = $( template.replace(/{{_inst_}}/g, 0 ) ).hide();
            clicked.parent().prev().append( template );
            template.slideDown(100);
            //reset_repeatable_index( id );


            $( document ).trigger('caldoza.init');
        });

        $( document ).on('click', '.caldoza-remover', function( e ){
            var clicked = $( this ),
                template = clicked.closest('[data-caldoza-template]'),
                id = template.data('caldozaTemplate');
                $( this ).parent().slideUp( 100, function(){
                    $(this).remove();
                });

            $( document ).trigger('caldoza.init');
            //reset_repeatable_index( id );

        })

        $( document ).on('caldoza.init', function(){
            var wrappers = $( '[data-caldoza-template]');
            wrappers.each( function(){
                var id = $( this ).attr('data-caldoza-template');
                reset_repeatable_index( id );

            })
        });

        $('[data-caldoza-repeat]').each( function(){
            var id  = $( this ).attr( 'data-caldoza-repeat' ),
                elesclass = $('.' + id );

            elesclass.removeClass( id );

            id = id.replace( /\d+/g, 0 );
            elesclass.addClass( id );
            $( this ).attr( 'data-caldoza-repeat', id );

        });

        $( document ).trigger('caldoza.init');

    })


})(jQuery);
