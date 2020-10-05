
HTMLElement.prototype.hide = function () {
    this.style.display = 'none'
}

HTMLElement.prototype.text = function (string) {
    this.innerHTML = string
}

HTMLElement.prototype.html = function (string) {
    this.innerHTML = string
}

HTMLElement.prototype.addClass = function (className) {
    const element = this;

    console.log(`=====`,{element, className})

    let classnames = className.split(' ');
    element.classList.add(classnames)
}

HTMLElement.prototype.find = function (string) {
    let nodes = this.querySelectorAll(string)
    nodes = Array.prototype.slice.call(nodes);
    return nodes
}
