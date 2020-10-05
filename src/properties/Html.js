/**
 * 简单地过滤指定的HTML标签
 * Filter custom html tags
 *
 * @param   {String}   html          要过滤HTML
 * @param   {String}   filters       要过滤的标签
 * @returns {String}   html          返回过滤的HTML
 */

export function filterHTMLTags (html, filters) {
    if (typeof html !== "string") {
        html = html.toString();
    }

    if (typeof filters !== "string") {
        return html;
    }

    var expression = filters.split("|");
    var filterTags = expression[0].split(",");
    var attrs      = expression[1];

    for (var i = 0, len = filterTags.length; i < len; i++) {
        var tag = filterTags[i];
        html = html.replace(new RegExp("\<\s*" + tag + "\s*([^\>]*)\>([^\>]*)\<\s*\/" + tag + "\s*\>", "igm"), "");
    }
    //return html;

    if (typeof attrs !== "undefined")
    {
        var htmlTagRegex = /\<(\w+)\s*([^\>]*)\>([^\>]*)\<\/(\w+)\>/ig;

        if (attrs === "*")
        {
            html = html.replace(htmlTagRegex, function($1, $2, $3, $4, $5) {
                return "<" + $2 + ">" + $4 + "</" + $5 + ">";
            });         
        }
        else if (attrs === "on*")
        {
            html = html.replace(htmlTagRegex, function($1, $2, $3, $4, $5) {
                var el = $("<" + $2 + ">" + $4 + "</" + $5 + ">");
                var _attrs = $($1)[0].attributes;
                var $attrs = {};
                
                $.each(_attrs, function(i, e) {
                    if (e.nodeName !== "\"") {
                        $attrs[e.nodeName] = e.nodeValue;

                        // Fixed like <a href="javascript:alert('xss')"></a> XSS problem, Copy from pull request #532
                        if (e.nodeName === "href" && e.nodeValue.toLowerCase().indexOf("javascript:") >= 0) {
                            $attrs[e.nodeName] = "javascript:;";
                        }
                    }
                });
                
                $.each($attrs, function(i) {                        
                    if (i.indexOf("on") === 0) {
                        delete $attrs[i];
                    }
                });
                
                el.attr($attrs);
                
                var text = (typeof el[1] !== "undefined") ? $(el[1]).text() : "";

                return el[0].outerHTML + text;
            });
        }
        else
        {
            html = html.replace(htmlTagRegex, function($1, $2, $3, $4) {
                var filterAttrs = attrs.split(",");
                var el = $($1);
                el.html($4);

                $.each(filterAttrs, function(i) {
                    el.attr(filterAttrs[i], null);
                });

                return el[0].outerHTML;
            });
        }
    }

    return html;
}
