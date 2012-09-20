describe('libby foto popin crop cropper', function() {

    beforeEach(function() {
        this.container = $('<div>');
        $("body").append(this.container);
    });

    afterEach(function() {
        this.container.remove();
    });

    describe('plugin instance creation', function() {
        beforeEach(function() {
            spyOn($, 'Jcrop').andCallThrough();
            this.container.fotoPopinCropCropper({container: this.container});
            this.cropper = this.container.data('fotoPopinCropCropper');
        });

        it('can be called with no arguments', function() {
            expect(this.cropper).toBeTruthy();
            this.container.fotoPopinCropCropper('destroy');
        });
        it('should have a container div', function() {
            expect(this.container).toContain('div.libby-fotoPopinCropCropper-container');
        });
        it('should have a croppable div', function() {
            expect(this.container.find('div.libby-fotoPopinCropCropper-container'))
                                 .toContain('div.libby-fotoPopinCropCropper-container-croppable');
        });
        it('should have a croppable div element', function() {
            expect(this.cropper.elements.croppableContainer).toBeTruthy();
        });
        it('should have a croppable img', function() {
            expect(this.container.find('div.libby-fotoPopinCropCropper-container-croppable'))
                                 .toContain('img.libby-fotoPopinCropCropper-container-croppable-image');
        });
        it('should have a croppable image element', function() {
            expect(this.cropper.elements.croppableImage).toBeTruthy();
        });
        it('should have a reference to jcropper', function() {
            expect(this.cropper.jCrop).toBeNull();
        });

        describe('when selecting a size', function() {
            beforeEach(function() {
                this.container.trigger('fotoPopinSizesChanged', {
                    width: 100,
                    height: 0
                });
            });

            it('should record as chosen width 100', function() {
                expect(this.cropper.userSelectedSize.width).toEqual(100);
            });
            it('should record as chosen height 0', function() {
                expect(this.cropper.userSelectedSize.height).toEqual(0);
            });

            describe('when re-selecting a size', function() {
                beforeEach(function() {
                    this.container.trigger('fotoPopinSizesChanged', {
                        width: 0,
                        height: 100
                    });
                });

                it('should record as chosen width 0', function() {
                    expect(this.cropper.userSelectedSize.width).toEqual(0);
                });
                it('should record as chosen height 100', function() {
                    expect(this.cropper.userSelectedSize.height).toEqual(100);
                });
            });

            describe("when selecting an image smaller than the cropped area", function(){
                beforeEach(function() {
                    spyOn($.fn, 'load').andCallFake($.proxy(function(func) {
                        this.func = func;
                    }, this));

                    this.container.trigger("fotoPopinImageSelected", {
                        url: 'http://ego.globo.com/Gente/foto/0,,48146233-GDV,00.jpg',
                        width: 100,
                        height: 100
                    });

                    this.fotoPopinCropChanged = jasmine.createSpy();
                    this.container.unbind('fotoPopinCropChanged').bind('fotoPopinCropChanged', this.fotoPopinCropChanged);
                    this.container.fotoPopinCropCropper('activate');
                    this.func();
                });

                it('should trigger crop changed with correct param', function() {
                    expect(this.fotoPopinCropChanged).toHaveBeenCalled();
                });
            });

            describe('when an image is selected', function() {
                beforeEach(function() {
                    spyOn($.fn, 'load').andCallFake($.proxy(function(func) {
                        this.func = func;
                    }, this));
                    this.container.trigger("fotoPopinImageSelected", {
                        url: 'http://ego.globo.com/Gente/foto/0,,48146233-GDV,00.jpg',
                        width: 500,
                        height: 1300
                    });
                });

                it('should keep track of width', function() {
                    expect(this.cropper.original.width).toEqual(500);
                });
                it('should keep track of height', function() {
                    expect(this.cropper.original.height).toEqual(1300);
                });
                it('should keep track of url', function() {
                    expect(this.cropper.original.url).toEqual('http://ego.globo.com/Gente/foto/0,,48146233-GDV,00.jpg');
                });

                describe('when active', function() {
                    beforeEach(function() {
                        this.fotoPopinCropChanged = jasmine.createSpy();
                        this.container.unbind('fotoPopinCropChanged').bind('fotoPopinCropChanged', this.fotoPopinCropChanged);
                        this.container.fotoPopinCropCropper('activate');
                        this.func();
                    });

                    it('should trigger crop changed', function() {
                        expect(this.fotoPopinCropChanged).toHaveBeenCalled();
                    });
                    it('should change src of image to stored src', function() {
                        expect(this.cropper.elements.croppableImage).toHaveAttr('src', 'http://thumbor.globoi.com/unsafe/fit-in/500x383/http://ego.globo.com/Gente/foto/0,,48146233-GDV,00.jpg');
                    });

                    describe('and changing the size to have both proportions', function() {
                        beforeEach(function() {
                            this.fotoPopinCropChanged = jasmine.createSpy();
                            this.container.unbind("fotoPopinCropChanged").bind("fotoPopinCropChanged", this.fotoPopinCropChanged);
                            this.cropper.jCrop.setOptions = jasmine.createSpy();
                            this.container.trigger("fotoPopinSizesChanged", {
                                width: 100,
                                height: 50
                            });
                        });

                        it('should change aspectRatio', function() {
                            expect(this.cropper.jCrop.setOptions).toHaveBeenCalledWith({
                                aspectRatio: 2,
                                minSize: jasmine.any(Object)
                            });
                        });

                        xdescribe('changing the size to the same width and height', function() {
                            beforeEach(function() {
                                // o callback no settimeout sera executado instantaneamente
                                spyOn(window, 'setTimeout').andCallFake(function(fn) {
                                    fn.apply(null, [].slice.call(arguments, 2));
                                    return +new Date;
                                });

                                this.fotoPopinCropChanged = jasmine.createSpy();
                                this.container.unbind("fotoPopinCropChanged").bind("fotoPopinCropChanged", this.fotoPopinCropChanged);
                                this.onChange = $.Jcrop.mostRecentCall.args[1].onChange;
                                this.onChange.call(this.cropper.jCrop, {x: 1, y: 2, x2: 3, y2: 4});
                                this.onChange.call(this.cropper.jCrop, {x: 1, y: 2, x2: 3, y2: 4});
                            });

                            it('should not call the fotoPopinCropChanged again', function() {
                                expect(this.fotoPopinCropChanged).not.toHaveBeenCalled();
                            });
                        });
                    });

                    describe('should have activated jCrop', function() {
                        it('should have jCrop reference truthy', function() {
                            expect(this.cropper.jCrop).toBeTruthy();
                        });
                        it('should have jCrop container', function() {
                            expect(this.container).toContain('.jcrop-holder');
                        });
                    });
                });
            });
        });
    });
});
