let UIBase = require('UIBase');
cc.Class({
    extends: UIBase,

    properties: {
        input:cc.EditBox,
    },

    // use this for initialization
    onLoad: function () {

    },

    onEnable: function () {
        this._super();
        this.input.string = '';
    },

    onClickedClose: function () {
        this.close();
    },

    onClickedSend: function () {
        let s = this.input.string;
        if (s.length > 0) {
            cc.mgr.net.send(NetId.C2S_ADVICE, { msg: s });
            cc.alert('已提交，感谢您的支持！');
            this.input.string = '';
        }
    },
});
