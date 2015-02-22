define(["jquery-widget-init", "ud-link", "redactor"], function($, udLink) {
    'use strict';
    $.widget("ud.ud_wysiwyg", {
        options: {
            theme: 'simple',
            buttons: '',
            focus: false,
            autoresize: false,
            lang: 'en',
            convertDivs: true,
            convertLinks: true,
            linkEmail: true,
            linkNofollow: true,
            imageUpload: '/upload/image',
            imageUploadCallback: function(obj, json) {}
        },
        _getDefaultButtons: function(theme){
            switch(theme){
                case 'simple':
                    return ['bold', 'italic', 'deleted', '|', 'unorderedlist', 'orderedlist', 'html', '|', 'link' ,'image'];
                case 'simple-without-html':
                    return ['formatting', 'bold', 'italic', 'deleted', '|', 'unorderedlist', 'orderedlist', '|', 'link' ,'image'];
                case 'simple-without-image':
                    return ['bold', 'italic', 'deleted', '|', 'unorderedlist', 'orderedlist', 'html', '|', 'link'];
                case 'simple-without-link':
                    return ['bold', 'italic', 'deleted', '|', 'unorderedlist', 'orderedlist', 'html', '|', 'image'];
                case 'simple-without-image-link':
                    return ['bold', 'italic', 'deleted', '|', 'unorderedlist', 'orderedlist', 'html'];
                case 'advanced':
                    return ['formatting', 'bold', 'italic', 'deleted', '|', 'alignleft', 'aligncenter', 'alignright', 'justify', '|', 'outdent', 'indent', '|', 'unorderedlist', 'orderedlist', '|', 'image', 'html', '|', 'link'];
                default:
                    return undefined;
            }
        },
        _create: function(){
            this.newId=this.element.attr("id")+"_"+Math.round(1000*Math.random());
            this.element.attr("id", this.newId);

            $.extend(this.options, this.element.data());

            this._addCsrfToImageUploadUrl();

            this.options.buttons = this._getDefaultButtons(this.options.theme);
            if(this.options.theme === 'simple-without-html') {
                this.options.formattingTags = ['p','blockquote','pre'];
            }

            /** require() is async. In some cases, such as when you setValue(defaultText) this Redactor
             *  widget, the render() callback does not start until after setValue finishes, resulting in
             *  redactor being undefined at the time setValue was called. This solution only loads
             *  language settings if they are not already loaded (English is loaded by default). In
             *  theory, this will not work if you setValue(defaultText) the very first time
             *  any widget is created (and language settings are not loaded), but in practice at least
             *  one instance of this widget is created before setValue can be called.
             */
            if ($.Redactor.opts.langs[this.options.lang]) {
                // if language settings exist, render normally
                this.render();
            } else {
                // load language settings, should only land in this case once
                require(
                    [udLink.toJs('libs/redactor/langs/' + this.options.lang + '.js')],
                    $.proxy(this.render, this)
                );
            }

        },
        _addCsrfToImageUploadUrl: function() {
            var a = document.createElement('a');
            a.href = this.options.imageUpload;
            var separator = '?';
            if (a.search.length > 0) {
                separator = '&';
            }
            this.options.imageUpload = this.options.imageUpload + separator +
                'csrf=' + encodeURIComponent(UD.request.csrf);
        },
        render: function() {
            this.element.redactor(this.options);
        },
        getValue: function() {
            if(this.element.data("redactor")) {
                return this.element.data("redactor").get();
            }
        },
        setValue: function(value) {
            if(this.element.data("redactor")) {
                /**
                 *  The 3rd argument fixes a specific placeholder problem:
                 *  When you had a placeholder at a redactor area and later set
                 *  the value of the redactor field programmatically,
                 *  redactor didn't understand you actually set a value and
                 *  was treating the new value as a placeholder
                 *  (i.e. deleting it when you click with mouse).
                 *  @author cansinyildiz
                 */
                value = value ? value.trim() : '';
                this.element.data("redactor").set(value,  true, value ? true : false);
                /** */
            }
        },
        destroy: function(){
            this.element.destroyEditor();
            $.Widget.prototype.destroy.call( this );
        }
    });
});
