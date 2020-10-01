
/**
 * 添加 CodeMirror 键盘快捷键
 * Add CodeMirror keyboard shortcuts key map
 *
 * @returns {editormd}  返回editormd的实例对象
 */

export function addKeyMap (map, bottom) {
    this.cm.addKeyMap(map, bottom);

    return this;
}

/**
 * 移除 CodeMirror 键盘快捷键
 * Remove CodeMirror keyboard shortcuts key map
 *
 * @returns {editormd}  返回editormd的实例对象
 */

export function removeKeyMap (map) {
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

export function registerKeyMaps (keyMap) {
    var _this           = this;
    var cm              = this.cm;
    var settings        = this.settings;
    var toolbarHandlers = this.toolbarHandlers;
    var disabledKeyMaps = settings.disabledKeyMaps;

    keyMap              = keyMap || null;

    if (keyMap) {
        for (var i in keyMap) {
            if ($.inArray(i, disabledKeyMaps) < 0) {
                var map = {};
                map[i]  = keyMap[i];

                cm.addKeyMap(keyMap);
            }
        }
    } else {
        for (var k in this.keyMaps)
        {
            var _keyMap = this.keyMaps[k];
            var handle = (typeof _keyMap === "string") ? $.proxy(toolbarHandlers[_keyMap], _this) : $.proxy(_keyMap, _this);

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

            if ( $.inArray(keymaps[event.keyCode], disabledKeyMaps) < 0 )
            {
                switch (event.keyCode)
                {
                    case 120:
                            $.proxy(toolbarHandlers["watch"], _this)();
                            return false;
                        break;
                        
                    case 121:
                            $.proxy(toolbarHandlers["preview"], _this)();
                            return false;
                        break;
                        
                    case 122:
                            $.proxy(toolbarHandlers["fullscreen"], _this)();                        
                            return false;
                        break;
                        
                    default:
                        break;
                }
            }
        });
    }

    return this;
}
