(function($){

    /*
    * To use: $(container).fotoPopinSearchInfo(options);
    * To activate: $(container).fotoPopinSearchInfo('activate');
    * To deactivate: $(container).fotoPopinSearchInfo('deactivate');
    */
    $.widget('libby.fotoPopinSearchInfo', $.libby.widgetBase, {

        options: {
            container: null
        },

        _create: function() {
            this._super('_create');

            this._createElements();
            this._bindEvents();
        },

        _createElements: function() {
            var containerClass = this._classFor('container');
            var buttonReloadImages = this._classFor('buttonReloadImages');

            this.elements.container = $('<div class="' + containerClass + ' hidden"></div>');

            var html = [
                '<strong></strong> imagens ',
                '<button class="', buttonReloadImages, ' libby-button"></button>'
            ];

            this.elements.container.html(html.join(''));

            this.elements.infoNumImages = this.elements.container.find("strong");
            this.elements.buttonReloadImages = this.elements.container.find("." + buttonReloadImages);

            this.options.container.append(this.elements.container);
        },

        _bindEvents: function() {
            this._bind('fotoPopinNewImages', this._updateInfo);
            this.elements.buttonReloadImages.bind("click", $.proxy(this._seeAllImages, this));
        },

        _seeAllImages: function(e) {
            this.element.trigger("fotoPopinNewSearch", false);
        },

        _updateInfo: function(e, info, isUserSearch) {
            this.elements.container.removeClass('hidden');
            this.elements.infoNumImages.text(info.numFound);
            this.elements.buttonReloadImages.text((isUserSearch) ? 'ver todas as imagens »' : 'recarregar imagens »');
        }

    });

}(jQuery));
