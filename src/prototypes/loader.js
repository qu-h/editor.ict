/**
 * 所需组件加载队列
 * Required components loading queue
 * @returns {editormd}  返回editormd的实例对象
 */

export const loadQueues = function () {
    var eMd = this
    var settings = this.settings
    var loadPath = settings.path
    const { isIE8 } = this
    var loadFlowChartOrSequenceDiagram = function () {
        if (isIE8) {
            _this.loadedDisplay()
            return
        }

        if (settings.flowChart || settings.sequenceDiagram) {
            this.loadScript(loadPath + "raphael.min", function () {
                editormd.loadScript(loadPath + "underscore.min", function() {  

                    if (!settings.flowChart && settings.sequenceDiagram) 
                    {
                        editormd.loadScript(loadPath + "sequence-diagram.min", function() {
                            _this.loadedDisplay();
                        });
                    }
                    else if (settings.flowChart && !settings.sequenceDiagram) 
                    {      
                        editormd.loadScript(loadPath + "flowchart.min", function() {  
                            editormd.loadScript(loadPath + "jquery.flowchart.min", function() {
                                _this.loadedDisplay();
                            });
                        });
                    }
                    else if (settings.flowChart && settings.sequenceDiagram) 
                    {  
                        editormd.loadScript(loadPath + "flowchart.min", function() {  
                            editormd.loadScript(loadPath + "jquery.flowchart.min", function() {
                                editormd.loadScript(loadPath + "sequence-diagram.min", function() {
                                    _this.loadedDisplay();
                                });
                            });
                        });
                    }
                });

            });
        } 
        else
        {
            _this.loadedDisplay()
        }
    }; 

    this.loadCSS(loadPath + "codemirror/codemirror.min");
    
    if (settings.searchReplace && !settings.readOnly)
    {
        this.loadCSS(loadPath + "codemirror/addon/dialog/dialog");
        this.loadCSS(loadPath + "codemirror/addon/search/matchesonscrollbar");
    }
    
    if (settings.codeFold)
    {
        this.loadCSS(loadPath + "codemirror/addon/fold/foldgutter");            
    }
    
    this.loadScript(loadPath + "codemirror/codemirror.min", function() {
        eMd.$CodeMirror = CodeMirror;
        
        eMd.loadScript(loadPath + "codemirror/modes.min", function () {
            eMd.loadScript(loadPath + 'codemirror/addons.min', function () {
                // console.log('loader codemirror')
                // console.trace()

                eMd.setCodeMirror()

                if (settings.mode !== 'gfm' && settings.mode !== 'markdown') {
                    eMd.loadedDisplay()
                    return false
                }
                eMd.setToolbar()

                eMd.loadScript(loadPath + "marked.min", function() {
                    eMd.$marked = marked;

                    if (settings.previewCodeHighlight) {
                        editormd.loadScript(loadPath + "prettify.min", function() {
                            loadFlowChartOrSequenceDiagram();
                        });
                    } 
                    else
                    {                  
                        loadFlowChartOrSequenceDiagram();
                    }
                })
                
            })
            
        })
        
    })

    return this
}

/**
 * 动态加载JS文件的方法
 * Load javascript file method
 *
 * @param {String}   fileName              JS文件名
 * @param {Function} [callback=function()] 加载成功后执行的回调函数
 * @param {String}   [into="head"]         嵌入页面的位置
 */

export const loadScript = function (fileName, callback, into) {
    into = into || 'head'
    callback = callback || function () {}

    const { isIE8 } = this
    var script = null
    script = document.createElement('script')
    script.id = fileName.replace(/[\./]+/g, '-')
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

/**
 * 动态加载CSS文件的方法
 * Load css file method
 *
 * @param {String}   fileName              CSS文件名
 * @param {Function} [callback=function()] 加载成功后执行的回调函数
 * @param {String}   [into="head"]         嵌入页面的位置
 */
export const loadCSS = function (fileName, callback, into) {
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
