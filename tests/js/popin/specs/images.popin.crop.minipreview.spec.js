describe('libby foto popin crop mini-preview', function() {

    beforeEach(function(){
        this.container = $('<div>');
        this.imageData = {
            originalUrl: 'http://s.glbimg.com/somefoto.jpg',
            croppableImageUrl: 'http://s.glbimg.com/somefoto.jpg',
            crop: {
                scaled: {
                    left: 10,
                    top: 10,
                    right: 100,
                    bottom: 100
                },
                left: 10,
                top: 10,
                right: 100,
                bottom: 100
            },
            width: 200,
            height: 133
        };
    });

    describe("plugin instance creation", function(){
        beforeEach(function(){
            this.container.fotoPopinCropMiniPreview({ container: this.container });
        });

        it("can be called with a container element", function(){
            expect(this.container.data('fotoPopinCropMiniPreview')).toBeTruthy();
            this.container.fotoPopinCropMiniPreview('destroy');
        });

        it("contains a div for all the elements", function() {
            expect(this.container).toContain('div.libby-fotoPopinCropMiniPreview-container');
        });

        it("has a title", function() {
            expect(this.container).toContain('h4:contains("Simulação da imagem")');
        });

        it("contains a div for all the elements", function() {
            expect(this.container).toContain('div.libby-fotoPopinCropMiniPreview-container');
        });

        it("has a div for the canvas", function() {
            expect(this.container).toContain('div.libby-fotoPopinCropMiniPreview-image.container-image');
        });

        it("has a div to show that there is content loading", function() {
            expect(this.container).toContain('div.libby-fotoPopinCropMiniPreview-loading');
        });

        describe("plugin behavior when it is filled with image data passed as event argument", function(){
            beforeEach(function(){
                spyOn($.fn, 'load').andCallFake(function(fn) {
                    fn.apply(this, arguments);
                });
                this.container.trigger("fotoPopinCropChanged", this.imageData);
            });

            it('has an invisible loading image', function() {
                expect(this.container).toContain('div.libby-fotoPopinCropMiniPreview-image.container-image:not(:visible)');
            });
            it('has a canvas with defined width', function() {
                expect(this.container.find('canvas')).toHaveAttr('width', '200');
            });
            it('has a canvas with defined height', function() {
                expect(this.container.find('canvas')).toHaveAttr('height', '133');
            });
            it('has an image with defined style width', function() {
                expect(this.container.find('canvas').css('width')).toEqual('200px');
            });
            it('has an image with defined style width', function() {
                expect(this.container.find('canvas').css('height')).toEqual('133px');
            });
        });
    });
});
