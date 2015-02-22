define(["jquery-widget-init", "handlebars.helpers"], function($, Handlebars) {
    $.widget("ud.ud_multiplechoicequestionformitem", {
        options: {
            inputId: null,
            type: "bullet"
        },
        choicesList: null,

        _create: function(){
            for(var i in this.options){
                if(typeof(this.element.data(i.toLowerCase())) != 'undefined'){
                    this.options[i] = this.element.data(i.toLowerCase());
                }
            }
            this.choicesDiv = $(".choices", this.element);
            this.inputForm = $("#input-" + this.options.inputId, this.element);
            this.hiddenForm = $("#" + this.options.inputId, this.element);
            this.choicesList = $('#choices-list-' + this.options.inputId, this.choicesDiv);

            $("textarea.answer", this.choicesList).live('focus', this.answerInputOnFocus.context(this));
            $("textarea.answer-feedback", this.choicesList).live('change', this.feedbackInputOnChange.context(this));
            $(".choice-delete", this.element).live("click", this.removeChoiceOnClick.context(this));

            this._initHandlebarsTemplates();

            this.updateChoices();
        },
        _initHandlebarsTemplates: function() {
        	this.multipleChoiceQuestionFormItemInputTextTemplate = Handlebars.compile($("#multipleChoiceQuestionFormItemInputTextTemplate").html());
        },
        answerInputOnFocus: function(event) {
        	var $focusedElem = $(event.currentTarget);
        	var $inputTexts = $("textarea.answer", this.choicesList);
        	var numOfInputTexts = $inputTexts.length;
        	var currentInputIndex = $inputTexts.index($focusedElem);

        	if(currentInputIndex == numOfInputTexts - 1){
        		this.addChoice();
        	}
        },
        feedbackInputOnChange: function(event) {
            this.updateChoices();
        },
        addChoice: function(val, feedback) {
        	if(typeof val === "undefined") {
        		val = "";
        	}

            this.choicesList.append(
              this.multipleChoiceQuestionFormItemInputTextTemplate(
                {inputId: this.options.inputId, value: val, feedback:feedback}));
            this.choicesList.ud_initialize();
            this.updateChoices();
        },
        removeChoiceOnClick: function(event) {
        	event && event.preventDefault();
        	if($("li", this.choicesList).length > 1) {
            	var $choiceEl = $(event.currentTarget).parents("li").eq(0);
            	this.removeChoice($choiceEl);
        	}
        },
        removeChoice: function($choiceEl) {
        	$choiceEl.remove();
        	this.updateChoices();
        },
        addInputText: function() {
            this.choicesList.append(
              this.multipleChoiceQuestionFormItemInputTextTemplate(
                {inputId: this.options.inputId, value: ''}));
            this.choicesList.ud_initialize();
        },
        removeEmptyInputTexts: function() {
        	var $inputTexts = $("textarea.answer", this.choicesList);
            $inputTexts.each(function (index, elem) {
            	var val = $(elem).val();
            	if(!val) {
            		$(elem).parent().remove();
            	}
            }.context(this));
        },
        getChoiceContent: function(index) {
            var $inputTexts = $("textarea.answer", this.choicesList);
            var content = null;
            if(index < $inputTexts.length) {
                content = $inputTexts[index].value;
            }
            return content;
        },
        updateChoices: function() {
            var uiChoices = $(".mcqfi-sortable", this.choicesList);

            var choices = [];
            var feedbacks = [];
            uiChoices.each(function (index, elem) {
                var val = $('textarea.answer', $(elem)).val();
            	if(val) {
            		choices.push(val);
                    var feedback = $('textarea.answer-feedback', $(elem)).val();
                    feedbacks.push(feedback ? feedback : '');
            	}
            }.context(this));
            this.hiddenForm.val(JSON.stringify({"items":choices, "feedbacks":feedbacks}));
        }
    });
});
