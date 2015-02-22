/**
 * This widget calls the data-source-url whose response must be in this format
 *      array(  "data" => PO_User[],
 *              "pagination" => $pagination
 *      )
 * and renders users in the response in an extending list fashion.
 * In this list, you can send Message to each of the users
 * and you can also follow/unfollow them.
 *
 * @author bahaddinyasar:
 */
define(["jquery-widget-init", "handlebars.helpers", "ud-link",
    "jquery.fancybox", "jquery.ba-throttle-debounce",
    "ud.api", "ud.api.v2", "ud.initializer"
], function($, Handlebars, udLink) {
    'use strict'; // enable ECMAScript 5 strict mode
    $.widget('ud.ud_userlist', {
        options: {
            sourceUrl: null,
            pageSize: null,
            autoLoad: false,
            showProgress: false,
            searchEnabled: false
        },
        currentPage: 0,
        searchQuery: null,
        userTemplate: null,
        searchByNameForm: null,
        extendedHandlebarsHelpers: null, // extend handlebars helpers locally and keep them here
        _create: function() {
            $.extend(this.options, this.element.data());

            this._initHandlebarsTemplates();
            this._defineLocalHandlebarsHelpers();
            this._initUI();

            $(this.element).on("click", ".more a",      $.proxy(this._loadMoreUsers, this));
            $(this.element).on("click", ".follow",      $.proxy(this._followUser,    this));
            $(this.element).on("click", ".following",   $.proxy(this._unfollowUser,  this));

            this.searchQueryInput = $(".search-input", this.element);
            this.element.on('input keyup', '.search-input', $.debounce(250, $.proxy(this._searchUsersByName, this)));

            if(this.options.autoLoad) {
                this.load();
            }
        },
        _destroy: function() {
        },
        _initHandlebarsTemplates: function() {
            this.userTemplate = Handlebars.compile($("#courseStudentTemplate").html());
            this.courseStudentListTemplate = Handlebars.compile($("#courseStudentListTemplate").html());
        },
        _initUI: function() {
            this.element.html(this.courseStudentListTemplate({
                searchEnabled: this.options.searchEnabled
            }));
        },
        _defineLocalHandlebarsHelpers: function() {
            if(this.extendedHandlebarsHelpers===null){
                var localHelpers = {
                    generateMessageUrl : function(userId) {
                        return udLink.to("message", "", {action:'send-new', userId:$.trim(userId)});
                    }
                };

                this.extendedHandlebarsHelpers = $.extend({}, Handlebars.helpers, localHelpers);
            }
        },
        _searchUsersByName: function(event) {
            var previousQuery = this.searchQuery;
            this.searchQuery = $.trim(this.searchQueryInput.val());
            if(previousQuery != this.searchQuery) {
                this.currentPage = 0;
                this._loadUsers();
            }
        },
        _loadMoreUsers: function(event) {
            event.preventDefault();
            this._loadUsers();
        },
        _followUser: function(event) {
            event.preventDefault();
            var btn = $(event.currentTarget);
            UD.API.call('/users/me/follow/'+btn.data('userid'),
                        {success: $.proxy(this._followUserSuccessHandler, this, btn)});
        },
        _unfollowUser: function(event) {
            event.preventDefault();
            var btn = $(event.currentTarget);
            UD.API.call('/users/me/unfollow/'+btn.data('userid'),
                        {success: $.proxy(this._unfollowUserSuccessHandler, this, btn)});
        },
        _followUserSuccessHandler: function(btn, response) {
            if(response) {
                btn.removeClass("follow btn-primary").addClass("following btn-success");
                $('.following-text', btn).removeClass('none');
                $('.follow-text', btn).addClass('none');
            }
        },
        _unfollowUserSuccessHandler: function(btn, response) {
            if(response){
                btn.removeClass("following btn-success").addClass("follow btn-primary");
                $('.following-text', btn).addClass('none');
                $('.follow-text', btn).removeClass('none');
            }
        },
        load: function(){
            if(this.currentPage===0){
                this._loadUsers();
            }
        },
        _loadUsers: function() {
            $(".more .btn", this.element).addClass("none");
            $(".ajax-loader-tiny", this.element).show();
            var params = {
                page: ++this.currentPage,
                page_size: this.options.pageSize,
                'fields[user]': '@default,is_followed'
            };
            if(this.searchQuery) {
                params.search = this.searchQuery;
            }
            if(this.options.showProgress) {
                params['fields[user]'] += ',completion_ratio';
            }

            UD.API_V2.call(this.options.sourceUrl, {
                type: "GET",
                data: params,
                success: $.proxy(this._loadUsersSuccessHandler, this)
            });
        },
        _loadUsersSuccessHandler: function(response) {
            $(".ajax-loader-tiny", this.element).hide();

            response.show_progress = this.options.showProgress;
            response.show_messaging = UD.Config.brand.is_messaging_enabled;
            for(var i = 0; i < response.results.length; i++) {
                response.results[i].show_buttons = response.results[i].id != UD.me.id;
            }

            if(this.currentPage == 1) {
                $(".users-container", this.element).html(this.userTemplate(response, {helpers: this.extendedHandlebarsHelpers}));
            } else {
                $(".users-container", this.element).append(this.userTemplate(response, {helpers: this.extendedHandlebarsHelpers}));
            }

            if(response.next) {
                $(".more .btn", this.element).removeClass("none");
            }

            this.element.ud_initialize(); // init message popup widget

            if(typeof $.fancybox !== 'undefined') {
                $.fancybox.reposition();
            }
        }
    });
});
