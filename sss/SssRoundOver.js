cc.Class({
    extends: cc.Component,

    properties: {

        items: [cc.Node],
        lose: cc.Node,
        win: cc.Node,

        _msg: null,
        isWin: true,
    },

    // use this for initialization
    onLoad: function () {
        this.winColor = new cc.Color(255, 238, 121);
        this.loseColor = new cc.Color(97, 200, 250);

        this.node.getComponent('SwallowTouch').callback = this.onClickedOK.bind(this);

    },


    calcResult:function(msg){
        let ret = new Array(10);
        for (var i = 0;i < msg.results.length;i++){
            let data = msg.results[i];
            let tmp = new Array(20);
            ret[data.index] = tmp;
            for(var j = 0;j < 20;j++){
                tmp[j] = 0;
            }

            for(var j = 0;j < data.stat.length;j++){
                tmp[j] = data.stat[j];
            }
        }      

        return ret;
    },

    onJiesuan: function (msg) {
        this.node.active = true;
        this.lose.active = false;

        // 显示msg
        this.setInfo(msg.players, msg.host_id);

        if (msg.results.length > 0) {
            this._msg = msg;
            this._calcResult = this.calcResult(msg)
        }
        else {
            this._msg = null;
        }

        if (this.isWin) {
            this.lose.active = false;
            this.win.active = true;

            cc.mgr.audioMgr.playSFX('gameWin.mp3');
        }
        else {
            this.lose.active = true;
            this.win.active = false;
            cc.mgr.audioMgr.playSFX('gameLose.mp3');
        }
    },

    // data是服务器发来的单局结算
    setInfo: function (data, hostid) {
        for (let i = 0; i < this.items.length; i++) {
            this.items[i].active = false;
        }

        for (let i = 0; i < data.length && i < this.items.length; i++) {
            var item = this.items[i];
            item.active = true;
            item.getChildByName('banker').active = data[i].index == hostid;
            let info = cc.mgr.sss.getUserInfo(data[i].index);
            item.getChildByName('name').getComponent(cc.Label).string = info.name;
            let scoreLb = item.getChildByName('score');
            scoreLb.color = data[i].score >= 0 ? this.winColor : this.loseColor;
            scoreLb.getComponent(cc.Label).string = data[i].score;

            if (data[i].index == cc.mgr.sss.myIndex) {
                this.isWin = data[i].score >= 0;
            }
        }
    },

    onClickedOK: function () {
        if (cc.mgr.sss.isLastRound() || this._msg) {
            let bill = cc.find('Canvas/UI/bill').getComponent('SssBill');
            bill.onJiesuan(this._msg,this._calcResult);
        }
        else {
            cc.mgr.sss.ready();
        }

        this.node.active = false;
        this._msg = null;
    },


});
