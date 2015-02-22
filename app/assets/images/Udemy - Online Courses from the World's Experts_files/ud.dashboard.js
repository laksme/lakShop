define(['jquery-widget-init', 'handlebars.helpers', 'jquery.rating', 'prettify',
    'ud.api', 'ud.api.v2', 'ud.extras', 'ud.form', 'ud.lectureangular',
    'ud.notetaking', 'ud.popup', 'ud.quiz', 'ud.angular-loader'
        ], function($, Handlebars) {
        'use strict';
    $.widget('ud.ud_dashboard', {
        options: {
            courseId: null,
            isInstructor: null,
            instructorPreviewMode: null,
            defaultLectureId:null,
            previewModeActive: null,
            autoPlay: 1
        },
        notewidget: null,
        extraswidget: null,
        dashboard: null,
        courseProgress: null,
        courseFeedbacks: null,
        courseFeedbackNumCompletedLectures: 0,
        feedbackScore: null,
        courseFeedbackTimer: null,
        courseFeedbackRemainingSeconds: 20,
        feedbackCommentText: null,
        feedbackCommentOption: null,
        lowScoreLabel: null,
        highScoreLabel: null,
        currentIndex:-1,
        timelineElement: null, // dom element
        timeline: [], // array of elements storing data, index, type
        reverseIndex: {},
        sidebarCloseToggledByUser: false,
        clickedAnotherTab: false,
        $window: null,
        $materialsTab: null,
        _create: function(){
            for(var i in this.options){
                if(typeof(this.element.data(i.toLowerCase())) != 'undefined'){
                    this.options[i] = this.element.data(i.toLowerCase());
                }
            }

            this.$window = $(window);
            this._initHandlebarsTemplates();

            this.dashboard = $('.dashboard-v39');
            this.notewidget = $('.ud-notetaking', this.element);
            this.extraswidget = $('.ud-extras', this.element);
            this.timelineElement = $('ul#timeline', this.element);
            this.dashboardCoursePopupContent = $('#dashboard-course-popup-content', this.dashboard);

            this.$materialsTab = $('.sidebar-container .tab-materials');
            this.$materialsTab.off('click')
                .on('click', this.onTabClick.bind(this));
            $('.sidebar-container .tab-discussions').off('click')
                .on('click', this.onTabClick.bind(this));
            $('.sidebar-container .tab-notes').off('click')
                .on('click', this.onTabClick.bind(this));

            this.$window.on('curriculumLoaded',            this.onCurriculumLoaded.bind(this));
            this.$window.on('lectureProgressCompleted',    this.onLectureProgressCompleted.bind(this));
            this.$window.on('lectureLastPositionChanged',  this.onLectureLastPositionChanged.bind(this));
            this.$window.on('lectureCompleted',            this.onLectureCompleted.bind(this));
            this.$window.on('quizProgressChanged',         this.onQuizCompleted.bind(this));
            this.$window.on('courseProgressUpdated',       this.onCourseProgressUpdated.bind(this));
            this.$window.on('courseFeedbacksLoaded',       this.onCourseFeedbacksLoaded.bind(this));
            this.$window.on('initLectureTakingFinished',   this.onInitLectureTakingFinished.bind(this));
            this.$window.on('showDashboard',               this.showDashboard.bind(this));
            this.$window.on('showSupplementaryBtn',        this.showSupplementaryBtn.bind(this));
            this.$window.on('hideSupplementaryBtn',        this.hideSupplementaryBtn.bind(this));


            this.$window.on('quizResetted', function(event, eventData) {
                eventData.quizId && this.prepareQuiz(eventData.quizId);
            }.bind(this));

            $('.sidebar', this.element).on( 'webkitTransitionEnd transitionend oTransitionEnd MSTransitionEnd', function() {
                this.$window.resize();
            }.bind(this));

            $('.sidebar a.close-btn', this.element).click(function(){
                if(this.element.hasClass('off')){
                    this.element.removeClass('off');
                } else {
                    this.element.addClass('off');
                }
                this.sidebarCloseToggledByUser = true;
                return false;
            }.bind(this));

            this.element.on('click', '.mark', this.markAsCompletedToggle.bind(this));

            this.element.on('click', 'a.autoplay', function(event) {
            	event.preventDefault();
            	var elem = $(event.currentTarget);
            	var settingName = elem.data('name');
            	var wasOn = elem.hasClass('on');
            	this.options.autoPlay = !wasOn;
            	var data = {};
            	data['settings'] = {};
            	data['settings'][settingName] = this.options.autoPlay ? 1 : 0;
            	this.getLectureWidget(this.timeline[this.currentIndex].id).data('ud-ud_lectureangular').autoPlay = this.options.autoPlay;
            	UD.API.call('/users/me/settings', {
            		type: 'POST',
            		data: data
            	});

            	if(wasOn) {
            		elem.removeClass('on');
                    $('.autoplay-text-on', elem).addClass('none');
                    $('.autoplay-text-off', elem).removeClass('none');
            	} else {
            		elem.addClass('on');
                    $('.autoplay-text-on', elem).removeClass('none');
                    $('.autoplay-text-off', elem).addClass('none');
            	}
            }.bind(this));

            if(UD.experiment.freePreview == 0 && this.options.previewModeActive) {
                this.initPreviewMode();
            }

            $('.lazy-angular-loader').ud_angular_loader();
        },
        destroy: function(){
            this.$window.off('curriculumLoaded');
            this.$window.off('lectureProgressCompleted');
            this.$window.off('lectureLastPositionChanged');
            this.$window.off('lectureCompleted');
            this.$window.off('courseProgressUpdated');
            this.$window.off('initLectureTakingFinished');
            this.$window.off('showDashboard');
            this.$window.off('showSupplementaryBtn');
            this.$window.off('hideSupplementaryBtn');
        },
        _initHandlebarsTemplates: function() {
        	this.lectureTemplate = Handlebars.compile($('#lectureTemplate').html());
        	this.progressTemplate = Handlebars.compile($('#progressTemplate').html());
        	this.feedbackFormTemplate = Handlebars.compile($('#courseFeedbackFormTemplate').html());
        	this.chapterTemplate = Handlebars.compile($('#chapterTemplate').html());
        	this.quizTemplate = Handlebars.compile($('#quizTemplate').html());
        	this.quizViewTemplate = Handlebars.compile($('#quizViewTemplate').html());
        	this.quizNotPublishedViewTemplate = Handlebars.compile($('#quizNotPublishedViewTemplate').html());
            this.quizLockedViewTemplate = Handlebars.compile($('#quizLockedViewTemplate').html());
        },
        onUrlChange: function(e) {
            var obj;
            var url=window.location.hash;
            var urlRegex = '^#\/?((quiz|lecture|chapter)/([0-9]+)(:([0-9]+))?)?\/?';
            var match =  url.match(urlRegex);


            if(match && typeof match[3] !== 'undefined') {
                switch(match[2]) {
                    case 'quiz':
                    case 'chapter':
                    case 'lecture':

                        obj=this.timeline[this.reverseIndex[match[2]+match[3]]];
                        if(typeof obj === 'undefined') {
                            return;
                        }
                        obj.data.start_position = 0;
                        if(typeof match[5] !== 'undefined') {
                        	obj.data.start_position = match[5];
                        }

                        this.element.removeClass('none');
                        this.dashboard.addClass('none');
                        if(this.currentIndex != obj.index) {
                            this.showContent(obj);
                        }

                        if(typeof e === 'undefined' || (typeof e.originalEvent.oldURL !== 'undefined' && e.originalEvent.oldURL.indexOf('/material') == -1)) {
                        	$.event.trigger('gotoposition_' + obj.id, {position: obj.data.start_position, autostart: true});
                        }
                        return;
                    default:
                        this.showDashboard();
                        return;
                }
            }
            if(match && typeof match[8] != 'undefined') {
                switch(match[7]) {
                    default:
                        this.showDashboard();
                        return;
                }
            }
            this.showDashboard();
            return;
        },
        markedCompletedByUser: function(callbackFn) {
            var lectureId = this.timeline[this.currentIndex].id;
            this.courseProgress.num_completed_lectures++;
            UD.API_V2.call('/users/me/subscribed-courses/' + this.options.courseId +'/completed-lectures', {
                type: 'POST',
                data: {
                    'lecture_id': lectureId
                },
                success: function() {
                    callbackFn && callbackFn();
                    this.loadCourseProgress();
                }.bind(this)
            });
        },
        markedUncompletedByUser: function(callbackFn){
            var lectureId = this.timeline[this.currentIndex].id;
            UD.API_V2.call('/users/me/subscribed-courses/' + this.options.courseId +'/completed-lectures/' + lectureId, {
                type: 'DELETE',
                success: function() {
                    callbackFn && callbackFn();
                    this.loadCourseProgress();
                }.bind(this)
            });
        },
        initPreviewMode: function() {
            this.updateRemainingPreviewTime();
        },
        updateRemainingPreviewTime: function() {
            UD.API.call('/course-previews/time-spent/' + this.options.courseId, {
                success: this.handlePreviewTimeUsed.bind(this)
            });
        },
        handlePreviewTimeUsed: function(response) {
            var remaining_seconds = response.remaining_seconds;

            var remainingMinutes = Math.ceil(remaining_seconds / 60);
            $('.preview-remaining-time').text(remainingMinutes);
            if(remaining_seconds <= 0) {
                location.hash = '/';
                var html = '<a class="ud-popup" id="buynow-popup" data-autoopen="true" ' +
                    'data-closeBtn="false" data-modal="true" href="/course/buynow-popup?courseId=' +
                    this.options.courseId + '" style="display: none;"></a>';
                $('body').append(html);
                $('#buynow-popup').ud_popup();
            } else {
                // update it every 10 seconds if the time is not over
                setTimeout(this.updateRemainingPreviewTime.bind(this), 10000);
            }
        },
        updateTimelineWithProgress: function(courseProgress) {
            if(this.options.isInstructor) {
                return;
            }

            this.courseProgress = courseProgress;

            if(!this.timeline.length) {
                return;
            }

            $('.completion-ratio', this.element).text(courseProgress.completion_ratio+'%');

            $('li', this.timelineElement).each(function(i, el){
                var progressObj = courseProgress.lectures_progress[$(el).data('lectureid')] || {status:'viewed'};
                if(progressObj.status == 'completed'){
                    $('.mark', $(el)).addClass('read');
                    $(el).addClass('completed');
                } else {
                    $('.mark', $(el)).removeClass('read');
                    $(el).removeClass('completed');
                }
            }.bind(this));
        },
        loadCourseProgress: function() {
            if(this.options.isInstructor) {
                return;
            }

            this.$window.trigger('updateCourseProgress');
        },
        loadCourseFeedbacks: function() {
            if(this.options.isInstructor || (this.courseFeedbacks && this.courseFeedbacks.count)) {
                return;
            }

            this.$window.trigger('loadCourseFeedbacks');
        },
        onCurriculumLoaded: function(event) {
            this.renderTimeline(event.curriculum);
        },
        onCourseProgressUpdated: function(event) {
            this.updateTimelineWithProgress(event.courseProgress);
        },
        onCourseFeedbacksLoaded: function(event) {
            this.courseFeedbacks = event.courseFeedbacks;
        },
        onInitLectureTakingFinished: function() {
            this.onUrlChange();
        },
        renderTimeline: function(curriculum) {
            if(this.timeline.length > 0) {
                this.$window.trigger('timelineRendered');
                return;
            }
            var index=0;
            var progressElement;
            for(var i in curriculum) {
                var obj=curriculum[i];
                var tmp={
                    id: obj.id,
                    type: obj.__class,
                    data: obj,
                    index: index,
                    element: null
                };
                if(obj.__class == 'lecture') {
                    tmp.element = $(this.lectureTemplate(obj));

                    // hide autoplay button if asset type is not Video, Audio and VideoMashup
                    if(obj.asset) {
                        switch(obj.asset.type) {
                            case 'Video':
                            case 'Audio':
                            case 'VideoMashup':
                                break;
                            default:
                                tmp.element.find('a.autoplay').remove();
                                break;
                        }
                    }

                    this.timelineElement.append(tmp.element);
                    this.timeline.push(tmp);
                    this.reverseIndex[obj.__class+obj.id] = index++; // ex: ['lecture123']=>...

                    progressElement= {
                        id: obj.id,
                        type: 'progress',
                        autoSkipIn: 2000,
                        data: {
                            progress: 70
                        },
                        index: index,
                        element: null
                    };
                    progressElement.element = $(this.progressTemplate(progressElement.data));
                    this.timelineElement.append(progressElement.element);
                    this.timeline.push(progressElement);
                    this.reverseIndex[progressElement.type+obj.id] = index++; // ex: ['progress123']=>...
                    // Course Taking progress item
                } else if(obj.__class == 'chapter') {
                    tmp.element = $(this.chapterTemplate({'chapter': obj}));
                    this.timelineElement.append(tmp.element);
                    this.timeline.push(tmp);
                    this.reverseIndex[obj.__class+obj.id] = index++; // ex: ['chapter123']=>...
                } else if(obj.__class == 'quiz') {
                    tmp.element = $(this.quizTemplate(obj));

                    this.timelineElement.append(tmp.element);
                    this.timeline.push(tmp);
                    this.reverseIndex[obj.__class+obj.id] = index++; // ex: ['quiz123']=>...

                    progressElement={
                        id: obj.id,
                        type: 'progress',
                        autoSkipIn: 2000,
                        data: {
                            progress: 70
                        },
                        index: index,
                        element: null
                    };
                    progressElement.element=$(this.progressTemplate(progressElement.data));
                    this.timelineElement.append(progressElement.element);
                    this.timeline.push(progressElement);
                    this.reverseIndex[progressElement.type+obj.__class+obj.id] = index++; // ex: ['progress123']=>...
                }
            }

            if(this.courseProgress) {
                this.updateTimelineWithProgress(this.courseProgress);
            }

            $('.prev-lecture', this.timelineElement).off('click').on('click', this.prev.bind(this));
            $('.next-lecture', this.timelineElement).off('click').on('click', this.next.bind(this));
            $('.view-supplementary', this.timelineElement).off('click')
                .on('click', this.viewSupplementary.bind(this));

            this.$window.trigger('timelineRendered');
            this.onUrlChange();
        },
        showSupplementaryBtn: function() {
            $('.view-supplementary').removeClass('none');
        },
        hideSupplementaryBtn: function() {
            $('.view-supplementary').addClass('none');
        },
        showDashboard: function(){
        	this._getTrackingCode();
            this.dashboard.removeClass('none');
            this.element.addClass('none');
            var current = this.timeline[this.currentIndex];

            if(current && current.type != 'chapter' && current.type != 'quiz') {
            	this.$window.trigger('beforeunload.' + current.id);
                if(current.type == 'lecture') {
                    this.getLectureWidget(current.id).data('ud-ud_lectureangular').unload();
                }
            }
            this.currentIndex = -1;
        },
        show: function(obj){
            if(!obj){
                window.location.hash = '';
                return;
            }
            switch(obj.type){
                case 'progress':
                    this.showContent(obj);
                    break;
                case 'lecture':
                    var lectureUrl = '/lecture/' + obj.id +
                    (obj.data.start_position ? (':' + obj.data.start_position) : '');
                    this.$window.trigger('changeRouteFromOutside', lectureUrl);
                    break;
                default:
                    window.location.hash='/' + obj.type+'/'+obj.id;
                    break;
            }
        },
        showContent: function(obj) {
            switch(obj.type) {
                case 'progress':
                    this.scrollToContent(obj.index);
                    if(this.canSendCourseFeedback()) {
                        this.showFeedbackForm(obj);
                    } else {
                        setTimeout(this.next.bind(this), obj.autoSkipIn);
                    }
                    if(this.sidebarCloseToggledByUser === false)
                        $(this.element).removeClass('off');
                    break;
                case 'lecture':
                    this.hideSupplementaryBtn();
                    this.prepareLecture(obj);
                    this.scrollToContent(obj.index);
                    if(this.sidebarCloseToggledByUser === false)
                        $(this.element).removeClass('off');
                    break;
                case 'quiz':
                    this.prepareQuiz(obj.id);
                    this.scrollToContent(obj.index);
                    if(this.sidebarCloseToggledByUser === false)
                        $(this.element).addClass('off');
                    break;
                default:
                    this.scrollToContent(obj.index);
                    break;
            }
        },
        next: function(event){
        	if(event) {
                event.preventDefault();
            }

            var current = this.timeline[this.currentIndex];

            if(current && current.type == 'lecture') {
            	this.$window.trigger('beforeunload.' + current.id);
            }

            var next=this.timeline[this.currentIndex+1];
            if(next) {
                $(next.element).removeClass('off');
            }
            this.show(next);
        },
        prev: function(event) {
            event.preventDefault();
        	var current = this.timeline[this.currentIndex];

            if(current && current.type == 'lecture') {
            	this.$window.trigger('beforeunload.' + current.id);
            }

            var idx_to_load = this.currentIndex-1;
            this.timeline[idx_to_load].element.addClass('off');
            while(idx_to_load >= 0 &&
                    (this.timeline[idx_to_load].type == 'progress' ||
                      this.timeline[idx_to_load].type == 'chapter')){
                idx_to_load -= 1;
            }

            if(idx_to_load < 0)
                return;

            var prev=this.timeline[idx_to_load];
            this.show(prev);
        },
        viewSupplementary: function(){
            this.element.removeClass('off');
            this.clickedAnotherTab = false;
            this.$materialsTab.attr('checked', 'checked');
        },
        scrollToContent: function(index){
            if(this.currentIndex==index){
                return;
            }
            this.timelineElement.css('transform','translateY('+index * -100+'%)');
            this.onChangeIndex(this.currentIndex, index);
            this.currentIndex=index;
        },
        canSendCourseFeedback: function() {
            if(this.options.isInstructor || !this.courseFeedbacks || !this.courseProgress) {
                return false;
            }
            if(this.courseFeedbacks.count === 0) {
                return this.courseProgress.num_completed_lectures > 2;
            } else {
                this.courseFeedbackNumCompletedLectures = this.courseFeedbacks.results[0].num_completed_lectures;
                if(this.courseFeedbackNumCompletedLectures < 8 && this.currentIndex != this.timeline.length - 1) {
                    return !this.courseFeedbacks.results[0].score && this.courseProgress.num_completed_lectures > 7;
                } else {
                    return !this.courseFeedbacks.results[0].score
                        && this.currentIndex == this.timeline.length - 1;
                }
            }
        },
        showFeedbackForm: function(obj) {
            this.hideFeedbackForm();
            var formDiv = $('.feedback-form', obj.element);
            formDiv.html(this.feedbackFormTemplate);
            formDiv.css('height', '70%');
            $('.progress-top', obj.element).css('height', '30%');
            $('input[name=score]:radio').change(this.onFeedbackScoreChanged.bind(this));
            $('.send-feedback').on('click', this.sendFeedbackBtn.bind(this));
            var askMeLaterBtn = $('.ask-feedback-later');
            var askMeAtTheEndBtn = $('.ask-feedback-at-the-end');
            if(!this.courseFeedbackNumCompletedLectures) {
                askMeLaterBtn.on('click', this.askFeedbackLaterBtn.bind(this));
                askMeAtTheEndBtn.addClass('none');
            } else if(this.courseFeedbackNumCompletedLectures < 8) {
                askMeLaterBtn.addClass('none');
                askMeAtTheEndBtn.removeClass('none');
                askMeAtTheEndBtn.on('click', this.askFeedbackLaterBtn.bind(this));
            } else {
                askMeLaterBtn.addClass('none');
                askMeAtTheEndBtn.addClass('none');
            }
            this.feedbackCommentText = $('.feedback-comment-text');
            this.positiveOptions = $('.feedback-comment-option-positive');
            this.negativeOptions = $('.feedback-comment-option-negative');
            this.feedbackCommentOption = null;
            this.lowScoreLabel = $('.low-score-label');
            this.highScoreLabel = $('.high-score-label');
        },
        hideFeedbackForm: function() {
            $('.feedback-form').empty();
            $('.progress-top').css('height', '100%');
        },
        onFeedbackScoreChanged: function() {
            this.feedbackScore = $('input[name=score]:radio:checked').val();
            if(this.feedbackCommentOption !== null) {
                this.feedbackCommentOption.addClass('none');
            }
            if(this.feedbackScore < 9) {
                this.feedbackCommentOption = this.negativeOptions;
                this.lowScoreLabel.removeClass('none');
                this.highScoreLabel.addClass('none');
            } else {
                this.feedbackCommentOption = this.positiveOptions;
                this.lowScoreLabel.addClass('none');
                this.highScoreLabel.removeClass('none');
            }
            if(this.feedbackCommentOption && this.feedbackCommentOption.length) {
                this.feedbackCommentOption.removeClass('none');
                this.feedbackCommentOption.change(this.onFeedbackCommentOptionChanged.bind(this));
            } else {
                this.feedbackCommentText.removeClass('none');
            }
        },
        onFeedbackCommentOptionChanged: function() {
            if(this.feedbackCommentOption.val() == 'Other') {
                this.feedbackCommentText.removeClass('none');
            } else {
                this.feedbackCommentText.addClass('none');
            }
        },
        getFeedbackCommentValue: function() {
            var value = '';
            if(this.feedbackCommentOption && this.feedbackCommentOption.length) {
                value = this.feedbackCommentOption.val();
                if(value != 'Other') {
                    return value;
                }
                value += ': ';
            }
            return value + this.feedbackCommentText.val();
        },
        sendFeedbackBtn: function(event) {
            if(event) {
                event.preventDefault();
            }
            this.postFeedbackAndRemoveForm(this.feedbackScore, this.getFeedbackCommentValue());
        },
        askFeedbackLaterBtn: function(event) {
            if(event) {
                event.preventDefault();
            }
            this.postFeedbackAndRemoveForm(null, null);
        },
        postFeedbackAndRemoveForm: function(score, comment) {
            var method = 'POST';
            var feedbackId = '';
            if(this.courseFeedbacks && this.courseFeedbacks.count) {
                method = 'PUT';
                feedbackId = this.courseFeedbacks.results[0].id;
            }
            UD.API_V2.call('/users/me/course-feedbacks/'+feedbackId, {
                type: method,
                data: {
                    'score': score,
                    'comment': comment,
                    'course': this.options.courseId
                },
                success: function(data) {
                    this.courseFeedbacks.count = 1;
                    this.courseFeedbacks.results = [data];
                }.bind(this)
            });
            this.hideFeedbackForm();
            this.next();
        },
        onChangeIndex: function(oldIndex){
            var old;
            if(oldIndex!==null && (old=this.timeline[oldIndex])){
                if(old.type=='lecture'){
                    this.getLectureWidget(old.id).data('ud-ud_lectureangular').unload();
                }
            }
        },
        prepareLecture: function(lecture) {
        	lecture.data.is_instructor = this.options.isInstructor;
        	var startPosition = lecture.data.start_position;
        	if(this.options.autoPlay) {
                $('a.autoplay', this.element).addClass('on');
                $('a.autoplay .autoplay-text-on', this.element).removeClass('none');
                $('a.autoplay .autoplay-text-off', this.element).addClass('none');
        	} else {
                $('a.autoplay', this.element).removeClass('on');
        	    $('a.autoplay .autoplay-text-on', this.element).addClass('none');
                $('a.autoplay .autoplay-text-off', this.element).removeClass('none');
        	}

            this._setDefaultTab();
            var lectureWidget=this.getLectureWidget(lecture.id).data('ud-ud_lectureangular');
            lectureWidget.load(function() {
            	lectureWidget.autoPlay = this.options.autoPlay;
            	lectureWidget.startPosition = startPosition;
            	this.getNoteWidget() && this.getNoteWidget().resetParams();
            	this.getNoteWidget() && this.getNoteWidget().getNotes(lecture);
            	this.getNoteWidget() && this.getNoteWidget().setPositionHandler(lectureWidget);
            	this.getExtrasWidget() && this.getExtrasWidget().getExtras(lecture);
                this.runPrettyPrint();
            }.bind(this));
        },
        prepareQuiz: function(quizId) {
            var quizzesXhrDeferred = $.Deferred(), completedQuizzesXhrDeferred = $.Deferred();
            UD.API_V2.call('/users/me/subscribed-courses/' + this.options.courseId + '/completed-quizzes?quiz=' + quizId).
                complete(completedQuizzesXhrDeferred.resolve);
            UD.API_V2.call('/courses/' + this.options.courseId + '/quizzes/' + quizId + '?fields[quiz]=@default,object_index,num_assessments').
                complete(quizzesXhrDeferred.resolve);

            $.when(quizzesXhrDeferred, completedQuizzesXhrDeferred).done(
                $.proxy(this.prepareQuizSuccessHandler, this, quizId)
            );
        },
        prepareQuizSuccessHandler: function(quizId, quizzesXHR, completedQuizzesXHR) {
            var assetContainer = $('.asset-container',this.timeline[this.reverseIndex['quiz'+quizId]].element);
            assetContainer.empty();
            if(quizzesXHR[1] == 'success' && completedQuizzesXHR[1] == 'success') {
                var quiz = quizzesXHR[0].responseJSON;
                quiz.user_completed = completedQuizzesXHR[0].responseJSON.count ? completedQuizzesXHR[0].responseJSON.results[0] : null;
                if(quiz.is_published || this.options.isInstructor) {
                    assetContainer.html(this.quizViewTemplate(quiz));
                    this.getQuizWidget(quizId, function(widget) {
                        var quizWidget = widget.data('ud-ud_quiz');
                        quizWidget._initializeQuiz(quiz, this.options.courseId);
                        quizWidget.load(function(){
                            this.getNoteWidget() && this.getNoteWidget().resetParams();
                            this.getNoteWidget() && this.getNoteWidget().setPositionHandler(quizWidget);
                            this.runPrettyPrint();
                        }.bind(this));
                    }.bind(this));
                } else {
                    assetContainer.html(this.quizNotPublishedViewTemplate(quiz));
                }
            } else {
                assetContainer.html(this.quizLockedViewTemplate());
            }
        },
        getExtrasWidget: function() {
        	this.extraswidget= $('.ud-extras', this.element);
        	if(this.extraswidget.length) {
        		if(!this.extraswidget.data('ud-ud_extras')) {
        			this.extraswidget.ud_extras();
        		}
        	}
        	return this.extraswidget.data('ud-ud_extras');
        },
        getNoteWidget: function() {
        	this.notewidget = $('.ud-notetaking', this.element);
        	if(this.notewidget.length) {
        		if(!this.notewidget.data('ud-ud_notetaking')) {
        			this.notewidget.ud_notetaking();
        		}
        	}
        	return this.notewidget.data('ud-ud_notetaking');
        },
        getLectureWidget: function(lectureId){
            var el = $('.asset-container .ud-lectureangular',this.timeline[this.reverseIndex['lecture'+lectureId]].element);
            if(!el.data('ud-ud_lectureangular')){
                var widgetOptions = {};
                widgetOptions.courseId = this.options.courseId;
                widgetOptions.instructorPreviewMode = this.options.instructorPreviewMode;
                el.ud_lectureangular(widgetOptions);
            }
            return el;
        },
        getQuizWidget: function(quizId, callback) {
            var el = $('.asset-container .ud-quiz',this.timeline[this.reverseIndex['quiz'+quizId]].element);
            if(!el.data('ud-ud_quiz')) {
                var widgetOptions = {};
                if(this.options.isInstructor) {
                	widgetOptions.instructorMode = true;
                	widgetOptions.studentMode = false;
                } else {
                	widgetOptions.instructorMode = false;
                	widgetOptions.studentMode = true;
                }
                require(['ud.quiz'], function(el, widgetOptions) {
                	el.ud_quiz(widgetOptions);
                	callback && callback(el);
                }.bind(this, el, widgetOptions));
            } else {
            	callback && callback(el);
            }
        },
        onLectureProgressCompleted: function(event, lectureId) {
            this.timeline[this.reverseIndex['lecture'+lectureId]].just_completed=true;
            this.loadCourseProgress();
            this.loadCourseFeedbacks();
        },
        onQuizCompleted: function(event, quizId) {
            this.timeline[this.reverseIndex['quiz'+quizId]].just_completed=true;
            this.loadCourseProgress();
        },
        onLectureLastPositionChanged: function(event, lectureId, lastPosition) {
            this.timeline[this.reverseIndex['lecture'+lectureId]].data.start_position = lastPosition;
        },
        onLectureCompleted: function(event, lectureId) {
            // Pause autoplay if user is trying to start a discussion or take a note.
            // On IE, val() defaults to the placeholder value rather than empty string.
            var disc = this.element.find('textarea.js-discussion-title');
            var hasDiscVal = disc.val() && disc.val() !== disc.attr('placeholder');
            var note = this.element.find('textarea.js-note');
            var hasNoteVal = note.val() && note.val() !== note.attr('placeholder');
            if(this.options.autoPlay && !hasDiscVal && !hasNoteVal) {
                this.element.find('li[data-lectureid="'+lectureId+'"]').find('.next-lecture').trigger('click');

                var timelineObj = this.timeline[this.reverseIndex['lecture'+lectureId] + 2];
                if(timelineObj.type == 'chapter' && !this.canSendCourseFeedback()) {
                    var duration = this.timeline[this.reverseIndex['lecture'+lectureId] + 1].autoSkipIn * 2;
                    if(timelineObj.data.description) {
                        duration += 6000; // give students more time to read the description
                    }
                    var chapterContinueTimeout = setTimeout(function() {
                        $('.next-lecture.continue' ,timelineObj.element).trigger('click');
                    }.bind(this), duration);

                    $('.next-lecture.continue' ,timelineObj.element).on('click.chaptercontinue', function() {
                        clearTimeout(chapterContinueTimeout);
                        $('.next-lecture.continue' ,timelineObj.element).off('click.chaptercontinue');
                    });
                }
            }
        },
        onTabClick: function() {
            this.clickedAnotherTab = true;
        },
        runPrettyPrint: function() {
            $('pre', this.element).addClass('prettyprint');
            prettyPrint();
        },
        markAsCompletedToggle: function(event){
            event.preventDefault();
            var button=$(event.target);

            if(button.hasClass('read')){
                this.markedUncompletedByUser(function() {
                    button.removeClass('read');
                    this.timeline[this.currentIndex].just_completed = false;
                }.bind(this));

            } else {
                this.markedCompletedByUser(function() {
                    button.addClass('read');
                    this.timeline[this.currentIndex].just_completed = true;
                }.bind(this));

            }
        },
        _getTrackingCode: function() {
        	UD.API.call('/courses/' + this.options.courseId + '/tracking-code', {
        		success: function(response) {
        			this.element.append(response.code);
        		}.bind(this)
        	});
        },
        _setDefaultTab: function() {
            if(!this.clickedAnotherTab) {
                // user may have hit 'View resources', so make
                // sure the curriculum tab is active
                // if user clicked another tab, the active tab does not need
                // to change
                $('.sidebar-container .tab-curriculum').attr('checked', 'checked');
            }
        }
    });
});
