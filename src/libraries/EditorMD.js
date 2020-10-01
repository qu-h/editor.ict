import {
    settingDefault,
    classPrefix,
    toolbarModes
} from '../const/SettingDefault'

import { loadQueues, loadCSS, loadScript, loadedDisplay } from '../prototypes/loader'
import {
    setCodeMirrorTheme,
    setCodeMirror,
    getCodeMirrorOption,
    setCodeMirrorOption
} from '../libraries/codeMirror'

import {
    showToolbar,
    hideToolbar,
    setToolbarAutoFixed,
    setToolbar,
    getToolbarHandles,
    setToolbarHandler
} from '../prototypes/toolbar'

import { mouseOrTouch } from '../events/mouse'
import {editorSave} from '../properties/EditorSave'

class EditorMD {
    constructor (id, options) {
        this.initValue()
        this.init(id, options)
    }

    initValue () {
        this.state = {
            watching: false,
            loaded: false,
            preview: false,
            fullscreen: false
        }

        this.loadPlugins = {}
        this.loadFiles = {
            js: [],
            css: [],
            plugin: []
        }

        this.toolbarModes = toolbarModes
        this.mouseOrTouch = mouseOrTouch
        this.loadedDisplay = loadedDisplay
        this.save = editorSave
    }

    init (id, options) {
        options = options || {}
        if (typeof id === 'object') {
            options = id
        }
        // var classPrefix      = classPrefix;
        const settings = $.extend(true, {}, settingDefault, options);

        if (options.imageFormats) {
            settings.imageFormats = options.imageFormats;
        }

        if (options.emojiCategories) {
            settings.emojiCategories = options.emojiCategories;
        }

        let editor
        if (id instanceof HTMLElement) {
            const element = id;
            editor = this.editor = $(element);
            id = element.id.length > 0 ? element.id : settings.id;
        } else {
            id               = (typeof id === "object") ? settings.id : id;
            editor           = this.editor       = $("#" + id);
        }
        this.id              = id;
        this.lang            = settings.lang;

        var classNames       = this.classNames   = {
            textarea : {
                html     : `${classPrefix}html-textarea`,
                markdown : `${classPrefix}markdown-textarea`
            }
        };
    
        settings.pluginPath = (settings.pluginPath === '') ? settings.path + '../plugins/' : settings.pluginPath
        this.state.watching = (settings.watch) ? true : false;
        
        if ( !editor.hasClass("editormd") ) {
            editor.addClass("editormd");
        }
        
        editor.css({
            width  : (typeof settings.width  === "number") ? settings.width  + "px" : settings.width,
            height : (typeof settings.height === "number") ? settings.height + "px" : settings.height
        });
        
        if (settings.autoHeight)
        {
            editor.css("height", "auto");
        }
                    
        var markdownTextarea = this.markdownTextarea = editor.children("textarea");
        
        if (markdownTextarea.length < 1)
        {
            editor.append("<textarea></textarea>");
            markdownTextarea = this.markdownTextarea = editor.children("textarea");
        }
        
        markdownTextarea.addClass(classNames.textarea.markdown).attr("placeholder", settings.placeholder);
        
        if (typeof markdownTextarea.attr("name") === "undefined" || markdownTextarea.attr("name") === "")
        {
            markdownTextarea.attr("name", (settings.name !== "") ? settings.name : id + "-markdown-doc");
        }
        
        var appendElements = [
            (!settings.readOnly) ? "<a href=\"javascript:;\" class=\"fa fa-close " + classPrefix + "preview-close-btn\"></a>" : "",
            ( (settings.saveHTMLToTextarea) ? "<textarea class=\"" + classNames.textarea.html + "\" name=\"" + id + "-html-code\"></textarea>" : "" ),
            "<div class=\"" + classPrefix + "preview\"><div class=\"markdown-body " + classPrefix + "preview-container\"></div></div>",
            "<div class=\"" + classPrefix + "container-mask\" style=\"display:block;\"></div>",
            "<div class=\"" + classPrefix + "mask\"></div>"
        ].join("\n");
        
        editor.append(appendElements).addClass(classPrefix + "vertical");
        
        if (settings.theme !== "") 
        {
            editor.addClass(classPrefix + "theme-" + settings.theme);
        }
        
        this.mask          = editor.children("." + classPrefix + "mask");    
        this.containerMask = editor.children("." + classPrefix  + "container-mask");
        
        if (settings.markdown !== "")
        {
            markdownTextarea.val(settings.markdown);
        }
        
        if (settings.appendMarkdown !== "")
        {
            markdownTextarea.val(markdownTextarea.val() + settings.appendMarkdown);
        }
        
        this.htmlTextarea     = editor.children("." + classNames.textarea.html);            
        this.preview          = editor.children("." + classPrefix + "preview");
        this.previewContainer = this.preview.children("." + classPrefix + "preview-container");
        
        if (settings.previewTheme !== "") 
        {
            this.preview.addClass(classPrefix + "preview-theme-" + settings.previewTheme);
        }
        
        if (typeof define === "function" && define.amd) {
            if (typeof window.katex !== "undefined") {
                editormd.$katex = window.katex
            }

            if (settings.searchReplace && !settings.readOnly) {
                editormd.loadCSS(settings.path + "codemirror/addon/dialog/dialog")
                editormd.loadCSS(settings.path + "codemirror/addon/search/matchesonscrollbar")
            }
        }

        editormd.settings = settings
        this.settings = settings
    // console.log(`====ddd`,this)
        if (
            (typeof define === "function" && define.amd) ||
            !settings.autoLoadModules)
        {
            if (typeof window.CodeMirror !== "undefined") {
                editormd.$CodeMirror = window.CodeMirror;
            }

            if (typeof window.marked !== "undefined") {
                editormd.$marked = window.marked;
            }

            this.setCodeMirror().setToolbar().loadedDisplay();
        } else {
            this.loadQueues();
        }

        // editorTheme.call(this);

        return this
    }
}

EditorMD.showToolbar = showToolbar
EditorMD.prototype.hideToolbar = hideToolbar
EditorMD.prototype.setToolbarAutoFixed = setToolbarAutoFixed
EditorMD.prototype.setToolbar = setToolbar
EditorMD.prototype.getToolbarHandles = getToolbarHandles
EditorMD.prototype.setToolbarHandler = setToolbarHandler

EditorMD.prototype.loadQueues = loadQueues
EditorMD.prototype.loadCSS = loadCSS
EditorMD.prototype.loadScript = loadScript

EditorMD.prototype.setCodeMirrorTheme = setCodeMirrorTheme
EditorMD.prototype.setCodeMirror = setCodeMirror
EditorMD.prototype.getCodeMirrorOption = getCodeMirrorOption
EditorMD.prototype.setCodeMirrorOption = setCodeMirrorOption

export default EditorMD
