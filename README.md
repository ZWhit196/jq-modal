# jModal - Modal Windows for easy pop-ups

A jQuery plugin for creating modals with jQuery, allowing some flexibility with the content and purpose.  

## Basic usage

An empty modal can be instantiated really easily, just like this:  

```javascript

$('.selector').jmodal();

```

When instantiated, the target element will be assigned a `data-jmodal` attribute with a value which corresponds to a jmodal id value.  
This is used for accessing and interacting with the jmodal instance, and removing this attribute can cause issues with using the methods in code to access the modal.  

## Options

The following options can be used the options in the jmodal configuration.  
The format is as follows:  

`(option)` : (types)  
(Description)  
Defaults to (value)  

---

`content` : String, HTML, jQuery, function  
The content for the modal to display in the main modal body. If nothing is passed, the body will be rendered empty. A HTML or jQuery object can be passed to insert as the body content, or a function can be given which should return content which can be appended to the modal body.  
Defaults to `''`.  

`header` : Boolean, String, HTML, jQuery, function  
Determines whether to render a header on the modal. If `false`, no header is created. If a HTML or jQuery object is passed, this is set as the content of the header section. A function should return the content for the header, and is passed the text that would be assigned as the title. This allows the `headerTitle` option to be passed and still used within the function if desired.  
Defaults to `true`.  

`headerTitle` : String, function  
The main content for the modal title. Without a header, this will never be used. A function should return a String for use in the title header.  
Defaults to `''`.  

`closeButton` : Boolean, String, HTML, jQuery, function
Determines whether to render a close button in the header of the modal. If there is no header, this could be considered to be `false`, as there would never be a header for the button to be rendered in. A HTML or jQuery object would act as a replacement for the button, thus allowing custom buttons to be added in place of the default button. A function should return one of either an HTML element, jQuery object, or String.  
Defaults to `true`.  

`footer` : Boolean, String, HTML, jQuery, function  
Similar to the `header` option, but for a footer section.  
Defaults to `false`.  

`height` : String, Number, function  
Assigns a height value to the modal container. Can be any CSS valid value, or a function returning as such. Number values passed are assumed to be `px` measurements.  
Defaults to `auto`.  

`width` : String, Number, function  
Similar to height but applied as a width measurement.  
Defaults to `auto`.  

`customClass` : String  
Any string name (or space separated names) to add to the modal container to assist with styling.  
Defaults to `''`.  

`data` : Object, function  
An object of key/value pairings to assign as data attributes to the modal container. This can be useful for storing any little bits of information you might need to reference to. Functions should return the same.  
Defaults to `null`.  

`altParent` : String, HTML, jQuery, function  
Provide an alternative parent for the modal content to be placed in. By default, jmodal places the modals as a direct child of the body, so that when the modal is opened, the majority of the document is usually inaccessible via clicks until the modal closes. In some cases, you may still want to access areas of a page, so providing an `altParent` will allow greater control over what can be interacted with. This also affects the target of the `lockScroll` option.  
Defaults to `null`.

`eventTarget` : String, HTML, jQuery, function  
Provides an alternative target element on which to emit modal events. Usually the element that is selected when the modal is created is used as this target, but this provides a means of using an alternative element to capture these events. Strings should be viable jQuery selector strings, HTML and jQuery objects can have the events registered on them, and a function should return any of the previous types here.  
Defaults to `null`.

`preserveModal` : Boolean  
Determines whether or not the modal should be destroyed when closed. If `false`, the modal will be destroyed, similar to explicitly destroying the modal within an 'onClose' handler. This can be useful for one-time modals, however for most modals, this is not usually a desired behaviour, so this will default to `true`, so that the modal is simply hidden when closed.  
Defaults to `true`.

`restoreContent` : Boolean, HTML, jQuery, function  
Depending on the content used when creating the modal, you may want to keep the content safe, maybe for inserting or using elsewhere when the modal is destroyed. If this is set as `true`, the modal body content will be detached and appended to the `body` of the document, and hidden. This may not always be the desired location, so a HTML or jQuery object can be passed to attach the content to instead, or if a function is provided, the content will be passed as a jQuery object, so you can attach or handle the content in whatever way you want. Remember that this option only operates when the modal is destroyed, and not when it is closed. If `false` or not given, the content is lost on destroy.  
Defaults to `false`.  

`onOpen` : function, Array  
A function or Array of functions that will be called (in order), after a modal is opened.  
Defaults to `null`.

`onClose` : function, Array  
Similar to the `onOpen` option, but the function(s) are called after a modal is closed.  
Defaults to `null`.

`onDestroy` : function, Array  
Similar to `onOpen` and `onClose`, but for after a modal is destroyed.  
Defaults to `null`.  

`closeOnOutClick` : Boolean  
If set to `true`, the modal will be closed when the area outside of the modal container is clicked on.  
Defaults to `true`.  

`lockScroll` : Boolean  
If set to `true`, when the modal is opened, the body of the document (or `altParent` if given) will be forced to not scroll by enforcing a `overflow: hidden`, preventing a user from scrolling the page by normal means. Useful if a modal may have a long content that could scroll.  
Defaults to `true`.

## Changing option defaults  

The default values for the above options can be changed fairly simply, just use one of the following formats:  

```javascript
// Basic assignment
$.jmodal.defaults['optionName'] = value;
$.jmodal.defaults.optionName = value;

// Multiple values
Object.assign($.jmodal.defaults, {
    optionName: value,
    optionNameTwo: valueTwo,
});

// jQuery equivalent of multiple values
$.extend($.jmodal.defaults, {
    optionName: value,
    optionNameTwo: valueTwo,
});
```

## Methods

There are a handful of methods to help out with using the modals.  
The format is as follows:  

`(method)` : `(sample usage)`  
(Description)  
Returns (type) | No return  

---

`open` : `$('.selector').jmodal('open')`  
A simple way to programatically open a modal that has already been instantiated. Must be called on an element which has had a modal created on it.  
No return.  

`close` : `$('.selector').jmodal('close')`  
A simple way to programatically close a modal that has already been instantiated. Must be called on an element which has had a modal created on it.  
No return.  

`toggle` : `$('.selector').jmodal('toggle')`  
A simple way to programatically toggle open or closed a modal that has already been instantiated. Must be called on an element which has had a modal created on it.  
No return.  

`instance` : `$('.selector').jmodal('instance')`  
Allows you to get the jmodal instance object associated to this modal.  
Returns JModal instance or `undefined`.  

`option` (getter) : `$('.selector').jmodal('option', 'optionName')`  
Access the value of an option which was used to configure the jmodal instance.  
Returns option value.  

`option` (setter) : `$('.selector').jmodal('option', 'optionName', value)`
Allows for updating values of the jmodal instance.  
No return.  

`destroy` : `$('.selector').jmodal('destroy')`  
Destroys the modal.  
No return.  

## Instance methods  

When you have an instance to hand, usually via the `instance` method, the following methods are common use cases you may have.  
The format is as follows:  

`(method)` : `(sample usage)`  
(Description)  

`open` : `instance.destroy()`  
Opens the modal.

`close` : `instance.destroy()`  
Closes the modal.  

`toggle` : `instance.destroy()`  
Toggles open or closed the modal.  

`destroy` : `instance.destroy()`  
Destroys the modal.  

## Events  

Some events are emitted by the modal on certain actions. The events will be emitted on the target element when initialised, or the `altTarget` given in the instance configuration (if any).  
The format is as follows:  

`(event)` : (Description)  

---  

`modal-closed` : Occurs when a modal is closed.  

`modal-opened` : Occurs when a modal is opened.  

## Note about styling  

As it stands right now, this plugin comes with a very bare-bones style sheet, which leaves a lot of the stylistic side to the user of this plugin, and doesn't overwhelm with a massive hyper structure.  
All jmodal generated content will have a class with its name following the format of `jmodal-` and a relevant body part name.  

- `jmodal-cover`  
- `jmodal-container`  
- `jmodal-head`  
- `jmodal-body`  
- `jmodal-foot`  
- `jmodal-close`  
- `jmodal-title`  
