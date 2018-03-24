cc.Class({
    extends: cc.Component,

    properties: {
        avatar: cc.Sprite,
        username: cc.Label,
        ip: cc.Label,
        uid: cc.Label,
    },

    // use this for initialization
    onLoad: function () {
        this.node.getComponent('SwallowTouch').callback = this.close.bind(this);
    },

    init: function (name, uid, ip, avatar) {
        this.username.string = name;
        this.uid.string = 'ID: ' + uid;
        this.ip.string = 'IP: ' + ip;
        if (avatar instanceof cc.SpriteFrame) {
            this.avatar.spriteFrame = avatar;
        }
    },

    close: function () {
        this.node.destroy();
    },

});
