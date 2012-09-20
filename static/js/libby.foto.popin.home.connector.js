(function($) {

    // desabilitar o popin atual
    var cmaArea = $('.cma-area');
    var key = '.cma-highlight-editing .cma-highlight-photo';
    cmaArea.undelegate(key, 'click');
    $(function() {
        cmaArea.undelegate(key, 'click');
    });


    var cmaEventName = 'cma.photo.popin.imagensEscolhidas',
        doc = $(document),
        element = $('<div>'),
        macroarea = $('.cma-macroarea'),
        fotoPopinOptions;

    var focusNextFormElement = function(highlightPhoto) {
        var container = highlightPhoto.parents('.cma-highlight').first(),
            highlightPhotoAndFormInputs = container.find('.cma-highlight-photo, input, textarea'),
            highlightPhotoIndex = highlightPhotoAndFormInputs.index(highlightPhoto),
            nextFormElements = highlightPhotoAndFormInputs.slice(highlightPhotoIndex + 1);
        nextFormElements.filter('input, textarea').first().focus().select();
    };

    element.bind('fotoPopinImageApplied', function(e, imageData) {
        var image = macroarea.find('.foto-destino');

        // Prepara dados para enviar para o CMA
        var newData = $.extend({}, imageData, {
            original_url: imageData.url,
            creditos: imageData.credits,
            url: imageData.croppedUrl
        });

        if ($.sub && $.sub.publish) {
            // publica dados para o CMA
            $.sub.publish(cmaEventName, [newData]);
        } else {
            // mantém compatibilidade se não tiver no CMA
            image.attr('src', newData.url);
        }

        focusNextFormElement(image);
        doc.trigger('popinImageApplied', [newData]);
    });
    element.bind('fotoPopinClose', function() {
        macroarea.find('.foto-destino').removeClass('foto-destino');
    });

    if (SETTINGS.THUMBOR_UNSAFE_SERVER) {
        fotoPopinOptions = {
            urls: {
                unsafeUrl: SETTINGS.THUMBOR_UNSAFE_SERVER
            }
        };
    }
    element.fotoPopin(fotoPopinOptions);


    macroarea.delegate(key, 'click', function(e) {
        var image = $(this);

        // para o CMA saber onde colocar a foto ele precisa desta classe no local de destino
        image.addClass("foto-destino");

        if (image.attr('src')) {
            var data = image.attr('data');
            data = $.parseJSON(data.replace(/\b([^:\s]+?):\s/g, '"$1":').replace(/'([^']*)'/g, '"$1"'));
            element.fotoPopin('setCurrentPicture', data.identifier);
        }

        var recommendedSizes = eval(image.attr('data-recommended-sizes')) || [{
            width: image.width(),
            height: image.height()
        }];

        element.fotoPopin('option', 'recommendedSizes', recommendedSizes).
            fotoPopin('open').
            trigger('fotoHighlightSelected', this);
    });

}(jQuery));
