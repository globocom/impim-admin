(function($) {
    $(function() {
        $('.popin').fotoPopin();
        $('.images-popin').on('click', function() {
            $('.popin').fotoPopin('open');
        });
    });
})(jQuery);
