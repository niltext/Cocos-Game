cc.Class({
    extends: cc.Component,

    properties: {
        layout1: cc.Node,
        layout2: cc.Node,
        title: cc.Sprite,

        zhuaniaoF: cc.SpriteFrame,
        zhongmaF: cc.SpriteFrame,
    },

    // use this for initialization
    onLoad: function () {
        this.mjlist = this.layout1.getComponentsInChildren(cc.Sprite);
        let list2 = this.layout2.getComponentsInChildren(cc.Sprite);
        this.mjlist = this.mjlist.concat(list2);

        this.autoDisable = this.node.getComponent('AutoDisable');
    },

    begin: function (list, mgr) {
        this.logicMgr = mgr;
        this.node.active = true;
        if (this.logicMgr.roomInfo.mj_type == 1) {
            this.title.spriteFrame = this.zhuaniaoF;
        }
        else if (this.logicMgr.roomInfo.mj_type == 2 || this.logicMgr.roomInfo.mj_type == 3) {
            this.title.spriteFrame = this.zhongmaF;
        }

        let self = this;
        for (let i = 0; i < list.length; i++) {
            let mj = this.mjlist[i];
            mj.node.active = true;
            mj.spriteFrame = this.logicMgr.mjSprites.getSpriteFrame('B_', 255);

            cc.delayedCall(mj.node, (i + 1) * 0.1, function () {
                mj.spriteFrame = self.logicMgr.mjSprites.getSpriteFrame('B_', Math.abs(list[i]));
                mj.node.color = list[i] > 0 ? cc.Color.WHITE : cc.Color.YELLOW;
            })
        }

        for (let i = list.length; i < this.mjlist.length; i++) {
            this.mjlist[i].node.active = false;
        }

        let life = list.length * 0.1 + 1;
        if (this.logicMgr.isReplay) {
            life += 1;
        }

        this.autoDisable.reset(life);

        cc.mgr.audioMgr.playSFX('zhuaNiao.mp3');
    },
});
