var PROGRESS = (function($) {
    var progress = {};
    progress.apiUrl = null;
    progress.progressEvent = null;
    progress.completionEvent = null;

    function call(params) {
        return $.ajax($.extend({
            url: progress.apiUrl,
            headers: getHeaders(),
            dataType: "json",
            type: "POST"
        }, params));
    }

    function getHeaders() {
        var headers = {};
        headers['X-Udemy-Snail-Case'] = true;

        if($.cookie('client_id'))
            headers['X-Udemy-Client-Id'] = $.cookie('client_id');

        if($.cookie('access_token'))
            headers['X-Udemy-Bearer-Token'] = $.cookie('access_token');
        else if($.cookie('client_secret'))
            headers['X-Udemy-Client-Secret'] = $.cookie('client_secret');

        return headers;
    }

    progress.send = function(event, data) {
        if(!progress.apiUrl) {
            console.log("api url is not set");
            return;
        }
        call({
            data: {
                'data': window.btoa(JSON.stringify(data))
            },
            success: function(response) {
                if(response.is_completed) {
                    parent && parent.$.event.trigger(progress.completionEvent);
                }
            }
        })
    };

    progress.setCompletionEvent = function(event) {
        progress.completionEvent = event;
    };

    progress.setProgressEvent = function(event) {
        progress.progressEvent = event;
        $(window).on(progress.progressEvent, progress.send);
    };


    return progress;
}(jQuery));
