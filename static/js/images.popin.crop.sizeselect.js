(function($){

    $.widget('libby.fotoPopinCropSizeSelect', $.libby.widgetBase, {
        options: {
            container: null,
            unsafeUrl: 'http://thumbor.globoi.com/unsafe',
            recommendedSizes: null // the possible sizes to be selected, ex: [{width: 10, height: 20}, ...]
        },

        _create: function() {
            this._super('_create');
            this._bindEvents();
        },

        _bindEvents: function() {
            this._bind('fotoPopinImageSelected', this._imageSelected);
            this.options.container.delegate('a', 'click', $.proxy(this._selectSize, this));
        },

        _imageSelected: function(e, image) {
            this.options.container.empty();
            if (this.options.recommendedSizes && this.options.recommendedSizes.length > 1) {
                this._createSizesList(image);
            }
        },

        _selectSize: function(e) {
            var currentTarget = $(e.currentTarget);
            e.preventDefault();

            if (!currentTarget.hasClass('invalid')) {
                var size = currentTarget.data('size');
                this.element.
                    trigger('fotoPopinSizesChanged', size).
                    trigger('fotoPopinSizeSelected', size);
            }
        },

        _isValidSize: function(size, image) {
            return (image.width >= size.width && image.height >= size.height);
        },

        _calculateThumbSize: function(size, availableSize) {
            var width = availableSize.width,
                height = availableSize.height,
                sizeRatio = size.width / size.height;

            if (size.width < availableSize.width && size.height < availableSize.height) {
                width = size.width;
                height = size.height;
            } else if (sizeRatio > 1) {
                height = Math.round(width / sizeRatio);
            } else if (sizeRatio < 1) {
                width = Math.round(height * sizeRatio);
            }

            return {width: width, height: height};
        },

        _createSizesList: function(image) {
            var sizes = this.options.recommendedSizes;
            var html = ['<ul>'];

            for (var i = 0; i < sizes.length; i++) {
                var thumbTitle = sizes[i].label || sizes[i].width + ' x ' + sizes[i].height;
                html.push(
                    '<li>',
                        '<a title="', thumbTitle, '" href="#', thumbTitle.replace(/\s+/g, ''), '">',
                            '<span></span>',
                            '<strong>', thumbTitle, '</strong>',
                        '</a>',
                    '</li>'
                );
            }

            html.push('</ul>');
            this.options.container.html(html.join(''));

            var spans = this.options.container.find('span');
            var firstSpan = spans.first();
            var availableSize = {width: firstSpan.width(), height: firstSpan.height()};

            // colocar classe para quando o tamanho for invalido
            spans.each($.proxy(function(i, el) {
                var thumbSize = this._calculateThumbSize(sizes[i], availableSize);
                var imageSpan = $(el).
                    append(['<img src="', this.options.unsafeUrl, '/', thumbSize.width, 'x', thumbSize.height, '/', image.url, '"/>'].join('')).
                    parent().
                    data('size', {width: sizes[i].width, height: sizes[i].height});

                if (!this._isValidSize(sizes[i], image)) {
                    imageSpan.addClass('invalid');
                }
            }, this));
        }

    });

}(jQuery));
