
let $;

if (typeof $ === 'undefined') {
    $ = function () {
    }
} else {
    $ = window.jQuery
}


export {
    $
}
