(function(window, $) {
    window.images = window.images || {};
    
    window.images.init = function() {
        _appendImagesPopin();
        
        $('.images-popin').fotoPopin({
            urls: {
                search: 'http://localhost:8080/alpha/search',
                generateUrl: 'http://localhost:8080/thumbor_urls',
                unsafeUrl: 'http://localhost:8888/unsafe'
            }
        });
        
        $('.images-popin').unbind('fotoPopinImageApplied').bind('fotoPopinImageApplied', function(event, data) {
            $('.images-popin-target').attr('src', data.croppedUrl);
        });
        
        $('.images-popin-click-open').bind('click', function() {
            $('.images-popin').fotoPopin('open');
        });
    };
    
    var _appendImagesPopin = function() {
        if ($('.images-popin').length === 0) {
            $('body').append('<div class="images-popin"></div>');
        }
    };
    
    $(function() {
        images.init();
    });
})(window, jQuery);
