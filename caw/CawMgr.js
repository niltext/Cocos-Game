module.exports = cc.Class({
    properties: {
        name:'CawMgr',
        //message RoomInfo
        _eventHandler: null, // 接收自定义event的节点,实为CawGame脚本的节点
        roomInfo: null,

        myIndex: 0,
        usermap: null,

        sprCache: null,

        view: null,
        result: null,
        xia_zhu_list: null,
    },

    ctor: function () {
        this.usermap = new Map();

        let self = this;
        let net = cc.mgr.net;

        net.on(NetId.S2C_READY, function (event) {
            let msg = event.detail.msg;

            let info = self.usermap.get(msg.index);
            if (typeof (info) != 'undefined') {
                info.score = msg.score;
            }
            if (self.view) {
                self.view.onReady(msg);
            }
        })

        net.on(NetId.S2C_NN_GAME_START, function (event) {
            let msg = event.detail.msg;
            self.roomInfo.cur_ju = msg.cur_ju;
            self.roomInfo.status = msg.status;

            self.usermap.forEach((user, key) => {
                cc.log('clear waiting')
                user.waitflag = null;
            })

            if (self.view) {
                self.view.onStarted(msg);
            }
        })

        net.on(NetId.S2C_NN_GAME_STATUS, function (event) {
            self.roomInfo.status = event.detail.msg.status;
            cc.log('!++:' + self.roomInfo.status);
        })

        //////////////
        net.on(NetId.S2C_NN_COOL_DOWN, (event) => {
            if (this.view) {
                this.view.onCountdown(event.detail.msg);
            }

        });

        // 玩家下注
        net.on(NetId.S2C_NN_XIA_ZHU, (event) => {
            cc.log('check--:',self === cc.mgr.caw)
            if (self.view) {
                self.view.onBet(event.detail.msg);
            }
            
        });

        // 发真牌
        net.on(NetId.S2C_NN_SEND_POKER, function (event) {
            if (self.view) {
                self.view.onSendPoker(event.detail.msg);
            }
        })

        net.on(NetId.S2C_NN_CALCU_NIU, function (event) {
            if (self.view) {
                self.view.onCalcuNiu(event.detail.msg);
            }

        })

        //\\\\\\\\\\\\\
        //小局结算
        net.on(NetId.S2C_NN_JIESUAN, function (event) {
            if (self.view) {
                self.view.onJiesuan(event.detail.msg);
            }

        })

        net.on(NetId.S2C_NN_ROOM_MATCH, (event) => {
            let msg = event.detail.msg;
            if (msg.code != ErrNo.OK) {
                cc.mgr.err.floatTip(msg.msg);
                cc.hideMask();
            }
        });

        net.on(NetId.S2C_NN_DING_ZHU, (event) => {
            let msg = event.detail.msg;
            if (msg.host_id > 0 && msg.host_id < 100) {
                if (this.view) {
                    this.view.onDingZhuang(msg.host_id);
                }
            }
        });

        net.on(NetId.S2C_NN_QIANG_HOST, (event) => {
            let msg = event.detail.msg;
            if (this.view) {
                this.view.onQiangZhuang(msg);
            }
        })
    },

    dispatchEvent: function (event, data) {
        if (this._eventHandler) {
            this._eventHandler.emit(event, data);
        }
    },

    getUserInfo: function (index) {
        return this.usermap.get(index);
    },

    onEnterRoom: function (roomInfo, selfInfo, othersInfo, isRejoin, vote) {
        this.roomInfo = roomInfo;

        this.usermap.clear();
        this.usermap.set(selfInfo.index, selfInfo);
        this.myIndex = selfInfo.index;

        for (let i = 0; i < othersInfo.length; i++) {
            this.usermap.set(othersInfo[i].index, othersInfo[i]);
        }

        if (isRejoin) {
            cc.director.loadScene('caw', () => {
                if (this.view) {
                    this.view.onRejoinRoom(vote);
                }
            });
        }
        else {
            cc.director.loadScene('caw', () => {
                if (this.view) {
                    this.view.onJoinRoom();
                }
            });
        }
    },

    /**
     *  重新加入还没结束的房间
     */
    rejoinRoom: function (msg) {
        this.qiang_list = msg.qiang_list;
        this.noqiang_list = msg.noqiang_list;
        this.result = msg.result_packet;
        this.xia_zhu_list = msg.xia_zhu_list;

        this.onEnterRoom(msg.roomInfo, msg.selfInfo, msg.othersInfo, true, msg.vote)
    },

    // onReady: function (msg) {
    //     let info = this.usermap.get(msg.index);
    //     if (typeof (info) != 'undefined') {
    //         info.score = msg.score;
    //     }
    //     if (this.view) {
    //         this.view.onReady(msg);
    //     }
    // },
    onJiesan: function (msg) {
        this.clear();
    },

    onLeaveRoom: function (msg) {
        this.deleteUser(msg.index);
        if (this.view) {
            this.view.onLeaveRoom(msg);
        }
    },

    onChat: function (proto) {
        if (this.view) {
            let seat = this.view.getSeatByIndex(proto.index);
            if (seat) {
                seat.setChat(proto.msg_type, proto.msg_value);
            }
        }
    },

    onNewPlayerJoinRoom: function (userinfo) {
        this.usermap.set(userinfo.index, userinfo);
        this.dispatchEvent('new_player', userinfo);
    },

    ready: function () {
        cc.mgr.net.send(NetId.C2S_READY, { niu: 0 });
    },

    start: function () {
        cc.mgr.net.send(NetId.C2S_NN_GAME_START);
    },

    bet: function (_score) {
        cc.log('下注:' + _score)
        cc.mgr.net.send(NetId.C2S_NN_XIA_ZHU, { score: _score });
    },

    autoCalc: function () {
        cc.mgr.net.send(NetId.C2S_NN_CALCU_NIU);
    },

    leaveRoom: function () {
        if (this.iamHost()) {
            cc.mgr.net.send(NetId.C2S_JIESAN);
        }
        else {
            cc.mgr.net.send(NetId.C2S_LEAVE_ROOM);
        }
    },

    dismiss: function () {
        cc.log('0321 NetId.C2S_APPLY_JIESAN')
        cc.mgr.net.send(NetId.C2S_APPLY_JIESAN);
    },

    // 1同意，0不同意
    voteDismiss: function (val) {
        cc.mgr.net.send(NetId.C2S_APPLY_JIESAN_AGREE, { typ: val });
    },

    myInfo: function () {
        return this.getUserInfo(this.myIndex);
    },

    iamHost: function () {
        return this.myIndex == this.roomInfo.host_id;
    },

    isHost: function (index) {
        return index == this.roomInfo.host_id;
    },

    isLastRound: function () {
        return this.roomInfo.cur_ju >= this.roomInfo.total_ju;
    },

    // 是不是金币场
    isGoldRoom: function () {
        return this.roomInfo.room_type != 0;
    },

    // 是否进入房间等待本局结束
    isWaiting: function (index) {
        let user = this.getUserInfo(index);
        if (user.waitflag == 'wait') {
            return true;
        }
        return false;
    },

    deleteUser: function (index) {
        this.usermap.delete(index);
    },

    clear: function () {
        this.roomInfo = null;

        this.myIndex = 0;
        this.usermap.clear();
        this.result = null;
        this.xia_zhu_list = null;
    },

    showPlayerDetail: function (index, avatar) {
        if (this.isGoldRoom()) {
            return;
        }

        let user = this.usermap.get(index);
        if (!user) {
            return;
        }

        cc.showPlayerDetail(user.name, user.uid, user.ip, avatar);
    },

    // 抢庄
    c2sBanker: function (val) {
        cc.mgr.net.send(NetId.C2S_NN_QIANG_HOST, { qiang: val });
    },

    isRoomOwner: function () {
        return this.myIndex == 1;
    },
});
