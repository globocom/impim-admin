describe('images foto popin crop info', function() {

    beforeEach(function(){
        this.container = $('<div></div>');
    });

    describe('plugin instance creation', function(){
        beforeEach(function() {
            this.container.fotoPopinCropInfo({ container: this.container });
            this.info = this.container.data('fotoPopinCropInfo');
        });

        it('can be called with no arguments', function() {
            expect(this.container.data('fotoPopinCropInfo')).toBeTruthy();
            this.container.fotoPopinCropInfo('destroy');
        });

        it('should have a container div', function() {
            expect(this.container).toContain('div.images-fotoPopinCropInfo-container');
        });

        it('should have an original div', function() {
            expect(this.container).toContain('div.images-fotoPopinCropInfo-container-original');
        });

        it('should have a final div', function() {
            expect(this.container).toContain('div.images-fotoPopinCropInfo-container-final');
        });


        describe('when select an image', function() {

            beforeEach(function() {
                this.container.trigger("fotoPopinImageSelected", {
                    url: 'http://s.glbimg.com/somefoto.jpg',
                    width: 200,
                    height: 300
                });
            });

            it('the original container should be updated', function() {
                expect(this.info.elements.originalContainer.text()).toEqual("foto original: 200x300");
            });

            describe('plugin behavior when it is filled with image data passed as event argument', function() {

                beforeEach(function() {
                    spyOn($, 'ajax');

                    this.imageData = {
                        originalUrl: 'es/ge/f/620x349/2011/10/20/juninho_div.jpg',
                        crop: {
                            left: 10,
                            top: 10,
                            right: 100,
                            bottom: 100
                        }
                    };

                    this.sizeCalculatedCallback = jasmine.createSpy();
                    this.container.unbind('fotoPopinFinalFormatCalculated').bind('fotoPopinFinalFormatCalculated', this.sizeCalculatedCallback);
                    this.container.trigger("fotoPopinCropChanged", this.imageData);

                    this.args = $.ajax.mostRecentCall.args;
                    this.args[0].success({thumbor:{target:{width:100,height:200}}});
                });

                it("when the final format is calculated an event have to be called", function(){
                    expect(this.sizeCalculatedCallback).toHaveBeenCalledWith(jasmine.any(Object), $.extend({}, this.imageData, {
                        width: 100, height: 200
                    }));
                });

                it('the final container should be updated', function() {
                    expect(this.info.elements.finalContainer.text()).toEqual('formato final: 100x200');
                });

            });

        });

    });

});
