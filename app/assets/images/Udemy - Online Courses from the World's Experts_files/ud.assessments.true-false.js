/**
 * Multiple Choice assessment provides a question box and choice list. The correct response pattern is just a string.
 * Example:
 * ["a"]
 */
define(["jquery-widget-init", "handlebars.helpers",
     "jquery.serialize-object", "ud.assessment", "ud.initializer", "ud.wysiwyg"
], function($, Handlebars) {
    $.widget("ud.ud_assessments_true_false", $.ud.ud_assessment, {
        options: {
        	instructorMode: false,
        	studentMode: false,
        	type: "true-false",
        	typeReadable: "True False"
        },
        form: null,
        _create: function() {
            $.ud.ud_assessment.prototype._create.apply(this);

            if(this.options.studentMode || this.options.editMode) {
            	var prompt = this.options.prompt;
                this.question = prompt.question;
                this.answers = prompt.answers;
                this.answerElements = {};
            } else if(this.options.instructorMode) {
            	var prompt = this.options.prompt;
                this.question = prompt.question;
                this.answers = prompt.answers;
                this.answerElements = {};
            }

            this._initHandlebarsTemplates();
        },
        _initHandlebarsTemplates: function() {
        	Handlebars.registerPartial('assessmentActionButtonTemplate', $("#assessmentActionButtonTemplate").html());
        	this.assessmentTrueFalseTemplate = Handlebars.compile($("#assessmentTrueFalseTemplate").html());
            this.assessmentTrueFalseEditorTemplate = Handlebars.compile($("#assessmentTrueFalseEditorTemplate").html());
        },
        _init: function() {
        },
        __rendered: false,
        _render: function() {
            if(this.__rendered) return;

            this.element.html(this.assessmentTrueFalseTemplate({
            					question: this.question,
            					answers: this.answers,
            					isLastAssessment: this.isLastAssessment,
            					response: this.response,
            					studentMode: this.options.studentMode,
                                relatedLecture: this.relatedLecture
            				 }));

            this.submitAnswerBtn = $(".submit-answer-btn", this.element);
            this.reviewRelatedLecture = $('.review-question-lecture', $(this.submitAnswerBtn).parent());
            this.nextBtn = $(".next-btn", this.element);
            this.finalizeBtn = $(".finalize-btn", this.element);

            this.mapOptions();
            this.applyUserResponse();
            this.registerListeners();


            this.__rendered = true;
        },
        _renderEditor: function(assessment) {
        	if(typeof assessment !== "undefined") {
        		this.element.html(this.assessmentTrueFalseEditorTemplate(assessment));
            	this.form = $("form", this.element);
            	this.element.ud_initialize({
            		onComplete: function() {
            			this.mapEditorOptions();
                		this.applyInstructorCorrectResponse();
                		this.form.submit(this.editorFormOnSubmit.context(this));
            		}.context(this)
            	});
                this.initializeRelatedLectureWidget(assessment.prompt.relatedLectureIds);
        	} else {
        		this.element.html(this.assessmentTrueFalseEditorTemplate({}));
        		this.form = $("form", this.element);
        		this.element.ud_initialize({
        			onComplete: function() {
        				this.form.submit(this.editorFormOnSubmit.context(this));
        			}.context(this)
        		});
                this.initializeRelatedLectureWidget(null);
        	}
        },
        editorFormOnSubmit: function(event) {
        	event && event.preventDefault();
        	var params = this.form.serializeObject();

        	if(typeof params.assessmentoption !== "undefined") {
        		params.correct_response = JSON.stringify([params.assessmentoption]);
            	if(this.options.editMode) {
            		params.assessmentId = this.assessmentId;
            		$(this).trigger("assessmentedited", [params, this.assessmentEditedHandler.context(this)]);
            	} else {
            		$(this).trigger("assessmentcreated", [params, this.assessmentCreatedHandler.context(this)]);
            	}
        	} else {
                window.alert("Please choose the best answer.");
        	}
        },
        assessmentCreatedHandler: function(event) {
        	this.element.remove();
        },
        assessmentEditedHandler: function(event) {
        },
        mapOptions: function() {
            $("ul.answers li", this.element).each(function(index, item) {
                this.answerElements[$(item).data("option")] = item;
            }.context(this));
        },
        mapEditorOptions: function() {
        	this.trueFalseBtnsDiv = $("#true-false-btns", this.element);
            $("input[type=radio]", this.trueFalseBtnsDiv).each(function(index, item) {
            	var val = $(item).val();
                this.answerElements[val] = item;
            }.context(this));
        },
        /**
         * If user has a response add style to answers where correct answer is green and wrong answer is red.
         */
        applyUserResponse: function() {
        	if(this.options.instructorMode) {
        		return;
        	}
            if(this.response === undefined || this.response === null) {
                return false;
            }
            var responseElement = this.answerElements[this.response[0]];
            var correctResponseElement = this.answerElements[this.correctResponse[0]];

            $.each(this.answerElements, function(letter, item) {
        		$(item).removeClass("selected");
        	});

            if(responseElement == correctResponseElement) {
                $(responseElement).addClass("correct");
            } else {
                $(responseElement).addClass("wrong");
                $(correctResponseElement).addClass("correct");
            }

            return true;
        },
        applyInstructorCorrectResponse: function() {
        	$.each(this.answerElements, function(letter, item) {
        		$(item).removeAttr("checked");
        	});
        	var correctAnswerEl = this.answerElements[this.correctResponse[0]];
        	$(correctAnswerEl).attr("checked", "checked");

        	var $redactorTextArea = $("textarea", this.element);
        	$redactorTextArea.data('ud-ud_wysiwyg').setValue(this.question);
        },
        /**
         * Registers listeners for the choice list. It doesn't register these listeners if the user has already
         * answered the assessment
         */
        registerListeners: function() {
        	if(this.options.instructorMode) {
        		this.nextBtn.on("click", this.assessmentDoneHandler.context(this));
        		$(".view-results-btn", this.element).on("click", this.assessmentDoneHandler.context(this));
        		return;
        	}
        	this.nextBtn.on("click", this.assessmentDoneHandler.context(this));
        	this.finalizeBtn.on("click", this.assessmentDoneHandler.context(this));

            if(this.response) {
                return;
            }
            $.each(this.answerElements, function(option, item) {
                $(item).click(function() {
                    this.answerClickHandler([option]);
                }.context(this));
            }.context(this));

            this.submitAnswerBtn.on("click", this.submitAnswerHandler.context(this));
        },
        deregisterListeners: function() {
        	 $.each(this.answerElements, function(option, item) {
                 $(item).unbind("click");
             }.context(this));

        	 this.submitAnswerBtn.off("click");
        },
        answerClickHandler: function(response) {
        	this.responseToSubmit = response;
        	var responseElement = this.answerElements[this.responseToSubmit[0]];
        	$.each(this.answerElements, function(letter, item) {
        		$(item).removeClass("selected");
        	});
        	$(responseElement).addClass("selected");
        },
        /**
         * Callback to listen the result returned from the backend
         *
         * @param score
         * @param correctResponse
         */
        answerResultsHandler: function(score, correctResponse) {
            this.correctResponse = correctResponse;

            var responseApplied = this.applyUserResponse();
            if(responseApplied) {
            	this.deregisterListeners();
                if(this.relatedLecture) {
                    this.reviewRelatedLecture.removeClass('none');
                }
            	$(this.submitAnswerBtn).remove();
            	if(this.isLastAssessment) {
            		$(this.finalizeBtn).removeClass("none");
            	} else {
            		$(this.nextBtn).removeClass("none");
            	}
            }
        },
        submitAnswerHandler: function(event) {
        	event && event.preventDefault();
        	event && event.stopPropagation();

            this.response = this.responseToSubmit;
            $(this).trigger("answer", [this.response, this.answerResultsHandler.context(this)]);
        },
        assessmentDoneHandler: function(event) {
        	event && event.preventDefault();
        	event && event.stopPropagation();
        	$(this).trigger("assessmentdone");
        }
    });
});
