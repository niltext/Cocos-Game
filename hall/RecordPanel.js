

cc.Class({
    extends: cc.Component,
    properties: {
        mainListContent: cc.Node,
        detailListRoot: cc.Node,
        detailListContent: cc.Node,

        // 主列表单条记录
        mainItemPrefab: cc.Prefab,
        detailItemPrefab: cc.Prefab,

    },

    // use this for initialization
    onLoad: function () {
        this.lastRequestDataId = 0;

        cc.mgr.net.on(NetId.S2C_ROOM_LOG, (event) => {
            let msg = event.detail.msg;
            this.s2cRoomLog(msg);
        }, this)

        cc.mgr.net.on(NetId.S2C_PLAY_GAME_LOG, (event) => {
            let msg = event.detail.msg;
            this.s2cPlayGameLog(msg);
        }, this)

        this.initView();
    },

    initView: function () {
        this.playerName = [];
        for (let i = 0; i < 4; i++) {
            let node = cc.find('title/player' + i, this.detailListRoot);
            this.playerName.push(node.getComponent(cc.Label));
        }
    },

    onEnable: function () {
        this.detailListRoot.active = false;
        this.c2sRoomLog()
    },

    onClickedClose: function () {
        if (this.detailListRoot.active) {
            this.detailListRoot.active = false;
        }
        else {
            this.node.active = false;
        }

        //  this.close();
    },

    c2sRoomLog: function () {
        cc.showMask('努力加载中',3);
        cc.mgr.net.send(NetId.C2S_ROOM_LOG, { typ: '0' });
        this.mainListContent.removeAllChildren();
    },

    // 一级列表
    s2cRoomLog: function (msg) {
        cc.hideMask();
        if (msg.code != ErrNo.OK) {
            cc.floatTip(msg.msg);
            return;
        }

        this.fillMainList(msg.logs);
    },

    // 二级列表
    s2cPlayGameLog: function (msg) {
        if (msg.code != ErrNo.OK) {
            cc.floatTip(msg.msg);
            return;
        }
        this.fillDetailList(msg);
    },

    fillMainList: function (logs) {
        this.mainListContent.removeAllChildren();

        for (let i = 0; i < logs.length; i++) {
            let node = cc.instantiate(this.mainItemPrefab);
            node.parent = this.mainListContent;
            let script = node.getComponent('RecordMainItem');
            script.init(logs[i], this);
        }

    },

    fillDetailList: function (msg) {
        cc.log('fillDetailList~~>'+JSON.stringify(msg))
        this.detailListRoot.active = true;
        let first = msg.rounds[0];
        if (first) {
            for (let i = 0; i < 4; i++) {
                if (i < first.round_simple_logs.length) {
                    this.playerName[i].node.active = true;
                    this.playerName[i].string = first.round_simple_logs[i].name;
                }
                else {
                    this.playerName[i].node.active = false;
                }
            }
        }

        this.detailListContent.removeAllChildren();
        for (let i = 0; i < msg.rounds.length; i++) {
            let node = cc.instantiate(this.detailItemPrefab);
            node.parent = this.detailListContent;
            let script = node.getComponent('RecordDetailItem');
            script.init(msg.rounds[i], i, this);
        }
    },

    c2sPlayGameLog: function (logDataId) {
        this.lastRequestDataId = logDataId;
        cc.mgr.net.send(NetId.C2S_PLAY_GAME_LOG, { log_data_id: logDataId });
    },

    c2sReplay: function (roundid) {
        //cc.floatTip('暂未开放，敬请期待！');
        cc.mgr.net.send(NetId.C2S_ROUND_GAME_LOG, { log_data_id: this.lastRequestDataId, round_id: roundid+1 });
    },

});
