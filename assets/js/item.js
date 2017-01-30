var caldoza_item_control_modal, caldoza_item_control_modal_handler;
(function ($) {

    var current_items = {}
    flush_current = false;

    caldoza_item_control_modal = function (obj) {
        var template_ele = $('#' + obj.modal + '-tmpl'),
            template = Handlebars.compile(template_ele.html()),
            data = {},
            state,
            html;

        if (current_items[obj.modal] && flush_current === false) {
            data = {config: current_items[obj.modal].data('config')};
            state = 'add';
        } else {
            flush_current = false;
            current_items[obj.modal] = false;
            state = 'update';
            data = obj.trigger.data('default');
        }

        html = $(template(data));
        html.find('[data-default]').each(function () {
            var field = $(this);
            field.val(field.data('default'));
        });
        $('#' + obj.modal + '_caldozaModal .caldoza-modal-footer [data-state="' + state + '"]').remove();

        return html;
    }

    caldoza_item_control_modal_handler = function (data, obj) {

        var item = create_item(obj.params.requestData.control, data.data),
            target;

        if (current_items[obj.params.requestData.control + '-config']) {
            target = current_items[obj.params.requestData.control + '-config'];
            current_items[obj.params.requestData.control + '-config'] = null;
            target.replaceWith(item);
        } else {
            target = $('#' + obj.params.requestData.control);
            item.appendTo(target);
        }

        save_current_edit($('#' + obj.params.requestData.control));
    }

    var create_item = function (target, data) {

        var template_ele = $('#' + target + '-tmpl'),
            template = Handlebars.compile(template_ele.html()),
            item = $(template(data));
        item.data('config', data);
        $(document).trigger('caldoza.init');
        return item;
    }

    var save_current_edit = function (parent) {
        var holders;
        if (parent) {
            holders = $(parent);
        } else {
            holders = $('.caldoza-control-item');
        }

        for (var i = 0; i < holders.length; i++) {

            var holder = $(holders[i]),
                input = $('#' + holder.prop('id') + '-control'),
                items = holder.find('.caldoza-item'),
                configs = [];

            for (var c = 0; c < items.length; c++) {
                var item = $(items[c]);
                configs.push(item.data('config'));
            }
            input.val(JSON.stringify(configs)).trigger('change');
        }
        $(document).trigger('caldoza.save');
    }

    $(document).on('click', '.caldoza-item-edit', function () {
        var clicked = $(this),
            control = clicked.closest('.caldoza-control-item'),
            id = control.prop('id') + '-config',
            trigger = $('button[data-modal="' + id + '"]');


        current_items[id] = clicked.closest('.caldoza-item');
        flush_current = false;

        trigger.trigger('click');
    });
    // bind delete confirmer
    $(document).on('click', '.caldoza-item-delete', function () {
        var clicked = $(this),
            slug = clicked.data('row'),
            mainRow = $('.caldoza-item-primary-row[data-row="' + slug + '"]'),
            confirmRow = $('.caldoza-item-delete-confirm[data-row="' + slug + '"]');

        mainRow.slideUp();
        confirmRow.slideDown();

    });
    // bind delete cancel
    $(document).on('click', '.caldoza-item-delete-cancel', function () {
        var clicked = $(this),
            slug = clicked.data('row'),
            mainRow = $('.caldoza-item-primary-row[data-row="' + slug + '"]'),
            confirmRow = $('.caldoza-item-delete-confirm[data-row="' + slug + '"]');

        mainRow.slideDown();
        confirmRow.slideUp();

    });

    // remove slide action effect
    function slide_remove_item(item, control, slug) {
        item.slideUp(function () {
            item.remove();
            save_current_edit(control);
        });
        if( caldozaApi.data.sync && caldozaApi.data.sync[ slug ] ){
            delete caldozaApi.data.sync[ slug ];
        }
        sync_rebuild_nav();
    }

    // bind removal
    $(document).on('click', '.caldoza-item-remove', function () {
        var clicked = $(this),
            control = clicked.closest('.caldoza-control-item'),
            id = control.prop('id') + '-config',
            trigger = $('button[data-modal="' + id + '"]'),
            includeData = clicked.parent().find('[data-for]'),
            item = clicked.closest('.caldoza-item'),
            slug = includeData.data('for'),
            confirmRow = $('.caldoza-item-delete-confirm[data-row="' + slug + '"]'),
            progressRow = $('.caldoza-item-delete-progress[data-row="' + slug + '"]');

        if (clicked.data('confirm')) {
            if (!confirm(clicked.data('confirm'))) {
                return;
            }
        }

        current_items[id] = null;

        if (includeData.prop('checked')) {
            confirmRow.slideUp();
            progressRow.slideDown();
            // push delete
            $.post(ajaxurl, {action: 'caldoza_clear_type_data', slug: slug}, function (res) {
                slide_remove_item(item, control, slug);
            });
        } else {
            $.post(ajaxurl, {action: 'caldoza_remove_type', slug: slug}, function (res) {
                slide_remove_item(item, control, slug);
            });
        }

    });

    // clear edit
    $(window).on('modals.closed', function () {
        flush_current = true;
    });

    // init
    $(window).load(function () {
        $(document).on('caldoza.init', function () {
            $('.caldoza-control-item').not('._caldoza_item_init').each(function () {

                var holder = $(this),
                    input = $('#' + holder.prop('id') + '-control'),
                    data;
                if (holder.hasClass('_caldoza_item_init')) {
                    return;
                }
                holder.addClass('_caldoza_item_init');
                try {
                    data = JSON.parse(input.val());

                } catch (err) {

                }
                holder.addClass('_caldoza_item_init');

                if (typeof data === 'object' && data.length) {
                    for (var i = 0; i < data.length; i++) {
                        var item = create_item(holder.prop('id'), data[i]);
                        item.appendTo(holder);
                    }
                }
                holder.removeClass('processing');
                $(document).trigger('caldoza.itemsLoaded');
            });
        });
    });
})(jQuery);
