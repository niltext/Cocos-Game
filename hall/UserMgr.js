var UserMgr = cc.Class({

    properties: {

        //SyncUserData_s2c
        userinfo: null,
        joinAgainMsg: null,

    },

    ctor: function () {
        let self = this;
        cc.mgr.net.on(NetId.S2C_LOGIN, function (event) {
            var msg = event.detail.msg;
            if (msg.code == ErrNo.OK) {
                cc.nc.log('login-callback:' + msg.data.account + ',' + msg.data.password);

                cc.sys.localStorage.setItem("wx_openid", msg.data.account);
                cc.sys.localStorage.setItem("wx_psw", msg.data.password);

                cc.director.loadScene('hall', function () {
                    if (self.joinAgainMsg) {
                        cc.mgr.hallLogic.rejoinRoom(self.joinAgainMsg);
                        self.joinAgainMsg = null;
                    }
                    cc.mgr.hallLogic.onViewLoaded();
                });
            }
            else {
                cc.floatTip(msg.msg);
                cc.sys.localStorage.removeItem('wx_openid');
                cc.sys.localStorage.removeItem('wx_psw');
            }
        })

        cc.mgr.net.on(NetId.S2C_LOAD_USER_DATA, function (event) {
            var info = JSON.stringify(event.detail.msg);
            // cc.log('收到用户信息:'+info);

            self.userinfo = self.userinfo ? self.userinfo : {}
            for (var k in event.detail.msg) {
                let value = event.detail.msg[k];
                if (value != null && typeof (value) != 'function') {
                    //cc.log('更新信息   '+ k+ ':'+value);
                    self.userinfo[k] = value;
                }
            }
            cc.mgr.hallLogic.onUpdateUserInfo();
        }, )

        // cc.mgr.net.on(NetId.S2C_SYNC_USER_DATA, function (event) {
        //     self.userinfo = self.userinfo ? self.userinfo : {}
        //     var info = JSON.stringify(event.detail.msg);
        //     //cc.log('更新用户信息:'+info);
        //     for (var k in event.detail.msg) {
        //         let value = event.detail.msg[k];
        //         if (value != null && typeof (value) != 'function') {
        //             //cc.log('更新信息   '+ k+ ':'+value);
        //             self.userinfo[k] = value;
        //         }
        //     }
        //     cc.mgr.hallLogic.onUpdateUserInfo();
        // }, )

        // 重新加入还没结束的房间
        cc.mgr.net.on(NetId.S2C_NN_JOIN_ROOM_AGAIN, function (event) {
            let msg = event.detail.msg;
            msg.gametype = GameType.NiuNiu;
            if (msg.code == ErrNo.OK) {
                if (cc.mgr.hallLogic.hallView) {
                    cc.mgr.hallLogic.rejoinRoom(msg);
                }
                else {
                    self.joinAgainMsg = msg;
                }

            }
        })

        // 别人加入房间,同步信息
        cc.mgr.net.on(NetId.S2C_NN_TABLE_USER_INFO, function (event) {
            let msg = event.detail.msg;
            //cc.log('新玩家加入'+msg.name)
            cc.mgr.hallLogic.s2cNewPlayerJoinRoom(msg);
        })


        // 重新加入还没结束的房间
        cc.mgr.net.on(NetId.S2C_MJ_JOIN_ROOM_AGAIN, function (event) {
            let msg = event.detail.msg;
            msg.gametype = GameType.Mahjong;
            if (msg.code == ErrNo.OK) {
                if (cc.mgr.hallLogic.hallView) {
                    cc.mgr.hallLogic.rejoinRoom(msg);
                }
                else {
                    self.joinAgainMsg = msg;
                }

            }
        })

        // 别人加入房间,同步信息
        cc.mgr.net.on(NetId.S2C_MJ_TABLE_USER_INFO, function (event) {
            let msg = event.detail.msg;
            //cc.log('新玩家加入'+msg.name)
            cc.mgr.hallLogic.s2cNewPlayerJoinRoom(msg);
        })

        // 重新加入还没结束的房间
        cc.mgr.net.on(NetId.S2C_SSS_JOIN_ROOM_AGAIN, function (event) {
            let msg = event.detail.msg;
            msg.gametype = GameType.SSS;
            if (msg.code == ErrNo.OK) {
                if (cc.mgr.hallLogic.hallView) {
                    cc.mgr.hallLogic.rejoinRoom(msg);
                }
                else {
                    self.joinAgainMsg = msg;
                }

            }
        })

        // 别人加入房间,同步信息
        cc.mgr.net.on(NetId.S2C_SSS_TABLE_USER_INFO, function (event) {
            let msg = event.detail.msg;
            cc.log('新玩家加入'+msg.name)
            cc.mgr.hallLogic.s2cNewPlayerJoinRoom(msg);
        })
    },


    // guestAuth:function(){
    //     var account = cc.args["account"];
    //     if(account == null){
    //         account = cc.sys.localStorage.getItem("account");
    //     }

    //     if(account == null){
    //         account = Date.now();
    //         cc.sys.localStorage.setItem("account",account);
    //     }

    //     cc.vv.http.sendRequest("/guest",{account:account},this.onAuth);
    // },

    // onAuth:function(ret){
    //     var self = cc.vv.userMgr;
    //     if(ret.errcode !== 0){
    //         console.log(ret.errmsg);
    //     }
    //     else{
    //         self.account = ret.account;
    //         self.sign = ret.sign;
    //         cc.vv.http.url = "http://" + cc.vv.SI.hall;
    //         self.login();
    //     }   
    // },

    login: function (param) {
        cc.mgr.net.send(NetId.C2S_LOGIN, param);
        cc.nc.log('cc.mgr.net.send(NetId.C2S_LOGIN,param)');
    },

    onLogin: function () {

    },


    // enterRoom:function(roomId,callback){
    //     var self = this;
    //     var onEnter = function(ret){
    //         if(ret.errcode !== 0){
    //             if(ret.errcode == -1){
    //                 setTimeout(function(){
    //                     self.enterRoom(roomId,callback);
    //                 },5000);
    //             }
    //             else{
    //                 cc.vv.wc.hide();
    //                 if(callback != null){
    //                     callback(ret);
    //                 }
    //             }
    //         }
    //         else{
    //             if(callback != null){
    //                 callback(ret);
    //             }
    //             cc.vv.gameNetMgr.connectGameServer(ret);
    //         }
    //     };

    //     var data = {
    //         account:cc.vv.userMgr.account,
    //         sign:cc.vv.userMgr.sign,
    //         roomid:roomId
    //     };
    //     cc.vv.wc.show("正在进入房间 " + roomId);
    //     cc.vv.http.sendRequest("/enter_private_room",data,onEnter);
    // },
    // getHistoryList:function(callback){
    //     var self = this;
    //     var onGet = function(ret){
    //         if(ret.errcode !== 0){
    //             console.log(ret.errmsg);
    //         }
    //         else{
    //             console.log(ret.history);
    //             if(callback != null){
    //                 callback(ret.history);
    //             }
    //         }
    //     };

    //     var data = {
    //         account:cc.vv.userMgr.account,
    //         sign:cc.vv.userMgr.sign,
    //     };
    //     cc.vv.http.sendRequest("/get_history_list",data,onGet);
    // },
    // getGamesOfRoom:function(uuid,callback){
    //     var self = this;
    //     var onGet = function(ret){
    //         if(ret.errcode !== 0){
    //             console.log(ret.errmsg);
    //         }
    //         else{
    //             console.log(ret.data);
    //             callback(ret.data);
    //         }
    //     };

    //     var data = {
    //         account:cc.vv.userMgr.account,
    //         sign:cc.vv.userMgr.sign,
    //         uuid:uuid,
    //     };
    //     cc.vv.http.sendRequest("/get_games_of_room",data,onGet);
    // },

    // getDetailOfGame:function(uuid,index,callback){
    //     var self = this;
    //     var onGet = function(ret){
    //         if(ret.errcode !== 0){
    //             console.log(ret.errmsg);
    //         }
    //         else{
    //             console.log(ret.data);
    //             callback(ret.data);
    //         }       
    //     };

    //     var data = {
    //         account:cc.vv.userMgr.account,
    //         sign:cc.vv.userMgr.sign,
    //         uuid:uuid,
    //         index:index,
    //     };
    //     cc.vv.http.sendRequest("/get_detail_of_game",data,onGet);
    // }
});

module.exports = UserMgr;