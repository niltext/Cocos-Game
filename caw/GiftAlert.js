cc.Class({
    extends: cc.Component,

    properties: {
        title1: cc.Node,
        title2: cc.Node,

        text: cc.RichText,

        type: 0, //1表示领取日常，2表示领取救济
    },

    // use this for initialization
    onLoad: function () {

    },


    onClickedGet: function () {
        cc.log('!--onClickedGet-type->' + this.type)
        if (this.type == 1) {
            cc.mgr.hallLogic.c2sGetSignGift();
        }
        else {
            cc.mgr.hallLogic.c2sGetRelief();
        }

        this.node.active = false;
    },

    open: function (type, count) {
        this.node.active = true;
        this.type = type;

        if (this.type == 1) {
            this.text.string = '<color=#874F47>每天首次登录可获得</c><color=#EAAC28>1000 金豆。</c>'
        }
        else {
            this.text.string = '<color=#874F47>您的金豆不足进场，今日还可以领取 </c>' + count + '<color=#874F47>次救济金。</c>';
        }

        this.title1.active = this.type == 1;
        this.title2.active = this.type == 2;

    },
});
