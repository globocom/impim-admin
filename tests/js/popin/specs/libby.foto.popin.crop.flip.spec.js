describe('libby foto popin crop flip', function() {

    beforeEach(function() {
        this.defaultOptions = $.libby.fotoPopinCropFlip.prototype.options;
        this.container = $('<div><i></i><b></b></div>');
    });

    describe('check for default options', function(){
        it('should have a container option', function(){
            expect(this.defaultOptions.container).not.toBeUndefined();
        });
    });

    describe('plugin instance creation', function(){
        beforeEach(function(){
            this.container.fotoPopinCropFlip({container: this.container});
        });

        it('can be called with a container element', function(){
            expect(this.container.data('fotoPopinCropFlip')).toBeTruthy();
        });
        it('should add the "front" class to the first child of the container', function() {
            expect(this.container).toContain('> :nth-child(1).front');
        });
        it('should add the "back" class to the second child of the container', function() {
            expect(this.container).toContain('> :nth-child(2).back');
        });

        describe('when the "fotoPopinCropOptionsChangeSize" fires', function() {
            beforeEach(function() {
                this.container.trigger('fotoPopinCropOptionsChangeSize');
            });
            it('should add the flip class to the container', function() {
                expect(this.container).toHaveClass('flip');
            });
            describe('when the "fotoPopinCropOptionsChangeSize" fires again', function() {
                beforeEach(function() {
                    this.container.trigger('fotoPopinCropOptionsChangeSize');
                });
                it('should remove the flip class from the container', function() {
                    expect(this.container).not.toHaveClass('flip');
                });
            });
        });

        describe('when the "fotoPopinSizeSelected" fires', function() {
            beforeEach(function() {
                this.container.trigger('fotoPopinSizeSelected');
            });
            it('should add the flip class to the container', function() {
                expect(this.container).toHaveClass('flip');
            });
            describe('when the "fotoPopinSizeSelected" fires again', function() {
                beforeEach(function() {
                    this.container.trigger('fotoPopinSizeSelected');
                });
                it('should remove the flip class from the container', function() {
                    expect(this.container).not.toHaveClass('flip');
                });
            });
        });
    });
});
