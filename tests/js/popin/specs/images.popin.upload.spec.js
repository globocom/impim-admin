describe("images foto popin upload", function(){
    beforeEach(function(){
        this.container = $('<div>');
        this.element = $('<div>');
        this.element.fotoPopinUpload({container: this.container});
        this.widget = this.element.data('fotoPopinUpload');
    });

    describe('plugin instance creation', function(){
        it('contains a form', function(){
            expect(this.container).toContain('form');
        });

        it('contains a h3', function() {
            expect(this.container).toContain('h3');
        });

        it('contains a field', function() {
            expect(this.container).toContain('fieldset');
        });

        it('contains a input:text', function() {
            expect(this.container).toContain('input:text');
        });
    });

    describe('submit form', function(){
        beforeEach(function(){
            spyOn($.fn, 'ajaxSubmit');
        });

        it('add trigger', function(){
            var callback = jasmine.createSpy();

            this.element.bind('fotoPopinUploadSendUpload', callback);
            this.element.data('fotoPopinUpload')._sendForm();

            expect(callback).toHaveBeenCalled();
        });

        it('if form is valid', function(){
            var xhr = {
                responseText: '{"some":"thing"}'
            };
            var callback = jasmine.createSpy();

            this.element.bind('fotoPopinImageSelected', callback);
            this.element.data('fotoPopinUpload')._sendForm();

            $.fn.ajaxSubmit.mostRecentCall.args[0].complete(xhr);

            expect(callback).toHaveBeenCalled();
        });

        it('if form is invalid', function(){
            var container = this.container;
            var callback = jasmine.createSpy();
            var xhr = {
                responseText: '["image", "title", "credits"]'
            };

            this.element.bind('fotoPopinUploadErrorUpload', callback);
            this.element.data('fotoPopinUpload')._sendForm();

            $.fn.ajaxSubmit.mostRecentCall.args[0].complete(xhr);

            expect(callback).toHaveBeenCalled();

            $.each($.parseJSON(xhr.responseText), function(i, name){
                expect(container.find('[name="'+ name +'"]')).toHaveClass('error');
            });
        });

        it("if form has inputs with class 'error', and submission is successful, remove the class", function(){
            var container = this.container;
            var elements = '["image", "name", "credits"]';
            var elementsArray = $.parseJSON(elements);

            $.each(elementsArray, function(i, name){
                container.find('[name="'+ name +'"]').addClass('error');
            });

            this.element.data('fotoPopinUpload')._sendForm();
            $.fn.ajaxSubmit.mostRecentCall.args[0].beforeSubmit();

            $.each(elementsArray, function(i, name){
                expect(container.find('[name="'+ name +'"]')).not.toHaveClass('error');
            });
        });

        it("should reset the form after the form has been sent successfully", function(){
            var container = this.container;
            var data = {
                date: '1',
                width: 100,
                height: 200,
                credits: 'a',
                url: 'b',
                thumbUrl: 'v',
                title: 's',
                subject: 'g',
                eventDate: 'h'
            };
            var dataStr = JSON.stringify(data);
            var xhr = {
                responseText: dataStr
            };

            var inputs = container.find('form input');
            inputs.each(function(){
                $(this).val('1');
            });

            this.element.data('fotoPopinUpload')._sendForm();
            $.fn.ajaxSubmit.mostRecentCall.args[0].complete(xhr);

            inputs.each(function(){
                expect($(this).val()).toEqual('');
            });
        });
    });

    describe('closing form (called when closing the popin)', function() {
        beforeEach(function() {
            this.inputs = this.container.find('form input[type="text"]');
            this.inputs.each(function() {
                $(this).val('1').addClass('error');
            });
            this.widget.close();
        });

        it('it should reset the form inputs', function() {
            this.inputs.each(function() {
                expect($(this)).toHaveValue('');
            });
        });

        it('it should remove all the error classes from the inputs', function() {
            this.inputs.each(function() {
                expect($(this)).not.toHaveClass('error');
            });
        });
    });

});
