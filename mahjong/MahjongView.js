let MJIndicator = require('MJIndicator');
let MJRoomInfo = require('MJRoomInfo');
let MJSeat = require('MJSeat');
let MJPlayer = require('MJPlayer');
let MJRoundOver = require('MJRoundOver');
let ZhuaNiao = require('ZhuaNiao');
let Ting = require('Ting');

const MaxSeats = 4;

cc.Class({
    extends: cc.Component,

    properties: {
        seats: [MJSeat],
        players: [MJPlayer],

        //-- UI Panel
        dropdownMenu: cc.Node,
        chatPanel: cc.Node,
        indicator: MJIndicator,
        roomInfo: MJRoomInfo,
        roundVoer: MJRoundOver,
        zhuaNiao: ZhuaNiao,
        ting: Ting,

        //btns
        btnInvite: cc.Node,

        opPeng: cc.Node,
        opGang: cc.Node,
        opGang2: cc.Node,
        opHu: cc.Node,
        opPass: cc.Node,
        opChi: cc.Node,

        lastMJSign: cc.Node,
    },

    // use this for initialization
    onLoad: function () {
        cc.view.setResolutionPolicy(cc.ResolutionPolicy.EXACT_FIT);
        cc.mgr.mj.view = this;
        this.spriteCache = cc.find('spriteCache').getComponent('MJSpriteCache');

        this.node.runAction(cc.fadeIn(0.3))
        this.initView();

        this.help = null;
    },

    initView: function () {
        this.tableNode = cc.find('Canvas/table');
        let names = ["my", "right", "up", "left"];
        for (let i = 0; i < names.length; i++) {
            let side = cc.find('Canvas/table/' + names[i]);
            let seat = side.getComponent(MJSeat);
            this.seats.push(seat);

            let p = side.getComponentInChildren(MJPlayer);
            this.players.push(p);
        }

        for (let i = 0; i < this.players.length; i++) {
            this.players[i].hide();
        }

        this.ops = [this.opPeng, this.opGang, this.opGang2, this.opHu, this.opChi, this.opPass];
    },

    onJoinRoom: function () {
        cc.mgr.mj.c2sReady();
        let room = cc.mgr.mj.roomInfo;
        this.roomInfo.setRoomInfo(room);


        cc.mgr.mj.usermap.forEach((user, key) => {
            let localIdx = this.getLocalIndex(user.index);
            this.players[localIdx].setInfo(user);
            this.seats[localIdx].init(user);
        });

        this.btnInvite.active = true;
        if (cc.mgr.mj.roomInfo.status == 0) {
            this.btnStart.active = cc.mgr.mj.isRoomOwner();
        }
    },

    onRejoinRoom: function (myNotify, vote, hu_data) {
        let room = cc.mgr.mj.roomInfo;
        this.roomInfo.setRoomInfo(room);

        //local STATUS_FREE = 1
        //local STATUS_READY = 2
        //local STATUS_PLAY = 3
        //local STATUS_RESULT = 4
        //local STATUS_END = 5
        //local STATUS_JIE_SAN = 6
        let status = parseInt(room.room_status);
        cc.log('!!!' + status)
        switch (status) {
            case 2: // 有人没准备或没加入
                cc.mgr.mj.c2sReady();
                this.btnInvite.active = true;
                break;
            case 3: // 游戏中
                cc.mgr.mj.c2sReady();
                this.btnInvite.active = false;
                this.indicator.indicate(this.getLocalIndex(room.cur_id), 0);
                this.indicator.setStatus(room.left_card_num, room.cur_ju, room.total_ju);
                break;
            case 4://大结算
                break;
            default:
                break;
        }

        cc.mgr.mj.usermap.forEach((user, key) => {
            let localIdx = this.getLocalIndex(user.index);
            this.players[localIdx].setInfo(user);
            this.players[localIdx].onRejoin(status, room.play_status);
            this.seats[localIdx].init(user);
            // 一局结束，别人还没准备
            if (room.play_status == 9) {
                this.indicator.node.active = false;
            }
            else {
                this.seats[localIdx].refreshMj(user.all_cards);
                this.checkOperate(myNotify);
            }
        });


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

        if (hu_data) {
            this.roundVoer.show(hu_data);
        }
    },

    onNewPlayer: function (user) {
        let localIdx = this.getLocalIndex(user.index);
        this.players[localIdx].setInfo(user);
        this.seats[localIdx].init(user);
    },

    onReady: function (msg) {
        let player = this.getPlayer(msg.index);
        player.setReady(true, msg.score);
    },

    onStarted: function (msg) {
        cc.log(JSON.stringify(msg));
        let room = cc.mgr.mj.roomInfo;
        this.roomInfo.setRoomInfo(room);
        this.indicator.indicate(this.getLocalIndex(msg.cur_id), 0);
        this.indicator.setStatus(room.left_card_num, room.cur_ju, room.total_ju);
        for (let i = 0; i < this.players.length; i++) {
            this.players[i].onStarted();
        }

        this.clearTable();

        let myseat1 = this.getSeat(cc.mgr.mj.myIndex);
        myseat1.refreshMj(msg.selfCards);
        for (let i = 0; i < msg.othersCards.length; i++) {
            let seat = this.getSeat(msg.othersCards[i].id);
            seat.refreshMj(msg.othersCards[i]);
        }

        this.btnInvite.active = false;

        cc.mgr.audioMgr.playSFX('gamestar.mp3');

        this.checkOperate(msg.notify);
    },

    onIndicate: function (msg) {
        let lIdx = this.getLocalIndex(msg.id);
        this.indicator.indicate(lIdx, msg.wait_time);
        if (this.btnInvite.active == true) {
            this.btnInvite.active = false;
        }
    },

    onLeaveRoom: function (msg) {
        let player = this.getPlayer(msg.index);
        player.onLeave();
        cc.log('onLeaveRoom:', msg.index, cc.mgr.mj.myIndex);
        if (msg.index == cc.mgr.mj.myIndex) {
            cc.director.loadScene('hall', function () {
                if (msg.reason == ErrNo.LEAVE_ROOM_NO_GOLD) {

                }
            });
        }
    },

    onOffline: function (index, val) {
        let player = this.getPlayer(index);
        player.setOffline(val);
    },

    onChat: function (msg) {
        cc.log('-->' + JSON.stringify(msg));

        let player = this.getPlayer(msg.index);
        player.setChat(msg.msg_type, msg.msg_value);
    },

    // 玩家摸牌
    onMopai: function (msg) {
        let seat = this.getSeat(msg.id);
        seat.onMopai(msg);
        let room = cc.mgr.mj.roomInfo;
        this.indicator.indicate(this.getLocalIndex(msg.id), msg.notify.wait_time);
        this.indicator.setStatus(msg.nof_left, room.cur_ju, room.total_ju);

        this.checkOperate(msg.notify);
    },

    // 玩家出牌
    onUserChupai: function (msg) {
        cc.log(JSON.stringify(msg));
        let seat = this.getSeat(msg.out_card_player);
        seat.onChupai(msg);

        if (!this.lastMJSign.active) {
            this.lastMJSign.active = true;
        }
        let wpos = seat.getLastMJWorldPos();
        let npos = this.tableNode.convertToNodeSpaceAR(wpos);
        this.lastMJSign.setPosition(npos);

        // 自己出牌后不能再出牌，除非服务器通知
        if (msg.out_card_player == cc.mgr.mj.myIndex) {
            cc.mgr.mj.turn = -1;
            let tings = cc.mgr.mj.getTingCards(msg.out_card_plyer_cards.cards, msg.out_card_plyer_cards.weaves);
            this.ting.setTing(tings)
            if (tings) {
                cc.log("chupai----------------______" + JSON.stringify(tings) + " " + this.ting);
            }
        }
        this.checkOperate(msg.notify);
    },

    getLocalIndex: function (index) {
        let maxSeats = cc.mgr.mj.roomInfo.count_limit;
        if (maxSeats > 2) {
            let localIdx = (index - cc.mgr.mj.myIndex + maxSeats) % maxSeats;
            return localIdx;
        }
        else {
            let localIdx = 0;
            if (index != cc.mgr.mj.myIndex) {
                localIdx = 2;
            }
            return localIdx;
        }
    },

    getPlayer: function (idx) {
        for (let i = 0; i < this.players.length; i++) {
            if (this.players[i]._index == idx) {
                return this.players[i];
            }
        }
        return null;
    },

    getSeat: function (idx) {
        for (let i = 0; i < this.seats.length; i++) {
            if (this.seats[i]._index == idx && this.seats[i].node.active) {
                return this.seats[i];
            }
        }
        return null;
    },

    /** 检查碰杠胡吃
    @param op [MJOperateNotify]
     */
    checkOperate: function (op) {
        if (op.actions.length > 0) {
            this.opPass.active = true;
            this.indicator.countdown(op.wait_time);
            //cc.log('turn----------->' + cc.mgr.mj.turn)
            cc.mgr.mj.turn = -1;
        }
        else {
            for (let i = 0; i < this.ops.length; i++) {
                this.ops[i].active = false;
            }
            return;
        }

        let chi_list = []
        for (let i = 0; i < op.actions.length; i++) {
            let act = op.actions[i];
            switch (act.action_id) {
                case 2:
                case 3:
                case 4:
                    chi_list.push(act.action_id);
                    this.opChi.active = true;
                    this.opChi.userTag = act
                    this.opChi.chi_list = chi_list;
                    let frame0 = cc.mgr.mj.mjSprites.getSpriteFrame('M_', act.relevant_card);
                    this.opChi.getChildByName('mj').getComponent(cc.Sprite).spriteFrame = frame0;
                    let chilistRoot = this.opChi.getChildByName('chilist');
                    chilistRoot.removeAllChildren();
                    if (chi_list.length == 1) {
                        let mjlist = [act.relevant_card + 2 - chi_list[i], act.relevant_card + 2 - chi_list[i] + 1, act.relevant_card + 2 - chi_list[i] + 2];
                        for (let j = 0; j < 3; j++) {
                            let node = new cc.Node('mj');
                            node.parent = chilistRoot;
                            let spr = node.addComponent(cc.Sprite);
                            spr.spriteFrame = cc.mgr.mj.mjSprites.getSpriteFrame('B_', mjlist[j]);
                            if (act.relevant_card == mjlist[j]) {
                                node.color = cc.Color.YELLOW;
                            }
                            node.on('touchend', function () {
                                cc.mgr.mj.c2sOperate(chi_list[i], act.relevant_card);
                                chilistRoot.removeAllChildren();
                            }, this)
                        }
                    }

                    break;
                case 5:// 碰
                    this.opPeng.active = true;
                    this.opPeng.userTag = act;
                    let frame1 = cc.mgr.mj.mjSprites.getSpriteFrame('M_', act.relevant_card);
                    this.opPeng.getChildByName('mj').getComponent(cc.Sprite).spriteFrame = frame1;
                    break;
                case 6://杠
                case 11:
                case 12:
                    if (this.opGang.active == true) {
                        this.opGang2.active = true;
                        this.opGang2.userTag = act;
                        let frame2 = cc.mgr.mj.mjSprites.getSpriteFrame('M_', act.relevant_card);
                        this.opGang2.getChildByName('mj').getComponent(cc.Sprite).spriteFrame = frame2;
                    }
                    else {
                        this.opGang.active = true;
                        this.opGang.userTag = act;
                        let frame2 = cc.mgr.mj.mjSprites.getSpriteFrame('M_', act.relevant_card);
                        this.opGang.getChildByName('mj').getComponent(cc.Sprite).spriteFrame = frame2;
                    }
                    break;
                case 8: // 吃胡
                    this.opHu.active = true;
                    this.opHu.userTag = act;
                    let frame3 = cc.mgr.mj.mjSprites.getSpriteFrame('M_', act.relevant_card);
                    this.opHu.getChildByName('mj').getComponent(cc.Sprite).spriteFrame = frame3;
                    break;
                default:
                    break;
            }
        }
    },

    onUserOperate: function (msg) {
        let seat = this.getSeat(msg.id);
        seat.onOperate(msg);

        for (let i = 0; i < this.ops.length; i++) {
            this.ops[i].active = false;
        }

        if (msg.relevant_player_cards && msg.id != msg.relevant_player_cards.id) {
            let other = this.getSeat(msg.relevant_player_cards.id);
            other.refreshFolds(msg.relevant_player_cards.out_cards)
        }

        if (msg.notify) {
            this.checkOperate(msg.notify);
        }

        this.lastMJSign.active = false;
    },

    onUpdateOperateNotify: function (notify) {
        this.checkOperate(notify);
    },

    onHupai: function (msg) {
        for (let i = 0; i < this.ops.length; i++) {
            this.ops[i].active = false;
        }

        for (let i = 0; i < msg.players.length; i++) {
            let p = msg.players[i];
            let seat = this.getSeat(p.id);
            if (seat) {
                seat.onHupai(p);
            }
        }

        let delay = 1;
        // 抓鸟
        if (msg.niao_cards.length > 0) {
            cc.delayedCall(this.node, delay, () => {
                this.zhuaNiao.begin(msg.niao_cards, cc.mgr.mj);
            })
            delay += msg.niao_cards.length * 0.2 + 1;
        }

        cc.delayedCall(this.node, delay, () => {
            this.roundVoer.show(msg);
        })
        this.indicator.end();
    },

    myHoldsSelected: function (idx) {
        let myseat = this.getSeat(cc.mgr.mj.myIndex);
        myseat.onMyHoldsSelected(idx);
    },

    tryChupai: function (mjid, from) {
        let seat = this.getSeat(cc.mgr.mj.myIndex);
        seat.playChupaiAnim(mjid, from);
    },

    onClickedDropdown: function (event) {
        cc.mgr.audioMgr.playButton();

        if (!this.fl) {
            this.dropdownMenu.runAction(cc.scaleTo(0.1, 1, 1).easing(cc.easeBackOut()));
            this.fl = true;
        }
        else {
            this.dropdownMenu.runAction(cc.scaleTo(0.1, 1, 0));
            this.fl = false;
        }
        //this.dropdownMenu.active = !this.dropdownMenu.active;
        event.target.rotation = this.fl ? 180 : 0;
    },

    onClickedExit: function () {
        cc.mgr.net.send(NetId.C2S_LEAVE_ROOM);
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

    onClickedInvite: function () {
        let roominfo = cc.mgr.mj.roomInfo;

        let title = '{0}房号:{1}({2}局)'.template(Config.wxtitle, roominfo.room_id, roominfo.total_ju);
        let rule = cc.utils.getMJRule(roominfo);
        let mjname = MJName.get(roominfo.mj_type);

        let desc = '{0}:{1}人玩.<{2}>一起来玩吧！'.template(mjname, roominfo.count_limit, rule);
        cc.mgr.sdkMgr.share(WXScene.WXSceneTimeline, Config.wxurl, title, desc);
    },

    onClickedOperate: function (event, customData) {
        if (event.target.name == 'opPass') {
            cc.mgr.mj.c2sOperate(1, 0);
        }
        else if (event.target.parent.name == 'chi') {
            let act = event.target.parent.userTag;
            let chilistRoot = event.target.parent.getChildByName('chilist');
            chilistRoot.removeAllChildren();
            let chi_list = event.target.parent.chi_list;
            // 如果只有一种吃法，直接吃
            if (chi_list.length == 1) {
                cc.mgr.mj.c2sOperate(chi_list[0], act.relevant_card);
                return;
            }
            for (let i = 0; i < chi_list.length; i++) {
                let mjlist = [act.relevant_card + 2 - chi_list[i], act.relevant_card + 2 - chi_list[i] + 1, act.relevant_card + 2 - chi_list[i] + 2];
                for (let j = 0; j < 3; j++) {
                    let node = new cc.Node('mj');
                    node.parent = chilistRoot;
                    let spr = node.addComponent(cc.Sprite);
                    spr.spriteFrame = cc.mgr.mj.mjSprites.getSpriteFrame('B_', mjlist[j]);
                    if (act.relevant_card == mjlist[j]) {
                        node.color = cc.Color.YELLOW;
                    }
                    node.on('touchend', function () {
                        cc.mgr.mj.c2sOperate(chi_list[i], act.relevant_card);
                        chilistRoot.removeAllChildren();
                    }, this)
                }
                let separator = new cc.Node();
                separator.width = 10;
                separator.parent = chilistRoot;
            }
        }
        else {
            let act = event.target.parent.userTag;
            cc.mgr.mj.c2sOperate(act.action_id, act.relevant_card);
        }
    },

    clearTable: function () {
        for (let i = 0; i < this.seats.length; i++) {
            this.seats[i].clearTable();
        }

        for (let i = 0; i < this.ops.length; i++) {
            this.ops[i].active = false;
        }

        this.lastMJSign.active = false;
        this.ting.setTing();
    },


    onDestroy: function () {
        cc.mgr.voiceMgr.stop();
        cc.mgr.mj.view = null;
    },
});
