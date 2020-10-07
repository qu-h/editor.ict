import {} from '../utils/HtmlElementPrototype'
import { runProxy } from '../utils/Object'

export default class EditorLoader {
    /**
     * 所需组件加载队列
     * Required components loading queue
     * @returns {editormd}  返回editormd的实例对象
     */

    loadQueues () {
        var editormd = this
        var settings = this.settings
        var loadPath = settings.path
        var promises = [];

        this.loadCSS(`${loadPath}codemirror/codemirror.min`)

        if (settings.searchReplace && !settings.readOnly) {
            this.loadCSS(loadPath + "codemirror/addon/dialog/dialog")
            this.loadCSS(loadPath + "codemirror/addon/search/matchesonscrollbar")
        }

        if (settings.codeFold) {
            this.loadCSS(loadPath + "codemirror/addon/fold/foldgutter")
        }

        promises.push(
            editormd.loadScript(loadPath + "codemirror/codemirror.min", () => {
                editormd.$CodeMirror = CodeMirror;
            })
        );

        promises.push(editormd.loadScript(loadPath + "codemirror/modes.min"))
        promises.push(editormd.loadScript(loadPath + "codemirror/addons.min"))

        promises.push(
            editormd.loadScript(loadPath + "marked.min", () => {
                editormd.$marked = marked;
            })
        );

        Promise.all(promises).then(() => {
            editormd.setCodeMirror()

            if (settings.mode !== 'gfm' && settings.mode !== 'markdown') {
                editormd.loadedDisplay()
                return
            }
            editormd.setToolbar()
        });

        if (settings.previewCodeHighlight) {
            editormd.loadScript(loadPath + "prettify.min").then(() => {
                editormd.loadFlowChartOrSequenceDiagram()
            })
        } else {
            editormd.loadFlowChartOrSequenceDiagram()
        }

        return this
    }

    loadFlowChartOrSequenceDiagram () {
        const editormd = this;

        const { isIE8, settings } = this;
        const loadPath = settings.path

        if (isIE8) {
            editormd.loadedDisplay()
            return
        }

        if (settings.flowChart || settings.sequenceDiagram) {
            this.loadScript(loadPath + "raphael.min", function () {
                editormd.loadScript(loadPath + "underscore.min", function () {
                    if (!settings.flowChart && settings.sequenceDiagram) {
                        editormd.loadScript(loadPath + "sequence-diagram.min", function () {
                            editormd.loadedDisplay();
                        });
                    } else if (settings.flowChart && !settings.sequenceDiagram) {
                        editormd.loadScript(loadPath + "flowchart.min", function () {
                            editormd.loadScript(loadPath + "jquery.flowchart.min", function () {
                                editormd.loadedDisplay();
                            });
                        });
                    } else if (settings.flowChart && settings.sequenceDiagram) {
                        editormd.loadScript(loadPath + "flowchart.min", function () {
                            editormd.loadScript(loadPath + "jquery.flowchart.min", function () {
                                editormd.loadScript(loadPath + "sequence-diagram.min", function () {
                                    editormd.loadedDisplay()
                                })
                            })
                        })
                    }
                })
            })
        } else {
            editormd.loadedDisplay()
        }
    }

    /**
     * 动态加载JS文件的方法
     * Load javascript file method
     *
     * @param {String}   fileName              JS文件名
     * @param {Function} [callback=function()] 加载成功后执行的回调函数
     * @param {String}   [into="head"]         嵌入页面的位置
     */

    loadScript2 (fileName, callback, into) {
        into = into || 'head'
        callback = callback || function () {}

        const { isIE8 } = this
        var script = null
        script = document.createElement('script')
        // script.id = fileName.replace(/[\./]+/g, '-')
        script.id = fileName.replace(/[./]+/g, '-')
        script.type = 'text/javascript'
        script.src = fileName + '.js'

        if (isIE8) {
            script.onreadystatechange = function () {
                if (script.readyState) {
                    if (script.readyState === 'loaded' || script.readyState === 'complete') {
                        script.onreadystatechange = null
                        this.loadFiles.js.push(fileName)
                        callback()
                    }
                }
            }
        } else {
            script.onload = () => {
                this.loadFiles.js.push(fileName)
                callback()
            }
        }

        if (into === 'head') {
            document.getElementsByTagName('head')[0].appendChild(script)
        } else {
            document.body.appendChild(script)
        }
    }

    loadScript (fileName, callback, into) {
        const { isIE8, loadFiles } = this

        return new Promise(function (resolve, reject) {
            into = into || 'head'
            callback = callback || function () {}

            var script = document.createElement('script')
            // script.id = fileName.replace(/[\./]+/g, '-')
            script.id = fileName.replace(/[./]+/g, '-')
            script.type = 'text/javascript'
            script.src = fileName + '.js'
            script.async = false;
            if (isIE8) {
                script.onreadystatechange = function () {
                    if (script.readyState) {
                        if (script.readyState === 'loaded' || script.readyState === 'complete') {
                            script.onreadystatechange = null
                            loadFiles.js.push(fileName)
                            callback()
                        }
                    }
                }
            } else {
                script.onload = () => {
                    loadFiles.js.push(fileName)
                    callback()
                }
            }

            if (into === 'head') {
                document.getElementsByTagName('head')[0].appendChild(script)
            } else {
                document.body.appendChild(script)
            }
            setTimeout(resolve, 500);
        });
    }

    /**
     * 动态加载CSS文件的方法
     * Load css file method
     *
     * @param {String}   fileName              CSS文件名
     * @param {Function} [callback=function()] 加载成功后执行的回调函数
     * @param {String}   [into="head"]         嵌入页面的位置
     */
    loadCSS (fileName, callback, into) {
        into = into || 'head'
        callback = callback || function () {}

        var css = document.createElement('link')
        css.type = 'text/css'
        css.rel = 'stylesheet'

        css.onload = css.onreadystatechange = () => {
            this.loadFiles.css.push(fileName)
            callback()
        }
        css.href = fileName + '.css'

        if (into === 'head') {
            document.getElementsByTagName('head')[0].appendChild(css)
        } else {
            document.body.appendChild(css)
        }
    }

    /**
     * 加载队列完成之后的显示处理
     * Display handle of the module queues loaded after.
     *
     * @param   {Boolean}   recreate   是否为重建编辑器
     * @returns {editormd}             返回editormd的实例对象
     */

    loadedDisplay (recreate) {
        recreate             = recreate || false

        var editormd            = this
        const { editor, preview, settings } = editormd

        editormd.containerMask.hide()
        editormd.save();

        if (settings.watch) {
            preview.show();
        }

        editor.data("oldWidth", editor.width()).data("oldHeight", editor.height()); // 为了兼容Zepto

        editormd.resize();

        editormd.registerKeyMaps();

        window.addEventListener("resize", () => { editormd.resize() });

        this.bindScrollEvent().bindChangeEvent();

        if (!recreate) {
            runProxy(settings.onload, this)();
        }

        this.state.loaded = true;

        return this;
    }
}

export const editorLoader = new EditorLoader()
