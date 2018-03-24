const breath = cc.fadeIn(1).repeatForever();

const statusT = '剩余 {0} 张  第 {1}/{2} 局';
const replayProgress = '进度:{0}/{1}';

cc.Class({
    extends: cc.Component,

    properties: {
        text: cc.Label,
        status: cc.Label,
        arraws: [cc.Node],

        _endTime: 0,
    },

    // use this for initialization
    onLoad: function () {
        this.playingAlert = false;

        for (let i = 1; i <= 4; i++) {
            let arraw = cc.find('arraw/fangxiang_' + i, this.node);
            arraw.opacity = 0;
            this.arraws.push(arraw.getComponent(cc.Animation));
        }

        this.audoSource = this.node.getComponent(cc.AudioSource);
    },

    indicate: function (idx, count, callback) {
        if (!this.node.active) {
            this.node.active = true;
        }

        for (let i = 0; i < this.arraws.length; i++) {
            let arraw = this.arraws[i];
            if (i == idx) {
                arraw.node.active = true;
                arraw.play();
            }
            else {
                arraw.stop();
                arraw.node.active = false;
            }
        }
        if (count > 0) {
            this.countdown(count, callback);
        }
        this.audoSource.stop();
    },

    countdown: function (count, callback) {
        this.audoSource.stop();
        this.playingAlert = false;
        if (!this.node.active) {
            this.node.active = true;
        }
        this.text.string = count;
        this.callback = callback;
        this._endTime = cc.sys.now() + count * 1000;
    },

    setStatus: function (left, round, totalRound) {
        if (!this.node.active) {
            this.node.active = true;
        }
        this.status.string = statusT.template(left, round, totalRound);
    },

    setReplayProgress: function (cur, total) {
        if (!this.node.active) {
            this.node.active = true;
        }
        this.status.string = replayProgress.template(cur, total);
    },


    update: function (dt) {
        if (this._endTime == 0) {
            return;
        }
        let diff = (this._endTime - cc.sys.now());
        if (diff >= 0) {
            let c = Math.ceil(diff / 1000);
            this.text.string = c;
            if (c <= 3 && this.playingAlert == false) {
                this.audoSource.play();
                this.playingAlert = true;
            }
        }
        else {
            this.end();
        }
    },

    end: function () {
        this._endTime = 0;
        this.text.string = '0';
        this.playingAlert = false;
        this.audoSource.stop();
        if (this.callback) {
            this.callback();
        }
    },

    hide: function () {
        this.node.active = false;
        this.audoSource.stop();
    },
});
