
import { runProxy } from '../utils/Object'

/**
 * 注册事件处理方法
 * Bind editor event handle
 *
 * @param   {String}     eventType      event type
 * @param   {Function}   callback       回调函数
 * @returns {editormd}                  this(editormd instance object.)
 */

export function on (eventType, callback) {
    var settings = this.settings;

    if (typeof settings["on" + eventType] !== "undefined") {
        settings["on" + eventType] = $.proxy(callback, this)
    }

    return this;
}

/**
 * 解除事件处理方法
 * Unbind editor event handle
 *
 * @param   {String}   eventType          event type
 * @returns {editormd}                    this(editormd instance object.)
 */

export function off (eventType) {
    var settings = this.settings;
    
    if (typeof settings["on" + eventType] !== "undefined") 
    {
        settings["on" + eventType] = function(){};
    }
    
    return this;
}

/**
 * 编辑器界面重建，用于动态语言包或模块加载等
 * Recreate editor
 *
 * @returns {editormd}  返回editormd的实例对象
 */

export function recreateEvent () {
    var editor           = this.editor;
    var settings         = this.settings;

    this.codeMirror.remove();

    this.setCodeMirror();

    if (!settings.readOnly) {
        if (editor.find(".editormd-dialog").length > 0) {
            editor.find(".editormd-dialog").remove();
        }

        if (settings.toolbar) {
            this.getToolbarHandles();
            this.setToolbar();
        }
    }

    this.loadedDisplay(true);

    return this;
}

/**
 * 绑定同步滚动
 *
 * @returns {editormd} return this
 */

export function bindScrollEvent () {
    var _this            = this;
    var preview          = this.preview;
    var settings         = this.settings;
    var codeMirror       = this.codeMirror;
    var mouseOrTouch     = this.mouseOrTouch;

    if (!settings.syncScrolling) {
        return this;
    }

    var cmBindScroll = function () {
        codeMirror.find(".CodeMirror-scroll").bind(mouseOrTouch("scroll", "touchmove"), function (event) {
            const elm = this;
            const  { height, scrollTop } = elm
            var percent   = (scrollTop / elm.scrollHeight);
            var tocHeight = 0;

            preview.find(".markdown-toc-list").each(function () {
                tocHeight += height;
            });

            var tocMenuHeight = preview.find(".editormd-toc-menu").height();
            tocMenuHeight = (!tocMenuHeight) ? 0 : tocMenuHeight;

            if (scrollTop === 0) {
                preview.scrollTop(0);
            } else if (scrollTop + height >= elm.scrollHeight - 16) {
                preview.scrollTop(preview[0].scrollHeight);
            }  else {
                preview.scrollTop((preview[0].scrollHeight  + tocHeight + tocMenuHeight) * percent);
            }

            runProxy(settings.onscroll, _this, event)(event)
            // $.proxy(settings.onscroll, _this)(event);
        });
    };

    var cmUnbindScroll = function () {
        codeMirror.find(".CodeMirror-scroll").unbind(mouseOrTouch("scroll", "touchmove"));
    };

    var previewBindScroll = function () {
        preview.bind(mouseOrTouch("scroll", "touchmove"), function (event) {
            const elm = this;
            const  { height, scrollTop } = elm

            var percent   = (scrollTop / elm.scrollHeight);
            var codeView  = codeMirror.find(".CodeMirror-scroll");

            if (scrollTop === 0) {
                codeView.scrollTop(0);
            } else if (scrollTop + height >= elm.scrollHeight) {
                codeView.scrollTop(codeView[0].scrollHeight)
            } else {
                codeView.scrollTop(codeView[0].scrollHeight * percent);
            }

            runProxy(settings.onpreviewscroll, _this)(event);
        });
    };

    var previewUnbindScroll = function () {
        preview.unbind(mouseOrTouch("scroll", "touchmove"));
    }

    codeMirror.bind({
        mouseover  : cmBindScroll,
        mouseout   : cmUnbindScroll,
        touchstart : cmBindScroll,
        touchend   : cmUnbindScroll
    });

    if (settings.syncScrolling === "single") {
        return this;
    }

    preview.bind({
        mouseover  : previewBindScroll,
        mouseout   : previewUnbindScroll,
        touchstart : previewBindScroll,
        touchend   : previewUnbindScroll
    });

    return this;
}

export function bindChangeEvent () {
    var _this            = this;
    var cm               = this.cm;
    var settings         = this.settings;

    if (!settings.syncScrolling) {
        return this;
    }

    let timer = null;

    cm.on("change", function (_cm, changeObj) {
        if (settings.watch) {
            _this.previewContainer.css("padding", settings.autoHeight ? "20px 20px 50px 40px" : "20px");
        }

        timer = setTimeout(function () {
            clearTimeout(timer);
            _this.save();
            timer = null;
        }, settings.delay);
    });

    return this;
}

/**
 * 显示编辑器
 * Show editor
 *
 * @param   {Function} [callback=function()] 回调函数
 * @returns {editormd}                       返回editormd的实例对象
 */

export function show (callback) {
    callback  = callback || function () {};

    var _this = this;
    this.editor.show(0, function () {
        runProxy(callback, _this)();
    });

    return this;
}

/**
 * 隐藏编辑器
 * Hide editor
 *
 * @param   {Function} [callback=function()] 回调函数
 * @returns {editormd}                       返回editormd的实例对象
 */

export function hideEvent (callback) {
    callback  = callback || function () {};

    var _this = this;
    this.editor.hide(0, function () {
        runProxy(callback, _this)();
    });

    return this;
}
