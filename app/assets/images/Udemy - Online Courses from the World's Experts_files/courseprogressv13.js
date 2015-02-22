(function($) {
    var plugin = function(player, config, div) {
        var duration = 0; // in seconds
        var position = -1; // in seconds
        var lastPosition = -1; // in seconds
        var api = player;
        var progressHandler = '';
        var interval = 15;

        function init(event) {
            /**
             * When the player is playing, fired as the playback position gets updated.
             * This happens with a resolution of 0.1 second, so there's a lot of events! Event attributes:
             *      duration: Number: Duration of the current item in seconds.
             *      offset: Number: When playing streaming media, this value contains the last unbuffered seek offset.
             *      position: Number: Playback position in seconds.
             */
            api.onTime(track);
            api.onComplete(completeHandler);

            progressHandler = config.progresshandler;
            duration = config.duration;

            div.style.display = 'none';
        }

        function completeHandler(event) {
            send(Math.floor(duration), event);
        }

        function track(event) {
            //sometimes event.duration is calculated wrong. wrong values(undefined, -1, 0, 1)
            // so check it

            if(duration > 1) {
                position = Math.floor(event.position / interval);

                var mod = Math.floor(event.position) % interval;
                if(mod) {
                    position += 1;
                }

                if((lastPosition == position) || (position <= 0)) {
                    return;
                }

                lastPosition = position;

                var time = position * interval;
                if(time > duration) {
                    time = duration;
                }

                send(time, event);
            } else {
                duration = api.getDuration();
            }
        }

        function send(time, event) {
            $.event.trigger(progressHandler, {'total': Math.floor(duration), 'position': time, 'context': event});
        }

        api.onReady(init);

        this.resize = function(width, height) { };
    };

    jwplayer().registerPlugin('courseprogressv13', '6.0', plugin);
})(jQuery);
