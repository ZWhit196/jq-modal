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
                if (!(parent instanceof $)) parent = $(parent);

                var $cover = parent.find('> .jmodal-cover');
                if ($cover.length === 0) {
                    $cover = $($.jmodal._html.modalCover);
                    parent.append($cover);
                }
                return $cover;
            },
            _getEventTarget: function() {
                // Get the target for events
                var evtTarget = this._options.eventTarget || this.$target;
                if (!(evtTarget instanceof $)) evtTarget = $(evtTarget);
                return evtTarget;
            },
            _createHead: function() {
                // Create the head of the modal
                var self = this;
                var $h = $($.jmodal._html.modalHead);
                this.$modal.append($h);

                if ($.isFunction(this._options.header)) $h.append(this._options.header(this._options.headerTitle));
                else if (typeof this._options.header !== "boolean") $h.append(this._options.header);
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
            },
            _createBody: function() {
                // Create body of the modal
                var $body = $($.jmodal._html.modalBody);
                this.$modal.append($body);
                $body.append(this._options.content);
            },
            _createFoot: function() {
                // Create the footer of the modal
                var $f = $($.jmodal._html.modalFoot);
                this.$modal.append($f);
                if (typeof this._options.footer !== "boolean") $f.append(this._options.footer);
            },
            _setupModal: function() {
                // Setup this modal - called on construction only.
                this.$modal = $($.jmodal._html.modalContainer);
                this.$modal.css({
                    width: this._options.width, 
                    height: this._options.height,
                    display: 'none',
                });
                if (this._options.customClass) this.$modal.addClass(this._options.customClass);
                if (this._options.data) this.$modal.data(this._options.data);

                // HEADER
                if (this._options.header) this._createHead();
                // BODY
                this._createBody();
                // FOOTER
                if (this._options.footer) this._createFoot();

                this.$cover.append(this.$modal);
            },
            // interaction
            destroy: function() {
                // Destroy the modal
                this.$target.removeData('jmodalid');  // Remove data attr
                this.$modal.remove();  // remove modal element
                // if only instance, remove cover element
                if ($.jmodal.isOnlyInstance(this)) this.$cover.remove();
                // remove instance from collection
                $.jmodal._instances.splice($.jmodal._instances.indexOf(this), 1);
            },
            open: function() {
                // Open the modal
                this.$cover.removeClass('jmodal-close').addClass('jmodal-open');
                this.$modal.removeClass('jmodal-close').addClass('jmodal-open');
                // Events and functions
                if (Array.isArray(this._settings.onOpen)) $.each(this._settings.onOpen, function(i, fn) { fn(); });
                else if ($.isFunction(this._settings.onOpen)) this._settings.onOpen();

                this._getEventTarget().trigger('modal-opened');
            },
            close: function() {
                // Close the modal
                this.$cover.removeClass('jmodal-open').addClass('jmodal-close');
                this.$modal.removeClass('jmodal-open').addClass('jmodal-close');
                // Events and functions
                if (Array.isArray(this._settings.onClose)) $.each(this._settings.onClose, function(i, fn) { fn(); });
                else if ($.isFunction(this._settings.onClose)) this._settings.onClose();

                this._getEventTarget().trigger('modal-closed');
            },
            toggle: function() {
                // Toggle the show/hide of the modal
                if (this.isOpen) this.close();
                else this.open();
            },
            isOpen: function() {
                // return true if modal is open
                return (this.$cover.hasClass('jmodal-open') && !this.$modal.is(':hidden'));
            },
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
                        $.jmodal.getInstance(this).open();
                        return this;
                    case 'close':
                        $.jmodal.getInstance(this).close();
                        return this;
                    case 'toggle':
                        $.jmodal.getInstance(this).toggle();
                        return this;
                    case 'instance':
                        return $.jmodal.getInstance(this);
                    case 'option':
                        return $.jmodal.getInstance(this)._options[option];
                    case 'destroy':
                        $.jmodal.getInstance(this).destroy();
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
                modalCover: '<div class="jmodal-cover jmodal-close"></div>',
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
            isOnlyInstance: function(M) {
                // true if the given is the only instance available
                return (M instanceof JModal && $.jmodal._instances.indexOf(M) > -1 && $.jmodal._instances.length === 1);
            },
        };
    
    })(window, jQuery);
}