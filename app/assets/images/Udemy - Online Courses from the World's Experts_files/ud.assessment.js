/**
 * Assessment is the base class for all different types of assessments like multiple choice etc.
 */
define(["jquery-widget-init", "handlebars.helpers", "ud.api"], function($, Handlebars) {
    $.widget("ud.ud_assessment", {
        options: {
        },
        /**
         * Call this function when you extend assessment base class
         * @private
         */
        _create: function() {
            for(var i in this.options){
                if(typeof(this.element.data(i.toLowerCase())) != 'undefined'){
                    this.options[i] = this.element.data(i.toLowerCase());
                }
            }
            this.quizId = this.options.quizId;
            this.assessmentId = this.options.assessmentId;
            this.responseToSubmit = this.options.response;
            this.response = this.options.response;
            this.correctResponse = this.options.correctResponse;
            this.isLastAssessment = this.options.isLastAssessment;
            this.relatedLecture = this.options.relatedLectures && this.options.relatedLectures.length ?
                this.options.relatedLectures[0] : null;
        },
        _init: function() {
        },

        destroy: function(){
        },
        render: function() {
            this._render();
        },
        renderEditor: function(assessment) {
        	this._renderEditor(assessment);
        },
        deleteAssessment: function(event) {
        	event && event.preventDefault();
        	return false;
        },
        initializeRelatedLectureWidget: function(relatedLectureIds) {
            this.relatedLectureIds = relatedLectureIds;
            this.relatedLectureInput = $('.related-lecture', this.element);
            this.getLectures();
        },
        getLectures: function() {
            UD.API.call('/courses/' + this.options.courseId + '/lectures', {
                type: "GET",
                success: this.lecturesLoaded.bind(this)
            });
        },
        lecturesLoaded: function(data) {
            $.each(data, function(index, elem) {
                this.relatedLectureInput.append($("<option />").val(elem.id).text(elem.title));
            }.context(this));
            if(this.relatedLectureIds && this.relatedLectureIds.length) {
                this.relatedLectureInput.val(this.relatedLectureIds[0]);
            }
        }
    });
}); 