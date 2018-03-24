let MJIndicator = require('MJIndicator');
let MJRoomInfo = require('MJRoomInfo');
let ZhuaNiao = require('ZhuaNiao');

cc.Class({
    extends: cc.Component,

    properties: {
        lastMJSign: cc.Node,
        topbar: MJRoomInfo,
        indicator: MJIndicator,
        zhuaNiao: ZhuaNiao,
        spriteCachePrefab: cc.Prefab,
    },

    // use this for initialization
    onLoad: function () {
        this.isReplay = true;
        this.usermap = new Map();
        this.myIndex = 0;
        this.roomSize = 0;

        this.mjSprites = this.node.getComponent('MJSprites');

        let cachenode = cc.instantiate(this.spriteCachePrefab);
        this.spriteCache = cachenode.getComponent('MJSpriteCache');

        this.seats = [];
        this.initView();
    },

    init: function (msg) {
        if (msg.code != ErrNo.OK) {
            cc.floatTip(msg.msg);
            return;
        }
        //cc.log('#-->' + JSON.stringify(msg))
        this.oplogs = msg.oplogs;
        this.roundend = msg.roundend;
        this.roomInfo = msg.roomInfo;
        this.startInfo = JSON.parse(JSON.stringify(msg.roundstart));

        this.usermap.clear();
        this.roomSize = msg.roundstart.length;
        for (let i = 0; i < msg.roundstart.length; i++) {
            this.usermap.set(msg.roundstart[i].id, msg.roundstart[i]);
        }

        this.node.active = true;
        this.clearTable();
        this.topbar.setRoomInfo(this.roomInfo);
        this.initSeats();
        this.cursor = 0;
        this.indicator.setReplayProgress(this.cursor, this.oplogs.length);
    },

    initView: function () {
        let names = ["my", "right", "up", "left"];
        for (let i = 0; i < names.length; i++) {
            let side = this.node.getChildByName(names[i]);
            let seat = side.getComponent('MJReplaySeat');
            this.seats.push(seat);
        }
        this.indicator.text.node.active = false;
    },

    initSeats: function () {
        // 先找第一视角的index，默认为1
        this.myIndex = 1;
        this.usermap.forEach(function (user, key) {
            if (user.uid == cc.mgr.userMgr.userinfo.uid) {//我自己
                this.myIndex = user.id;
            }
        }, this);

        this.usermap.forEach(function (user, key) {
            let localIdx = this.getLocalIndex(user.id);
            this.seats[localIdx].init(user, this);
        }, this);

    },

    getLocalIndex: function (index) {
        let maxSeats = this.roomSize;
        if (maxSeats > 2) {
            let localIdx = (index - this.myIndex + maxSeats) % maxSeats;
            return localIdx;
        }
        else {
            let localIdx = 0;
            if (index != this.myIndex) {
                localIdx = 2;
            }
            return localIdx;
        }
    },

    getSeat: function (idx) {
        for (let i = 0; i < this.seats.length; i++) {
            if (this.seats[i]._index == idx && this.seats[i].node.active) {
                return this.seats[i];
            }
        }
        return null;
    },
    clearTable: function () {
        for (let i = 0; i < this.seats.length; i++) {
            this.seats[i].clearTable();
        }

        this.lastMJSign.active = false;
    },

    close: function () {
        this.node.destroy();
    },

    next: function () {
        if (this.cursor >= this.oplogs.length) {
            this.onHupai(this.roundend);
            return -1;
        }
        let act = this.oplogs[this.cursor++];
        //cc.log(JSON.stringify(act))
        return this.doAction(act);
    },

    /**
     @return 本次action需要的时间
     */
    doAction: function (act) {
        this.indicator.indicate(this.getLocalIndex(act.operateUser), 0);
        this.indicator.setReplayProgress(this.cursor, this.oplogs.length);
        let opSeat = this.getSeat(act.operateUser);
        let duration = 1;
        switch (act.op_id) {
            case 2://摸牌
                duration = this.onMopai(act);
                break;
            case 3://出牌
                duration = this.onChupai(act);
                break;
            case 4://碰扛...
                duration = this.onOperate(act);
            default:
                break;
        }
        return duration;
    },

    onChupai: function (act) {
        //数据
        let user = this.usermap.get(act.operateUser);
        user.all_cards.out_cards.push(act.operateCard);
        let idx = user.all_cards.cards.indexOf(act.operateCard);
        if (idx != -1) {
            user.all_cards.cards.splice(idx, 1);
        }

        if (this.jumping) {
            return 0;
        }
        // 表现
        this.sortCards(user.all_cards.cards);

        let seat = this.getSeat(act.operateUser);
        seat.onChupai({ relevant_card: act.operateCard, out_card_plyer_cards: user.all_cards });

        if (!this.lastMJSign.active) {
            this.lastMJSign.active = true;
        }
        let wpos = seat.getLastMJWorldPos();
        let npos = this.node.convertToNodeSpaceAR(wpos);
        this.lastMJSign.setPosition(npos);
        return 1;
    },

    onMopai: function (act) {
        //数据
        let user = this.usermap.get(act.operateUser);
        user.all_cards.cards.push(act.operateCard);

        if (this.jumping) {
            return 0;
        }
        // 排序
        this.sortCards(user.all_cards.cards);

        let seat = this.getSeat(act.operateUser);
        seat.onMopai({ card: act.operateCard });

        return 0.5;
    },

    onOperate: function (act) {
        // 数据
        let user = this.usermap.get(act.operateUser);
        let weave = { weaveKind: act.operateCode, centerCard: act.operateCard, provider_id: act.provideUser };
        user.all_cards.weaves.push(weave);
        // 操作者的手牌
        let handCards = user.all_cards.cards;
        let other = this.usermap.get(act.provideUser);
        switch (act.operateCode) {
            case 2://左吃
                this.removeCard(handCards, act.operateCard + 1);
                this.removeCard(handCards, act.operateCard + 2);

                if (other) {
                    this.removeCard(other.all_cards.out_cards, act.operateCard);
                }
                break;
            case 3://中吃
                this.removeCard(handCards, act.operateCard - 1);
                this.removeCard(handCards, act.operateCard + 1);
                if (other) {
                    this.removeCard(other.all_cards.out_cards, act.operateCard);
                }
                break;
            case 4://右吃
                this.removeCard(handCards, act.operateCard - 1);
                this.removeCard(handCards, act.operateCard - 2);
                if (other) {
                    this.removeCard(other.all_cards.out_cards, act.operateCard);
                }
                break;
            case 5://碰
                this.removeCard(handCards, act.operateCard);
                this.removeCard(handCards, act.operateCard);
                if (other) {
                    this.removeCard(other.all_cards.out_cards, act.operateCard);
                }
                break;
            case 6://杠
                this.removeCard(handCards, act.operateCard);
                this.removeCard(handCards, act.operateCard);
                this.removeCard(handCards, act.operateCard);
                if (other) {
                    this.removeCard(other.all_cards.out_cards, act.operateCard);
                }
                break;
            case 12://碰杠
                this.removeCard(handCards, act.operateCard);
                // 删除原来的碰
                for (let i = 0; i < user.all_cards.weaves.length; i++) {
                    let weave = user.all_cards.weaves[i];
                    if (weave.weaveKind == 5 && weave.centerCard == act.operateCard) {
                        user.all_cards.weaves.splice(i, 1);
                        break;
                    }
                }
                break;
            case 11://暗杠
                this.removeCard(handCards, act.operateCard);
                this.removeCard(handCards, act.operateCard);
                this.removeCard(handCards, act.operateCard);
                this.removeCard(handCards, act.operateCard);
                break;

        }
        if (this.jumping) {
            return 0;
        }

        this.sortCards(handCards);

        // 表现
        if (other) {
            //cc.log('other:' + JSON.stringify(other))
            this.sortCards(other.all_cards.cards);
            let otherSeat = this.getSeat(other.id);
            otherSeat.refreshFolds(other.all_cards.out_cards);
        }

        let seat = this.getSeat(act.operateUser);
        seat.onOperate({ operate_player_cards: user.all_cards, action: act.operateCode });
        return 1;
    },

    onHupai: function (msg) {
        //cc.log('onHupai-->' + JSON.stringify(msg))
        for (let i = 0; i < msg.players.length; i++) {
            let p = msg.players[i];
            let seat = this.getSeat(p.id);
            if (seat) {
                seat.onHupai(p);
            }
        }

        let delay = 0.5;
        // 抓鸟
        if (msg.niao_cards.length > 0) {
            cc.delayedCall(this.node, delay, () => {
                this.zhuaNiao.begin(msg.niao_cards, this);
            })
            delay += msg.niao_cards.length * 0.2 + 1;
        }
    },

    // 如果找到值就从原数组中删除该值
    removeCard: function (array, value) {
        let idx = array.indexOf(value);
        if (idx != -1) {
            array.splice(idx, 1);
        }
    },

    sortCards: function (cards, laizi) {
        cards.sort(function (a, b) {
            return a - b;

        });
    },

    jump: function (step) {
        this.jumping = true;
        if (step > 0) {
            for (let i = 0; i < step; i++) {
                this.next();
            }
        }
        else if (step < 0) {
            for (let i = 0; i < this.startInfo.length; i++) {
                let info = this.startInfo[i];
                let user = this.usermap.get(info.id);
                user.all_cards = JSON.parse(JSON.stringify(info.all_cards));
            }
            let stepTo = this.cursor + step;
            this.cursor = 0;
            let i = 0;
            do {
                this.next();
                i++;
            } while (i < stepTo);
        }
        this.jumping = false;
        // 刷新所有人表现
        this.usermap.forEach(function (user, key) {
            let handCards = user.all_cards.cards;
            this.sortCards(handCards)
            let seat = this.getSeat(user.id);
            seat.refreshMj(user.all_cards);
        }, this);

        return 1;
    },
});
