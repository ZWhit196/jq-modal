/**
 * Simple modals with jQuery.
 * 
 * Basic usage:
 * ```
 * $(".selector").jmodal();
 * ```
 * 
 * Remember that only one instance of jmodal can be assigned to any given element!
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
                if ($cover.length === 0) $cover = $.jmodal.newCover(parent);
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
                    else if (this._options.closeButton === true) $close = $($.jmodal._html.modalCloseButton);
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
                }).attr('id', this._options.id);
                
                if (this._options.customClass) this.$modal.addClass(this._options.customClass);
                if (this._options.data) this.$modal.data(this._options.data);

                // HEADER
                if (this._options.header) this._createHead();
                // BODY
                this._createBody();
                // FOOTER
                if (this._options.footer) this._createFoot();

                this.$cover.append(this.$modal);

                // Destroy func
                if (Array.isArray(this._options.onInit)) $.each(this._options.onInit, function(i, fn) { fn(); });
                else if ($.isFunction(this._options.onInit)) this._options.onInit();
            },
            // interaction
            destroy: function() {
                // Destroy the modal
                this.$target.removeData('jmodalid');  // Remove data attr
                this.$cover.parent().removeClass('jmodal-scroll-lock');  // Cleanup scroll class
                
                // Handle restore if active
                if (this._options.restoreContent === true) {  // Save to body
                    var $m = this.$modal.find('.jmodal-body').detach();
                    $m.hide();
                    $('body').append($m);
                } else if ($.isFunction(this._options.restoreContent)) {  // Function call
                    var $m = this.$modal.find('.jmodal-body').detach();
                    this._options.restoreContent($m);
                } else if (this._options.restoreContent) {  // Specific location
                    var $m = this.$modal.find('.jmodal-body').detach();
                    $m.hide();
                    $(this._options.restoreContent).append($m);
                } else {  // Delete
                    this.$modal.remove();
                }
                // if only instance, remove cover element
                if ($.jmodal.isOnlyInstance(this)) this.$cover.remove();
                // remove instance from collection
                $.jmodal._instances.splice($.jmodal._instances.indexOf(this), 1);
                
                // Destroy func
                if (Array.isArray(this._options.onDestroy)) $.each(this._options.onDestroy, function(i, fn) { fn(); });
                else if ($.isFunction(this._options.onDestroy)) this._options.onDestroy();
            },
            open: function() {
                // Open the modal
                var self = this;
                this.$cover.removeClass('jmodal-close').addClass('jmodal-open');
                this.$modal.removeClass('jmodal-close').addClass('jmodal-open');
                if (this._options.lockScroll) this.$cover.parent().addClass('jmodal-scroll-lock');

                // Events and functions
                if (this._options.closeOnOutClick) {
                    var detectClose = function(evt) {
                        var $this = $(this);
                        var $target = $(evt.target);
                        
                        if ($target.is($this)) self.close();
                        else $this.one('click', detectClose);
                    };

                    this.$modal.parent().one('click', detectClose);
                }

                if (Array.isArray(this._options.onOpen)) $.each(this._options.onOpen, function(i, fn) { fn(); });
                else if ($.isFunction(this._options.onOpen)) this._options.onOpen();

                this._getEventTarget().trigger($.jmodal._evt.open);
                return this;
            },
            close: function() {
                // Close the modal
                this.$cover.removeClass('jmodal-open').addClass('jmodal-close');
                this.$modal.removeClass('jmodal-open').addClass('jmodal-close');
                this.$cover.parent().removeClass('jmodal-scroll-lock');
                // Events and functions
                if (Array.isArray(this._options.onClose)) $.each(this._options.onClose, function(i, fn) { fn(); });
                else if ($.isFunction(this._options.onClose)) this._options.onClose();

                this._getEventTarget().trigger($.jmodal._evt.close);
                return this;
            },
            toggle: function() {
                // Toggle the show/hide of the modal
                if (this.isOpen) this.close();
                else this.open();
                return this;
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
            _evt: {open: 'modal-opened', close: 'modal-closed'},
            _html: {
                modalCover: '<div class="jmodal-cover jmodal-close"></div>',
                modalContainer: '<div class="jmodal-container jmodal-close"></div>',
                modalHead: '<div class="jmodal-head"></div>',
                modalBody: '<div class="jmodal-body"></div>',
                modalFoot: '<div class="jmodal-foot"></div>',
                modalCloseButton: '<span class="jmodal-close-button">Close</span>',
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
                id: '',
                data: null,
                altParent: null,
                altTarget: null,
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
                if ($target.length < 1)
                    throw Error("Cannot initialise without a target element.");
                    
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
            newCover: function(parent) {
                $cover = $($.jmodal._html.modalCover);
                parent.append($cover);
                return $cover;
            },
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