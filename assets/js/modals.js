(function($){

    var caldozaBackdrop = null,
        caldozaModals   = {},
        activeModals    = [],
        activeSticky    = [],
        pageHTML,
        pageBody,
        mainWindow;

    var positionModals = function(){

        if( !activeModals.length && !activeSticky.length ){
            return;
        }


        var modalId  = ( activeModals.length ? activeModals[ ( activeModals.length - 1 ) ] : activeSticky[ ( activeSticky.length - 1 ) ] ),
            windowWidth  = mainWindow.width(),
            windowHeight = mainWindow.height(),
            //modalHeight  = caldozaModals[ modalId ].body.outerHeight(),
            modalHeight  = caldozaModals[ modalId ].config.height,
            modalOuterHeight  = modalHeight,
            modalWidth  = caldozaModals[ modalId ].config.width,
            top          = 0,
            flickerBD    = false,
            modalReduced = false;

        caldozaModals[ modalId ].body.css( {
            height      : ''
        } );


        if( caldozaBackdrop ){ pageHTML.addClass('has-caldoza-modal'); }




        // check modals for %
        if( typeof modalWidth === 'string' ){
            modalWidth = parseInt( modalWidth );
            modalWidth = windowWidth / 100 * parseInt( modalWidth );
        }
        if( typeof modalHeight === 'string' ){
            modalHeight = parseInt( modalHeight );
            modalHeight = windowHeight / 100 * parseInt( modalHeight );
        }
        // top
        top = (windowHeight - modalHeight ) / 2.2;

        if( top < 0 ){
            top = 0;
        }

        if( modalHeight + ( caldozaModals[ modalId ].config.padding * 2 ) > windowHeight && caldozaBackdrop ){
            modalHeight = windowHeight;// - ( caldozaModals[ modalId ].config.padding * 2 );
            modalOuterHeight = '100%';
            if( caldozaBackdrop ){
                caldozaBackdrop.css( {
                    //paddingTop: caldozaModals[ modalId ].config.padding,
                    //paddingBottom: caldozaModals[ modalId ].config.padding,
                });
            }
            modalReduced = true;
        }
        if( modalWidth + ( caldozaModals[ modalId ].config.padding * 2 ) >= windowWidth ){
            modalWidth = '100%';
            if( caldozaBackdrop ){
                caldozaBackdrop.css( {
                    //paddingLeft: caldozaModals[ modalId ].config.padding,
                    //paddingRight: caldozaModals[ modalId ].config.padding,
                });
            }
            modalReduced = true;
        }

        if( true === modalReduced ){
            if( windowWidth <= 700 && windowWidth > 600 ){
                if( caldozaBackdrop ){
                    modalHeight = windowHeight - ( caldozaModals[ modalId ].config.padding * 2 );
                }
                modalWidth = windowWidth;
                modalOuterHeight = modalHeight - ( caldozaModals[ modalId ].config.padding * 2 );
                modalWidth = '100%';
                top = 0;
                if( caldozaBackdrop ){ caldozaBackdrop.css( { padding : caldozaModals[ modalId ].config.padding } ); }
            }else if( windowWidth <= 600 ){
                if( caldozaBackdrop ){ modalHeight = windowHeight; }
                modalWidth = windowWidth;
                modalOuterHeight = '100%';
                top = 0;
                if( caldozaBackdrop ){ caldozaBackdrop.css( { padding : 0 } ); }
            }
        }
        // set backdrop
        if( caldozaBackdrop && caldozaBackdrop.is(':hidden') ){
            flickerBD = true;
            caldozaBackdrop.show();
        }

        // title?
        if( caldozaModals[ modalId ].header ){
            if( caldozaBackdrop ){ caldozaBackdrop.show(); }
            modalHeight -= caldozaModals[ modalId ].header.outerHeight();
            caldozaModals[ modalId ].closer.css( {
                padding     : ( caldozaModals[ modalId ].header.outerHeight() / 2 ) - 3.8
            } );
            caldozaModals[ modalId ].title.css({ paddingRight: caldozaModals[ modalId ].closer.outerWidth() } );
        }
        // footer?
        if( caldozaModals[ modalId ].footer ){
            if( caldozaBackdrop ){ caldozaBackdrop.show(); }
            modalHeight -= caldozaModals[ modalId ].footer.outerHeight();
        }

        if( caldozaBackdrop && flickerBD === true ){
            caldozaBackdrop.hide();
            flickerBD = false;
        }

        // set final height
        if( modalHeight != modalOuterHeight ){
            caldozaModals[ modalId ].body.css( {
                height      : modalHeight
            } );
        }
        caldozaModals[ modalId ].modal.css( {
            width       : modalWidth
        } );
        if( caldozaModals[ modalId ].config.sticky && caldozaModals[ modalId ].config.minimized ){
            var toggle = {},
                minimizedPosition = caldozaModals[ modalId ].title.outerHeight() - caldozaModals[ modalId ].modal.outerHeight();
            if( caldozaModals[ modalId ].config.sticky.indexOf( 'bottom' ) > -1 ){
                toggle['margin-bottom'] = minimizedPosition;
            }else if( caldozaModals[ modalId ].config.sticky.indexOf( 'top' ) > -1 ){
                toggle['margin-top'] = minimizedPosition;
            }
            caldozaModals[ modalId ].modal.css( toggle );
            if( caldozaModals[ modalId ].config.sticky.length >= 3 ){
                pageBody.css( "margin-" + caldozaModals[ modalId ].config.sticky[0] , caldozaModals[ modalId ].title.outerHeight() );
                if( modalReduced ){
                    caldozaModals[ modalId ].modal.css( caldozaModals[ modalId ].config.sticky[1] , 0 );
                }else{
                    caldozaModals[ modalId ].modal.css( caldozaModals[ modalId ].config.sticky[1] , parseFloat( caldozaModals[ modalId ].config.sticky[2] ) );
                }
            }
        }
        if( caldozaBackdrop ){
            caldozaBackdrop.fadeIn( caldozaModals[ modalId ].config.speed );

            caldozaModals[ modalId ].modal.css( {
                top   : 'calc( 50% - ' + ( caldozaModals[ modalId ].modal.outerHeight() / 2 ) + 'px)',
                left   : 'calc( 50% - ' + ( caldozaModals[ modalId ].modal.outerWidth() / 2 ) + 'px)',
            } );
            setTimeout( function(){
                caldozaModals[ modalId ].modal.addClass( 'caldoza-animate' );
            }, 10);

        }

        return caldozaModals;
    }

    var closeModal = function( lastModal ){


        if( activeModals.length ){
            if( !lastModal ) {
                lastModal = activeModals.pop();
            }else{
                activeModals.splice( lastModal.indexOf( activeModals ), 1 );
            }

            if( caldozaModals[ lastModal ].modal.hasClass( 'caldoza-animate' ) && !activeModals.length ){
                caldozaModals[ lastModal ].modal.removeClass( 'caldoza-animate' );
                setTimeout( function(){
                    var current_modal = caldozaModals[ lastModal ];
                    current_modal.modal.fadeOut( 200, function(){
                        current_modal.modal.remove();
                    } )

                    if( caldozaModals[ lastModal ].flush ){
                        delete caldozaModals[ lastModal ];
                    }
                }, 500 );
            }else{
                if( caldozaBackdrop ){
                    var current_modal = caldozaModals[ lastModal ];
                    current_modal.modal.fadeOut( 200, function(){
                        current_modal.modal.remove();
                    } )

                    if( caldozaModals[ lastModal ].flush ){
                        delete caldozaModals[ lastModal ];
                    }

                }
            }

        }

        if( !activeModals.length ){
            if( caldozaBackdrop ){
                caldozaBackdrop.fadeOut( 250 , function(){
                    $( this ).remove();
                    caldozaBackdrop = null;
                });
            }
            pageHTML.removeClass('has-caldoza-modal');
            $(window).trigger( 'modals.closed' );
        }else{
            caldozaModals[ activeModals[ ( activeModals.length - 1 ) ] ].modal.find('.caldoza-modal-blocker').remove();
            caldozaModals[ activeModals[ ( activeModals.length - 1 ) ] ].modal.animate( {opacity : 1 }, 100 );
        }
        $(window).trigger( 'modal.close' );
    }
    $.caldozaModal = function(opts,trigger){

        pageHTML        = $('html');
        pageBody        = $('body');
        mainWindow      = $(window);

        var defaults    = $.extend(true, {
            element             :   'form',
            height              :   550,
            width               :   620,
            padding             :   12,
            speed               :   250,
            content             :   ''
        }, opts );
        defaults.trigger = trigger;
        if( !caldozaBackdrop && ! defaults.sticky ){
            caldozaBackdrop = $('<div>', {"class" : "caldoza-backdrop"});

            pageBody.append( caldozaBackdrop );
            caldozaBackdrop.hide();
        }

        // create modal element
        var modalElement = defaults.element,
            modalId = defaults.modal;


        if( typeof caldozaModals[ modalId ] === 'undefined' ){
            if( defaults.sticky ){
                defaults.sticky = defaults.sticky.split(' ');
                if( defaults.sticky.length < 2 ){
                    defaults.sticky = null;
                }
                activeSticky.push( modalId );
            }
            caldozaModals[ modalId ] = {
                config  :   defaults
            };

            caldozaModals[ modalId ].body = $('<div>', {"class" : "caldoza-modal-body",id: modalId + '_caldozaModalBody'});
            caldozaModals[modalId].content = $('<div>', {"class": "caldoza-modal-content", id: modalId + '_caldozaModalContent'});


        }else{
            caldozaModals[ modalId ].config = defaults;
        }



        var options = {
            id                  : modalId + '_caldozaModal',
            tabIndex            : -1,
            "ariaLabelled-by"   : modalId + '_caldozaModalLable',
            "method"            : 'post',
            "enctype"           : 'multipart/form-data',
            "class"             : "caldoza-modal-wrap " + ( defaults.sticky ? ' caldoza-sticky-modal ' + defaults.sticky[0] + '-' + defaults.sticky[1] : '' )
        };

        if( opts.config ){
            $.extend( options, opts.config );
        }
        //add in wrapper
        caldozaModals[ modalId ].modal = $('<' + modalElement + '>', options );


        // push active
        if( !defaults.sticky ){ activeModals.push( modalId ); }

        // add animate
        if( defaults.animate && caldozaBackdrop ){
            var animate         = defaults.animate.split( ' ' ),
                animateSpeed    = defaults.speed + 'ms',
                animateEase     = ( defaults.animateEase ? defaults.animateEase : 'ease' );

            if( animate.length === 1){
                animate[1] = 0;
            }

            caldozaModals[ modalId ].modal.css( {
                transform               : 'translate(' + animate[0] + ', ' + animate[1] + ')',
                '-web-kit-transition'   : 'transform ' + animateSpeed + ' ' + animateEase,
                '-moz-transition'       : 'transform ' + animateSpeed + ' ' + animateEase,
                transition              : 'transform ' + animateSpeed + ' ' + animateEase
            } );

        }




        // padd content
        caldozaModals[ modalId ].content.css( {
            //padding : defaults.padding
        } );
        caldozaModals[ modalId ].body.append( caldozaModals[ modalId ].content ).appendTo( caldozaModals[ modalId ].modal );
        if( caldozaBackdrop ){ caldozaBackdrop.append( caldozaModals[ modalId ].modal ); }else{
            caldozaModals[ modalId ].modal . appendTo( $( 'body' ) );
        }


        if( defaults.footer ){
            if( !caldozaModals[ modalId ].footer ) {
                caldozaModals[modalId].footer = $('<div>', {"class": "caldoza-modal-footer", id: modalId + '_caldozaModalFooter'});
                caldozaModals[ modalId ].footer.css({ padding: defaults.padding });

                // function?
                if( typeof window[defaults.footer] === 'function' ){
                    caldozaModals[ modalId ].footer.append( window[defaults.footer]( defaults, caldozaModals[ modalId ] ) );
                }else if( typeof defaults.footer === 'string' ){
                    // is jquery selector?
                    try {
                        var footerElement = $( defaults.footer );
                        caldozaModals[ modalId ].footer.html( footerElement.html() );
                    } catch (err) {
                        caldozaModals[ modalId ].footer.html( defaults.footer );
                    }
                }
            }

            caldozaModals[ modalId ].footer.appendTo( caldozaModals[ modalId ].modal );
        }

        if( defaults.title ){
            var headerAppend = 'prependTo';
            caldozaModals[ modalId ].header = $('<div>', {"class" : "caldoza-modal-title", id : modalId + '_caldozaModalTitle'});
            caldozaModals[ modalId ].closer = $('<a>', { "href" : "#close", "class":"caldoza-modal-closer", "data-dismiss":"modal", "aria-hidden":"true",id: modalId + '_caldozaModalCloser'}).html('&times;');
            caldozaModals[ modalId ].title = $('<h3>', {"class" : "modal-label", id : modalId + '_caldozaModalLable'});

            caldozaModals[ modalId ].title.html( defaults.title ).appendTo( caldozaModals[ modalId ].header );
            caldozaModals[ modalId ].title.css({ padding: defaults.padding });
            caldozaModals[ modalId ].title.append( caldozaModals[ modalId ].closer );
            if( caldozaModals[ modalId ].config.sticky ){
                if( caldozaModals[ modalId ].config.minimized && true !== caldozaModals[ modalId ].config.minimized ){
                    setTimeout( function(){
                        caldozaModals[ modalId ].title.trigger('click');
                    }, parseInt( caldozaModals[ modalId ].config.minimized ) );
                    caldozaModals[ modalId ].config.minimized = false;
                }
                caldozaModals[ modalId ].closer.hide();
                caldozaModals[ modalId ].title.addClass( 'caldoza-modal-closer' ).data('modal', modalId).appendTo( caldozaModals[ modalId ].header );
                if( caldozaModals[ modalId ].config.sticky.indexOf( 'top' ) > -1 ){
                    headerAppend = 'appendTo';
                }
            }else{
                caldozaModals[ modalId ].closer.data('modal', modalId).appendTo( caldozaModals[ modalId ].header );
            }
            caldozaModals[ modalId ].header[headerAppend]( caldozaModals[ modalId ].modal );
        }
        // hide modal
        //caldozaModals[ modalId ].modal.outerHeight( defaults.height );
        caldozaModals[ modalId ].modal.outerWidth( defaults.width );

        if( defaults.content && !caldozaModals[ modalId ].content.children().length ){
            // function?
            if( typeof defaults.content === 'function' ){
                caldozaModals[ modalId ].content.append( defaults.content( defaults, caldozaModals[ modalId ] ) );
            }else if( typeof defaults.content === 'string' ){

                if( typeof window[ defaults.content ] === 'function' ){
                    caldozaModals[modalId].content.html( window[ defaults.content ]( defaults ) );
                }else {

                    // is jquery selector?
                    try {
                        var contentElement = $(defaults.content);
                        if (contentElement.length) {
                            caldozaModals[modalId].content.append(contentElement.html());
                            contentElement.show();
                        } else {
                            throw new Error;
                        }
                        caldozaModals[modalId].modal.removeClass('processing');
                    } catch (err) {
                        caldozaModals[modalId].footer.hide();
                        setTimeout(function () {
                            caldozaModals[modalId].modal.addClass('processing');
                            $.post(defaults.content, trigger.data(), function (res) {
                                caldozaModals[modalId].content.html(res);
                                caldozaModals[modalId].modal.removeClass('processing');
                                caldozaModals[modalId].footer.show();
                            });
                        }, 250);
                    }
                }
            }
        }else{
            caldozaModals[ modalId ].modal.removeClass('processing');
        }

        // others in place?
        if( activeModals.length > 1 ){
            if( activeModals[ ( activeModals.length - 2 ) ] !== modalId ){
                caldozaModals[ activeModals[ ( activeModals.length - 2 ) ] ].modal.prepend( '<div class="caldoza-modal-blocker"></div>' ).animate( {opacity : 1 }, 100 );
                caldozaModals[ modalId ].modal.hide().fadeIn( 200 );
                //caldozaModals[ activeModals[ ( activeModals.length - 2 ) ] ].modal.fadeOut( 200, function(){
                  //  caldozaModals[ modalId ].modal.fadeIn( 2200 );
                //} );
            }
        }

        // set position;
        positionModals();
        // return main object
        $( window ).trigger('modal.open');

        if( opts.master && activeModals ){
            delete caldozaModals[ activeModals.shift() ];
        }


        caldozaModals[ modalId ].positionModals = positionModals;
        caldozaModals[ modalId ].closeModal = function(){
            closeModal( modalId );
        }
        var submit = caldozaModals[ modalId ].modal.find('button[type="submit"]');

        if( !submit.length ){
            caldozaModals[ modalId ].modal.find('input').on('change', function(){
                caldozaModals[ modalId ].modal.submit();
            })
        }else{
            caldozaModals[ modalId ].flush = true;
        }

        var notice = $('<div class="notice error"></div>'),
            message = $('<p></p>'),
            dismiss = $( '<button type="button" class="notice-dismiss"><span class="screen-reader-text">Dismiss this notice.</span></button>' );

        message.appendTo( notice );
        dismiss.appendTo( notice );

        dismiss.on('click', function(){
            notice.animate( { height: 0 }, 100, function(){
                notice.css('height', '');
                message.html();
                notice.detach();
            });
        });

        caldozaModals[ modalId ].modal.attr('data-load-element', '_parent' ).baldrick({
            request : window.location.href,
            before : function( el, e ){
                $(document).trigger('caldoza.itemsubmit');
                submit = caldozaModals[ modalId ].modal.find('button[type="submit"]');
                if( submit.length ){
                    submit.prop( 'disabled', true );
                    caldozaModals[ modalId ].modal.addClass('processing');
                }
                notice.detach();
            },
            callback : function( obj ){

                obj.params.trigger.find( '[type="submit"],button' ).prop( 'disabled', false );
                caldozaModals[ modalId ].modal.removeClass('processing');
                caldozaModals[ modalId ].data = obj.rawData.data;
                if ( typeof obj.rawData === 'object' ) {
                    if( obj.rawData.success ) {
                        if( typeof obj.rawData.data === 'string' ){
                            obj.rawData = obj.rawData.data;
                        }else if( typeof obj.rawData.data === 'object' ){
                            if( obj.rawData.data.redirect ){
                                window.location = obj.rawData.data.redirect;
                            }
                            caldozaModals[ modalId ].modal.trigger('modal.complete');
                        }else if( typeof obj.rawData.data === 'boolean' && obj.rawData.data === true ){

                            if( submit.length ) {
                                caldozaModals[ modalId ].flush = false;
                            }
                        }
                        closeModal();
                    }else{
                        obj.params.target = false;
                        if( typeof obj.rawData.data === 'string' ){
                            message.html( obj.rawData.data );
                            notice.appendTo( caldozaModals[ modalId ].body );
                            var height = notice.height();
                            notice.height(0).animate( { height: height }, 100 );
                        }else{
                            closeModal();
                        }
                    }
                }else{
                    closeModal();
                }
            },
            complete : function () {
                $(document).trigger('caldoza.init');
            }
        });
        return caldozaModals[ modalId ];
    }

    $.fn.caldozaModal = function( opts ){

        if( !opts ){ opts = {}; }
        opts = $.extend( {}, this.data(), opts );
        return $.caldozaModal( opts, this );
    }

    // setup resize positioning and keypresses
    if ( window.addEventListener ) {
        window.addEventListener( "resize", positionModals, false );
        window.addEventListener( "keypress", function(e){
            if( e.keyCode === 27 && caldozaBackdrop !== null ){
                caldozaBackdrop.trigger('click');
            }
        }, false );

    } else if ( window.attachEvent ) {
        window.attachEvent( "onresize", positionModals );
    } else {
        window["onresize"] = positionModals;
    }

    $(document).on('click', '[data-modal]:not(.caldoza-modal-closer)', function( e ){
        e.preventDefault();
        return $(this).caldozaModal();
    });

    $(document).on( 'click', '.caldoza-modal-closer', function( e ) {
        e.preventDefault();
        $(window).trigger('close.modal');
    })

    $(window).on( 'close.modal', function( e ) {
        closeModal();
    })
    $(window).on( 'modal.init', function( e ) {
        $('[data-modal][data-autoload]').each( function(){
            $( this ).caldozaModal();
        });
    })
    $(window).on( 'modal.open', function( e ) {
        $(document).trigger('caldoza.init');
    });
    $(window).load( function(){
        $(window).trigger('modal.init');
    });



})(jQuery);
