export default class EditorRenderer {
    constructor (options) {
        this.defaults = {};
        if (options) {
            this.config = $.extend(this.defaults, options || {});
        }
    }
}
