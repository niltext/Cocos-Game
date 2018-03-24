cc.Class({
    extends: cc.Component,

    properties: {
        touchClose: false,
        callback: {
            default: null,
            visible: false
        }
    },

    // use this for initialization
    onLoad: function () {
        // 屏蔽触摸
        this.node.on('touchstart', function (event) {
            event.stopPropagation();
        })

        this.node.on('touchend', function (event) {
            if (this.touchClose) {
                this.node.active = false;
                if (this.callback) {
                    this.callback();
                }
            }
            event.stopPropagation();
        }, this)
    },


});
