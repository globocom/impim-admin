(function($){

    /*
    * To use: $(container).fotoPopinCropSizes(options);
    */
    $.widget('libby.fotoPopinCropSizes', $.libby.widgetBase, {
        options: {
            container: null,
            recommendedSizes: null // the possible sizes to be selected, ex: [{width: 10, height: 20}, ...]
        },

        _create: function() {
            this._super('_create');

            this._createElements();
            this._bindEvents();
        },

        _createElements: function() {
            this.elements.container = $('<div class="' + this._classFor('container') + '"></div>');

            var html = [
                '<div class="', this._classFor('container-width'), '">',
                    '<label for="', this._classFor('container-width-field'), '">largura:</label>',
                    '<input id="', this._classFor('container-width-field'), '" class="',
                        this._classFor('container-width-field'),
                        '" name="', this._classFor('container-width-field'),
                        '" type="text" maxlength="5"></input>',
                '</div>',
                '<div class="', this._classFor('container-height'), '">',
                    '<label for="', this._classFor('container-height-field'), '">altura:</label>',
                    '<input id="', this._classFor('container-height-field'),
                        '" class="', this._classFor('container-height-field'),
                        '" name="', this._classFor('container-height-field'),
                        '" type="text" maxlength="5"></input>',
                '</div>'
            ];

            this.options.container.append(this.elements.container);
            this.elements.container.html(html.join(''));
            this.elements.widthContainer = this.elements.container.find('.' + this._classFor('container-width'));
            this.elements.heightContainer = this.elements.container.find('.' + this._classFor('container-height'));
            this.elements.widthField = this.elements.widthContainer.find('input');
            this.elements.heightField = this.elements.heightContainer.find('input');
        },

        _setOption: function(key, value) {
            if (key === 'recommendedSizes') {
                var firstRecommendeSize = value[0];
                this._updateInputValues(firstRecommendeSize.width, firstRecommendeSize.height);
            }
            this._super('_setOption', key, value);
        },

        _onKeyup: function() {
            var width = parseInt(this.elements.widthField.val(), 10) || 0;
            var height = parseInt(this.elements.heightField.val(), 10) || 0;

            if (width !== this.values.width || height !== this.values.height) {
                this.values.width = width;
                this.values.height = height;

                if (width > this.imageSize.width || height > this.imageSize.height) {
                    this.element.trigger('fotoPopinSizesChanged', {width: this.imageSize.width, height: this.imageSize.height});
                    this.element.trigger('fotoPopinInvalidImageSelected');
                } else {
                    this.element.trigger('fotoPopinValidImageSelected', this.values);
                    this.element.trigger('fotoPopinSizesChanged', this.values);
                }
            }
        },

        _onDelayedKeyup: function() {
            clearTimeout(this._changeSelectionTimer);
            this._changeSelectionTimer = setTimeout($.proxy(this._onKeyup, this), 400);
        },

        _onKeypress: function(e) {
            // checking if charCode is zero will certify me that non charkeys (like the arrows) are ignored
            if (e.charCode === 0) {
                return;
            }
            var _char = String.fromCharCode(e.charCode);
            return (/^\d$/).test(_char);
        },

        _bindEvents: function() {
            var sizeChanged = $.proxy(this._onDelayedKeyup, this),
                numbersOnly = $.proxy(this._onKeypress, this);

            this.elements.heightField.keyup(sizeChanged);
            this.elements.widthField.keyup(sizeChanged);

            this.elements.widthField.keypress(numbersOnly);
            this.elements.heightField.keypress(numbersOnly);

            this._bind('fotoPopinImageSelected', this._onImageSelected);
            this._bind('fotoPopinSizeSelected', this._onPopinSizeSelected);
        },

        _updateInputValues: function(width, height) {
            this.elements.widthField.val(width);
            this.elements.heightField.val(height);
        },

        _onPopinSizeSelected: function(e, size) {
            this._updateInputValues(size.width, size.height);
        },

        _onImageSelected: function(e, imageData) {
            this.imageSize = {width: imageData.width, height: imageData.height};

            var sizes = this.options.recommendedSizes;
            var width = (sizes && sizes.length) ? parseInt(sizes[0].width, 10) : '';
            var height = (sizes && sizes.length) ? parseInt(sizes[0].height, 10) : '';

            this.elements.widthField.val(width);
            this.elements.heightField.val(height);
            this.values = {width: width || 0, height: height || 0};

            if (this.imageSize.width < width || this.imageSize.height < height) {
                this.element.trigger('fotoPopinInvalidImageSelected');
            } else {
                this.element.trigger('fotoPopinValidImageSelected', this.values);
                this.element.trigger('fotoPopinSizesChanged', this.values);
            }
        }

    });

}(jQuery));
