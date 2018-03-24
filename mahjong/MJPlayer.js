cc.Class({
    extends: cc.Component,

    properties: {
        _lbName: null,
        _portrit: null,
        _score: null,
        _banker: null,
        _ready: null,
        _slot: null,


        _userid: 0,
        _index: 0,
        _speaking: null,
    },

    // use this for initialization
    onLoad: function () {
        this._lbName = cc.find('playerInfo/name', this.node).getComponent(cc.Label);
        this._score = cc.find('playerInfo/score', this.node).getComponent(cc.Label);
        this._portrit = cc.find('playerInfo/portrit', this.node).getComponent(cc.Sprite);
        this._banker = cc.find('playerInfo/banker', this.node);
        this.bankerAnim = this._banker.getComponentInChildren(cc.Animation);
        this._ready = cc.find('ready', this.node);
        this._offline = cc.find('offline', this.node);
        this._speaking = cc.find('speaking', this.node).getComponent(cc.Animation);

        this.emoji = cc.find('emoji', this.node).getComponent(cc.Sprite);
        this.chat = cc.find('chatText', this.node);
        this.chatText = cc.find('chatText/text', this.node).getComponent(cc.Label);
        this.floatNum = cc.find('floatNum', this.node);
        this.floatNum.active = false;

        let avatar_default = cc.find('playerInfo/avatar_default', this.node);
        avatar_default.on('touchend', (event) => {
            cc.mgr.mj.showPlayerDetail(this._index, this._portrit.spriteFrame);
        });
    },


    onStarted: function () {
        if (this._index > 0) {
            this.setBanker(this._index == cc.mgr.mj.roomInfo.host_id);
            this._ready.active = false;
        }
    },

    setInfo: function (info) {
        cc.log('MJPlayer.setInfo-->' + JSON.stringify(info));
        this.show();

        this._userid = info.uid;
        this._index = info.index;
        this._lbName.string = info.name;

        //this._score.string = info.score;
        this.setReady(info.ready, info.score);
        this.setPortrit(info.head);
        this.setOffline(info.out_line);
        this.setBanker(info.index == cc.mgr.mj.roomInfo.host_id);

    },

    setReady: function (val, score) {
        this.clear();
        this._ready.active = val;
        if (typeof (score) != 'undefined') {
            this.setScore(score);
        }

        let room = cc.mgr.mj.roomInfo;
        this.setBanker(this._index == room.host_id);

    },

    clear: function () {
        this._banker.active = false;
        this._ready.active = false;

        this.emoji.node.active = false;
        this.chat.active = false;
        this._speaking.node.active = false;

        this.setOffline(false);
    },

    setPortrit: function (url) {
        cc.utils.setPortrit(this._portrit, url);
    },

    setBanker: function (val, playAnim) {

        this._banker.active = val;
        if (val && playAnim) {
            this.bankerAnim.play();
        }
    },

    setScore: function (score) {
        this._score.string = cc.utils.formatNumber(score);
    },

    setOffline: function (val) {
        this._offline.active = val;
        this._portrit.node.color = val ? cc.Color.GRAY : cc.Color.WHITE;
    },

    hide: function () {
        this.node.active = false;
    },

    show: function () {
        this.node.active = true;
    },

    setChat: function (mode, idx) {
        if (mode == 2) {
            this.emoji.node.active = true;
            cc.utils.setEmoji(this.emoji, idx);

            this.emoji.node.scale = 0.1;
            this.emoji.node.stopAllActions();
            this.emoji.node.runAction(cc.scaleTo(0.5, 1).easing(cc.easeBackOut()));
            this.emoji.node.getComponent('AutoDisable').reset();
        }
        else if (mode == 1) {
            let data = cc.utils.getChatText(idx);
            if (!data) {
                return;
            }

            this.chat.active = true;
            this.chatText.string = data.text;
            this.chat.scale = 0.1;
            this.chat.stopAllActions();
            this.chat.runAction(cc.scaleTo(0.5, 1).easing(cc.easeBackOut()));
            this.chat.getComponent('AutoDisable').reset();

            // 语音
            let user = cc.mgr.mj.getUserInfo(this._index);
            let pre = user.sex == 1 ? 'm_' : 'f_';
            let url = 'quickchat/' + pre + data.voice;
            cc.mgr.audioMgr.playSFX(url);

        }
        else if (mode == 0) {
            let self = this;

            cc.log("seat play voice", idx, this._index);
            cc.mgr.voiceMgr.play(idx, this._index.toString(),
                function (url, index) {
                    self.speak();
                },
                function (url, index) {
                    cc.log("seat voice paly end");
                    self._speaking.node.active = false;
                }
            );
        }
        else if (mode == 3) {
            this.chat.active = true;
            this.chatText.string = idx.toString();
            this.chat.scale = 0.1;
            this.chat.stopAllActions();
            this.chat.runAction(cc.scaleTo(0.5, 1).easing(cc.easeBackOut()));
            this.chat.getComponent('AutoDisable').reset();
        }
    },
    speak: function () {
        this._speaking.node.active = true;
        this._speaking.play();
    },

    onLeave: function () {
        this._index = 0;
        this.node.active = false;

    },

    onRejoin: function (status,play_status) {
        if (status == 3 && play_status != 9) {
            this._ready.active = false;
        }

    },

    floatScore: function (num) {
        this.floatNum.active = true;

        let lbl = this.floatNum.getComponentInChildren(cc.Label);
        let cl = new cc.Color();
        if (num >= 0) {
            cl.fromHEX('#FFC200');
            lbl.string = '+' + num.toString();
        }
        else {
            cl.fromHEX('#00CCFF');
            lbl.string = num.toString();
        }
        lbl.node.color = cl;
        this.floatNum.getComponent(cc.Animation).play();
    },

});
