cc.Class({
    extends: cc.Component,

    properties: {
        textPanel: cc.Node,
        emojiPanel: cc.Node,
        input: cc.EditBox,

        _curMode: 0,//0 表情，1 文字
    },

    // use this for initialization
    onLoad: function () {

        this.setMode(0)

    },

    onClickedToggle: function (sender, customEventData) {
        this.setMode(parseInt(customEventData));

    },

    setMode: function (mode) {
        this._curMode = mode;

        this.emojiPanel.active = this._curMode === 0;
        this.textPanel.active = this._curMode === 1;
    },

    sendEmoji: function (event, customEventData) {
        cc.log('发送emoji:' + customEventData);
        cc.mgr.net.send(NetId.C2S_ROOM_CHAT, { msg_type: 2, msg_value: customEventData });
        this.node.active = false;
    },

    sendText: function (event, customEventData) {
        let idx = parseInt(customEventData);
        cc.log('发送文字:' + idx);
        cc.mgr.net.send(NetId.C2S_ROOM_CHAT, { msg_type: 1, msg_value: customEventData });
        this.node.active = false;
    },

    onClickedSend: function () {
        let text = this.input.string;
        if (text.length > 0) {
            cc.mgr.net.send(NetId.C2S_ROOM_CHAT, { msg_type: 3, msg_value: text });
            this.input.string = '';
        }
        this.node.active = false;
    },
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },


});
