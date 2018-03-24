cc.Class({
    extends: cc.Component,

    properties: {
        index: cc.Label,
        time: cc.Label,
        btnReplay: cc.Node,
        bg: cc.Node,
    },

    // use this for initialization
    onLoad: function () {
        this.players = [];
        for (let i = 0; i < 4; i++) {
            let _node = cc.find('player' + i, this.node);
            let _score = _node.getChildByName('score').getComponent(cc.Label);
            let _zhuang = _node.getChildByName('zhuang');
            this.players.push({ node: _node, score: _score, zhuang: _zhuang });
            _node.active = false;
        }
    },

    init: function (roundlog, index, listener) {
        this.listener = listener;
        this.roundid = index;

        this.index.string = index + 1;
        this.time.string = cc.utils.getTimeString(roundlog.create_time);
        for (let i = 0; i < roundlog.round_simple_logs.length; i++) {
            this.players[i].node.active = true;
            this.players[i].score.string = roundlog.round_simple_logs[i].score;
            this.players[i].zhuang.active = roundlog.round_simple_logs[i].isHost == 1;
        }

        this.bg.active = this.roundid % 2 == 1
    },

    onClickedReplay: function () {
        if (this.listener) {
            this.listener.c2sReplay(this.roundid);
        }
    },
});
