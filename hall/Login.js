cc.Class({
    extends: cc.Component,

    properties: {
        btnLogin: cc.Node,
        register: cc.Node,

        inputAccount: cc.EditBox,
        inputPsw: cc.EditBox,
        version: cc.Label,

    },

    // use this for initialization
    onLoad: function () {
        cc.view.setResolutionPolicy(cc.ResolutionPolicy.EXACT_FIT);
        cc.mgr.net.connect(ServerIp, ServerPort,
            function () {
                cc.mgr.sdkMgr.login(false)
            });


        cc.mgr.net.on(NetId.S2C_REGISTER, (event) => {
            let msg = event.detail.msg;
            if (msg.code != ErrNo.OK) {
                cc.mgr.err.floatTip(msg.msg);
            }
        });

        if (cc.sys.os != cc.sys.OS_ANDROID && cc.sys.os != cc.sys.OS_IOS) {
            this.btnLogin.active = false;
            this.register.active = true;
        } else {
            this.btnLogin.active = !cc.utils.reviewing;
            this.register.active = cc.utils.reviewing;
        }

        this.version.string = cc.utils.version;
    },

    onClickedLogin: function () {
        if (cc.mgr.net.connected() == false) {
            cc.mgr.net.connect(ServerIp, ServerPort, function () {
                cc.mgr.sdkMgr.login(true)
            });
        }
        else {
            cc.mgr.sdkMgr.login(true);
        }
    },

    onClickedLogin2: function () {
        let account = this.inputAccount.string;
        let psw = this.inputPsw.string;

        let param = {
            token: '',
            account: account,
            password: psw,
            channel: 'wechat',
            lon: 0,
            lat: 0,
            game:Config.game
        }
        cc.mgr.userMgr.login(param);
    },

    onClickedRegister: function () {
        let account = this.inputAccount.string;
        let psw = this.inputPsw.string;

        cc.mgr.net.send(NetId.C2S_REGISTER, { account: account, password: psw });
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
