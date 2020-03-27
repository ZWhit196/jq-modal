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
    

        var JModal = function(id) { this.__id = id; };
        Object.defineProperty(JModal, 'constructor', {value: JModal.prototype, enumerable: false, writable: true});
        $.extend(JModal.prototype, {

        });

        $.jmodal = {};
        $.fn.jmodal = function(option, name, value) {
            // option as object for creation.
            if (!option) option = $.extend({} , $.fn.jmodal.defaults);

            if (typeof option === 'object') {

            } else {
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
            _instances: {},
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
            // ID method
            newID: function() {
                // Generate an id (basically just the time now)
                var x = Date.now();
                while ($.fn.jmodal.instances[x]) x = Date.now();
                return x;
            },
            // Checking methods
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