describe('images init', function() {
    
    describe("when clicking on images-popin-click-open and .images-popin div doesn't exist yet", function() {
        beforeEach(function() {
            setFixtures('<input type="button" class="images-popin-click-open" />');
            images.init();
            $('.images-popin-click-open').click();
        });
        
        afterEach(function() {
            $('.images-popin').fotoPopin('close');
        });
        
        it('should open images popin', function() {
            expect($('.images-fotoPopin-container')).toBeVisible();
        });
    });
    
    describe('when clicking on images-popin-click-open and .images-popin div already exists', function() {
        beforeEach(function() {
            setFixtures('<input type="button" class="images-popin-click-open" /><div class="images-popin></div>"');
            images.init();
            $('.images-popin-click-open').click();
        });
        
        afterEach(function() {
            $('.images-popin').fotoPopin('close');
        });
        
        it('should open images popin', function() {
            expect($('.images-fotoPopin-container')).toBeVisible();
        });
        
        it('should have only one .images-popin div', function() {
            expect($('.images-popin').length).toBe(1);
        });
    });
    
    describe('when fotoPopinImageApplied is fired and images-popin-target is an img', function() {
        beforeEach(function() {
            setFixtures('<img class="images-popin-target" />');
            images.init();
            $('.images-popin').trigger('fotoPopinImageApplied', {croppedUrl: 'http://example.com/croppedUrl'});
        });
        
        it("should apply cropped url to img's src attribute", function() {
            expect($('.images-popin-target')).toHaveAttr('src', 'http://example.com/croppedUrl');
        });
    });
    
    describe('when fotoPopinImageApplied is fired and images-popin-target is an input', function() {
        beforeEach(function() {
            setFixtures('<input class="images-popin-target"></input>');
            images.init();
            $('.images-popin').trigger('fotoPopinImageApplied', {croppedUrl: 'http://example.com/croppedUrl'});
        });
        
        it("should apply cropped url to img's src attribute", function() {
            expect($('.images-popin-target')).toHaveAttr('value', 'http://example.com/croppedUrl');
        });
    });
    
    describe('when fotoPopinImageApplied is fired and images-popin-target is any element', function() {
        beforeEach(function() {
            setFixtures('<div class="images-popin-target"></div>');
            images.init();
            $('.images-popin').trigger('fotoPopinImageApplied', {croppedUrl: 'http://example.com/croppedUrl'});
        });
        
        it("should apply cropped url to img's src attribute", function() {
            expect($('.images-popin-target')).toHaveAttr('data-images-popin-cropped-url', 'http://example.com/croppedUrl');
        });
    });
    
});
