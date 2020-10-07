import { runProxy } from '../utils/Object'

class EditorKeyMap {
    /**
     * 添加 CodeMirror 键盘快捷键
     * Add CodeMirror keyboard shortcuts key map
     *
     * @returns {editormd}  返回editormd的实例对象
     */

    addKeyMap (map, bottom) {
        const { cm } = this

        cm.addKeyMap(map, bottom);

        return this;
    }

    /**
     * 移除 CodeMirror 键盘快捷键
     * Remove CodeMirror keyboard shortcuts key map
     *
     * @returns {editormd}  返回editormd的实例对象
     */

    removeKeyMap (map) {
        this.cm.removeKeyMap(map);
        return this;
    }

    /**
     * 注册键盘快捷键处理
     * Register CodeMirror keyMaps (keyboard shortcuts).
     *
     * @param   {Object}    keyMap      KeyMap key/value {"(Ctrl/Shift/Alt)-Key" : function(){}}
     * @returns {editormd}              return this
     */

    registerKeyMaps (keyMap) {
        var editormd           = this;
        const { cm, toolbarHandlers, disabledKeyMaps, keyMaps } = editormd

        keyMap              = keyMap || null;

        console.log(`resigKeys`,{disabledKeyMaps, keyMap, keyMaps, editormd})

        if (keyMap) {
            for (var i in keyMap) {
                if ($.inArray(i, disabledKeyMaps) < 0) {
                    var map = {};
                    map[i]  = keyMap[i];

                    cm.addKeyMap(keyMap);
                }
            }
        } else {
            for (var k in keyMaps) {
                var _keyMap = keyMaps[k];
                var handle = (typeof _keyMap === "string") ? runProxy(toolbarHandlers[_keyMap], editormd) : runProxy(_keyMap, editormd);

                if ($.inArray(k, ["F9", "F10", "F11"]) < 0 && $.inArray(k, disabledKeyMaps) < 0) {
                    var _map = {};
                    _map[k] = handle;

                    cm.addKeyMap(_map);
                }
            }

            $(window).keydown(function (event) {
                var keymaps = {
                    "120" : "F9",
                    "121" : "F10",
                    "122" : "F11"
                };

                if ($.inArray(keymaps[event.keyCode], disabledKeyMaps) < 0) {
                    switch (event.keyCode) {
                        case 120:
                            $.proxy(toolbarHandlers["watch"], _this)();
                            return false;

                        case 121:
                            $.proxy(toolbarHandlers["preview"], _this)();
                            return false;

                        case 122:
                            $.proxy(toolbarHandlers["fullscreen"], _this)();
                            return false;

                        default:
                            break;
                    }
                }
            });
        }

        return this;
    }
}

export const editorKeyMap = new EditorKeyMap()
