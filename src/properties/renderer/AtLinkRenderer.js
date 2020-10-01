export default class AtLinkRenderer {
    constructor (options) {
        this.defaults = {};
        this.options = $.extend(this.defaults, options || {}); 
    }

    execute (text) {
        const { atLinkReg, emailReg, emailLinkReg, atLink, emailLink, atLinkBase } = this.options;
        if (atLinkReg.test(text)) { 
            if (atLink) 
            {
                text = text.replace(emailReg, function($1, $2, $3, $4) {
                    return $1.replace(/@/g, "_#_&#64;_#_");
                });

                text = text.replace(atLinkReg, function($1, $2) {
                    return "<a href=\"" + atLinkBase + "" + $2 + "\" title=\"&#64;" + $2 + "\" class=\"at-link\">" + $1 + "</a>";
                }).replace(/_#_&#64;_#_/g, "@");
            }
            
            if (emailLink)
            {
                text = text.replace(emailLinkReg, function($1, $2, $3, $4, $5) {
                    return (!$2 && $.inArray($5, "jpg|jpeg|png|gif|webp|ico|icon|pdf".split("|")) < 0) ? "<a href=\"mailto:" + $1 + "\">"+$1+"</a>" : $1;
                });
            }

            return text;
        }

        return text;
    }
}