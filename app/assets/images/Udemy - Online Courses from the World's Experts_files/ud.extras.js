define(["jquery-widget-init", "handlebars.helpers", "prettify", "ud.api"], function($, Handlebars) {
    $.widget("ud.ud_extras", {
        options: {
        	lecture: null,
            courseId: null,
            instructorPreviewMode: null,
            isInstructor: null
        },
        currentRequest: {
            lectureId: null
        },
        extrasList: null,
        extras: [],
        courseDescription: null,
        _create: function() {
            for(var i in this.options){
                if(typeof(this.element.data(i.toLowerCase())) != 'undefined'){
                    this.options[i] = this.element.data(i.toLowerCase());
                }
            }
            this._initHandlebarsTemplates();
            var $sidebar = this.element.parents(".sidebar-container").eq(0);
            this.extrasCountContainer = $(".tab-label-container .e .count-container", $sidebar);
            this.extrasCount = $(".count", this.extrasCountContainer);

            this.extrasContainer = $("#extras-container", this.element);
            this.extrasNav = $("#extras-nav", this.element);
            this.extrasSide = $("#extras-side", this.element);

        },
        destroy: function(){
        },
        removeCurrentContent: function(event) {
        	$("#side-on", this.element).removeAttr("checked");
        	this.element.removeClass("on");
        	this.extrasSide.empty();
        },
        _initHandlebarsTemplates: function() {
        	this.extrasTemplate = Handlebars.compile($("#extrasTemplate").html());
        	this.extrasContentTemplate = Handlebars.compile($("#extrasContentTemplate").html());
        	this.extrasSourceCodeContentTemplate = Handlebars.compile($("#extrasSourceCodeContentTemplate").html());
        	this.extrasContentTextTemplate = Handlebars.compile($("#extrasContentTextTemplate").html());
        	this.lectureDescriptionTemplate = Handlebars.compile($("#lectureDescriptionTemplate").html());
        },
        _initExtrasVariables: function() {
            this.options.lecture.hasExtras = false;
            this.options.lecture.interactive_materials = [];
            this.options.lecture.downloadable_materials = [];
            this.options.lecture.external_materials = [];
            this.options.lecture.lecture_files = [];
        },
        getExtras: function(lecture) {
        	this.options.lecture = lecture;
            this.currentRequest.lectureId = lecture.id;
            this._initExtrasVariables();

            UD.API.call('/lectures/' + lecture.id + '/extras/', {
                success: this.renderExtras.context(this),
                error: this.renderExtrasError.context(this)
            });
        },
        getQuizExtras: function(quizId) {
            this.currentRequest.quizId = quizId;
            UD.API.call('/quizzes/' + quizId + '/extras/', {
                success: this.renderExtras.context(this)
            });
        },
        renderExtrasError: function(jqXHR) {
            this.options.lecture.error_occurred = true;
            this.options.lecture.error_message = jqXHR.responseJSON.error.details;
            this.options.preview_mode = this.options.lecture.preview_mode;
            this.addExtrasToNav();
        },
        renderExtras: function(response) {
            this.options.lecture.error_occurred = false;
            this.options.lecture.extras = response;
            this.classifyExtras();
            if(this.options.lecture.hasExtras) {
                $(window).trigger('showSupplementaryBtn');
            } 
            else {
                $(window).trigger('hideSupplementaryBtn');
            }
            this.addExtrasToNav();

        	$("section.ext li").off("click").on("click", this.externalOnClick.context(this));
        	$("section.down li").off("click").on("click", this.downloadOnClick.context(this));
        	$("section.int li").off("click").on("click", this.interactiveOnClick.context(this));
        },
        addExtrasToNav: function() {
            this.extrasNav.html(this.extrasTemplate(this.options.lecture));
            $("pre", this.extrasNav).addClass("prettyprint");
            prettyPrint();
        },
        externalOnClick: function(event) {
        	event && event.preventDefault();
        	var assetId = $(event.currentTarget).data("id");
            this.showMaterial(assetId);
        },
        downloadOnClick: function(event) {
        	event && event.preventDefault();
        	var assetId = $(event.currentTarget).data("id");
        	var material = this.findAssetById(assetId);
        	this.downloadMaterialHandler(material);
        },
        interactiveOnClick: function(event) {
        	event && event.preventDefault();
        	var assetId = $(event.currentTarget).data("id");
            this.showMaterial(assetId);
        },
        showMaterial: function(materialId) {
        	var material = this.findAssetById(materialId);
        	if(material) {
	        	switch(material.type) {
	        		case "ExternalLink":
	        			this.externalResourceHandler(material);
	        			break;
	        		case "File":
	        			this.downloadMaterialHandler(material);
	        			break;
	        		case "SourceCode":
	        			this.sourceCodeEditorHandler(material);
	        			break;
	        	}
        	}
        },
        downloadMaterialHandler: function(asset, event) {
        	event && event.preventDefault();
            $(window).trigger('lectureDownloaded_' + this.options.lecture.id);
        	this._scrollToTop();
        	var durl = asset.download_url.download;
        	$("body").append("<iframe src='" + durl + "' style='display: none;'></iframe>");
        },
        externalResourceHandler: function(asset) {
        	this._scrollToTop();
        	$("#side-on", this.element).attr("checked", "checked");
        	this.element.addClass("on");
        	this.extrasSide.html(this.extrasContentTemplate({}));
        	$(".action.back", this.extrasSide).on("click", this.removeCurrentContent.context(this));
        	var maxWidth = $(".embedded-content", this.extrasSide).width();
        	UD.API.call('/assets/' + asset.id + '/preview/', {
        		data: {
        			maxWidth: maxWidth
        		},
                success: this.renderExternalResource.context(this)
            });
        },
        sourceCodeEditorHandler: function(asset) {
        	this._scrollToTop();
        	$("#side-on", this.element).attr("checked", "checked");
        	this.element.addClass("on");
        	this.extrasSide.html(this.extrasSourceCodeContentTemplate(asset));
        	$(".action.back", this.extrasSide).on("click", this.removeCurrentContent.context(this));
        	$(".action.download-source", this.extrasSide).on("click", this.downloadMaterialHandler.context(this, asset));
        	UD.API.call('/assets/' + asset.id + '/content/', {
                success: this.renderSourceCodeEditor.context(this, asset)
            });
        },
        renderSourceCodeEditor: function(asset, response) {
        	var html = response.html;
        	$(".side-content", this.extrasSide).html(html);
        	require(["ud.sourcecodeeditor"], function() {
                var sourceCodeEditorOptions = {};
                sourceCodeEditorOptions.asset = asset;
        		$(".ud-sourcecodeeditor", this.extrasSide).ud_sourcecodeeditor(sourceCodeEditorOptions);
        	}.context(this));
        },
        renderExternalResource: function(response) {
        	/*
        	 * 	Response format:
        	 * 	author_name: "Phoenix Fly"
				author_url: "http://vimeo.com/phoenixfly"
				cache_age: 64074
				content: null
				description: "The Need 4 Speed: The Art of Flight A collection of shots from flights made during the 2009-2010 season by the talented group of wingsuit basejumpers, while flying the V3, Hybrid LD2/Trango rigs and testing several new V-series wingsuit prototypes around Europe. Feel the need. The need for speed!"
				embeds: Array[0]
				event: Object
				favicon_url: "http://vimeo.com/favicon.ico"
				images: Array[2]
				object: Object
					duration: 386
					height: 720
					html: "<iframe src="http://player.vimeo.com/video/18150336" width="1280" height="720" frameborder="0" webkitAllowFullScreen mozallowfullscreen allowFullScreen></iframe>"
					type: "video"
					width: 1280
				duration: 386
				height: 720
				html: "<iframe src="http://player.vimeo.com/video/18150336" width="1280" height="720" frameborder="0" webkitAllowFullScreen mozallowfullscreen allowFullScreen></iframe>"
				type: "video"
				width: 1280
				__proto__: Object
				original_url: "http://vimeo.com/18150336"
				place: Object
				provider_display: "vimeo.com"
				provider_name: "Vimeo"
				provider_url: "http://vimeo.com/"
				safe: true
				title: "Wingsuit Basejumping - The Need 4 Speed: The Art of Flight"
				type: "html"
				url: "http://vimeo.com/18150336"
        	 */

        	var responseDetailsPart = response.details;
        	var responseTextPart = response.text;

        	$(".bar a.external", this.extrasSide).attr("href", responseDetailsPart.url);

        	if(responseDetailsPart.html) {
        		$(".embedded-content", this.extrasSide).html(responseDetailsPart.html);
        	}

        	responseDetailsPart.page_text_content = responseTextPart.item.description;
        	$(".text-content", this.extrasSide).html(this.extrasContentTextTemplate(responseDetailsPart));

        	//$("a", $(".text-content", this.extrasSide)).attr("target", "_blank");
        },
        classifyExtras: function() {
            var canSeeExtras =
                this.options.lecture.data.isPublished === "Yes" ||
                ( this.options.lecture.data.isPublished === "No" &&
                  this.options.isInstructor &&
                    (!this.options.instructorPreviewMode ||
                     this.options.instructorPreviewMode === "instructor"
                    )
                );

            var canSeeLectureFiles =
                !this.options.instructorPreviewMode ||
                this.options.instructorPreviewMode === "instructor" ||
                ( this.options.instructorPreviewMode === "student" &&
                  this.options.lecture.data.isDownloadable === "Yes"
                );

            if(!canSeeExtras) {
                return false;
            }

            if(this.options.lecture.extras.length > 0) {
                this.options.lecture.hasExtras = true;
            	for(var i in this.options.lecture.extras) {
            		var extra = this.options.lecture.extras[i];
            		if(extra.status === "1") {
    	    			switch(extra.type) {
    	    				case "SourceCode":
    	    					this.options.lecture.interactive_materials.push(extra);
    	    					break;
    	    				case "File":
    	    					this.options.lecture.downloadable_materials.push(extra);
    	    					break;
    	    				case "ExternalLink":
    	    					this.options.lecture.external_materials.push(extra);
    	    					break;
    	    				default:
                                if(canSeeLectureFiles) {
                                    this.options.lecture.lecture_files.push(extra);
                                }
    	    					break;
    	    			}
            		}
            	}
            }
        },
        findAssetById: function(assetId) {
        	for(var i in this.options.lecture.extras) {
        		var asset = this.options.lecture.extras[i];
        		if(asset.id == assetId) {
        			return asset;
        		}
        	}
        	return null;
        },
        _scrollToTop: function() {
        	this.element.scrollTop(0);
        }
    });
});
