(function($) {

    /*
    * To use: $(container).fotoPopinCrop(options);
    * To activate: $(container).fotoPopinCrop('activate');
    * To deactivate: $(container).fotoPopinCrop('deactivate');
    */
    $.widget('images.fotoPopinCrop', $.libby.widgetBase, {

        options: {
            container: null,
            generateUrl: '/libby/aplicacoes/foto/generate_url',
            unsafeUrl: 'http://thumbor.globoi.com/unsafe',
            miniPreview: {
                width: 200,
                height: 133
            },
            recommendedSizes: null // the possible sizes to be selected, ex: [{width: 10, height: 20}, ...]
        },

        _create: function() {
            this._super('_create');
            this._createElements();
            this._bindEvents();
            this._initializePlugins();
        },

        _createElements: function() {
            var containerClass = this._classFor('container');
            var cropSelectionClass = this._classFor('cropSelectionContainer');
            var cropColumnClass = this._classFor('cropColumnContainer');
            var cropFlipClass = this._classFor('cropFlipContainer');
            var cropSizeSelectClass = this._classFor('cropSizeSelectContainer');
            var cropCropperClass = this._classFor('cropCropperContainer');
            var cropInfoClass = this._classFor('cropInfoContainer');
            var cropSizesClass = this._classFor('cropSizesContainer');
            var cropOptionsClass = this._classFor('cropOptionsContainer');
            var cropMiniPreviewClass = this._classFor('cropMiniPreviewContainer');

            this.elements.container = $('<div class="' + containerClass + '"></div>');

            var html = [
                '<div class="', cropSelectionClass, '">',
                    '<h3>Escolha um corte ',
                        '<span></span>',
                    '</h3>',
                    '<div class="', cropFlipClass, '">',
                        '<div class="', cropCropperClass, '"></div>',
                        '<div class="', cropSizeSelectClass, '"></div>',
                    '</div>',
                    '<div class="', cropInfoClass, '"></div>',
                '</div>',

                '<div class="', cropColumnClass, '">',
                    '<h4>Formatos disponíveis</h4>',
                    '<div class="', cropSizesClass, '"></div>',
                    '<div class="', cropOptionsClass, '"></div>',
                    '<div class="', cropMiniPreviewClass, '"></div>',
                '</div>'
            ];

            this.elements.container.html(html.join(''));
            this.elements.fileName = this.elements.container.find('h3 > span');
            this.elements.cropSelectionContainer = this.elements.container.find('.' + cropSelectionClass);
            this.elements.cropFlipContainer = this.elements.container.find('.'+ cropFlipClass);
            this.elements.cropCropperContainer = this.elements.container.find('.'+ cropCropperClass);
            this.elements.cropSizeSelectContainer = this.elements.container.find('.'+ cropSizeSelectClass);
            this.elements.cropInfoContainer = this.elements.container.find('.'+ cropInfoClass);
            this.elements.cropSizesContainer = this.elements.container.find('.'+ cropSizesClass);
            this.elements.cropOptionsContainer = this.elements.container.find('.'+ cropOptionsClass);
            this.elements.cropMiniPreviewContainer = this.elements.container.find('.'+ cropMiniPreviewClass);

            this.options.container.append(this.elements.container);
        },

        _setOption: function(key, value) {
            // sincronizando os sizes em todos os componentes filhos
            if (key === 'recommendedSizes') {
                this.element.fotoPopinCropSizeSelect('option', key, value);
                this.element.fotoPopinCropSizes('option', key, value);
                this.element.fotoPopinCropOptions('option', key, value);
            }
            this._super('_setOption', key, value);
        },

        _bindEvents: function() {
            this._bind('fotoPopinImageSelected', this._showFileName);
            this._bind('fotoPopinInvalidImageSelected', this._fotoPopinInvalidImageSelected);
            this._bind('fotoPopinValidImageSelected', this._fotoPopinValidImageSelected);
        },

        _fotoPopinInvalidImageSelected: function() {
            this.elements.container.addClass('invalid-image');
        },

        _fotoPopinValidImageSelected: function() {
            this.elements.container.removeClass('invalid-image');
        },

        _initializePlugins: function() {
            this.element.fotoPopinCropFlip({
                container: this.elements.cropFlipContainer
            });
            this.element.fotoPopinCropCropper({
                container: this.elements.cropCropperContainer,
                unsafeUrl: this.options.unsafeUrl
            });
            this.element.fotoPopinCropSizeSelect({
                container: this.elements.cropSizeSelectContainer,
                unsafeUrl: this.options.unsafeUrl,
                recommendedSizes: this.options.recommendedSizes
            });
            this.element.fotoPopinCropInfo({
                container: this.elements.cropInfoContainer,
                unsafeUrl: this.options.unsafeUrl
            });
            this.element.fotoPopinCropSizes({
                container: this.elements.cropSizesContainer,
                recommendedSizes: this.options.recommendedSizes
            });
            this.element.fotoPopinCropOptions({
                container: this.elements.cropOptionsContainer,
                recommendedSizes: this.options.recommendedSizes
            });
            this.element.fotoPopinCropMiniPreview({
                container: this.elements.cropMiniPreviewContainer,
                width: this.options.miniPreview.width,
                height: this.options.miniPreview.height
            });
        },

        _callChildrenPluginsMethods: function(methodName) {
            this.element.fotoPopinCropFlip(methodName);
            this.element.fotoPopinCropCropper(methodName);
            this.element.fotoPopinCropSizeSelect(methodName);
            this.element.fotoPopinCropInfo(methodName);
            this.element.fotoPopinCropSizes(methodName);
            this.element.fotoPopinCropOptions(methodName);
            this.element.fotoPopinCropMiniPreview(methodName);
        },

        activate: function() {
            this._callChildrenPluginsMethods('activate');
        },

        deactivate: function() {
            this._callChildrenPluginsMethods('deactivate');
        },

        open: function() {
            this._callChildrenPluginsMethods('open');
        },

        close: function() {
            this._callChildrenPluginsMethods('close');
        },

        _showFileName: function(e, imageData) {
            var fileName = imageData.url.substring(imageData.url.lastIndexOf('/') + 1);
            this.elements.fileName.text(fileName);
        }

    });

}(jQuery));
