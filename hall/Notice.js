cc.Class({
    extends: cc.Component,

    properties: {

        lbNotice: {
            type: cc.Label,
            default: null
        },
        mask: {
            type: cc.Mask,
            default: null
        }
    },

    // use this for initialization
    onLoad: function () {
         cc.mgr.net.on(NetId.S2C_BROAD, this.onNotice, this);
    },


    onEnable: function () {
        this.resetAction();
        if (cc.mgr.hallLogic.notice) {
            this.setMsg(cc.mgr.hallLogic.notice);
        }
    },

    onDisable: function () {
        this.lbNotice.node.stopAllActions();
    },

    setMsg: function (msg) {
        this.lbNotice.string = msg;
        this.resetAction();
    },

    resetAction: function () {
        let maskWidth = this.mask.node.width;
        let start = maskWidth / 2
 
        let end = -maskWidth / 2 - this.lbNotice.node.width;
        let move = cc.sequence(
            cc.place(start, 0),
            cc.moveTo(15, cc.v2(end, 0))
        )
        this.lbNotice.node.stopAllActions();
        this.lbNotice.node.runAction(cc.repeatForever(move));
    },

    onNotice: function (event) {
        let msg = event.detail.msg;
        this.setMsg(msg.content)
        cc.mgr.hallLogic.notice = msg.content;
    },

    onDestroy: function () {
        cc.mgr.net.off(NetId.S2C_BROAD, this.onNotice, this);
    },

});
