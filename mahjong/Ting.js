cc.Class({
    extends: cc.Component,

    properties: {
        layout: cc.Layout,
    },

    // use this for initialization
    onLoad: function () {

    },

    setTing: function (list) {
        if (list && list.length > 0){
            this.node.active = true;
            cc.log("setTing"+list)
            this.layout.node.removeAllChildren();
            for (let i = 0; i < list.length; i++) {
                let node = new cc.Node('mj');
                node.parent = this.layout.node;
                let spr = node.addComponent(cc.Sprite);
                spr.spriteFrame = cc.mgr.mj.mjSprites.getSpriteFrame('M_', list[i]);

                node.width = 34.5;
                node.height = 52;
            }
        }else{
            this.node.active = false;
        }
    },
});
