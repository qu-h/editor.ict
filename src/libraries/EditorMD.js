import {
    settingDefault,
    classPrefix,
    titleDefault,
    toolbarModes
} from '../const/SettingDefault'

import { regexDefault } from '../const/RegExp'

// import { loadQueues, loadCSS, loadScript, loadedDisplay } from '../prototypes/loader'
import { editorLoader } from '../prototypes/loader'
import {
    setCodeMirrorTheme,
    setCodeMirror,
    getCodeMirrorOption,
    setCodeMirrorOption
} from '../libraries/codeMirror'

import { editorToolbar } from '../prototypes/toolbar'

import { mouseOrTouch } from '../events/mouse'
import { editorSave } from '../properties/EditorSave'
import { markedRenderer } from '../properties/renderer/MarkedRenderer'
import { trimText } from '../prototypes/string'
import { filterHTMLTags } from '../properties/Html'
import { previewCodeHighlight } from '../properties/CodeHighlight'
import { markdownToCRenderer } from '../properties/TableOfContent'
import { resize, height, width } from '../properties/dimension'
import { addKeyMap, removeKeyMap, registerKeyMaps } from '../properties/KeyMap'
import { hideEvent, show, off, on, bindChangeEvent, bindScrollEvent, recreateEvent } from '../properties/events'
import { editorInitial } from '../properties/EditorInitial';

class EditorMD {
    constructor (id, options) {
        this.initValue()
        this.initCloneMethod()
        this.init(id, options)
    }

    doCloneMethod (object) {
        const classScope = this;
        function iterate (method) {
            classScope[method] = object[method];
        }

        Object.keys(object).forEach(iterate);
        const methods = Object.getPrototypeOf(object);
        Object.keys(methods).forEach(iterate);
    }

    initCloneMethod () {
        this.initEditor = editorInitial.initEditor
        this.initButtonClose = editorInitial.initButtonClose
        this.initPreview = editorInitial.initPreview
        this.initSaveHtml = editorInitial.initSaveHtml
        this.initMarkdownTextarea = editorInitial.initMarkdownTextarea
        this.initMask = editorInitial.initMask

        this.doCloneMethod(editorToolbar)
        this.doCloneMethod(editorLoader)
    }

    /**
     * Initial class value
     */
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

        this.title        = this.$name = titleDefault;
        this.version      = "1.5.0";
        this.homePage     = "https://pandao.github.io/editor.md/";
        this.classPrefix  = classPrefix;

        this.toolbarModes = toolbarModes
        this.mouseOrTouch = mouseOrTouch
        // this.loadedDisplay = editorLoader.loadedDisplay
        this.save = editorSave

        this.regexs = regexDefault;
        this.markedRenderer = markedRenderer;

        this.filterHTMLTags = filterHTMLTags

        this.previewCodeHighlight = previewCodeHighlight

        this.markdownToCRenderer = markdownToCRenderer

        this.resize = resize
        this.height = height
        this.width = width

        this.addKeyMap = addKeyMap
        this.removeKeyMap = removeKeyMap
        this.registerKeyMaps = registerKeyMaps

        this.hide = hideEvent
        this.show = show
        this.off = off
        this.on = on
        this.bindChangeEvent = bindChangeEvent
        this.bindScrollEvent = bindScrollEvent
        this.recreate = recreateEvent
    }

    init (id, options) {
        options = options || {}
        const editormd = this;

        if (typeof id === 'object') {
            options = id
        }

        const settings = $.extend(true, {}, settingDefault, options)
        this.settings = settings
        this.lang            = settings.lang;

        if (options.imageFormats) {
            settings.imageFormats = options.imageFormats;
        }

        if (options.emojiCategories) {
            settings.emojiCategories = options.emojiCategories;
        }

        settings.pluginPath = (settings.pluginPath === '') ? settings.path + '../plugins/' : settings.pluginPath
        this.state.watching = settings.watch

        this.initEditor(id)
        this.initMarkdownTextarea()

        // var appendElements = [
        //     // (!settings.readOnly) ? "<a href=\"javascript:;\" class=\"fa fa-close " + classPrefix + "preview-close-btn\"></a>" : "",

        //     // (settings.saveHTMLToTextarea) ? "<textarea class=\"" + this.classNames.textarea.html + "\" name=\"" + id + "-html-code\"></textarea>" : "",

        //     // "<div class=\"" + classPrefix + "preview\"><div class=\"markdown-body " + classPrefix + "preview-container\"></div></div>",
        //     "<div class=\"" + classPrefix + "container-mask\" style=\"display:block;\"></div>",
        //     "<div class=\"" + classPrefix + "mask\"></div>"
        // ].join("\n");

        this.initButtonClose()

        this.initSaveHtml()
        this.initPreview()
        this.initMask()

        // this.mask          = editor.children("." + classPrefix + "mask")
        // this.containerMask = editor.children("." + classPrefix  + "container-mask")
        // this.htmlTextarea     = editor.children("." + this.classNames.textarea.html)
        // this.preview          = editor.children("." + classPrefix + "preview")
        // this.previewContainer = this.preview.children("." + classPrefix + "preview-container");

        // this.mask = editor.getElementsByClassName(`${classPrefix}mask`)
        // this.containerMask = editor.getElementsByClassName(`${classPrefix}container-mask`)
        // this.htmlTextarea     = editor.getElementsByClassName(this.classNames.textarea.html)

        if (typeof define === "function" && define.amd) {
            if (typeof window.katex !== "undefined") {
                editormd.$katex = window.katex
            }

            if (settings.searchReplace && !settings.readOnly) {
                editormd.loadCSS(settings.path + "codemirror/addon/dialog/dialog")
                editormd.loadCSS(settings.path + "codemirror/addon/search/matchesonscrollbar")
            }
        }

        // editormd.settings = settings
        // this.settings = settings

        if (
            (typeof define === "function" && define.amd) ||
            !settings.autoLoadModules
        ) {
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

// const editorToolbar = new EditorToolbar();
// Object.setPrototypeOf(EditorMD, editorToolbar.prototype);

// EditorMD.showToolbar = EditorToolbar.showToolbar
// EditorMD.prototype.hideToolbar = EditorToolbar.hideToolbar
// EditorMD.prototype.setToolbarAutoFixed = EditorToolbar.setToolbarAutoFixed
// EditorMD.prototype.setToolbar = EditorToolbar.setToolbar
// EditorMD.prototype.getToolbarHandles = getToolbarHandles
// EditorMD.prototype.setToolbarHandler = setToolbarHandler

// EditorMD.prototype.loadQueues = editorLoader.loadQueues
// EditorMD.prototype.loadCSS = editorLoader.loadCSS
// EditorMD.prototype.loadScript = editorLoader.loadScript

EditorMD.prototype.setCodeMirrorTheme = setCodeMirrorTheme
EditorMD.prototype.setCodeMirror = setCodeMirror
EditorMD.prototype.getCodeMirrorOption = getCodeMirrorOption
EditorMD.prototype.setCodeMirrorOption = setCodeMirrorOption

EditorMD.prototype.trim = trimText;

export default EditorMD
