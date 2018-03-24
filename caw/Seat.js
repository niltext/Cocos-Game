cc.Class({
    extends: cc.Component,

    properties: {
        _lbName: null,
        _portrit: null,
        _score: null,
        _banker: null,
        _ready: null,
        _slot: null,
        _niu: null,

        _pokerPool: null,

        _userid: 0,
        _index: 0,

        _cards: null,

        _speaking: null,

        _cardsParent: null,

        hasXiazhu: false,
    },

    // use this for initialization
    onLoad: function () {

        this._lbName = cc.find('playerInfo/name', this.node).getComponent(cc.Label);
        this._score = cc.find('playerInfo/score', this.node).getComponent(cc.Label);
        this._portrit = cc.find('playerInfo/portrit', this.node).getComponent(cc.Sprite);
        this._banker = cc.find('playerInfo/banker', this.node);
        this.bankerAnim = this._banker.getComponentInChildren(cc.Animation);
        this._ready = cc.find('ready', this.node);
        this._bet = cc.find('bet', this.node).getComponent(cc.Label);
        this._slot = this.node.getChildByName('slot');
        this._niu = cc.find('niu', this.node);
        this._niubg = this._niu.getChildByName('bg').getComponent(cc.Sprite);
        this._niunum = this._niu.getChildByName('niunum').getComponent(cc.Sprite);
        this._speaking = cc.find('speaking', this.node).getComponent(cc.Animation);

        this._offline = cc.find('offline', this.node);
        this._waiting = cc.find('waiting', this.node);

        this.emoji = cc.find('emoji', this.node).getComponent(cc.Sprite);
        this.chat = cc.find('chatText', this.node);
        this.chatText = cc.find('chatText/text', this.node).getComponent(cc.Label);

        this._qiang = cc.find('qiang', this.node);
        this.floatNum = cc.find('floatNum', this.node);
        this.floatNum.active = false;

        this._cards = new Array();
        this.clear();

        let avatar_default = cc.find('playerInfo/avatar_default', this.node);
        avatar_default.on('touchend', (event) => {
            cc.mgr.caw.showPlayerDetail(this._index, this._portrit.spriteFrame);
        });
    },

    init: function (cardParent, pool) {
        this._cardsParent = cardParent;
        this._pokerPool = pool;
    },

    onStarted: function () {
        if (this._index > 0) {
            this.setBanker(false);
            this._ready.active = false;
        }
    },

    /**
     * info: message RoomUserInfo
     */
    setInfo: function (info) {
        cc.log('!----------------->')
        cc.log(JSON.stringify(info));
        this.show();

        this._userid = info.uid;
        this._index = info.index;
        this._lbName.string = info.name;

        //this._score.string = info.score;
        this.setReady(info.ready, info.score);
        this.setPortrit(info.head);
        this.setOffline(info.out_line);
        this.setBanker(info.index == cc.mgr.caw.roomInfo.host_id);

        if (info.has_xia_zhu != 0) {
            this.setBet(info.xia_zhu);
            this.hasXiazhu = true;
        }
        else {
            this._bet.node.active = false;
            this.hasXiazhu = false;
        }

        if (cc.mgr.caw.isGoldRoom()) {
            this._score.fontSize = 20;
        }
        else {
            this._score.fontSize = 36;
        }

        this._waiting.active = cc.mgr.caw.isWaiting(this._index);

    },

    /**
     @param val 1抢 0不抢
     */
    setQiang: function (val, playAnim) {
        this._qiang.active = true;
        this._qiang.getChildByName('1').active = val;
        this._qiang.getChildByName('0').active = !val;

        if (playAnim) {
            this._qiang.getComponent(cc.Animation).play();
            let v = '';
            let user = cc.mgr.caw.getUserInfo(this._index);
            if (val) {
                v = user.sex == 1 ? 'caw/qiangzhuang_m.mp3' : 'caw/qiangzhuang_f.mp3';
            }
            else {
                v = user.sex == 1 ? 'caw/buqiang_m.mp3' : 'caw/buqiang_f.mp3';

            }
            cc.mgr.audioMgr.playSFX(v);
        }
    },

    setReady: function (val, score) {
        this.clear();
        this._ready.active = val;
        this.setScore(score);

        let room = cc.mgr.caw.roomInfo;
        if (room.status >= 100) {
            this.setBanker(this._index == room.host_id);
        }
        else {
            this.setBanker(false);
        }

    },

    clear: function () {
        this._banker.active = false;
        this._ready.active = false;
        this._bet.node.active = false;
        this._niu.active = false;
        this.emoji.node.active = false;
        this.chat.active = false;
        this._speaking.node.active = false;
        this._waiting.active = false;
        this.hasXiazhu = false;
        this.setQiang(false);

        this.setOffline(false);

        this.recycle();
    },

    recycle: function () {

        // 收回对象池
        for (let i = 0; i < this._cards.length; i++) {
            this._pokerPool.put(this._cards[i].node);
        }

        this._cards = new Array();
    },
    setPortrit: function (url) {
        cc.utils.setPortrit(this._portrit, url);
        // let self = this;
        // cc.loader.load(url + '.jpg', function (err, tex) {
        //     if (err) {
        //         cc.error(err.message || err);
        //         return;
        //     }
        //     let spriteFrame = new cc.SpriteFrame(tex, cc.Rect(0, 0, tex.width, tex.height));
        //     self._portrit.spriteFrame = spriteFrame;
        // });

    },

    setBanker: function (val, playAnim) {
        this._qiang.active = false;
        this._banker.active = val;
        if (val && playAnim) {
            this.bankerAnim.play();
        }
    },

    setBet: function (val) {
        this._bet.node.active = true;
        this._bet.string = 'x' + val;
    },

    setScore: function (score) {
        this._score.string = cc.utils.formatNumber(score);
    },

    setOffline: function (val) {
        this._offline.active = val;
        this._portrit.node.color = val ? cc.Color.GRAY : cc.Color.WHITE;
    },

    // 发牌
    deal: function (cards) {
        cc.mgr.audioMgr.playSFX('dealcard.mp3');
        this.recycle();

        let myself = (this._index == cc.mgr.caw.myIndex);

        let wdPos = this.node.convertToWorldSpaceAR(this._slot.getPosition());
        let targetPos = cc.v2(this._cardsParent.convertToNodeSpaceAR(wdPos));

        for (let i = 0; i < cards.length; i++) {
            let pokerNode = this._pokerPool.get();
            pokerNode.parent = this._cardsParent;

            let seqArray = [cc.delayTime(0.1 * i)];

            if (myself) {
                let moveTo = cc.moveTo(0.2, targetPos.add(cc.v2(i * 30 + 50, 0)));
                seqArray.push(moveTo);
                seqArray.push(cc.delayTime(0.1 * (5 - i)));
                seqArray.push(cc.moveBy(0.15, cc.v2(i * 70, 0)));
            }
            else {
                let moveTo = cc.moveTo(0.2, targetPos.add(cc.v2(i * 30 + 50, 0)));
                moveTo = cc.spawn(moveTo, cc.scaleTo(0.3, 0.7));
                seqArray.push(moveTo);
            }

            let seq = cc.sequence(seqArray);
            pokerNode.runAction(seq);

            let poker = pokerNode.getComponent('Poker');
            this._cards.push(poker);
        }
    },

    dealImmediately: function (cards) {
        if (!cards || cards.length == 0) {
            cards = [0, 0, 0, 0, 0];
        }
        this.recycle();
        let myself = (this._index == cc.mgr.caw.myIndex);

        let wdPos = this.node.convertToWorldSpaceAR(this._slot.getPosition());
        let targetPos = cc.v2(this._cardsParent.convertToNodeSpaceAR(wdPos));

        for (let i = 0; i < cards.length; i++) {
            cc.log('!!------' + cards[i])
            let pokerNode = this._pokerPool.get();
            pokerNode.parent = this._cardsParent;

            if (myself) {
                pokerNode.position = targetPos.add(cc.v2(i * 100 + 50, 0));
            }
            else {
                pokerNode.position = targetPos.add(cc.v2(i * 30 + 50, 0));
                pokerNode.scale = 0.7
            }

            let poker = pokerNode.getComponent('Poker');
            if (cards[i] > 0) {
                poker.turn(cards[i])
            }

            this._cards.push(poker);
        }
    },

    onCalc: function (niu, cards) {
        this._niu.active = true;

        let sframe = cc.mgr.caw.sprCache.niunum[niu];
        if (sframe) {
            this._niunum.spriteFrame = sframe;
        }

        let bgindex = 0;
        if (niu > 0 && niu < 10) {
            bgindex = 2;
        }
        else if (niu >= 10) {
            bgindex = 1;
        }
        let bgFrame = cc.mgr.caw.sprCache.niunumBg[bgindex];
        if (bgFrame) {
            this._niubg.spriteFrame = bgFrame;
        }

        let anim = this._niu.getComponent(cc.Animation);
        anim.play();

        // 声音
        let user = cc.mgr.caw.getUserInfo(this._index);
        let sex = user.sex == 1 ? '_m' : '_w';
        cc.mgr.audioMgr.playSFX('caw/niu_' + niu + sex + '.mp3');

        if (this._index != cc.mgr.caw.myIndex) {
            for (let i = 0; i < this._cards.length; i++) {
                this._cards[i].turn(cards[i]);

                // 别人的牌最后两张拉开
                if (niu > 0 && i > 2) {
                    this._cards[i].moveRight();
                }
            }
        }
        else if (niu > 0) {// 自己
            this.selectNiu(cards.slice(0, 3));
        }
    },

    setCards: function (cards) {
        for (let i = 0; i < cards.length; i++) {
            this.setCard(i, cards[i]);
        }
    },

    setCard: function (i, card) {
        let p = this._cards[i];
        if (p) {
            p.turn(card)
        }
    },

    hide: function () {
        this.node.active = false;
    },

    show: function () {
        this.node.active = true;
    },

    setChat: function (mode, idx) {
        cc.log('聊天：%d,%s', mode, idx)
        if (mode == 2) {
            this.emoji.node.active = true;
            cc.utils.setEmoji(this.emoji, idx);

            this.emoji.node.scale = 0.1;
            this.emoji.node.runAction(cc.scaleTo(0.5, 1).easing(cc.easeBackOut()));
        }
        else if (mode == 1) {
            let data = cc.utils.getChatText(idx);
            if (!data) {
                return;
            }

            this.chat.active = true;
            this.chatText.string = data.text;
            this.chat.scale = 0.1;
            this.chat.runAction(cc.scaleTo(0.5, 1).easing(cc.easeBackOut()));

            // 语音
            let user = cc.mgr.caw.getUserInfo(this._index);
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
    },
    speak: function () {
        this._speaking.node.active = true;
        this._speaking.play();
    },

    onLeave: function () {
        this._index = 0;
        this.node.active = false;
        this.recycle();
    },

    getGoldPos: function () {
        let wdPos = this.node.convertToWorldSpaceAR(this._portrit.node.getPosition());
        let cvs = cc.find('Canvas');

        return cc.v2(cvs.convertToNodeSpaceAR(wdPos));
    },

    onRejoin: function (status) {
        switch (status) {
            case 0:
                this._bet.node.active = false;
                break;
            case 99:
            case 100:
            case 101:
                this._bet.node.active = false;
                this.onStarted();
                break;
            case 102:
                this._ready.active = false;
                this._bet.node.active = this.hasXiazhu;
                break;
            case 103:
                this._bet.node.active = true;
                this.onStarted();
                break;
            case 104:
                break;

            default:
                break;
        }

    },

    selectNiu: function (niuCards) {
        for (let i = 0; i < niuCards.length; i++) {
            for (let j = 0; j < this._cards.length; j++) {
                let poker = this._cards[j];
                if (poker.face == niuCards[i]) {
                    poker.standup();
                    break;
                }
            }
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

