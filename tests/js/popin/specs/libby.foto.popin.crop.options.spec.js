describe('libby foto popin crop options', function() {

    beforeEach(function() {
        this.defaultOptions = $.libby.fotoPopinCropOptions.prototype.options;
        this.container = $('<div>');
    });

    describe('check for default options', function(){
        it('should have a container option', function(){
            expect(this.defaultOptions.container).not.toBeUndefined();
        });
        it('should have a recommendedSizes option', function(){
            expect(this.defaultOptions.recommendedSizes).not.toBeUndefined();
        });
    });

    describe("plugin instance creation without recommendedSizes", function(){
        beforeEach(function(){
            this.container.fotoPopinCropOptions({container: this.container});
            this.container.fotoPopinCropOptions('open').fotoPopinCropOptions('activate');
        });

        it("can be called with a container element", function(){
            expect(this.container.data('fotoPopinCropOptions')).toBeTruthy();
        });
        it("the container will be empty", function(){
            expect(this.container).toBeEmpty();
        });
    });

    describe("plugin instance creation with one recommendedSize", function(){
        beforeEach(function(){
            this.container.fotoPopinCropOptions({
                container: this.container,
                recommendedSizes: [{width: 2, height: 4}]
            });
            this.container.fotoPopinCropOptions('open').fotoPopinCropOptions('activate');
            this.widget = this.container.data('fotoPopinCropOptions');
        });

        it("the container will be empty", function(){
            expect(this.container).toBeEmpty();
        });
    });

    describe("plugin instance creation with more than one recommendedSizes", function(){
        beforeEach(function(){
            this.container.fotoPopinCropOptions({
                container: this.container,
                recommendedSizes: [{width: 2, height: 4}, {width: 4, height: 5}]
            });
            this.container.fotoPopinCropOptions('open').fotoPopinCropOptions('activate');
            this.widget = this.container.data('fotoPopinCropOptions');
        });

        it("the container will contain a button element", function(){
            expect(this.container).toContain('button:contains("tamanhos recomendados")');
        });

        describe('when clicking on the button', function() {
            beforeEach(function(){
                spyOn($.fn, 'trigger').andCallThrough();
                this.widget.elements.changeImageFormatButton.click();
            });

            it('should trigger the "fotoPopinCropOptionsChangeSize" event', function() {
                expect($.fn.trigger).toHaveBeenCalledWith('fotoPopinCropOptionsChangeSize');
            });
        });
    });
});
