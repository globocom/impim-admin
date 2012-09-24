(function($){
    /*
    * To use: $(container).fotoPopinUpload(options);
    * To activate: $(container).fotoPopinUpload('activate');
    * To deactivate: $(container).fotoPopinUpload('deactivate');
    */
    $.widget('images.fotoPopinUpload', $.libby.widgetBase, {
        options: {
            container: null,
            uploadUrl: '/libby/aplicacoes/foto/upload/',
            datepicker: {
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
            }
        },
        _create: function(){
            this._super('_create');

            this._createElements();
            this._bindEvents();
        },
        _bindEvents: function(){
            this._bind('fotoPopinRegister', this._sendForm);
        },
        _createElements: function(){
            var containerClass = this._classFor('container');
            var idEventDate = this._classFor('event-date');
            var idAddTags = this._classFor('add-tags');
            var idCredits = this._classFor('credits');
            var idTitle = this._classFor('title');
            var idImageUpload = this._classFor('image-upload');

            this.elements.container = $('<div class="' + containerClass + '"></div>');

            var html = [
                '<form action="', this.options.uploadUrl, '" method="post">',
                    '<h3>Cadastrar imagem</h3>',
                    '<fieldset>',
                        '<legend>Cadastrar imagem</legend>',
                        '<ul>',
                            '<li class="', idImageUpload, '">',
                                '<label class="required" for="', idImageUpload, '">Selecionar imagem</label>',
                                '<input type="file" name="image" id="', idImageUpload, '" accept="image/jpeg,image/jpg,image/gif,image/png" size="67" required="required"/>',
                                '<p>Os formatos de imagem aceitos são JPEG, JPG, GIF e PNG.</p>',
                            '</li>',
                            '<li>',
                                '<label class="required" for="', idTitle, '">Nome</label>',
                                '<input type="text" name="name" id="', idTitle, '" required="required"/>',
                            '</li>',
                            '<li>',
                                '<label class="required" for="', idCredits, '">Créditos</label>',
                                '<input type="text" name="credits" id="', idCredits, '" required="required"/>',
                            '</li>',
                            '<li>',
                                '<label class="required" for="', idAddTags, '">Tags</label>',
                                '<input class="', idAddTags, '" type="text" name="tags" id="', idAddTags, '" required="required"/>',
                                '<p>Para adicionar mais de uma tag separe-as por vírgula.</p>',
                            '</li>',
                            '<li>',
                                '<label for="', idEventDate, '">Data da imagem</label>',
                                '<input class="', idEventDate, '" type="text" name="image_date" id="', idEventDate, '"/>',
                            '</li>',
                        '</ul>',
                    '</fieldset>',
                '</form>'
            ];

            this.elements.container.html(html.join(''));
            this.elements.container.find('.'+ idEventDate).datepicker(this.options.datepicker);
            this.elements.form = this.elements.container.find('form');
            this.options.container.append(this.elements.container);
        },

        _sendForm: function(event){
            var self = this;
            var form = this.elements.form;
            this.element.trigger('fotoPopinUploadSendUpload');

            self.elements.form.ajaxSubmit({
                beforeSubmit: function(){
                    form.find('.error').removeClass('error');
                },
                complete: function(xhrObj){
                    // infelizmente nao eh possivel usar os eventos de sucesso e erro
                    // porque esse form eh enviado usando um hidden iframe e nao eh
                    // possivel pegar o statuscode da response do iframe
                    var response = $.parseJSON($('<div>').html(xhrObj.responseText).text());
                    if ($.isArray(response)){
                        self.element.trigger('fotoPopinUploadErrorUpload', [response]);
                        $.each(response, function(index, value){
                            form.find('[name="'+ value +'"]').addClass('error');
                        });
                    } else {
                        var data = {
                            id: response.id,
                            date: response.created,
                            width: response.width,
                            height: response.height,
                            credits: response.credits,
                            url: response.url,
                            thumbUrl: response.thumbUrl,
                            title: response.subject,
                            subject: response.subject,
                            eventDate: response.eventDate
                        };
                        form.get(0).reset();
                        self.element.trigger('fotoPopinImageSelected', [data]);
                    }
                }
            });
        },

        _resetForm: function() {
            this.elements.form.find('.error').removeClass('error');
            this.elements.form.get(0).reset();
        },

        close: function() {
            this._resetForm();
        }
    });

}(jQuery));

