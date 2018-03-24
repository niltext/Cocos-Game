let Seat = require('Seat');
let RoomInfo = require('RoomInfo');
let Countdown = require('Countdown');
let SpritesCache = require('SpritesCache');
let RoundOver = require('RoundOver');
let BeanPool = require('BeanPool');

const MaxSeats = 5;

cc.Class({
    extends: cc.Component,

    properties: {
        seats: [Seat],
        roomInfo: RoomInfo,
        roundOver: RoundOver,
        dropdownMenu: cc.Node,

        innerSetting: cc.Node,
        chatPanel: cc.Node,

        countdown: Countdown,
        bet: cc.Node,
        bet1: cc.Node, // 金币场下注专用
        banker: cc.Node,
        btnStart: cc.Node,
        btnAutoCalc: cc.Node,
        btnInvite: cc.Node,

        btnFold: cc.Node,
        startAnim: cc.Node,

        pokerPrefab: cc.Prefab,

        desktop: cc.Node,


        _myPokers: [cc.Node],

        sprCache: SpritesCache,

        beanPool: BeanPool,

    },

    // use this for initialization
    onLoad: function () {
        cc.view.setResolutionPolicy(cc.ResolutionPolicy.EXACT_FIT);
        cc.mgr.caw.view = this;
        cc.mgr.audioMgr.pauseBGM();
        //cc.nc.log('+'+typeof(this.sprCache))
        cc.mgr.caw.sprCache = this.sprCache;
        //-------------
        this.pokerPool = new cc.NodePool('Poker');
        // 先创建50张牌放入对象池
        for (let i = 0; i < 50; i++) {
            let poker = cc.instantiate(this.pokerPrefab);
            this.pokerPool.put(poker);
        }

        for (let i = 0; i < this.seats.length; i++) {
            this.seats[i].init(this.desktop, this.pokerPool);
            this.seats[i].hide();
        }

        this.btnAutoCalc.active = false;
        this.btnInvite.active = false;

        this.roomInfo.setRoomInfo(cc.mgr.caw.roomInfo);

        this.initEventHandlers();
    },

    onJoinRoom: function () {
        // 自动准备
        cc.mgr.caw.ready();

        cc.log('size ' + cc.mgr.caw.usermap.size)
        cc.log('~~' + JSON.stringify(cc.mgr.caw.usermap))

        if (cc.mgr.caw.isGoldRoom()) {
            this.btnStart.active = false;
            this.roomInfo.node.active = false;
            // 恢复金币场中别人的残局
            this.onRejoinRoom();
        }
        else {
            cc.mgr.caw.usermap.forEach((user, key) => {
                let seatid = this.calcSeatIdFromIndex(user.index);
                this.seats[seatid].setInfo(user);
            })

            this.btnInvite.active = true;
            if (cc.mgr.caw.roomInfo.status == 0) {
                this.btnStart.active = cc.mgr.caw.isRoomOwner();
            }
        }
    },

    // 重新加入还没结束的房间，要恢复现场
    onRejoinRoom: function (vote) {
        cc.log('重新加入房间')
        // 恢复现场

        let roominfo = cc.mgr.caw.roomInfo;
        let status = parseInt(roominfo.status);

        cc.mgr.caw.usermap.forEach((user, key) => {
            cc.log('!- index-->' + user.index)
            let seatid = this.calcSeatIdFromIndex(user.index);
            this.seats[seatid].setInfo(user);
            this.seats[seatid].onRejoin(status);
        })

        //let myseat = this.getSeatByIndex(cc.mgr.caw.myIndex);
        let me = cc.mgr.caw.myInfo();
        cc.log('status:' + status);
        switch (status) {
            case 0: //等待开始
                // 自动准备
                cc.mgr.caw.ready();
                if (cc.mgr.caw.isGoldRoom()) {// 金币场
                    this.btnStart.active = false;
                }
                else {
                    this.btnStart.active = cc.mgr.caw.myIndex == 1;
                    this.btnInvite.active = true;
                }
                break;
            case 99://等待准备
                if (me.ready == 0) {
                    cc.mgr.caw.ready();
                }
                break;
            case 100://开始游戏
                this.btnStart.active = false;
                break;
            case 101://抢庄状态
                if (cc.mgr.caw.isGoldRoom() && cc.mgr.caw.isWaiting(cc.mgr.caw.myIndex)) {
                    break;
                }
                this.banker.active = true;

                break;
            case 102://下注状态
                this.banker.active = false;
                if (cc.mgr.caw.isGoldRoom() && cc.mgr.caw.isWaiting(cc.mgr.caw.myIndex)) {
                    break;
                }
                if (!cc.mgr.caw.iamHost() && !me.has_xia_zhu) {
                    if (cc.mgr.caw.isGoldRoom()) {
                        this.bet1.active = true;
                        if (cc.mgr.caw.xia_zhu_list) {
                            let goldRoomBet = this.bet1.getComponent('GoldRoomBet');
                            goldRoomBet.initBets(cc.mgr.caw.xia_zhu_list);
                        }
                    }
                    else {
                        this.bet.active = true;
                    }
                }
                break;
            case 103://算牛状态
                if (cc.mgr.caw.isGoldRoom() && cc.mgr.caw.isWaiting(cc.mgr.caw.myIndex)) {
                    break;
                }
                if (!me.has_calcu) {
                    this.btnAutoCalc.active = true;
                }
                break;
            case 104://结算状态
                if (cc.mgr.caw.result) {
                    this.roundOver.onJiesuan(cc.mgr.caw.result);
                }
                else {
                    cc.mgr.caw.ready();
                }
                break;
            case 105://关闭房间
                break;
            default:
                break;
        }

        //
        if (roominfo.status > 0 && roominfo.status < 105) {
            let usermap = cc.mgr.caw.usermap;
            usermap.forEach((user, key) => {
                // cc.log('恢复牌型：' + user.index)
                // cc.log('cards:' + JSON.stringify(user.cards))
                if (!cc.mgr.caw.isWaiting(user.index)) {
                    let seat = this.getSeatByIndex(user.index)
                    seat.dealImmediately(user.cards);
                }

            })
        }

        // 投票解散
        if (vote) {
            cc.loader.loadRes('prefab/ui/dismissPanel', function (err, prefab) {
                let node = cc.instantiate(prefab);
                let uiroot = cc.find('Canvas/UI');
                node.parent = uiroot;
                cc.mgr.hallLogic.dismissLogic = node.getComponent('DismissPanel');
                cc.mgr.hallLogic.dismissLogic.resume(vote, cc.mgr.hallLogic.gameLogic);
            }, )
        }
    },


    initEventHandlers: function () {
        cc.mgr.caw._eventHandler = this.node;

        let self = this;
        this.node.on('new_player', function (event) {
            let userinfo = event.detail;
            let seatid = this.calcSeatIdFromIndex(userinfo.index);
            this.seats[seatid].setInfo(userinfo);
        }, this)
    },

    onStarted: function (msg) {
        cc.log('---started')
        let mycards = msg.cards;

        this.bet.active = false;
        this.bet1.active = false;
        this.startAnim.active = true;

        let room = cc.mgr.caw.roomInfo;
        this.roomInfo.setRoomInfo(room);
        for (let i = 0; i < this.seats.length; i++) {
            this.seats[i].onStarted();
        }

        cc.log('!! 开始：' + room.status);

        this.btnInvite.active = false;
        switch (room.host_type) {
            case 1://房主庄
                let seat = this.getSeatByIndex(room.host_id);
                if (seat) {
                    seat.setBanker(true, true);
                }
                break;
            case 3:// 轮庄
                break;
            case 4: // 先发4张抢庄
                break;
            default:
                break;
        }
        this.deal4(1, mycards);

        cc.mgr.audioMgr.playSFX('gamestar.mp3');
    },

    // 自己先发4张真牌、1张背面牌，别人发5张背面
    deal4: function (_delay, mycards) {
        let delay = _delay;

        cc.log('发牌：' + mycards.toString())
        cc.log('状态:' + cc.mgr.caw.isWaiting(cc.mgr.caw.myIndex))
        // 先给自己发4张真牌1张0（背面）
        if (mycards.length > 0 && !cc.mgr.caw.isWaiting(cc.mgr.caw.myIndex)) {
            let myseat = this.getSeatByIndex(cc.mgr.caw.myIndex);
            cc.delayedCall(this.node, delay, function () {
                myseat.deal(mycards);
            })

            cc.delayedCall(this.node, delay + 0.2, function () {
                myseat.setCards(mycards.slice(0, 4));
            })
        }
        // 再给别人发四张假牌
        let self = this;
        let count = 0;
        for (let i = 0; i < this.seats.length; i++) {
            let seat = this.seats[i];
            if (seat._index > 0 && seat._index != cc.mgr.caw.myIndex && !cc.mgr.caw.isWaiting(seat._index)) {
                delay += 0.2 * count;
                cc.delayedCall(this.node, delay, function () {
                    self.seats[i].deal([0, 0, 0, 0, 0]);
                })
                count++;
            }
        };

        return delay;
    },
    //------------网络部分转发事件

    onQiangZhuang: function (msg) {
        let seat = this.getSeatByIndex(msg.index);
        seat.setQiang(msg.qiang, true);
    },

    onReady: function (msg) {
        let seat = this.getSeatByIndex(msg.index);
        seat.setReady(true, msg.score);
    },

    onCountdown: function (msg) {
        switch (msg.typ) {
            case 1://抢庄
                this.countdown.begin(msg.time * 1000);
                this.banker.active = true;
                break;
            case 2://下注
                this.banker.active = false;
                this.countdown.begin(msg.time * 1000);
                if (!cc.mgr.caw.iamHost()) {
                    if (cc.mgr.caw.isGoldRoom()) {
                        this.bet1.active = true;
                        let goldRoomBet = this.bet1.getComponent('GoldRoomBet');
                        if (goldRoomBet) {
                            goldRoomBet.initBets(msg.xiazhu);
                        }
                    }
                    else {
                        this.bet.active = true;
                    }
                }
                break;
            case 3://算牛
                this.bet.active = false;
                this.bet1.active = false;

                this.btnAutoCalc.active = true;
                this.countdown.begin(msg.time * 1000);
                break;
            case 4:
                this.countdown.begin(msg.time * 1000);
                break;
            default:
                break;
        }
    },


    onBet: function (msg) {
        let seat = this.getSeatByIndex(msg.index);
        if (seat) {
            seat.setBet(msg.score);
        }
        if (msg.index == cc.mgr.caw.myIndex) {
            this.bet.active = false;
        }
    },

    onSendPoker: function (msg) {
        let seat = this.getSeatByIndex(msg.index)

        // 如果是先4张抢庄模式，且是自己的牌，则只需要再翻最后一张牌
        if (cc.mgr.caw.roomInfo.host_type == 4 && cc.mgr.caw.myIndex == msg.index) {
            seat.setCard(4, msg.cards[4]);
        }
        else {
            seat.setCards(msg.cards);
        }
    },

    onCalcuNiu: function (msg) {
        let seat = this.getSeatByIndex(msg.index);
        seat.onCalc(msg.niu, msg.cards);

        if (msg.index == cc.mgr.caw.myIndex) {
            this.btnAutoCalc.active = false;
        }
    },

    onJiesuan: function (msg) {
        this.countdown.end();
        // 小局结算

        let list = msg.players;
        for (let i = 0; i < list.length; i++) {
            let seat = this.getSeatByIndex(list[i].index);

            if (cc.mgr.caw.isGoldRoom()) {
                let score = parseInt(list[i].score);
                let dl = score >= 0 ? 2 : 1;
                cc.delayedCall(this.node, dl, function () {
                    seat.floatScore(score);
                    seat.setScore(list[i].total_score);
                })
            }
            else {
                seat.setScore(list[i].total_score);
            }
        }

        if (cc.mgr.caw.isGoldRoom()) {
            cc.delayedCall(this.node, 4, function () {
                cc.mgr.caw.ready();
            })

            let wins = new Array();
            let lose = new Array();
            for (let i = 0; i < list.length; i++) {
                let p = list[i];
                if (p.index == msg.host_id) {
                    continue;
                }

                if (p.score > 0) {
                    wins.push(p.index);
                }
                else if (p.score < 0) {
                    lose.push(p.index);
                }
            }
            this.playGoldRoomResultAnim(msg.host_id, wins, lose);
        }
        else {
            this.roundOver.onJiesuan(msg);
        }
    },

    _doPlayBeanAnim: function (from, to, amount) {
        let self = this;
        let temp = new Array();
        for (let i = 0; i < amount; i++) {
            cc.delayedCall(this.node, i * 0.05, function () {
                let bean = self.beanPool.get();
                to = cc.p(to.x + cc.randomMinus1To1() * 10, to.y + cc.randomMinus1To1() * 10);
                var bezier = [from, cc.p(cc.randomMinus1To1() * 50, cc.randomMinus1To1() * 50), to];
                if (i < 5) {
                    bean.opacity = 255 * ((i + 1) / 5);
                }
                else if (amount - i <= 5) {
                    bean.opacity = 255 * ((amount - i + 1) / 5);
                }
                bean.rotation = cc.random0To1() * 360;
                bean.runAction(cc.sequence(
                    cc.place(from),
                    //cc.moveTo(0.7, to),
                    cc.bezierTo(0.7, bezier),
                    cc.callFunc(() => {
                        bean.opacity = 255;
                        //self.beanPool.put(bean);
                    })
                ));
                temp.push(bean);
            })
        }
        cc.mgr.audioMgr.playSFX('caw/coins_fly_in_long.mp3');
        cc.delayedCall(this.node, 0.05 * amount + 0.7, function () {
            for (let i = 0; i < temp.length; i++) {
                self.beanPool.put(temp[i]);
            }
        })
    },
    // 播放金币流向动画
    // total为本局金币流动数量，即赢的总数
    playGoldRoomResultAnim: function (hostid, winlist, loselist) {
        let self = this;
        let hostSeat = this.getSeatByIndex(hostid)
        let hostpos = hostSeat.getGoldPos();

        for (let i = 0; i < loselist.length; i++) {
            let seat = self.getSeatByIndex(loselist[i])
            self._doPlayBeanAnim(seat.getGoldPos(), hostpos, 20);
        }

        let d = loselist.length > 0 ? 2 : 0;
        cc.delayedCall(this.node, 2, function () {
            for (let i = 0; i < winlist.length; i++) {
                let seat = self.getSeatByIndex(winlist[i])
                self._doPlayBeanAnim(hostpos, seat.getGoldPos(), 20);
            }
        })

    },


    onLeaveRoom: function (msg) {
        cc.log('!!' + JSON.stringify(msg));
        let seat = this.getSeatByIndex(msg.index);
        seat.onLeave();
        if (msg.index == cc.mgr.caw.myIndex) {
            cc.director.loadScene('hall', function () {
                if (msg.reason == ErrNo.LEAVE_ROOM_NO_GOLD) {
                    cc.log('!!-')
                    cc.floatTip('金币不足，不能继续进行游戏');
                }
            });
        }
    },

    onOffline: function (index, val) {
        let seat = this.getSeatByIndex(index);
        seat.setOffline(val);
    },

    onDingZhuang: function (bankerIndex) {
        cc.mgr.caw.roomInfo.host_id = bankerIndex;
        for (let i = 0; i < this.seats.length; i++) {
            let seat = this.seats[i];
            if (seat._index > 0) {
                seat.setBanker(seat._index == bankerIndex, true);
            }
        }
    },

    calcSeatIdFromIndex: function (index) {
        // let myIdx = cc.mgr.caw.myIndex - 1;
        // let idx = index-1;
        cc.log('!== index:%d,myIndex:%d', index, cc.mgr.caw.myIndex)
        let seatid = (index - cc.mgr.caw.myIndex + MaxSeats) % MaxSeats;
        return seatid;
    },

    getSeatByIndex: function (idx) {
        for (let i = 0; i < this.seats.length; i++) {
            if (this.seats[i]._index == idx) {
                return this.seats[i];
            }
        }
        return null;
    },

    // // 发背面牌
    // // 返回动画时长
    // deal: function () {
    //     let self = this;
    //     let count = 0;
    //     for (let i = 0; i < this.seats.length; i++) {
    //         let seat = this.seats[i];
    //         cc.log('_____>' + seat._index)
    //         if (seat._index > 0) {//空座位
    //             cc.delayedCall(this.node, 0.3 * count, function () {
    //                 self.seats[i].deal([0, 0, 0, 0, 0]);
    //             })
    //             count++;
    //         }
    //     };
    //     return count * 0.3;
    // },

    onClickedStart: function (event) {
        cc.mgr.audioMgr.playButton();
        let userNum = cc.mgr.caw.usermap.size;
        if (userNum < 2) {
            cc.mgr.err.floatTip('需要2人以上才能开始游戏');
            return;
        }
        this.btnStart.active = false;
        cc.mgr.caw.start();
    },
    onClickedFold: function (event) {
        cc.mgr.audioMgr.playButton();
        this.btnFold.scaleX *= -1;
        this.roomInfo.show(this.btnFold.scaleX);
    },

    onClickedBet: function (event, customData) {
        cc.mgr.audioMgr.playButton();
        cc.mgr.caw.bet(parseInt(customData));
        this.bet.active = false;
    },

    onClickedAutoCalc: function () {
        this.btnAutoCalc.active = false;
        cc.mgr.caw.autoCalc();
    },

    onClickedDropdown: function (event) {
        cc.mgr.audioMgr.playButton();
        this.dropdownMenu.active = !this.dropdownMenu.active;
        event.target.rotation = this.dropdownMenu.active ? 180 : 0;
    },

    onClickedExit: function () {
        // 好友场
        if (!cc.mgr.caw.isGoldRoom()) {
            // 游戏还没开始
            if (cc.mgr.caw.roomInfo.status == 0) {
                let tip = '游戏即将开始，确认要返回大厅吗？';
                if (cc.mgr.caw.iamHost()) {
                    tip = '开局前退出将关闭房间，不消耗房卡。';
                }
                cc.alert(tip, function () {
                    cc.mgr.caw.leaveRoom();
                }, true);
            }
            else { // 游戏已开始，投票解散
                cc.alert('游戏中退出房间需要申请。', function () {
                    cc.mgr.caw.dismiss();
                }, true);
            }
        }
        else {//金币场
            cc.alert('是否退出房间？', function () {
                cc.mgr.net.send(NetId.C2S_LEAVE_ROOM);
            }, true);
        }
    },

    onClickedSetting: function () {
        cc.mgr.audioMgr.playButton();
        cc.loader.loadRes('prefab/innerSetting', function (err, prefab) {
            let node = cc.instantiate(prefab);
            node.parent = cc.find('Canvas/UI');
        })
    },

    onClickedHelp: function () {
        cc.mgr.audioMgr.playButton();
        cc.showHelpPanel();
    },

    onClickedChat: function () {
        cc.mgr.audioMgr.playButton();
        this.chatPanel.active = true;
    },

    onClickedBanker: function (event, customEventData) {
        cc.mgr.caw.c2sBanker(parseInt(customEventData));
        this.banker.active = false;
    },

    onClickedInvite: function () {
        let room_id = cc.mgr.caw.roomInfo.room_id;
        let total_ju = cc.mgr.caw.roomInfo.total_ju;
        let host_type = RoomType.get(GameType.NiuNiu)[cc.mgr.caw.roomInfo.host_type] + '.';
        let desc = '牛牛<玩法:' + host_type + total_ju + '局.>一起来玩吧.';
        cc.mgr.sdkMgr.share(WXScene.WXSceneTimeline, Config.wxurl, Config.wxtitle + '房号:' + room_id, desc);
    },

    clearTable: function () {
        for (let i = 0; i < this.seats.length; i++) {
            this.seats[i].clear();
        }
    },

    onDestroy: function () {
        cc.mgr.voiceMgr.stop();
        cc.mgr.caw.view = null;
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});

