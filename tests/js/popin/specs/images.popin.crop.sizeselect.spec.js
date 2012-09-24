describe('images foto popin crop sizeselect', function() {

    beforeEach(function() {
        this.defaultOptions = $.images.fotoPopinCropSizeSelect.prototype.options;
        this.container = $('<div class="images-fotoPopinCrop-cropSizeSelectContainer"></div>').appendTo('body');
    });
    afterEach(function() {
        this.container.remove();
    });

    describe('check for default options', function(){
        it('should have a container option', function(){
            expect(this.defaultOptions.container).not.toBeUndefined();
        });
        it('should have a recommendedSizes option', function(){
            expect(this.defaultOptions.recommendedSizes).not.toBeUndefined();
        });
        it('should have a unsafeUrl option', function(){
            expect(this.defaultOptions.unsafeUrl).toBe('http://thumbor.globoi.com/unsafe');
        });
    });

    describe('plugin instance creation without recommendedSizes', function(){
        beforeEach(function(){
            this.container.fotoPopinCropSizeSelect({container: this.container});
        });

        it('can be called with a container element', function(){
            expect(this.container.data('fotoPopinCropSizeSelect')).toBeTruthy();
        });
        it('the container will be empty', function(){
            expect(this.container).toBeEmpty();
        });

        describe('when the "fotoPopinImageSelected" is fired', function(){
            beforeEach(function() {
                this.container.trigger('fotoPopinImageSelected', {width:200, height:100});
            });

            it('the container will be empty', function(){
                expect(this.container).toBeEmpty();
            });
        });
    });

    describe('plugin instance creation with one recommendedSizes', function(){
        beforeEach(function(){
            this.container.fotoPopinCropSizeSelect({
                container: this.container,
                recommendedSizes: [{width: 4, height: 20}]
            });
        });

        it('can be called with a container element', function(){
            expect(this.container.data('fotoPopinCropSizeSelect')).toBeTruthy();
        });
        it('the container will be empty', function(){
            expect(this.container).toBeEmpty();
        });

        describe('when the "fotoPopinImageSelected" is fired', function(){
            beforeEach(function() {
                this.container.trigger('fotoPopinImageSelected', {width:200, height:100});
            });

            it('the container will be empty', function(){
                expect(this.container).toBeEmpty();
            });
        });
    });

    describe('plugin instance creation with more than one recommendedSizes', function(){
        beforeEach(function(){
            this.container.fotoPopinCropSizeSelect({
                container: this.container,
                recommendedSizes: [{width: 200, height: 100}, {width: 300, height: 400, label: 'bigsize'}]
            });
            this.widget = this.container.data('fotoPopinCropSizeSelect');
        });
        it('the container will be empty', function(){
            expect(this.container).toBeEmpty();
        });

        describe('when the "fotoPopinImageSelected" is fired', function(){
            beforeEach(function() {
                this.container.trigger('fotoPopinImageSelected', {width:200, height:100, url: 'img/url.jpg'});
            });

            describe('the container', function() {
                it('will contain a list of possible sizes', function(){
                    expect(this.container).toContain('> ul');
                });
                it('will contain a valid option with a label that represents the size of the first recommended size', function(){
                    expect(this.container).toContain('> ul > li:nth-child(1) > a:not(.invalid) > strong:contains("200 x 100")');
                });
                it('will contain a valid option with an image that represents the size of the first recommended size', function(){
                    expect(this.container).toContain('> ul > li:nth-child(1) > a:not(.invalid) > span > img[src="http://thumbor.globoi.com/unsafe/150x75/img/url.jpg"]');
                });
                it('will contain an invalid option with a label that represents the size of the second recommended size', function(){
                    expect(this.container).toContain('> ul > li:nth-child(2) > a.invalid > strong:contains("bigsize")');
                });
                it('will contain a valid option with an image that represents the size of the first recommended size', function(){
                    expect(this.container).toContain('> ul > li:nth-child(2) > a.invalid > span > img[src="http://thumbor.globoi.com/unsafe/113x150/img/url.jpg"]');
                });
            });

            describe('when clicking on the first option', function() {
                beforeEach(function() {
                    spyOn($.fn, 'trigger').andCallThrough();
                    this.container.find('ul a').first().click();
                });

                it('should fire the "fotoPopinSizesChanged" event', function() {
                    expect($.fn.trigger).toHaveBeenCalledWith('fotoPopinSizesChanged', jasmine.any(Object));
                });
                it('should fire the "fotoPopinSizeSelected" event', function() {
                    expect($.fn.trigger).toHaveBeenCalledWith('fotoPopinSizeSelected', jasmine.any(Object));
                });
            });

            describe('when clicking on the second (invalid) option', function() {
                beforeEach(function() {
                    spyOn($.fn, 'trigger').andCallThrough();
                    this.container.find('ul a').eq(1).click();
                });

                it('should fire the "fotoPopinSizesChanged" event', function() {
                    expect($.fn.trigger).not.toHaveBeenCalledWith('fotoPopinSizesChanged', jasmine.any(Object));
                });
                it('should fire the "fotoPopinSizeSelected" event', function() {
                    expect($.fn.trigger).not.toHaveBeenCalledWith('fotoPopinSizeSelected', jasmine.any(Object));
                });
            });
        });
    });
});
