describe('libby foto popin search', function() {

    beforeEach(function(){
        this.container = $('<div></div>');
        this.pagerContainer = $('<div></div>');
    });

    describe("plugin instance creation", function(){

        beforeEach(function(){
            this.container.fotoPopinSearch({ container: this.container, pagerContainer: this.pagerContainer });
        });

        it('can be called with no arguments', function() {
            expect(this.container.data('fotoPopinSearch')).toBeTruthy();
            this.container.fotoPopinSearch('destroy');
        });

        it('contains a div for all the elements', function() {
            expect(this.container).toContain('div.libby-fotoPopinSearch-container');
        });

        it('contains a div for search filters plugin', function() {
            expect(this.container).toContain('div.libby-fotoPopinSearch-container > div.libby-fotoPopinSearch-filtersContainer');
        });

        it('contains a p for search info plugin', function() {
            expect(this.container).toContain('div.libby-fotoPopinSearch-container > div.libby-fotoPopinSearch-moreInfoContainer');
        });

        it('contains a div as container for thumbnails plugin', function() {
            expect(this.container).toContain('div.libby-fotoPopinSearch-container > div.libby-fotoPopinSearch-thumbnailsContainer');
        });

        it('has an H3 with text Buscar foto', function() {
            expect(this.container.find('h3')).toHaveText('Buscar foto');
        });

    });

    describe('plugin behavior when it is filled with event of selection image', function() {

        beforeEach(function(){
            this.container.fotoPopinSearch({ container: this.container, pagerContainer: this.pagerContainer });
        });

    });

});
