/**
 * Multiple Choice assessment provides a question box and choice list. The correct response pattern is just a string.
 * Example:
 * ["a"]
 */
define(["jquery-widget-init", "handlebars.helpers",
    "jquery.serialize-object", "ud.assessment", "ud.initializer",
    "ud.multiplechoicequestionformitem", "ud.wysiwyg"
], function($, Handlebars) {
    $.widget("ud.ud_assessments_multiple_choice", $.ud.ud_assessment, {
        options: {
            courseId: null,
        	instructorMode: false,
        	studentMode: false,
        	editMode: false,
        	type: "multiple-choice",
        	typeReadable: "Multiple Choice"
        },
        form: null,
        _create: function() {
            $.ud.ud_assessment.prototype._create.apply(this);
            var prompt;
            if(this.options.studentMode ||
                this.options.editMode   ||
                this.options.instructorMode) {

                prompt = this.options.prompt;
                this.question = prompt.question;

                var answers = prompt.answers;
                var feedbacks = prompt.feedbacks;
                this.answersWithFeedbacks = [];
                for(var i in answers) {
                    var answerWithFeedback = {
                        answer: answers[i],
                        feedback: feedbacks && feedbacks[i] ? feedbacks[i] : null
                    };
                    this.answersWithFeedbacks.push(answerWithFeedback);
                }

                this.answerElements = {};
            }
            this._initHandlebarsTemplates();
        },
        _initHandlebarsTemplates: function() {
        	Handlebars.registerPartial('assessmentActionButtonTemplate', $("#assessmentActionButtonTemplate").html());
            this.assessmentMultipleChoiceTemplate = Handlebars.compile($("#assessmentMultipleChoiceTemplate").html());
            this.assessmentMultipleChoiceEditorTemplate = Handlebars.compile($("#assessmentMultipleChoiceEditorTemplate").html());
            this.editorTemplate = this.assessmentMultipleChoiceEditorTemplate;
        },
        _init: function() {
        },
        __rendered: false,
        _render: function() {
            if(this.__rendered) return;

            this.element.html(this.assessmentMultipleChoiceTemplate({
            					question: this.question,
            					answersWithFeedbacks: this.answersWithFeedbacks,
            					isLastAssessment: this.isLastAssessment,
            					response: this.response,
            					studentMode: this.options.studentMode,
                                relatedLecture: this.relatedLecture
            				 }));

            this.submitAnswerBtn = $(".submit-answer-btn", this.element);
            this.reviewRelatedLecture = $('.review-question-lecture', $(this.submitAnswerBtn).parent());
            this.nextBtn = $(".next-btn", this.element);
            this.finalizeBtn = $(".finalize-btn", this.element);

            this.mapLetters();
            this.applyUserResponse();
            this.registerListeners();


            this.__rendered = true;
        },
        _renderEditor: function(assessment) {
        	if(typeof assessment !== "undefined") {
        		this.element.html(this.editorTemplate({}));
        		this.element.ud_initialize({
        			onComplete: function() {
        				this.form = $("form", this.element);
                		this.form.submit(this.editorFormOnSubmit.context(this));
                		var answers = assessment.prompt.answers;
                		var feedbacks = assessment.prompt.feedbacks;
                		var widget = this.getMultipleChoiceQuestionFormItemWidget();
                		widget.removeEmptyInputTexts();
                		for(var i in answers) {
                            var feedback = feedbacks && feedbacks[i] ? feedbacks[i] : '';
                			widget.addChoice(answers[i], feedback);
                		}
                		widget.addInputText();
                		this.mapEditorLetters();
                		this.applyInstructorCorrectResponse();
                        this.initializeRelatedLectureWidget(assessment.prompt.relatedLectureIds);
        			}.context(this)
        		});
        	} else {
        		this.element.html(this.editorTemplate({}));
        		this.element.ud_initialize({
        			onComplete: function() {
        				this.form = $("form", this.element);
                		this.form.submit(this.editorFormOnSubmit.context(this));
        			}.context(this)
        		});
        		//$("#choices-list-answers li input[type=radio]", this.form).eq(0).attr("checked", "checked");
                this.initializeRelatedLectureWidget(null);
        	}
        },
        _renderEditEditor: function() {

        },
        _getCorrectResponseLetter: function() {
        	var $allRadioBtns = $("input[type=radio]", this.form);
        	var $checkedRadioBtn = $("input[type=radio]:checked", this.form);
        	var correctResponseLetter = null;
        	if($checkedRadioBtn.length > 0) {
            	var checkedRadioBtnIndex = $allRadioBtns.index($checkedRadioBtn);
                var letterA = 'a'.charCodeAt(0);
                correctResponseLetter = String.fromCharCode(letterA + checkedRadioBtnIndex);
        	}
        	return correctResponseLetter;
        },
        /**
         * Converting the given letter to the index,
         * e.g. 'a' => 0, 'b' => 1
         *
         * @todo: Think about refactoring: The logics here are complicated, have hard time
         * understanding them. The all letter related logics may have to
         * go in ud.multiplechoicequestionformitem.js
         * @author Cuneyt Mertayak & Inanc Sevinc
         *
         * @param letter
         * @private
         */
        _letterToIndex: function(letter) {
            return letter.charCodeAt(0) - 'a'.charCodeAt(0);
        },
        editorFormOnSubmit: function(event) {
        	event && event.preventDefault();
    		var multipleChoiceQuestionFormItemWidget = this.getMultipleChoiceQuestionFormItemWidget();
    		multipleChoiceQuestionFormItemWidget.updateChoices();

        	var params = this.form.serializeObject();

            var itemsArray = $.parseJSON(params.answers).items;
            if($.isEmptyObject(itemsArray)) {
                return false;
            }

            var correctResponseLetter = this._getCorrectResponseLetter();
            if(correctResponseLetter) {
                params.correct_response = JSON.stringify([correctResponseLetter]);
                var answers = JSON.parse(params.answers);
                params.answers = JSON.stringify(answers.items);
                params.feedbacks = JSON.stringify(answers.feedbacks);
                var correctResponseIndex = this._letterToIndex(correctResponseLetter);
                if(!multipleChoiceQuestionFormItemWidget.getChoiceContent(correctResponseIndex)) {
                    if(this.options.editMode) {
                        window.alert("Correct answer cannot be empty!");
                    }
                    return false;
                }

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
        /**
         * Give letter names to choices
         */
        mapLetters: function() {
            var letterA = 'a'.charCodeAt(0);
            $("ul.answers li", this.element).each(function(index, item) {
                var letter = String.fromCharCode(letterA + index);
                this.answerElements[letter] = item;
            }.context(this));
        },
        mapEditorLetters: function() {
        	var letterA = 'a'.charCodeAt(0);
            $("ul#choices-list-answers li", this.element).each(function(index, item) {
                var letter = String.fromCharCode(letterA + index);
                this.answerElements[letter] = item;
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

            $(correctResponseElement).addClass("correct", 300);
            var correctFeedback = $('p', $(correctResponseElement));
            this.showFeedbackWithTransition(correctFeedback);

            if(responseElement != correctResponseElement) {
                $(responseElement).addClass("wrong", 300);
                var responseFeedback = $('p', $(responseElement));
                this.showFeedbackWithTransition(responseFeedback);
            }

            return true;
        },
        showFeedbackWithTransition: function(feedbackElem) {
            if(feedbackElem.text()) {
                feedbackElem.hide();
                feedbackElem.removeClass('none');
                feedbackElem.show(300);
            }
        },
        applyInstructorCorrectResponse: function() {
        	$.each(this.answerElements, function(letter, item) {
        		$("input[type=radio]", $(item)).removeAttr("checked");
        	});
        	var $correctAnswerEl = this.answerElements[this.correctResponse[0]];
        	$("input[type=radio]", $correctAnswerEl).attr("checked", "checked");

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
            $.each(this.answerElements, function(letter, item) {
                $(item).click(function() {
                    this.answerClickHandler([letter]);
                }.context(this));
            }.context(this));

            this.submitAnswerBtn.on("click", this.submitAnswerHandler.context(this));
        },
        deregisterListeners: function() {
        	 $.each(this.answerElements, function(letter, item) {
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
        },
        getMultipleChoiceQuestionFormItemWidget: function() {
        	var $multipleChoiceQuestionFormItemEl = $(".ud-multiplechoicequestionformitem", this.element);
        	return $multipleChoiceQuestionFormItemEl.data("ud-ud_multiplechoicequestionformitem");
        }
    });
});
