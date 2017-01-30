var caldoza_related_post_handler,
    caldoza_related_post_before;
( function( $ ){
    jQuery( function( $ ){


        caldoza_related_post_before = function( el, ev ){
            var search = $( el ),
                items = [],
                page = 1,
                wrap = search.closest('.caldoza-control-input').find('.caldoza-post-relation');

            if( ev.type === 'paginate' ){
                page = search.data('paginate');
            }
            wrap.find('.caldoza-post-relation-id' ).each( function(){
                items.push( this.value );
            });

            search.data({ selected : items, page : page });
        }

        caldoza_related_post_handler = function( obj ){
            var wrapper = obj.params.trigger.parent().find('.caldoza-post-relation-results');
            wrapper.html( obj.data.html );
        };


        $( document ).on('click', '.caldoza-add-relation', function( e ) {
            var clicked = $(this),
                panel = clicked.closest('.caldoza-control-input').find('.caldoza-post-relation-panel'),
                input = panel.find('.caldoza-ajax');

            panel.toggle();
            if( panel.is(':visible') ) {
                input.val('').trigger('input').focus();
            }else{
                input.parent().find('.caldoza-post-relation-results').html('');
            }


        });
        $( document ).on('click', '.caldoza-post-relation-page', function( e ){
            var clicked = $( this ),
                search = clicked.closest('.caldoza-post-relation-panel').find('.caldoza-ajax');

            search.data('paginate', clicked.data('page') ).trigger('paginate');

        });

        $( document ).on('click', '.caldoza-post-relation-add', function(){

            var clicked = $( this ),
                oitem = clicked.parent(),
                wrap = clicked.closest('.caldoza-control-input').find('.caldoza-post-relation'),
                limit = parseFloat( wrap.data('limit') ),
                items,
                panel = wrap.parent().find('.caldoza-post-relation-footer, .caldoza-post-relation-panel'),
                item;


            clicked.removeClass('caldoza-post-relation-add dashicons-plus').addClass('caldoza-post-relation-remover dashicons-no-alt');
            item = oitem.clone();
            item.appendTo( wrap ).hide();
            item.find('.caldoza-post-relation-id').prop( 'disabled', false );
            item.show();
            oitem.remove();


            if( wrap.parent().find( '.caldoza-post-relation-results > .caldoza-post-relation-item' ).length <= 0 ){
                wrap.parent().find( '.caldoza-ajax' ).trigger('input');
            }

            items = wrap.children().length;

            if( items >= limit && limit > 0 ){
                panel.hide();
            }else{
                panel.show();
            }

        });

        $( document ).on('click', '.caldoza-post-relation-remover', function(){

            var clicked = $( this ),
                item = clicked.parent(),
                wrap = clicked.closest('.caldoza-control-input').find('.caldoza-post-relation'),
                limit = parseFloat( wrap.data('limit') ),
                items,
                panel = wrap.parent().find('.caldoza-post-relation-footer, .caldoza-post-relation-panel');

            item.remove();

            items = wrap.children().length;

            if( items >= limit && limit > 0 ){
                panel.hide();
            }else{
                if( !panel.is(':visible') ){
                    panel.show();
                    panel.find('.caldoza-ajax').val('').trigger('input').focus();
                }

            }
        });

        $( document ).on('caldoza.init', function(){
            var relations = $( '.caldoza-post-relation' );
            relations.each( function(){
                var input = $( this ),
                    limit = input.data('limit'),
                    panel = input.parent().find('.caldoza-post-relation-footer'),
                    items;

                if( limit ){
                    limit = parseFloat( limit );
                    items = input.find('.caldoza-post-relation-item');

                    if( items.length >= limit && limit > 0 ){
                        panel.hide();
                    }else{
                        panel.show();
                    }
                }
            });
        });

    });
})( jQuery )