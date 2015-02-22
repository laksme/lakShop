'use strict';
var version = (typeof UD !== 'undefined' && typeof UD.Config !== 'undefined') ? UD.Config.version : '1';

require.config({
    baseUrl: '/staticx/udemy/js/jq',
    urlArgs: 'v=' + version,
    paths: {
        // CDN
        'ace': [
            'https://cdnjs.cloudflare.com/ajax/libs/ace/1.1.01/ace',
            'https://cdn.jsdelivr.net/ace/1.1.01/min/ace'
        ],
        'adroll': 'https://s.adroll.com/j/roundtrip',
        'bootstrap': [
            'https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.3.1/js/bootstrap.min',
            'https://maxcdn.bootstrapcdn.com/bootstrap/3.3.1/js/bootstrap.min'
        ],
        'easyXDM': 'https://cdnjs.cloudflare.com/ajax/libs/easyXDM/2.4.18.25/easyXDM.min',
        'facebook': 'https://connect.facebook.net/en_US/all',
        'googleanalytics': 'https://stats.g.doubleclick.net/dc',
        'googleplusone': 'https://apis.google.com/js/client:plusone',
        'handlebars': [
            'https://cdnjs.cloudflare.com/ajax/libs/handlebars.js/2.0.0/handlebars.min',
            '../bower_components/handlebars/handlebars.min'
        ],
        'handlebars-templates': '../generated/handlebars.templates',
        'highcharts': [
            'https://cdnjs.cloudflare.com/ajax/libs/highcharts/3.0.2/highcharts',
            'https://code.highcharts.com/3.0.2/highcharts',
            '../bower_components/highcharts/highcharts'
        ],
        'introjs': [
            'https://cdnjs.cloudflare.com/ajax/libs/intro.js/0.5.0/intro.min',
            'https://cdn.jsdelivr.net/intro.js/0.5.0/intro.min'
        ],
        'jquery': [
            'https://ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min',
            'https://cdn.jsdelivr.net/jquery/1.10.2/jquery.min',
            '../bower_components/jquery/dist/jquery.min'
        ],
        'jquery-migrate': [
            'https://ajax.aspnetcdn.com/ajax/jquery.migrate/jquery-migrate-1.2.1.min',
            'https://cdn.jsdelivr.net/jquery.migrate/1.2.1/jquery-migrate'
        ],
        'jquery-ui-timepicker-addon': [
            'https://cdnjs.cloudflare.com/ajax/libs/jquery-ui-timepicker-addon/1.4.5/jquery-ui-timepicker-addon.min',
            '../bower_components/jqueryui-timepicker-addon/dist/jquery-ui-timepicker-addon.min'
        ],
        'jquery.ba-throttle-debounce': [
            'https://cdnjs.cloudflare.com/ajax/libs/jquery-throttle-debounce/1.1/jquery.ba-throttle-debounce.min',
            '../bower_components/jquery-throttle-debounce/jquery.ba-throttle-debounce.min'
        ],
        'jquery.color': 'https://cdnjs.cloudflare.com/ajax/libs/jquery-color/2.1.2/jquery.color.min',
        'jquery.cookie': [
            'https://cdnjs.cloudflare.com/ajax/libs/jquery-cookie/1.3.1/jquery.cookie.min',
            'https://cdn.jsdelivr.net/jquery.cookie/1.3.1/jquery.cookie.min'
        ],
        'jquery.fancybox': [
            'https://cdnjs.cloudflare.com/ajax/libs/fancybox/2.1.5/jquery.fancybox.min',
            'https://cdn.jsdelivr.net/fancybox/2.1.5/jquery.fancybox.min'
        ],
        'jquery.fileupload': [
            'https://cdnjs.cloudflare.com/ajax/libs/blueimp-file-upload/9.5.7/jquery.fileupload.min',
            'https://cdn.jsdelivr.net/jquery.fileupload/9.5.7/js/jquery.fileupload'
        ],
        'jquery.iframe-transport': 'https://cdnjs.cloudflare.com/ajax/libs/blueimp-file-upload/9.5.7/jquery.iframe-transport.min',
        'jquery.jcrop': 'https://cdnjs.cloudflare.com/ajax/libs/jquery-jcrop/0.9.10/jquery.Jcrop.min',
        'jquery.jqGrid': [
            'https://cdnjs.cloudflare.com/ajax/libs/jqgrid/4.6.0/js/jquery.jqGrid.min',
            'https://cdn.jsdelivr.net/jqgrid/4.6.0/jquery.jqGrid.min'
        ],
        'jquery.mousewheel': 'https://cdnjs.cloudflare.com/ajax/libs/jquery-mousewheel/3.1.11/jquery.mousewheel.min',
        'jquery.payment': 'https://cdnjs.cloudflare.com/ajax/libs/jquery.payment/1.0.2/jquery.payment.min',
        'jquery.smartbanner': 'https://cdnjs.cloudflare.com/ajax/libs/jquery.smartbanner/1.0.0/jquery.smartbanner.min',
        'jquery.ui': [
            'https://ajax.googleapis.com/ajax/libs/jqueryui/1.10.3/jquery-ui.min',
            'https://cdn.jsdelivr.net/jquery.ui/1.10.3/jquery-ui.min',
            '../bower_components/jquery-ui/jquery-ui.min'
        ],
        'json2': 'https://cdnjs.cloudflare.com/ajax/libs/json2/20130526/json2.min',
        'jwplayer': 'https://jwpsrv.com/library/zjJURF88EeKbKCIACp8kUw',
        'marketo': 'https://munchkin.marketo.net/munchkin',
        'moment': [
            'https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.7.0/moment-with-langs.min',
            'https://cdn.jsdelivr.net/momentjs/2.7.0/moment-with-langs.min'
        ],
        'moment-timezone': [
            'https://cdnjs.cloudflare.com/ajax/libs/moment-timezone/0.2.0/moment-timezone-with-data-2010-2020.min',
            'https://cdn.jsdelivr.net/momentjs.timezone/0.2/moment-timezone-with-data-2010-2020.min'
        ],
        'mustache': [
            'https://cdnjs.cloudflare.com/ajax/libs/mustache.js/0.7.2/mustache.min',
            'https://cdn.jsdelivr.net/mustache.js/0.7.2/mustache'
        ],
        'paypal-incontext': 'https://www.paypalobjects.com/js/external/paypal.v1',
        'prettify': 'https://cdnjs.cloudflare.com/ajax/libs/prettify/r298/prettify.min',
        'raven': 'https://cdn.ravenjs.com/1.1.16/jquery,native/raven.min',
        'stripe-checkout': 'https://checkout.stripe.com/checkout',
        'sift-science': 'https://cdn.siftscience.com/s',
        'swfobject': 'https://ajax.googleapis.com/ajax/libs/swfobject/2.2/swfobject',
        'twitterwidgets': 'https://platform.twitter.com/widgets',
        'underscore': [
            'https://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.7.0/underscore-min',
            'https://cdn.jsdelivr.net/underscorejs/1.7.0/underscore-min',
            '../bower_components/underscore/underscore-min'
        ],
        'webengage': 'https://ssl.widgets.webengage.com/js/widget/webengage-min-v-4.0',
        'zeroclipboard': '../bower_components/zeroclipboard/dist/ZeroClipboard.min',
        'branch-metrics': '../bower_components/branch-web-sdk/dist/branch.min',
        'branch-metrics-fingerprint': 'https://bnc.lt/_r?',

        'fineuploader': '../libs/fineuploader/s3.jquery.fine-uploaderv5.1.3',
        'redactor': '../libs/redactor/redactor',
        'olark': '../libs/olark',
        'jsrepl': '../bower_components/jsrepl-build/jsrepl',
        'jsuri': '../bower_components/jsuri/Uri.min',

        // jquery plugins
        'jquery.autoellipsis': '../bower_components/jquery.autoellipsis/src/jquery.autoellipsis',
        'jquery.expander': '../bower_components/jquery-expander/jquery.expander.min',
        'jquery.json': [
            'https://cdnjs.cloudflare.com/ajax/libs/jquery-json/2.4.0/jquery.json.min',
            '../bower_components/jquery-json/build/jquery.json.min'
         ],
        'jquery.menu-aim': '../bower_components/jquery-menu-aim/jquery.menu-aim',
        'jquery.number': '../bower_components/jquery-number/jquery.number.min',
        'jquery.pagination': '../bower_components/jquery-pagination/src/jquery.pagination',
        'jquery.rating': '../bower_components/jquery-rating/jquery.rating.pack',
        'jquery.serialize-object': '../bower_components/jquery-misc/jquery.ba-serializeobject.min',
        'jquery.stickysectionheaders': '../bower_components/jquery-stickysectionheaders/src/jquery.stickysectionheaders',
        'jquery.timeto': '../bower_components/jquery-timeto/jquery.timeTo.min',
        'jquery.viewport': '../bower_components/jquery-viewport/jquery.viewport',

        // angular
        'angular': [
            'https://ajax.googleapis.com/ajax/libs/angularjs/1.3.8/angular.min',
            '../bower_components/angular/angular.min'
        ],
        'angular-animate': [
            'https://ajax.googleapis.com/ajax/libs/angularjs/1.3.8/angular-animate',
            '../bower_components/angular-animate/angular-animate.min'
        ],
        'angular-cookies': [
            'https://ajax.googleapis.com/ajax/libs/angularjs/1.3.8/angular-cookies.min',
            '../bower_components/angular-cookies/angular-cookies.min'
        ],
        'angular-gettext': '../bower_components/angular-gettext/dist/angular-gettext.min',
        'angular-module-patch': '../ng/patches/angular-module-patch',
        'angular-resource': [
            'https://ajax.googleapis.com/ajax/libs/angularjs/1.3.8/angular-resource.min',
            '../bower_components/angular-resource/angular-resource.min'
        ],
        'angular-route': [
            'https://ajax.googleapis.com/ajax/libs/angularjs/1.3.8/angular-route.min',
            '../bower_components/angular-route/angular-route.min'
        ],
        'angular-sanitize': [
            'https://ajax.googleapis.com/ajax/libs/angularjs/1.3.8/angular-sanitize.min',
            '../bower_components/angular-sanitize/angular-sanitize.min'
        ],
        'angular-timer': '../bower_components/angular-timer/dist/angular-timer.min',
        'ng-grid': [
            'https://cdnjs.cloudflare.com/ajax/libs/ng-grid/2.0.7/ng-grid.min',
            'https://cdn.jsdelivr.net/angular.ng-grid/2.0.7/ng-grid.min'
        ],
        'highcharts-ng': '../bower_components/highcharts-ng/dist/highcharts-ng.min',

        'ng-root': '../ng',
        'ud-config': '../ng/ud-config',
        'ud-init': '../ng/ud-init',
        'ud-link': '../ng/ud-link',
        'ud-me': '../ng/ud-me',
        'ud-translate': '../ng/ud-translate',
        'ud-template': '../ng/ud-template',
        'ui-bootstrap': [
            'https://cdnjs.cloudflare.com/ajax/libs/angular-ui-bootstrap/0.12.0/ui-bootstrap-tpls.min',
            '../bower_components/angular-bootstrap/ui-bootstrap-tpls.min'
        ],

        // angular.js apps
        'activity-viewer.app': '../ng/apps/activity-viewer',
        'admin-fraud-inspection.app': '../ng/apps/admin-fraud-inspection',
        'channel-dashboard.app': '../ng/apps/channel-dashboard',
        'course-manage-conversion-analytics.app': '../ng/apps/course-manage-conversion-analytics',
        'course-manage-engagement-analytics.app': '../ng/apps/course-manage-engagement-analytics',
        'course-taking-dashboard.app': '../ng/apps/course-taking-dashboard',
        'my-courses.app': '../ng/apps/my-courses',
        'organization-discovery.app': '../ng/apps/organization-discovery',
        'organization-manage-courses.app': '../ng/apps/organization-manage-courses',
        'organization-manage-learners-activity.app': '../ng/apps/organization-manage-learners-activity',
        'organization-manage-usage-patterns.app': '../ng/apps/organization-manage-usage-patterns',
        'statement-details.app': '../ng/apps/statement-details',
        'statements-summary.app': '../ng/apps/statements-summary',

        // requirejs plugins
        'async': '../bower_components/requirejs-plugins/src/async',
        'depend': '../bower_components/requirejs-plugins/src/depend',
        'font': '../bower_components/requirejs-plugins/src/font',
        'goog': '../bower_components/requirejs-plugins/src/goog',
        'image': '../bower_components/requirejs-plugins/src/image',
        'json': '../bower_components/requirejs-plugins/src/json',
        'noext': '../bower_components/requirejs-plugins/src/noext',
        'mdown': '../bower_components/requirejs-plugins/src/mdown',
        'propertyParser': '../bower_components/requirejs-plugins/src/propertyParser',
        'text': '../bower_components/requirejs-text/text'
    },
    // Short-hand dependency configuration (i.e. 'lib-name' : ['dep-a', 'dep-b']) does not work with
    // wrapShim: true build option. Therefore, explicitly define deps with 'lib-name': { deps: [] }.
    shim: {
        'angular': {exports: 'angular'},
        'angular-animate': { deps: ['angular'] },
        'angular-cookies': { deps: ['angular'] },
        'angular-gettext': { deps: ['angular'] },
        'angular-resource': { deps: ['angular'] },
        'angular-route': { deps: ['angular'] },
        'angular-sanitize': { deps: ['angular'] },
        'angular-timer': { deps: ['angular'] },
        'bootstrap': { deps: ['jquery', 'jquery.ui'] },
        'facebook': { exports: 'FB' },
        'fineuploader': { deps: ["jquery"] },
        'handlebars': {
            deps: ['jquery'],
            exports: 'Handlebars'
        },
        'highcharts': {
            deps: ['jquery'],
            exports: 'Highcharts'
        },
        'highcharts-ng': { deps: ['angular', 'highcharts'] },
        'jquery-migrate': { deps: ['jquery'] },
        'jquery-ui-timepicker-addon': { deps: ["jquery", "jquery.ui"] },
        'jquery.autoellipsis': { deps: ["jquery"] },
        'jquery.ba-throttle-debounce': { deps: ["jquery", "jquery-migrate"] },
        'jquery.color': { deps: ["jquery", "jquery-migrate"] },
        'jquery.cookie': { deps: ["jquery", "jquery-migrate"] },
        'jquery.expander': { deps: ["jquery"] },
        'jquery.fancybox': { deps: ["jquery", "jquery-migrate"] },
        'jquery.fileupload': { deps: ["jquery", "jquery.ui"] },
        'jquery.iframe-transport': { deps: ["jquery"] },
        'jquery.jcrop': { deps: ["jquery", "jquery-migrate"] },
        'jquery.jqGrid': { deps: ["jquery", "jquery-migrate"] },
        'jquery.json': { deps: ["jquery"] },
        'jquery.menu-aim': { deps: ['jquery'] },
        'jquery.mousewheel': { deps: ["jquery", "jquery-migrate"] },
        'jquery.number': { deps: ["jquery"] },
        'jquery.pagination': { deps: ["jquery"] },
        'jquery.payment': { deps: ["jquery"] },
        'jquery.rating': { deps: ["jquery", "jquery-migrate"] },
        'jquery.serialize-object': { deps: ["jquery"] },
        'jquery.smartbanner': { deps: ["jquery", "jquery-migrate"] },
        'jquery.stickysectionheaders': { deps: ["jquery", "jquery-migrate"] },
        'jquery.timeto': { deps: ["jquery"] },
        'jquery.ui': { deps: ['jquery'] },
        'jsuri': { exports: 'Uri' },
        'jquery.viewport': { deps: ["jquery"] },
        'jwplayer': { deps: ['jquery'] },
        'moment-timezone': { deps: ["moment"] },
        'ng-grid': { deps: ['angular', 'jquery'] },
        'redactor': { deps: ['jquery'] },
        'ui-bootstrap': { deps: ['angular'] },
        'branch-metrics': {deps: ['branch-metrics-fingerprint']}
    },
    map: {
        'jquery.fileupload': {
            'jquery.ui.widget': 'jquery.ui'
        }
    }
});


if(typeof UD !== 'undefined' && typeof UD.Config !== 'undefined' && UD.Config.ENV !== 'TEST') {
    require(['../jq/ud.requireerrorhandler'], function (requireErrorHandler) {
        require.onError = requireErrorHandler;
    });

    require(['ud.package.all']);
}
