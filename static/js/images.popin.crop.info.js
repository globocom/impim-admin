(function($){

    /*
    * To use: $(container).fotoPopinCropInfo(options);
    */
    $.widget('images.fotoPopinCropInfo', $.libby.widgetBase, {
        options: {
            container: null,
            invalidImageMessage: 'O tamanho selecionado é maior que o tamanho da foto original.',
            unsafeUrl: 'http://thumbor.globoi.com/unsafe'
        },

        _create: function() {
            this._super('_create');

            this._createElements();
            this._bindEvents();
        },

        _createElements: function() {
            var html = [
                '<div class="', this._classFor('container'), '">',
                    '<div class="', this._classFor('container-original'), '">',
                    '</div>',
                    '<div class="', this._classFor('container-error'), '">',
                        this.options.invalidImageMessage,
                    '</div>',
                    '<div class="', this._classFor('container-final'), '">',
                    '</div>',
                '</div>'
            ];

            this.elements.container = $(html.join(''));

            this.elements.originalContainer = this.elements.container.find('.' + this._classFor('container-original'));
            this.elements.finalContainer = this.elements.container.find('.' + this._classFor('container-final'));
            this.elements.errorContainer = this.elements.container.find('.' + this._classFor('container-error'));

            this._updateFinalFormat();
            this._updateOriginalFormat();

            this.options.container.append(this.elements.container);
        },

        _bindEvents: function() {
            this._bind('fotoPopinImageSelected', this._fotoPopinImageSelected);
            this._bind('fotoPopinCropChanged', this._fotoPopinCropChanged);
        },

        _fotoPopinImageSelected: function(e, infoImage) {
            var size = parseInt(infoImage.width, 10) + 'x' + parseInt(infoImage.height, 10);
            this._updateOriginalFormat(size);
        },

        _updateFormat: function(text, element, size) {
            if (size == null) size = 'calculando...';
            this.elements[element].html(text +': <strong>'+ size +'</strong>');
        },

        _updateFinalFormat: function(size) {
            this._updateFormat('formato final', 'finalContainer', size);
        },

        _updateOriginalFormat: function(size) {
            this._updateFormat('foto original', 'originalContainer', size);
        },

        _fotoPopinCropChanged: function(e, imageData) {
            var self = this,
                url,
                fixedSize = [],
                urlParts = [
                    '/meta',
                    imageData.crop.left + 'x' + imageData.crop.top + ':' + imageData.crop.right + 'x' + imageData.crop.bottom
                ];

            if (imageData.width) {
                fixedSize.push(imageData.width);
            }

            fixedSize.push('x');

            if (imageData.height) {
                fixedSize.push(imageData.height);
            }

            if (fixedSize.length > 1) {
                urlParts.push(fixedSize.join(''));
            }

            urlParts.push(imageData.originalUrl);

            url = this.options.unsafeUrl + urlParts.join('/');

            this._updateFinalFormat();

            $.ajax({
                url: url,
                cache: false,
                dataType: 'jsonp',
                jsonpCallback: 'thumborCallback',
                success: function(data) {
                    var size = data.thumbor.target.width + 'x' + data.thumbor.target.height;
                    self._updateFinalFormat(size);

                    imageData.width = data.thumbor.target.width;
                    imageData.height = data.thumbor.target.height;

                    self.element.trigger('fotoPopinFinalFormatCalculated', [imageData]);
                }
            });
        }

    });

}(jQuery));
