cc.Class({
    extends: cc.Component,

    properties: {
        bar: cc.Sprite,
        text: cc.Label,

        _total: 0,
        _cur: 0,
        _endTime: 0,
    },

    begin: function (count, callback) {
        this.node.active = true;
        this._total = count;
        this._cur = count;
        this.callback = callback;
        this.text.string = this._cur;

        this._endTime = cc.sys.now() + count;
    },


    update: function (dt) {
        if (this._endTime == 0) {
            return;
        }
        let diff = (this._endTime - cc.sys.now());
        if (diff >= 0) {
            let ratio = diff / this._total;
            this.bar.fillRange = ratio;
            this.text.string = Math.ceil(diff/1000);
        }
        else {
            this.end();
        }
    },

    end: function () {
        this._endTime = 0;
        this.node.active = false;
        if (this.callback) {
            this.callback();
        }
    },
});
