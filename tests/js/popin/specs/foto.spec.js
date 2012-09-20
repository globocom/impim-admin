describe("no pop de foto", function() {
    var
        testMode = true,
        template,
        context,
        returnAjax,
        returnAjaxForm;

    beforeEach(function(){
        if (!template){
            template = $('#spec-template').remove();
        }

        context = template.clone();
        context.appendTo('body');

        if(!returnAjax){
           returnAjax = $("#ajax").html();
           $("#ajax").remove();
        }

        if (!returnAjaxForm) {
            returnAjaxForm = $("#ajax-form").html();
            $("#ajax-form").remove();
        }

    });

    afterEach(function(){
        context.remove();
        $(".cma-highlight-photo").die("click");
        $(".cma-foto-popin").dialog("destroy").remove();
    });

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

    it("configurações de abertura do calendário devem estar em português", function(){
       var popIn = new $.fn.popInFoto();
        verifyDateOptions(popIn.settingsDate);
    });

    describe("com evento associado pré-existente", function(){
        beforeEach(function(){
            $(".cma-area").delegate(".cma-highlight-editing .cma-highlight-photo", "click", function(){
               $(".modal-core").show();
            });
        });

        it("e a propriedade core está setado como 'true', remove o evento.", function(){
            spyOn($, "ajax");
            $(".cma-highlight-photo").popInFoto( { core: true, testMode: testMode } );
            $(".cma-highlight-photo").click();

            expect($(".modal-core").is(":visible")).toEqual(false);
        });

        it("e a propriedade core está setado como 'false', não remove o evento.", function(){
            spyOn($, "ajax");
            $(".cma-highlight-photo").popInFoto( { core: false, testMode: testMode } );
            $(".cma-highlight-photo").click();

            expect($(".modal-core").is(":visible")).toEqual(true);
        });
    });

    describe("ao inicializar o popin com urls personalizadas", function(){
        beforeEach(function(){
            var ajaxArguments;

            spyOn($, "ajax");

            $(".cma-highlight-photo").popInFoto({
                core: false,
                testMode: testMode,
                modalUrl: "/my/new/url/modal/",
                searchUrl: "/my/new/url/search/",
                photoUploadUrl: "/my/new/url/upload/"
            });

            ajaxArguments = $.ajax.argsForCall[0][0];
            ajaxArguments.success(returnAjax);

            ajaxArguments = $.ajax.argsForCall[1][0];
            ajaxArguments.success(returnAjaxForm);

            $(".cma-highlight-photo").click();

            this.argsForCall = $.ajax.argsForCall;
        });

        it("a url de carregamento da modal deve ser a opção selecionada pelo usuário", function(){
            var callLoadModal = 0;
            expect(this.argsForCall[callLoadModal][0].url).toEqual("/my/new/url/modal/");
        });

        it("a url de carregamento do formulário de cadastro de foto deve ser a selecionada pelo usuário", function(){
            var callLoadForm = 1;
            expect(this.argsForCall[callLoadForm][0].url).toEqual("/my/new/url/upload/");
        });

        it("a url de pesquisa de foto deve ser a selecionada pelo usuário", function(){
            var callSearchPhotos = 2;
            expect(this.argsForCall[callSearchPhotos][0].url).toEqual("/my/new/url/search/");
        });
    });


    describe("com o pop", function(){
        beforeEach(function(){
            var ajaxArguments;

            spyOn($, "ajax");
            spyOn($.fn, "datepicker").andCallThrough();

            $(".cma-highlight-photo").popInFoto({ core: true, testMode: testMode });

            ajaxArguments = $.ajax.argsForCall[0][0];
            ajaxArguments.success(returnAjax);

            ajaxArguments = $.ajax.argsForCall[1][0];
            ajaxArguments.success(returnAjaxForm);
        });

        describe("aberto", function() {
           beforeEach(function(){
               $(".cma-highlight-photo").click();
           });

           it("ao clicar, abrir a modal do novo popin de foto.", function(){
               expect($("#modal-popin-foto").dialog("isOpen")).toEqual(true);
           });

           it("ao clicar em fechar modal, fechá-la", function(){
               expect($("#modal-popin-foto").dialog("isOpen")).toEqual(true);
               $(".cma-close-popin").click();
               expect($("#modal-popin-foto").dialog("isOpen")).toEqual(false);
           });

           describe("ao clicar no botão abrir filtro", function(){
               beforeEach(function(){
                   $(".filtro-habilita-data input").click();
               });

               it("exibir o filtro de pesquisa por data", function(){
                   expect($(".filtro-data").is(":visible")).toEqual(true);
               });

               describe("ao clicar no botão de fechar filtro", function(){
                  beforeEach(function(){
                      $(".fechar-filtro-data a").click();
                  });

                  it("o filtro de pesquisa por data não deve ser exibido", function(){
                      expect($(".filtro-data").css("opacity")).toEqual('0');
                  });

               });

           });

           it("o calendário do plugin datepicker deve estar em português", function(){
                expect($.fn.datepicker.callCount).toEqual(3);
                $.each($.fn.datepicker.argsForCall, function(i, args){
                    verifyDateOptions(args[0]);
                });
           });

           it("ao clicar em cadastrar imagem, fecha modal buscar foto e abre modal cadastrar foto", function(){
               $("#abrir-cadastro-imagem").click();
               expect($("#popin-cadastro-imagem").is(":visible")).toEqual(true);
               expect($("#popin-buscar-foto").is(":visible")).toEqual(false);
           });

           it("ao clicar em buscar foto, fecha modal cadastrar foto e abre modal de buscar foto", function(){
               $("#abrir-cadastro-imagem").click();
               $("#abrir-busca-foto").click();
               expect($("#popin-cadastro-imagem").is(":visible")).toEqual(false);
               expect($("#popin-buscar-foto").is(":visible")).toEqual(true);
           });

           it("clicar em cadastrar imagem, fechar o popin e abrir novamente, o popin deve abrir na pesquisa de foto", function(){
               // abre o cadastro de imagem
               $("#abrir-cadastro-imagem").click();

               // fecha o popin de foto
               $(".cma-close-popin").click();

               // abre novamente o popin
               $(".cma-highlight-photo").click();

               expect($("#popin-buscar-foto").is(":visible")).toEqual(true);
           });

           describe("com todas as interações possíveis na tela de pesquisa", function(){
               beforeEach(function(){
                   $(".filtro-habilita-data input").click();

                   // preenche os campos disponíveis
                   $(".filtro-pesquisa input").val("evandro");
                   $(".filtro-data-inicio input[type='text']").val("01/01/2011");
                   $(".filtro-data-fim input[type='text']").val("01/02/2011");
                   $(".filtro-data-tipo input.evento[type='radio']").attr("checked", true);
                   //$(".paginacao input.pagina-atual").val(10);

                   // fecha o popin de foto
                   $(".cma-close-popin").click();

                   // abre novamente o popin
                   $(".cma-highlight-photo").click();
               });

               it("o campo de texto da pesquisa deve estar vazio", function(){
                   expect($(".filtro-pesquisa input").val()).toBeFalsy();
               });

               it("o campo de data incial deve estar vazio", function(){
                   $(".filtro-habilita-data input").click();
                   expect($(".filtro-data-inicio input[type='text']").val()).toBeFalsy();
               });

               it("o campo de data final deve estar vazio", function(){
                   $(".filtro-habilita-data input").click();
                   expect($(".filtro-data-fim input[type='text']").val()).toBeFalsy();
               });

               it("o campo tipo de data do evento não deve estar selecionado", function(){
                   $(".filtro-habilita-data input").click();
                   expect($(".filtro-data-tipo input.evento").attr("checked")).toBeFalsy();
               });

               it("o campo tipo de data do cadastro deve estar selecionado", function(){
                   $(".filtro-habilita-data input").click();
                   expect($(".filtro-data-tipo input.cadastro").attr("checked")).toEqual(true);
               });
           });

           describe("com todas as interações possíveis na tela de cadastro de foto ao fechar o modal e abrir novamente", function(){
               beforeEach(function(){
                   var form = $("#formulario-cadastro-foto");

                   $("#abrir-cadastro-imagem").click();

                   form.find("input.title").val("Evando na Praia");
                   form.find("input.credits").val("Fabio M. Costa");
                   form.find("input.cma_photo_tags").val("praia, mar, domingo");
                   form.find("#id_image_date").val("05/01/2011");

                   // fecha o popin de foto
                   $(".cma-close-popin").click();

                   // abre novamente o popin
                   $(".cma-highlight-photo").click();
               });

               it("o campo do arquivo da imagem deve estar vazio", function(){
                   expect($("#formulario-cadastro-foto input.image").val()).toBeFalsy();
               });

               it("o campo do titulo da imagem deve estar vazio", function(){
                   expect($("#formulario-cadastro-foto input.title").val()).toBeFalsy();
               });

               it("o campo de creditos da imagem deve estar vazio", function(){
                   expect($("#formulario-cadastro-foto input.credits").val()).toBeFalsy();
               });

               it("o campo das tags da imagem deve estar vazio", function(){
                   expect($("#formulario-cadastro-foto input.cma_photo_tags").val()).toBeFalsy();
               });

               it("o campo da data do evento da imagem deve estar vazio", function(){
                   expect($("#formulario-cadastro-foto #id_image_date").val()).toBeFalsy();
               });
           });

           it("validar abertuda do do plugin datepicker de seleção de data inicio", function(){
               $(".filtro-habilita-data input").click();
               $(".filtro-data-inicio input[type='text']").focus();
               expect($("#ui-datepicker-div").is(":visible")).toEqual(true);
               $("#ui-datepicker-div").hide();
           });

           it("validar abertuda do plugin datepicker de seleção de data fim", function(){
               $(".filtro-habilita-data input").click();
               $(".filtro-data-fim input[type='text']").focus();
               expect($("#ui-datepicker-div").is(":visible")).toEqual(true);
               $("#ui-datepicker-div").hide();
           });

           describe("verificar parametros do formulário de pesquisa de fotos", function(){
               it("ao escrever um texto no input de pesquisa, este texto deve ser passado por parametro na pesquisa", function(){
                   var ajaxArguments,
                       searchText = "evandro na praia no domingo",
                       params, param, completeUrl, numParamsPassed = 0;

                   $(".filtro-pesquisa input").val(searchText);

                   $(".botao-busca input[type='submit']").submit();
                   ajaxArguments = $.ajax.mostRecentCall.args[0];

                   completeUrl = unescape(ajaxArguments.url).split("?");
                   expect(completeUrl[0]).toEqual("/libby/aplicacoes/foto/busca/");
                   params = completeUrl[1].split("&");

                   $.each(completeUrl, function(){
                       param = this.split("=");
                       if (param[0] === "keyword"){
                           expect(param[1]).toEqual(searchText);
                           numParamsPassed++;
                       }
                   });
                   expect(numParamsPassed).toEqual(1);
               });

               it("ao inserir uma data inicial e uma data final com o tipo de data sendo o de cadastro, estes dados devem ser passados como parametro para a pesquisa de imagem", function(){
                   var ajaxArguments,
                       searchText = "fabio foi a praia no domingo",
                       params, param, completeUrl, numParamsPassed = 0;
                    $(".filtro-pesquisa input").val(searchText);
                    $(".filtro-habilita-data input").click();
                    $(".filtro-data-inicio input[type='text']").val("01/01/2011");
                    $(".filtro-data-fim input[type='text']").val("01/04/2011");
                    $("#popin-data-evento").attr("checked", "checked");

                    $(".botao-busca input[type='submit']").submit();
                    ajaxArguments = $.ajax.mostRecentCall.args[0];

                    completeUrl = unescape(ajaxArguments.url).split("?");
                    expect(completeUrl[0]).toEqual("/libby/aplicacoes/foto/busca/");
                    params = completeUrl[1].split("&");

                    $.each(params, function(){
                        param = this.split("=");
                        switch(param[0]){
                            case "keyword":
                                expect(param[1]).toEqual(searchText);
                                numParamsPassed++;
                                break;
                            case "from":
                                expect(param[1]).toEqual("01/01/2011");
                                numParamsPassed++;
                                break;
                            case "to":
                                expect(param[1]).toEqual("01/04/2011");
                                numParamsPassed++;
                                break;
                            case "isevent":
                                expect(param[1]).toEqual("true");
                                numParamsPassed++;
                                break;
                        }
                    });

                    expect(numParamsPassed).toEqual(4);
               });
           });

           describe("com imagens retornando no resultado da pesquisa", function(){
               beforeEach(function(){
                    var ajaxArguments = $.ajax.mostRecentCall.args[0];
                    // carrega as imagens de abertura do popin de foto
                    ajaxArguments.success(imageSearchReturn);
               });

               it("apresentar os dados da imagem no div de hover", function(){
                   var photosResults = $("#popin-buscar-foto .cma-popin-conteudo .midia-conteudo > li .foto > ul"),
                       photos = imageSearchReturn.photos,
                       numTotalPhotos = photosResults.length,
                       numValidation = 0;

                   photosResults.each(function(i){
                       var st = $(this).find("strong");
                       expect(st.eq(0).html()).toEqual(photos[i].dataCadastro);
                       expect(st.eq(1).html()).toEqual(photos[i].largura + "x" + photos[i].altura);
                       numValidation++;
                   });
                   expect(numValidation).toEqual(numTotalPhotos);
               });


               it("ao clicar na foto deve ser apresentado um box ao redor da foto selecionada", function(){
                   var photosResults = $("#popin-buscar-foto .cma-popin-conteudo .midia-conteudo > li"),
                       photoSelected = photosResults.eq(2),
                       numTotalPhotos = photosResults.length,
                       numNonSelectedPhotos = 0;

                   // validar se o elemento clicado tem uma classe especifica de seleção
                   photoSelected.click();
                   expect($(photoSelected).hasClass("foto-selecionada")).toEqual(true);

                   // verificar se os outros elementos não tem essa classe
                   photosResults.each(function(i, elem){
                       if (i != 2) {
                           expect($(elem).hasClass("foto-selecionada")).toEqual(false);
                           numNonSelectedPhotos++;
                       }
                   });
                   expect(numNonSelectedPhotos).toEqual( numTotalPhotos - 1 );
               });
           });

           describe("com a tela de cadastro de imagens aberta", function(){
               beforeEach(function(){
                    this.form = $("#popin-form-cadastrar-imagem");
                    this.popinCadastro = $("#popin-cadastro-imagem");
                    $("#abrir-cadastro-imagem").click();
               });

               describe("ao dar focus no campo de data", function(){
                   beforeEach(function(){
                       this.imageDate = this.form.find("#id_image_date").focus();
                   });

                   it("deve ficar visivel o widget de datepicker", function(){
                       expect($("#ui-datepicker-div").is(":visible")).toEqual(true);
                       $("#ui-datepicker-div").hide();
                   });
               });

               describe("preenchendo todos os campos do cadastro", function(){
                   beforeEach(function(){
                        this.form.find("#id_name").val("Evandro na Praia");
                        this.form.find("#id_credits").val("Fabio M. Costa");
                        this.form.find("#id_tags").val("praia, mar, domingo");
                        this.form.find("#id_image_date").val("05/01/2011");

                        spyOn($.fn, 'ajaxSubmit');
                   });

                   it("preencher o formulário faltando adicionar o nome da imagem, deve aparecer erro no campo de nome", function(){
                         var ajaxArguments,
                            params, param, completeUrl, numParamsPassed = 0;

                        $.fn.showMessage = function(options){};

                        this.form.find("#id_name").val("");

                        // envia o formulário de cadastro
                        this.popinCadastro.find("button[type='submit']").submit();

                        ajaxArguments = $.fn.ajaxSubmit.argsForCall[0][0];

                        ajaxArguments.error({response: '["name"]'});

                        // verifica se foi apresentado o erro no campo de titulo.
                        expect(this.form.find("#id_name").hasClass("error")).toEqual(true);

                        expect(this.form.find("#id_image_date").hasClass("error")).toEqual(false);
                        expect(this.form.find("#id_credits").hasClass("error")).toEqual(false);
                        expect(this.form.find("#id_tags").hasClass("error")).toEqual(false);
                    });

                    describe('ao enviar os dados do formulario', function(){
                        beforeEach(function(){
                            // envia o formulário de cadastro
                            this.popinCadastro.find("button[type='submit']").submit();
                            var recentCall = $.fn.ajaxSubmit.mostRecentCall;
                            this.context = recentCall.object;
                            this.ajaxArguments = recentCall.args[0];
                            this.popinCrop = $('#popin-crop');
                        });

                        it("verifica se os dados do cadastro estão sendo enviados", function(){
                            expect(this.ajaxArguments.url).toEqual("/libby/aplicacoes/foto/upload/");
                            expect(this.context.get(0)).toEqual(this.form.get(0));
                        });

                        describe('o formulario enviou com sucesso', function(){
                            beforeEach(function(){
                                var responseJson = {
                                    id: 'uuid',
                                    url: 'http://ego.globo.com/Gente/foto/0,,48036918-EXH,00.jpg',
                                    width: 800,
                                    height: 400
                                };
                                this.ajaxArguments.success(JSON.stringify(responseJson));
                            });
                            it('verifica se a tela está com com o título preenchido com o nome da imagem', function(){
                                expect(this.popinCrop.find('hgroup h3 span').text()).toEqual('0,,48036918-EXH,00.jpg');
                            });
                            it('verificar se o tamanho da imagem foi setado para visualizacao do usuario', function(){
                                expect(this.popinCrop.find('.popin-crop-photo-info-original strong').text()).toEqual('800x400');
                            });
                            it('verifica se as constraints estao sendo setadas', function(){
                                expect(this.popinCrop.find('.popin-crop-dimensions-width strong').text()).toEqual('200 px');
                            });

                            describe('executou a chamada ajax requisitando a url do thumbnail', function() {
                                beforeEach(function() {
                                    var recentCall = $.ajax.mostRecentCall;
                                    this.ajaxArguments = recentCall.args[0];
                                });
                                it('verifica se foi enviada a url da imagem original', function() {
                                    expect(this.ajaxArguments.data.image_url).toEqual('http://ego.globo.com/Gente/foto/0,,48036918-EXH,00.jpg');
                                });
                                it('verifica se o width está sendo enviado corretamente', function() {
                                    expect(this.ajaxArguments.data.width).toEqual(620);
                                });
                                it('verifica se o height está sendo enviado corretamente', function() {
                                    expect(this.ajaxArguments.data.height).toBeUndefined();
                                });
                                it('verifica se foi chamada a url correta para geração da url do thumbor', function() {
                                    expect(this.ajaxArguments.url).toEqual("/libby/aplicacoes/foto/generate_url/");
                                });
                                describe('o ajax retorna com sucesso a url do thumbor', function() {
                                    beforeEach(function(){
                                        spyOn($.fn, "load");
                                        this.ajaxArguments = $.ajax.mostRecentCall.args[0];
                                        this.ajaxArguments.success(settings.STATIC_URL+'globocom/img/sprite1.png');
                                    });
                                    it('verifica se a imagem está sendo visualizada', function() {
                                        expect(this.popinCrop.find('.popin-crop-photo-container1 img').length).toEqual(1);
                                    });
                                    it('verifica se a imagem que está sendo mostrada é a retornada pelo ajax', function(){
                                        expect(this.popinCrop.find('.popin-crop-photo-container1 img').attr("src")).toEqual(settings.STATIC_URL+'globocom/img/sprite1.png');
                                    });

                                    describe('ao carregar a imagem que sera usada pelo cropper', function(){
                                        beforeEach(function(){
                                            var handlerImageLoad = $.fn.load.mostRecentCall.args[0];
                                            handlerImageLoad();
                                        });
                                        it('verifica se a thumbnail de mini-preview está sendo visualizado', function(){
                                            expect(this.popinCrop.find('.popin-crop-mini-preview img').length).not.toEqual(0);
                                        });

                                    });
                                });
                            });
                        });
                    });
                });
            });

            describe("carregamento do resultado de pesquisa (json)", function(){
                it("verificar url passada por parametro", function(){
                   var ajaxArguments;
                   // segunda chamada na abertura do popin de foto
                   ajaxArguments = $.ajax.mostRecentCall.args[0];
                   expect(ajaxArguments.url).toEqual("/libby/aplicacoes/foto/busca/");
                });

                it("Verificar a montagem do html se nao tem imagem", function(){
                   var
                        returnImage = {"start": 0, "numFound": 0, "photos": []},
                        ajaxArguments = $.ajax.mostRecentCall.args[0];

                   ajaxArguments.success(returnImage);
                   expect($(".cma-popin-conteudo").html()).toEqual("Não há imagens cadastradas");
                });

                it("verificar montagem do html com todas as imagens retornadas na busca", function(){
                    var container = $(".cma-popin-conteudo"),
                        ajaxArguments = $.ajax.mostRecentCall.args[0],
                        imageSize = imageSearchReturn.photos.length,
                        imagesDisplayed = 0;

                    ajaxArguments.success(imageSearchReturn);
                    $.each(imageSearchReturn.photos, function(){
                        for (var i=0; i < imageSize; i++){
                            if (this.thumbUrl === container.find("img:eq("+i+")").attr("src")){
                                expect(container.find("li .titulo:eq("+i+")").html()).toEqual(this.titulo);
                                i = imageSize;
                                imagesDisplayed++;
                            }
                        }
                    });

                    expect(imagesDisplayed).toEqual(imageSize);
                });

                describe("com o resultado da busca retornando imagens", function(){
                    beforeEach(function(){
                        var ajaxArguments = $.ajax.mostRecentCall.args[0];
                        ajaxArguments["success"](imageSearchReturn);
                    });

                    it("verificar montagem do html com todas as imagens retornadas na busca", function(){
                        var container = $(".cma-popin-conteudo"),
                            imageSize = imageSearchReturn.photos.length,
                            imagesDisplayed = 0;

                        $.each(imageSearchReturn.photos, function(){
                            for (var i=0; i < imageSize; i++){
                                if (this.thumbUrl === container.find("img:eq("+i+")").attr("src")){
                                    expect(container.find("li .titulo:eq("+i+")").html()).toEqual(this.titulo);
                                    i = imageSize;
                                    imagesDisplayed++;
                                }
                            }
                        });

                        expect(imagesDisplayed).toEqual(imageSize);
                    });

                    it("o numero de fotos retornadas deve ser apresentado ao usuário na tela", function(){
                        expect($("#popin-num-found").html()).toEqual(""+imageSearchReturn.numFound);
                    });


                    describe("após efetuar uma nova busca", function(){
                        beforeEach(function(){
                            var ajaxArguments;

                            $(".filtro-pesquisa input").val("rafael");
                            $(".botao-busca input[type='submit']").submit();

                            ajaxArguments = $.ajax.mostRecentCall.args[0];
                            ajaxArguments["success"]({"start": 0, "numFound": 0, "photos": []});
                        });

                        it("o botão de voltar para a listagem de todas as imagens deve ser apresentado ao usuário após efetuada a busca", function(){
                            expect($("#popin-backto-all-img").is(":visible")).toEqual(true);
                        });

                        it("ao clicar em voltar para todas as imagens retornadas na pesquisa o botão de voltar deve desaparecer e deve-se carregar novamente todas as fotos", function(){
                            expect($("#popin-num-found").html()).toEqual("0");
                            // clica em voltar
                            $("#popin-backto-all-img").click();
                            ajaxArguments = $.ajax.mostRecentCall.args[0];
                            ajaxArguments["success"](imageSearchReturn);

                            expect($.ajax.callCount).toEqual(5);
                            expect($("#popin-backto-all-img").is(":visible")).toEqual(false);
                            expect($("#popin-num-found").html()).toEqual(""+imageSearchReturn.numFound);
                        });

                        it("quando a quantidade de imagens não for maior que o pageSize imagens não é criada a paginação", function(){
                            expect($("#popin-buscar-foto .paginacao").is(":empty")).toEqual(true);
                        });

                    });

                    it("quando carregar a tela o número da página atual deve ser apresentado ao usuário no input de paginação", function(){
                        expect($("#popin-buscar-foto .paginacao input[type='text']").val()).toEqual("1");
                    });

                    it("quando a quantidade de imagens for maior que o pageSize imagens é criada a paginação", function(){
                        expect($("#popin-buscar-foto .paginacao").is(":visible")).toEqual(true);
                    });

                    it("quando a paginação for criada o número total de páginas deve ser apresentado ao usuário", function(){
                        expect(parseInt($("#popin-total-pg").html(), 10)).toEqual(Math.ceil(imageSearchReturn.numFound / imageSearchReturn.pageSize));
                    });

                    it("quando estiver na primeira página, não poderá aparecer a opção de ir para página anterior", function() {
                        expect($("#popin-pg-anterior").hasClass("off")).toEqual(true);
                    });

                    it("ao clicar em 'próxima página' deve mostrar as imagens da segunda página de resultados", function(){
                        var ajaxArguments,
                            containerImages = $(".cma-popin-conteudo"),
                            firstImage = "http://localhost:8888/_bjuyMs2iM_njkzX3QLnTaZOtCCqJs_uWf5u1KT3sBJyQc6kPSTqPaAOyG6gKR1B/s.glbimg.com/jo/g1/f/original/2011/04/01/blabla.jpg";

                        $("#popin-pg-proximo").click();

                        ajaxArguments = $.ajax.mostRecentCall.args[0];
                        expect(/page=2(&.*)?$/.test(ajaxArguments["url"])).toEqual(true);
                        ajaxArguments["success"]({"start": 15, "numFound": 16, "photos": [{"largura": 140, "dataEvento": "2011-04-01T00:00:00Z", "creditos": "AP", "assunto": "urso knut", "url": "http://s.glbimg.com/jo/g1/f/original/2011/04/01/cranio-knut.jpg", "titulo": "Modelo do cr\u00e2nio do Knut", "thumbUrl": firstImage, "dataCadastro": "2011-04-01T14:44:36Z", "altura": 116}]});

                        expect(containerImages.find("img:eq(0)").attr("src")).toEqual(firstImage);
                    });

                    it("ao clicar em 'próxima página' e clicar em 'página anterior' deve listar as imagens da primeira página novamente", function(){
                        var ajaxArguments,
                            containerImages = $(".cma-popin-conteudo"),
                            newPageResult = $.extend(true, {}, imageSearchReturn);

                        $("#popin-pg-proximo").click();

                        newPageResult.start = imageSearchReturn.photos.length;
                        newPageResult.photos[0].thumbUrl = "http://localhost:8888/_bjuyMs2iM_njkzX3QLnTaZOtCCqJs_uWf5u1KT3sBJyQc6kPSTqPaAOyG6gKR1B/s.glbimg.com/jo/g1/f/original/2011/04/01/blabla.jpg";
                        ajaxArguments = $.ajax.mostRecentCall.args[0];
                        expect(/page=2(&.*)?$/.test(ajaxArguments["url"])).toEqual(true);
                        ajaxArguments["success"](newPageResult);

                        $("#popin-pg-anterior").click();

                        ajaxArguments = $.ajax.mostRecentCall.args[0];
                        expect(/page=1(&.*)?$/.test(ajaxArguments["url"])).toEqual(true);
                        ajaxArguments["success"](imageSearchReturn);

                        expect(containerImages.find("img:eq(0)").attr("src")).toEqual(imageSearchReturn.photos[0].thumbUrl);
                    });

                    it("ao inserir o número de página 101, listar as imagens desta página e habilitar o anterior", function(){
                        var ajaxArguments,
                            pageInput = $("#popin-buscar-foto .paginacao input[type='text']"),
                            newPageResult = $.extend(true, {}, imageSearchReturn);

                        pageInput.val("101");
                        pageInput.change();

                        newPageResult.start = imageSearchReturn.photos.length * 101;
                        ajaxArguments = $.ajax.mostRecentCall.args[0];
                        ajaxArguments["success"](newPageResult);

                        expect(/page=101(&.*)?$/.test(ajaxArguments["url"])).toEqual(true);
                        expect($("#popin-pg-proximo").hasClass("off")).toEqual(false);
                        expect($("#popin-pg-anterior").hasClass("off")).toEqual(false);
                    });

                    describe("ao inserir um número de página maior do que o máximo,", function(){
                        beforeEach(function(){
                            var
                                pageInput = $("#popin-buscar-foto .paginacao input[type='text']"),
                                newPageResult = $.extend(true, {}, imageSearchReturn);
                            this.lastPage = Math.ceil(newPageResult.numFound / imageSearchReturn.photos.length);

                            pageInput.val(new String(this.lastPage + 1));
                            pageInput.change();

                            newPageResult.start = newPageResult.numFound - imageSearchReturn.photos.length;
                            this.ajaxArguments = $.ajax.mostRecentCall.args[0];
                            this.ajaxArguments["success"](newPageResult);
                        });

                        it("deve ser listada a última página de fotos", function(){
                            expect(new RegExp("page=" + this.lastPage + "(&.*)?$").test(this.ajaxArguments["url"])).toEqual(true);
                        });

                        it("o botão de ir para a próxima página deve ficar desabilitado", function(){
                            expect($("#popin-pg-proximo").hasClass("off")).toEqual(true);
                        });

                        it("o botão de ir para a página anterior deve ficar habilitado", function(){
                            expect($("#popin-pg-anterior").hasClass("off")).toEqual(false);
                        });

                        it("o campo de paginação deve apresentar o valor da ultima página", function(){
                            expect($("#popin-pg-atual").val()).toEqual(new String(this.lastPage));
                        });
                    });

                    it("ao inserir o número da última página, ir para a página, habilitar o anterior e desabilitar o próximo", function(){
                        var ajaxArguments,
                            pageInput = $("#popin-buscar-foto .paginacao input[type='text']"),
                            newPageResult = $.extend(true, {}, imageSearchReturn),
                            lastPage = Math.ceil(newPageResult.numFound / imageSearchReturn.photos.length);

                        newPageResult.start = newPageResult.numFound - imageSearchReturn.photos.length;
                        pageInput.val(newPageResult.start);
                        pageInput.change();

                        ajaxArguments = $.ajax.mostRecentCall.args[0];
                        ajaxArguments["success"](newPageResult);

                        expect(new RegExp("page=" + lastPage + "(&.*)?$").test(ajaxArguments["url"])).toEqual(true);
                        expect($("#popin-pg-proximo").hasClass("off")).toEqual(true);
                        expect($("#popin-pg-anterior").hasClass("off")).toEqual(false);
                    });

                    describe("quando estiver na última página", function(){
                        beforeEach(function(){
                            this.pageInput = $("#popin-pg-atual");
                            this.newPageResult = $.extend(true, {}, imageSearchReturn);

                            this.lastPage = Math.ceil(this.newPageResult.numFound / imageSearchReturn.pageSize);

                            this.newPageResult.start = this.lastPage;
                            this.pageInput.val("" + this.lastPage);
                            this.pageInput.change();

                            this.ajaxArguments = $.ajax.mostRecentCall.args[0];
                            this.ajaxArguments["success"](this.newPageResult);
                        });

                        it("a url requisitada pelo ajax para achamar a ultima página deve conter o número da ultima página", function(){
                            expect(new RegExp("page=" + this.lastPage + "(&.*)?$").test(this.ajaxArguments["url"])).toEqual(true);
                        });

                        it("a quantidade de páginas deve se manter a mesma", function(){
                            expect($("#popin-total-pg").html()).toEqual(new String(this.lastPage));
                        });

                        it("o botão de ir para a próxima página deve ficar desabilitado", function(){
                            expect($("#popin-pg-proximo").hasClass("off")).toEqual(true);
                        });

                        it("o botão de ir para a página anterior deve ficar habilitado", function(){
                            expect($("#popin-pg-anterior").hasClass("off")).toEqual(false);
                        });

                        describe("apertar no botão próximo", function(){
                            beforeEach(function(){
                                $("#popin-pq-proximo").click();
                            });

                            it("o valor do input de paginação deve se manter com o valor da última página", function(){
                                expect($("#popin-pg-atual").val()).toEqual(new String(this.lastPage));
                            });

                            it("não deve executar o ajax", function() {
                                expect($.ajax.callCount).toEqual(4);
                            });

                        });


                        describe("ao digitar o valor 0 no input da paginação", function(){
                            beforeEach(function(){
                                this.newPageResult.start = 0;
                                this.pageInput = $("#popin-pg-atual");
                                this.pageInput.val(0);

                                this.pageInput.change();

                                this.ajaxArguments = $.ajax.mostRecentCall.args[0];
                                this.ajaxArguments["success"](this.newPageResult);
                            });

                            it("a requisição ajax da paginação deve enviar o valor 1 (primeira página)", function(){
                                expect(/page=1(&.*)?$/.test(this.ajaxArguments["url"])).toEqual(true);
                            });

                            it("o botão de ir para próxima página deve ficar habilitado", function(){
                                expect($("#popin-pg-proximo").hasClass("off")).toEqual(false);
                            });

                            it("o botão de ir para a página anterior deve ficar desabilitado", function(){
                                expect($("#popin-pg-anterior").hasClass("off")).toEqual(true);
                            });
                        });

                        describe("ao digitar o valor -1 no input da paginação", function(){
                            beforeEach(function(){
                                this.newPageResult.start = 0;
                                this.pageInput = $("#popin-pg-atual");
                                this.pageInput.val("-1");

                                this.pageInput.change();

                                this.ajaxArguments = $.ajax.mostRecentCall.args[0];
                                this.ajaxArguments["success"](this.newPageResult);
                            });

                            it("a requisição ajax da paginação deve enviar o valor 1 (primeira página)", function(){
                                expect(/page=1(&.*)?$/.test(this.ajaxArguments["url"])).toEqual(true);
                            });

                            it("o botão de ir para próxima página deve ficar habilitado", function(){
                                expect($("#popin-pg-proximo").hasClass("off")).toEqual(false);
                            });

                            it("o botão de ir para a página anterior deve ficar desabilitado", function(){
                                expect($("#popin-pg-anterior").hasClass("off")).toEqual(true);
                            });
                        });

                        describe("ao digitar o valor não numérico no input da paginação", function(){
                            beforeEach(function(){
                                this.newPageResult.start = 0;
                                this.pageInput = $("#popin-pg-atual");
                                this.pageInput.val("b");

                                this.pageInput.change();

                                this.ajaxArguments = $.ajax.mostRecentCall.args[0];
                                this.ajaxArguments["success"](this.newPageResult);
                            });

                            it("a requisição ajax da paginação deve enviar o valor 1 (primeira página)", function(){
                                expect(/page=1(&.*)?$/.test(this.ajaxArguments["url"])).toEqual(true);
                            });

                            it("o botão de ir para próxima página deve ficar habilitado", function(){
                                expect($("#popin-pg-proximo").hasClass("off")).toEqual(false);
                            });

                            it("o botão de ir para a página anterior deve ficar desabilitado", function(){
                                expect($("#popin-pg-anterior").hasClass("off")).toEqual(true);
                            });
                        });

                    });
                });

                it("quando estiver na útima página, não poderá aparecer a opção de ir para a próxima página", function(){
                    var ajaxArguments,
                        containerImages = $(".cma-popin-conteudo"),
                        newPageResult = $.extend(true, {}, imageSearchReturn);


                    newPageResult.start = 0;
                    newPageResult.numFound = newPageResult.photos.length + 1;
                    ajaxArguments = $.ajax.mostRecentCall.args[0];
                    ajaxArguments["success"](newPageResult);

                    $("#popin-pg-proximo").click();

                    newPageResult.start = newPageResult.photos.length;
                    ajaxArguments = $.ajax.mostRecentCall.args[0];
                    expect(/page=2(&.*)?$/.test(ajaxArguments["url"])).toEqual(true);
                    ajaxArguments["success"](newPageResult);

                    expect($("#popin-pg-proximo").hasClass("off")).toEqual(true);
                    expect($("#popin-buscar-foto .paginacao input[type='text']").val()).toEqual("2");
                });
           });
           // validar que a primeira imagem da listagem de imagem é a foto atual que está sendo usada no box
        });
    });

    describe("Com o URLManager", function(){
        beforeEach(function(){
            this.urlManager = (new $.fn.popInFoto).URLManager;
        });

        it("a url de pesquisa deve estar correta", function(){
            expect(this.urlManager.urlBase).toEqual("/libby/aplicacoes/foto/busca/");
        });

        it("requisitar a montagem da url", function(){
            expect(this.urlManager.generate()).toEqual("/libby/aplicacoes/foto/busca/");
        });

        it("ao dar get em um parametro inexistente e enviar um parametro default o parametro default deve ser retornado", function(){
            expect(this.urlManager.get("notExists", 0)).toEqual(0);
        });

        it("ao dar get em um parametro inexistente, deve retornar undefined", function(){
            expect(this.urlManager.get("notExists")).toEqual(undefined);
        });

        describe("ao adicionar um parametro", function(){
            beforeEach(function(){
                this.urlManager.put("myparam", 3);
            });

            it("ao obter o parametro, o valor adicionado deve ser retornado", function(){
                expect(this.urlManager.get("myparam")).toEqual(3);
            });

            it("ao requisitar a montagem da url o novo parametro deve estar presente", function(){
                expect(this.urlManager.generate()).toEqual("/libby/aplicacoes/foto/busca/?myparam=3");
            });

            it("o metodo pop deverá retornar o valor do parametro que foi realizado pop", function(){
                expect(this.urlManager.pop("myparam")).toEqual(3);
            });

            it("ao dar get e enviar um valor default para um parametro existente", function(){
                expect(this.urlManager.get("myparam", 10)).toEqual(3);
            });

            describe("ao realizar pop em um parametro existente", function(){
                beforeEach(function(){
                    this.urlManager.pop("myparam");
                });

                it("quando gerar a url, não poderá conter o parametro que foi realizado pop", function(){
                    expect(this.urlManager.generate()).toEqual("/libby/aplicacoes/foto/busca/");
                });

            });


            describe("ao sobrescrever um parametro existente", function(){
                beforeEach(function(){
                    this.urlManager.put("myparam", "novo");
                });

                it("o novo valor deve estar na url de parametros", function(){
                    expect(this.urlManager.get("myparam")).toEqual("novo");
                });

                it("a url montada deve ser criada com o novo valor", function(){
                    expect(this.urlManager.generate()).toEqual("/libby/aplicacoes/foto/busca/?myparam=novo");
                });

            });

            describe("ao adicionar um novo parametro", function(){
                beforeEach(function(){
                    this.urlManager.put("page", 1);
                });

                it("ao requisitar a criação da url o novo parametro deve aparecer", function(){
                    expect(this.urlManager.generate()).toEqual("/libby/aplicacoes/foto/busca/?myparam=3&page=1");
                });

            });

            describe("ao adicionar um parametro com uma string com espaços ou contendo caracteres especiais", function(){
                beforeEach(function(){
                    this.urlManager.put("keyword", "está na praia");
                });

                it("o valor do parametro deve ser encodado", function(){
                    expect(this.urlManager.generate()).toEqual("/libby/aplicacoes/foto/busca/?myparam=3&keyword=est%C3%A1%20na%20praia");
                });

            });

            describe("ao realizar o reset", function(){
                beforeEach(function(){
                    this.urlManager.reset();
                });

                it("ao gerar a url, a url não poderá conter nenhum parametro", function(){
                    expect(this.urlManager.generate()).toEqual("/libby/aplicacoes/foto/busca/");
                });
            });
        });
    });
});
