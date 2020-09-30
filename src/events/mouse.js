/**
 * 鼠标和触摸事件的判断/选择方法
 * MouseEvent or TouchEvent type switch
 *
 * @param   {String} [mouseEventType="click"]    供选择的鼠标事件
 * @param   {String} [touchEventType="touchend"] 供选择的触摸事件
 * @returns {String} EventType                   返回事件类型名称
 */

export const mouseOrTouch = function (mouseEventType, touchEventType) {
    mouseEventType = mouseEventType || "click"
    touchEventType = touchEventType || "touchend"

    var eventType  = mouseEventType

    try {
        document.createEvent("TouchEvent")
        eventType = touchEventType
    } catch (e) {

    }

    return eventType
}
