let MahjongLogic = require('MahjongLogic');
let CawMgr = require('CawMgr');
let SssMgr = require('SssMgr');

module.exports = cc.Class({

    properties: {
        hallView: null,

        relife: 0,
        dailyGift: 0,
        hasShowInviationCode: false,
        gameLogic: null,

        dismissLogic: null,
    },

    ctor: function () {
        this.initNetEvent();
    },

    initNetEvent: function () {
        let self = this;
        let net = cc.mgr.net;

        //日常领取，每次登录服务器会推送或者前端发起领取之后会再次推送更新
        net.on(NetId.S2C_DAILY, (event) => {
            let msg = event.detail.msg;
            cc.log(JSON.stringify(msg))
            this.s2cDaily(msg);
        });

        // 服务器主动弹确认窗口
        net.on(NetId.S2C_SERVER_ASK, (event) => {
            let msg = event.detail.msg;
            let needCancel = (msg.opt.join().indexOf('2') != -1);
            cc.alert(msg.msg, () => {
                cc.mgr.net.send(NetId.C2S_SERVER_ASK, { id: msg.id, opt: 1, opt_id: msg.opt_id });
            }, needCancel, () => {
                cc.mgr.net.send(NetId.C2S_SERVER_ASK, { id: msg.id, opt: 2, opt_id: msg.opt_id });
            });
        });

        // 房间创建成功
        net.on(NetId.S2C_NN_CREATE_ROOM, (function (event) {
            let msg = event.detail.msg;
            // cc.log(JSON.stringify(event.detail.msg));
            if (msg.code == ErrNo.OK) {
                if (!cc.mgr.caw) {
                    cc.mgr.caw = new CawMgr();
                }
                self.gameLogic = cc.mgr.caw;
                cc.mgr.caw.onEnterRoom(msg.roomInfo, msg.selfInfo, msg.othersInfo);
            }
            else if (msg.code == ErrNo.CREATE_ROOM) {
                cc.mgr.err.floatTip(msg.msg);
            }

        }).bind(this));

        net.on(NetId.S2C_NN_JOIN_ROOM, (function (event) {
            let msg = event.detail.msg;
            cc.info(JSON.stringify(event.detail.msg));
            if (msg.code == ErrNo.OK) {
                if (!cc.mgr.caw) {
                    cc.mgr.caw = new CawMgr();
                }
                self.gameLogic = cc.mgr.caw;
                cc.mgr.caw.onEnterRoom(msg.roomInfo, msg.selfInfo, msg.othersInfo);
            }
            else {
                cc.mgr.err.floatTip(msg.msg);
            }
        }).bind(this));

        // 房间创建成功
        net.on(NetId.S2C_MJ_CREATE_ROOM, (function (event) {
            let msg = event.detail.msg;
            // cc.log(JSON.stringify(event.detail.msg));
            if (msg.code == ErrNo.OK) {
                if (!cc.mgr.mj) {
                    cc.mgr.mj = new MahjongLogic;
                }
                self.gameLogic = cc.mgr.mj;
                cc.mgr.mj.onEnterRoom(msg);
            }
            else if (msg.code == ErrNo.CREATE_ROOM) {
                cc.mgr.err.floatTip(msg.msg);
            }

        }).bind(this));

        // 玩家加入
        net.on(NetId.S2C_MJ_JOIN_ROOM, (function (event) {
            let msg = event.detail.msg;
            cc.info(JSON.stringify(event.detail.msg));
            if (msg.code == ErrNo.OK) {
                if (!cc.mgr.mj) {
                    cc.mgr.mj = new MahjongLogic;
                }
                self.gameLogic = cc.mgr.mj;
                cc.mgr.mj.onEnterRoom(msg);
            }
            else {
                cc.mgr.err.floatTip(msg.msg);
            }
        }).bind(this));

        // 房间创建成功
        net.on(NetId.S2C_SSS_CREATE_ROOM, (function (event) {
            let msg = event.detail.msg;
            // cc.log(JSON.stringify(event.detail.msg));
            if (msg.code == ErrNo.OK) {
                if (!cc.mgr.sss) {
                    cc.mgr.sss = new SssMgr();
                }
                self.gameLogic = cc.mgr.sss;
                cc.mgr.sss.onEnterRoom(msg.roomInfo, msg.selfInfo, msg.othersInfo);
            }
            else if (msg.code == ErrNo.CREATE_ROOM) {
                cc.mgr.err.floatTip(msg.msg);
            }

        }).bind(this));

        // 玩家加入
        net.on(NetId.S2C_SSS_JOIN_ROOM, (function (event) {
            let msg = event.detail.msg;
            cc.info(JSON.stringify(event.detail.msg));
            if (msg.code == ErrNo.OK) {
                if (!cc.mgr.sss) {
                    cc.mgr.sss = new SssMgr();
                }
                self.gameLogic = cc.mgr.sss;
                cc.mgr.sss.onEnterRoom(msg.roomInfo, msg.selfInfo, msg.othersInfo);
            }
            else {
                cc.mgr.err.floatTip(msg.msg);
            }
        }).bind(this));

        // 玩家聊天
        net.on(NetId.S2C_ROOM_CHAT, (function (event) {
            if (this.gameLogic) {
                this.gameLogic.onChat(event.detail.msg);
            }

        }).bind(this));

        // 玩家发起投票
        net.on(NetId.S2C_APPLY_JIESAN, (function (event) {
            let msg = event.detail.msg;
            let self = this;
            cc.loader.loadRes('prefab/ui/dismissPanel', function (err, prefab) {
                let node = cc.instantiate(prefab);
                let uiroot = cc.find('Canvas/UI');
                node.parent = uiroot;
                self.dismissLogic = node.getComponent('DismissPanel');
                self.dismissLogic.startVote(msg, self.gameLogic);
            }, )
        }).bind(this));

        // 玩家投票
        net.on(NetId.S2C_APPLY_JIESAN_AGREE, (function (event) {
            let msg = event.detail.msg;
            if (this.dismissLogic) {
                this.dismissLogic.onVote(msg.index, msg.typ, msg);
            }
        }).bind(this));

        // 房主游戏开始前离开,即解散房间
        net.on(NetId.S2C_JIESAN, (function (event) {
            if (this.gameLogic) {
                this.gameLogic.onJiesan(event.detail.msg);
            }
            cc.director.loadScene('hall', function () {
                cc.floatTip('房主已解散房间');
            });

        }).bind(this));

        // 玩家离线
        net.on(NetId.S2C_OUT_LINE, function (event) {
            if (self.gameLogic && self.gameLogic.view) {
                self.gameLogic.view.onOffline(event.detail.msg.index, true);
            }
        })

        // 玩家上线
        net.on(NetId.S2C_IN_LINE, function (event) {
            if (self.gameLogic && self.gameLogic.view) {
                self.gameLogic.view.onOffline(event.detail.msg.index, false);
            }
        })

        net.on(NetId.S2C_LEAVE_ROOM, function (event) {
            cc.log('exit:gameLogic  ', self.gameLogic.name)
            if (self.gameLogic) {
                self.gameLogic.onLeaveRoom(event.detail.msg);
            }
            else {
                cc.log('HallLogic.204')
            }
        })

        net.on(NetId.S2C_ROUND_GAME_LOG, function (event) {
            if (self.hallView) {
                self.hallView.replayGameLog(event.detail.msg);
            }
        })

    },

    c2sGetRelief: function () {
        cc.mgr.net.send(NetId.C2S_DAILY, { version: '1.0.0', dailyType: 2 });
    },

    c2sGetSignGift: function () {
        cc.mgr.net.send(NetId.C2S_DAILY, { version: '1.0.0', dailyType: 1 });
    },

    c2sCreateRoom: function (netid, cfg) {
        cc.info('111' + JSON.stringify(cfg));
        cc.mgr.net.send(netid, cfg);
    },

    //---------------------------------------------

    s2cDaily: function (msg) {
        this.dailyGift = msg.daily;
        this.relief = msg.relief;

        if (msg.flag == 1) { // 领取的返回
            if (msg.code == ErrNo.OK) {
                cc.mgr.err.floatTip('领取成功');
            }
            else {
                cc.mgr.err.floatTip(msg.msg);
            }

            if (this.dailyGift > 0) {
                this.hallView.giftAlert.open(1, this.dailyGift);
            }
        }
        else if (msg.flag == 0) {
            this.onDailyMsg();
        }
    },


    onUpdateUserInfo: function () {
        if (cc.director.getScene().name != 'hall') {
            return;
        }
        if (this.hudView) {
            this.hudView.updateInfo();
        }

        if (this.topbarView) {
            this.topbarView.updateInfo();
        }

        this.checkInviteCode();
    },

    checkInviteCode: function (inShop) {
        if (inShop) {// 在商店里
            if (!cc.utils.reviewing && this.hallView) {
                if (cc.mgr.userMgr.userinfo && cc.mgr.userMgr.userinfo.invite_id <= 0) {
                    this.hallView.showInviationCodePanel();
                    return true;
                }
            }
        }
        else {
            if (!cc.utils.reviewing && !this.hasShowInviationCode && this.hallView) {
                if (cc.mgr.userMgr.userinfo && cc.mgr.userMgr.userinfo.invite_id <= 0) {
                    this.hallView.showInviationCodePanel();
                    this.hasShowInviationCode = true;
                    return true;
                }
            }
        }
        return false;
    },

    onDailyMsg: function () {
        if (cc.director.getScene().name != 'hall') {
            return;
        }
        this.hallView.updateDailyMsg();
    },

    openGiftAlert: function () {
        if (this.hallView) {
            this.hallView.giftAlert.open(2, cc.mgr.hallLogic.relief);
        }
    },

    rejoinRoom: function (msg) {
        switch (msg.gametype) {
            case GameType.NiuNiu:
                if (!cc.mgr.caw) {
                    let CawMgr = require('CawMgr');
                    cc.mgr.caw = new CawMgr();
                }
                this.gameLogic = cc.mgr.caw;
                break;
            case GameType.Mahjong:
                if (!cc.mgr.mj) {
                    let MahjongLogic = require('MahjongLogic');
                    cc.mgr.mj = new MahjongLogic();
                }
                this.gameLogic = cc.mgr.mj;
                break;
            case GameType.SSS:
                if (!cc.mgr.sss) {
                    let SssMgr = require('SssMgr');
                    cc.mgr.sss = new SssMgr();
                }
                this.gameLogic = cc.mgr.sss;
                break;
        }

        this.gameLogic.rejoinRoom(msg);
    },

    // 开始匹配金币场
    c2sMatch: function (type) {
        cc.mgr.net.send(NetId.C2S_NN_ROOM_MATCH, { room_type: type });
    },

    c2sRequestNotice: function () {
        cc.mgr.net.send(NetId.C2S_BROAD_CLIENT);
    },

    s2cNewPlayerJoinRoom: function (user) {
        if (this.gameLogic) {
            this.gameLogic.onNewPlayerJoinRoom(user);
        }
    },

    onViewLoaded: function () {
        this.checkInviteCode();
        this.c2sRequestNotice();
    },

});
