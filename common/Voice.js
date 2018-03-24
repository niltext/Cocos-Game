cc.Class({
    extends: cc.Component,

    properties: {
        _lastTouchTime: null,
        _lastCheckTime: -1,
        MAX_TIME: 15000,
    },

    // use this for initialization
    onLoad: function () {
        this.voice = cc.find('Canvas/voice');
        this.voice.active = false;

        this.voice_failed = this.voice.getChildByName('voice_failed');
        this.voice_failed.active = false;

        this.timeBar = this.voice.getChildByName('time').getComponent(cc.Sprite);
        this.recordingAnim = this.voice.getChildByName('recorder_light').getComponent(cc.Animation);

        if (this.btnMic == null) {
            this.btnMic = cc.find('Canvas/UI/menu/btnMic');
        }

        var self = this;
        this.btnMic.on(cc.Node.EventType.TOUCH_START, function () {
            console.log("cc.Node.EventType.TOUCH_START");
            cc.mgr.voiceMgr.prepare();
            self._lastTouchTime = Date.now();
            self.voice.active = true;
            self.voice_failed.active = false;
            self.recordingAnim.play();
        });

        this.btnMic.on(cc.Node.EventType.TOUCH_MOVE, function () {
            //console.log("cc.Node.EventType.TOUCH_MOVE");
        });

        this.btnMic.on(cc.Node.EventType.TOUCH_END, function () {
            console.log("cc.Node.EventType.TOUCH_END");
            if (Date.now() - self._lastTouchTime < 1000) {
                self.voice_failed.active = true;
                cc.mgr.voiceMgr.cancel();
            }
            else {
                cc.mgr.voiceMgr.release();
            }
            self._lastTouchTime = null;
            self.voice.active = false;
            self.recordingAnim.stop();
        });

        this.btnMic.on(cc.Node.EventType.TOUCH_CANCEL, function () {
            console.log("cc.Node.EventType.TOUCH_CANCEL");
            cc.mgr.voiceMgr.cancel();
            self._lastTouchTime = null;
            self.voice.active = false;
            self.recordingAnim.stop();
        });
    },

    onBtnOKClicked: function () {
        this.voice.active = false;
    },

    // called every frame, uncomment this function to activate update callback
    update: function (dt) {
        if (this._lastTouchTime) {
            var time = Date.now() - this._lastTouchTime;
            if (time >= this.MAX_TIME) {
                cc.mgr.voiceMgr.release();
                this._lastTouchTime = null;
                this.voice.active = false;
                this.recordingAnim.stop();
            }
            else {
                var percent = time / this.MAX_TIME;
                this.timeBar.fillRange = percent;
            }
        }
    },
});
