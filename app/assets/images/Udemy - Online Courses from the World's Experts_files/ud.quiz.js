define(["jquery-widget-init", "handlebars.helpers", "ud.api",
    "ud.assessment", "ud.assessments.fill-in-the-blanks", "ud.assessments.multiple-choice",
    "ud.assessments.coding-challenge", "ud.assessments.true-false"
], function($, Handlebars) {
    $.widget("ud.ud_quiz", {
        options: {
            quizId: null,
            courseId: null,
            autoLoad: true,
            studentMode: false,
            instructorMode: false,
            instructorPreviewMode: null,
            viewFinalPage: false
        },
        quiz: null,
        courseId: null,
        position:null,
        quizNavigation: null,
        quizViewer: null,
        quizCompletedTimeout: null,
        _create: function(){
            for(var i in this.options){
                if(typeof(this.element.data(i.toLowerCase())) != 'undefined'){
                    this.options[i] = this.element.data(i.toLowerCase());
                }
            }
            if(this.options.autoLoad){
                this.load();
                this.loaded = true;
            }
            this.assessmentElements = null;
            this.position = 0;

            this._initHandlebarsTemplates();
        },
        _initHandlebarsTemplates: function() {
            this.assessmentTemplate = Handlebars.compile($("#assessmentTemplate").html());
            this.quizFinalResultsTemplate = Handlebars.compile($("#quizFinalResultsTemplate").html());
            this.quizInstructorFinalResultsTemplate = Handlebars.compile($("#quizInstructorFinalResultsTemplate").html());
            this.quizStartPageTemplate = Handlebars.compile($("#quizStartPageTemplate").html());

            Handlebars.registerHelper("isAnswerCorrect", function(score, options) {
            	var fnTrue = options.fn;
            	var fnFalse = options.inverse;
            	return score === 1 ? fnTrue(this) : fnFalse(this);
            });
        },
        _initializeQuiz: function(quiz, courseId) {
        	this.quiz = quiz;
        	this.quiz.is_instructor = this.options.instructorMode;
            this.courseId = courseId;

        	this.numOfAssessments = parseInt(this.quiz.num_assessments);

        	this.quizViewer = $("ul.quiz-viewer", this.element);
        	this.quizNavigation = $(".quiz-navigation", this.element);
        	this.quizNavigationBackBtn = $(".back-btn2", this.quizNavigation);

            this.quizViewer.append(this.quizStartPageTemplate(this.quiz));

            this.startQuizBtn = $(".start-page .start-btn", this.quizViewer);
            this.startQuizBtn.on("click" ,this._startQuiz.context(this));

            this.viewResultsBtn = $(".start-page .view-results-btn", this.quizViewer);
            this.viewResultsBtn.on("click", this.showResults.context(this));

            this.resetAnswersBtn = $(".start-page .reset-answers-btn", this.quizViewer);
            this.resetAnswersBtn.on("click", this.resetAnswers.context(this));

            this.quizNavigationBackBtn.on("click", this.goToResultsPage.context(this));

            this.registerQuizListeners();
        },
        quizCompleteHandler: function(event, data) {
        	event && event.preventDefault();
        	UD.API_V2.call('/users/me/subscribed-courses/' + this.courseId + '/completed-quizzes/', {
            	type: "POST",
                data: {
                    quiz: this.options.quizId
                },
            	success: function(response){
                    this.quiz.user_completed = response;
                    $.event.trigger('quizProgressChanged', [this.options.quizId]);
            		this.createFinalResultsPage();
                }.bind(this)
        	});
        },
        unload: function(){
            this.element.html("");
            clearTimeout(this.quizCompletedTimeout);
        },
        load: function(){
            if(this._loaded) return;
            this._loaded = true;
            var callback=arguments.length>=1 ? arguments[0] : null;
            this._getAnalyticsTrackingCode();

            var assessmentsXhrDeferred = $.Deferred(), answersXhrDeferred = $.Deferred();
            UD.API_V2.call('/quizzes/' + this.options.quizId + '/assessments?page_size=250').complete(assessmentsXhrDeferred.resolve);
            UD.API_V2.call('/quizzes/' + this.options.quizId + '/assessment-answers?page_size=250&fields[user_answers_assessment]=@default,assessment').
                complete(answersXhrDeferred.resolve);

            $.when(assessmentsXhrDeferred, answersXhrDeferred).done(
                $.proxy(this.loadAssessmentsSuccessHandler, this, callback)
            );
        },
        loadAssessmentsSuccessHandler: function(callback, assessmentsXHR, answersXHR) {
            if(assessmentsXHR[1] == 'success' && answersXHR[1] == 'success') {
                var assessmentList = this.getAssessmentListWithUserResponse(
                    assessmentsXHR[0].responseJSON.results, answersXHR[0].responseJSON.results);
                var assessmentListLength = assessmentList.length;
                var assessmentListHTML = this.assessmentTemplate({assessments: assessmentList});
                $(".start-page", this.quizViewer).after(assessmentListHTML);
                $.each(assessmentList, function (id, assessment) {
                    assessment.isLastAssessment = id == (assessmentListLength - 1);
                    var widget = this.createAssessmentViewWidget(assessment);
                    widget.render();
                }.bind(this));
                callback && callback(assessmentsXHR[0].responseJSON);
            }
        },
        getAssessmentListWithUserResponse: function(assessmentsList, answersList) {
            if(!answersList.length) {
                this.markAsViewed();
            }
            $.each(assessmentsList, function(id, assessment) {
                var user_response = answersList.filter(function(answer) {
                    return answer.assessment.id == assessment.id;
                });
                assessment.user_response = user_response.length ? user_response[0] : null;
            });
            return assessmentsList;
        },
        /**
         * Returns an assessment widget. See ud.assessment.js
         * @param element
         * @param assessment
         * @return {*}
         */
        createAssessmentViewWidget: function(assessment) {
            var widget = null;
            var widgetOptions = {};
            widgetOptions.assessmentId = assessment.id;
            widgetOptions.prompt = assessment.prompt;
            widgetOptions.correctResponse = assessment.correct_response;
            widgetOptions.isLastAssessment = assessment.isLastAssessment;
            widgetOptions.relatedLectures = assessment.prompt.related_lectures;
            widgetOptions.studentMode = this.options.studentMode;
            widgetOptions.instructorMode = this.options.instructorMode;
            if(assessment.user_response) {
                widgetOptions.response = assessment.user_response.response;
            }
            var element = $("#quiz-assessment-" + assessment.id, this.element);
            switch(assessment.assessment_type) {
                case "multiple-choice":
                    require(["ud.assessments.multiple-choice"], function() {

                    }.context(this));
                    element.ud_assessments_multiple_choice(widgetOptions);
                    widget = element.data("ud-ud_assessments_multiple_choice");
                    break;
                case "coding-challenge":
                    element.ud_assessments_coding_challenge(widgetOptions);
                    widget = element.data("ud-ud_assessments_coding_challenge");
                    break;
                case "fill-in-the-blanks":
                	element.ud_assessments_fill_in_the_blanks(widgetOptions);
                	widget = element.data("ud-ud_assessments_fill_in_the_blanks");
                	break;
                case "true-false":
                	element.ud_assessments_true_false(widgetOptions);
                	widget = element.data("ud-ud_assessments_true_false");
                	break;
            }
            this.registerAssessmentListeners(widget);
            return widget;
        },
        createFinalResultsPage: function(results) {
        	UD.API_V2.call('/quizzes/' + this.options.quizId + '/stats', {
            	type: "GET",
            	success: function(response){
            		//TODO: remove previous final results page before rendering this.
            		response.me = UD.me;
                    response.assessment_stats.sort(function(stat1, stat2) {
                        return stat1.index - stat2.index;
                    });
            		if(this.options.instructorMode) {
            			this.quizViewer.append(this.quizInstructorFinalResultsTemplate(response));
            		} else {
            			this.quizViewer.append(this.quizFinalResultsTemplate(response));
            		}
            		this.options.viewFinalPage = true;

            		this.resultsPage = $(".results-page", this.quizViewer);
            		$(".scoreboard li.q", this.resultsPage).on("click", this.resultsPageQuestionOnClick.context(this));
                }.bind(this)
        	});
        },
        resultsPageQuestionOnClick: function(event) {
        	var questionOrder = $(event.currentTarget).data("position");
			this.goToQuestion(questionOrder);
        },
        registerAssessmentListeners: function(widget) {
            $(widget).bind("answer", this.answerHandler.context(this));
            $(widget).bind("assessmentdone", this.assessmentDoneHandler.context(this));
        },
        answerHandler: function(event, response, callback) {
            var widget = event.currentTarget;
            UD.API_V2.call('/quizzes/' + this.options.quizId + '/assessment-answers/', {
                type: "POST",
                data: {
                    duration: 0,
                    response: JSON.stringify(response),
                    assessment: widget.assessmentId
                },
                success: function(response) {
                    callback && callback(response.score, widget.correctResponse);
                }.context(this)
            });
        },
        assessmentDoneHandler: function(event) {
        	if(this.position === this.numOfAssessments) {
        		if(!this.options.instructorMode) {
        			this.quizCompleteHandler();
        		}
        		this.showResults();
        	} else {
        		this.goToQuestion(this._getPosition() + 1);
        	}
        },
        showResults: function(event) {
        	event && event.preventDefault();
    		this.goToResultsPage();
    		this.createFinalResultsPage();
        },
        resetAnswers: function(event) {
            event && event.preventDefault();
            UD.API_V2.call('/users/me/subscribed-courses/' + this.courseId + '/completed-quizzes/' + this.quiz.user_completed.id, {
                type: "DELETE",
                success: function() {
                    this.quiz.user_completed = null;
                    $.event.trigger('quizProgressChanged', [this.options.quizId]);
                    this.element.trigger('quizResetted', {quizId: this.options.quizId});
                }.context(this)
            });
        },
        markAsViewed: function() {
            UD.API_V2.call('/users/me/subscribed-courses/' + this.courseId +
                '/quizzes/' + this.options.quizId + '/view-logs',
                { type: "POST" }
            );
        },
        setPositionHandler: function() {

        },
        _getPosition: function(){
            return this.position;
        },
        _setPosition: function(pos){
        	this.position = pos;
        },
        getTotal: function(){
            return this.total;
        },
        renderPosition: function(position){
            return null;
        },
        _renderTime:function(seconds){
            return "";
        },
        _renderPage:function(pageNumber){
            if(pageNumber>=0){
                return 'Page ' + pageNumber;
            } else {
                return "";
            }
        },
        registerQuizListeners: function() {
            $(".quiz-navigation .ddown ul a", this.element).live("click", function(event) {
            	event.preventDefault();
            	event.stopPropagation();
            	var btn = $(event.currentTarget);
            	var questionPos = parseInt($(".num", btn).html());
            	var $ddown = btn.parents(".ddown").eq(0);
            	$("> a .current", $ddown).text(questionPos);
            	$ddown.removeClass("on");
            	this.goToQuestion(questionPos);
            }.context(this));
        },
        goToQuestion: function(pos, event){
        	event && event.preventDefault();
        	this._setPosition(pos);
            if(pos == 0) {
            	this.quizNavigation.addClass("none");
            } else {
            	this.quizNavigation.removeClass("none");
            }
            if(this.options.viewFinalPage) {
            	this.quizNavigationBackBtn.removeClass("none");
            } else {
            	this.quizNavigationBackBtn.addClass("none");
            }
            $(".ddown > a .current", this.quizNavigation).text(pos);
        	var perc = -100*pos+"%";
            this.quizViewer.css("left",perc);
        },
        _startQuiz: function(event) {
        	event && event.preventDefault();
        	this.goToQuestion(1);
        	this.quizNavigation.removeClass("none");
        },
        goToResultsPage: function(event) {
        	event && event.preventDefault();
        	var resultsPagePos = this.numOfAssessments + 1;
    		this.quizNavigation.addClass("none");
        	var perc = -100*resultsPagePos+"%";
            this.quizViewer.css("left",perc);
        },
        _getAnalyticsTrackingCode: function() {
        	UD.API.call('/quizzes/' + this.options.quizId + '/tracking-code', {
        		success: function(response) {
        			this.element.append(response.code);
        		}.context(this)
        	});
        }
    });
});
