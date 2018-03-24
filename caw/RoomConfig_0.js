//{局数,单人扣卡数}
const PreCfg = [
    { round: 10, price: 1 },
    { round: 20, price: 2 },
]

cc.Class({
    extends: cc.Component,

    properties: {
        togglesBanker: [cc.Toggle],
    },

    // use this for initialization
    onLoad: function () {
        this.tgRounds = this.node.getChildByName('toggleRound').children;
        this.lbCost = [];
        for (let i = 0; i < 3; i++) {
            let path = 'toggleRound/toggle' + (i + 1) + '/lbCost'
            let lb = cc.find(path, this.node).getComponent(cc.Label);
            this.lbCost.push(lb);
        }

        for (let i = 0; i < PreCfg.length; i++) {
            let tg = this.tgRounds[i];
            tg.active = true;
            let lbJu = tg.getChildByName('ju').getComponent(cc.Label);
            lbJu.string = PreCfg[i].round;
        }
        for (let i = PreCfg.length; i < this.tgRounds.length; i++) {
            this.tgRounds[i].active = false;
        }
    },

    onEnable: function () {
        this.updatePrice();
    },

    getConfig: function (roomid) {
        let cfg = {
            room_id: roomid,
            total_ju: 0,
            host_type: 0,
            poke_type: 0,
            qunzhu: 0
        };

        // 局数
        for (let i = 0; i < PreCfg.length; i++) {
            let tg = this.tgRounds[i].getComponent(cc.Toggle);
            if (tg.isChecked) {
                cfg.total_ju = PreCfg[i].round;
                break;
            }
        }

        // 有花无花
        let toggle = cc.find('toggleMode/toggle1', this.node).getComponent(cc.Toggle);
        cfg.poke_type = toggle.isChecked ? 1 : 2;

        toggle = cc.find('toggleCost/toggle1', this.node).getComponent(cc.Toggle);
        if (toggle.isChecked) {
            cfg.qunzhu = 0;
        }
        toggle = cc.find('toggleCost/toggle2', this.node).getComponent(cc.Toggle);
        if (toggle.isChecked) {
            cfg.qunzhu = 2;
        }

        // 坐庄
        let cursor = 0;
        for (let i in this.togglesBanker) {
            if (this.togglesBanker[i].isChecked) {
                cursor = parseInt(i);
                break;
            }
        }

        cfg.host_type = cursor + 1;
        // 服务器废弃了2类型，直接映射成4
        if (cfg.host_type == 2) {
            cfg.host_type = 4;
        }

        return cfg;
    },

    updatePrice: function () {
        for (let i = 0; i < PreCfg.length; i++) {
            this.lbCost[i].string = 'x' + PreCfg[i].price + ')';
        }
    },
});
