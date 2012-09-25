(function($) {
    $(function() {
        $('.popin').fotoPopin({
            urls: {
                search: 'http://localhost:8080/alpha/search',
                generateUrl: 'http://localhost:8080/thumbor_urls',
                unsafeUrl: 'http://localhost:8888/unsafe'
            }
        });
        
        $('.popin').unbind('fotoPopinImageApplied').bind('fotoPopinImageApplied', function(event, data) {
            $('.img-container').html('<img src="' + data.croppedUrl + '" />');
        });
        
        $('.images-popin').on('click', function() {
            $('.popin').fotoPopin('open');
        });
    });
})(jQuery);
