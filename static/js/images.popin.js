(function($){

    var keys = {
        13: 'enter',
        27: 'esc'
    };

    $.widget('images.fotoPopin', $.libby.widgetBase, {
        options: {
            recommendedSizes: null, // the possible sizes to be selected, ex: [{width: 10, height: 20}, ...]
            hasSearch: true,
            urls: {
                search:        '/globo_foto/search/',
                upload:        '/globo_foto/upload/',
                unsafeUrl:     'http://thumbor.globoi.com/unsafe',
                generateUrl:   '/globo_foto/generate_url/'
            },
            datepicker: {
                changeMonth: true,
                changeYear: true,
                dayNamesMin: ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'],
                dayNames: ['Domingo', 'Segunda', 'Ter&ccedil;a', 'Quarta', 'Quinta', 'Sexta', 'S&acedil;bado'],
                monthNames: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
                dateFormat: "dd/mm/yy",
                yearRange: "-40:+0",
                prevText: "",
                nextText: "",
                duration: "fast"
            }
        },
        tabs: {
            fotoPopinSearch: {
                optionsMap: {
                    'urls.search': 'searchUrl',
                    'datepicker': 'datepicker',
                    'hasSearch': 'hasSearch'
                }
            },
            fotoPopinUpload: {
                optionsMap: {
                    'urls.upload': 'uploadUrl',
                    'datepicker': 'datepicker'
                },
                back: 'fotoPopinSearch'
            },
            fotoPopinCrop: {
                optionsMap: {
                    'recommendedSizes': 'recommendedSizes',
                    'urls.unsafeUrl': 'unsafeUrl'
                },
                back: 'fotoPopinSearch'
            },
            fotoPopinPreview: {
                optionsMap: {
                    'urls.unsafeUrl': 'unsafeUrl'
                },
                back: 'fotoPopinCrop'
            }
        },
        _create: function() {
            this._super('_create');

            this.dimensions = {width: 0, height: 0};
            this.cropSize = {};

            this._createElements();
            this._bindEvents();
        },
        _template: function(str, values){
            $.each(values, function(){
                str = str.replace(/\{\s*([^}]+?)\s*\}/g, function(all, key){
                    return values[key];
                });
            });
            return str;
        },
        _setupHtmlAndCreateElements: function(container, html, elements){
            var self = this;
            $.each(elements, function(key, className){
                elements[key] = self._classFor(className);
            });
            html = this._template(html, elements);
            container.html(html);
            $.each(elements, function(key, className){
                self.elements[key] = container.find('.'+ className);
            });
        },
        _createElements: function(){
            var container = this.element;
            container.addClass(this._classFor('container'));

            var html = [
                '<div class="{topContainer}">',
                    '<button type="button" class="libby-button close-top-button">fechar</button>',
                    '<button type="button" class="libby-button register-top-button">cadastrar imagem ›</button>',
                    '<button type="button" class="libby-button search-top-button">buscar imagem ›</button>',
                '</div>',
                '<div class="{tabsContainer}">',
                    '<div class="{fotoPopinSearch}"></div>',
                    '<div class="{fotoPopinUpload}"></div>',
                    '<div class="{fotoPopinCrop}"></div>',
                    '<div class="{fotoPopinPreview}"></div>',
                '</div>',
                '<div class="{footer}">',
                    '<button type="button" class="libby-button highlighted apply-button">aplicar imagem</button>',
                    '<button type="button" class="libby-button highlighted register-button">cadastrar</button>',
                    '<button type="button" class="libby-button default back-button">‹ voltar</button>',
                    '<button type="button" class="libby-button default preview-button">ver preview</button>',
                    '<button type="button" class="libby-button cancel-button">cancelar</button>',
                    '<div class="{fotoPopinSearchPager}"></div>',
                '</div>'
            ];

            this._setupHtmlAndCreateElements(container, html.join(''), {
                topContainer: 'top',
                tabsContainer: 'tabs',
                footer: 'footer',
                fotoPopinSearch: 'searchtab',
                fotoPopinUpload: 'uploadtab',
                fotoPopinCrop: 'croptab',
                fotoPopinPreview: 'previewtab',
                fotoPopinSearchPager: 'pager'
            });

            this.elements.previewButton = container.find('.preview-button');
            this.elements.applyButton = container.find('.apply-button');

            $('body').append(container);
            this.element.hide();
        },
        _setOption: function(key, value) {
            if (key === 'recommendedSizes') {
                this.element.fotoPopinCrop('option', key, value);
            }
            this._super('_setOption', key, value);
        },
        setCurrentPicture: function(currentPictureId) {
            this._withModulesLoaded($.proxy(function() {
                this.element.fotoPopinSearch('setCurrentPicture', currentPictureId);
            }, this));
        },
        _bindShortcutEvents: function(){
            $(document).bind('keydown.fotoPopinShortcuts', $.proxy(function(event){
                if (!this.element.is(':visible')) return;

                switch(keys[event.keyCode]) {
                case 'esc':
                    this.close();
                    break;
                case 'enter':
                    if (this.activeTabName === 'fotoPopinCrop') {
                        if (this.elements.applyButton.is(':enabled')) {
                            this._selectImage();
                        }
                    }
                    break;
                }
            }, this));
        },
        _bindEvents: function(){
            var self = this;
            this._bindButtonEvents();
            this._bindShortcutEvents();

            this._bind('fotoPopinFinalFormatCalculated', function(event, cropFinalSize) {
                self.cropSize.width = cropFinalSize.width;
                self.cropSize.height = cropFinalSize.height;

                if (!self.invalidImageSelected) {
                    self._enableButtons();
                }
            });

            this._bind('fotoPopinImageSelected', function(event, image) {
                self.image = image;
                self._activateTab('fotoPopinCrop');

                self.invalidImageSelected = false;
                self._enableButtons();
            });

            this._bind('fotoPopinCropChanged', function(event, imageData) {
                self.imageData = imageData;

                self._disableButtons();
            });

            this._bind('fotoPopinSizesChanged', function(event, dimensions) {
                self.dimensions = {
                    width: dimensions.width,
                    height: dimensions.height
                };

                self._disableButtons();
                self.invalidImageSelected = false;
            });

            this._bind('fotoPopinInvalidImageSelected', function(event) {
                self.invalidImageSelected = true;

                self._disableButtons();
            });

            this._bind('fotoPopinThumbnailsAllItemsDeselected', function(event) {
                this.elements.applyButton.attr('disabled', true);
            });

            this._bind('fotoPopinThumbnailsItemSelected', function(event) {
                this.elements.applyButton.attr('disabled', false);
            });
        },

        _disableButtons: function() {
            this.elements.previewButton.attr('disabled', true);
            this.elements.applyButton.attr('disabled', true);
        },

        _enableButtons: function() {
            this.elements.previewButton.removeAttr('disabled');
            this.elements.applyButton.removeAttr('disabled');
        },

        _selectImage: function() {
            $.ajax({
                type: 'GET',
                dataType: 'jsonp',
                context: this,
                url: this.options.urls.generateUrl,
                data: this._getImageData(),
                success: function(data) {
                    var eventData = $.extend({croppedUrl: data, original: {width: this.image.width, height: this.image.height}}, this.image);
                    eventData.width = this.cropSize.width;
                    eventData.height = this.cropSize.height;
                    this.element.trigger('fotoPopinImageApplied', eventData);
                    this.close();
                }
            });
        },

        _bindButtonEvents: function() {
            var self = this;

            var close = $.proxy(this.close, this);
            this.element.delegate('.close-top-button', 'click', close);
            this.element.delegate('.cancel-button', 'click', close);

            this.element.delegate('.register-top-button', 'click', function(){
               self._activateTab('fotoPopinUpload');
            });

            this.element.delegate('.search-top-button', 'click', function(){
               self._activateTab('fotoPopinSearch');
            });

            this.element.delegate('.back-button', 'click', function(){
               switch(self.activeTabName){
               case 'fotoPopinCrop':
                   self.invalidImageSelected = false;
                   self._enableButtons.apply(self);

                   self.element.fotoPopinCropCropper('clearImageData');
                   self._activateTab('fotoPopinSearch');
                   break;
               case 'fotoPopinPreview': self._activateTab('fotoPopinCrop'); break;
               }
            });

            this.element.delegate('.preview-button', 'click', function(){
               self._activateTab('fotoPopinPreview');
            });

            this.element.delegate('.register-button', 'click', function(){
               self.element.trigger('fotoPopinRegister');
            });

            this.element.delegate('.apply-button', 'click', function(){
                switch(self.activeTabName){
                case 'fotoPopinCrop': self._selectImage(); break;
                case 'fotoPopinPreview': self._selectImage(); break;
                case 'fotoPopinSearch':
                    self.image = self.element.fotoPopinSearchThumbnails('getImageMetadata');
                    self.element.trigger("fotoPopinImageSelected", self.image);
                break;
                }
            });
        },

        _getImageData: function() {
            var data = {
                image_url: this.imageData.originalUrl,
                crop_left: this.imageData.crop.left,
                crop_top: this.imageData.crop.top,
                crop_right: this.imageData.crop.right,
                crop_bottom: this.imageData.crop.bottom
            };

            if (this.dimensions.width) {
                data.width = this.dimensions.width;
            } else if (this.imageData.width) {
                data.width = this.imageData.width;
            }

            if (this.dimensions.height) {
                data.height = this.dimensions.height;
            } else if (this.imageData.height) {
                data.height = this.imageData.height;
            }

            return data;
        },

        _callTabMethod: function(tabName, method, arg){
            this.element[tabName](method, arg);
        },
        _deactivateTab: function(tabName){
            this.element.removeClass('images-'+ tabName +'-active');
            this._callTabMethod(tabName, 'deactivate');
        },
        _activateTab: function(tabName){
            if (this.activeTabName){
                this._deactivateTab(this.activeTabName);
            }
            this.activeTabName = tabName;
            this.element.addClass('images-'+ tabName +'-active');
            this._callTabMethod(tabName, 'activate');
        },
        _withModulesLoaded: function(callback){
            if (this._modulesLoaded){
                callback.call(this);
                return;
            }

            this._modulesLoaded = true;
            $.each(this.tabs, $.proxy(function(tabName, tab){
                var tabOptions = $.libby.objectRemap(this.options, tab.optionsMap);
                tabOptions.container = this.elements[tabName];
                tabOptions.pagerContainer = this.elements.fotoPopinSearchPager;
                this.element[tabName](tabOptions);
            }, this));
            callback.call(this);
        },
        _openTabs: function() {
            $.each(this.tabs, $.proxy(function(tabName){
                this._callTabMethod(tabName, 'open');
            }, this));
        },
        _closeTabs: function(tabName){
            $.each(this.tabs, $.proxy(function(tabName){
                this._callTabMethod(tabName, 'close');
            }, this));
        },
        open: function(tabName){
            if (!tabName) {
                tabName = 'fotoPopinSearch';
            }

            this.element.show();
            this._withModulesLoaded($.proxy(function(){
                this._activateTab(tabName);
                this._openTabs();
            }, this));
        },
        close: function(){
            this.dimensions = {
                width: 0,
                height: 0
            };
            this._closeTabs();
            this.element.hide();
            this.element.trigger('fotoPopinClose');
        },
        destroy: function(){
            this._super('destroy');
            this._modulesLoaded = false;
            this.element.remove();
        }
    });

})(jQuery);
