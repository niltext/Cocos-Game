/**
 * 胡牌类型
 * MJLogic.HU_UNKNOW		=			0 --占位
MJLogic.HU_TIAN			= 			1 --天胡
MJLogic.HU_DI			=			2 --地胡
MJLogic.HU_DIAN_PAO		=			3 --点炮胡
MJLogic.HU_ZI_MO		=			4 --自摸胡 
MJLogic.HU_GANG_SHANG_HUA =         5 --杠上花
MJLogic.HU_GANG_SHANG_PAO =         6 --杠上炮
MJLogic.HU_HAI_DI_LAO_YUE =         7 --海底捞月

 */

const huDesc = ['', '天胡', '地胡', '点炮胡', '自摸胡', '杠上花', '杠上炮', '海底捞月', '大七对',
    '七小对', '碰碰胡', '门清', '清一色', '十三幺', '全求人', '抢杠胡','双豪华七小对','海底炮','全求炮',
    '四归一','一条龙'];
cc.Class({
    extends: cc.Component,

    properties: {
        banker: cc.Node,
        nick: cc.Label,
        desc: cc.Label,
        mjsRoot: cc.Node,
        score: cc.Label,
        hu: cc.Node,
    },

    // use this for initialization
    onLoad: function () {
        this.dianpao = false;
        this.jiepao = false;
    },

    init: function (data) {
        this.winColor = new cc.Color(215, 110, 40);
        this.loseColor = new cc.Color(97, 200, 250);

        this.node.active = true;
        this.mjsRoot.removeAllChildren();

        let user = cc.mgr.mj.getUserInfo(data.id);
        this.nick.string = cc.utils.trimCNStr(user.name,14);

        this.banker.active = cc.mgr.mj.isHost(data.id);

        let x = 0;
        let cards = data.all_cards;
        // 碰杠吃
        for (let i = 0; i < cards.weaves.length; i++) {
            let count = 3;
            let kind = cards.weaves[i].weaveKind;
            if (kind == 6 || kind == 11 || kind == 12) {//三种杠
                count = 4;
            }

            for (let j = 0; j < count; j++) {
                x = this.addMJ(cards.weaves[i].centerCard, x);
            }
            x += 20;

            // // 喂牌者
            // if (cc.mgr.mj.roomInfo.count_limit == 4) {

            // }
        }

        // 散牌
        for (let i = 0; i < cards.cards.length; i++) {
            // 胡的牌分开
            if (i == cards.cards.length - 1 && data.typ && data.typ.length > 0) {
                x += 20;
            }
            x = this.addMJ(cards.cards[i], x);
        }

        let desc = '';
        if (data.jie_gang_count > 0) {
            desc += '接杠x' + data.jie_gang_count;
        }

        if (data.an_gang_count > 0) {
            desc += ' 暗杠x' + data.an_gang_count;
        }

        if (data.peng_gang_count > 0) {
            desc += ' 碰杠x' + data.peng_gang_count;
        }

        if (data.dian_gang_count > 0) {
            desc += ' 点杠x' + data.dian_gang_count;
        }

        this.desc.string = desc;

        this.score.string = data.score;
        this.score.node.color = data.score > 0 ? this.winColor : this.loseColor;
        if (data.typ && data.typ.length > 0) {
            this.hu.active = true;
            let temp = '';
            for (let i = 0; i < data.typ.length; i++) {
                temp += huDesc[data.typ[i]] + ' ';
            }
            this.desc.string = temp + '  ' + this.desc.string;

            let niao = '中鸟';
            if (cc.mgr.mj.roomInfo.mj_type == 2 || cc.mgr.mj.roomInfo.mj_type == 3) {
                niao = '中马';
            }
            if (data.zhong_ma_cards instanceof Array) {
                this.desc.string = this.desc.string + ' ' + niao + 'x' + data.zhong_ma_cards.length;
            }

        }
        else {
            this.hu.active = false;
        }
    },

    addMJ: function (mjid, offsetX) {
        let node = new cc.Node('mj');
        node.parent = this.mjsRoot;
        node.setPosition(offsetX, 0);
        node.scale = 0.8;
        node.setAnchorPoint(0, 0.5);

        let spr = node.addComponent(cc.Sprite);
        spr.spriteFrame = cc.mgr.mj.mjSprites.getSpriteFrame('B_', mjid);

        return offsetX + node.getBoundingBox().size.width;
    },

    hide: function () {
        this.node.active = false;
    },

    //点炮
    setDianpao: function (val) {
        this.dianpao = val;
        if (val) {
            this.desc.string = '点炮  ' + this.desc.string;
        }

    },
    //接炮
    setJiepao: function (val) {
        if (val) {
            this.desc.string = '接炮  ' + this.desc.string;
        }

        this.jiepao = val;
    },

    getProviderLocalIndex: function (provider, curIndex) {
        let localIdx = (provider - index + 4) % 4;
        let highlight = 3 - localIdx;
        if ((act == 6 || act == 12) && localIdx == 2) {
            highlight = 3;
        }
        return highlight;
    },

});
