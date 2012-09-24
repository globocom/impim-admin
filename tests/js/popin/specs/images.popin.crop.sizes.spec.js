describe('libby foto popin crop sizes', function() {

    beforeEach(function() {
        this.defaultOptions = $.libby.fotoPopinCropSizes.prototype.options;
        this.container = $('<div>');
    });

    describe('check for default options', function(){
        it('should have a recommendedSizes option', function(){
            expect(this.defaultOptions.recommendedSizes).not.toBeUndefined();
        });
        it('should have a container option', function(){
            expect(this.defaultOptions.container).not.toBeUndefined();
        });
    });

    describe('plugin instance creation', function(){
        beforeEach(function() {
            this.container.fotoPopinCropSizes({
                container: this.container,
                recommendedSizes: [{width: 2, height: 4}]
            });
        });

        it('can be called with no arguments', function() {
            expect(this.container.data('fotoPopinCropSizes')).toBeTruthy();
            this.container.fotoPopinCropSizes('destroy');
        });

        it('creates a div called dimensions', function() {
            expect(this.container).toContain('div.libby-fotoPopinCropSizes-container');
        });

        it('creates a div called width inside dimensions', function() {
            expect(this.container.find('div.libby-fotoPopinCropSizes-container')).toContain('div.libby-fotoPopinCropSizes-container-width');
        });

        it('has a widthContainer element', function() {
            var sizes = this.container.data('fotoPopinCropSizes');
            expect(sizes.elements.widthContainer).toBeTruthy();
        });

        it('creates a div called height inside dimensions', function() {
            expect(this.container.find('div.libby-fotoPopinCropSizes-container')).toContain('div.libby-fotoPopinCropSizes-container-height');
        });

        it('has a heightContainer element', function() {
            var sizes = this.container.data('fotoPopinCropSizes');
            expect(sizes.elements.heightContainer).toBeTruthy();
        });

        it('creates a label for width', function() {
            expect(this.container.find('div.libby-fotoPopinCropSizes-container-width')).toContain('label');
        });

        it('creates a field for width', function() {
            expect(this.container.find('div.libby-fotoPopinCropSizes-container-width')).toContain('input.libby-fotoPopinCropSizes-container-width-field');
        });

        it('creates a label for height', function() {
            expect(this.container.find('div.libby-fotoPopinCropSizes-container-height')).toContain('label');
        });

        it('creates a field for height', function() {
            expect(this.container.find('div.libby-fotoPopinCropSizes-container-height')).toContain('input.libby-fotoPopinCropSizes-container-height-field');
        });

        it('has a widthField element with the first array of the sizes option', function() {
            var sizes = this.container.data('fotoPopinCropSizes');
            expect(sizes.elements.widthField).toBeTruthy();
        });

        it('has a heightField element with the first array of the sizes option', function() {
            var sizes = this.container.data('fotoPopinCropSizes');
            expect(sizes.elements.heightField).toBeTruthy();
        });

        describe('when the width changes', function() {
            beforeEach(function() {
                this.sizes = this.container.data('fotoPopinCropSizes');
                this.container.trigger("fotoPopinImageSelected", { width: 300, height: 300 });
                this.sizes.elements.widthField.val('100');
            });

            it('should trigger the "fotoPopinSizesChanged" event upon keyup', function() {
                var callback = jasmine.createSpy();
                this.container.unbind('fotoPopinSizesChanged').bind('fotoPopinSizesChanged', callback);
                this.sizes.elements.widthField.keyup();

                waitsForSpy(callback, 2000).toBeCalledAndThen(function() {
                    expect(callback).toHaveBeenCalledWith(jasmine.any(Object), {width: 100, height: 4});
                });
            });

            describe('when the height changes', function() {
                beforeEach(function() {
                    this.callback = jasmine.createSpy();
                    this.container.unbind('fotoPopinSizesChanged').bind('fotoPopinSizesChanged', this.callback);
                    this.sizes.elements.heightField.val('100').keyup();
                    waits(500);
                });

                it('should trigger the "fotoPopinSizesChanged" event upon keyup', function() {
                    waitsForSpy(this.callback, 100).toBeCalledAndThen(function() {
                        expect(this.callback).toHaveBeenCalledWith(jasmine.any(Object), {width: 100, height: 100});
                    });
                });

                describe("when the same value is passed", function(){
                    beforeEach(function(){
                        this.sizes.elements.heightField.val('100');
                    });

                    it('the event "fotoPopinSizesChanged" is not called', function(){
                        var sameValueCallback = jasmine.createSpy();
                        this.container.unbind('fotoPopinSizesChanged').bind('fotoPopinSizesChanged', sameValueCallback);
                        this.sizes.elements.heightField.keyup();

                        waits(500);
                        runs(function() {
                            expect(sameValueCallback).not.toHaveBeenCalled();
                        });
                    });
                });

                describe("when the width is changed to a value greater than the original image size", function(){
                    beforeEach(function(){
                        this.callback = jasmine.createSpy();
                        this.container.unbind('fotoPopinSizesChanged').bind('fotoPopinSizesChanged', this.callback);

                        this.sizes.elements.widthField.val('500').keyup();
                    });

                    it("the width value should be the image width", function(){
                        waitsForSpy(this.callback, 500).toBeCalledAndThen(function() {
                            expect(this.callback).toHaveBeenCalledWith(jasmine.any(Object), {width: 300, height: 300});
                        });
                    });
                });

                describe("when a new image is selected", function(){
                    beforeEach(function(){
                        this.container.trigger("fotoPopinImageSelected", {width: 300, height: 400});
                    });

                    it("the field width should be the first width from the sizes array", function(){
                        expect(this.sizes.elements.widthField).toHaveValue(this.sizes.options.recommendedSizes[0].width);
                    });

                    it("the field height should be the first height from the sizes array", function(){
                        expect(this.sizes.elements.heightField).toHaveValue(this.sizes.options.recommendedSizes[0].height);
                    });
                });

                describe("when a image is selected on the recommended sizes widget", function(){
                    beforeEach(function(){
                        this.container.trigger('fotoPopinSizeSelected', {width: 300, height: 400});
                    });

                    it("the width field should have its value equal to the selected width", function(){
                        expect(this.sizes.elements.widthField).toHaveValue(300);
                    });
                    it("the height field should have its value equal to the selected height", function(){
                        expect(this.sizes.elements.heightField).toHaveValue(400);
                    });
                });

            });
        });
    });

});
