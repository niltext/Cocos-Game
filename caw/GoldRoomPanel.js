const cfg = [
    { bet: 100, cond: '1000' },
    { bet: 500, cond: '6w' },
    { bet: 2500, cond: '30w' }
]

cc.Class({
    extends: cc.Component,

    properties: {
        roomBtns: [cc.Node],
    },

    // use this for initialization
    onLoad: function () {
        for (let i = 0; i < this.roomBtns.length; i++) {
            let btn = this.roomBtns[i];
            let baseBet = btn.getChildByName('baseBet').getComponent(cc.Label);
            baseBet.string = cfg[i].bet;

            let condition = btn.getChildByName('condition').getComponent(cc.Label);
            condition.string = cfg[i].cond;
        }

        this._orgPos = this.node.getPosition();
        this.hideAct = cc.moveTo(0.2, this._orgPos.x - this.node.width, this._orgPos.y).easing(cc.easeBackIn());
        this.showAct = cc.moveTo(0.2, this._orgPos).easing(cc.easeBackOut());
        this.node.setPosition(this._orgPos.x - this.node.width, this._orgPos.y);
    },

    onEnable: function () {
        this.node.runAction(this.showAct);
    },

    onClickedRoom: function (event, customData) {
        if (cc.mgr.hallLogic.relief > 0) {
            cc.mgr.hallLogic.openGiftAlert();
            return;
        }
        cc.showMask('正在匹配，请稍后', -1, () => {
            cc.mgr.hallLogic.c2sMatch(parseInt(customData));
        });
    },

    onClickedQuickStart: function () {
        if (cc.mgr.hallLogic.relief > 0) {
            cc.mgr.hallLogic.openGiftAlert();
            return;
        }
        cc.showMask('正在匹配，请稍后', -1, () => {
            cc.mgr.hallLogic.c2sMatch(-1);
        });
    },

    onClickedClose: function () {

        this.node.runAction(this.hideAct);
        cc.delayedCall(this.node, 0.2, () => {
            this.node.active = false;
            if (cc.mgr.hallLogic.hallView) {
                cc.mgr.hallLogic.hallView.onBackToHall();
            }
        });

    },
});
