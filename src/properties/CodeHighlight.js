/**
 * 高亮预览HTML的pre代码部分
 * highlight of preview codes
 *
 * @returns {editormd}             返回editormd的实例对象
 */

export function previewCodeHighlight () {
    var settings         = this.settings;
    var previewContainer = this.previewContainer;

    if (settings.previewCodeHighlight && typeof window.prettyPrint !== "undefined") {
        previewContainer.find("pre").forEach(element => {
            // element.addClass("prettyprint linenums")
            element.classList.add(`prettyprint`, `linenums`)
        })
        window.prettyPrint();
    }

    return this;
}
