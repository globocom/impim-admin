(function($){

    /*
    * To use: $(container).fotoPopinCropMiniPreview(options);
    */
    $.widget('images.fotoPopinCropMiniPreview', $.libby.widgetBase, {

        options: {
            container: null,
            width: 200,
            height: 133
        },

        _create: function() {
            this._super('_create');

            this._createElements();
            this._bindEvents();
        },

        _createElements: function() {
            var containerClass = this._classFor('container');
            var imageClass = this._classFor('image');
            var loadingClass = this._classFor('loading');

            var html = [
                '<div class="', containerClass, '">',
                    '<h4>Simulação da imagem</h4>',
                    '<div class="', imageClass, ' container-image">',
                        '<div class="', loadingClass, '"></div>',
                        '<canvas></canvas>',
                    '</div>',
                '</div>'
            ];

            this.elements.container = $(html.join(''));
            this.elements.loadingImage = this.elements.container.find('.' + loadingClass);
            this.elements.containerImage = this.elements.container.find('.' + imageClass);

            this.elements.canvas = this.elements.container.find('canvas');
            this.canvasContext = this.elements.canvas.get(0).getContext('2d');

            this.options.container.append(this.elements.container);
        },


        _bindEvents: function() {
            this._bind('fotoPopinImageSelected', this._fotoPopinImageSelected);
            this._bind('fotoPopinCropChanged', this._fotoPopinCropChanged);
        },

        _fotoPopinCropChanged: function(e, imageData) {
            if (this.currentCroppableImageUrl !== imageData.croppableImageUrl) {
                this.currentCroppableImageUrl = imageData.croppableImageUrl;
                this.elements.loadingImage.show();
                this.elements.image = $('<img>');
                this.elements.image.load($.proxy(function() {
                    this.elements.loadingImage.hide();
                    this._showMiniPreview(imageData);
                }, this));
                this.elements.image.attr('src', imageData.croppableImageUrl);
            } else {
                this._showMiniPreview(imageData);
            }
        },

        _fotoPopinImageSelected: function() {
            this.canvasContext.clearRect(0, 0, this.options.width, this.options.height);
        },

        _showMiniPreview: function(data) {
            var width, height,
                dataHeight = data.height,
                dataWidth = data.width,
                scaledCrop = data.crop.scaled;

            if (!dataHeight && !dataWidth) {
                // edge case em que o editor apaga os dois campos de tamanho de imagem
                dataWidth = scaledCrop.right - scaledCrop.left;
                dataHeight = scaledCrop.bottom - scaledCrop.top;
            } else if (!dataHeight) {
                dataHeight = dataWidth * (scaledCrop.bottom - scaledCrop.top) / (scaledCrop.right - scaledCrop.left);
            } else if (!dataWidth) {
                dataWidth = dataWeight * (scaledCrop.right - scaledCrop.left) / (scaledCrop.bottom - scaledCrop.top);
            }

            if (dataWidth > this.options.width || dataHeight > this.options.height) {
                if (dataWidth / dataHeight > this.options.width / this.options.height) {
                    width = this.options.width;
                    height = width * (dataHeight / dataWidth);
                } else {
                    height = this.options.height;
                    width = height * (dataWidth / dataHeight);
                }
            } else {
                width = dataWidth;
                height = dataHeight;
            }

            this.elements.canvas.
                css({width: width, height: height}).
                attr({width: width, height: height});

            try {
                //O firefox dispara uma exceção quando o load da imagem retorna 404
                this.canvasContext.drawImage(
                    this.elements.image.get(0),
                    scaledCrop.left, scaledCrop.top, scaledCrop.right - scaledCrop.left, scaledCrop.bottom - scaledCrop.top,
                    0, 0, width, height);
            } catch(err) {
                window.console && console.log && console.log("Image unavailable - Error" + err);
            }

            
        }

    });

}(jQuery));
