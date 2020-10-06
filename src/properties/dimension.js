
/**
 * 设置编辑器的宽度
 * Set editor width
 *
 * @param   {Number|String} width  编辑器宽度值
 * @returns {editormd}             返回editormd的实例对象
 */

export const width = function (width) {
    this.editor.css("width", (typeof width === "number") ? width  + "px" : width)
    this.resize();

    return this;
}

/**
 * 设置编辑器的高度
 * Set editor height
 *
 * @param   {Number|String} height  编辑器高度值
 * @returns {editormd}              返回editormd的实例对象
 */

export function height (height) {
    this.editor.css("height", (typeof height === "number")  ? height  + "px" : height);
    this.resize();

    return this;
}

/**
 * 调整编辑器的尺寸和布局
 * Resize editor layout
 *
 * @param   {Number|String} [width=null]  编辑器宽度值
 * @param   {Number|String} [height=null] 编辑器高度值
 * @returns {editormd}                    返回editormd的实例对象
 */

export const resize = function (width, height) {
    width  = width  || null;
    height = height || null;

    var state      = this.state;
    var editor     = this.editor;
    var preview    = this.preview;
    var toolbar    = this.toolbar;
    var settings   = this.settings;

    const { codeMirror } = this;

    if (width) {
        editor.css("width", (typeof width  === "number") ? width  + "px" : width);
    }

    if (settings.autoHeight && !state.fullscreen && !state.preview) {
        editor.css("height", "auto");
        codeMirror.css("height", "auto");
    } else {
        if (height) {
            editor.css("height", (typeof height === "number") ? height + "px" : height);
        }

        if (state.fullscreen) {
            editor.height($(window).height());
        }

        if (settings.toolbar && !settings.readOnly) {
            codeMirror.css("margin-top", toolbar.height() + 1).height(editor.height() - toolbar.height());
        } else {
            codeMirror.css("margin-top", 0).height(editor.height());
        }
    }

    if (settings.watch) {
        codeMirror.width(editor.width() / 2);
        preview.width((!state.preview) ? editor.width() / 2 : editor.width());

        this.previewContainer.css("padding", settings.autoHeight ? "20px 20px 50px 40px" : "20px");

        if (settings.toolbar && !settings.readOnly) {
            preview.css("top", toolbar.height() + 1);
        } else {
            preview.css("top", 0);
        }

        if (settings.autoHeight && !state.fullscreen && !state.preview) {
            preview.height("");
        } else {
            var previewHeight = (settings.toolbar && !settings.readOnly) ? editor.height() - toolbar.height() : editor.height();

            preview.height(previewHeight);
        }
    } else {
        codeMirror.width(editor.width());
        preview.hide();
    }

    if (state.loaded) {
        $.proxy(settings.onresize, this)();
    }

    return this;
}
