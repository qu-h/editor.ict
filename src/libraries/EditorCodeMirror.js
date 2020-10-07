// import CodeMirror from 'codemirror'

// if (typeof window.CodeMirror !== "undefined") {
//     // editormd.$CodeMirror = window.CodeMirror;
// }

class EditorCodeMirror {
    /**
     * setEditorTheme() 的别名
     * setEditorTheme() alias
     *
     * @returns {editormd}  返回editormd的实例对象
     */

    setCodeMirrorTheme (theme) {
        this.setEditorTheme(theme)
        return this
    }

    /**
     * 配置和初始化CodeMirror组件
     * CodeMirror initialization
     *
     * @returns {editormd}  返回editormd的实例对象
     */

    setCodeMirror () {
        const editormd = this
        const { editor, settings } = editormd

        if (settings.editorTheme !== 'default') {
            editormd.loadCSS(settings.path + "codemirror/theme/" + settings.editorTheme);
        }

        const codeMirrorConfig = {
            mode                      : settings.mode,
            theme                     : settings.editorTheme,
            tabSize                   : settings.tabSize,
            dragDrop                  : false,
            autofocus                 : settings.autoFocus,
            autoCloseTags             : settings.autoCloseTags,
            readOnly                  : (settings.readOnly) ? "nocursor" : false,
            indentUnit                : settings.indentUnit,
            lineNumbers               : settings.lineNumbers,
            lineWrapping              : settings.lineWrapping,
            extraKeys                 : { "Ctrl-Q": function (cm) { cm.foldCode(cm.getCursor()); } },
            foldGutter                : settings.codeFold,
            gutters                   : ["CodeMirror-linenumbers", "CodeMirror-foldgutter"],
            matchBrackets             : settings.matchBrackets,
            indentWithTabs            : settings.indentWithTabs,
            styleActiveLine           : settings.styleActiveLine,
            styleSelectedText         : settings.styleSelectedText,
            autoCloseBrackets         : settings.autoCloseBrackets,
            showTrailingSpace         : settings.showTrailingSpace,
            highlightSelectionMatches : ((!settings.matchWordHighlight) ? false : { showToken: (settings.matchWordHighlight === "onselected") ? false : /\w/ })
        };

        const editorCodeMirror = editormd.$CodeMirror.fromTextArea(this.markdownTextarea, codeMirrorConfig);
        const codeMirror = editor.getElementsByClassName("CodeMirror")[0];

        if (settings.value !== "") {
            this.cm.setValue(settings.value);
        }

        codeMirror.style.fontSize = settings.fontSize
        codeMirror.style.width = (!settings.watch) ? "100%" : "50%"

        if (settings.autoHeight) {
            codeMirror.css("height", "auto");
            editorCodeMirror.setOption("viewportMargin", Infinity);
        }

        if (!settings.lineNumbers) {
            codeMirror.find(".CodeMirror-gutters").css("border-right", "none");
        }

        editormd.codeMirror = codeMirror
        editormd.cm         = editorCodeMirror
console.log(` ==add code mirror `,{codeMirror})
        return editormd
    }

    /**
     * 获取CodeMirror的配置选项
     * Get CodeMirror setting options
     *
     * @returns {Mixed}                  return CodeMirror setting option value
     */

    getCodeMirrorOption (key) {
        return this.cm.getOption(key)
    }

    /**
     * 配置和重配置CodeMirror的选项
     * CodeMirror setting options / resettings
     *
     * @returns {editormd}  返回editormd的实例对象
     */

    setCodeMirrorOption (key, value) {
        this.cm.setOption(key, value)
        return this
    }
}

export const editorCodeMirror = new EditorCodeMirror()
