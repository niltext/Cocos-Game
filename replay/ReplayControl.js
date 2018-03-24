cc.Class({
    extends: cc.Component,

    properties: {
        controlView: cc.Node,
        replayPrefab: cc.Prefab,

        spPlay: cc.Node,
        spPause: cc.Node,
    },

    // use this for initialization
    onLoad: function () {
        this.playing = false;
        this.nextStepTime = 1;
    },

    open: function (msg) {
        let replayNode = cc.instantiate(this.replayPrefab);
        replayNode.parent = this.node;
        replayNode.setLocalZOrder(-1);
        this.replay = replayNode.getComponent('MJReplay');
        this.replay.init(msg);
        this.playing = true;
        this.nextStepTime = 1;

        this.controlView.active = true;

        this.spPause.active = this.playing;
        this.spPlay.active = !this.playing;
    },
    onClickedClose: function () {
        this.replay.close();
        this.replay = null;
        this.controlView.active = false;
        this.playing = false;
        this.nextStepTime = 1;
    },

    onClickedPause: function () {
        this.playing = !this.playing;
        this.spPause.active = this.playing;
        this.spPlay.active = !this.playing;
    },

    onClickedForward: function () {
        this.nextStepTime = this.replay.jump(6);
    },

    onClickedBackward: function () {
        this.nextStepTime = this.replay.jump(-6);
    },

    update: function (dt) {
        if (this.playing && this.nextStepTime > 0) {
            this.nextStepTime -= dt;
            if (this.nextStepTime < 0) {
                this.nextStepTime = this.replay.next();
            }
        }
    },
});
