cc.Class({
    extends: cc.Component,

    properties: {
        input: cc.EditBox,
        tips: cc.Label,
    },

    // use this for initialization
    onLoad: function () {
        let self = this;
        cc.mgr.net.on(NetId.S2C_BIND_INVITE, (event) => {
            let msg = event.detail.msg;
            if (msg.code == ErrNo.OK) {
                cc.floatTip('绑定成功，奖励已发放');
                self.onClickedCancel();
            }
            else {
                cc.floatTip(msg.msg);
            }
        })

        this.tips.string = LocalText.invitation;
    },
    onClickedOK: function () {
        let code = this.input.string;
        this.c2sBindInviation(code);
    },

    onClickedCancel: function () {
        this.node.active = false;
    },

    c2sBindInviation: function (code) {
        cc.mgr.net.send(NetId.C2S_BIND_INVITE, { invite_code: code });
    },
});
