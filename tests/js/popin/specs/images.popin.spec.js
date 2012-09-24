describe('images foto popin', function() {

    beforeEach(function(){
        this.fotoPopinOptions = $.images.fotoPopin.prototype.options;
        this.element = $('<div>');
    });

    describe('plugin instance creation particularities', function(){
        it('can be called with no arguments', function() {
            this.element.fotoPopin();
            expect(this.element.data('fotoPopin')).toBeTruthy();
            this.element.fotoPopin('destroy');
        });
    });

    describe('check for default options', function(){
        it('should have a url that returns the result from the search', function(){
            expect(this.fotoPopinOptions.urls.search).toEqual('/globo_foto/search/');
        });
        it('should have a url that uploads the image', function(){
            expect(this.fotoPopinOptions.urls.upload).toEqual('/globo_foto/upload/');
        });
        it('should have a url that generates the thumbor urls', function(){
            expect(this.fotoPopinOptions.urls.generateUrl).toEqual('/globo_foto/generate_url/');
        });
        it('should have a url that generates the unsafe thumbor urls', function(){
            expect(this.fotoPopinOptions.urls.unsafeUrl).toEqual('http://thumbor.globoi.com/unsafe');
        });
        it('should have a sizes option', function(){
            expect(this.fotoPopinOptions.sizes).toEqual(null);
        });
        it('should have a allowSearch option', function(){
            expect(this.fotoPopinOptions.hasSearch).toEqual(true);
        });
    });

    describe('the plugin instance creation', function(){
        beforeEach(function(){
            this.element.fotoPopin();
            this.widget = this.element.data('fotoPopin');
        });
        afterEach(function(){
            this.element.fotoPopin('destroy');
        });

        describe('the markup ajax request', function(){
            it('should contain the close button DOM element', function(){
                expect(this.element).toContain('button.close-top-button');
            });
            it('should contain the register button DOM element', function(){
                expect(this.element).toContain('button.register-top-button');
            });
            it('should contain the search button DOM element', function(){
                expect(this.element).toContain('button.search-top-button');
            });
            it('should contain the tabs container DOM element', function(){
                expect(this.element).toContain('div.images-fotoPopin-tabs');
            });
            it('should contain the footer DOM element', function(){
                expect(this.element).toContain('div.images-fotoPopin-footer');
            });
            it('should contain the back button DOM element', function(){
                expect(this.element).toContain('div.images-fotoPopin-footer .back-button');
            });
            it('should contain the preview button DOM element', function(){
                expect(this.element).toContain('div.images-fotoPopin-footer .preview-button');
            });
            it('should contain the apply button DOM element', function(){
                expect(this.element).toContain('div.images-fotoPopin-footer .apply-button');
            });
            it('should contain the cancel DOM element', function(){
                expect(this.element).toContain('div.images-fotoPopin-footer .cancel-button');
            });
            it('should contain the register button DOM element', function(){
                expect(this.element).toContain('div.images-fotoPopin-footer .register-button');
            });
        });

        describe('the open method', function(){
            beforeEach(function(){
                spyOn($.images.fotoPopin.prototype, '_activateTab').andCallThrough();
                spyOn($.fn, 'fotoPopinSearch').andCallThrough();
                spyOn($.fn, 'fotoPopinUpload').andCallThrough();
                spyOn($.fn, 'fotoPopinCrop').andCallThrough();
                spyOn($.fn, 'fotoPopinPreview').andCallThrough();
                spyOn($.images.fotoPopinSearch.prototype, 'activate');
                this.element.fotoPopin('open');
                this.widget = this.element.data('fotoPopin');
            });

            it('should load and initialize the search module', function(){
                waitsForSpy($.images.fotoPopin.prototype._activateTab).toBeCalledAndThen(function(){
                    expect($.fn.fotoPopinSearch).toHaveBeenCalled();
                });
            });
            it('should load and initialize the upload module', function(){
                waitsForSpy($.images.fotoPopin.prototype._activateTab).toBeCalledAndThen(function(){
                    expect($.fn.fotoPopinUpload).toHaveBeenCalled();
                });
            });
            it('should load and initialize the crop module', function(){
                waitsForSpy($.images.fotoPopin.prototype._activateTab).toBeCalledAndThen(function(){
                    expect($.fn.fotoPopinCrop).toHaveBeenCalled();
               });
            });
            it('should load and initialize the preview module', function(){
                waitsForSpy($.images.fotoPopin.prototype._activateTab).toBeCalledAndThen(function(){
                    expect($.fn.fotoPopinPreview).toHaveBeenCalled();
                });
            });
            it('should activate the default tab, which is the Search', function(){
                waitsForSpy($.images.fotoPopin.prototype._activateTab).toBeCalledAndThen(function(){
                    expect($.images.fotoPopinSearch.prototype.activate).toHaveBeenCalled();
                });
            });
        });

        describe('verify if the correct options are being passed to the widgets', function(){
            beforeEach(function(){
                spyOn($.fn, 'fotoPopinSearch');
                spyOn($.fn, 'fotoPopinCrop');
                spyOn($.fn, 'fotoPopinUpload');
                spyOn($.fn, 'fotoPopinPreview');
                spyOn($.images.fotoPopinSearch.prototype, 'activate');
                spyOn($.images.fotoPopinCrop.prototype, 'activate');
                spyOn($.images.fotoPopinUpload.prototype, 'activate');
                spyOn($.images.fotoPopinPreview.prototype, 'activate');
            });

            it('should pass the right options to the fotoPopinSearch widget', function(){
                this.element.fotoPopin('open', 'fotoPopinSearch');
                var options = $.fn.fotoPopinSearch.calls[0].args[0];
                expect(options.searchUrl).toEqual('/globo_foto/search/');
                expect(options.pagerContainer).not.toBeUndefined();
                expect(options.container).not.toBeUndefined();
                expect(options.datepicker).not.toBeUndefined();
            });
            it('should pass the right options to the fotoPopinCrop widget', function(){
                this.element.fotoPopin('open', 'fotoPopinCrop');
                var options = $.fn.fotoPopinCrop.calls[0].args[0];
                expect(options.unsafeUrl).toEqual('http://thumbor.globoi.com/unsafe');
                expect(options.container).not.toBeUndefined();
            });
            it('should pass the right options to the fotoPopinUpload widget', function(){
                this.element.fotoPopin('open', 'fotoPopinUpload');
                var options = $.fn.fotoPopinUpload.calls[0].args[0];
                expect(options.uploadUrl).toEqual('/globo_foto/upload/');
                expect(options.container).not.toBeUndefined();
                expect(options.datepicker).not.toBeUndefined();
            });
            it('should pass the right options to the fotoPopinPreview widget', function(){
                this.element.fotoPopin('open', 'fotoPopinPreview');
                var options = $.fn.fotoPopinPreview.calls[0].args[0];
                expect(options.unsafeUrl).toEqual('http://thumbor.globoi.com/unsafe');
                expect(options.container).not.toBeUndefined();
            });
        });

        describe('the open method should activate the corresponding tab', function(){
            beforeEach(function(){
                spyOn($.images.fotoPopin.prototype, '_activateTab').andCallThrough();
                spyOn($.fn, 'fotoPopinSearch').andCallThrough();
                spyOn($.fn, 'fotoPopinUpload').andCallThrough();
                spyOn($.fn, 'fotoPopinCrop').andCallThrough();
                spyOn($.fn, 'fotoPopinPreview').andCallThrough();
                spyOn($.images.fotoPopinSearch.prototype, 'activate');
                spyOn($.images.fotoPopinCrop.prototype, 'activate');
                spyOn($.images.fotoPopinUpload.prototype, 'activate');
                spyOn($.images.fotoPopinPreview.prototype, 'activate');
                this.widget = this.element.data('fotoPopin');
            });

            it('should activate the search module', function(){
                this.element.fotoPopin('open', 'fotoPopinSearch');
                waitsForSpy($.images.fotoPopin.prototype._activateTab).toBeCalledAndThen(function(){
                    expect($.images.fotoPopin.prototype._activateTab).toHaveBeenCalledWith('fotoPopinSearch');
                    expect(this.widget.activeTabName).toEqual('fotoPopinSearch');
                    expect(this.element).toHaveClass('images-fotoPopinSearch-active');
                });
            });
            it('should activate the upload module', function(){
                this.element.fotoPopin('open', 'fotoPopinUpload');
                waitsForSpy($.images.fotoPopin.prototype._activateTab).toBeCalledAndThen(function(){
                    expect($.images.fotoPopin.prototype._activateTab).toHaveBeenCalledWith('fotoPopinUpload');
                    expect(this.widget.activeTabName).toEqual('fotoPopinUpload');
                    expect(this.element).toHaveClass('images-fotoPopinUpload-active');
                });
            });
            it('should activate the crop module', function(){
                this.element.fotoPopin('open', 'fotoPopinCrop');
                waitsForSpy($.images.fotoPopin.prototype._activateTab).toBeCalledAndThen(function(){
                    expect($.images.fotoPopin.prototype._activateTab).toHaveBeenCalledWith('fotoPopinCrop');
                    expect(this.widget.activeTabName).toEqual('fotoPopinCrop');
                    expect(this.element).toHaveClass('images-fotoPopinCrop-active');
                });
            });
            it('should activate the preview module', function(){
                this.element.fotoPopin('open', 'fotoPopinPreview');
                waitsForSpy($.images.fotoPopin.prototype._activateTab).toBeCalledAndThen(function(){
                    expect($.images.fotoPopin.prototype._activateTab).toHaveBeenCalledWith('fotoPopinPreview');
                    expect(this.widget.activeTabName).toEqual('fotoPopinPreview');
                    expect(this.element).toHaveClass('images-fotoPopinPreview-active');
                });
            });
        });

        describe('navigation buttons', function(){
            beforeEach(function(){
                spyOn($.images.fotoPopin.prototype, '_activateTab').andCallThrough();
                spyOn($.images.fotoPopinSearch.prototype, 'activate');
                spyOn($.images.fotoPopinCrop.prototype, 'activate');
                spyOn($.images.fotoPopinUpload.prototype, 'activate');
                spyOn($.images.fotoPopinPreview.prototype, 'activate');
                this.tabsContainer = this.widget.elements.tabsContainer;
            });

            describe('navigation on the Search tab', function(){
                beforeEach(function(){
                    this.element.fotoPopin('open');
                });

                it('should go to Upload when the register button is clicked', function(){
                    this.element.find('.register-top-button').click();
                    expect(this.widget.elements.fotoPopinSearch.css('display')).toEqual('none');
                    expect(this.widget.elements.fotoPopinUpload.css('display')).toEqual('block');
                });

                it('should disable the applyButton when the fotoPopinThumbnailsAllItemsDeselected event is fired', function() {
                    this.element.trigger('fotoPopinThumbnailsAllItemsDeselected');
                    expect(this.widget.elements.applyButton.is(':disabled')).toEqual(true);
                });

                it('should enable the applyButton when the fotoPopinThumbnailsItemSelected event is fired', function() {
                    this.element.trigger('fotoPopinThumbnailsItemSelected', [$('<li>')]);
                    expect(this.widget.elements.applyButton.is(':disabled')).toEqual(false);
                });
            });

            describe('navigation on the Upload tab', function(){
                beforeEach(function(){
                    this.element.fotoPopin('open', 'fotoPopinUpload');
                });

                it('should go to Search when search button is clicked', function(){
                    this.element.find('.search-top-button').click();
                    expect(this.widget.elements.fotoPopinUpload.css('display')).toEqual('none');
                    expect(this.widget.elements.fotoPopinSearch.css('display')).toEqual('block');
                });
                it('should close the popin when the cancel button is clicked', function(){
                    this.element.find('.cancel-button').click();
                    expect(this.element.css('display')).toEqual('none');
                });
            });

            describe('navigation on the Crop tab', function(){
                beforeEach(function(){
                    // como o jcrop soh inicializa no carregar de imagens, o deactivate dah erro
                    // pq tenta destruir ele, o spy eh apenas para nao executar isso e dar erro
                    spyOn($.images.fotoPopinCropCropper.prototype, 'deactivate');
                    this.element.fotoPopin('open', 'fotoPopinCrop');
                });

                it('should go to Search when the back button is clicked', function(){
                    this.element.find('.back-button').click();
                    expect(this.widget.elements.fotoPopinCrop.css('display')).toEqual('none');
                    expect(this.widget.elements.fotoPopinSearch.css('display')).toEqual('block');
                });

                it('should go to Preview when the preview button is clicked', function(){
                    this.element.find('button.preview-button').click();
                    expect(this.widget.elements.fotoPopinCrop.css('display')).toEqual('none');
                    expect(this.widget.elements.fotoPopinPreview.css('display')).toEqual('block');
                });
            });

            describe('navigation on the Preview tab', function(){
                beforeEach(function(){
                    this.element.fotoPopin('open', 'fotoPopinPreview');
                });

                it('should go to Crop when the back button is clicked', function(){
                    this.element.find('button.back-button').click();
                    expect(this.widget.elements.fotoPopinPreview.css('display')).toEqual('none');
                    expect(this.widget.elements.fotoPopinCrop.css('display')).toEqual('block');
                });
            });
        });

        describe('close popin', function(){
            beforeEach(function(){
                this.element.fotoPopin('open');
            });

            it('should close the popin when the close button is clicked', function(){
                this.element.find('.close-top-button').click();
                expect(this.element.css('display')).toEqual('none');
            });
            it('should close the popin when the ESC keyboard button is pressed', function(){
                var ESC_KEYCODE = 27;
                var e = $.Event('keydown');
                e.keyCode = ESC_KEYCODE;
                $(document).trigger(e);
                expect(this.element.css('display')).toEqual('none');
            });
            xit('should close the popin when theres a click outside the popin', function(){
                $('body').click();
                expect(this.element.css('display')).toEqual('none');
            });
            it('should NOT close the popin when theres a click inside the popin', function(){
                this.element.click();
                expect(this.element.css('display')).toEqual('block');
            });
        });
    });

});
