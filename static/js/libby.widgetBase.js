(function($){

    var slice = Array.prototype.slice;

    $.widget('libby.widgetBase', {
        options: {
            pubsub: null
        },
        _super: function(method){
            return this._superApply(method, slice.call(arguments, 1));
        },
        _superApply: function(method, args){
            return $.libby.widgetBase.prototype[method].apply(this, args);
        },
        _create: function() {
            this.elements = {};
        },
        _bind: function(eventName, callback) {
            (this.options.pubsub || this.element).bind(eventName + '.' + this.widgetName, $.proxy(callback, this));
        },
        _trigger: function(eventName, args) {
            (this.options.pubsub || this.element).trigger(eventName, args);
        },
        _classFor: function(className) {
            return this.widgetBaseClass + ((className) ? '-' + className : '');
        },
        activate: function(){},
        deactivate: function(){}
    });

})(jQuery);
