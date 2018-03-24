
let statusText = ['反对解散', '同意解散', '申请解散'];
let statusColor = ['#3481A7', '#D76E28', '#5E4522'];

cc.Class({
    extends: cc.Component,

    properties: {
        btnAgree: cc.Node,
        btnOppose: cc.Node,
        btnOK: cc.Node,
        time: cc.Label,

        items: [cc.Node],

        _cursor: 0,
        _countdown: 0,

        gamelogic: null,
    },

    // use this for initialization
    onLoad: function () {
        this.swallowTouch = this.node.getComponent('SwallowTouch');
        this.items = cc.find('body/itemlist', this.node).children;
    },

    tick: function () {
        this._countdown--;
        this.time.string = this._countdown;
        if (this._countdown <= 0) {
            this.node.active = false;
        }
    },

    startVote: function (msg, gamelogic) {
        this.gamelogic = gamelogic;
        this.node.active = true;

        this.clear();

        this.setItem(this._cursor, msg.index, 2);

        this._countdown = msg.time;
        this.time.string = this._countdown;
        this.schedule(this.tick, 1, this._countdown);

        this.showBtns(msg.index != this.gamelogic.myIndex);
    },

    onVote: function (index, val, msg) {
        cc.log('!--onVote(%d)', index);
        this.setItem(this._cursor, index, val);

        if (msg.result && msg.result > 1) {
            this.onVoteResult();
        }
        else if (this._cursor == this.gamelogic.usermap.size) {
            this.onVoteResult();
        }
    },

    setItem: function (i, playerIndex, result) {
        let item = this.items[i];
        item.active = true;
        let avatar = item.getChildByName('avatar').getComponent(cc.Sprite);
        let host = item.getChildByName('host');
        let name = item.getChildByName('name').getComponent(cc.Label);
        let id = item.getChildByName('id').getComponent(cc.Label);
        let status = item.getChildByName('status').getComponent(cc.Label);

        let user = this.gamelogic.getUserInfo(playerIndex);
        name.string = user.name;
        id.string = 'ID:' + user.uid;
        cc.utils.setPortrit(avatar, user.head);
        status.string = statusText[result];

        let color = new cc.Color();
        status.node.color = color.fromHEX(statusColor[result]);

        this._cursor++;
    },

    // 重连恢复
    resume: function (data, gamelogic) {
        this.gamelogic = gamelogic;
        this.node.active = true;
        this.clear();

        this._countdown = data.time;
        this.time.string = this._countdown;
        this.schedule(this.tick, 1, this._countdown);
        this.showBtns(data.vote_index != this.gamelogic.myIndex);

        for (let i = 0; i < data.info.length; i++) {
            this.setItem(this._cursor, data.info[i].index, data.info[i].typ);
        }

    },

    clear: function () {
        this.items.forEach(function (e) {
            e.active = false;
        })

        this._cursor = 0;
        this.swallowTouch.touchClose = false;
    },

    onClickedOppose: function () {
        this.c2sVoteDismiss(0);
        this.showBtns(false);
    },

    onClickedAgree: function () {
        this.c2sVoteDismiss(1);
        this.showBtns(false);
    },

    showBtns: function (show) {
        this.btnAgree.active = show;
        this.btnOppose.active = show;
        this.btnOK.active = false;
    },

    onVoteResult: function () {
        this.btnOK.active = true;
        this.btnAgree.active = false;
        this.btnOppose.active = false;
        this.swallowTouch.touchClose = true;
    },

    onClickedClose: function () {
        this.node.destroy();
    },

    onDestroy: function () {
        this.unschedule(this.tick);
        cc.mgr.hallLogic.dismissLogic = null;
    },

    // 1同意，0不同意
    c2sVoteDismiss: function (val) {
        cc.mgr.net.send(NetId.C2S_APPLY_JIESAN_AGREE, { typ: val });
    },

});
