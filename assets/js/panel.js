(function( $ ) {

    $( document ).on( 'click', '.caldoza-tab-trigger', function( e ){
        e.preventDefault();
        var clicked  = $( this ),
            target   = $( clicked.attr('href') ),
            wrapper  = clicked.closest('.caldoza-panel-inside'),
            tabs     = wrapper.find('> .caldoza-panel-tabs').children(),
            sections = wrapper.find('> .caldoza-sections').children();

        tabs.attr('aria-selected', false );
        clicked.parent().attr('aria-selected', true );

        sections.attr('aria-hidden', true );
        target.attr('aria-hidden', false );

    });

})( jQuery );