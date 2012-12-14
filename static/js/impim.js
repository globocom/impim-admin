requirejs.config({
    paths: {
        'jquery': 'http://sawpf.com/libs/jquery/1.8.0',
        'jqueryui': 'http://sawpf.com/libs/jqueryui/1.8.23'
    },
    shim: {
        'jqueryui': ['jquery'],
        'libby.objectRemap': ['jquery'],
        'libby.widgetBase': ['jquery']
    }
});

require(['jquery', 'impim.config', 'images.popin'], function($, config) {
    var _init = function() {
        _appendImagesPopin();
        _createPopin();
        _bindEvents();
    };
    
    var _appendImagesPopin = function() {
        if ($('.images-popin').length === 0) {
            $('body').append('<div class="images-popin"></div>');
        }
    };
    
    var _createPopin = function() {
        $('.images-popin').fotoPopin({
            urls: {
                search: config.imagesUrl + '.js',
                upload: config.imagesUrl,
                generateUrl: config.thumborUrlsUrl,
                unsafeUrl: config.thumborUnsafeUrl
            }
        });
    };
    
    var _bindEvents = function() {
        $('.images-popin').unbind('fotoPopinImageApplied').bind('fotoPopinImageApplied', function(event, data) {
            $('img.images-popin-target').attr('src', data.croppedUrl);
            $('input.images-popin-target').val(data.croppedUrl);
            $('.images-popin-target').attr('data-images-popin-cropped-url', data.croppedUrl);
        });
        
        $('.images-popin-click-open').bind('click', function() {
            $('.images-popin').fotoPopin('open');
        });
    };
    
    $(function() {
        _init();
    });
});
