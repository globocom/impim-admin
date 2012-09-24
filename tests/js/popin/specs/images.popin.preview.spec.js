describe('images foto popin preview', function() {

    beforeEach(function(){
        this.container = $('<div/>');

        this.imageData = {
            originalUrl: 'http://s.glbimg.com/somefoto.jpg',
            crop: {
                left: 10,
                top: 10,
                right: 100,
                bottom: 100
            },
            width: 300,
            height: 0
        };
    });

    describe('plugin instance creation', function(){

        beforeEach(function() {
            this.container.fotoPopinPreview({container: this.container});
        });

        it('can be called with no arguments', function() {
            expect(this.container.data('fotoPopinPreview')).toBeTruthy();
            this.container.fotoPopinPreview('destroy');
        });

        it('contains a div for all the elements', function() {
            expect(this.container).toContain('div.images-fotoPopinPreview-container');
        });

        it('contains an h3', function() {
            expect(this.container).toContain('h3');
        });

        it('has an H3 with text Preview do corte', function() {
            expect(this.container.find('h3')).toHaveText(/\s*Preview do corte\s*/);
        });

        it('has an empty span inside H3', function() {
            expect(this.container.find('h3 span')).toHaveText('');
        });

        it('has an image', function() {
            expect(this.container).toContain('img');
        });

        it('has an image with null src', function() {
            expect(this.container.find('img')).not.toHaveAttr('src');
        });

    });

    describe('plugin behavior when it is filled with imageData', function() {

        beforeEach(function() {
            this.container.fotoPopinPreview({container: this.container});
            this.container.trigger('fotoPopinCropChanged', this.imageData);
            this.widget = this.container.data('fotoPopinPreview');
        });

        it('listens to the fotoPopinCropChanged event', function() {
            expect(this.widget.imageData).toEqual(this.imageData);
        });

        describe('has activate method that fills dom', function() {
            beforeEach(function() {
                this.server = sinon.fakeServer.create();

                var url = "/libby/aplicacoes/foto/generate_url?";
                url += 'image_url=http%3A%2F%2Fs.glbimg.com%2Fsomefoto.jpg';
                url += '&crop_left=' + this.imageData.crop.left;
                url += '&crop_top=' + this.imageData.crop.top;
                url += '&crop_right=' + this.imageData.crop.right;
                url += '&crop_bottom=' + this.imageData.crop.bottom;
                url += '&width=' + this.imageData.width;

                var response = [200, {}, 'some/url/for/somefoto.jpg'];
                this.server.respondWith("GET",
                                        url,
                                        response);

                this.container.fotoPopinPreview('activate');
                this.server.respond();
            });

            afterEach(function() {
                this.server.restore();
            });

            it('has a span within the H3 with the name of the image', function() {
                expect(this.container.find('h3 span')).toHaveText('somefoto.jpg');
            });

            it('has a visible image', function() {
                expect(this.widget.elements.loadingImage.css('display')).not.toEqual('none');
            });

            it('has an image with the specified_url', function() {
                expect(this.container.find('img')).toHaveAttr('src', 'http://thumbor.globoi.com/unsafe/10x10:100x100/300x0/http://s.glbimg.com/somefoto.jpg');
            });

            describe('has deactivate method that clears dom', function() {

                beforeEach(function() {
                    this.container.fotoPopinPreview('deactivate');
                });

                it('should have an empty header span', function() {
                    expect(this.container.find('h3 span')).toHaveText('');
                });

                describe('after deactivate, activate refills information', function() {

                    beforeEach(function() {
                        this.server = sinon.fakeServer.create();

                        var url = "/libby/aplicacoes/foto/generate_url?";
                        url += 'image_url=http%3A%2F%2Fs.glbimg.com%2Fsomefoto.jpg';
                        url += '&crop_left=' + this.imageData.crop.left;
                        url += '&crop_top=' + this.imageData.crop.top;
                        url += '&crop_right=' + this.imageData.crop.right;
                        url += '&crop_bottom=' + this.imageData.crop.bottom;
                        url += '&width=' + this.imageData.width;

                        var response = [200, {}, 'some/url/for/somefoto.jpg'];
                        this.server.respondWith("GET",
                                                url,
                                                response);

                        this.container.fotoPopinPreview('activate');
                        this.server.respond();
                    });

                    afterEach(function() {
                        this.server.restore();
                    });

                    it('has a span within the H3 with the name of the image', function() {
                        expect(this.container.find('h3 span')).toHaveText('somefoto.jpg');
                    });

                    it('has a visible image', function() {
                        expect(this.container.find('img').css('display')).not.toEqual('none');
                    });

                    it('has an image with the specified_url', function() {
                        expect(this.container.find('img')).toHaveAttr('src', 'http://thumbor.globoi.com/unsafe/10x10:100x100/300x0/http://s.glbimg.com/somefoto.jpg');
                    });

                });

            });

        });

    });

});
