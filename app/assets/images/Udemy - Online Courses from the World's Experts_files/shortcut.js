(function() {
    
    var shortcut = function(player, config, div) {
        var video = '';
        var deltaVolume = 5;
        var volume = 100;

        var SPACE_KEY = 32;
        
        var UP_KEY = 38;
        var DOWN_KEY = 40;
        
        var F_KEY = 70;
        var M_KEY = 77;
        var P_KEY = 80;
        
        function init(evt) {
            if(player.getRenderingMode() != 'html5') {
                return;
            }
            video = player.container;
            video.setAttribute('tabindex', 1);
            video.focus();
            video.style.outline = "none";
            
            video.onkeydown = onkeydownHandler;
        }
        
        function mute() {
            player.setMute(!player.getMute());
        }
        
        function setVolume(delta) {
            volume = parseInt(player.getVolume());
            volume += delta;
            
            if(volume > 0){
                player.setMute(false);
            }
            
            if(volume > 100) {
                volume = 100;
                return;
            } else if(volume < 0) {
                volume = 0;
                return;
            }
            
            player.setVolume(volume);
        }
        
        function playPause(key) {
            if(player.getFullscreen() && key == SPACE_KEY) {
                return;
            }
            player.play();
        }
        
        function fullscreenMode() {
            var fullscreen = player.getFullscreen();
            player.setFullscreen(!fullscreen);
        }

        function onkeydownHandler(e) {
            switch(e.which) {
                case P_KEY:
                case SPACE_KEY:
                    e.preventDefault();
                    playPause(e.which);
                    break;

                case UP_KEY:
                    e.preventDefault();
                    setVolume(deltaVolume);
                    break;

                case DOWN_KEY:
                    e.preventDefault();
                    setVolume(-deltaVolume);
                    break;

                case F_KEY:
                    e.preventDefault();
                    fullscreenMode();
                    break;
                    break;
                case M_KEY:
                    e.preventDefault();
                    mute();
                    break;
                default:
            }
        }


        player.onReady(init);
        player.onPlay(function() {
            setVolume(0);
        });
    };
    
    jwplayer().registerPlugin('shortcut', '6.0', shortcut);
    
})();