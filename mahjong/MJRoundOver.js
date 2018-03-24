/**
 * MJLogic.HU_REASON_SELF    = 1 --自己摸牌导致胡牌
MJLogic.HU_REASON_OTHER   = 2 --别人出牌导致胡牌
MJLogic.HU_REASON_HUANG   = 3 --荒牌
MJLogic.HU_REASON_LEAVE   = 4 --投票退出
 */

let MJRoundOverItem = require('MJRoundOverItem');

cc.Class({
    extends: cc.Component,

    properties: {
        zhuaniao: cc.Label,
        niao: cc.Node,

        titles: [cc.Node],
    },

    // use this for initialization
    onLoad: function () {
        let listRoot = cc.find('body/list', this.node);
        this.playerItems = listRoot.getComponentsInChildren(MJRoundOverItem);

        this.btnStartLabel = cc.find('body/btnStart/Label', this.node).getComponent(cc.Label);
        this.roomid = cc.find('body/roomid',this.node).getComponent(cc.Label);
    },

    /**
     * @param {'MJHu_s2c'} msg
     */
    show: function (msg) {
        this.node.active = true;
        let dianpao = -1;
        let voteExit = false;
        if (msg.hu_reason == 2 || msg.hu_reason == 5) {
            dianpao = msg.dian_pao;
        }
        else if (msg.hu_reason == 3) {
            //流局
        }
        else if (msg.hu_reason == 4) {// 投票退出
            voteExit = true;
        }

        this.roomid.string = '房间号:'+cc.mgr.mj.roomInfo.room_id;
        for (let i = 0; i < msg.players.length; i++) {
            let player = msg.players[i];
            this.playerItems[i].init(player);
            this.playerItems[i].setDianpao(dianpao == player.id)
            this.playerItems[i].setJiepao(dianpao >= 0 && player.typ && player.typ.length > 0)
        }

        for (let i = msg.players.length; i < this.playerItems.length; i++) {
            this.playerItems[i].hide();
        }

        this.zhuaniao.node.active = msg.niao_cards.length > 0;
        if (cc.mgr.mj.roomInfo.mj_type == 1) {
            this.zhuaniao.string = '抓鸟';
        }
        else if (cc.mgr.mj.roomInfo.mj_type == 2 || cc.mgr.mj.roomInfo.mj_type == 3) {
            this.zhuaniao.string = '中马';
        }

        let x = 0;
        this.niao.removeAllChildren();
        for (let i = 0; i < msg.niao_cards.length; i++) {
            x = this.addNiao(msg.niao_cards[i], x);
        }

        this.setTitle(msg);

        if (voteExit || cc.mgr.mj.isFinalRound()) {
            this.btnStartLabel.string = '查看战绩';
        }
        else {
            this.btnStartLabel.string = '开始游戏';
        }

        cc.mgr.mj.view.clearTable();

    },

    setTitle: function (msg) {
        let my = null;
        for (let i = 0; i < msg.players.length; i++) {
            if (msg.players[i].id == cc.mgr.mj.myIndex) {
                my = msg.players[i];
                break;
            }
        }

        let title = 0
        if (msg.hu_reason == 3) {
            title = 0;
        }
        else if (my.score > 0) {
            title = 1;
        }
        else {
            title = 2;
        }

        for (let i = 0; i < 3; i++) {
            this.titles[i].active = i == title;
        }
    },

    addNiao: function (mjid, offsetX) {
        let node = new cc.Node('mj');
        node.parent = this.niao;
        node.setPosition(offsetX, 0);
        node.scale = 0.8;
        node.setAnchorPoint(0, 0.5);
        if (mjid > 0) {
            node.color = cc.Color.WHITE;
        }
        else if (mjid < 0) {
            node.color = cc.Color.YELLOW;
            mjid *= -1;
        }

        let spr = node.addComponent(cc.Sprite);
        spr.spriteFrame = cc.mgr.mj.mjSprites.getSpriteFrame('B_', mjid);

        return offsetX + node.getBoundingBox().size.width;
    },

    onClose: function () {
        this.node.active = false;
    },

    onClickedStart: function () {
        cc.mgr.mj.c2sReady();
        this.onClose();
        this.openFinalJiesuan();
    },

    onClickedShare: function () {
        cc.mgr.sdkMgr.shareScreen(WXScene.WXSceneTimeline);
    },

    openFinalJiesuan: function () {
        cc.mgr.mj.onGameResult();
    },

});
