(function(){
    var pluginName = "changeplaybackrate";
    var plugin = function(player, config, div) {
        var video = {};
        var newSpeed = 1;
        var speeds = [{label:'2x', speed:2.00}, {label:'1.5x', speed:1.50}, {label:'1.25x', speed:1.25}, {label:'1x', speed:1.00}, {label:'0.5x', speed:0.50}];
        var currentSpeedIndex;


        function clickHandler() {
        	if(--currentSpeedIndex === -1) {
        		currentSpeedIndex = speeds.length - 1;
        	}

            setSpeed(speeds[currentSpeedIndex].speed);
        }

        function init(evt) {
            if(player.getRenderingMode() != 'html5') {
                return;
            }

            for(var index in speeds) {
                if(getCookie("playbackspeed") == speeds[index].speed) {
                    currentSpeedIndex = index;
                    newSpeed = speeds[index].speed;

                    break;
                }
            }

            video = player.container.getElementsByTagName('video')[0];

            player.onPlay(setSpeed);

        }

        function setSpeed(speed) {
            if(typeof(speed) != 'object')  {
            	newSpeed = speed;
            }

            var speedInArray = false;
            for(var index in speeds) {
                if(speeds[index].speed == newSpeed) {
                    currentSpeedIndex = index;
                    speedInArray = true;

                    //this means break in jquery
                    break;
                }
            }

            if(speedInArray) {
            	video.playbackRate = newSpeed;
                sendSpeedChangeEvent();
            } else {
            	newSpeed = video.playbackRate;
            }
        }

        function addDockButton(version) {
        	player.removeButton("playbackrate");
            var tooltip = document.getElementById(player.id + "_dock_playbackrate_tooltip");
            if(tooltip) {
                tooltip.parentNode.removeChild(tooltip);
            }
            player.addButton(config.urltoimages + "jwplayer/" + version + ".png", "Playback Speed", clickHandler, "playbackrate");
        }

        function sendSpeedChangeEvent() {
        	addDockButton(video.playbackRate);
        	_setCookie();
        }

        /**
         * save speed preferences on the cookie
         * valid for one month
         * valid for all paths
         * @param speed
         */
        function _setCookie() {
            var exdate=new Date();
            exdate.setDate(exdate.getDate() + 30);
            var c_value= video.playbackRate + "; expires=" + exdate.toUTCString();
            document.cookie="playbackspeed=" + c_value  + "; path=/";
        }


        function getCookie(c_name) {
            var c_value = document.cookie;
            var c_start = c_value.indexOf(" " + c_name + "=");
            if (c_start == -1) {
                c_start = c_value.indexOf(c_name + "=");
            }

            if (c_start == -1) {
                c_value = null;
            } else {
                c_start = c_value.indexOf("=", c_start) + 1;
                var c_end = c_value.indexOf(";", c_start);
                if (c_end == -1) {
                    c_end = c_value.length;
                }
                c_value = unescape(c_value.substring(c_start,c_end));
            }
            return c_value;
        }

        player.onReady(init);

        this.resize = function(width, height) {};
    };

    jwplayer().registerPlugin(pluginName, '6.0', plugin);
})();
