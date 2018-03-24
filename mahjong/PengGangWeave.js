cc.Class({
    extends: cc.Component,

    properties: {
    },

    // use this for initialization
    onLoad: function () {
        this.mjs = [];
        for (let i = 0; i < 4; i++) {
            let mj = this.node.getChildByName('mj' + i);
            this.mjs.push(mj.getComponent(cc.Sprite));
        }
    },

    preInit: function (mgr) {
        this.mgr = mgr;
    },

    init: function (weave, pre, index) {
        let mjid = weave.centerCard;
        let act = weave.weaveKind;
        let provider = weave.provider_id;
        let isme = index == this.mgr.myIndex;

        for (let i = 0; i < 3; i++) {
            // 暗杠
            if (act == 11) {
                let sidePre = isme ? 'M_' : pre;
                this.mjs[i].spriteFrame = this.mgr.mjSprites.getSpriteFrame(sidePre, 255);
            }
            else {
                this.mjs[i].spriteFrame = this.mgr.mjSprites.getSpriteFrame(pre, mjid);
            }
        }
        let gangs = new Set([6, 11, 12]);
        if (gangs.has(act)) {
            this.mjs[3].node.active = true;
            if (!isme && act == 11) {//别人的暗杠
                this.mjs[3].spriteFrame = this.mgr.mjSprites.getSpriteFrame(pre, 255);
            }
            else {
                this.mjs[3].spriteFrame = this.mgr.mjSprites.getSpriteFrame(pre, mjid);
            }
        }
        else {
            this.mjs[3].node.active = false;
        }

        //四人局时 显示谁喂的牌
        this.setProvider(weave, index);

    },
    initChi: function (weave, pre, index) {
        let mjid = weave.centerCard;
        let act = weave.weaveKind;
        let provider = weave.provider_id;
        let isme = index == this.mgr.myIndex;

        let mjlist = [mjid + 2 - act, mjid + 2 - act + 1, mjid + 2 - act + 2];
        for (let i = 0; i < mjlist.length; i++) {
            this.mjs[i].spriteFrame = this.mgr.mjSprites.getSpriteFrame(pre, mjlist[i]);
        }
        this.mjs[3].node.active = false;

        this.setProvider(weave, index);
    },

    setProvider: function (weave, index) {
        let act = weave.weaveKind;
        let provider = weave.provider_id;
        if (this.mgr.roomInfo.count_limit == 4) {
            let localIdx = (provider - index + 4) % 4;
            let highlight = 3 - localIdx;
            if ((act == 6 || act == 12) && localIdx == 2) {
                highlight = 3;
            }
            this.mjs[highlight].node.color = cc.Color.YELLOW;

        }
    },

});
