cc.Class({
    extends: cc.Component,

    properties: {
        inputNums: [cc.Label],

        _cursor: 0
    },

    // use this for initialization
    onLoad: function () {
        for (let i = 0; i < 10; i++) {
            let numbtn = cc.find('keyboard/num_' + i, this.node).getComponent(cc.Button);

            var clickEventHandler = new cc.Component.EventHandler();
            clickEventHandler.target = this.node; //这个 node 节点是你的事件处理代码组件所属的节点
            clickEventHandler.component = "JoinRoom";//这个是代码文件名
            clickEventHandler.handler = "onClickedNum";
            clickEventHandler.customEventData = i.toString();

            numbtn.clickEvents.push(clickEventHandler);
        }

    },

    onEnable: function () {
        this.onClickedDel(null, 0);//先清空一下
    },

    onClickedNum: function (event, customEventData) {
        if (this._cursor >= this.inputNums.length) {
            return;
        }

        this.inputNums[this._cursor++].string = customEventData;
        if (this._cursor == this.inputNums.length) {
            this.inputFinished();
        }

    },

    inputFinished: function () {
        let roomid = '';
        for (let i = 0; i < this.inputNums.length; i++) {
            roomid += this.inputNums[i].string;
        }

        this.c2sJoinRoom(parseInt(roomid));

        //todo: 向服务器请求
        // cc.mgr.userMgr.enterRoom(roomId,function(ret){
        //     if(ret.errcode == 0){
        //         this.node.active = false;
        //     }
        //     else{
        //         var content = "房间["+ roomId +"]不存在，请重新输入!";
        //         if(ret.errcode == 4){
        //             content = "房间["+ roomId + "]已满!";
        //         }
        //         cc.mgr.alert.show("提示",content);
        //         this.onResetClicked();
        //     }
        // }.bind(this)); 

    },

    onClickedDel: function (event, customEventData) {
        cc.log('Del---> ' + customEventData);

        // 回删一个
        if (customEventData == 1) {
            if (this._cursor > 0) {
                this.inputNums[--this._cursor].string = '';
            }
        }
        else {// 清空
            for (let i = 0; i < this.inputNums.length; i++) {
                this.inputNums[i].string = '';
            }
            this._cursor = 0;
        }
    },

    onClickedClose: function (event) {
        this.node.active = false;
    },

    c2sJoinRoom: function (roomid) {
        cc.mgr.net.send(NetId.C2S_JOIN_ROOM, { room_id: roomid });
    },
});
