describe('images foto popin search info', function() {

    beforeEach(function(){
        this.container = $('<div>');
    });

    describe("plugin instance creation", function(){
        beforeEach(function(){
            this.container.fotoPopinSearchInfo({container: this.container});
        });
        it('can be called with no arguments', function() {
            expect(this.container.data('fotoPopinSearchInfo')).toBeTruthy();
            this.container.fotoPopinSearchInfo('destroy');
        });
        it('has a container that should not be visible so we dont show an empty images size', function() {
            expect(this.container.find('> div')).toHaveClass('hidden');
        });
        it('has a STRONG with no text', function() {
            expect(this.container.find('strong')).toHaveText('');
        });
        it("has a BUTTON with no text", function(){
            expect(this.container.find('button')).toHaveText('');
        });
    });

    describe('plugin behavior when it is filled with newImages', function() {

        beforeEach(function(){
            this.container.
                fotoPopinSearchInfo({container: this.container}).
                fotoPopinSearchInfo("activate");

            this.info = this.container.data("fotoPopinSearchInfo");

            var isUserSearch = false;

            this.container.trigger('fotoPopinNewImages', {
                total: 1,
                items: [{
                    createdDate: '10/10/2010 10:10:10',
                    width: 300,
                    height: 200,
                    credits: 'credits',
                    url: 'original.jpg',
                    thumbUrl: 'image_url.jpg',
                    title: 'title',
                    subject: 'subject',
                    eventDate: '11/11/2011 11:11:11'
                }]
            }, isUserSearch);
        });

        it("should show the container element", function(){
            expect(this.info.elements.container).not.toHaveClass("hidden");
        });

        it("should update the value presented", function(){
            expect(this.info.elements.infoNumImages).toHaveText('1');
        });

        it("should have a button to reload the list content", function(){
            expect(this.info.elements.buttonReloadImages).toHaveText("recarregar imagens »");
        });

        describe("when a user make a search", function(){

            beforeEach(function(){
                var isUserSearch = true;

                this.container.trigger('fotoPopinNewImages', [{
                    total: 2,
                    items: [{
                        createdDate: '10/10/2010 10:10:10',
                        width: 300,
                        height: 200,
                        credits: 'credits',
                        url: 'original.jpg',
                        thumbUrl: 'image_url.jpg',
                        title: 'title',
                        subject: 'subject',
                        eventDate: '11/11/2011 11:11:11'
                    },{
                        createdDate: '10/10/2010 10:10:10',
                        width: 300,
                        height: 200,
                        credits: 'credits',
                        url: 'original.jpg',
                        thumbUrl: 'image_url.jpg',
                        title: 'title',
                        subject: 'subject',
                        eventDate: '11/11/2011 11:11:11'
                    }]
                }, isUserSearch]);
            });

            it("should update the value presented", function(){
                expect(this.info.elements.infoNumImages).toHaveText('2');
            });

            it("should not have a link for new search", function(){
                expect(this.info.elements.buttonReloadImages).toHaveText('ver todas as imagens »');
            });

            describe("when the button is clicked", function(){
                beforeEach(function(){
                    this.callback = jasmine.createSpy();
                    this.container.bind("fotoPopinNewSearch", this.callback);
                    this.info.elements.buttonReloadImages.click();
                });

                it("should trigger the fotoPopinNewSearch event", function(){
                    expect(this.callback).toHaveBeenCalledWith(jasmine.any(Object), false);
                });
            });

        });

    });

});
