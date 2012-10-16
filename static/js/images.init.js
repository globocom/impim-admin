(function(window, $) {
    window.images = window.images || {};
    window.impim = window.impim || {config: {
        images_url: 'http://localhost:8080/alpha/images.js',
        thumbor_urls_url: 'http://localhost:8080/thumbor_urls'
    }};
    
    window.images.init = function() {
        _appendImagesPopin();
        _createPopin();
        _bindEvents();
    };
    
    var _appendImagesPopin = function() {
        if ($('.images-popin').length === 0) {
            $('body').append('<div class="images-popin"></div>');
        }
    };
    
    _createPopin = function() {
        $('.images-popin').fotoPopin({
            urls: {
                search: window.impim.config.images_url,
                generateUrl: window.impim.config.thumbor_urls_url,
                unsafeUrl: 'http://localhost:8888/unsafe'
            }
        });
    };
    
    _bindEvents = function() {
        $('.images-popin').unbind('fotoPopinImageApplied').bind('fotoPopinImageApplied', function(event, data) {
            $('img.images-popin-target').attr('src', data.croppedUrl);
            $('input.images-popin-target').val(data.croppedUrl);
            $('.images-popin-target').attr('data-images-popin-cropped-url', data.croppedUrl);
        });
        
        $('.images-popin-click-open').bind('click', function() {
            $('.images-popin').fotoPopin('open');
        });
    };
})(window, jQuery);
