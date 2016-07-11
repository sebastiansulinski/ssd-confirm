/*
 * ssdConfirm jQuery plugin
 * Examples and documentation at: https://github.com/sebastiansulinski/ssd-confirm
 * Copyright (c) 2016 Sebastian Sulinski
 * Version: 0.0.1 (11-JUL-2016)
 * Licensed under the MIT.
 * Requires: jQuery v1.9 or later
 */
;(function(window, $, undefined) {

    "use strict";

    $.fn.ssdConfirm = function (options) {

        "use strict";

        var settings = $.extend({

                dataType: 'ssd-confirm-trigger',
                dataMessage: 'ssd-confirm-message',
                dataUrl: 'ssd-confirm-url',
                dataBehaviour: 'ssd-confirm-behaviour',

                dataConfirmWrapper: 'ssd-confirm',
                dataConfirmBlock: 'ssd-confirm-block',
                dataConfirmContent: 'ssd-confirm-content',

                dataButtonWrapper: 'button-wrapper',
                dataButtonTrigger: 'trigger',
                dataButtonProcessing: 'processing',

                dataButtonYes: 'ssd-confirm-yes',
                dataButtonNo: 'ssd-confirm-no',

                dataRecordWrapper: 'row',

                dataOverlay: 'ssd-confirm-overlay',

                classActive: 'active',
                classShow: 'show',
                classHide: 'hide',

                extendBlocks: {},
                extendBehaviours: {},

                actionProperties: function(trigger, properties) {
                    return properties;
                }

            }, options);

        var Block = $.extend({

            remove: function(trigger, properties) {

                "use strict";

                Confirm.showOverlay();

                $('[' + Confirm.dataAttr(settings.dataConfirmBlock) + '="remove"]')
                    .addClass(settings.classShow)
                    .find('[' + Confirm.dataAttr(settings.dataButtonYes) + ']')
                    .data('behaviour', properties.behaviour)
                    .data('url', properties.url)
                    .data('originator', trigger)
                    .addBack()
                    .find('[' + Confirm.dataAttr(settings.dataConfirmContent) + ']')
                    .html(properties.message);

                $('[' + Confirm.dataAttr(settings.dataConfirmWrapper) + ']').addClass(settings.classActive);

            }

        }, settings.extendBehaviours);

        var Behaviour = $.extend({

            reload: function(data, trigger, properties) {

                "use strict";

                window.location.reload(true);

            },

            removeRow: function(data, trigger, properties) {

                "use strict";

                Confirm.hide();

                properties.originator
                    .closest('[' + Confirm.dataAttr(settings.dataRecordWrapper) + ']')
                    .fadeOut(200, function() {
                        $(this).remove();
                    });

            }

        }, settings.extendBehaviours);

        var Action = {

            hasButtonSwap: function(trigger, processing) {

                "use strict";

                return (
                    ! Confirm.isEmpty(trigger) &&
                    ! Confirm.isEmpty(processing)
                );

            },

            showProcessing: function(trigger, processing) {

                "use strict";

                if ( ! this.hasButtonSwap(trigger, processing))  {
                    return;
                }

                trigger.addClass(settings.classHide);
                processing.removeClass(settings.classHide);

            },

            hideProcessing: function(trigger, processing) {

                "use strict";

                if ( ! this.hasButtonSwap(trigger, processing))  {
                    return;
                }

                processing.addClass(settings.classHide);
                trigger.removeClass(settings.classHide);

            },

            call: function() {

                "use strict";

                $(document).on(
                    'click',
                    '[' + Confirm.dataAttr(settings.dataButtonYes) + ']',
                    function(event) {

                        Confirm.prevent(event);

                        var trigger = $(this),
                            wrapper = trigger.closest('[' + Confirm.dataAttr(settings.dataButtonWrapper) + ']'),
                            properties = {
                                url: trigger.data('url'),
                                behaviour: trigger.data('behaviour'),
                                originator: trigger.data('originator'),
                                processing: wrapper.length > 0 ?
                                        wrapper.find('[' + Confirm.dataAttr(settings.dataButtonProcessing) + ']') :
                                        null
                            };

                        properties = settings.actionProperties(trigger, properties);

                        Action.showProcessing(trigger, properties.processing);

                        $.ajax({
                            url: properties.url,
                            dataType: 'json',
                            success: function(data) {

                                Behaviour[properties.behaviour](data, trigger, properties);

                            },
                            error: function (jqXHR, textStatus, errorThrown) {

                                Action.hideProcessing(trigger, properties.processing);

                                throw new Error(errorThrown);
                            }
                        });

                    }
                );

            },

            init: function() {

                "use strict";

                this.call();

            }

        };

        var Confirm = {

            isEmpty: function(value) {

                "use strict";

                return (
                    typeof value === 'undefined' ||
                    value === undefined ||
                    value === '' ||
                    value === false ||
                    value === null
                )

            },

            prevent: function(event) {

                "use strict";

                event.preventDefault();
                event.stopPropagation();

            },

            dataAttr: function(name) {

                "use strict";

                return 'data-' + name;

            },

            showOverlay: function() {

                "use strict";

                $('[' + Confirm.dataAttr(settings.dataOverlay) + ']').addClass(settings.classShow);

            },

            hideOverlay: function() {

                "use strict";

                $('[' + Confirm.dataAttr(settings.dataOverlay) + ']').removeClass(settings.classShow);

            },

            overlay: function() {

                "use strict";

                $('[' + Confirm.dataAttr(settings.dataOverlay) + ']').on(
                    'click',
                    function(event) {

                        Confirm.prevent(event);
                        Confirm.hide();

                    }
                );

            },

            hide: function() {

                "use strict";

                $('[data-ssd-confirm]')
                    .removeClass(settings.classActive)
                    .find('[' + Confirm.dataAttr(settings.dataConfirmBlock) + ']')
                    .removeClass(settings.classShow)
                    .find('[' + Confirm.dataAttr(settings.dataButtonWrapper) + '] a, [' + Confirm.dataAttr(settings.dataButtonWrapper) + '] span')
                    .removeAttr('data-url')
                    .removeAttr('data-behaviour')
                    .removeAttr('data-originator')
                    .addBack()
                    .find('[' + Confirm.dataAttr(settings.dataButtonProcessing) + ']').addClass(settings.classHide)
                    .addBack()
                    .find('[' + Confirm.dataAttr(settings.dataButtonTrigger) + ']').removeClass(settings.classHide);

                this.hideOverlay();

            },

            buttonNo: function() {

                "use strict";

                $('[' + Confirm.dataAttr(settings.dataButtonNo) + ']').on(
                    'click',
                    function(event) {

                        Confirm.prevent(event);
                        Confirm.hide();

                    }
                );

            },

            hasMethod: function(method, object) {

                "use strict";

                return (
                    ! Confirm.isEmpty(method) &&
                    object.hasOwnProperty(method)
                );

            },

            trigger: function(instance) {

                "use strict";

                instance.each(function() {

                    $(this).on(
                        'click',
                        function(event) {

                            Confirm.prevent(event);

                            var trigger = $(this),
                                properties = {
                                    type: trigger.data(settings.dataType),
                                    url: trigger.data(settings.dataUrl),
                                    message: trigger.data(settings.dataMessage),
                                    behaviour: trigger.data(settings.dataBehaviour)
                                };

                            if ( ! Confirm.hasMethod(properties.type, Block)) {
                                return;
                            }

                            Block[properties.type](trigger, properties);

                        }
                    );

                });

            },

            init: function (instance) {

                "use strict";

                this.trigger(instance);
                this.buttonNo();
                this.overlay();

                Action.init();

            }

        };

        return Confirm.init(this);
    };

})(window, window.jQuery);