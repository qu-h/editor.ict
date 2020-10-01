
import EditorRenderer from './EditorRenderer'
import { trimText } from '../../prototypes/string'

export default class HeadingRenderder extends EditorRenderer {
    constructor (options) {
        super(options)
        this.trim = trimText
    }

    execute (text, level) {
        let { markdownToC, headerPrefix} = this.config;

        var _headingIds     = [];
        var linkText       = text;
        var hasLinkReg     = /\s*\<a\s*href\=\"(.*)\"\s*([^\>]*)\>(.*)\<\/a\>\s*/;
        // var getLinkTextReg = /\s*\<a\s*([^\>]+)\>([^\>]*)\<\/a\>\s*/g;

        if (hasLinkReg.test(text)) {
            var tempText = [];
            text         = text.split(/\<a\s*([^\>]+)\>([^\>]*)\<\/a\>/);

            for (var i = 0, len = text.length; i < len; i++) {
                tempText.push(text[i].replace(/\s*href\=\"(.*)\"\s*/g, ""));
            }

            text = tempText.join(" ");
        }

        text = this.trim(text);
        
        var escapedText = text.toLowerCase().replace(/[^\w]+/g, "-");

        var toc = {
            text  : text,
            level : level,
            slug  : escapedText
        };
        
        let isChinese = /^[\u4e00-\u9fa5]+$/.test(text);
        
        var id        = (isChinese) ? escape(text).replace(/\%/g, "") : text.toLowerCase().replace(/[^\w]+/g, "-");
        if (_headingIds.indexOf(id) >= 0) {
            id += mdUtil.rand(100, 999999);
        }

        _headingIds.push(id);

        toc.id = id;

        markdownToC.push(toc);
        
        let header = $(`<h${level}/>`, { id: `h${level}-${headerPrefix + id}` });
        let referecenLink = $(`<a/>`, { name: text, class: 'reference-link' });
        header.append(referecenLink);

        let octiconLink = $(`<span/>`, { class: 'header-link octicon octicon-link' });
        header.append(octiconLink);

        return header;
    }
}