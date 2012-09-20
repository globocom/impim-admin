(function($){

    /*
    * To use: $(container).fotoPopinSearchThumbnails(options);
    * To trigger event for currently selected image: $(container).fotoPopinSearchThumbnails('selectImage');
    * To get currently selected image: $(container).fotoPopinSearchThumbnails('selectedImage');
    */
    $.widget('libby.fotoPopinSearchThumbnails', $.libby.widgetBase, {
        options: {
            container: null
        },

        _create: function() {
            this._super('_create');

            this._createBuildPictureHtmlFunction();

            this._createElements();
            this._bindEvents();
        },

        _createElements: function() {
            this.elements.container = $('<div class="'+ this._classFor('container') +'"></div>');

            var html = [
                '<ul class="', this._classFor('container-images'), '">',
                '</ul>'
            ];

            this.elements.container.html(html.join(''));
            this.options.container.append(this.elements.container);

            this.elements.imageList = this.elements.container.find('ul');
        },

        _bindEvents: function() {
            this._bind('fotoPopinClearSearch', this._clearThumbnailsPanel);
            this._bind('fotoPopinNewImages', this._popinFotoNewImages);

            var itemSelector = 'li.'+ this._classFor('image');
            this.elements.imageList.delegate(itemSelector, 'click', $.proxy(this._onItemClick, this));
            this.elements.imageList.delegate(itemSelector, 'dblclick', $.proxy(this._onItemDblclick, this));
            this.elements.imageList.delegate('.'+ this._classFor('current-image-options') +' a', 'click', $.proxy(this._onEditClick, this));
        },

        _clearThumbnailsPanel: function(e) {
            this.elements.container.removeClass('loaded');
            this.elements.imageList.html('');
        },

        _createBuildPictureHtmlFunction: function() {
            this.buildPictureHtml = $.proxy(function() {

                var imageClass = this._classFor('image');
                var firstImageClass = this._classFor('first-image');
                var imageContainerClass = this._classFor('image-container');
                var imageContainerPictureClass = this._classFor('image-container-picture');
                var imageTitleClass = this._classFor('image-title');
                var currentImageOptionsClass = this._classFor('current-image-options');

                return function(imageDate, width, height, title, isCurrentPicture) {
                    var html = [
                        '<li class="', imageClass, (isCurrentPicture ? ' ' + firstImageClass : ''), '">',
                            '<div class="', imageContainerClass, '">',
                                '<div class="', imageContainerPictureClass, '">',
                                    '<ul>',
                                        '<li>',
                                            '<p>cadastrado em</p>',
                                            '<strong>', imageDate, '</strong>',
                                        '</li>',
                                        '<li>',
                                            '<p>tamanho original</p>',
                                            '<strong>', width, 'x', height, '</strong>',
                                        '</li>',
                                    '</ul>',
                                    '<img />',
                                '</div>',
                                '<strong class="', imageTitleClass, '">', title, '</strong>'
                    ];

                    if (isCurrentPicture) {
                        html.push(
                                '<div class="', currentImageOptionsClass, '">',
                                    '<span>imagem atual</span><a href="#">editar</a>',
                                '</div>'
                        );
                    }

                    html.push(
                            '</div>',
                        '</li>'
                    );

                    return html.join('');
                };

            }, this)();
        },

        _popinFotoNewImages: function(e, page) {
            this.elements.container.addClass('loaded');

            if (!page.numFound) {
                this.elements.imageList.html('<p>Não há imagens cadastradas para esse filtro.</p>');
            } else {
                this.elements.imageList.empty();

                var hideLoadingImage = function() {
                    $(this).parent().addClass('loaded');
                };

                for (var index = 0; index < page.photos.length; index++) {
                    var photo = page.photos[index];

                    var html = this.buildPictureHtml(photo.dataCadastro, photo.largura, photo.altura, photo.titulo, photo.imagemAtual);
                    var li = $(html);
                    li.data('meta', photo).
                        find('img').
                        load(hideLoadingImage).
                        attr('src', photo.thumbUrl);

                    this.elements.imageList.append(li);
                }
            }

            this._deselectAllItems();
        },

        _deselectAllItems: function() {
            this.elements.imageList.find('> li').removeClass('selected');
            this.element.trigger('fotoPopinThumbnailsAllItemsDeselected');
        },

        _selectItem: function(itemLi) {
            this._deselectAllItems();
            itemLi.addClass('selected');
            this.element.trigger('fotoPopinThumbnailsItemSelected', [itemLi]);
        },

        _onItemClick: function(e) {
            this._selectItem($(e.currentTarget));
        },

        _onItemDblclick: function(e) {
            this.selectImage($(e.currentTarget));
        },

        _onEditClick: function(e) {
            var itemLi = $(e.currentTarget).parents('li').first();
            this._selectItem(itemLi);
            this.selectImage(itemLi);
            e.preventDefault();
        },

        getImageMetadata: function(itemLi) {
            var meta = (itemLi || this.elements.imageList.find('> li.selected')).data('meta');
            return meta ? {
                id: meta.id,
                date: meta.dataCadastro,
                width: meta.largura,
                height: meta.altura,
                credits: meta.creditos,
                url: meta.url,
                thumbUrl: meta.thumbUrl,
                title: meta.titulo,
                subject: meta.assunto,
                eventDate: meta.dataEvento
            } : null;
        },

        selectImage: function(itemLi) {
            var selectedImageMetadata = this.getImageMetadata(itemLi);
            this.element.trigger('fotoPopinImageSelected', selectedImageMetadata);
        },

        activate: function() {
            this._deselectAllItems();
        }

    });

}(jQuery));
