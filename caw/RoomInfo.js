

cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //    default: null,      // The default value will be used only when the component attaching
        //                           to a node for the first time
        //    url: cc.Texture2D,  // optional, default is typeof default
        //    serializable: true, // optional, default is true
        //    visible: true,      // optional, default is true
        //    displayName: 'Foo', // optional
        //    readonly: false,    // optional, default is false
        // },
        // ...
        roomid: cc.Label,
        time: cc.Label,
        round: cc.Label,
        hostType: cc.Label,

        _tick: 0,

        _orgPos: null,
    },

    // use this for initialization
    onLoad: function () {
        this._orgPos = this.node.getPosition();
        this.hideAct = cc.moveTo(0.2, this._orgPos.x - this.node.width, this._orgPos.y).easing(cc.easeBackIn());
        this.showAct = cc.moveTo(0.2, this._orgPos).easing(cc.easeBackOut());
    },

    setRoomInfo: function (info) {
        this.roomid.string = info.room_id;
        this.hostType.string = RoomType.get(GameType.NiuNiu)[info.host_type];

        if (info.room_type == 0) {
            this.round.node.active = true;
            this.round.string = info.cur_ju + '/' + info.total_ju;
        }
        else {
            this.round.node.active = false;
        }

        var date = new Date();
        this.time.string = cc.js.formatStr('%s:%s', date.getHours(), date.getMinutes());
    },

    // called every frame, uncomment this function to activate update callback
    update: function (dt) {
        this._tick += dt;
        if (this._tick > 60) {
            var date = new Date();
            this.time.string = cc.js.formatStr('%s:%s', date.getHours(), date.getMinutes());
            this._tick = 0;
        }
    },

    show: function (show) {
        if (show > 0) {
            this.node.runAction(this.showAct);
        }
        else {
            this.node.runAction(this.hideAct);
        }
    },

});
