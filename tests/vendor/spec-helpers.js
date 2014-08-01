define(function(require, exports, module) {

// Imports
var _          = require('underscore');
var $          = require('jquery');
var Marionette = require('marionette');
var Handlebars = require('handlebars');

// Replace underscore template with Handlebars
Marionette.TemplateCache.prototype.compileTemplate = function(rawTemplate) {
    return Handlebars.compile(rawTemplate);
};

// Module

var SpecHelpers = {

    KeyCodes : {
        'downArrow': 40,
        'upArrow': 38,
        'rightArrow': 39,
        'leftArrow': 37,
        'escape': 27,
        'return': 13,
        'tab': 9,
        'delete': 8,
        '_0': 48,
        '_1': 49,
        '_2': 50,
        '_3': 51,
        '_4': 52,
        '_5': 53,
        '_6': 54,
        '_7': 55,
        '_8': 56,
        '_9': 57,
        'a': 65,
        'b': 66,
        'c': 67,
        'd': 68,
        'e': 69,
        'f': 70,
        'g': 71,
        'h': 72,
        'i': 73,
        'j': 74,
        'k': 75,
        'l': 76,
        'm': 77,
        'n': 78,
        'o': 79,
        'p': 80,
        'q': 81,
        'r': 82,
        's': 83,
        't': 84,
        'u': 85,
        'v': 86,
        'w': 87,
        'x': 88,
        'y': 89,
        'z': 90
    },

    Events: {
        simulateEvent: function($el, type, payload) {
            payload = payload || {};
            payload.target = payload.target || $el[0];
            payload.currentTarget = payload.currentTarget || $el[0];

            var e = $.Event(type);
            _.extend(e, payload);

            $el.trigger(e);

            return e;
        },

        simulateMouseEvent: function($el, type, x, y) {
            var payload = {
                pageX: x,
                pageY: y,
                target: $el[0],
                currentTarget: $el[0]
            };

            return this.simulateEvent($el, type, payload);
        },

        simulateMouseEnter: function($el, x, y){
            return this.simulateMouseEvent($el, 'mouseenter', x, y);
        },

        simulateMouseExit: function($el, x, y){
            return this.simulateMouseEvent($el, 'mouseleave', x, y);
        },

        simulateMouseDown: function($el, x, y){
            return this.simulateMouseEvent($el, 'mousedown', x, y);
        },
        simulateMouseMove: function($el, x, y){
            return this.simulateMouseEvent($el, 'mousemove', x, y);
        },
        simulateMouseUp: function($el, x, y){
            return this.simulateMouseEvent($el, 'mouseup', x, y);
        },
        simulateMouseDragged: function($el, startX, startY, endX, endY){
            var events = [];

            events.push( this.simulateMouseDown( $el, startX, startY ));
            events.push( this.simulateMouseMove( $el, endX, endY     ));
            events.push( this.simulateMouseUp  ( $el, endX, endY     ));

            return events;
        },

        simulateTouchEvent: function($el, type, x, y) {
            var touches = [
                {
                    pageX: x,
                    pageY: y,
                    target: $el[0]
                }
            ];

            var payload = {
                originalEvent: {touches: touches, targetTouches: touches},
                target: $el[0],
                currentTarget: $el[0]
            };

            return this.simulateEvent($el, type, payload);
        },

        simulateTouchStart: function($el, x, y){
            return this.simulateTouchEvent($el, 'touchstart', x, y);
        },
        simulateTouchMove: function($el, x, y){
            return this.simulateTouchEvent($el, 'touchmove', x, y);
        },
        simulateTouchEnd: function($el, x, y){
            return this.simulateTouchEvent($el, 'touchend', x, y);
        },
        simulateTouchCancel: function($el, x, y){
            return this.simulateTouchEvent($el, 'touchcancel', x, y);
        },
        simulateTouchDragged: function($el, startX, startY, endX, endY){
            var events = [];

            events.push( this.simulateTouchStart( $el, startX, startY ));
            events.push( this.simulateTouchMove ( $el, endX, endY     ));
            events.push( this.simulateTouchEnd  ( $el, endX, endY     ));

            return events;
        },

        simulateKeyEvent: function($el, type, keyCode) {
            var payload = {
                keyCode: keyCode,
                which: keyCode,
                target: $el[0],
                currentTarget: $el[0]
            };

            return this.simulateEvent($el, type, payload);
        },

        simulateKeyDown: function($el, keyCode){
            this.simulateKeyEvent($el, 'keydown', keyCode);
        },

        simulateKeyUp: function($el, keyCode){
            this.simulateKeyEvent($el, 'keyup', keyCode);
        },

        insertChar: function($el, char){
            var val = function(){
                var action = $el.is('input') ? $el.val : $el.text;
                return action.apply($el, arguments);
            };

            val(val() + char);

            var prefix = isNaN(parseInt(char, 10)) ? '' : '_';
            this.simulateKeyDown($el, SpecHelpers.KeyCodes[prefix + char]);
        },

        simulateOrientationEvent: function($el, payload){
            return this.simulateEvent($el, 'orientationchange', payload);
        },

        simulateOrientationLandscapeLeft: function($el){
            this.simulateOrientationEvent($el, {
                'target': {'orientation': -90}});
        },

        simulateOrientationLandscapeRight: function($el){
            this.simulateOrientationEvent($el, {
                'target': {'orientation': 90}});
        },

        simulateOrientationPortrait: function($el){
            this.simulateOrientationEvent($el, {
                'target': {'orientation': 0}});
        },

        simulateWindowResize: function() {
            this.simulateEvent($(window), 'resize', {});
        },

        simulateScrollEvent: function($el, x, y) {
            var merge = {
                scrollLeft: x || 0,
                scrollTop: y || 0
            };

            var isWindow = window === _.identity($el[0]);
            var target = isWindow ? document.body : $el[0];

            _.extend(target, merge);

            var payload = {
                target: $el[0],
                currentTarget: $el[0]
            };

            this.simulateEvent($el, 'scroll', payload);
        },

        simulateDragStart: function($el, dataTransfer, x, y) {
            return this.simulateDragEvent(
                $el, 'dragstart', dataTransfer, x, y);
        },

        simulateDragEnd: function($el, dataTransfer, x, y) {
            return this.simulateDragEvent(
                $el, 'dragend', dataTransfer, x, y);
        },

        simulateDragEnter: function($el, dataTransfer, x, y) {
            return this.simulateDragEvent(
                $el, 'dragenter', dataTransfer, x, y);
        },

        simulateDragOver: function($el, dataTransfer, x, y) {

            return this.simulateDragEvent(
                $el, 'dragover', dataTransfer, x, y);
        },

        simulateDragLeave: function($el, dataTransfer, x, y) {

            return this.simulateDragEvent(
                $el, 'dragleave', dataTransfer, x, y);
        },

        simulateDrop: function($el, dataTransfer, x, y) {

            return this.simulateDragEvent(
                $el, 'drop', dataTransfer, x, y);
        },

        simulateDragEvent: function($el, type, dataTransfer, x, y) {
            var dt = dataTransfer || this.dragAndDropDataTransfer();

            var payload = {
                originalEvent: {dataTransfer: dt, pageX: x || 0, pageY: y || 0}
            };

            return this.simulateEvent($el, type, payload);
        },

        dragAndDropDataTransfer: function(){

            DataTransfer = function(){
                this._data = {};
                this.effectAllowed = 'all';
                this.dropEffect = 'none';
                this.types = [];
            };

            DataTransfer.prototype.setData = function(type, data){
                this._data[type] = data;
                this.types.push(type);
            };

            DataTransfer.prototype.getData = function(type){
                return this._data[type];
            };

            return new DataTransfer();
        }
    }

}; // eof SpecHelpers

// Exports
module.exports = SpecHelpers;

}); // eof define
