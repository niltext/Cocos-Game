
// 创建游戏房间的消息号
const createNetId = [
    NetId.C2S_NN_CREATE_ROOM,
    NetId.C2S_MJ_CREATE_ROOM,
	NetId.C2S_SSS_CREATE_ROOM,
    NetId.C2S_MJ_CREATE_ROOM,
    NetId.C2S_MJ_CREATE_ROOM,
    NetId.C2S_MJ_CREATE_ROOM,
];


cc.Class({
    extends: cc.Component,

    properties: {
        _currentGame: 0,
    },

    // use this for initialization
    onLoad: function () {
        this.pages = [];
        for (let i = 0; i < createNetId.length; i++) {
            let pagenode = cc.find('ConfigPages/page_'+i,this.node);
            this.pages.push(pagenode);
        }

        this.S2C_GAME_ROOM_SERVER = (function (event) {
            let msg = event.detail.msg;
            cc.log('roomid =====>' + msg.room_id)
            cc.log('service name=====>' + msg.service_name);

            let page = this.pages[this._currentGame];
            let pageLogic = page.getComponent('RoomConfig_' + this._currentGame);
            let cfg = pageLogic.getConfig(msg.room_id);

            cc.mgr.hallLogic.c2sCreateRoom(createNetId[this._currentGame], cfg);
        }).bind(this)

        cc.mgr.net.on(NetId.S2C_GAME_ROOM_SERVER, this.S2C_GAME_ROOM_SERVER)

        this.switchGame(0);
    },

    start: function () {

    },

    onClickedCreate: function () {
        cc.mgr.net.send(NetId.C2S_GAME_ROOM_SERVER, { room_id: 0, ios_checking: 0 });
    },


    onClickedToggleGame: function (sender, customEventData) {
        this.switchGame(parseInt(customEventData));
    },

    switchGame: function (gameindex) {
        this._currentGame = gameindex;

        for (let i = 0; i < this.pages.length; i++) {
            this.pages[i].active = (i == this._currentGame);
        }
    },

    onClickedClose: function () {
        this.node.active = false;
    },

    onDestroy: function () {
        cc.mgr.net.off(NetId.S2C_GAME_ROOM_SERVER, this.S2C_GAME_ROOM_SERVER)
    },
});
