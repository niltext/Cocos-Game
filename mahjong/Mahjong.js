cc.Class({
    extends: cc.Component,

    properties: {
        tag: 0,
        mjid: 0,
        _selected: false,
        _sprite: null,
    },

    // use this for initialization
    onLoad: function () {

        this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.onTouchCancel, this);

        this.orgPos = this.node.getPosition();
        this.standPos = cc.p(this.orgPos.x, this.orgPos.y + 15);

        this._sprite = this.node.getComponent(cc.Sprite);
    },

    onTouchStart: function (event) {
        if (!cc.mgr.mj.isMyTurn()) {
            return;
        }
        let p = event.getLocation();
        let np = this.node.parent.convertToNodeSpaceAR(p);
        this.node.setPosition(np);
        this.node.setLocalZOrder(2);

        cc.mgr.audioMgr.playSFX('mj/audio_card_click.mp3');
    },

    onTouchMove: function (event) {
        if (!cc.mgr.mj.isMyTurn()) {
            return;
        }
        let p = event.getLocation();
        let np = this.node.parent.convertToNodeSpaceAR(p);
        this.node.setPosition(np);
    },

    onTouchEnd: function (event) {
        if (!cc.mgr.mj.isMyTurn()) {
            return;
        }

        let moveDis = this.node.y - this.orgPos.y;
        if (moveDis > 120) {
            this.chupai();
        }
        else {
            //this.node.runAction(cc.moveTo(0.05, cc.p(this.orgPos.x, this.orgPos.y + 15)));
            if (this._selected == true) {
                this.chupai();
            }
            else {
                cc.mgr.mj.view.myHoldsSelected(this.tag)
            }

        }
    },

    onTouchCancel: function (event) {
        this.onTouchEnd(event);
    },

    setSelected: function (val) {
        if (!this.node.active) {
            return;
        }

        this._selected = val;
        this.node.setLocalZOrder(val ? 1 : 0);
        if (val == true) {
            this.node.setPosition(this.standPos);
        }
        else {
            this.node.setPosition(this.orgPos);
        }
    },


    setFace: function (side, mjid) {
        this.node.active = true;

        this._sprite.spriteFrame = cc.mgr.mj.mjSprites.getSpriteFrame(side, mjid);
        this.mjid = mjid;
    },

    //出牌
    chupai: function () {
        cc.mgr.mj.c2sPlayMJ(this.mjid);

        let lcPos = this.node.getPosition();
        let wdPos = this.node.parent.convertToWorldSpaceAR(lcPos);
        cc.mgr.mj.view.tryChupai(this.mjid, wdPos);
        this.node.active = false;
    },

    resetPos: function () {
        this._selected = false;
        this.node.setPosition(this.orgPos);
    },
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
