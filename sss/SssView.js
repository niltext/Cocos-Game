let Seat = require('SssSeat');
let RoomInfo = require('SssRoomInfo');
let Countdown = require('Countdown');
let SpritesCache = require('SpritesCache');
let RoundOver = require('SssRoundOver');
let BeanPool = require('BeanPool');

let PokerCtor = require('PokerCtor');
let SssPoker = require('SssPoker');
let SssLayer = require('SssLayer');

let PokerLogic = require('PokerLogic')

const MaxSeats = 6;
let tempY = -283;
let minY = -260;
let initCards = new Array();
let set1 = false;
let set2 = false;
let set3 = false;
cc.Class({
    extends: cc.Component,

    properties: {
        seats: [Seat],
        roomInfo: RoomInfo,
        roundOver: RoundOver,
        dropdownMenu: cc.Node,

        innerSetting: cc.Node,
        chatPanel: cc.Node,

        sending: cc.Node, //发牌中
        placePanel: cc.Node, //十三水扑克放置栏
        matchPanel: [cc.Button],  //存在匹配的牌型,可点击按钮选牌
        startcomp: cc.Node, //开始比牌

        btn1: cc.Node,
        btn2: cc.Node,

        countdown: Countdown,
        bet: cc.Node,
        bet1: cc.Node, // 金币场下注专用
        banker: cc.Node,
        btnInvite: cc.Node,

        btnFold: cc.Node,
        startAnim: cc.Node,

        pokerPrefab: cc.Prefab,
        dunPrefab: cc.Prefab,

        desktop: cc.Node,


        _myPokers: [cc.Node],

        sprCache: SpritesCache,

        beanPool: BeanPool,

    },

    // use this for initialization
    onLoad: function () {
        cc.view.setResolutionPolicy(cc.ResolutionPolicy.EXACT_FIT);
        cc.mgr.sss.view = this;
        cc.mgr.audioMgr.pauseBGM();
        //cc.nc.log('+'+typeof(this.sprCache))
        cc.mgr.sss.sprCache = this.sprCache;
        //-------------
        this.pokerPool = new cc.NodePool('SssPoker');
        // 先创建50张牌放入对象池
        for (let i = 0; i < 50; i++) {
            let poker = cc.instantiate(this.pokerPrefab);
            this.pokerPool.put(poker);
        }

        for (let i = 0; i < this.seats.length; i++) {
            this.seats[i].init(this.desktop, this.pokerPool);
            this.seats[i].hide();
        }

        this.btnInvite.active = false;

        this.roomInfo.setRoomInfo(cc.mgr.sss.roomInfo);

        this.initEventHandlers();

        //定义扑克主逻辑--
        this.pokerCtor = new PokerCtor();
        this.pokerLabel = new SssPoker();
        this.sssLayer = new SssLayer();

        this.pokerLogic = new PokerLogic();

        this.firstCard = cc.find('Canvas/UI/placePanel/card1');
        this.midCard = cc.find('Canvas/UI/placePanel/card2');
        this.backCard = cc.find('Canvas/UI/placePanel/card3');

        this.dun1Card = new Array();
        this.dun2Card = new Array();
        this.dun3Card = new Array();
    },

    onJoinRoom: function () {
        // 自动准备
        cc.mgr.sss.ready();

        cc.log('size ' + cc.mgr.sss.usermap.size);
        cc.log('~~' + JSON.stringify(cc.mgr.sss.usermap));

        if (cc.mgr.sss.isGoldRoom()) {
            this.roomInfo.node.active = false;

            // 恢复金币场中别人的残局
            this.onRejoinRoom();
        }
        else {
            cc.mgr.sss.usermap.forEach((user, key) => {
                let seatid = this.calcSeatIdFromIndex(user.index);
                this.seats[seatid].setInfo(user);
            })

            this.btnInvite.active = true;

            if (cc.mgr.sss.roomInfo.status == 0) {
            }
        }
    },

    // 重新加入还没结束的房间，要恢复现场
    onRejoinRoom: function (vote) {
        cc.log('重新加入房间');
        // 恢复现场

        let roominfo = cc.mgr.sss.roomInfo;
        let status = parseInt(roominfo.status);

        cc.mgr.sss.usermap.forEach((user, key) => {
            cc.log('!- index-->' + user.index)
            let seatid = this.calcSeatIdFromIndex(user.index);
            this.seats[seatid].setInfo(user);
            this.seats[seatid].onRejoin(status);
        })

        //let myseat = this.getSssSeat(cc.mgr.sss.myIndex);
        let me = cc.mgr.sss.myInfo();
        cc.log('status:' + status);
        switch (status) {
            case 0: //等待开始
                // 自动准备
                cc.mgr.sss.ready();
                if (cc.mgr.sss.isGoldRoom()) {// 金币场
                }
                else {
                    this.btnInvite.active = true;
                }
                break;
            case 99://等待准备
                if (me.ready == 0) {
                    cc.mgr.sss.ready();
                }
                break;
            case 100://开始游戏
                break;
            case 101://抢庄状态
                if (cc.mgr.sss.isGoldRoom() && cc.mgr.sss.isWaiting(cc.mgr.sss.myIndex)) {
                    break;
                }
                this.banker.active = true;

                break;
            case 102://下注状态
                this.banker.active = false;
                if (cc.mgr.sss.isGoldRoom() && cc.mgr.sss.isWaiting(cc.mgr.sss.myIndex)) {
                    break;
                }
                if (!cc.mgr.sss.iamHost() && !me.has_xia_zhu) {
                    if (cc.mgr.sss.isGoldRoom()) {
                        this.bet1.active = true;
                        if (cc.mgr.sss.xia_zhu_list) {
                            let goldRoomBet = this.bet1.getComponent('GoldRoomBet');
                            goldRoomBet.initBets(cc.mgr.sss.xia_zhu_list);
                        }
                    }
                    else {
                        this.bet.active = true;
                    }
                }
                break;
            case 103://算牛状态
                if (cc.mgr.sss.isGoldRoom() && cc.mgr.sss.isWaiting(cc.mgr.sss.myIndex)) {
                    break;
                }
                if (!me.has_calcu) {

                }
                break;
            case 104://结算状态
                if (cc.mgr.sss.result) {
                    this.roundOver.onJiesuan(cc.mgr.sss.result);
                }
                else {
                    cc.mgr.sss.ready();
                }
                break;
            case 105://关闭房间
                break;
            default:
                break;
        }

        //
        if (roominfo.status > 0 && roominfo.status < 105) {
            let usermap = cc.mgr.sss.usermap;
            usermap.forEach((user, key) => {
                // cc.log('恢复牌型：' + user.index)
                cc.log('cards:' + JSON.stringify(user.cards))
                if (!cc.mgr.sss.isWaiting(user.index)) {
                    let seat = this.getSssSeat(user.index);
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
            }, );
        }
    },


    initEventHandlers: function () {
        cc.mgr.sss._eventHandler = this.node;

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

        let room = cc.mgr.sss.roomInfo;
        this.roomInfo.setRoomInfo(room);
        for (let i = 0; i < this.seats.length; i++) {
            this.seats[i].onStarted();
        }

        cc.log('!! 开始：' + room.status);

        this.btnInvite.active = false;
        switch (room.host_type) {
            case 1://房主庄
                let seat = this.getSssSeat(room.host_id);
                if (seat) {
                    seat.setBanker(true, true);
                }
                break;
            case 2://抢庄 
                break;
            case 3:// 轮庄
                break;
            case 4: // 发4张抢庄
                break;
            default:
                break;
        }

        cc.mgr.audioMgr.playSFX('gamestar.mp3');
        cc.delayedCall(this.node, 1.5, () => {
            this.sending.active = true;
        });

        let delay = this.dealX(1);

        cc.delayedCall(this.node, delay + 2, () => {
            this.placePanel.active = true;

            this.sending.active = false;

            this.pokerCtor.sortCardList(mycards, 13, 1);
            //翻牌
            this.turnX(1, mycards);

            this.analyseType = this.pokerCtor.getType(mycards, 13);
            //可点按钮匹配
            for (let i = 0; i < 9; i++) {
                this.matchPanel[i].interactable = this.analyseType.match[i];
            }
        });
    },

    //点击按钮,对应牌型扑克上浮
    releaseBtn: function (event, customEventData) {
        let custom = parseInt(customEventData);
        // this.analyseType.snOnePare[];
        switch (custom) {
            case 0:
                break;
            case 1:
                break;
            case 2:
                break;
            case 3:
                break;
            case 4:
                break;
            case 5:
                break;
            case 6:
                break;
            case 7:
                break;
            default:
                break;
        }
    },

    //点击置入预选牌组到该道上
    onRelease: function (event, customEventData) {

        // 预选择上浮牌组
        let floatCards = new Array();
        let custom = parseInt(customEventData);
        for (let i = 0; i < 13; i++) {
            if (initCards[i].node.y > tempY && initCards[i].node.y < minY) {
                floatCards.push(initCards[i]);
            }
        }

        if (floatCards.length == 3 && custom == 0) {
            this.setDun1Card(floatCards);
        }
        if (floatCards.length == 5 && custom == 1) {
            this.setDun2Card(floatCards);
        }
        if (floatCards.length == 5 && custom == 2) {
            this.setDun3Card(floatCards);
        }
        if (set1 && set2 && set3) {
            this.btn1.active = false;
            this.btn2.active = true;
        }
    },

    setDun1Card: function (floatCards) {
        if (false == set1) {
            let dun1Card = new Array();

            for (let i = 0; i < floatCards.length; i++) {
                let poker = cc.instantiate(this.dunPrefab);
                poker.parent = this.firstCard;
                dun1Card.push(poker);

                let frameName = cc.utils.dec2HexStr(floatCards[i].getComponent('SssPoker').face);

                cc.loader.loadRes("atlas/cards", cc.SpriteAtlas, function (err, atlas) {
                    var frame = atlas.getSpriteFrame(frameName);
                    poker.getComponent(cc.Sprite).spriteFrame = frame;
                });
                floatCards[i].node.y -= 20;
                floatCards[i].node.active = false;
            }

            this.dun1Card = floatCards;
            this.dun1Poker = this.firstCard.children;
            set1 = true;
        }
    },
    setDun2Card: function (floatCards) {
        if (false == set2) {
            let dun2Card = new Array();


            for (let i = 0; i < floatCards.length; i++) {
                let poker = cc.instantiate(this.dunPrefab);
                poker.parent = this.midCard;
                dun2Card.push(poker);

                let frameName = cc.utils.dec2HexStr(floatCards[i].getComponent('SssPoker').face);

                cc.loader.loadRes("atlas/cards", cc.SpriteAtlas, function (err, atlas) {
                    var frame = atlas.getSpriteFrame(frameName);
                    poker.getComponent(cc.Sprite).spriteFrame = frame;
                });
                floatCards[i].node.y -= 20;
                floatCards[i].node.active = false;
            }

            this.dun2Card = floatCards;
            this.dun2Poker = this.midCard.children;
            set2 = true;
        }
    },
    setDun3Card: function (floatCards) {
        if (false == set3) {
            let dun3Card = new Array();

            for (let i = 0; i < floatCards.length; i++) {
                let poker = cc.instantiate(this.dunPrefab);
                poker.parent = this.backCard;
                dun3Card.push(poker);

                let frameName = cc.utils.dec2HexStr(floatCards[i].getComponent('SssPoker').face);

                cc.loader.loadRes("atlas/cards", cc.SpriteAtlas, function (err, atlas) {
                    var frame = atlas.getSpriteFrame(frameName);
                    poker.getComponent(cc.Sprite).spriteFrame = frame;
                });
                floatCards[i].node.y -= 20;
                floatCards[i].node.active = false;
            }

            this.dun3Card = floatCards;
            this.dun3Poker = this.backCard.children;
            set3 = true;
        }
    },

    rmDunCard: function (dunPoker, dunCard) {
        if (dunPoker) {
            for (let i = 0; i < dunPoker.length; i++) {
                if (dunPoker[i]) {
                    dunPoker[i].destroy();
                }
                dunCard[i].node.active = true;
            }
        }
    },
    //清除该道上的扑克回置到底栏
    onRemove: function (event, customEventData) {
        let custom = parseInt(customEventData);
        switch (custom) {
            case 0:
                set1 = false;
                this.btn1.active = true;
                this.btn2.active = false;
                if (this.dun1Poker) {
                    for (let i = 0; i < this.dun1Poker.length; i++) {
                        if (this.dun1Poker[i]) {
                            this.dun1Poker[i].destroy();
                        }
                        this.dun1Card[i].node.active = true;
                    }
                }
                break;
            case 1:
                set2 = false;
                this.btn1.active = true;
                this.btn2.active = false;
                if (this.dun2Poker) {
                    for (let i = 0; i < this.dun2Poker.length; i++) {
                        if (this.dun2Poker[i]) {
                            this.dun2Poker[i].destroy();
                        }
                        this.dun2Card[i].node.active = true;
                    }
                }
                break;
            case 2:
                set3 = false;
                this.btn1.active = true;
                this.btn2.active = false;
                if (this.dun3Poker) {
                    for (let i = 0; i < this.dun3Poker.length; i++) {
                        if (this.dun3Poker[i]) {
                            this.dun3Poker[i].destroy();
                        }
                        this.dun3Card[i].node.active = true;
                    }
                }
                break;
            case 3:
                this.rmDunCard(this.dun1Poker, this.dun1Card);
                this.rmDunCard(this.dun2Poker, this.dun2Card);
                this.rmDunCard(this.dun3Poker, this.dun3Card);
                set1 = false;
                set2 = false;
                set3 = false;
                this.btn1.active = true;
                this.btn2.active = false;
                break;
            default:
                break;
        }
    },

    // 自己和别人先发13张背面牌
    dealX: function (_delay) {
        let delay = _delay;

        cc.log('状态:' + cc.mgr.sss.isWaiting(cc.mgr.sss.myIndex));
        // 先给自己发13张假牌(背面)
        let myseat = this.getSssSeat(cc.mgr.sss.myIndex);
        cc.delayedCall(this.node, delay, function () {
            myseat.deal([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
        });
        // 再给别人发13张假牌(背面)
        let self = this;
        let count = 0;
        for (let i = 0; i < this.seats.length; i++) {
            let seat = this.seats[i];
            if (seat._index > 0 && seat._index != cc.mgr.sss.myIndex && !cc.mgr.sss.isWaiting(seat._index)) {
                delay += 0.2 * count;
                cc.delayedCall(this.node, delay, function () {
                    self.seats[i].deal([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
                });
                count++;
            }
        }
        return delay;
    },

    //翻转为明牌
    turnX: function (_delay, mycards) {
        let delay = _delay;

        if (mycards.length > 0 && !cc.mgr.sss.isWaiting(cc.mgr.sss.myIndex)) {
            let myseat = this.getSssSeat(cc.mgr.sss.myIndex);
            cc.delayedCall(this.node, delay, function () {
                initCards = myseat.dealImmediately(mycards);
                for (let i = 0; i < 13; i++) {
                    initCards[i].node.parent = cc.find('Canvas/UI/mycard');
                }
            });
        }
    },

    //确定出牌
    onConfirm: function () {
        if (this.dun1Card.length == 3 && this.dun2Card.length == 5 && this.dun3Card.length == 5) {
            this.placePanel.active = false;
            this.startcomp.active = true;
        }
        else {
            return;
        }

    },

    //------------网络部分转发事件

    onQiangZhuang: function (msg) {
        let seat = this.getSssSeat(msg.index);
        seat.setQiang(msg.qiang, true);
    },

    onReady: function (msg) {
        let seat = this.getSssSeat(msg.index);
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
                if (!cc.mgr.sss.iamHost()) {
                    if (cc.mgr.sss.isGoldRoom()) {
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
        let seat = this.getSssSeat(msg.index);
        if (seat) {
            seat.setBet(msg.score);
        }
        if (msg.index == cc.mgr.sss.myIndex) {
            this.bet.active = false;
        }
    },

    onJiesuan: function (msg) {
        this.countdown.end();
        // 小局结算

        let list = msg.players;
        for (let i = 0; i < list.length; i++) {
            let seat = this.getSssSeat(list[i].index);

            if (cc.mgr.sss.isGoldRoom()) {
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

        if (cc.mgr.sss.isGoldRoom()) {
            cc.delayedCall(this.node, 4, function () {
                cc.mgr.sss.ready();
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
        let hostSeat = this.getSssSeat(hostid)
        let hostpos = hostSeat.getGoldPos();

        for (let i = 0; i < loselist.length; i++) {
            let seat = self.getSssSeat(loselist[i]);
            self._doPlayBeanAnim(seat.getGoldPos(), hostpos, 20);
        }

        let d = loselist.length > 0 ? 2 : 0;
        cc.delayedCall(this.node, 2, function () {
            for (let i = 0; i < winlist.length; i++) {
                let seat = self.getSssSeat(winlist[i])
                self._doPlayBeanAnim(hostpos, seat.getGoldPos(), 20);
            }
        })

    },

    onLeaveRoom: function (msg) {
        cc.log('!!' + JSON.stringify(msg));
        let seat = this.getSssSeat(msg.index);
        seat.onLeave();
        if (msg.index == cc.mgr.sss.myIndex) {
            cc.director.loadScene('hall', function () {
                if (msg.reason == ErrNo.LEAVE_ROOM_NO_GOLD) {
                    cc.log('!!-')
                    cc.floatTip('金币不足，不能继续进行游戏');
                }
            });
        }
    },

    onOffline: function (index, val) {
        let seat = this.getSssSeat(index);
        seat.setOffline(val);
    },

    onDingZhuang: function (bankerIndex) {
        cc.mgr.sss.roomInfo.host_id = bankerIndex;
        for (let i = 0; i < this.seats.length; i++) {
            let seat = this.seats[i];
            if (seat._index > 0) {
                seat.setBanker(seat._index == bankerIndex, true);
            }
        }
    },

    calcSeatIdFromIndex: function (index) {
        // let myIdx = cc.mgr.sss.myIndex - 1;
        // let idx = index-1;
        cc.log('!== index:%d,myIndex:%d', index, cc.mgr.sss.myIndex)
        let seatid = (index - cc.mgr.sss.myIndex + MaxSeats) % MaxSeats;
        return seatid;
    },

    getSssSeat: function (idx) {
        for (let i = 0; i < this.seats.length; i++) {
            if (this.seats[i]._index == idx) {
                return this.seats[i];
            }
        }
        return null;
    },

    onClickedFold: function (event) {
        cc.mgr.audioMgr.playButton();
        this.btnFold.scaleX *= -1;
        this.roomInfo.show(this.btnFold.scaleX);
    },

    onClickedBet: function (event, customData) {
        cc.mgr.audioMgr.playButton();
        cc.mgr.sss.bet(parseInt(customData));
        this.bet.active = false;
    },

    onClickedDropdown: function (event) {
        cc.mgr.audioMgr.playButton();
        this.dropdownMenu.active = !this.dropdownMenu.active;
        event.target.rotation = this.dropdownMenu.active ? 180 : 0;
    },

    onClickedExit: function () {
        // 好友场
        if (!cc.mgr.sss.isGoldRoom()) {
            // 游戏还没开始
            if (cc.mgr.sss.roomInfo.status == 0) {
                let tip = '游戏即将开始，确认要返回大厅吗？';
                if (cc.mgr.sss.iamHost()) {
                    tip = '开局前退出将关闭房间，不消耗房卡。';
                }
                cc.alert(tip, function () {
                    cc.mgr.sss.leaveRoom();
                }, true);
            }
            else { // 游戏已开始，投票解散
                cc.alert('游戏中退出房间需要申请。', function () {
                    cc.mgr.sss.dismiss();
                }, true);
            }
        }
        else { // 金币场
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
        cc.mgr.sss.c2sBanker(parseInt(customEventData));
        this.banker.active = false;
    },

    onClickedInvite: function () {
        let room_id = cc.mgr.sss.roomInfo.room_id;
        let total_ju = cc.mgr.sss.roomInfo.total_ju;
        let host_type = RoomType.get(GameType.SSS)[cc.mgr.sss.roomInfo.host_type] + '.';
        let desc = '十三水<玩法:' + total_ju + '局.>一起来玩吧.';
        cc.mgr.sdkMgr.share(WXScene.WXSceneTimeline, Config.wxurl, Config.wxtitle + '房号:' + room_id, desc);
    },

    clearTable: function () {
        for (let i = 0; i < this.seats.length; i++) {
            this.seats[i].clear();
        }
    },

    onDestroy: function () {
        cc.mgr.voiceMgr.stop();
        cc.mgr.sss.view = null;
    },
});

