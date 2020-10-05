/**
 * Parse & Saving Markdown source code
 *
 * @returns {editormd}     返回editormd的实例对象
 */
var timer, flowchartTimer;

export function editorSave () {
    if (timer === null) {
        return this;
    }

    var _this            = this;
    var state            = this.state;
    var settings         = this.settings;
    var cm               = this.cm;
    var cmValue          = cm.getValue();
    var previewContainer = this.previewContainer;
    const editormd = this;

    if (settings.mode !== "gfm" && settings.mode !== "markdown") {
        this.markdownTextarea.val(cmValue);

        return this;
    }

    var marked          = editormd.$marked;
    var markdownToC     = this.markdownToC = [];
    var rendererOptions = this.markedRendererOptions = {
        toc                  : settings.toc,
        tocm                 : settings.tocm,
        tocStartLevel        : settings.tocStartLevel,
        pageBreak            : settings.pageBreak,
        taskList             : settings.taskList,
        emoji                : settings.emoji,
        tex                  : settings.tex,
        atLink               : settings.atLink,           // for @link
        emailLink            : settings.emailLink,        // for mail address auto link
        flowChart            : settings.flowChart,
        sequenceDiagram      : settings.sequenceDiagram,
        previewCodeHighlight : settings.previewCodeHighlight,
    };

    var markedOptions = this.markedOptions = {
        renderer    : editormd.markedRenderer(markdownToC, rendererOptions),
        gfm         : true,
        tables      : true,
        breaks      : true,
        pedantic    : false,
        sanitize    : !settings.htmlDecode,  // 关闭忽略HTML标签，即开启识别HTML标签，默认为false
        smartLists  : true,
        smartypants : true
    };

    marked.setOptions(markedOptions);

    var newMarkdownDoc = editormd.$marked(cmValue, markedOptions);

    newMarkdownDoc = editormd.filterHTMLTags(newMarkdownDoc, settings.htmlDecode);

    this.markdownTextarea.text(cmValue);

    cm.save();

    if (settings.saveHTMLToTextarea) {
        this.htmlTextarea.text(newMarkdownDoc);
    }

    if (settings.watch || (!settings.watch && state.preview)) {
        previewContainer.html(newMarkdownDoc);

        previewContainer.find(".task-list-item").forEach(function (elm) {
            // @TODO : refactoring
            elm.parentNode.classList.add('task-list');
            // $(elm).parent().addClass("task-list");
        });

        this.previewCodeHighlight();

        if (settings.toc) {
            var tocContainer = (settings.tocContainer === "") ? previewContainer : $(settings.tocContainer);
            var tocMenu      = tocContainer.find("." + this.classPrefix + "toc-menu");

            tocContainer.attr("previewContainer", (settings.tocContainer === "") ? "true" : "false");

            if (settings.tocContainer !== "" && tocMenu.length > 0) {
                tocMenu.remove();
            }

            editormd.markdownToCRenderer(markdownToC, tocContainer, settings.tocDropdown, settings.tocStartLevel);

            if (settings.tocDropdown || tocContainer.find("." + this.classPrefix + "toc-menu").length > 0) {
                editormd.tocDropdownMenu(tocContainer, (settings.tocTitle !== "") ? settings.tocTitle : this.lang.tocTitle);
            }

            if (settings.tocContainer !== "") {
                previewContainer.find(".markdown-toc").css("border", "none");
            }
        }

        if (settings.tex) {
            if (!editormd.kaTeXLoaded && settings.autoLoadModules)  {
                editormd.loadKaTeX(function () {
                    editormd.$katex = katex;
                    editormd.kaTeXLoaded = true;
                    _this.katexRender();
                });
            } else {
                editormd.$katex = katex;
                this.katexRender();
            }
        }

        if (settings.flowChart || settings.sequenceDiagram) {
            flowchartTimer = setTimeout(function () {
                clearTimeout(flowchartTimer);
                _this.flowChartAndSequenceDiagramRender();
                flowchartTimer = null;
            }, 10);
        }

        if (state.loaded) {
            $.proxy(settings.onchange, this)();
        }
    }

    return this;
}
