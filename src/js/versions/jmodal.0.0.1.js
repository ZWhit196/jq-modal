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
            this.__id = id;
            this._options = options;
            this.$target = $target;
            // Setup id for identification purposes
            this.$target.data('jmodalid', id);
        };
        Object.defineProperty(JModal, 'constructor', {value: JModal.prototype, enumerable: false, writable: true});
        $.extend(JModal.prototype, {
            getOrCreateCover: function() {},
            createHead: function() {},
            createBody: function() {},
            createFoot: function() {},
            destroy: function() {},
            open: function() {},
            close: function() {},
            toggle: function() {},
        });

        // jQuery insert
        $.jmodal = {};
        $.fn.jmodal = function(option, name, value) {
            if (!option) option = $.extend({} , $.fn.jmodal.defaults);  // Default empty to defaults

            // Creation as object
            if (typeof option === 'object') {
                return $.jmodal.create(this, option);
            } else {  // Interaction as string option
                switch (option) {
                    case 'open':
                        return this;
                    case 'close':
                        return this;
                    case 'toggle':
                        return this;
                    case 'instance':
                        return this;
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
                modalCover: '<div class="jmodal-cover"></div>',
                modalContainer: '<div class="jmodal-container"></div>',
                modalHead: '<div class="jmodal-head"></div>',
                modalBody: '<div class="jmodal-body"></div>',
                modalFoot: '<div class="jmodal-foot"></div>',
                modalClose: '<span class="jmodal-close"></span>',
            },
            // Defaults
            defaults: {
                content: '',
                header: '',
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
                var M = new JModal($.jmodal.newID(), $target, options);
                $.jmodal._instances.append(M);
                return $target;
            },
            getInstance: function($target) {
                var M = $.jmodal._instance.filter(function(v) {
                    return v.__id == $target.data('jmodalid');
                })[0];
                return M;
            },
            // util methods
            newID: function() {
                // Generate an id (basically just the time now)
                var x = Date.now();
                while ($.fn.jmodal.instances[x]) x = Date.now();
                return x;
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