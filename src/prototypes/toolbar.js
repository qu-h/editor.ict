import { runProxy } from '../utils/Object'

function EditorToolbar () {
    /**
     * 显示工具栏
     * Display toolbar
     *
     * @param   {Function} [callback=function(){}] 回调函数
     * @returns {editormd}  返回editormd的实例对象
     */
    this.showToolbar = function(callback) {
        var settings = this.settings

        if (settings.readOnly) {
            return this
        }

        if (
            settings.toolbar &&
            (
                this.toolbar.length < 1 ||
                this.toolbar.find("." + this.classPrefix + "menu").html() === ""
            )
        ) {
            this.setToolbar()
        }

        settings.toolbar = true

        this.toolbar.show()
        this.resize()

        runProxy(callback || function () {}, this)()

        return this
    }

    /**
     * 隐藏工具栏
     * Hide toolbar
     *
     * @param   {Function} [callback=function(){}] 回调函数
     * @returns {editormd}                         this(editormd instance object.)
     */

    this.hideToolbar = function(callback) {
        var settings = this.settings;

        settings.toolbar = false
        this.toolbar.hide()
        this.resize()

        runProxy(callback || function () {}, this)()
        return this
    }

    /**
     * 页面滚动时工具栏的固定定位
     * Set toolbar in window scroll auto fixed position
     *
     * @returns {editormd}  返回editormd的实例对象
     */

    this.setToolbarAutoFixed =function(fixed) {
        var state    = this.state
        var editor   = this.editor
        var toolbar  = this.toolbar
        var settings = this.settings

        if (typeof fixed !== "undefined") {
            settings.toolbarAutoFixed = fixed
        }

        var autoFixedHandle = function () {
            var $window = $(window)
            var top     = $window.scrollTop()

            if (!settings.toolbarAutoFixed) {
                return false
            }

            if (top - editor.offset().top > 10 && top < editor.height()) {
                toolbar.css({
                    position : "fixed",
                    width    : editor.width() + "px",
                    left     : ($window.width() - editor.width()) / 2 + "px"
                })
            } else {
                toolbar.css({
                    position : "absolute",
                    width    : "100%",
                    left     : 0
                })
            }
        }

        if (!state.fullscreen && !state.preview && settings.toolbar && settings.toolbarAutoFixed) {
            $(window).bind("scroll", autoFixedHandle)
        }

        return this
    }

    this.getToolbarHandles = function (name) {
        const editormd = this
        var toolbarHandlers = this.toolbarHandlers = editormd.toolbarHandlers

        return (name && typeof this.toolbarIconHandlers[name] !== "undefined") ? toolbarHandlers[name] : toolbarHandlers
    }

    /**
     * 工具栏图标事件处理器
     * Bind toolbar icons event handle
     *
     * @returns {editormd}  返回editormd的实例对象
     */

    this.setToolbarHandler = function () {
        var _this               = this
        const editormd = this
        var settings            = this.settings

        if (!settings.toolbar || settings.readOnly) {
            return this
        }

        var toolbar             = this.toolbar
        var cm                  = this.cm
        var classPrefix         = this.classPrefix
        var toolbarIcons        = toolbar.querySelectorAll(`.${classPrefix}menu > li > a`)
        var toolbarIconHandlers = this.getToolbarHandles()

        const iconEvents = editormd.mouseOrTouch("click", "touchend");

        // toolbarIcons.addEventListener(iconEvents, function (event) {
        // })

        toolbarIcons.forEach((icon) => {
            icon.addEventListener(iconEvents, iconEvent);
        })

        this.toolbarIcons = toolbarIcons;
        return this
    }

    function iconEvent () {
        var icon                = $(this).children(".fa")
        var name                = icon.attr("name")
        var cursor              = cm.getCursor()
        var selection           = cm.getSelection()

        if (name === "") {
            return
        }

        _this.activeIcon = icon

        if (typeof toolbarIconHandlers[name] !== "undefined") {
            $.proxy(toolbarIconHandlers[name], _this)(cm)
        } else if (typeof settings.toolbarHandlers[name] !== "undefined") {
            $.proxy(settings.toolbarHandlers[name], _this)(cm, icon, cursor, selection)
        }

        if (
            name !== "link" &&
            name !== "reference-link" &&
            name !== "image" &&
            name !== "code-block" &&
            name !== "preformatted-text" &&
            name !== "watch" &&
            name !== "preview" &&
            name !== "search" &&
            name !== "fullscreen" &&
            name !== "info"
        ) {
            cm.focus()
        }
        return false
    }

    /**
     * 配置和初始化工具栏
     * Set toolbar and Initialization
     *
     * @returns {editormd}  返回editormd的实例对象
     */

    this.setToolbar = function () {
        var settings    = this.settings
        const editormd = this

        if (settings.readOnly) {
            return this
        }

        var editor      = editormd.editor
        var classPrefix = editormd.classPrefix
        const toolbarClassname = `${classPrefix}toolbar`

        var toolbar     = editor.getElementsByClassName(toolbarClassname)

        if (
            typeof toolbar === 'undefined' ||
            (settings.toolbar && toolbar.length < 1)
        ) {
            toolbar = document.createElement("div")
            toolbar.classList.add(toolbarClassname)

            const toolbarContainer = document.createElement("div")
            toolbarContainer.classList.add(`${classPrefix}toolbar-container`)
            toolbar.append(toolbarContainer)

            const toolbarMenu = document.createElement("ul")
            toolbarMenu.classList.add(`${classPrefix}menu`)
            toolbarContainer.append(toolbarMenu)

            // var toolbarHTML = "<div class=\"" + classPrefix + "toolbar\"><div class=\"" + classPrefix + "toolbar-container\"><ul class=\"" + classPrefix + "menu\"></ul></div></div>"

            // editor.append(toolbarHTML)
            // toolbar = editor.getElementsByClassName(toolbarClassname)[0]
        }
        if (!settings.toolbar) {
            toolbar.hide()
            return this
        }

        $(toolbar).show()

        var icons       = (typeof settings.toolbarIcons === "function") ? settings.toolbarIcons() : ((typeof settings.toolbarIcons === "string")  ? editormd.toolbarModes[settings.toolbarIcons] : settings.toolbarIcons)

        var toolbarMenu = toolbar.getElementsByClassName(`${this.classPrefix}menu`)[0]
        var menu = ''
        var pullRight   = false

        for (var i = 0, len = icons.length; i < len; i++) {
            var name = icons[i]

            if (name === "||") {
                pullRight = true
            } else if (name === "|") {
                menu += "<li class=\"divider\" unselectable=\"on\">|</li>"
            } else {
                var isHeader = (/h(\d)/.test(name))
                var index    = name

                if (name === "watch" && !settings.watch) {
                    index = "unwatch"
                }

                var title     = settings.lang.toolbar[index]
                var iconTexts = settings.toolbarIconTexts[index]
                var iconClass = settings.toolbarIconsClass[index]

                title     = (typeof title     === "undefined") ? "" : title
                iconTexts = (typeof iconTexts === "undefined") ? "" : iconTexts
                iconClass = (typeof iconClass === "undefined") ? "" : iconClass

                var menuItem = pullRight ? "<li class=\"pull-right\">" : "<li>"

                if (typeof settings.toolbarCustomIcons[name] !== "undefined" && typeof settings.toolbarCustomIcons[name] !== "function") {
                    menuItem += settings.toolbarCustomIcons[name]
                } else {
                    menuItem += "<a href=\"javascript:;\" title=\"" + title + "\" unselectable=\"on\">";
                    menuItem += "<i class=\"fa " + iconClass + "\" name=\""+name+"\" unselectable=\"on\">"+((isHeader) ? name.toUpperCase() : ( (iconClass === "") ? iconTexts : "") ) + "</i>";
                    menuItem += "</a>";
                }

                menuItem += "</li>"

                menu = pullRight ? menuItem + menu : menu + menuItem
            }
        }

        // toolbarMenu.html(menu)
        // toolbarMenu.find("[title=\"Lowercase\"]").attr("title", settings.lang.toolbar.lowercase)
        // toolbarMenu.find("[title=\"ucwords\"]").attr("title", settings.lang.toolbar.ucwords)

        toolbarMenu.innerHTML = menu

        toolbarMenu.querySelectorAll('[title="Lowercase"]').forEach(function (elm) {
            elm.title = settings.lang.toolbar.lowercase
        })
        toolbarMenu.querySelectorAll('[title="ucwords"]').forEach(function (elm) {
            elm.title = settings.lang.toolbar.ucwords
        })

        this.toolbar = toolbar
        this.setToolbarHandler()
        this.setToolbarAutoFixed()

        return this
    }

    return this
}

export const editorToolbar = new EditorToolbar()
