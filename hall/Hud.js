cc.Class({
    extends: cc.Component,

    properties: {
    },

    // use this for initialization
    onLoad: function () {
        this._lbName = cc.find('name', this.node).getComponent(cc.Label);
        this._portrit = cc.find('portrit', this.node).getComponent(cc.Sprite);
        this._lbId = cc.find('id', this.node).getComponent(cc.Label);

        cc.mgr.hallLogic.hudView = this;
    },

    onEnable: function () {
        this.updateInfo();
    },

    updateInfo: function () {
        let info = cc.mgr.userMgr.userinfo;
        if (!info) {
            return;
        }
        if (info.head && info.head.length > 0) {
            cc.utils.setPortrit(this._portrit, info.head);
        }

        if (info.name) {
            this._lbName.string = info.name;
        }
        
        if (info.uid) {
            this._lbId.string = 'ID: ' + info.uid;
        }
    },

});
