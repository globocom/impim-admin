(function($) {
    /*
    * To use: $(container).fotoPopinSearch(options);
    * To activate: $(container).fotoPopinSearch('activate');
    * To deactivate: $(container).fotoPopinSearch('deactivate');
    */
    $.widget('libby.fotoPopinSearch', $.libby.widgetBase, {

        options: {
            container: null,
            hasSearch: true,
            pagerContainer: null,
            searchUrl: '/libby/aplicacoes/foto/search',
            datepicker: {
                changeMonth: true,
                changeYear: true,
                dayNamesMin: ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'],
                dayNames: ['Domingo', 'Segunda', 'Ter&ccedil;a', 'Quarta', 'Quinta', 'Sexta', 'S&acedil;bado'],
                monthNames: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
                dateFormat: 'dd/mm/yy',
                yearRange: '-40:+0',
                prevText: '',
                nextText: '',
                duration: 'fast'
            },
            currentPicture: null
        },

        _create: function() {
            this._super('_create');

            this._createElements();
            this._initizalizePlugins();
        },

        _createElements: function() {
            var containerClass = this._classFor('container');
            var containerFiltersClass = this._classFor('filtersContainer');
            var containerMoreInfoClass = this._classFor('moreInfoContainer');
            var containerThumbnailsClass = this._classFor('thumbnailsContainer');

            this.elements.container = $('<div class="' + containerClass + '"></div>');

            var html = [
                this.options.hasSearch ? '<h3>Buscar foto</h3>' : '<h3>Selecionar foto</h3>',
                this.options.hasSearch ? '<div class="' + containerFiltersClass + '"></div>' : '',
                '<div class="' + containerMoreInfoClass + '"></div>',
                '<div class="' + containerThumbnailsClass + (this.options.hasSearch ? '' : ' no-search') + '"></div>'
            ];

            this.elements.container.html(html.join(''));

            if (this.options.hasSearch) {
                this.elements.containerFilters = this.elements.container.find('.' + containerFiltersClass);
            }

            this.elements.containerMoreInfo = this.elements.container.find('.' + containerMoreInfoClass);
            this.elements.containerThumbnails = this.elements.container.find('.' + containerThumbnailsClass);

            this.options.container.append(this.elements.container);
        },

        _initizalizePlugins: function() {
            this.element.fotoPopinSearchFilters({
                hasSearch: this.options.hasSearch,
                container: this.options.hasSearch ? this.elements.containerFilters : null,
                datepicker: this.options.datepicker,
                searchUrl: this.options.searchUrl
            });
            this.element.fotoPopinSearchThumbnails({ container: this.elements.containerThumbnails });
            this.element.fotoPopinSearchInfo({ container: this.elements.containerMoreInfo });
            this.element.fotoPopinSearchPager({ container: this.options.pagerContainer });
        },

        setCurrentPicture: function(currentPictureId) {
            this.element.fotoPopinSearchFilters('setCurrentPicture', currentPictureId);
        },

        activate: function() {
            this.element.fotoPopinSearchFilters("activate");
            this.element.fotoPopinSearchThumbnails("activate");
            this.element.fotoPopinSearchInfo("activate");
            this.element.fotoPopinSearchPager("activate");
        },

        deactivate: function() {
            this.element.fotoPopinSearchFilters("deactivate");
            this.element.fotoPopinSearchThumbnails("deactivate");
            this.element.fotoPopinSearchInfo("deactivate");
            this.element.fotoPopinSearchPager("deactivate");
        },

        close: function() {
            this.element.fotoPopinSearchFilters("close");
            this.element.fotoPopinSearchThumbnails("close");
            this.element.fotoPopinSearchInfo("close");
            this.element.fotoPopinSearchPager("close");
        }

    });

})(jQuery);
