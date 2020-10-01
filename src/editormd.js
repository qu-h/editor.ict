'use strict'

import EditorMD from './libraries/EditorMD'

function editormd (id, options) {
    const test = new EditorMD(id, options)
    console.log(`=======`, { test })
    return test
}

export default editormd
