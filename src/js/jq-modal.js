/**
 * A JS solution to handle modals.
 */
var jmodalDefaults = {
    modalopencls: 'jqmodal-open',
    overlayid: 'jqmodal-overlay',
    parentid: 'jqmodal',
    actionbarcls: 'jqmodal-action',
    closecls: 'jqmodal-close',
    headercls: 'jqmodal-header',
    bodycls: 'jqmodal-body',
    footercls: 'jqmodal-footer',
    triggerevt: 'modal-triggered',
    openevt: 'modal-opened',
    closeevt: 'modal-closed',
    closetext: 'Close',
    height: "auto",
    width: "300px",
};

(function($) {

    var fn = {
        create: function() {
            // overlay (base of modal)
            var $modal = $("<div></div>");
            $modal.attr({id: jmodalDefaults.overlayid}).hide();

            // add to body
            $("body").append($modal);
            return $modal;
        },
        open: function($modal, options) {
            // triggered
            $('body').trigger(jmodalDefaults.triggerevt);
            // body
            $body = $("<div></div>");
            var attrs = {id: jmodalDefaults.parentid};
            $body.attr(attrs);
            if (options.class) $body.addClass(options.class);
            $modal.append($body);
            // header/content/footer
            fn.header($body, options.header, options.closetext);
            fn.body($body, options.body);
            fn.footer($body, options.footer);
            // height/width
            var height, width;
            if (!options.height) height = jmodalDefaults.height;
            else if (typeof options.height === "function") height = options.height($body);
            else height = options.height;
            if (!options.width) width = jmodalDefaults.width;
            else if (typeof options.width === "function") width = options.width($body);
            else width = options.width;
            var style = {height: height, width: width};
            $body.css(style);
            // show and assign close
            $modal.show().one("click", function(evt) {
                // close if not child of overlay
                if ($(evt.target).attr('id') === jmodalDefaults.overlayid) {
                    fn.close($modal);  // close
                }
            });
            // no scroll class
            $('body').addClass(jmodalDefaults.modalopencls);
            // event
            $('body').trigger(jmodalDefaults.openevt);
        },
        close: function($modal) {
            // triggered
            $('body').trigger(jmodalDefaults.triggerevt);
            // clear content & class
            $modal.empty().hide();
            $('body').removeClass(jmodalDefaults.modalopencls);
            // event
            $('body').trigger(jmodalDefaults.closeevt);
        },
        header: function($body, head, txt) {
            // Add controls
            var $headBar = $('<div></div>');
            $headBar.addClass(jmodalDefaults.actionbarcls);
            // close button
            if (!txt) txt = jmodalDefaults.closetext;
            var $close = $("<span></span>");
            $close.addClass(jmodalDefaults.closecls).text(txt);
            $close.one("click", function() { fn.close($body.parent()); });
            $headBar.append($close);
            $body.append($headBar);
            // Do nothing if no head
            if (typeof head === "undefined") return;
            // define
            var $header = $("<div></div>");
            $header.addClass(jmodalDefaults.headercls);
            // add content
            $header.append(head);
            // add
            $body.append($header);
        },
        body: function($body, body) {
            // define
            var $content = $("<div></div>");
            $content.addClass(jmodalDefaults.bodycls);
            $body.append($content);
            // Body element is always added.
            if (typeof body === "undefined") return;
            // Add content if given
            $content.append(body);
        },
        footer: function($body, footer) {
            // do nothing if no footer
            if (typeof footer === "undefined") return;
            // define
            var $footer = $("<div></div>");
            $footer.addClass(jmodalDefaults.footercls);
            $body.append($footer);
            // Add content
            $footer.append(footer);
        },
    };

    $.fn.jmodal = function(options) {
        if (typeof options === "object") {
            // find or create
            var $modal = $('body').find('#'+jmodalDefaults.overlayid);
            if ($modal.length === 0) $modal = fn.create(options);
            // create internal
            fn.open($modal, options);
        }
        return this;
    };

})(jQuery);