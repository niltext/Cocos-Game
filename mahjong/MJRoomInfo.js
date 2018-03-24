cc.Class({
    extends: cc.Component,

    properties: {
        roomid: cc.Label,
        time: cc.Label,
        rule: cc.Label,
        _tick: 0,
    },

    // use this for initialization
    onLoad: function () {

    },

    setRoomInfo: function (info) {
        this.roomid.string = '房号:'+info.room_id;

        var date = new Date();
        let mi = date.getMinutes();
        if (mi < 10) {
           mi = '0'+mi;
        }
        this.time.string = cc.js.formatStr('%s:%s', date.getHours(), mi);

        this.rule.string = cc.utils.getMJRule(info);
    },

    update: function (dt) {
        this._tick += dt;
        if (this._tick > 60) {
            var date = new Date();
            this.time.string = cc.js.formatStr('%s:%s', date.getHours(), date.getMinutes());
            this._tick = 0;
        }
    },
});
