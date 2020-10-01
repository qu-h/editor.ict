/**
 * 清除字符串两边的空格
 * Clear the space of strings both sides.
 *
 * @param   {String}    str            string
 * @returns {String}                   trimed string
 */
export function trimText (str) {
    return (!String.prototype.trim) ? str.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, "") : str.trim();
}
