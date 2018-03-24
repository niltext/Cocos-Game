cc.Class({
    extends: cc.Component,

    properties: {
        // togglesBanker: [cc.Toggle],
        togglesCount: [cc.Toggle],
        colorPlus: cc.Node,
    },

    // use this for initialization
    onLoad: function () {

    },

    update: function (dt) {
        //加一色
        for (let i in this.togglesCount) {
            if (this.togglesCount[2].isChecked) {
                this.colorPlus.active = true;
            }
            else {
                this.colorPlus.active = false;
            }
        }
    },

    getConfig: function (roomid) {
        let cfg = {
            room_id: roomid,
            room_type: 0,//房间类型
            total_ju: 0,
            params: '', //扩展参数
            // host_type: 0,
            qunzhu: 0,//0表示AA开房,1表示房主扣费
        };


        //扣费类型
        let toggleA = cc.find('toggleCost/toggle1', this.node).getComponent(cc.Toggle);
        let toggleH = cc.find('toggleCost/toggle2', this.node).getComponent(cc.Toggle);
        if (toggleH.isChecked) {
            cfg.qunzhu = 1;
        }
        //局数
        let toggle1 = cc.find('toggleRound/toggle1', this.node).getComponent(cc.Toggle);
        let toggle2 = cc.find('toggleRound/toggle2', this.node).getComponent(cc.Toggle);

        if (toggle1.isChecked) {
            cfg.total_ju = 8;
        } else if (toggle2.isChecked) {
            cfg.total_ju = 12;
        } else {
            cfg.total_ju = 16;
        }

        let params = {};
        // 人数
        params.count = 0;
        for (let i in this.togglesCount) {
            if (this.togglesCount[i].isChecked) {
                params.count = parseInt(i) + 2;
                break;
            }
        }

        // 坐庄
        // let cursor = 0;
        // for (let i in this.togglesBanker) {
        //     if (this.togglesBanker[i].isChecked) {
        //         cursor = parseInt(i);
        //         break;
        //     }
        // }

        // cfg.host_type = cursor + 1;
        // // 服务器废弃了2类型，直接映射成4
        // if (cfg.host_type == 2) {
        //     cfg.host_type = 4;
        // }

        cfg.params = JSON.stringify(params);
        cc.log('roomConfig:' + JSON.stringify(cfg))
        return cfg;
    },
});
