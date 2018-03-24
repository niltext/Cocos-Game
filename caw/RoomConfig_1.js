
//{局数,单人扣卡数}
const PreCfg = [
    { round: 8, price: 1 },
    { round: 16, price: 2 },
]

// 转转麻将
cc.Class({
    extends: cc.Component,

    properties: {
        toggleSize: cc.Node,
        toggleNiao: cc.Node,
        toggleLaizi: cc.Node,
    },

    // use this for initialization
    onLoad: function () {
        this.roomSize = 4;
        this.costType = 0;

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
            mj_type: 1,//麻将类型：1表示转转麻将
            qunzhu: 0,//房间类型，0表示AA开房
            total_ju: 8,
            params: '',  // 扩展参数
        };

        let params = {};

        // 局数
        for (let i = 0; i < PreCfg.length; i++) {
            let tg = this.tgRounds[i].getComponent(cc.Toggle);
            if (tg.isChecked) {
                cfg.total_ju = PreCfg[i].round;
                break;
            }
        }

        cfg.qunzhu = this.costType;
        params.count_limit = this.roomSize;

        let tg = cc.find('toggleHu/toggle1', this.node).getComponent(cc.Toggle);
        params.can_dian_pao = tg.isChecked ? 1 : 0

        let optgs = cc.find('optional', this.node).getComponentsInChildren(cc.Toggle);

        params.zhuang_xian = optgs[0].isChecked ? 1 : 0;
        params.can_qi_xiao_dui = optgs[1].isChecked ? 1 : 0;
        params.hong_zhong_lai_zi = optgs[2].isChecked ? 1 : 0;

        if (params.count_limit > 2) {
            let tgs = this.toggleNiao.getComponentsInChildren(cc.Toggle);
            if (tgs[0].isChecked) {
                params.niao_num = 2;
            }
            else if (tgs[1].isChecked) {
                params.niao_num = 4;
            }
            else if (tgs[2].isChecked) {
                params.niao_num = 6;
            }
        }
        else {
            params.niao_num = 0;
            params.hong_zhong_lai_zi = 0;
        }

        cfg.params = JSON.stringify(params);
        cc.log('roomConfig:' + JSON.stringify(cfg))
        return cfg;
    },

    onToggleRoomSize: function (toggle, customData) {
        this.roomSize = parseInt(customData);

        this.toggleNiao.active = this.roomSize > 2;
        this.toggleLaizi.active = this.roomSize > 2;
        this.updatePrice();
    },

    onToggleCost: function (toggle, customData) {
        if (toggle.node.name == 'toggle1') {
            this.costType = 0;
        }
        else if (toggle.node.name == 'toggle2') {
            this.costType = 2;
        }

        this.updatePrice();
    },

    updatePrice: function () {
        if (this.costType == 0) {
            for (let i = 0; i < PreCfg.length; i++) {
                this.lbCost[i].string = 'x' + PreCfg[i].price +')';
            }
        }
        else if (this.costType == 2) {
            for (let i = 0; i < PreCfg.length; i++) {
                this.lbCost[i].string = 'x' + PreCfg[i].price * this.roomSize + ')';
            }
        }
    },
});
