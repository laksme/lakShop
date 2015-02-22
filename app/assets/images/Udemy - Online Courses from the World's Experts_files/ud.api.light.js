'use strict';
var UD = typeof(UD) == "undefined" ? {} : UD;
UD.LIGHTAPI =  {
    version: 'api-1.1',
    apiHTTP: "https://" + document.domain +"/" ,

    getHeaders :function() {
        var headers = {};
        headers['X-Udemy-Snail-Case'] = true;

        if($.cookie('client_id'))
            headers['X-Udemy-Client-Id'] = $.cookie('client_id');

        if($.cookie('access_token'))
            headers['X-Udemy-Bearer-Token'] = $.cookie('access_token');
        else if($.cookie('client_secret'))
            headers['X-Udemy-Client-Secret'] = $.cookie('client_secret');

        return headers;
    },

    call:function(url, params){
        $.ajax($.extend({
            url: this.apiHTTP+this.version +  url,
            headers: this.getHeaders(),
            dataType: "json"
        }, params));
    },

    increment:function(key, tags, callback, errorCallback) {
        this.call('/stats/' + key + '/increment', {
            type: 'POST',
            data:{tags:tags},
            success: callback,
            error: errorCallback
        });
    },

    timing:function(key, time, callback, errorCallback) {
        this.call('/stats/' + key + '/timing', {
            type: 'POST',
            data: {time: time},
            success: callback,
            error: errorCallback
        });
    }
};
