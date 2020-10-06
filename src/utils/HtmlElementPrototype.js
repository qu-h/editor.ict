
HTMLElement.prototype.hide = function () {
    this.style.display = 'none'
}

HTMLElement.prototype.width = function () {
    return this.offsetWidth
}

HTMLElement.prototype.height = function () {
    return this.offsetHeight
}

HTMLElement.prototype.data = function (name, value) {
    this.setAttribute(`data-${name}`, value)
    return this;
}

HTMLElement.prototype.show = function () {
    this.style.display = 'block'
}

HTMLElement.prototype.text = function (string) {
    this.innerHTML = string
}

HTMLElement.prototype.html = function (string) {
    this.innerHTML = string
}

HTMLElement.prototype.addClass = function (className) {
    const element = this;
    const classnames = className.split(' ');
    element.classList.add(classnames)
}

HTMLElement.prototype.find = function (string) {
    let nodes = this.querySelectorAll(string)
    nodes = Array.prototype.slice.call(nodes);
    return nodes
}

HTMLElement.prototype.css = function (name, value) {
    this.style[name] = value;
    return this
}

HTMLElement.prototype.bind = function (events, callback) {
    if (typeof events === 'string') {
        this.addEventListener(events, callback);
    }

    if (typeof events === 'object') {
        for (const [eventName, handler] of Object.entries(events)) {
            this.addEventListener(eventName, handler);
        }
    }
}

HTMLElement.prototype.unbind = function (events) {
    if (typeof events === 'string') {
        $(events).unbind(events)
    }
}

// HTMLElement.prototype.scrollTop = function (number) {
//     $(this).scrollTop(number)
// }

NodeList.prototype.each = function (callback) {
    this.forEach((e) => {
        callback(e);
    })
}
