
let SwallowTouch = require('SwallowTouch');

const winColor = (new cc.Color()).fromHEX('#D76E28');
const loseColor = (new cc.Color()).fromHEX('#ff0000');
cc.Class({
    extends: cc.Component,

    properties: {
        items: [cc.Node],
    },

    // use this for initialization
    onLoad: function () {
        let scorelist = cc.find('body/scoreList', this.node);
        this.items = scorelist.children;

        this.node.getComponent(SwallowTouch).callback = this.onClosed.bind(this);
        this.roomid = cc.find('body/roomid', this.node).getComponent(cc.Label);
    },

    onEnable: function () {
        this.items.forEach(function (e) {
            e.active = false;
        })

        cc.mgr.audioMgr.playSFX('accounting.mp3');
    },

    setItem: function (i, statData) {
        let item = this.items[i];
        item.active = true;
        let portrit = item.getChildByName('portrit').getComponent(cc.Sprite);
        let host = item.getChildByName('host');
        let name = item.getChildByName('name').getComponent(cc.Label);
        let id = item.getChildByName('id').getComponent(cc.Label);
        let score = item.getChildByName('score').getComponent(cc.Label);

        let sub = item.getChildByName('sub');
        let niu_l = sub.getChildByName('niu_l').getComponent(cc.Label);
        let winFlag = item.getChildByName('icon_mask_winner');
        let user = cc.mgr.mj.getUserInfo(statData.id);
        name.string = user.name;
        id.string = 'ID:' + user.uid;
        host.active = cc.mgr.mj.isFangzhu(user.index);

        cc.utils.setPortrit(portrit, user.head);
        score.string = statData.total_score;
        cc.log("%d: totalscore:", i, statData.total_score)
        if (statData.total_score >= 0) {
            score.node.color = winColor;
        }
        else {
            score.node.color = loseColor;
        }

        //-------
        niu_l.string = statData.total_zi_mo_count.toString()
            + '\r\n'
            + statData.total_jie_pao_count.toString()
            + '\r\n'
            + statData.total_dian_pao_count.toString()
            + '\r\n'
            + statData.total_gang_an_count.toString()
            + '\r\n'
            + statData.total_gang_ming_and_peng_count;


        winFlag.active = false;
        if (statData.total_score >= this.max_score_) {
            winFlag.active = true;
            if (this.max_score_flag_) {
                this.max_score_flag_.active = false;
            }
            this.max_score_flag_ = winFlag;
            this.max_score_ = statData.total_score;
        }
    },

    onJiesuan: function (msg) {
        this.node.active = true;
        this.max_score_ = 0
        this.max_score_flag_ = null
        for (let i = 0; i < msg.stat.length; i++) {
            this.setItem(i, msg.stat[i]);
        }

        this.roomid.string = '房间号:' + cc.mgr.mj.roomInfo.room_id;
    },

    onClickedShare: function () {
        cc.mgr.sdkMgr.shareScreen(WXScene.WXSceneTimeline);
    },

    onClosed: function () {
        cc.log('MJBill.onClosed');
        cc.director.loadScene('hall');
    },
});
