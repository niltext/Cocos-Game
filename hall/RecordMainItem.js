const gameName = new Map([['niuniu', '牛牛'], ['majiang', '麻将']
])
cc.Class({
    extends: cc.Component,

    properties: {
        players: [],
        scoreColor: [cc.Color],
        roomid: cc.Label,
        game: cc.Label,
        time: cc.Label,
        btnDetail: cc.Node,

    },

    // use this for initialization
    onLoad: function () {
        this.showDetail = false;

        for (let i = 0; i < 5; i++) {
            let _node = cc.find('player' + i, this.node);
            let _nick = _node.getChildByName('nick').getComponent(cc.Label);
            let _score = _node.getChildByName('score').getComponent(cc.Label);
            let _fangzhu = _node.getChildByName('fangzhu');
            this.players.push({ node: _node, nick: _nick, score: _score, fangzhu: _fangzhu });
            _node.active = false;
        }
    },

    /** record.content 结构参考
     { cur_ju = g_cur_ju, qipai_type = qipai_type, players = {},log_data_id=log_data_id}
     其中 players是个数组，结构为{index,score,name,uid}
     */

    init: function (record, listener) {
        this.listener = listener;

        this.record = record;
        this.roomid.string = ' 房间：' + record.room_id;
        this.time.string = cc.utils.getTimeString(record.create_time);
        record.content = JSON.parse(record.content);

        this.game.string = gameName.get(record.content.qipai_type);
        if (record.content.qipai_type == 'majiang') {
            this.game.string = MJName.get(record.content.mj_type);
        }


        this.showDetail = record.content.qipai_type == 'majiang';
        this.btnDetail.active = this.showDetail;
        let list = record.content.players;
        for (let i = 0; i < list.length; i++) {
            let player = this.players[i];
            player.node.active = true;
            player.fangzhu.active = list[i].index == 1;
            player.nick.string = list[i].name;
            player.score.string = list[i].score;
            player.score.node.color = list[i].score >= 0 ? this.scoreColor[1] : this.scoreColor[0];
        }
    },

    onClickedDetail: function () {
        let dataid = parseInt(this.record.content.log_data_id);
        if (this.listener) {
            this.listener.c2sPlayGameLog(dataid);
        }
    },

});
