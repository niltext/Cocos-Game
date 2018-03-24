
let SwallowTouch = require('SwallowTouch');

const winColor = (new cc.Color()).fromHEX('#D76E28');
const loseColor = (new cc.Color()).fromHEX('#ff0000');
cc.Class({
    extends: cc.Component,

    properties: {
        items:[cc.Node],
    },

    // use this for initialization
    onLoad: function () {
        this.node.getComponent(SwallowTouch).callback = this.onClosed.bind(this);
        this.roomid = cc.find('body/roomid', this.node).getComponent(cc.Label);
    },

    onEnable: function () {
        this.items.forEach( function (e) {
            e.active = false;
        })

        cc.mgr.audioMgr.playSFX('accounting.mp3');
    },

    setItem: function (i,player,result, niu) {
        let item = this.items[i];
        item.active = true;
        let portrit = item.getChildByName('portrit').getComponent(cc.Sprite);
        let host = item.getChildByName('host');
        let name = item.getChildByName('name').getComponent(cc.Label);
        let id = item.getChildByName('id').getComponent(cc.Label);
        let score = item.getChildByName('score').getComponent(cc.Label);

        let sub = item.getChildByName('sub');
        let niu_l = sub.getChildByName('niu_l').getComponent(cc.Label);
        let niu_r = sub.getChildByName('niu_r').getComponent(cc.Label);

        let user = cc.mgr.caw.getUserInfo(player.index);
        name.string = user.name;
        id.string = 'ID:' + user.uid;
        host.active = cc.mgr.caw.isHost(user.index);

        cc.utils.setPortrit(portrit, user.head);
        score.string = player.total_score;
        if (player.total_score >= 0) {
            score.node.color = winColor;
        }
        else{
            score.node.color = loseColor;
        }

        //-------
        niu_l.string = '';
        for (let i = 0; i < 5; i++) {
            niu_l.string = niu_l.string +niu[i] + '\r\n';
        }
        niu_l.string = niu_l.string +niu[5];

        niu_r.string = '';
        for (let i = 6; i < 11; i++) {
            niu_r.string = niu_r.string +niu[i] + '\r\n';
        }
        niu_r.string  = niu_r.string + niu[11];

    },

    onJiesuan: function (msg, niu) {
        this.node.active = true;

        for (let i = 0; i < msg.players.length; i++) {
            this.setItem(i, msg.players[i],msg.results[i],niu[msg.players[i].index]);
        }
        this.roomid.string = '房间号:' + cc.mgr.caw.roomInfo.room_id;
    },

    onClickedShare: function () {
	    cc.mgr.sdkMgr.shareScreen(WXScene.WXSceneTimeline);
    },

    onClosed: function () {
        cc.log('CawBill.onClosed');
        cc.director.loadScene('hall');
    },
});
