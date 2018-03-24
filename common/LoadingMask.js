cc.Class({
    extends: cc.Component,

    properties: {
        juhua: cc.Node,
        lbl: cc.Label,
    },

    // use this for initialization
    onLoad: function () {
        this.act = cc.repeatForever(cc.rotateBy(2, 360));
    },

    onEnable: function () {
        this.juhua.runAction(this.act);
    },

    onDisable: function () {
        this.juhua.stopAllActions();
    },

    tip: function (str) {
        if (str.length == 0) {
            str = '加载中，请稍候...'
        }
        this.lbl.string = str;
    },

    closeAfter: function () {
        cc.delayedCall(this.node, 2, () => {
            this.close();
        })
    },

    close: function () {
        this.node.destroy();
    },

});
