describe('images foto popin search filters', function() {

    beforeEach(function(){
        this.container = $('<div/>');
        spyOn($.fn, "datepicker").andCallThrough();
        spyOn(window, 'setTimeout').andCallFake(function(func, timeout) {
            func();
        });
    });

    var makeServerResponse = function (response) {
        var server = sinon.fakeServer.create();
        var response = [200, {}, "newImages('" + response + "')"];
        server.respondWith("GET",
            /\/libby\/aplicacoes\/foto\/search.*/,
            response);
        return server;
    };

    var verifyDateOptions = function(settings){
        var correctOptions = {
                changeMonth: true,
                changeYear: true,
                dayNamesMin: ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'],
                dayNames: ['Domingo', 'Segunda', 'Ter&ccedil;a', 'Quarta', 'Quinta', 'Sexta', 'S&acedil;bado'],
                monthNames: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
                dateFormat: "dd/mm/yy",
                yearRange: "-40:+0",
                prevText: "",
                nextText: "",
                duration: "fast"
            },
            numConfigs = 0;

        $.each(settings, function(key, value) {
            expect(value).toEqual(correctOptions[key]);
            numConfigs++;
        });

        expect(numConfigs).toEqual(10);
    };

    describe('plugin instance creation', function(){
        beforeEach(function() {
            this.container.fotoPopinSearchFilters({ container: this.container });
        });

        it('can be called with no arguments', function() {
            expect(this.container.data('fotoPopinSearchFilters')).toBeTruthy();
            this.container.fotoPopinSearchFilters('destroy');
        });

        it('should have a container div', function() {
            expect(this.container).toContain('div.images-fotoPopinSearchFilters-container');
        });

        it('contains a form element', function() {
            expect(this.container).toContain('form');
        });

        describe("when the search is initializated", function(){

            beforeEach(function(){
                this.search = this.container.data('fotoPopinSearchFilters');
            });

            it("should have a keyword field as blank", function(){
                expect(this.search.elements.inputKeyword).toHaveValue('');
            });

            it("should have a from date field as blank", function(){
                expect(this.search.elements.inputDateFrom).toHaveValue('');
            });

            it("should have a to date field as blank", function(){
                expect(this.search.elements.inputDateTo).toHaveValue('');
            });

            it("should have a radio use event date not checked", function(){
                expect(this.search.elements.radioUseEvent.attr('checked')).toBeFalsy();
            });

            it("should have a radio use register date not checked", function(){
                expect(this.search.elements.radioUseRegister.attr('checked')).toBeTruthy();
            });

            it("the button use date filters should be visible", function(){
                expect(this.search.elements.buttonUseDate.parent()).not.toHaveClass("hidden");
            });

            it("the datepicker plugin should be called for all fields", function(){
                expect($.fn.datepicker.callCount).toEqual(2);
            });

            it("the correct options should be passed to datepicker plugin", function() {
                verifyDateOptions(this.search.options.datepicker);
            });

            it("should not be visible the filters for date", function(){
                expect(this.search.elements.containerDateFilters).not.toHaveClass("visible");
            });

            describe("when is activated", function(){
                beforeEach(function(){
                    this.server = makeServerResponse("theresponsegoeshere");
                    this.callback = jasmine.createSpy();
                    this.container.bind('fotoPopinNewImages', this.callback);
                    this.container.fotoPopinSearchFilters('activate');
                    this.server.respond();
                });

                afterEach(function(){
                    this.server.restore();
                });

                it("should execute the first search request and call the fotoPopinNewImages event", function(){
                    expect(this.callback).toHaveBeenCalled();
                });

                it("the event fotoPopinNewImages have to be called with the correct parameters", function(){
                    expect(this.callback).toHaveBeenCalledWith(jasmine.any(Object), 'theresponsegoeshere', false, 1);
                });

                describe("when new page event is called", function(){
                    beforeEach(function(){
                        this.server = makeServerResponse('newpageeventresponse');
                        this.callback = jasmine.createSpy();
                        this.container.bind('fotoPopinNewImages', this.callback);
                        this.container.trigger("fotoPopinNewPage", 2);
                        this.server.respond();
                    });

                    it("the correctly params should be passed", function(){
                        expect(this.search._prepareParams()).toEqual({q: "", page: 2, page_size: 18});
                    });

                    it("a new page have to be requested", function(){
                        expect(this.callback).toHaveBeenCalledWith(jasmine.any(Object), "newpageeventresponse", false, 2);
                    });
                });

                describe("when search for keyword 'fabio'", function(){
                    beforeEach(function(){
                        this.server = makeServerResponse('theresponseforfabiogoeshere');

                        this.callback1 = jasmine.createSpy();
                        this.container.bind('fotoPopinNewImages', this.callback1);

                        this.search.elements.inputKeyword.val("fabio");
                        this.search.elements.form.submit();

                        this.server.respond();
                    });

                    afterEach(function(){
                        this.server.restore();
                    });

                    it("the correct params should be passed", function(){
                        expect(this.search._prepareParams()).toEqual({q:"fabio", page:1, page_size: 18});
                    });

                    it("the search have to be executed", function(){
                        expect(this.callback1).toHaveBeenCalledWith(jasmine.any(Object), 'theresponseforfabiogoeshere', true, 1);
                    });
                });

                describe("when opening date filter", function(){

                    beforeEach(function(){
                        this.search.elements.buttonUseDate.click();
                    });

                    it("should be visible", function(){
                        expect(this.search.elements.containerDateFilters).not.toHaveClass("hidden");
                    });

                    it("the button use date filters should not be visible", function(){
                        expect(this.search.elements.buttonUseDate.parent()).not.toHaveClass("hidden");
                    });
                    
                    describe('and leaving date fields blank', function() {
                        beforeEach(function(){
                            this.server = makeServerResponse('resultfordatefilters');

                            this.callback2 = jasmine.createSpy();
                            this.container.unbind('fotoPopinNewImages').bind('fotoPopinNewImages', this.callback2);

                            this.search.elements.inputKeyword.val("fabio");
                            this.search.elements.form.submit();

                            this.server.respond();
                        });
                        
                        it('should leave date search params undefined', function() {
                            expect(this.search._prepareParams()).toEqual({q: "fabio",
                                                                          created_date_from: undefined,
                                                                          created_date_to: undefined,
                                                                          event_date_from: undefined,
                                                                          event_date_to: undefined,
                                                                          page: 1,
                                                                          page_size: 18});
                        });
                    });
                    
                    describe('and fill all fields with created date', function() {
                        beforeEach(function(){
                            this.server = makeServerResponse('resultfordatefilters');

                            this.callback2 = jasmine.createSpy();
                            this.container.unbind('fotoPopinNewImages').bind('fotoPopinNewImages', this.callback2);

                            this.search.elements.inputKeyword.val("fabio");
                            this.search.elements.inputDateFrom.val("11/11/2011");
                            this.search.elements.inputDateTo.val("12/12/2012");

                            this.search.elements.form.submit();

                            this.server.respond();
                        });

                        it("all fields should be used for search filter", function(){
                            expect(this.search._prepareParams()).toEqual({q: "fabio",
                                                                          created_date_from: "2011-11-11T00:00:00",
                                                                          created_date_to: "2012-12-12T23:59:59",
                                                                          page: 1,
                                                                          page_size: 18});
                        });

                        it("the event fotoPopinNewImages should be executed", function(){
                            expect(this.callback2).toHaveBeenCalledWith(jasmine.any(Object), "resultfordatefilters", true, 1);
                        });
                    });

                    describe("and fill all fields with event date", function(){

                        beforeEach(function(){
                            this.server = makeServerResponse('resultfordatefilters');

                            this.callback2 = jasmine.createSpy();
                            this.container.unbind('fotoPopinNewImages').bind('fotoPopinNewImages', this.callback2);

                            this.search.elements.inputKeyword.val("fabio");
                            this.search.elements.inputDateFrom.val("11/11/2011");
                            this.search.elements.inputDateTo.val("12/12/2012");
                            this.search.elements.radioUseEvent.attr('checked', true);

                            this.search.elements.form.submit();

                            this.server.respond();
                        });

                        it("all fields should be used for search filter", function(){
                            expect(this.search._prepareParams()).toEqual({q: "fabio",
                                                                          event_date_from: "2011-11-11T00:00:00",
                                                                          event_date_to: "2012-12-12T23:59:59",
                                                                          page: 1,
                                                                          page_size: 18});
                        });

                        it("the event fotoPopinNewImages should be executed", function(){
                            expect(this.callback2).toHaveBeenCalledWith(jasmine.any(Object), "resultfordatefilters", true, 1);
                        });

                        describe("when triggered an event fotoPopinNewSearch", function(){

                            beforeEach(function(){
                                this.server = makeServerResponse('here');
                                this.container.trigger("fotoPopinNewSearch", false);
                                this.server.respond();
                            });

                            it("should have a keyword field as blank", function(){
                                expect(this.search.elements.inputKeyword).toHaveValue('');
                            });

                            it("should have a from date field as blank", function(){
                                expect(this.search.elements.inputDateFrom).toHaveValue('');
                            });

                            it("should have a to date field as blank", function(){
                                expect(this.search.elements.inputDateTo).toHaveValue('');
                            });

                            it("should have a radio use event date not checked", function(){
                                expect(this.search.elements.radioUseEvent.attr('checked')).toBeFalsy();
                            });

                            it("should have a radio use register date not checked", function(){
                                expect(this.search.elements.radioUseRegister.attr('checked')).toBeTruthy();
                            });

                            it("should not be visible the filters for date", function(){
                                expect(this.search.elements.containerDateFilters).not.toHaveClass("visible");
                            });

                        });

                        describe("and close filter by date", function(){

                            beforeEach(function(){
                                this.search.elements.buttonCloseDate.click();
                            });

                            it("should not be visible", function(){
                                expect(this.search.elements.containerDateFilters).not.toHaveClass("visible");
                            });

                            describe("and make a search", function(){

                                beforeEach(function(){
                                    this.server = makeServerResponse('thenewresponse');

                                    this.callback3 = jasmine.createSpy();
                                    this.container.unbind('fotoPopinNewImages').bind('fotoPopinNewImages', this.callback3);

                                    this.search.elements.form.submit();

                                    this.server.respond();
                                });

                                it("the correctly params should be passed", function(){
                                    expect(this.search._prepareParams()).toEqual({q:"fabio", page:1, page_size: 18});
                                });

                                it("the search have to be executed", function(){
                                    expect(this.callback3).toHaveBeenCalledWith(jasmine.any(Object), "thenewresponse", true, 1);
                                });

                            });
                        });
                    });
                });
            });
        });

        describe("the form element", function(){

            beforeEach(function(){
                this.form = this.container.find('form');
            });

            it("have to contain a fieldset element", function(){
                expect(this.form).toContain('fieldset');
            });

            it("have to contain a label with content 'de'", function(){
                expect(this.form).toContain('label:contains("de")');
            });

            it("have to contain a label with content 'até'", function(){
                expect(this.form).toContain('label:contains("até")');
            });

            it("have to contain a input field type text with name 'textoPesquisa'", function(){
                expect(this.form).toContain('input[type="text"][name="q"]');
            });

            it("have to contain a input field type text with name 'dataInicio'", function(){
                expect(this.form).toContain('input[type="text"][name="from"]');
            });

            it("have to contain a input field type text with name 'dataFim'", function(){
                expect(this.form).toContain('input[type="text"][name="to"]');
            });

            it("have to contain a input field type radio with name 'usarDataDeEvento'", function(){
                expect(this.form).toContain('input[type="radio"][name="isevent"]');
            });

            it("have to contain a input field type radio with name 'usarDataDeCadastro' and have to be checked", function(){
                expect(this.form).toContain('input[type="radio"][name="isevent"][checked="checked"]');
            });

            it("have to contain a input field type button with a value 'filtrar por data'", function(){
                expect(this.form).toContain('button:contains("filtrar por data")');
            });

            it("have to contain a input field type submit with a value 'buscar'", function(){
                expect(this.form).toContain('button:contains("buscar")');
            });

            it("have to contain a link with content 'fechar'", function(){
                expect(this.form).toContain('button:contains("x")');
            });
        });

    });

});
