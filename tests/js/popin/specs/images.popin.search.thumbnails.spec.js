describe('images foto popin search thumbnails', function() {

    beforeEach(function(){
        this.container = $('<div>');
    });

    describe('plugin instance creation', function(){
        beforeEach(function() {
            this.container.fotoPopinSearchThumbnails({container: this.container});
            this.thumbnails = this.container.data('fotoPopinSearchThumbnails');
        });

        it('can be called with no arguments', function() {
            expect(this.thumbnails).toBeTruthy();
        });

        it('creates a container div', function() {
            expect(this.container).toContain('div.images-fotoPopinSearchThumbnails-container');
        });

        it('has a container element', function() {
            expect(this.thumbnails.elements.container).toBeTruthy();
        });

        it('creates a images ul', function() {
            expect(this.container).toContain('div.images-fotoPopinSearchThumbnails-container > ul.images-fotoPopinSearchThumbnails-container-images');
        });

        it('has an imageList element', function() {
            expect(this.thumbnails.elements.imageList).toBeTruthy();
        });

        describe('on popinFotoNewImages when no image is found', function() {
            beforeEach(function() {
                this.container.trigger('fotoPopinNewImages', [{
                    numFound: 0,
                    photos: []
                }, false, 1]);
            });

            it('shows a message of no images found', function() {
                expect(this.thumbnails.elements.container).toContain('p');
                expect(this.thumbnails.elements.container.find('p')).toHaveText('Não há imagens cadastradas para esse filtro.');
            });
        });

        describe('on popinFotoNewImages when images are found', function() {
            beforeEach(function() {
                var isUserSearch = true;
                this.thumbs = this.thumbnails.elements.imageList;
                this.container.trigger('fotoPopinNewImages', [{
                    numFound: 1,
                    photos: [{
                        dataCadastro: '10/10/2010 10:10:10',
                        largura: 300,
                        altura: 200,
                        creditos: 'credits',
                        url: 'original.jpg',
                        thumbUrl: 'image_url.jpg',
                        titulo: 'title',
                        assunto: 'subject',
                        dataEvento: '11/11/2011 11:11:11'
                    }]
                }, isUserSearch, 1]);
            });

            it('should have a li with an image', function() {
                expect(this.thumbs).toContain('li');
            });

            it('should have a container div in each li', function() {
                expect(this.thumbs.find('li')).toContain('div.images-fotoPopinSearchThumbnails-image-container');
            });

            it('should have a picture div in the container', function() {
                expect(this.thumbs)
                    .toContain('div.images-fotoPopinSearchThumbnails-image-container > div.images-fotoPopinSearchThumbnails-image-container-picture');
            });

            it('should have an ul in the picture div', function() {
                expect(this.thumbs)
                    .toContain('div.images-fotoPopinSearchThumbnails-image-container-picture > ul');
            });

            it('should have publish date and original size', function() {
                var metadata = this.thumbs.find('div.images-fotoPopinSearchThumbnails-image-container-picture > ul');

                var li = $(metadata.find('li').get(0));

                expect(li.find('p'))
                    .toHaveText('cadastrado em');

                expect(li.find('strong'))
                    .toHaveText('10/10/2010 10:10:10');
            });

            it('should have publish date and original size', function() {
                var metadata = this.thumbs.find('div.images-fotoPopinSearchThumbnails-image-container-picture > ul');

                var li = $(metadata.find('li').get(1));

                expect(li.find('p'))
                    .toHaveText('tamanho original');

                expect(li.find('strong'))
                    .toHaveText('300x200');
            });

            it('should have image with thumbnail src', function() {
                var picture = this.thumbs.find('div.images-fotoPopinSearchThumbnails-image-container-picture');
                expect(picture).toContain('img');
                expect(picture.find('img'))
                    .toHaveAttr('src', 'image_url.jpg');
            });

            it('should have a strong with title', function() {
                var key = 'div.images-fotoPopinSearchThumbnails-image-container > strong';
                expect(this.thumbs).toContain(key);
                expect(this.thumbs.find(key)).toHaveText('title');
            });

            it('should return selected item as null', function() {
                var selected = this.container.fotoPopinSearchThumbnails('getImageMetadata');
                expect(selected).toBeNull();
            });

            describe('when clicked', function() {
                beforeEach(function() {
                    this.li = this.thumbs.find('li');
                    this.li.click();
                });
                it('should have class of selected', function() {
                    expect(this.li).toHaveClass('selected');
                });
                it('should return selected item', function() {
                    var selected = this.container.fotoPopinSearchThumbnails('getImageMetadata');
                    expect(selected).toEqual({
                        date: '10/10/2010 10:10:10',
                        width: 300,
                        height: 200,
                        credits: 'credits',
                        url: 'original.jpg',
                        thumbUrl: 'image_url.jpg',
                        title: 'title',
                        subject: 'subject',
                        eventDate: '11/11/2011 11:11:11'
                    });
                });

                describe('when the fotoPopinImageSelected event is fired', function() {
                    beforeEach(function() {
                        this.fotoPopinImageSelectedHandler = jasmine.createSpy();
                        this.container.bind('fotoPopinImageSelected', this.fotoPopinImageSelectedHandler);
                        this.container.fotoPopinSearchThumbnails('selectImage');
                    });
                    it('should have executed the event with proper data', function() {
                        expect(this.fotoPopinImageSelectedHandler).toHaveBeenCalledWith(jasmine.any(Object), {
                            date: '10/10/2010 10:10:10',
                            width: 300,
                            height: 200,
                            credits: 'credits',
                            url: 'original.jpg',
                            thumbUrl: 'image_url.jpg',
                            title: 'title',
                            subject: 'subject',
                            eventDate: '11/11/2011 11:11:11'
                        });
                    });
                });
            });

            describe('when double clicked', function() {
                beforeEach(function() {
                    this.fotoPopinImageSelectedHandler = jasmine.createSpy();
                    this.container.bind('fotoPopinImageSelected', this.fotoPopinImageSelectedHandler);
                    this.selectedLi = this.thumbs.find('li').first();
                    this.selectedLi.dblclick();
                });
                it('should have executed the selected image handler', function() {
                    expect(this.fotoPopinImageSelectedHandler).toHaveBeenCalled();
                });
                it('should have executed the selected image handler with proper args', function() {
                    expect(this.fotoPopinImageSelectedHandler).toHaveBeenCalledWith(jasmine.any(Object), {
                        date: '10/10/2010 10:10:10',
                        width: 300,
                        height: 200,
                        credits: 'credits',
                        url: 'original.jpg',
                        thumbUrl: 'image_url.jpg',
                        title: 'title',
                        subject: 'subject',
                        eventDate: '11/11/2011 11:11:11'
                    });
                });
            });
        });
    });
});
