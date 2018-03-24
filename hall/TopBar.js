cc.Class({
    extends: cc.Component,

    properties: {
        fangkaNum: cc.Label,
        beanNum: cc.Label,
    },

    // use this for initialization
    onLoad: function () {
        cc.mgr.hallLogic.topbarView = this;
    },

    onEnable: function () {
        this.updateInfo();
    },

    updateInfo: function () {
        let info = cc.mgr.userMgr.userinfo;
        if (!info) {
            return;
        }
        if (info.card && this.fangkaNum.node.active) {
            this.fangkaNum.string = info.card;
        }
        if (info.gold && this.beanNum.node.active) {
            this.beanNum.string = info.gold;
        }
    },



});
