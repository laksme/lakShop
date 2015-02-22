/**
 * Coding Challenge assessment provides an editable code that you need to run
 */
define(["jquery-widget-init", "handlebars.helpers",
    "jquery.serialize-object", "ud.assessment", "ud.initializer"
], function($, Handlebars) {
    $.widget("ud.ud_assessments_coding_challenge", $.ud.ud_assessment, {
        options: {
        	instructorMode: false,
        	studentMode: false,
        	editMode: false,
        	type: "coding-challenge",
        	typeReadable: "Coding Challenge",
            mode: "js"
        },
        form: null,
        files: [],
        FileTypes: {
            studentFile: "student-file",
            validator: "validator",
            solution: "solution"
        },
        _create: function() {
            $.ud.ud_assessment.prototype._create.apply(this);

            if(this.options.studentMode || this.options.editMode || this.options.instructorMode) {
                this.question = this.options.prompt.question;
            }

            this._initHandlebarsTemplates();
        },
        _initHandlebarsTemplates: function() {
            //Handlebars.registerPartial('assessmentActionButtonTemplate', $("#assessmentActionButtonTemplate").html());
            this.assessmentCodingChallengeTemplate = Handlebars.compile($("#assessmentCodingChallengeTemplate").html());
            this.assessmentCodingChallengeEditorTemplate = Handlebars.compile($("#assessmentCodingChallengeEditorTemplate").html());
            this.assessmentJavascriptTemplate = Handlebars.compile($("#assessmentJavascriptProjectRunnerTemplate").html());
            this.assessmentCodingChallengeFilesTabTemplate = Handlebars.compile($("#assessmentCodingChallengeFilesTabTemplate").html());
        },
        _init: function() {
        },
        __rendered: false,
        _render: function() {
            if(this.__rendered) return;


            this.files = this.getDefaultStudentFiles();

            this.element.html(this.assessmentCodingChallengeTemplate({
                question: this.options.prompt.question,
                instructions: this.options.prompt.instructions,
                files: this.files
            })).ud_initialize();

            this.$fileTabs=$("ul.js-files", this.element);
            this.$successBar=$(".success-bar", this.element);
            this.$errorBar=$(".error-bar", this.element);
            this.$errorMessageBox= $(".message", this.$errorBar);

            this.$nextBtn = $(".next-button", this.element);
            this.$submitButton = $(".js-submit-button", this.element);

            this.renderFileTabs(this.files);
            this._registerEvents();

            require(["ace"], this.loadEditor.bind(this));

            this.__rendered = true;
        },
        _getFileIndexByName: function(fileName){
            for(var i in this.files){
                if(fileName==this.files[i].file_name){
                    return i;
                }
            }
            return null;
        },
        _getFileByName: function(fileName){
            var ind = this._getFileIndexByName(fileName);
            return ind ? this.files[ind] : null;
        },
        _getEvaluationCode: function(){
            var type = this.FileTypes.validator;
            var validators= this.options.prompt.files.filter(function(file){return file.type==type});
            if(validators){
                return validators[0].content;
            }
        },
        getDefaultStudentFiles: function () {
            // we want to deep clone the files array instead of jsut using a part of it
            var type = this.FileTypes.studentFile;
            return $.extend(true, {}, this.options.prompt.files.filter(function (obj) {
                return obj.type == type
            }));
        },
        _getAceEditorModeByFileName: function(file){
            var extension="js";
            var matches;
            if(matches=file.match(/\.([^\.]+)$/)){
                extension = matches[1];
            }

            switch(extension){
                case "htm":
                case "html":
                    return "ace/mode/html";
                case "js":
                    return "ace/mode/javascript";
                case "css":
                    return "ace/mode/css";
                case "php":
                    return "ace/mode/php";
                case "rb":
                    return "ace/mode/ruby";
                case "py":
                    return "ace/mode/python";
                default:
                    return "ace/mode/javascript";
            }

        },
        enableTab: function(tab){
            $("li", this.$fileTabs).removeClass("active");
            if(this.activeFile=this._getFileByName(tab.text())){
                tab.addClass("active");
                this.editorDocument.setValue(this.activeFile.content);
                this.editor.getSession().setMode(this._getAceEditorModeByFileName(this.activeFile.file_name));
            } else {
                // something went wrong
            }
        },
        fileEditHandler: function(){
            if(this.activeFile){
                this.activeFile.content = this.editor.getSession().getValue();
            }
        },
        loadEditor: function() {
            var editorDom = $(".js-ace-code-editor", this.element);
            this.editor = ace.edit(editorDom[0]);
            //this.editor.setTheme("ace/theme/twilight");
            this.editor.getSession().setMode("ace/mode/html");
            this.editor.setHighlightActiveLine(false);
            this.editor.setShowPrintMargin(false);
            this.editorDocument = this.editor.getSession().getDocument();
            this.editor.on("change", this.fileEditHandler.bind(this));
            this.enableTab($("li",this.$fileTabs).eq(0));
        },

        _registerEvents: function(){
            this.$fileTabs.on("click", "li" ,function(event){
                this.enableTab($(event.currentTarget));
            }.bind(this));

            this.form = $("form", this.element);
            this.form.submit(this.editorFormOnSubmit.bind(this));

            $(".js-rename-button", this.element).click(this.renameButtonHandler.bind(this));
            $(".js-remove-button", this.element).click(this.removeButtonHandler.bind(this));
            $(".js-new-file-button", this.element).click(this.newFileButtonHandler.bind(this));
            $(".js-reset-button", this.element).click(this.resetButtonHandler.bind(this));

            this.$submitButton && this.$submitButton.click(this.submitButtonHandler.bind(this));
            this.$errorBar && $(".js-close-button", this.$errorBar).click(this.hideError.bind(this));
            this.$nextBtn && this.$nextBtn.on("click", this.assessmentDoneHandler.bind(this));
        },
        editorFormOnSubmit: function(event) {
            event && event.preventDefault();
            var params = this.form.serializeObject();

            params.correctResponse = JSON.stringify(["1"]);
            params.files=this.files;

            if(this.options.editMode) {
                params.assessmentId = this.assessmentId;
                $(this).trigger("assessmentedited", [params, this.assessmentEditedHandler.bind(this)]);
            } else {
                $(this).trigger("assessmentcreated", [params, this.assessmentCreatedHandler.bind(this)]);
            }

        },
        getDefaultFiles: function(){
            return [
                {
                    file_name: "index.js",
                    content: "//initial code that the students will see",
                    type: this.FileTypes.studentFile
                },
                /*{
                    file_name: "index.html",
                    content: "<!DOCTYPE html>\n<html>\n\t<head>\n\t\t<title></title>\n\t</head>\n\t<body></body>\n</html>",
                    type: this.FileTypes.studentFile
                },*/
                {
                    file_name: "Solution",
                    content: "",
                    type: this.FileTypes.solution
                },
                {
                    file_name: "Evaluation Code",
                    content: "//return \"some error text\"\n//return true;",
                    type: this.FileTypes.validator
                }
            ];
        },
        _renderEditor: function() {
            if(this.__rendered) return;

            if(typeof this.options.prompt == 'undefined'){
                this.options.prompt = {};
            }

            if((typeof this.options.prompt.files == 'undefined') || this.options.prompt.files.length<1){
                this.files = this.getDefaultFiles();
            } else {
                this.files=this.options.prompt.files;
            }

            if(this.files.length>0){
                this.files[0].active=true;
            }

            this.element.html(this.assessmentCodingChallengeEditorTemplate({
                files: this.files
            })).ud_initialize();

            this.$fileTabs=$("ul.js-files", this.element);



            this.renderFileTabs(this.files);
            this._registerEvents();

            require(["ace"], this.loadEditor.bind(this));
            $("#question", this.element).val(this.options.prompt && this.options.prompt.question);
            $("#instructions", this.element).val(this.options.prompt && this.options.prompt.instructions);


            this.__rendered = true;
        },
        renderFileTabs: function(files){
            this.$fileTabs.html(this.assessmentCodingChallengeFilesTabTemplate({files: files}));
        },
        assessmentCreatedHandler: function(event) {
            this.element.remove();
        },
        assessmentEditedHandler: function(event) {
        },
        removeButtonHandler: function(event){
            if(confirm("Are you sure?") && (this.activeFile.type=='student-file')){
                var ind=this._getFileIndexByName(this.activeFile.file_name);
                this.files.splice(ind,1);
                this.renderFileTabs(this.files);
                this.enableTab($("li",this.$fileTabs).eq(0));
            } else {
                alert("You can't delete the solution and validator files");
            }
        },
        renameButtonHandler: function(event){
            var fileName=this.activeFile.file_name;
            if(fileName = prompt("Please enter the name of the new file", fileName)){
                this.activeFile.file_name=fileName;
                this.renderFileTabs(this.files);
                this.editor.getSession().setMode(this._getAceEditorModeByFileName(this.activeFile.file_name));
            }
        },
        newFileButtonHandler: function(event){
            var fileName=prompt("Please enter the name of the new file", "");
            if(fileName){
                var type=this.FileTypes.studentFile;
                var numStudentFiles=this.files.filter(function(obj){return obj.type==type}).length;
                this.files.splice(numStudentFiles,0, {file_name:fileName, content:"", type:this.FileTypes.studentFile});
                this.renderFileTabs(this.files);
                this.enableTab($("li", this.$fileTabs).eq(numStudentFiles));
            }
        },
        submitButtonHandler: function(event){
            var evaluationCode = this._getEvaluationCode();
            if(evaluationCode){
                this.run(this.options.mode, this.files, evaluationCode);
            } else {
                alert("Evaluation code can't be loaded");
            }
        },
        answerResultsHandler: function(score, correctResponse) {

        },
        resetButtonHandler: function(event){
            if(confirm("Are you sure? You will lose the change you have done in this file.")){
                this.files=this.getDefaultStudentFiles();
                this.renderFileTabs(this.files);
                this.enableTab($("li",this.$fileTabs).eq(0));
            }
        },
        assessmentDoneHandler: function(event) {
            event && event.preventDefault();
            event && event.stopPropagation();
            $(this).trigger("assessmentdone");
        },

        run: function(mode, files, evaluationCode){
            this.$submitButton.attr('disabled', 'disabled');
            this.hideError();

            var output = this.runChallengeLogic(mode, files, evaluationCode);

            if(output.passed){
                this.showSuccess();
                $(this).trigger("answer", [["1"], this.answerResultsHandler.bind(this)]);
            } else {
                this.showError(output.errorMessage);
            }

            this.$submitButton.removeAttr('disabled');
        },
        showError: function(errorMessage){
            this.$errorMessageBox.html("<b>Oops, try again.</b> " + errorMessage);
            this.$errorBar.css("bottom", "45px").css("opacity", "1");
        },
        hideError: function(){
            this.$errorBar.css("bottom", "40px").css("opacity", "0");
        },
        showSuccess: function(){
            this.$successBar.css("bottom", "0");
        },
        runChallengeLogic: function(mode, files, evaluationCode){
            var output;
            switch(mode){
                default:
                    output = this.runJavascriptChallenge(files[0], evaluationCode);
            }
            return output;
        },
        runJavascriptChallenge: function(file, evaluationCode){
            var salt = Math.random();
            var finalCode=this.assessmentJavascriptTemplate({
                code: file.content,
                evaluationCode: evaluationCode,
                salt: salt
            });
            try{
                eval(finalCode);
                if(typeof(output)=='object' || output.salt==salt){
                    return {
                        passed: output.result===true,
                        errorMessage: output.result===true ? null :
                            output.result===false ? "Your code didn't work as expected." :
                                output.result
                    };
                } else {
                    return {
                        passed: false,
                        errorMessage: typeof(output)!=='undefined' ? "Your code is not supposed to return anything." :
                            "There was an error in your syntax."
                    }
                }
            } catch (e){
                window.lastError=e;
                return {
                    passed: false,
                    errorMessage: "There is a syntax error in your code: '"+ e.message+"' "
                }
            }

        }
    });
});
