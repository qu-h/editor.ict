/**
 *
 * 生成TOC(Table of Contents)
 * Creating ToC (Table of Contents)
 *
 * @param   {Array}    toc             从marked获取的TOC数组列表
 * @param   {Element}  container       插入TOC的容器元素
 * @param   {Integer}  startLevel      Hx 起始层级
 * @param   {object}   markedRenderer  Marked Renderer
 * @returns {Object}   tocContainer    返回ToC列表容器层的jQuery对象元素
 */

export function markdownToCRenderer (toc, container, tocDropdown, startLevel, markedRenderer) {
    markedRenderer = markedRenderer || null;

    var html        = "";
    var lastLevel   = 0;
    var classPrefix = this.classPrefix;

    startLevel      = startLevel  || 1;

    for (var i = 0, len = toc.length; i < len; i++) {
        var text  = toc[i].text;
        var level = toc[i].level;

        if (level < startLevel) {
            continue;
        }

        if (level > lastLevel) {
            html += "";
        } else if (level < lastLevel) {
            html += (new Array(lastLevel - level + 2)).join("</ul></li>");
        } else {
            html += "</ul></li>";
        }

        // fixed https://github.com/pandao/editor.md/issues/476
        // fixed https://github.com/pandao/editor.md/issues/649
        var href = text.replace(/(<([^>]+)>)/ig, ""); // /<[^>]*>/g

        if (markedRenderer) {
            text = markedRenderer.emoji(text); // Fixed Heading can't has emoji code
        }

        html += "<li><a class=\"toc-level-" + level + "\" href=\"#" + href + "\" level=\"" + level + "\">" + text + "</a><ul>";
        lastLevel = level;
    }

    var tocContainer = container.find(".markdown-toc");

    if ((tocContainer.length < 1 && container.attr("previewContainer") === "false")) {
        var tocHTML = "<div class=\"markdown-toc " + classPrefix + "markdown-toc\"></div>";

        tocHTML = (tocDropdown) ? "<div class=\"" + classPrefix + "toc-menu\">" + tocHTML + "</div>" : tocHTML;
        container.html(tocHTML);
        tocContainer = container.find(".markdown-toc");
    }

    if (tocDropdown) {
        tocContainer.wrap("<div class=\"" + classPrefix + "toc-menu\"></div><br/>");
    }

    $(tocContainer).html("<ul class=\"markdown-toc-list\"></ul>").children(".markdown-toc-list").html(html.replace(/\r?\n?\<ul\>\<\/ul\>/g, ""));
    return tocContainer;
}

/**
 *
 * 生成TOC下拉菜单
 * Creating ToC dropdown menu
 *
 * @param   {Object}   container       插入TOC的容器jQuery对象元素
 * @param   {String}   tocTitle        ToC title
 * @returns {Object}                   return toc-menu object
 */
    
export function tocDropdownMenu (container, tocTitle) {
    
    tocTitle      = tocTitle || "Table of Contents";
    
    var zindex    = 400;
    var tocMenus  = container.find("." + this.classPrefix + "toc-menu");

    tocMenus.each(function() {
        var $this  = $(this);
        var toc    = $this.children(".markdown-toc");
        var icon   = "<i class=\"fa fa-angle-down\"></i>";
        var btn    = "<a href=\"javascript:;\" class=\"toc-menu-btn\">" + icon + tocTitle + "</a>";
        var menu   = toc.children("ul");            
        var list   = menu.find("li");
        
        toc.append(btn);
        
        list.first().before("<li><h1>" + tocTitle + " " + icon + "</h1></li>");
        
        $this.mouseover(function(){
            menu.show();

            list.each(function(){
                var li = $(this);
                var ul = li.children("ul");

                if (ul.html() === "")
                {
                    ul.remove();
                }

                if (ul.length > 0 && ul.html() !== "")
                {
                    var firstA = li.children("a").first();

                    if (firstA.children(".fa").length < 1)
                    {
                        firstA.append( $(icon).css({ float:"right", paddingTop:"4px" }) );
                    }
                }

                li.mouseover(function(){
                    ul.css("z-index", zindex).show();
                    zindex += 1;
                }).mouseleave(function(){
                    ul.hide();
                });
            });
        }).mouseleave(function(){
            menu.hide();
        }); 
    });       
    
    return tocMenus;
}