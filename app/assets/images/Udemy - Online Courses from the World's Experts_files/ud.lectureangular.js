define(["jquery-widget-init", "handlebars.helpers", "ud-link", "ud.raven", "jquery.json",
    "easyXDM", "ud.api", "ud.api.v2"
], function($, Handlebars, udLink, Raven) {
    "use strict";

    $.widget("ud.ud_lectureangular", {
        options: {
            lectureId: null,
            autoLoad: true,
            courseId: null,
            instructorPreviewMode: null,
            loadParams: {
                // By default, autoPlay is determined by user setting, but you can specify
                // autoPlay: 0/1 here if you want to control the setting yourself.
                videoOnly: 0 // if 1, only the video will be rendered for VideoMashups
            }
        },
        type: null,
        startPosition: null,
        position: null,
        total: null,
        lectureCompletedTimeout: null,
        lectureTrackTimeout: null,
        lectureTrackPause: false,
        windowProxy: null,
        autoPlay: true,
        _create: function() {
            for (var i in this.options) {
                if(typeof(this.element.data(i.toLowerCase())) != 'undefined'){
                    this.options[i] = this.element.data(i.toLowerCase());
                }
            }
            this._initHandlebarsTemplates();

            if(this.options.autoLoad){
                this.load();
            }

            $(window).on('lectureDownloaded_' + this.options.lectureId, this.lectureDownloadHandler.context(this));
            $(window).on('lectureProgress_' + this.options.lectureId, this.lectureProgressHandler.context(this));
            $(window).on('lectureCompleted_' + this.options.lectureId, this.lectureCompletedHandler.context(this));
            $(window).on('lecturecontentready_' + this.options.lectureId, this._contentReady.context(this));
            $(window).on('lectureautoloadnext_' + this.options.lectureId, this.autoLoadNextLecture.context(this));
        },
        _initHandlebarsTemplates: function() {
            this.installFlashPlayerTemplate = Handlebars.compile($("#installFlashPlayerTemplate").html());
        },
        lectureDownloadHandler: function(event, data) {
            UD.API.call('/lectures/' + this.options.lectureId + '/downloaded', {
                type: "POST",
                async: false,
                success: function(response) {
                    if(response.is_completed){
                        // notify ud.dashboard widget here about this completed lecture so that it updates progress
                        $.event.trigger('lectureProgressCompleted', [this.options.lectureId]);
                    }
                }.context(this)
            });
        },
        // data have to contain position and total
        // eq: data = {'position' :3, 'total': 5}
        lectureProgressHandler: function(event, data) {
            if(data && data.position && data.total && data.position > 0){
                UD.API.call('/lectures/' + this.options.lectureId + '/progress', {
                    type: "POST",
                    data: {'data': window.btoa(JSON.stringify(data))},
                    success: function(response) {
                        if(response.is_completed){
                            // notify ud.dashboard widget here about this completed lecture so that it updates progress
                            $.event.trigger('lectureProgressCompleted', [this.options.lectureId]);
                        }
                    }.context(this)
                });
            }
        },
        lectureCompletedHandler: function(event, data) {
            // notify ud.dashboard widget here about this completed lecture so that it updates progress
            $.event.trigger('lectureProgressCompleted', [this.options.lectureId]);
        },
        sendProgressData: function() {
            this.element.trigger('lectureProgress_' + this.options.lectureId, {'position': 1, 'total': 1, 'context': {'type': this.type}});
        },
        unload: function() {
            if(this.windowProxy){
                this.windowProxy.destroy();
                this.windowProxy = null;
            }
            $(window).off('hashchange.' + this.options.lectureId);
            this.element.unbind();
            this.element.empty();
            clearTimeout(this.lectureCompletedTimeout);
        },
        load: function(callback) {
            $(window).on('hashchange.' + this.options.lectureId, $.proxy(this._hashChangeHandler, this));
            this._getAnalyticsTrackingCode();

            var getParams = this.options.loadParams;
            if(this.options.instructorPreviewMode){
                getParams.instructorPreviewMode = this.options.instructorPreviewMode;
            }

            if(this._isFlashPlayerDisabledForFirefox()){
                this.element.html(this.installFlashPlayerTemplate());
                return;
            }
            UD.API.call('/lectures/' + this.options.lectureId + '/content', {
                data: getParams,
                success: function(response) {
                    if(response && response.type){
                        this.type = response.type;
                        var assetHtml = $(response.html);
                        if(this.type != "ImportContent" && assetHtml.get(0).tagName == 'IFRAME'){
                            this._setupWindowProxy(assetHtml);
                            if(!response.isPreRoll){
                                this.markAsViewed();
                                this.setPositionHandler();
                            }
                            callback && callback(response);
                        } else {
                            this.element.html(response.html);
                            this.element.ud_initialize({
                                onComplete: function() {
                                    if(!response.isPreRoll){
                                        this.markAsViewed();
                                        this.setPositionHandler();
                                    }
                                    callback && callback(response);
                                }.context(this)
                            });
                        }
                    }
                }.context(this),
                error: function(response) {
                    if(response.status === 405){
                        var buyNowPopupUrl = udLink.to('course', 'buynow-popup', {courseId: this.options.courseId});
                        var html = '<a class="ud-popup" id="buynow-popup" data-autoopen="true" data-closeBtn="false" data-modal="true" href="' + buyNowPopupUrl + '" style="display: none;"></a>';
                        $('body').append(html);
                        $("#buynow-popup").ud_popup();
                    } else {
                        Raven.captureMessage('Api error for GET /lectures/{id}/content', { extra: response });
                        window.alert("Unable to load content.");
                    }
                }.context(this)
            });

        },
        markAsViewed: function() {
            UD.API_V2.call('/users/me/subscribed-courses/' + this.options.courseId +
                    '/lectures/' + this.options.lectureId + '/view-logs',
                { type: "POST" }
            );
        },
        setPositionHandler: function() {
            switch (this.type) {
                case "VideoMashup":
                case "Video":
                case "Audio":
                    this.total = 0;
                    this.position = 0;
                    this.element.off('positionHandler_' + this.options.lectureId);
                    this.element.on('positionHandler_' + this.options.lectureId, function(event, data) {
                        this.total = data.total;
                        this.position = data.position;
                    }.context(this));
                    break;
                case 'Article':
                case 'File':
                case 'Image':
                case 'ImportContent':
                case 'RecordedSession':
                case 'IFrame':
                case 'SCORM':
                    this.lectureCompletedTimeout = setTimeout(function() {
                        this.sendProgressData.call(this);
                    }.context(this), 10000);
                    break;
                case 'EBook':
                case 'Presentation':
                    this.element.on('positionHandler_' + this.options.lectureId, function(event, data) {
                        this.total = data.total;
                        this.position = data.position;
                    }.context(this));
                    break;
            }
        },
        getPosition: function() {
            return this.position;
        },
        getTotal: function() {
            return this.total;
        },
        renderPosition: function(position) {
            switch (this.type) {
                case "Video":
                case "VideoMashup":
                case "Audio":
                    return this._renderTime(position);
                    break;
                case 'EBook':
                case 'Presentation':
                    return this._renderPage(position);
                default:
                    return null;
            }
        },
        _renderTime: function(seconds) {
            if(seconds >= 0){
                seconds = Math.round(seconds);
                var twoDigit = function(n) {
                    return n < 10 ? "0" + n : n;
                };
                var blocks;
                for (blocks = []; seconds > 60; seconds = Math.floor(seconds / 60)) {
                    blocks.push(twoDigit(seconds % 60));
                }
                blocks.push(twoDigit(seconds));
                if(blocks.length < 2) blocks.push("00");
                return blocks.reverse().join(":");
            } else {
                return "";
            }
        },
        _renderPage: function(pageNumber) {
            if(pageNumber >= 0){
                return 'Page ' + pageNumber;
            } else {
                return "";
            }
        },
        _contentReady: function(event, data) {
            this.loadWindowOnBeforeUnload();
            $(window).off('gotoposition_' + this.options.lectureId);
            $(window).on('gotoposition_' + this.options.lectureId, $.proxy(this.gotoPosition, this));
            this._hashChangeHandler();
        },
        /**
         * data should be json object
         *  required attr:
         *      int position
         *  optional:
         *      bool autostart
         * @param data
         */
        gotoPosition: function(event, data) {
            if(this.windowProxy){
                var message = {event: 'gotoposition_' + this.options.lectureId, data: data};
                this.windowProxy.postMessage($.toJSON(message));
            }
        },
        _onBeforeUnload: function() {
            var maxLastPosition;
            var lastPosition = parseInt(this.position);
            if(!lastPosition)
                return;

            switch (this.type) {
                case "Video":
                case "Audio":
                case "VideoMashup":
                    maxLastPosition = this.total * .95;
                    break;
                default:
                    maxLastPosition = this.total;
            }

            if(lastPosition > maxLastPosition){
                lastPosition = 0;
            }

            UD.API.call('/lectures/' + this.options.lectureId + '/last-position', {
                type: "POST",
                data: {position: lastPosition}
            });

            // notify ud.dashboard widget here since this lecture's last position is changed so that it can make update in its internal state
            $.event.trigger('lectureLastPositionChanged', [this.options.lectureId, lastPosition]);
        },
        autoLoadNextLecture: function() {
            // notify ud.dashboard widget here about it knows that this lecture is finished
            $.event.trigger('lectureCompleted', [this.options.lectureId]);
        },
        loadWindowOnBeforeUnload: function(message) {
            $(window).off('beforeunload.' + this.options.lectureId);
            $(window).on('beforeunload.' + this.options.lectureId, function() {
                this._onBeforeUnload();
            }.context(this));
        },
        _getAnalyticsTrackingCode: function() {
            UD.API.call('/lectures/' + this.options.lectureId + '/tracking-code', {
                success: function(response) {
                    this.element.append(response.code);
                }.context(this)
            });
        },
        _setupWindowProxy: function(iframeHtml) {
            this.windowProxy = new easyXDM.Socket({
                remote: iframeHtml.attr('src'),
                container: this.element.get(0),
                onReady: function() {
                    var attributes = iframeHtml.prop('attributes');
                    var iframe = this.element.find('iframe').eq(0);
                    $.each(attributes, function() {
                        if(this.name != "src"){
                            iframe.attr(this.name, this.value);
                        }
                    });
                }.context(this),
                onMessage: function(message, origin) {
                    var data = $.evalJSON(message);
                    this.element.trigger(data.event, data.data);
                }.context(this)
            });
        },
        _hashChangeHandler: function() {
            var url = window.location.hash;
            var urlRegex = "^#\/?((quiz|lecture|chapter|certificate)/([0-9]+)(:([0-9]+))?)?";
            var match = url.match(urlRegex);
            var startPosition = null;

            if(typeof match[5] === "undefined"){
                return;
            }

            $.event.trigger('gotoposition_' + this.options.lectureId, {position: match[5], autostart: true});
        },
        _isFlashPlayerDisabledForFirefox: function() {
            return typeof $.browser.mozilla !== "undefined" && typeof navigator.plugins['Shockwave Flash'] === 'undefined';
        }
    });
});
