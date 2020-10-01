import EmojiRenderer from './EmojiRenderer'
import AtLinkRenderer from './AtLinkRenderer'
import LinkRenderer from './LinkRenderer'
import HeadingRenderder from './HeadingRenderder'
/**
 * Custom Marked renderer rules
 *
 * @param   {Array}    markdownToC     Pass in an array for receiving TOC
 * @returns {Renderer} markedRenderer  Return the marked Renderer custom object
 */

export function markedRenderer (markdownToC, options) {
    var defaults = {
        toc                  : true,           // Table of contents
        tocm                 : false,
        tocStartLevel        : 1,              // Said from H1 to create ToC
        pageBreak            : true,
        atLink               : true,           // for @link
        emailLink            : true,           // for mail address auto link
        taskList             : false,          // Enable Github Flavored Markdown task lists
        emoji                : false,          // :emoji: , Support Twemoji, fontAwesome, Editor.md logo emojis.
        tex                  : false,          // TeX(LaTeX), based on KaTeX
        flowChart            : false,          // flowChart.js only support IE9+
        sequenceDiagram      : false          // sequenceDiagram.js only support IE9+
    };

    var settings = $.extend(defaults, options || {});
    const editormd = this
    // this.options.imgPath = null;

    var marked          = editormd.$marked;
    var markedRenderer  = new marked.Renderer();
    markdownToC         = markdownToC || []

    var regexs          = editormd.regexs;
    var atLinkReg       = regexs.atLink;
    var emailReg        = regexs.email;
    var emailLinkReg    = regexs.emailLink;
    var pageBreakReg    = regexs.pageBreak;

    markedRenderer.options.imgPath = null;

    markedRenderer.options = $.extend({}, markedRenderer.options, editormd.settings);

    const emojiRenderer = new EmojiRenderer({
        faIconReg: regexs.fontAwesome,
        emojiReg: regexs.emoji,
        editormdLogoReg: regexs.editormdLogo,
        twemojiReg      :regexs.twemoji
    });

    markedRenderer.emoji = (text) => {
        if (!settings.emoji) {
            return text;
        }
        return emojiRenderer.execute(text);
    };

    const mdSettings = this.settings;

    const atLinkRenderer = new AtLinkRenderer({
        atLinkReg: regexs.atLink,
        emailReg: regexs.emailReg,
        emailLinkReg: regexs.emailLinkReg,
        atLink: settings.atLink,
        emailLink : settings.emailLink,
        atLinkBase : mdSettings.atLinkBase
    });

    markedRenderer.atLink = function (text) {
        return atLinkRenderer.execute(text);
    }

    const linkRenderer = new LinkRenderer({ atLinkReg: regexs.atLink, sanitize: this.sanitize });
    markedRenderer.link = function (href, title, text) { 
        return linkRenderer.execute(href, title, text);
    }

    const headingRenderder = new HeadingRenderder({ markdownToC : markdownToC || [], headerPrefix : markedRenderer.options.headerPrefix });

    markedRenderer.heading = function (text, level) {
        var hasLinkReg     = /\s*\<a\s*href\=\"(.*)\"\s*([^\>]*)\>(.*)\<\/a\>\s*/;
        const header = headingRenderder.execute(text, level);
        if (hasLinkReg) {
            header.append(this.atLink(this.emoji(text)));
        } else {
            header.append(this.atLink(this.emoji(text)));
        }
        return header.prop('outerHTML');
    };

    markedRenderer.pageBreak = function (text) {
        if (pageBreakReg.test(text) && settings.pageBreak) {
            text = "<hr style=\"page-break-after:always;\" class=\"page-break editormd-page-break\" />"
        }
        return text;
    };

    markedRenderer.paragraph = function(text) {
        var isTeXInline     = /\$\$(.*)\$\$/g.test(text);
        var isTeXLine       = /^\$\$(.*)\$\$$/.test(text);
        var isTeXAddClass   = (isTeXLine)     ? " class=\"" + editormd.classNames.tex + "\"" : "";
        var isToC           = (settings.tocm) ? /^(\[TOC\]|\[TOCM\])$/.test(text) : /^\[TOC\]$/.test(text);
        var isToCMenu = /^\[TOCM\]$/.test(text);
        const isCodeTree = /^\[CodeTree\]$/.test(text);

        if (!isTeXLine && isTeXInline) {
            text = text.replace(/(\$\$([^\$]*)\$\$)+/g, function($1, $2) {
                return "<span class=\"" + editormd.classNames.tex + "\">" + $2.replace(/\$/g, "") + "</span>";
            });
        } else {
            text = (isTeXLine) ? text.replace(/\$/g, "") : text;
        }

        var tocHTML = "<div class=\"markdown-toc editormd-markdown-toc\">" + text + "</div>";

        if (isCodeTree) {
            var treeViewHTML = "<div class=\"editormd-code-treeview\">" + text + "</div>";
            return treeViewHTML;
        }
        return (isToC) ? ( (isToCMenu) ? "<div class=\"editormd-toc-menu\">" + tocHTML + "</div><br/>" : tocHTML )
                       : ( (pageBreakReg.test(text)) ? this.pageBreak(text) : "<p" + isTeXAddClass + ">" + this.atLink(this.emoji(text)) + "</p>\n" );
    };

    const fileExtention = {
        '.js':'javascript'
    };

    markedRenderer.code = function (code, lang, file) {
        if (typeof marked.Renderer.prototype[lang] === 'undefined' && typeof lang !== 'undefined') {
            let ext = lang.substring(lang.lastIndexOf("."), lang.length);

            if (fileExtention.hasOwnProperty(ext)) {
                editormd.addCodeTree(lang);

                return this.code(code,fileExtention[ext], lang)
            }
        }
        
        if (lang === "seq" || lang === "sequence")
        {
            return "<div class=\"sequence-diagram\">" + code + "</div>";
        } 
        else if ( lang === "flow")
        {
            return "<div class=\"flowchart\">" + code + "</div>";
        } 
        else if ( lang === "math" || lang === "latex" || lang === "katex")
        {
            return "<p class=\"" + editormd.classNames.tex + "\">" + code + "</p>";
        } 
        else 
        {
            let codePre = marked.Renderer.prototype.code.apply(this, arguments);
            if (typeof file !== 'undefined') {
                return `<p class="code-file-path" >${file}</p>` + codePre;
            }
            return codePre;
        }
    };

    markedRenderer.tablecell = function(content, flags) {
        var type = (flags.header) ? "th" : "td";
        var tag  = (flags.align)  ? "<" + type +" style=\"text-align:" + flags.align + "\">" : "<" + type + ">";

        return tag + this.atLink(this.emoji(content)) + "</" + type + ">\n";
    };

    markedRenderer.listitem = function(text, task) {
        if (settings.taskList && task) {
            text = text.replace("<input ", "<input class='task-list-item-checkbox' ");

            return "<li class=\"task-list-item\">" + this.atLink(this.emoji(text)) + "</li>";
        } else {
            return "<li>" + this.atLink(this.emoji(text)) + "</li>";
        }
    };

    markedRenderer.image = function (href, title, text) {
        const _this = this;

        // href = cleanUrl(this.options.sanitize, this.options.baseUrl, href);
        if (href === null) {
            return text;
        }

        let out = '<img src="' + href + '" alt="' + text + '"';
        if (title) {
            out += ' title="' + title + '"';
        }
        out += '/>';

        // return this.prototype.image(href, title, text);
        return out;
    }

    return markedRenderer;
}
