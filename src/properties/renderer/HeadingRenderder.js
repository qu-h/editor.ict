
import EditorRenderer from './EditorRenderer'
import { trimText } from '../../prototypes/string'
import { numberRand } from '../../utils/Number';

export default class HeadingRenderder extends EditorRenderer {
    constructor (options) {
        super(options)
        this.trim = trimText
    }

    execute (text, level) {
        const { markdownToC, headerPrefix } = this.config;

        var _headingIds     = [];
        // var linkText       = text;
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

        const isChinese = /^[\u4e00-\u9fa5]+$/.test(text);

        var id        = (isChinese) ? escape(text).replace(/\%/g, "") : text.toLowerCase().replace(/[^\w]+/g, "-");
        if (_headingIds.indexOf(id) >= 0) {
            id += numberRand(100, 999999);
        }

        _headingIds.push(id);

        toc.id = id;

        markdownToC.push(toc);

        const header = document.createElement(`h${level}`)
        header.id = `h${level}-${headerPrefix + id}`
        // let header = $(`<h${level}/>`, { id: `h${level}-${headerPrefix + id}` });
        // let referecenLink = $(`<a/>`, { name: text, class: 'reference-link' });

        const referecenLink = document.createElement(`a`)
        referecenLink.classList.add(`reference-link`)
        referecenLink.name = 'text'
        header.appendChild(referecenLink);

        // const octiconLink = $(`<span/>`, { class: 'header-link octicon octicon-link' });
        const octiconLink = document.createElement('span')
        octiconLink.classList.add(`header-link`, `octicon`, `octicon-link`)
        header.appendChild(octiconLink);

        return header;
    }
}
