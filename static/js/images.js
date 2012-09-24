$(function() {
    $('.popin').fotoPopin();
    $('input[type=button]').on('click', function() {
        $('.popin').fotoPopin('open');
    });
});
