
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
        this.node.getComponent(SwallowTouch).callback = this.onClosed.bind(this);
    },

    onEnable: function () {
        this.items.forEach(function (e) {
            e.active = false;
        })

        cc.mgr.audioMgr.playSFX('accounting.mp3');
    },

    setItem: function (i, player, result, ju_detail) {
        let item = this.items[i];
        item.active = true;
        let portrit = item.getChildByName('portrit').getComponent(cc.Sprite);
        let host = item.getChildByName('host');
        let name = item.getChildByName('name').getComponent(cc.Label);
        let id = item.getChildByName('id').getComponent(cc.Label);
        let score = item.getChildByName('score').getComponent(cc.Label);

        let win = item.getChildByName('win').getComponent(cc.Label);
        let lose = item.getChildByName('lose').getComponent(cc.Label);
        let draw = item.getChildByName('draw').getComponent(cc.Label);

        let user = cc.mgr.sss.getUserInfo(player.index);
        name.string = user.name;
        id.string = 'ID:' + user.uid;
        host.active = cc.mgr.sss.isHost(user.index);

        cc.utils.setPortrit(portrit, user.head);
        score.string = player.total_score;
        if (player.total_score >= 0) {
            score.node.color = winColor;
        }
        else {
            score.node.color = loseColor;
        }

        win.string = '';
        win.string = win.string + ju_detail[i];
        lose.string = '';
        lose.string = lose.string + ju_detail[i + 1];
        draw.string = '';
        draw.string = draw.string + ju_detail[i + 2];
    },

    onJiesuan: function (msg, ju_detail) {
        this.node.active = true;

        for (let i = 0; i < msg.players.length; i++) {
            this.setItem(i, msg.players[i], msg.results[i], ju_detail[msg.players[i].index]);
        }
    },

    onClickedShare: function () {
        cc.mgr.sdkMgr.shareScreen(WXScene.WXSceneTimeline);
    },

    onClosed: function () {
        cc.log('SssBill.onClosed');
        cc.director.loadScene('hall');
    },
});
