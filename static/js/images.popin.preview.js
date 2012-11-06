(function($){
    /*
    * To use: $(container).fotoPopinPreview(options);
    * To activate: $(container).fotoPopinPreview('activate');
    * To deactivate: $(container).fotoPopinPreview('deactivate');
    */
    $.widget('images.fotoPopinPreview', $.libby.widgetBase, {

        options: {
            container: null,
            unsafeUrl: 'http://thumbor.globoi.com/unsafe'
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
                    '<h3>Preview do corte ',
                        '<span></span>',
                    '</h3>',
                    '<div class="', imageClass, ' container-image">',
                        '<div class="', loadingClass, '"></div>',
                        '<img/>',
                    '</div>',
                '</div>'
            ];

            this.elements.container = $(html.join(''));
            this.elements.fileSpan = this.elements.container.find('h3 span');
            this.elements.imageContainer = this.elements.container.find('.' + imageClass);
            this.elements.loadingImage = this.elements.imageContainer.find('.' + loadingClass);
            this.elements.image = this.elements.container.find('img');

            this.options.container.append(this.elements.container);
        },

        _bindEvents: function() {
            this._bind('fotoPopinCropChanged', this._fotoPopinCropChanged);
        },

        _fotoPopinCropChanged: function(e, imageData) {
            this.imageData = imageData;
        },

        activate: function() {
            var url = [
                this.options.unsafeUrl,
                this.imageData.crop.left + 'x' + this.imageData.crop.top + ':' +
                this.imageData.crop.right + 'x' + this.imageData.crop.bottom,
                this.imageData.width + 'x' + this.imageData.height,
                impim.url.removeProtocol(this.imageData.originalUrl)
            ].join('/');

            this.elements.loadingImage.show();
            this.elements.fileSpan.text(this._getFileName());
            this._showPreview(url);
        },

        _showPreview: function(previewUrl) {
            var image = $('<img>');
            image.load($.proxy(function() {
                this.elements.loadingImage.hide();
            }, this));
            image.attr('src', previewUrl);
            this.elements.image.replaceWith(image);
            this.elements.image = image;
        },

        deactivate: function() {
            this.elements.fileSpan.text('');
        },

        _getFileName: function() {
            var originalUrl = this.imageData.originalUrl;
            return originalUrl.substring(originalUrl.lastIndexOf('/') + 1);
        }

    });

}(jQuery));
