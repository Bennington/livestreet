/*
 * Modal
 *
 * @version 1.0
 * @author Denis Shakhov <denis.shakhov@gmail.com>
 */

var ls = ls || {};

(function ($) {
    "use strict";

    /**
     * Private vars and methods
     */
    var windowWidth  = null,
        windowHeight = null,
        overlay      = null,
        loader       = null,
        scrollTop    = 0;

    /**
     * Resize
     */
    var resize = function () {
        windowWidth = $(window).width();
        windowHeight = $(window).height();
        overlay.height(windowHeight);
    };

    /**
     * Show overlay
     */
    var showOverlay = function () {
        if (overlay.is(':visible')) {
            overlay.find($.fn.modal.settings.modalSelector).hide();
            Modal.hideLoader(false);
            return false;
        }

        scrollTop = $(window).scrollTop();

        $('html').css({'overflow': 'hidden'});

        // Prevent content from shifting
        $('body').css({'margin-right': $(window).width() - windowWidth});
        $(window).scrollTop(scrollTop);

        // Show overlay
        overlay.fadeIn(300);
    };

    /**
     * Constructs modal objects
     * @constructor
     * @class Modal
     * @param {Object} options Options
     */
    var Modal = ls.modal = function (element, options) {
        var self = this;

        this.$element = $(element);
        this.options = $.extend({}, $.fn.modal.defaults, options);
        this.$element.appendTo(overlay);

        this.$element.find($.fn.modal.settings.closeSelector).on('click.modal', function (e) {
            Modal.hideAll();
            e.preventDefault();
        });

        // Close on esc
        if (this.options.closeOnEsc) {
            $(document).on('keyup.modal', function (e) {
                e.keyCode === 27 && Modal.hideAll();
            });
        }
    };

    /**
     * Show loader
     * @param  {Boolean} bText        Use text instead of animation
     * @param  {String}  sText        Text
     * @param  {String}  bLock        Lock overlay and active modal, default: false
     * @param  {Number}  iLockTime    Lock time
     */
    Modal.showLoader = function (bText, sText, bLock, iLockTime) {
        overlay.find('.' + $.fn.modal.settings.lockClass).remove();

        if ( ! overlay.is(':visible')) showOverlay();
        if (bLock) {
            var ts = new Date().getTime();

            overlay.data('locked', true);
            overlay.find($.fn.modal.settings.modalSelector + ':visible').append('<div class="' + $.fn.modal.settings.lockClass + '" />');
        
            loader.data('id', ts);

            setTimeout(function () {
                if (loader.data('id') == ts) {
                    Modal.hideAll();
                    ls.msg.error('Ошибка', 'Ошибка загрузки');
                }
            }, (iLockTime || this.options.lockTime) * 1000);
        }

        if (bText) {
            loader
                .addClass($.fn.modal.settings.loaderTextClass)
                .text(sText || this.options.loaderText)
                .show();
        } else {
            loader.show();
        }
    };

    /**
     * Hide loader
     */
    Modal.hideLoader = function (bHideOverlay) {
        bHideOverlay = typeof bHideOverlay === 'undefined' ? true : bHideOverlay;

        overlay.data('locked', false);
        overlay.find('.' + $.fn.modal.settings.lockClass).remove();

        if (overlay.find($.fn.modal.settings.modalSelector + ':visible').length == 0 && bHideOverlay) Modal.hideAll();

        loader
            .removeClass($.fn.modal.settings.loaderTextClass)
            .text('')
            .hide();
    };

    /**
     * Init overlay
     */
    Modal.initOverlay = function () {
        // Hide scrollbar in IE7
        if ($('html').hasClass('ie7')) {
            $('body').attr('scroll', 'no');
            $('html').css('overflow', 'auto');
        }

        overlay = $('<div class="' + $.fn.modal.settings.overlayClass + '" data-type="modal-overlay" />').height(windowHeight).appendTo('body');
        loader = $('<div class="' + $.fn.modal.settings.loaderClass + '" data-type="modal-loader" />').height(windowHeight).css('z-index', 9999).appendTo(overlay);
        resize();

        overlay.on('click.modal', function (e) {
            if (e.target === this && overlay.data('locked') !== true) {
                Modal.hideAll();
            }
        });

        $(window).on('resize.modal', function () {
            resize();
        });

        /**
         * Init toggles
         */
        $(document).on('click.modal', $.fn.modal.settings.toggleSelector, function (e) {
            var toggle  = $(this),
                options = ls.tools.getDataOptions(toggle);

            if (options.url) {
                Modal.load(options.url, ls.tools.getDataOptions(toggle, 'param'), options);
            } else {
                $('#' + options.target).data('object').show();
            }
            e.preventDefault();
        });
    };

    /**
     * Hide overlay, loader and all modals
     * @param  {Function} callback onHide callback
     */
    Modal.hideAll = function (callback) {
        if ( ! overlay.is(':visible')) {
            return false;
        }

        overlay.fadeOut(300, function () {
            if ($('html').hasClass('ie7')) {
                $('html').css('overflow', 'auto');
            } else {
                $('html').css('overflow', 'visible');
            }
            $('body').css({'margin-right': 0});

            Modal.hideLoader(false);

            overlay.find($.fn.modal.settings.modalSelector).each(function () {
                var object = $(this).data('object');
                object.options.url ? object.$element.remove() : object.$element.hide();
            });

            $(window).scrollTop(scrollTop);

            callback && $.proxy(callback, this)();
        });
    };

    /**
     * Load modal from url
     * @param  {String} url     URL
     * @param  {Object} params  Params
     * @param  {Object} options Options
     */
    Modal.load = function (url, params, options) {
        showOverlay();
        Modal.showLoader();

        options = $.extend({}, $.fn.modal.defaults, options);

        ls.ajax(url, params, function (result) {
            if (result.bStateError) {
                Modal.hideAll();
                ls.msg.error('Error', result.sMsg);
            } else {
                var modal = $($.trim(result[options.ajaxVar])), 
                    object;

                Modal.hideLoader(false);
                modal.data('object', (object = new Modal(modal, options)));
                object.show();
            }
        }, {
            error: function () {
                Modal.hideLoader();
                Modal.hideAll(function () {
                    // TODO: Move text to lang file
                    ls.msg.error('Error', 'Please try again later');
                });
            }
        });
    };


    Modal.prototype = {
        /**
         * Show modal
         */
        show: function (options) {
            if (options) $.extend(this.options, options);

            showOverlay();
            this.$element.show();
            overlay.scrollTop(0);

            // onShow
            this.options.onShow && $.proxy(this.options.onShow, this)();

            // Center
            if (this.options.center && windowHeight > this.$element.outerHeight()) { 
                this.$element.css({'margin-top': (windowHeight - this.$element.outerHeight()) / 2});
            }
        },

        /**
         * Hide modal
         */
        hide: function () {
            Modal.hideAll();
        }
    };


    /**
     * Plugin defention
     */
    
    // Fallback
    $.fn.jqmShow = function (options) {
        $(this).modal('show');
    };

    // Fallback
    $.fn.jqmHide = function () {
        Modal.hideAll();
    };

    $.fn.modal = function (options, variable, value) {
        var returnValue = false;

        ! $($.fn.modal.settings.overlaySelector).length && Modal.initOverlay();

        this.each(function () {
            var element = $(this),
                object = element.data('object');

            if ( ! object ) element.data('object', (object = new Modal(this, $.extend({}, options, typeof options === 'string' ? {} : options))));

            if (typeof options === 'string') {
                if (options === "option") {
                    if (value) object.options[variable] = value; else returnValue = object.options[variable];
                } else {
                    object[options]();
                }
            }
        });

        return returnValue;
    };


    /**
     * Default options
     * @type {Object}
     */
    $.fn.modal.defaults = {
        url: false,
        center: true,
        ajaxVar:         'sText',
        loaderText:      'Идет загрузка...',
        lockTime:        30,
        closeOnEsc:      true
    };

    /**
     * Global settings
     * @type {Object}
     */
    $.fn.modal.settings = {
        modalClass:      'modal',
        overlayClass:    'modal-overlay',
        loaderClass:     'modal-loader',
        loaderTextClass: 'modal-loader-text',
        lockClass:       'modal-lock',

        modalSelector:   '[data-type=modal]',
        toggleSelector:  '[data-type=modal-toggle]',
        closeSelector:   '[data-type=modal-close]',
        overlaySelector: '[data-type=modal-overlay]'
    };
})(jQuery);