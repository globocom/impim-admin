var waitsForSpy = function(spy, timeout, callCount){
    if (!callCount) callCount = 1;
    waitsFor(function(){
        return spy.callCount == callCount;
    }, timeout || 200);
    return {
        toBeCalledAndThen: function(callback){
            runs(callback);
        }
    };
};

var getResource = function(url){
    var resource;
    $.ajax({
        async: false,
        cache: false,
        url: url,
        success: function(html){
            resource = html;
        }
    });
    return resource;
};
