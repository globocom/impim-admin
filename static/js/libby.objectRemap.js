(function($){

    $.libby = $.libby || {};

    var remap = $.libby.objectRemap = function(obj, map){
        var mapped = {};
        $.each(map, function(from, to){
            remap.set(mapped, to, remap.get(obj, from));
        });
        return mapped;
    };

    $.extend($.libby.objectRemap, {
        get: function(obj, key){
            var path = key.split('.'), val = obj[path.shift()];
            for (var i = 0; i < path.length; i++){
                val = val[path[i]];
            }
            return val;
        },
        set: function(obj, key, val){
            var path = key.split('.');
            for (var i = 0; i < path.length - 1; i++){
                var pathKey = path[i];
                if (!(pathKey in obj) || !$.isPlainObject(obj[pathKey])){
                    obj[pathKey] = {};
                }
                obj = obj[pathKey];
            }
            obj[path[path.length - 1]] = val;
        }
    });

})(jQuery);
