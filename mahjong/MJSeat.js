/** MJPlayerWeave.weaveKind 类型参考
1	--没有类型
2	--左吃类型
3	--中吃类型
4	--右吃类型
5	--碰牌类型
6	--杠牌类型,明杠，手上拿三张，杠了别人出的牌
7	--小胡								
8	--吃胡类型
9	--自摸
10	--补张
11	--杠牌类型，暗杠，手上摸到四张同样的牌
12	--杠牌类型，碰杠，碰了别人的牌，后面手上再次摸到一张牌
 */

// 胡牌动画优先级
/**
 * 天胡>海底捞>清一色>杠上花>七小对>碰碰胡>自摸胡>地胡>海底捞>清一色>杠上炮>七小对>碰碰胡>点炮胡
 */

cc.Class({
    extends: cc.Component,

    properties: {
        sidePre: 'B_',
        chupai: cc.Sprite,
        folds: cc.Node,
        penggangSlot: cc.Node,
        penggangPrefab: cc.Prefab,

        _chupaiFrom: null,
        _index: 0,

        _foldsCount: 0,
    },

    // use this for initialization
    onLoad: function () {
        this.folds = this.node.getChildByName('folds');
        this.folds.active = true;
        this.foldsChildren = [];
        for (let i = 0; i < this.folds.childrenCount; i++) {
            this.foldsChildren.push(this.folds.getChildByName('mj' + i));
        }

        this.chupaiPos = this.chupai.node.getPosition();
        let frompos = this.node.getChildByName('chupai_from').getPosition();
        this._chupaiFrom = this.node.convertToWorldSpaceAR(frompos);
        this.mopai = this.node.getChildByName('mopai').getComponent(cc.Sprite);

        //this.chupai.node.active = false;
        let holdRoot = this.node.getChildByName('holds');
        holdRoot.active = true;
        this.holds = [];
        for (let i = 0; i < holdRoot.childrenCount; i++) {
            this.holds.push(holdRoot.children[i]);
            this.holds[i].active = false;
        }

        this.operateRoot = this.node.getChildByName('operation');
        this.operateSpr = this.operateRoot.getChildByName('op').getComponent(cc.Sprite);

        this.clearTable();
    },

    init: function (user) {
        cc.log('MJSeat.init-->' + JSON.stringify(user));
        this.user = user;
        this._index = user.index;
        this.myself = (this._index == cc.mgr.mj.myIndex);
        if (this.myself) {
            for (let i = 0; i < this.holds.length; i++) {
                let mj = this.holds[i].getComponent('Mahjong');
                mj.tag = i;
            }
            this.mopai.node.getComponent('Mahjong').tag = 100;
        }
    },

    onMopai: function (msg) {

        this.refreshMopai(msg.card);
    },

    onChupai: function (msg) {
        //别人出牌
        if (msg.out_card_player != cc.mgr.mj.myIndex) {
            this.playChupaiAnim(msg.relevant_card, this._chupaiFrom);
        }

        this.refreshMj(msg.out_card_plyer_cards);

        this.mopai.node.active = false;

        let p = cc.utils.getMJVoicePath(cc.mgr.mj.roomInfo.mj_type);
        let mjVoice = p + cc.utils.dec2HexStr(msg.relevant_card);
        mjVoice += this.user.sex == 1 ? '_m.mp3' : '_w.mp3';
        cc.mgr.audioMgr.playSFX(mjVoice);
    },
    playChupaiAnim: function (mjid, from) {
        from = this.node.convertToNodeSpaceAR(from);
        this.chupai.node.active = true;
        this.chupai.spriteFrame = cc.mgr.mj.mjSprites.getSpriteFrame('B_', mjid);
        this.chupai.node.setPosition(from);
        this.chupai.node.opacity = 255;
        this.chupai.node.scale = 1.6
        this.chupai.node.runAction(cc.sequence(
            cc.moveTo(0.1, this.chupaiPos),
            cc.delayTime(1),
            cc.fadeOut(0.5)
        ));
    },

    // 刷新玩家所有牌
    /**
    @param playerCards [MJPlayerCards]
    */
    refreshMj: function (playerCards) {
        // if (playerCards.cards.length == 14) {
        //     this.refreshMopai(playerCards.cards.pop());
        // }

        this.refreshHolds(playerCards.cards);

        this.refreshWeaves(playerCards.weaves);

        this.refreshFolds(playerCards.out_cards);
    },

    /**
     * @param weaves [MJPlayerWeave]
     */
    refreshWeaves: function (weaves) {
        this.penggangSlot.removeAllChildren();
        for (let i = 0; i < weaves.length; i++) {
            let weave = weaves[i];
            var pgw = cc.instantiate(this.penggangPrefab).getComponent('PengGangWeave');
            pgw.node.parent = this.penggangSlot;
            pgw.preInit(cc.mgr.mj);
            switch (weave.weaveKind) {
                case 2:
                case 3:
                case 4:
                    pgw.initChi(weave, this.sidePre, this._index);
                    break;
                case 5://碰牌
                    pgw.init(weave, this.sidePre, this._index);
                    break;
                case 6://杠
                case 12://碰杠
                    pgw.init(weave, this.sidePre, this._index);
                    break;
                case 11://暗杠
                    pgw.init(weave, this.sidePre, this._index);
                    break;
                default:
                    break;
            }
        }
    },

    refreshHolds: function (holdslist) {
        let count = holdslist.length;
        if ((holdslist.length - 2) % 3 == 0) {
            let mopai = holdslist[holdslist.length - 1];
            this.refreshMopai(mopai);
            count = holdslist.length - 1;
        }
        for (let i = 0; i < count; i++) {
            let mjnode = this.holds[i];
            mjnode.active = true;
            if (this.myself) {// 我自己
                let mj = mjnode.getComponent('Mahjong');
                let mjid = holdslist[count - i - 1];
                mj.setFace('M_', mjid);
                mj.resetPos();
            }
        }
        for (let i = count; i < this.holds.length; i++) {
            this.holds[i].active = false;
        }
    },

    // 刷新已出的牌
    refreshFolds: function (foldslist) {
        for (let i = 0; i < this.foldsChildren.length; i++) {
            let spr = this.foldsChildren[i].getComponent(cc.Sprite);

            if (i < foldslist.length) {
                spr.node.active = true;
                spr.spriteFrame = cc.mgr.mj.mjSprites.getSpriteFrame(this.sidePre, foldslist[i]);
            }
            else {
                spr.node.active = false;
            }
        }
        this._foldsCount = foldslist.length;
    },

    refreshMopai: function (mopai) {
        if (this.myself) {
            let mj = this.mopai.node.getComponent('Mahjong');
            mj.setFace('M_', mopai);
            mj.resetPos();
        }
        else if (mopai == 255) {
            this.mopai.node.active = true;
        }
    },

    onMyHoldsSelected: function (tag) {
        for (let i = 0; i < this.holds.length; i++) {
            let mj = this.holds[i].getComponent('Mahjong');
            mj.setSelected(tag == mj.tag);
        }

        let mj = this.mopai.node.getComponent('Mahjong');
        mj.setSelected(tag == mj.tag);
    },
    clearTable: function () {
        this.refreshWeaves([]);
        this.refreshFolds([]);
        this.refreshHolds([]);
        this.mopai.node.active = false;
        this.chupai.node.active = false;
    },

    onOperate: function (msg) {

        //todo:播放操作动画
        if (msg.operate_player_cards) {
            this.refreshMj(msg.operate_player_cards);
        }
        let spriteCache = cc.mgr.mj.view.spriteCache;

        let actVoice = '';
        let opSpr = null;
        // 声音/动画
        switch (msg.action) {
            case 2:
            case 3:
            case 4:
                actVoice = 'chi1';
                opSpr = spriteCache.chi;
                break;
            case 5:
                actVoice = 'peng3';
                opSpr = spriteCache.peng;
                break;
            case 6:
            case 11:
            case 12:
                actVoice = 'gang1';
                opSpr = spriteCache.gang;
                break;
            case 8:
                actVoice = 'hu2';
                break;
            case 9:
                actVoice = 'zimo2';
                break;

        }
        let p = cc.utils.getMJVoicePath(cc.mgr.mj.roomInfo.mj_type);
        let v = '{0}{1}_{2}.mp3'.template(p, actVoice, this.user.sex == 1 ? 'm' : 'w');
        cc.mgr.audioMgr.playSFX(v);

        if (opSpr) {
            this.operateRoot.active = true;
            this.operateSpr.spriteFrame = opSpr;
        }
    },

    getLastMJWorldPos: function () {
        let mjnode = this.foldsChildren[this._foldsCount - 1];
        if (mjnode) {
            let wpos = mjnode.parent.convertToWorldSpaceAR(mjnode.getPosition());
            wpos.y += 30;
            return wpos;
        }
    },

    /**
     * @param data {'MJPlayerData'}
     */
    onHupai: function (data) {
        // 语音
        let huAudio = null;
        if (data.typ.length > 0) {
            huAudio = data.typ.contains(4) ? 'zimo2' : 'hu2';
        }
        if (huAudio) {
            let user = cc.mgr.mj.getUserInfo(data.id);
            let p = cc.utils.getMJVoicePath(cc.mgr.mj.roomInfo.mj_type);
            let v = '{0}{1}_{2}.mp3'.template(p, huAudio, user.sex == 1 ? 'm' : 'w');
            cc.mgr.audioMgr.playSFX(v);
        }

        // 动画
        if (data.typ.length > 0) {
            let huSpr = cc.mgr.mj.view.spriteCache.hu[data.typ[0]];
            if (huSpr) {
                this.operateRoot.active = true;
                this.operateSpr.spriteFrame = huSpr;
            }
        }

    },
});
