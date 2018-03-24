let count = 0;
cc.Class({
    extends: cc.Component,

    properties: {

        back: {
            default: null,
            type: cc.Node
        },
        _selected: false,
        face: 0, // 牌面值
        floatCount: 0,
    },
    onLoad: function () {
        this.anim = this.node.getComponent(cc.Animation);
        this.node.selected = false;

        //this.node.on(cc.Node.EventType.TOUCH_END, this.onSelect.bind(this), this.node);
    },

    unuse: function () {
        this.node.off(cc.Node.EventType.TOUCH_END, this.onSelect.bind(this), this.node);
        //this._back.active = true;
    },

    reuse: function () {
        this.node.on(cc.Node.EventType.TOUCH_END, this.onSelect.bind(this), this.node);
        this._selected = false;
        this.node.setPosition(0, 0);
        this.node.scale = 1;
        this.face = 0;

        this.back.active = true;
    },

    onSelect: function () {
        // this._selected = !this._selected;
        // this.node.y = this._selected ? this.node.y + 30 : this.node.y - 30;
    },

    setFace: function (face) {
        this.face = face;

        let frameName = cc.utils.dec2HexStr(face);
        // 加载 SpriteFrame
        var self = this;
        cc.loader.loadRes("atlas/cards", cc.SpriteAtlas, function (err, atlas) {
            var frame = atlas.getSpriteFrame(frameName);
            self.node.getComponent(cc.Sprite).spriteFrame = frame;
        });
    },

    turn: function (face) {
        if (face) {
            this.setFace(face);
        }
        if (this.node.scale < 1) {
            this.anim.play('deal-small');
        }
        else {
            this.anim.play();
        }
        this.tempY = this.node.y;
    },

    moveRight: function () {
        this.node.runAction(cc.moveBy(0.5, 40, 0));
    },

    onClickedPoker: function (event) {
        if (1 == this.node.scale) {
            cc.mgr.audioMgr.playButton();
            let transY = (this.node.y > this.tempY) ? -20 : 20;

            this.node.runAction(cc.moveBy(0.15, 0, transY));

            if (transY > 0) {
                count++;
            }
            else {
                count--;
            }
        }
    },
});
