import { editorSettings as setting } from '../const/SettingDefault'

class EditorInitial {
    initEditor (id) {
        const { settings } = this;
        let editor

        if (typeof id.nodeName !== 'undefined') {
            const element = id;
            editor = id;
            id = element.id.length > 0 ? element.id : settings.id;
        } else {
            id               = (typeof id === "object") ? settings.id : id;

            // editor           = this.editor       = $("#" + id);
            editor = document.getElementById(id)
        }
        this.id = id

        this.editor = editor;

        this.classNames   = {
            textarea : {
                html     : setting.getClassName(`html-textarea`),
                markdown : setting.getClassName(`markdown-textarea`)
            }
        };

        if (editor === null) {
            console.error(`==== error here id=${id}`)
            console.trace()
            return;
        }
        if (editor.classList.contains("editormd") !== true) {
            editor.classList.add("editormd");
        }

        editor.classList.add(setting.getClassName(`vertical`))

        if (settings.theme !== "") {
            editor.classList.add(setting.getClassName(`theme-${settings.theme}`));
        }

        editor.style.width = (typeof settings.width  === "number") ? settings.width  + "px" : settings.width;
        editor.style.height = (typeof settings.height  === "number") ? settings.height  + "px" : settings.height;

        if (settings.autoHeight) {
            editor.style.height = `auto`;
        }

        this.editor = editor
    }

    initButtonClose () {
        const { settings, editor } = this;

        if (!settings.readOnly) {
            const closeBtn = document.createElement("A");
            closeBtn.classList.add(`fa`, `fa-close`, setting.getClassName(`preview-close-btn`))
            closeBtn.href = 'javascript:'
            editor.appendChild(closeBtn);
        }
    }

    initPreview () {
        this.previewContainer = document.createElement("div")
        this.previewContainer.classList.add(`markdown-body`, setting.getClassName('preview-container'))

        this.preview          = document.createElement("div")
        this.preview.classList.add(`${setting.classPrefix}preview`)
        this.preview.appendChild(this.previewContainer)
        this.editor.appendChild(this.preview);

        if (setting.options.previewTheme !== "") {
            this.preview.classList.add(setting.getClassName(`preview-theme-${setting.options.previewTheme}`))
        }
    }

    initSaveHtml () {
        const { saveHTMLToTextarea } = setting.options;
        const { textarea } = this.classNames;
        const { id } = this;

        if (saveHTMLToTextarea) {
            this.htmlTextarea = document.createElement("textarea")
            this.htmlTextarea.classList.add(textarea.html)
            this.htmlTextarea.name = `${id}-html-code`
            this.editor.appendChild(this.htmlTextarea);
        }
    }

    initMarkdownTextarea () {
        const { editor, id } = this;
        const settings = setting.options;
        // var markdownTextarea = this.markdownTextarea = editor.children("textarea");
        var markdownTextarea = this.markdownTextarea = editor.querySelector('textarea');

        if (markdownTextarea.length < 1) {
            editor.append("<textarea></textarea>");
            markdownTextarea = this.markdownTextarea = editor.children("textarea");
        }

        markdownTextarea.classList.add(this.classNames.textarea.markdown)
        markdownTextarea.placeholder = settings.placeholder
        // markdownTextarea.addClass(this.classNames.textarea.markdown).attr("placeholder", settings.placeholder);

        if (typeof markdownTextarea.name === "undefined" || markdownTextarea.name === "") {
            // markdownTextarea.attr("name", (settings.name !== "") ? settings.name : id + "-markdown-doc");
            markdownTextarea.name = (settings.name !== "") ? settings.name : id + "-markdown-doc"
        }

        if (settings.markdown !== "") {
            markdownTextarea.value = settings.markdown
        }

        if (settings.appendMarkdown !== "") {
            markdownTextarea.value += settings.appendMarkdown
        }
    }

    initMask () {
        const { editor } = this;

        this.containerMask = document.createElement("div")
        this.containerMask.classList.add(setting.getClassName(`container-mask`))
        editor.appendChild(this.containerMask)

        this.mask = document.createElement("div")
        this.mask.classList.add(setting.getClassName(`mask`))
        editor.appendChild(this.mask)
    }
}

export default EditorInitial;

export const editorInitial = new EditorInitial();
