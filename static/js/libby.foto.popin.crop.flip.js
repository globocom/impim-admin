(function($){

    $.widget('libby.fotoPopinCropFlip', $.libby.widgetBase, {
        options: {
            container: null
        },

        _create: function() {
            this._super('_create');

            this._createElements();
            this._bindEvents();
            this._addClasses();
        },

        _createElements: function() {
            var children = this.options.container.children();
            this.elements.front = children.eq(0);
            this.elements.back = children.eq(1);
        },

        _bindEvents: function() {
            this._bind('fotoPopinCropOptionsChangeSize', this._flip);
            this._bind('fotoPopinSizeSelected', this._flip);
        },

        _addClasses: function() {
            this.elements.back.addClass('back');
            this.elements.front.addClass('front');
        },

        _flip: function() {
            this.options.container.toggleClass('flip');
        },

        deactivate: function() {
            this.options.container.removeClass('flip');
        }
    });

}(jQuery));
