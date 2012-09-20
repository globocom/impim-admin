(function($){
    /*
    * To use: $(container).fotoPopinPager(options);
    * To activate: $(container).fotoPopinPager('activate');
    * To deactivate: $(container).fotoPopinPager('deactivate');
    */
    $.widget('libby.fotoPopinSearchPager', $.libby.widgetBase, {

        options: {
            container: null
        },

        _create: function(){
            this._super('_create');

            this.page = 0;
            this.maxPage = 0;

            this._createElements();
            this._bindEvents();
        },

        _createElements: function(){
            var containerClass = this._classFor('container');
            var backPageClass = this._classFor('backPage');
            var nextPageClass = this._classFor('nextPage');
            var currentPageClass = this._classFor('currentPage');
            var totalPagesClass = this._classFor('totalPages');

            this.elements.container = $('<div class="' + containerClass + ' off"></div>');

            var html = [
                '<button type="button" class="' + backPageClass + ' off">anterior</button>',
                '<input type="text" class="' + currentPageClass + '" />',
                '<span> de </span>',
                '<span class="' + totalPagesClass + '"></span>',
                '<button type="button" class="' + nextPageClass + '">próximo</button>'
            ];

            this.elements.container.html(html.join(''));

            this.elements.buttonBackPage = this.elements.container.find("." + backPageClass);
            this.elements.buttonNextPage = this.elements.container.find("." + nextPageClass);
            this.elements.inputCurrentPage = this.elements.container.find("." + currentPageClass);
            this.elements.totalPagesInfo = this.elements.container.find("." + totalPagesClass);

            this.options.container.append(this.elements.container);
        },

        _bindEvents: function(){
            this._bind('fotoPopinNewImages', this._onNewImages);
            this._bind('fotoPopinNewPage', this._onNewPage);

            this.elements.inputCurrentPage.change($.proxy(this._currentPageChanged, this));
            this.elements.buttonBackPage.click($.proxy(this._clickBackPage, this));
            this.elements.buttonNextPage.click($.proxy(this._clickNextPage, this));
        },

        _clickNextPage: function(e) {
            this._newPageRequested(e, this.elements.buttonNextPage, this.page + 1);
        },

        _clickBackPage: function(e) {
            this._newPageRequested(e, this.elements.buttonBackPage, this.page - 1);
        },

        _newPageRequested: function(e, clickedButton, newPage) {
            if (!clickedButton.hasClass('off') && newPage <= this.maxPage && newPage > 0) {
                this.element.trigger('fotoPopinNewPage', newPage);
            }
        },

        _currentPageChanged: function(){
            var pageInput = parseInt(this.elements.inputCurrentPage.val(), 10);

            page = isNaN(pageInput) ? this.page : pageInput;

            page = Math.max(page, 1);
            page = Math.min(page, this.maxPage);

            this.element.trigger('fotoPopinNewPage', page);
        },

        _onNewImages: function(ev, data, isUserSeach, page) {
            this.maxPage = Math.ceil(data.numFound / data.pageSize);
            this._onNewPage(null, page);
        },

        _onNewPage: function(e, page) {
            this.page = page;
            this.elements.inputCurrentPage.val(this.page);
            this.elements.buttonBackPage[ (this.page > 1) ? 'removeClass' : 'addClass' ]('off');
            this.elements.buttonNextPage[ (this.page < this.maxPage) ? 'removeClass' : 'addClass' ]('off');

            this.elements.inputCurrentPage.val(this.page);
            this.elements.totalPagesInfo.text(this.maxPage);

            this.elements.container[(this.maxPage <= 1) ? 'addClass' : 'removeClass']('off');
        }

    });

})(jQuery);

