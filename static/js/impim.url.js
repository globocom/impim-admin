(function(window) {
    window.impim = window.impim || {};
    
    window.impim.url = {
        removeProtocol: function(url) {
            return url.replace('http://', '');
        }
    };
})(window);
