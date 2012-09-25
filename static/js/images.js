(function($) {
    $(function() {
        $('.popin').fotoPopin({
            urls: {
                search: 'http://localhost:8080/alpha/search',
                unsafeUrl: 'http://localhost:8888/unsafe'
            }
        });
        $('.images-popin').on('click', function() {
            $('.popin').fotoPopin('open');
        });
    });
})(jQuery);
