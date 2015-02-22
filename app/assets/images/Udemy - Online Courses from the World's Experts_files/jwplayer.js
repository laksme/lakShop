(function($) {
    $.fn.jwplayer = function(options) {
        this.api = null;
        var startTime = 0;
        var isStarted = false;
        var startPosition = null;
        var id = this.attr("id");
        var errorLogData = null;
        var key = "5XXb+w0txH2+cnkwOtAOWXU39zFQbZ6VT9mOA6R83tk=";
        var totalWatchedVideoNumber = 0;
        var errorCount = 0;
        var ERROR_LOADING_MEDIA = "Error loading media";
        var captioningSettingValue;
        var ENABLED_CAPTIONING_USER_SETTING = "on";
        var connectionLost = false;
        var settings = $.extend({
            width: "100%",
            height: "100%",
            primary: "flash",
            events: {
                onReady: $.proxy(readyHandler, this),
                onFullscreen: fullscreenHandler,
                onComplete: completeHandler,
                onTime: timeHandler,
                onPlay: $.proxy(playHandler, this),
                onBuffer: $.proxy(onPlayerBuffer,this),
                onError: $.proxy(errorHandler,this),
                onCaptionsChange : $.proxy(captionsChangeHandler,this),
                onQualityChange : $.proxy(qualityChangeHandler,this)
            }
        }, options);
        this.cdn = this.data("cdn");
        if(typeof(settings.plugins) != "undefined" && settings.plugins.length === 0) {
            delete settings.plugins;
        }
        captioningSettingValue = this.data("captioning-setting");
        //handle flash player installation and html5 user setting and check for mashup
        var isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;

        if(this.data('mode') == "mashup") {
            settings.primary = "flash";
            this.api = jwplayer(id).setup(settings);
        } else {
            if(settings.primary == "html5"){
                jwplayer.key = key;
                this.api = jwplayer(id).setup(settings);
            }else{
                var flashPlayerVersion = swfobject.getFlashPlayerVersion();
                if(isFirefox){
                    settings.primary = "html5"; // force firefox to use html5 
                    jwplayer.key = key;
                    this.api = jwplayer(id).setup(settings);
                }
                else if(flashPlayerVersion.major >0){//if the flash player is installed, use it
                    settings.primary = "flash";
                    jwplayer.key = key;
                    this.api = jwplayer(id).setup(settings);
                }else{
                    settings.primary = "html5"; // push other browsers to use html5 player
                    jwplayer.key = key;
                    this.api = jwplayer(id).setup(settings);
                }
            }

            $("#switch-to-html").click(function(){
                settings.primary = "html5";
                jwplayer.key = key;
                this.api = jwplayer(id).setup(settings);
                $("#html").css("visibility","hidden");
            });
            $("#try-again").click(function(){
                settings.primary = "html5";
                jwplayer().play();
                $("#connection").css("visibility","hidden");
                $("#player_wrapper").css("visibility","visible");
            });
            $("#download-video").click(function(){
               UD.LIGHTAPI.increment("videoplayer." + jwplayer().getRenderingMode()  +"."+this.cdn + ".downloaded");
            }.bind(this));

        }

        this.seek = function(event, data) {
            if(!isStarted && (!parseInt(settings.autostart) || this.data('mode') == "mashup")) {
                startPosition = data.position;
                return;
            }

            this.api.seek(data.position);
        };

        function readyHandler() {
            if(options.lid) {
                $(window).on('gotoposition_' + options.lid, $.proxy(this.seek, this));
                $.event.trigger('lecturecontentready_' + options.lid);
            }
            document.getElementById(id).oncontextmenu = function() {
                return false;
            };
            UD.LIGHTAPI.increment("videoplayer." + this.api.getRenderingMode() +"."+this.cdn + ".viewed",{"errorCount":errorCount});
        }

        function timeHandler(event) {
            if(options.positionHandler) {
                $.event.trigger(options.positionHandler, {total: event.duration, position: event.position});
            }
        }

        function completeHandler() {
            if(options.autoLoadEvent) {
                setTimeout(function() {
                    parent && parent.$.event.trigger(options.autoLoadEvent);
                }, 1000);
            }
        }

        function fullscreenHandler() {
            setTimeout(function() {
                jwplayer && jwplayer(id).resize("100%", "100%");
            }, 100)
        }

        function playHandler() {
            if (!isStarted) {
                $("#spinArea").css("visibility","hidden");
                $("#player_wrapper").css("visibility","visible");
                var elapsedTime = Date.now() - startTime;
                // Anything over 60 seconds is not acceptable,
                // so cut it for better graphing
                if (elapsedTime > 60 * 1000) {
                    elapsedTime = 60 * 1000;
                }
                UD.LIGHTAPI.timing("videoplayer." + this.api.getRenderingMode() +"."+this.cdn+ ".start_time",elapsedTime);
            }
            if(startPosition) {
                this.api.seek(startPosition);
                startPosition = null;
            }
            isStarted = true;
        }

        function errorHandler(e){
            if(!checkTheConnection.bind(this)()){
                errorCount++;
                checkMediaLoadError.bind(this,e)();
            }
            // increase the count of errors
            if(settings.playlist[0].sources.length == 2 ){
                var tagData = {tags:{video_sd_url:settings.playlist[0].sources[1].file,video_hd_url:settings.playlist[0].sources[0].file,errorCount:errorCount}};
            }else{
                var tagData = {tags:{video_sd_url:settings.playlist[0].sources[0].file,errorCount:errorCount}};
            }
            // collect the data for logging
            tagData.tags.cdn = this.cdn;
            if(errorCount>=5){
                Raven.captureMessage(e.message, tagData);
            }
            var lectureId = settings.autoLoadEvent.split("_")[1];
            errorLogData = {
                errorMessage: e.message,
                settings: $.extend(settings, {"renderingMode": jwplayer().getRenderingMode(), "flashVersion": swfobject.getFlashPlayerVersion()}),
                currentVideoPosition: this.api.getPosition(),
                totalVideoDuration: this.api.getDuration(),
                totalWatchedVideo: totalWatchedVideoNumber,
                browser: navigator.userAgent,
                os: navigator.platform,
                lectureId:lectureId,
                cdn:this.cdn
            };
            if(errorLogData.settings.renderingMode == "html5") {
                errorLogData.videoUrl = this.api.getPlaylistItem().sources[this.api.getCurrentQuality()].file;
            } else {
                errorLogData.videoUrl = this.api.getPlaylistItem().file;
            }
            //check the connections
            if(!connectionLost){
                makeApiCalls();
            }
        }

        function checkMediaLoadError(e){
            if(e.message.indexOf(ERROR_LOADING_MEDIA) > -1){
                if(errorCount > 4 ){
                    showDownloadOption();
                }else{
                    setTimeout(retryToLoadVideo.bind(this), 500 * (errorCount*errorCount) );
                }
            }
        }

        function checkTheConnection(){
            var a=navigator.onLine;
            if(!a){
                $("#player_wrapper").css("visibility","hidden");
                $("#connection").css("visibility","visible");
                connectionLost = true;
                return true;
            }
            return false;
        }


        function retryToLoadVideo(){
            $("#spinArea").css("visibility","visible");
            $("#player_wrapper").css("visibility","hidden");
            this.api.play();
        }

        function showDownloadOption(){
            $("#download").css("visibility","visible");
            $("#spinArea").css("visibility","hidden");
        }

        function captionsChangeHandler(e){
            if(e.track && captioningSettingValue != "on"){
                UD.LIGHTAPI.call("/users/me/settings", {
                    data:{settings:{"closed-captioning-enabled":ENABLED_CAPTIONING_USER_SETTING}},
                    type: "POST"
                });
            }
        }

        function qualityChangeHandler(e){
            UD.LIGHTAPI.increment("videoplayer.quality_change", {"quality": e.currentQuality} );
        }

        function makeApiCalls(){
            //as the stringfication couldn't be made when events and fallbackDiv are in object, we need to remove them
            delete errorLogData.settings.events;
            delete errorLogData.settings.fallbackDiv;
            UD.LIGHTAPI.call("/jserrors/jwplayer-error", {
                data: errorLogData,
                type: "POST"
            });
            UD.LIGHTAPI.increment("videoplayer." + errorLogData.settings.renderingMode +"."+errorLogData.cdn+".error",{"errorCount":errorCount} );
        }

        function onPlayerBuffer(e) {
            if (!isStarted) {
                startTime = Date.now();
            }
            if(e.oldstate == "IDLE") {
                totalWatchedVideoNumber++;
            }
        }
    }
}(jQuery));
