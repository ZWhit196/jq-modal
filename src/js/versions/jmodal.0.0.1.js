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


        var util = {
            // ID method
            newID: function() {

            },
            // Checking methods
            isInDOM: function() {},
            isElement: function() {},
        };


        $.fn.jmodal = function(option, name, value) {
            // option as object for creation.
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

        $.fn.jmodal.defaults = {
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
        };
    
    })(window, jQuery);
}