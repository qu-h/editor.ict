
export function runProxy (handler, context) {
    return $.proxy(handler, context)
}

const ObjectUltil = {
    proxy : runProxy
}

export default ObjectUltil
