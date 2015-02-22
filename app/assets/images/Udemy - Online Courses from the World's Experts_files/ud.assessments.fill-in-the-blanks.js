/**
 * Example:
 * ["a"]
 */
define(["jquery-widget-init", "handlebars.helpers",
    "jquery.serialize-object", "ud.assessment", "ud.initializer", "ud.wysiwyg"
], function($, Handlebars) {
    "use strict";
    $.widget("ud.ud_assessments_fill_in_the_blanks", $.ud.ud_assessment, {
        options: {
            instructorMode: false,
            studentMode: false,
            type: "fill-in-the-blanks",
            typeReadable: "Fill in the Blanks"
        },
        _create: function() {
            $.ud.ud_assessment.prototype._create.apply(this);
            if(this.options.studentMode || this.options.editMode || this.options.instructorMode) {
                var prompt = this.options.prompt;
                this.question = prompt.question;
                this.answers = prompt.answers;
                this.answerElements = {};
            }
            this._initHandlebarsTemplates();
        },
        _initHandlebarsTemplates: function() {
            Handlebars.registerPartial("assessmentActionButtonTemplate", $("#assessmentActionButtonTemplate").html());
            this.assessmentFillInTheBlanksTemplate = Handlebars.compile($("#assessmentFillInTheBlanksTemplate").html());
            this.assessmentFillInTheBlanksEditorTemplate = Handlebars.compile($("#assessmentFillInTheBlanksEditorTemplate").html());
            this.assessmentFillInTheBlanksUserResponseResultTemplate = Handlebars.compile($("#assessmentFillInTheBlanksUserResponseResultTemplate").html());
        },
        _init: function() {
        },
        __rendered: false,
        _render: function() {
            if(this.__rendered) return;

            this.parseQuestionForLoad();

            this.element.html(this.assessmentFillInTheBlanksTemplate({
                question: this.question,
                isLastAssessment: this.isLastAssessment,
                response: this.response,
                studentMode: this.options.studentMode,
                relatedLecture: this.relatedLecture
            }));

            this.submitAnswerBtn = $(".submit-answer-btn", this.element);
            this.reviewRelatedLecture = $(".review-question-lecture", $(this.submitAnswerBtn).parent());
            this.nextBtn = $(".next-btn", this.element);
            this.finalizeBtn = $(".finalize-btn", this.element);
            this.questionText = $(".question-text", this.element);
            this.applyUserResponse();
            this.registerListeners();


            this.__rendered = true;
        },
        _renderEditor: function(assessment) {
            if(typeof assessment !== "undefined") {
                this.element.html(this.assessmentFillInTheBlanksEditorTemplate(assessment));
                this.form = $("form", this.element);
                this.element.ud_initialize({
                    onComplete: function() {
                        this.applyInstructorCorrectResponse();
                        this.form.submit(this.editorFormOnSubmit.context(this));
                    }.context(this)
                });
                this.initializeRelatedLectureWidget(assessment.prompt.relatedLectureIds);
            } else {
                this.element.html(this.assessmentFillInTheBlanksEditorTemplate({}));
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
            params = this.parseQuestionForSave(params);

            if($.isEmptyObject(params.question)) {
                return false;
            }
            if($.isEmptyObject(params.correct_response)) {
                return false;
            }

            params.correct_response = JSON.stringify(params.correct_response);

            if(this.options.editMode) {
                params.assessmentId = this.assessmentId;
                $(this).trigger("assessmentedited", [params, this.assessmentEditedHandler.context(this)]);
            } else {
                $(this).trigger("assessmentcreated", [params, this.assessmentCreatedHandler.context(this)]);
            }
        },
        assessmentCreatedHandler: function() {
            this.element.remove();
        },
        assessmentEditedHandler: function() {

        },
        /**
         * Give letter names to choices
         */
        getUserResponse: function() {
            var userResponse = [];
            $("input[type=text]", this.questionText).each(function(key, inputEl) {
                var inputValue = $(inputEl).val();
                userResponse.push($.trim(inputValue));
            });
            return userResponse;
        },
        /**
         * If user has a response add style to answers where correct answer is green and wrong answer is red.
         */
        applyUserResponse: function() {
            if(this.options.instructorMode) {
                return;
            }
            if(typeof this.response === undefined || this.response === null) {
                return false;
            }

            for(var i in this.response) {
                var $inputText = $("input[data-order=" + i + "]", this.questionText);
                $inputText.after($(this.assessmentFillInTheBlanksUserResponseResultTemplate({order: i})));
                var userResponse = $.trim(this.response[i].replace(/\s{2,}/g, " ")).toLowerCase();
                var correctResponse = $.trim(this.correctResponse[i].replace(/\s{2,}/g, " ")).toLowerCase();
                if(userResponse === correctResponse) {
                    $(".correct-answer[data-order=" + i +"]", this.questionText).text(userResponse).removeClass("none");
                } else {
                    $(".wrong-answer[data-order=" + i +"]", this.questionText).text(userResponse ? userResponse : "X").removeClass("none");
                    $(".correct-answer[data-order=" + i +"]", this.questionText).text(correctResponse).removeClass("none");
                }
                $inputText.addClass("none");

            }

            return true;
        },
        applyInstructorCorrectResponse: function() {
            var $redactorTextArea = $("textarea", this.element);
            this.question = this.parseQuestionForEditOrPreview(this.question, this.correctResponse);
            $redactorTextArea.data("ud-ud_wysiwyg").setValue(this.question);
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

            this.submitAnswerBtn.on("click", this.submitAnswerHandler.context(this));
        },
        deregisterListeners: function() {
             this.submitAnswerBtn.off("click");
        },
        /**
         * Callback to listen the result returned from the backend
         *
         * @param correctResponse
         */
        answerResultsHandler: function(score, correctResponse) {
            this.correctResponse = correctResponse;

            var responseApplied = this.applyUserResponse();

            if(responseApplied) {
                this.deregisterListeners();
                if(this.relatedLecture) {
                    this.reviewRelatedLecture.removeClass("none");
                }
                $(this.submitAnswerBtn).remove();
                if(this.isLastAssessment) {
                    $(this.finalizeBtn).removeClass("none");
                } else {
                    $(this.nextBtn).removeClass("none");
                }
            }
        },
        parseQuestionForLoad: function() {
            this.question = this.question.replace(/<u-blank/g, "<input type=\"text\"")
                                         .replace(/<\/u-blank>/g,"");
        },
        parseQuestionForEditOrPreview: function(input, correctResponse) {
            for(var i in correctResponse) {
                var current = correctResponse[i];
                var patternFrom = "<u-blank data-order=\""+ i +"\"></u-blank>";
                var patternTo = "__" + current + "__";
                var patternToRemove = "/<\/u-blank>/";
                input = input.replace(patternFrom, patternTo)
                             .replace(patternToRemove,"");
            }
            return input;
        },
        replaceBlanksWithUBlanks: function(needle, haystack, order) {
            return haystack.replace(needle, "<u-blank data-order=\""+ order +"\"></u-blank>");
        },
        searchBlanksInString: function(input) {
            var regExp = /__[^]+?__/gm;
            return input.match(regExp);
        },
        removeUnderscoresFromString: function(input) {
            return input.replace(/__/g, "");
        },
        parseQuestionForSave: function(params) {
            var question = $.trim(params.question);
            var correctResponse = [];
            // href and src attribute values can contain __, so remove html tags
            // before searching for blanks in the question
            var matches = this.searchBlanksInString($(question).text());
            for(var i in matches) {
                correctResponse.push($.trim(this.removeUnderscoresFromString(matches[i])));
                question = this.replaceBlanksWithUBlanks(matches[i], question, i);
            }
            params.question = question;
            params.correct_response = correctResponse;
            return params;
        },
        submitAnswerHandler: function(event) {
            event && event.preventDefault();
            event && event.stopPropagation();

            this.response = this.getUserResponse();
            $(this).trigger("answer", [this.response, this.answerResultsHandler.context(this)]);
        },
        assessmentDoneHandler: function(event) {
            event && event.preventDefault();
            event && event.stopPropagation();
            $(this).trigger("assessmentdone");
        }
    });
});
