describe('libby foto popin crop', function() {

    beforeEach(function(){
        this.container = $('<div></div>');
    });

    describe("plugin instance creation", function(){

        beforeEach(function(){
            this.container.fotoPopinCrop({ container: this.container });
        });

        it('can be called with no arguments', function() {
            expect(this.container.data('fotoPopinCrop')).toBeTruthy();
            this.container.fotoPopinCrop('destroy');
        });

        it('contains a div for all the elements', function() {
            expect(this.container).toContain('div.libby-fotoPopinCrop-container');
        });

        it('contains a div for all crop selection plugins', function() {
            expect(this.container).toContain('div.libby-fotoPopinCrop-container > div.libby-fotoPopinCrop-cropSelectionContainer');
        });

        it('contains a container div for the flip plugin', function() {
            expect(this.container).toContain('div.libby-fotoPopinCrop-cropSelectionContainer > div.libby-fotoPopinCrop-cropFlipContainer');
        });

        it('contains a div as container for cropper plugin', function() {
            expect(this.container).toContain('div.libby-fotoPopinCrop-cropFlipContainer > div.libby-fotoPopinCrop-cropCropperContainer');
        });

        it('should have a reference for cropCropperContainer', function() {
            var info = this.container.data('fotoPopinCrop');
            expect(info.elements.cropCropperContainer).toBeTruthy();
        });

        it('contains a div as container for crop information plugin', function() {
            expect(this.container).toContain('div.libby-fotoPopinCrop-cropSelectionContainer > div.libby-fotoPopinCrop-cropInfoContainer');
        });

        it('should have a reference for cropInfoContainer', function() {
            var info = this.container.data('fotoPopinCrop');
            expect(info.elements.cropInfoContainer).toBeTruthy();
        });

        it('contains a div for right side to be some selection options', function() {
            expect(this.container).toContain('div.libby-fotoPopinCrop-container > div.libby-fotoPopinCrop-cropColumnContainer');
        });

        it('contains a H4 for title of formats', function() {
            expect(this.container).toContain('div.libby-fotoPopinCrop-cropColumnContainer > h4');
        });

        it('contains a H4 with text Formatos disponíveis', function() {
            expect(this.container.find('div.libby-fotoPopinCrop-cropColumnContainer > h4')).toHaveText('Formatos disponíveis');
        });

        it('contains a div as container for crop sizes available', function() {
            expect(this.container).toContain('div.libby-fotoPopinCrop-cropColumnContainer > div.libby-fotoPopinCrop-cropSizesContainer');
        });

        it('should have a reference for cropSizesContainer', function() {
            var info = this.container.data('fotoPopinCrop');
            expect(info.elements.cropSizesContainer).toBeTruthy();
        });

        it('contains a div as container for a preview of crop', function() {
            expect(this.container).toContain('div.libby-fotoPopinCrop-cropColumnContainer > div.libby-fotoPopinCrop-cropMiniPreviewContainer');
        });

        it('should have a reference for cropMiniPreviewContainer', function() {
            var info = this.container.data('fotoPopinCrop');
            expect(info.elements.cropMiniPreviewContainer).toBeTruthy();
        });

        it('contains an h3', function() {
            expect(this.container).toContain('div.libby-fotoPopinCrop-cropSelectionContainer > h3');
        });

        it('has a span inside H3', function() {
            expect(this.container.find('h3 > span').length).toEqual(1);
        });

        it('has an empty span inside H3', function() {
            expect(this.container.find('h3 > span')).toHaveText("");
        });

        it('has an H3 with text Escolha um corte', function() {
            expect(this.container.find('h3')).toHaveText('Escolha um corte ');
        });

        it('should have a reference for a span', function() {
            var info = this.container.data('fotoPopinCrop');
            expect(info.elements.fileName).toBeTruthy();
        });

    });

    describe('plugin behavior when it is filled with event of selection image', function() {

        beforeEach(function(){
            this.container.fotoPopinCrop({ container: this.container });
            this.container.trigger("fotoPopinImageSelected", {
                url: '/some/foto/original.jpg',
                width: 200,
                height: 300
            });
        });

        it("should have to show a image name", function(){
            expect(this.container.find('h3 > span')).toHaveText("original.jpg");
        });

    });

});
