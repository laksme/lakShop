define(['require'], function (require) {
    'use strict';
    if (typeof UD.adroll !== 'undefined') {
        window.adroll_adv_id = "554CPNW4XBAX5EYKBL4HVU";
        window.adroll_pix_id = "OKLCQMMNANCRNGGEOKKR5M";
        if (typeof UD.adroll.customData !== 'undefined') {
            window.adroll_custom_data = UD.adroll.customData;
        }
        if (typeof UD.adroll.segments !== 'undefined') {
            window.adroll_segments = UD.adroll.segments;
        }
        require(['adroll']);
    }
});
