
export function runProxy (handler, context) {
    return $.proxy(handler, context)
}

const ObjectUltil = {
    proxy : runProxy
}

export default ObjectUltil

export function clone (obj) {
    return Object.create(
        Object.getPrototypeOf(obj),
        Object.getOwnPropertyDescriptors(obj)
    );
}
