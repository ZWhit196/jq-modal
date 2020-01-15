# jq-modal  

Simple modal box plugin for jQuery.  

## Usage  

To open a modal, use:  

```javascript
$('.selector').jmodal({});
```

This will open an empty modal which will be able to close, and will use a default sizing.  

The Object passed to the function can contain any of the following options.  

- `height`: A String measurement or function returning such to determine the height of the modal. If a function, it is passed the modal view box (*NOT OVERLAY*) as the main argument, which can be assessed for inner element dimensions if desired. _default: auto;_  
- `width`: A String measurement or function returning such to determine the width of the modal. If a function, it is passed the modal view box (*NOT OVERLAY*) as the main argument, which can be assessed for inner element dimensions if desired. _default: 300px;_  
- `header`: A String, DOM element, jQuery object, or function returning any of the previous types to create a header for the modal. _default: undefined;_  
- `body`: A String, DOM element, jQuery object, or function returning any of the previous types to create the content of the modal. _default: undefined;_  
- `footer`: A String, DOM element, jQuery object, or function returning any of the previous types to create a footer for the modal. _default: undefined;_  
- `class`: A String class name to append to the modal box for styling purposes. _default: '';_  
- `closetext`: String text to insert into close button. _default: "Close";_  

## Events  

The modal fires some events with its usage, including when opened and closed.  

- `modal-triggered`: Before the modal is opened/closed.  
- `modal-opened`: When the modal is opened, after rendered and ready.  
- `modal-closed`: When the modal has been closed.  

## Override defaults  

Some default classes, ids, and event names can be modified by changing values in the exposed defaults object: `jmodalDefaults`.  
In most cases, these values should not need to be changed.  
