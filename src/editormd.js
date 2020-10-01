'use strict'

import EditorMD from './libraries/EditorMD'

function editormd (id, options) {
    const test = new EditorMD(id, options)
    return test
}

export default editormd
