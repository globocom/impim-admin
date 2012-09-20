(function($){

    $.widget('libby.fotoPopinCropOptions', $.libby.widgetBase, {
        options: {
            container: null,
            recommendedSizes: null // the possible sizes to be selected, ex: [{width: 10, height: 20}, ...]
        },

        _create: function() {
            this._super('_create');
        },

        open: function() {
            this.options.container.empty();

            if (this.options.recommendedSizes && this.options.recommendedSizes.length > 1) {
                this._createElements();
            }
        },

        activate: function() {
            this._deactivateButton();
        },

        _createElements: function() {
            var html = [
                '<button class="libby-button default">tamanhos recomendados</button>'
            ];

            this.options.container.append(html.join(''));
            this.elements.changeImageFormatButton = this.options.container.find('button');

            this._bindEvents();
        },

        _bindEvents: function() {
            this.elements.changeImageFormatButton.click($.proxy(this._changeSize, this));
            this._bind('fotoPopinSizeSelected', this._deactivateButton);
        },

        _deactivateButton: function() {
            if (this.elements.changeImageFormatButton) {
                this.elements.changeImageFormatButton.removeClass('active');
            }
        },

        _changeSize: function(e) {
            if (this.elements.changeImageFormatButton) {
                this.elements.changeImageFormatButton.toggleClass('active');
            }
            this.element.trigger('fotoPopinCropOptionsChangeSize');
        }

    });

}(jQuery));
