export default class LinkRenderer {
    constructor(options) {
        this.defaults = {};
        this.options = $.extend(this.defaults, options || {}); 
    }

    execute(href, title, text) {

        const { atLinkReg } = this.options;
        if (this.options.sanitize) {
            try {
                var prot = decodeURIComponent(unescape(href)).replace(/[^\w:]/g, "").toLowerCase();

                if (prot.indexOf("javascript:") === 0) {
                    return "";
                }
            } catch(e) {
                return "";
            }
        }

        var out = "<a href=\"" + href + "\"";
        
        if ( atLinkReg.test(title) || atLinkReg.test(text))
        {
            if (title)
            {
                out += " title=\"" + title.replace(/@/g, "&#64;");
            }
            
            return out + "\">" + text.replace(/@/g, "&#64;") + "</a>";
        }

        if (title) {
            out += " title=\"" + title + "\"";
        }

        out += ">" + text + "</a>";

        return out;
    }
}