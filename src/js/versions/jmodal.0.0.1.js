/**
 * Simple modals with jQuery.
 * 
 * Basic usage:
 * ```
 * $(".selector").jmodal();
 * ```
 */
if (!$.fn.jmodal) {
    (function(global, $) {
    
        // JModal object
        var JModal = function(id, $target, options) {
            // vars
            this.__id = id;
            this._options = options;
            this.$target = $target;
            // Setup id for identification purposes
            this.$target.data('jmodalid', id);
            // Cover and modal assignment
            this.$cover = this._getOrCreateCover();
            this._setupModal();
        };
        Object.defineProperty(JModal, 'constructor', {value: JModal.prototype, enumerable: false, writable: true});
        $.extend(JModal.prototype, {
            _getOrCreateCover: function() {
                // Return the cover element for holding the modal.
                // The cover will 'cover' the entirety of its parent, hence the name.
                var parent = this._options.altParent || $('body');
                if (!parent instanceof $) parent = $(parent);

                var $cover = parent.find('> .jmodal-cover');
                if ($cover.length === 0) {
                    $cover = $($.jmodal._html.modalCover);
                    parent.append($cover);
                }
                return $cover;
            },
            _createHead: function() {},
            _createBody: function() {},
            _createFoot: function() {},
            _setupModal: function() {
                // Setup this modal - called on construction only.
                var self = this;
                this.$modal = $($.jmodal._html.modalContainer);
                this.$modal.css({
                    width: this._options.width, 
                    height: this._options.height,
                });

                // HEADER
                if (this._options.header) {
                    var $h = $($.jmodal._html.modalHead);
                    this.$modal.append($h);
                    // If its a Element/jQuery/String/function
                    if (typeof this._options.header !== "boolean") $h.append(this._options.header);
                    else {
                        var $t = $($.jmodal._html.modalTitle);
                        $t.text(this._options.headerTitle);
                        $h.append($t);
                    }
                    // close button
                    if (this._options.closeButton) {
                        var $close;
                        if ($.isFunction(this._options.closeButton)) $close = $(this._options.closeButton())
                        else if (this._options.closeButton === true) $close = $($.jmodal._html.modalClose);
                        else $close = $(this._options.closeButton);

                        $close.on('click', function() { self.close(); });

                        $h.append($close);
                    }
                }

                // BODY
                var $body = $($.jmodal._html.modalBody);
                this.$modal.append($body);

                // TODO : content

                // FOOTER
                if (this._options.footer) {
                    var $f = $($.jmodal._html.modalFoot);
                    this.$modal.append($f);
                    if (typeof this._options.footer !== "boolean") $f.append(this._options.footer);
                }

                this.$cover.append(this.$modal);
            },
            // interaction
            destroy: function() {},
            open: function() {

            },
            close: function() {},
            toggle: function() {},
        });

        // jQuery insert
        $.jmodal = {};
        $.fn.jmodal = function(option, name, value) {
            // Creation as object
            if (typeof option === 'object' || !option) {
                var options = $.extend({}, $.jmodal.defaults);  // Default empty to defaults
                if (option) $.extend(options, option);

                return $.jmodal.create(this, options);
            } else {  // Interaction as string option
                switch (option) {
                    case 'open':
                        return this;
                    case 'close':
                        return this;
                    case 'toggle':
                        return this;
                    case 'instance':
                        return $.jmodal.getInstance(this);
                    case 'option':
                        return this;
                    default:
                        console.warn("jmodal received an unexpected option value (" + option + "), ignoring.");
                        return this;
                }
            }
        };

        // Utilities
        $.jmodal = {
            // Instances
            _instances: [],
            // vars
            _evt: {
                open: 'modal-opened',
                close: 'modal-closed',
            },
            _html: {
                modalCover: '<div class="jmodal-cover" style="display: none;"></div>',
                modalContainer: '<div class="jmodal-container"></div>',
                modalHead: '<div class="jmodal-head"></div>',
                modalBody: '<div class="jmodal-body"></div>',
                modalFoot: '<div class="jmodal-foot"></div>',
                modalClose: '<span class="jmodal-close">Close</span>',
                modalTitle: '<span class="jmodal-title"></span>',
            },
            // Defaults
            defaults: {
                content: '',
                header: true,
                headerTitle: '',
                closeButton: true,
                footer: false,
                height: 'auto',
                width: 'auto',
                customClass: '',
                data: null,
                debug: false,
                altParent: null,
                altTarget: null,
                preserveModal: true,
                restoreContent: false,
                onOpen: null,
                onClose: null,
                onDestroy: null,
                closeOnOutClick: true,
                lockScroll: true,
            },
            // methods
            create: function($target, options) {
                // Create a new instance and assign to _instances
                if ($.jmodal.isInit($target)) 
                    throw Error("JModal already initialised for this targeted element.");

                var M = new JModal($.jmodal.newID(), $target, options);
                $.jmodal._instances.push(M);
                return $target;
            },
            getInstance: function(target) {
                // Return JModal instance
                var val = (target instanceof $) ? target.data('jmodalid') : target;
                var M = $.jmodal._instances.filter(function(v) { return v.__id == val; })[0];
                return M;
            },
            // util methods
            newID: function() {
                // Generate an id (basically just the time now)
                var x = Date.now();
                while ($.jmodal.getInstance(x)) x = Date.now();
                return x;
            },
            isInit: function($target) {
                if ($.jmodal.getInstance($target)) return true;
                else return false;
            },
            isInDOM: function($e) {
                // Check if element exists on page.
                return $.contains(document.documentElement, $e.get(0));
            },
            isElement: function(e) {
                // Simple test for if var is element
                return e instanceof Element || e instanceof HTMLDocument;
            },
        };
    
    })(window, jQuery);
}