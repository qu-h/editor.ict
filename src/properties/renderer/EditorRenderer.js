export default class EditorRenderer {
    constructor (options) {
        this.defaults = {};
        if (options) {
            this.config = { ...this.defaults, ...options || {} };
        }
    }
}
