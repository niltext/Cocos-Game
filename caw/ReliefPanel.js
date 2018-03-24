let UIBase = require('UIBase');
cc.Class({
    extends: UIBase,

    properties: {
        times:cc.Label,
    },

    // use this for initialization
    onEnable: function () {
        this._super();
        this.times.string = cc.mgr.hallLogic.relife;
    },

    onClickedGet: function () {
        if (cc.mgr.hallLogic.relife <=0) {
            cc.mgr.err.floatTip('领取条件不符合');
            return;
        }
        cc.mgr.hallLogic.c2sGetRelief();
    },

    onClickedClose: function () {
        this.close();
    },
    
});
