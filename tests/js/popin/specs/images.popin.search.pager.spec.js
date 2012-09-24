describe("images foto popin pager", function(){

    beforeEach(function(){
        this.container = $('<div></div>');
        this.element = $('<div></div>');

        this.element.fotoPopinSearchPager( { container: this.container } ).fotoPopinSearchPager("activate");
    });

    describe('plugin instance creation', function(){

        it("the paginator is not have to be visible", function(){
            expect(this.container.find(".images-fotoPopinSearchPager-container")).toHaveClass("off");
        });

        it('contain a element <input>', function(){
            expect(this.container).toContain('input:text');
        });

        it('contain an empty element <span>', function(){
            expect(this.container.find('span.images-fotoPopinSearchPager-totalPages')).toHaveText('');
        });

        it('has class off in back button', function(){
            expect(this.container.find('button.images-fotoPopinSearchPager-backPage')).toHaveClass('off');
        });

        it('not has class off in next button', function(){
            expect(this.container.find('button.images-fotoPopinSearchPager-nextPage')).not.toHaveClass('off');
        });

    });

    describe("when a search is executed", function(){

        beforeEach(function(){
            this.pager = this.element.data("fotoPopinSearchPager");

            this.element.trigger('fotoPopinNewImages', [{
                'start': 0,
                'numFound': 20,
                'pageSize': 10,
                'photos': [ { } ]
            }, false, 1]);
        });

        describe('click next button', function(){

            beforeEach(function(){
                this.callback = jasmine.createSpy();

                this.element.bind('fotoPopinNewPage', this.callback);
                this.pager.elements.buttonNextPage.click();
            });

            it('add event', function(){
                expect(this.callback).toHaveBeenCalledWith(jasmine.any(Object), 2);
            });

            it('remove class off back button', function(){
                expect(this.pager.elements.buttonBackPage).not.toHaveClass('off');
            });

            it('add class off next button', function(){
                expect(this.pager.elements.buttonNextPage).toHaveClass('off');
            });
        });

        describe('click back button', function(){

            beforeEach(function(){
                this.callback = jasmine.createSpy();

                this.pager.elements.buttonNextPage.click();

                this.element.bind('fotoPopinNewPage', this.callback);

                this.pager.elements.buttonBackPage.click();
            });

            it('add event', function(){
                expect(this.callback).toHaveBeenCalledWith(jasmine.any(Object), 1);
            });

            it('add class off back button', function(){
                expect(this.pager.elements.buttonBackPage).toHaveClass('off');
            });

            it('remove class off next button', function(){
                expect(this.pager.elements.buttonNextPage).not.toHaveClass('off');
            });

        });

        describe('change input search', function(){

            beforeEach(function(){
                this.pager.elements.inputCurrentPage.val('3');
                this.pager.elements.inputCurrentPage.change();
            });

            it('value > total', function(){
                expect(this.pager.elements.inputCurrentPage).toHaveValue('2');
            });

            describe("change input to a non numeric value", function(){

                beforeEach(function(){
                    this.pager.elements.inputCurrentPage.val('a');
                    this.pager.elements.inputCurrentPage.change();
                });

                it('value != number', function(){
                    expect(this.pager.elements.inputCurrentPage).toHaveValue('2');
                });

                it('add class off next button', function(){
                    expect(this.pager.elements.buttonNextPage).toHaveClass('off');
                });

                describe("change input to negative value", function(){

                    beforeEach(function(){
                        this.pager.elements.inputCurrentPage.val('-1');
                        this.pager.elements.inputCurrentPage.change();
                    });

                    it('add class off back button', function(){
                        expect(this.pager.elements.buttonBackPage).toHaveClass('off');
                    });

                });

            });

        });

    });

});
