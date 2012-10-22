(function($){

    $.widget('images.fotoPopinSearchFilters', $.libby.widgetBase, {
        options: {
            container: null,
            hasSearch: true,
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
            }
        },

        _create: function() {
            this._super('_create');

            this.page = 1;
            this.isUserSearch = false;
            this.currentPictureId = null;

            this._createElements();
            this._bindEvents();
        },

        _createElements: function() {
            if (!this.options.hasSearch) {
                return;
            }

            var containerClass = this._classFor('container');
            var filterSearchClass = this._classFor('filterSearch');
            var useDateClass = this._classFor('useDate');
            var filtersDateClass = this._classFor('filtersDate');
            var filterInitialDateClass = this._classFor('filterInitialDate');
            var filterFinalDateClass = this._classFor('filterFinalDate');
            var filterDateTypeClass = this._classFor('filterDateType');
            var isEventDateFilterClass = this._classFor('isEventDateFilter');
            var isRegDateFilterClass = this._classFor('isRegDateFilter');
            var closeFilterDateClass = this._classFor('closeFilterDate');
            var submitSearchClass = this._classFor('submitSearch');

            this.elements.container = $('<div class="' + containerClass + '"></div>');

            var html = [
                '<form>',
                    '<fieldset>',
                        '<legend>Buscar midia</legend>',
                        '<ul>',
                            '<li class="', filterSearchClass, '">',
                                '<input type="text" name="q" />',
                            '</li>',
                            '<li class="', filtersDateClass, '">',
                                '<button type="button" class="libby-button default">filtrar por data</button>',
                                '<ul>',
                                    '<li class="', filterInitialDateClass, '">',
                                        '<label for="', filterInitialDateClass, '">de</label>',
                                        '<input id="', filterInitialDateClass, '" type="text" name="from" />',
                                    '</li>',
                                    '<li class="', filterFinalDateClass, '">',
                                        '<label for="', filterFinalDateClass, '">até</label>',
                                        '<input id="', filterFinalDateClass, '" type="text" name="to" />',
                                    '</li>',
                                    '<li class="', filterDateTypeClass, '">',
                                        '<input id="', isEventDateFilterClass, '" class="', isEventDateFilterClass, '" type="radio" name="isevent" />',
                                        '<label for="', isEventDateFilterClass, '">Data do evento</label>',
                                        '<input id="', isRegDateFilterClass, '" class="', isRegDateFilterClass, '" type="radio" name="isevent" checked="checked" />',
                                        '<label for="', isRegDateFilterClass, '">Data de cadastro</label>',
                                    '</li>',
                                    '<li class="', closeFilterDateClass, '">',
                                        '<button type="button">x</button>',
                                    '</li>',
                                '</ul>',
                            '</li>',
                            '<li class="', submitSearchClass, '">',
                                '<button type="submit" class="libby-button default">buscar</button>',
                            '</li>',
                        '</ul>',
                    '</fieldset>',
                '</form>'
            ];

            this.elements.container.html(html.join(''));

            this.elements.form = this.elements.container.find('form');
            this.elements.inputKeyword = this.elements.container.find('.' + filterSearchClass + ' input');

            this.elements.containerDateFilters = this.elements.container.find('.' + filtersDateClass);
            this.elements.buttonUseDate = this.elements.container.find('.' + filtersDateClass + ' > button');
            this.elements.inputDateFrom = this.elements.container.find('.' + filterInitialDateClass + ' input');
            this.elements.inputDateTo = this.elements.container.find('.' + filterFinalDateClass + ' input');
            this.elements.radioUseEvent = this.elements.container.find('.' + isEventDateFilterClass);
            this.elements.radioUseRegister = this.elements.container.find('.' + isRegDateFilterClass);
            this.elements.buttonCloseDate = this.elements.container.find('.' + closeFilterDateClass + ' button');

            this.elements.buttonSubmit = this.elements.container.find('.' + submitSearchClass);

            this.options.container.append(this.elements.container);

            this.elements.inputDateFrom.datepicker(this.options.datepicker);
            this.elements.inputDateTo.datepicker(this.options.datepicker);
        },

        _bindEvents: function() {
            this._bind('fotoPopinNewSearch', this._newSearchEvent);
            this._bind('fotoPopinNewPage', this._newPage);

            if (this.options.hasSearch) {
                this.elements.buttonUseDate.bind('click', $.proxy(this._clickButtonUseDate, this));
                this.elements.buttonCloseDate.bind('click', $.proxy(this._clickButtonCloseDate, this));
                this.elements.form.bind('submit', $.proxy(this._formSubmit, this));
            }
        },

        _newPage: function(e, pageNumber) {
            this.page = pageNumber;
            this._makeSearch(false);
        },

        _clickButtonUseDate: function(e) {
            this.elements.containerDateFilters.addClass('active');
        },

        _clickButtonCloseDate: function(e) {
            this.elements.containerDateFilters.removeClass('active');
        },

        _formSubmit: function(e) {
            e.preventDefault();
            this.isUserSearch = true;
            this._makeSearch(true);
         },

        _newSearchEvent: function(e, isUserSearch) {
            this.isUserSearch = isUserSearch;
            this._clearFilters();
        },

        _clearFilters: function(e) {
            if (this.options.hasSearch) {
                this.elements.inputKeyword.val('');
                this.elements.inputDateFrom.val('');
                this.elements.inputDateTo.val('');
                this.elements.radioUseEvent.attr('checked', false);
                this.elements.radioUseRegister.attr('checked', true);
                this._clickButtonCloseDate();
            }
            this._makeSearch(true);
        },

        _makeSearch: function(isNewSearch) {
            if (isNewSearch || !this.searchParams) {
                this.searchParams = this._prepareParams();
            }

            var page = isNewSearch ? 1 : this.page;
            this.searchParams.page = page;

            if (this.currentPictureId) {
                this.searchParams.currentpicture = this.currentPictureId;
            }

            this.element.trigger('fotoPopinClearSearch');

            $.ajax({
                url: this.options.searchUrl,
                data: this.searchParams,
                dataType: 'jsonp',
                jsonpCallback: 'newImages',
                success: $.proxy(function(response) {
                    this.element.trigger('fotoPopinNewImages', [response, this.isUserSearch, page]);
                }, this)
            });
        },

        _prepareParams: function() {
            var params = {};
            params.page = this.page;
            params.page_size = 18;
            params.thumb_sizes = '134x134';
            if (!this.options.hasSearch) {
                return params;
            }

            params.q = this.elements.inputKeyword.val();
            if (this.elements.containerDateFilters.hasClass('active')) {
                var dateFrom = $.datepicker.formatDate('yy-mm-dd', this.elements.inputDateFrom.datepicker('getDate'));
                dateFrom = dateFrom ? dateFrom + 'T00:00:00' : undefined;
                var dateTo = $.datepicker.formatDate('yy-mm-dd', this.elements.inputDateTo.datepicker('getDate'));
                dateTo = dateTo ? dateTo + 'T23:59:59' : undefined;
                
                if (this.elements.radioUseEvent.is(':checked')) {
                    params.event_date_from = dateFrom;
                    params.event_date_to = dateTo;
                } else {
                    params.created_date_from = dateFrom;
                    params.created_date_to = dateTo;
                }
            }
            return params;
       },

        setCurrentPicture: function(currentPictureId) {
            this.currentPictureId = currentPictureId;
        },

        activate: function() {
            this._makeSearch(true);
        },

        close: function() {
            this._clearFilters();
            this.currentPictureId = null;
        }
    });

})(jQuery);
