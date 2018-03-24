/** 注解
roomInfo.status:
STATUS_FREE = 1
STATUS_READY = 2
STATUS_PLAY = 3
STATUS_RESULT = 4
STATUS_END = 5
 */
module.exports = cc.Class({
    properties: {
        name:'MahjongLogic',
        view: null,

        roomInfo: null,
        usermap: null,

        myIndex: 0,

        mjSprites: null,

        turn: -1,


        WIK_NULL		:			1,//								--没有类型
        WIK_LEFT		:			2,//								--左吃类型
        WIK_CENTER		:			3,//								--中吃类型
        WIK_RIGHT		:			4,//								--右吃类型
        WIK_PENG		:			5,//								--碰牌类型
        WIK_GANG_MING	:			6,//								--杠牌类型,明杠，手上拿三张，杠了别人出的牌
        WIK_XIAO_HU		:			7,//								--小胡								
        WIK_CHI_HU		:			8,//								--吃胡类型
        WIK_ZI_MO		:			9,//								--自摸
        WIK_BU_ZHANG	:			10,//								--补张
        WIK_GANG_AN		:			11,//								--杠牌类型，暗杠，手上摸到四张同样的牌
        WIK_GANG_PENG	:			12,//								--杠牌类型，碰杠，碰了别人的牌，后面手上再次摸到一张牌
        card_set_: [],
        pesudo_lai_zi_:null,        //伪赖子，某些地方麻将没赖子，计算听的时候需要创建一个伪赖子
        feng_hu_:null,
    },

    // use this for initialization
    ctor: function () {
        this.usermap = new Map();
        let self = this;
        let net = cc.mgr.net;

        net.on(NetId.S2C_READY, function (event) {
            let msg = event.detail.msg;

            let info = this.usermap.get(msg.index);
            if (typeof (info) != 'undefined') {
                info.score = msg.score;
            }
            if (this.view) {
                this.view.onReady(msg);
            }
        }, this)

        net.on(NetId.S2C_MJ_GAME_START, function (event) {
            let msg = event.detail.msg;
            this.roomInfo.host_id = msg.host_id;
            this.turn = msg.cur_id;
            self.roomInfo.cur_ju = msg.cur_ju;
            self.roomInfo.left_card_num = msg.nof_left;

            if (this.view) {
                this.view.onStarted(msg);
                let tings = cc.mgr.mj.getTingCards(msg.selfCards.cards,msg.selfCards.weaves);
                this.view.ting.setTing(tings)
                if (tings){
                    cc.log("START----------------______"+JSON.stringify(tings));
                }
            }
        }, this)

        // 出牌指示器
        net.on(NetId.S2C_MJ_OUT_CARD_NOTIFY, function (event) {
            this.turn = event.detail.msg.id;
            if (this.view) {
                this.view.onIndicate(event.detail.msg);
            }
        }, this)

        // 摸牌
        net.on(NetId.S2C_MJ_DRAW_CARD, function (event) {
            let msg = event.detail.msg;
            if (this.view) {
                this.view.onMopai(event.detail.msg);
            }
        }, this)

        // 出牌
        net.on(NetId.S2C_MJ_OUT_CARD, function (event) {
            let msg = event.detail.msg;
            if (this.view) {
                this.view.onUserChupai(event.detail.msg);
            }
        }, this)

        // 操作
        net.on(NetId.S2C_MJ_OPERATE_RESULT, function (event) {
            let msg = event.detail.msg;

            if (msg.feng_hu && msg.feng_hu.length > 0){
                for(let i = 0;i < msg.feng_hu.length;i++){
                    if (msg.feng_hu[i].id == this.myIndex){
                        this.feng_hu_ = msg.feng_hu[i];
                    }
                }
            }

            if (this.view) {
                this.view.onUserOperate(event.detail.msg);
            }
        }, this)

        // 胡牌 
        net.on(NetId.S2C_MJ_HU, function (event) {
            let msg = event.detail.msg;
            if (this.view) {
                this.view.onHupai(event.detail.msg);
            }
        }, this)

        //大结算
        net.on(NetId.S2C_MJ_RESULT, function (event) {
            this.finalJiesuan_ = event.detail.msg;
            if (this.view) {
                if (!this.view.roundVoer.node.active) {
                    this.onGameResult()
                }
            }
        }, this)

        net.on(NetId.S2C_MJ_OPERATE_NOTIFY, function (event) {
           if (this.view) {
               this.view.onUpdateOperateNotify(event.detail.msg);
           }
        }, this)
    },

    setCardSet: function(cardset){
        cc.log("setCardSet"+cardset);
        this.card_set_ = cardset;
        this.pesudo_lai_zi_ = null;
    },

    getPesudoLaiZi: function(){
        if (this.card_set_.length <= 0){
            return;
        }

        if (this.pesudo_lai_zi_ != null) {
            return this.pesudo_lai_zi_;
        }

        for(let card = 0;card < 256;card++){
            let found = false;
            for (let i = 0;i < this.card_set_.length;i++){
                if (this.card_set_[i] == card){
                    found = true;
                    break;
                }
            }

            if (!found){
                this.card_set_.push(card);
                this.pesudo_lai_zi_ = card;
                return card;
            }
        }
    },

    getUserInfo: function (index) {
        return this.usermap.get(index);
    },

    convert2LogicCards: function(raw){
        let logic = new Array(256);

        for (let i = 0;i < logic.length;i++){
            logic[i] = 0;
        }

        for (let i = 0;i < raw.length;i++){
            let card = raw[i];
            logic[card] += 1;
        }

        return logic
    },

    analyse_hu: function(logic,card_count,lai_zi){
        let ret = [];
        let ret_sort = new Array(256);
        let cardset = this.card_set_;
        let logicCopyStr = JSON.stringify(logic);
        //let weavesCopyStr = JSON.stringify(weavesList);
        cc.log("analyse_hu count:"+card_count+ " cardset:"+cardset);
        if (card_count < 2 || card_count > 14 || (card_count-2) % 3 != 0){
            return;
        }

        let lessKinkItem = Math.floor((card_count-2) / 3);

        if (lessKinkItem == 0){
            if (card_count != 2){
                return;
            }
            for (let cindex = 0;cindex < cardset.length;cindex++){
                let card = cardset[cindex];
                if (logic[card] == 1){
                    if (lai_zi != card){
                        ret.push(card);
                    }else{
                        ret.push(lai_zi);
                    }
                    break;
                }
            }

            return ret;
        }

        let temp = JSON.parse(logicCopyStr);
        let tempWeaves = [];
        let magicCardCount = temp[lai_zi];
        if (temp[lai_zi] > 0){
            temp[lai_zi] = 1;
        }

        if (card_count >= 3){
            for (let cindex = 0;cindex < cardset.length;cindex++){
                let card = cardset[cindex];
                let count = temp[card];
                //cc.log("card:"+card+" count:"+count);
                if (count + magicCardCount >= 3){
                    let weave = {};
                    weave.weaveKind = this.WIK_PENG;
                    weave.centerCard = card;
                    if (count >=3 ){
                        weave.cards = [card,card,card];
                    }else{
                        weave.cards = [];
                        for (let i = 0;i < 3;i++){
                            if (i < count){
                                weave.cards.push(card);
                            }else{
                                weave.cards.push(lai_zi);
                            }
                        }
                    }
                    cc.log("--push weave:"+JSON.stringify(weave));
                    tempWeaves.push(weave);

                    if (count + magicCardCount >= 6){
                        let weave = {};
                        weave.weaveKind = this.WIK_PENG;
                        weave.centerCard = card;
                        if (count > 3){
                            weave.cards = [card,lai_zi,lai_zi];
                        }else{
                            weave.cards = [lai_zi,lai_zi,lai_zi];
                        }
                        cc.log("--push weave:"+JSON.stringify(weave));
                        tempWeaves.push(weave);
                    }
                }
                
                //东南西北中发白是没有顺子的
                if (0x30 > card){
                    let value = Math.ceil(card&0x0f);
                    if (value <= 7){
                        if (magicCardCount + count + temp[card+1] + temp[card+2] >= 3){
                            let mgcount = magicCardCount;
                            let check = new Array(256);
                            check[card] = count;
                            check[card+1] = temp[card+1];
                            check[card+2] = temp[card+2];
                            //cc.log("chi:"+card+" count:"+count);
                            while(mgcount + check[card] + check[card+1] + check[card+2] >= 3){
                                //cc.log(" "+ mgcount +" "+ check[card] +" "+ check[card+1] +" "+ check[card+2]);
                                let cards = [];
                                for (let i = card;i < card+3;i++){
                                    if (check[i] > 0){
                                        check[i] -= 1;
                                        cards.push(i);
                                    }else{
                                        mgcount -= 1;
                                        cards.push(lai_zi);
                                    }
                                }

                                if (mgcount >= 0){
                                    let weave = {};
                                    weave.weaveKind = this.WIK_LEFT;
                                    weave.centerCard = card;
                                    weave.cards = cards;
                                    tempWeaves.push(weave);
                                    cc.log("--push weave:"+JSON.stringify(weave));
                                }else{
                                    break;
                                }
                            }
                        }
                    }
                }
            }
        }

        cc.log("weaves length:"+tempWeaves.length+" lessKinkItem:"+lessKinkItem);

        if (tempWeaves.length >= lessKinkItem){
            let checkIndex = [0,1,2,3];
            do {
                let temp = JSON.parse(logicCopyStr);
                let tempItems = [];
                //cc.log("weave index:"+checkIndex);
                for (let i = 0;i < lessKinkItem;i++){
                    let ttt = JSON.stringify(tempWeaves[checkIndex[i]]);
                    tempItems.push(JSON.parse(ttt));
                    //cc.log("weave data:"+ttt);
                }

                let enoughCard = true;
                let checkEnd = false;

                for (let i = 0;i < lessKinkItem;i++){
                    let cs = tempItems[i].cards;
                    //cc.log("weaveKind:"+tempItems[i].weaveKind);
                    for (let j = 0;j < cs.length;j++){
                        let c = cs[j];
                        //cc.log("card:"+c+" count:"+temp[c]);
                        if (temp[c] == 0){
                            if (temp[lai_zi] > 0 ){
                                //cc.log("need lai zi ! count:"+temp[lai_zi]);
                                temp[lai_zi] -= 1;
                                cs[j] = lai_zi;
                            }else{
                                //cc.log("lai zi not enough");
                                enoughCard = false;
                                checkEnd = true;
                                break;
                            }
                        }else{
                            temp[c] -= 1;
                        }
                    }

                    if (checkEnd){
                        break;
                    }
                }

                if (enoughCard){
                    let eye = 0xff;
                    let magicEye = false;
                    //cc.log("card enough----------------------------------");
                    for (let cindex = 0;cindex < cardset.length;cindex++){
                        let card = cardset[cindex];
                        let count = temp[card];
                        //cc.log("find eye card:"+card+" count:"+count+" lai zi:"+lai_zi+ " laizi count:"+temp[lai_zi]);
                        if (count == 2){
                            eye = card;
                            if (lai_zi == card){
                                magicEye = true;
                            }
                        }else if(card != lai_zi && count + temp[lai_zi] == 2){
                            //cc.log("eye found:"+card);
                            eye = card;
                            magicEye = true;
                        }
                    }

                    if (eye != 0xff){
                        for (let i = 0;i < lessKinkItem;i++){
                            let weave = tempItems[i];
                            let cs = weave.cards;
                            //cc.log("check weave:"+cs);
                            for (let j = 0;j < cs.length;j++){
                                if (cs[j] == lai_zi){
                                    //cc.log("calc ting "+weave.weaveKind);
                                    switch(weave.weaveKind){
                                        case this.WIK_LEFT:
                                            ret_sort[weave.centerCard+j] = 1;
                                            break;
                                        case this.WIK_CENTER:
                                            ret_sort[weave.centerCard+j-1] = 1;
                                            break;
                                        case this.WIK_LEFT:
                                            ret_sort[weave.centerCard+j-2] = 1;
                                            break;
                                        case this.WIK_PENG:
                                            ret_sort[weave.centerCard] = 1;
                                            break;
                                    }
                                }
                            }

                            if (magicEye){
                                ret_sort[eye] = 1;
                            }
                        }
                    }
                }

                if (checkIndex[lessKinkItem-1] == tempWeaves.length-1){
                    let isEnd = true;
                    let i = lessKinkItem - 1;
                    for (;i > 0;i--){
                        if (checkIndex[i-1] + 1 != checkIndex[i]){
                            isEnd = false;
                            let newIndex = checkIndex[i-1];
                            for(let j=i-1;j < lessKinkItem;j++){
                                checkIndex[j] = newIndex+j-i+2;
                            }
                            break;
                        }
                    }

                    if (isEnd){
                        break;
                    }
                }else{
                    checkIndex[lessKinkItem-1] += 1;
                }
            } while (true);
        }

        for (let i = 0;i < cardset.length;i++){
            let x = cardset[i];
            if (ret_sort[x] > 0 ){
                ret.push(parseInt(x));
            }
        }

        return ret;
    },

    analyse_qi_xiao_dui:function(logic,count,magic){
        if (13 != count){
            return;
        }
        let cards = [];
        for (let card=0;card < logic.length;card++){
            if (!magic || magic != card){
                if (logic[card] == 1 || logic[card] == 3){
                    cards.push(card);
                }
            }
        }

        if (magic){
            if(cards.length - logic[magic] == 1){
                return cards;
            }else if (logic[magic] - cards.length == 1){
                return magic;
            }
        }else{
            if (cards.length == 1){
                return cards;
            }
        }
    },

    analyse_shi_san_yao:function(logic,count){
        if (13 != count){
            return;
        }

        let card_needed = [0x01,0x09,0x11,0x19,0x21,0x29,0x31,0x32,0x33,0x34,0x41,0x42,0x43];
        let card_has = []
        let eye = null;
        for (let card=0;card < logic.length;card++){
            let found = false;
            for(let i = card_needed.length-1;i>=0;i--){
                if(card == card_needed[i]){
                    card_needed.slice(i,i);
                    card_has.push(card)
                    found = true;
                    break;
                }
            }

            let count = logic[card];

            if(count > 0){
                if(!found){
                    break;
                }

                if(count==2){
                    if (eye){
                        return;
                    }
                    eye = card;                   
                }else if(count != 1){
                    return;
                }
            }
        }

        if (eye != null){
            if(card_needed.length == 1){
                return card_needed;
            }
        }else{
            if (card_needed.length == 0){
                return card_has;
            }
        }
    },

    getTingCards: function(hands,weaves){
        cc.log("ting card func:",JSON.stringify(hands)+" weave:"+JSON.stringify(weaves));

        //封胡了，就不计算ｔｉｎｇ了
        if(this.feng_hu_){
            if (this.feng_hu_.is_feng_hu == 1){
                return;
            }
        }

        let params = JSON.parse(this.roomInfo.params);
        let logic = this.convert2LogicCards(hands);

        if(this.roomInfo.mj_type == 1){
            let magic = null;
            if (params.hong_zhong_lai_zi == 1){
                magic = 0x41;//红中赖子
            }
            if(params.can_qi_xiao_dui == 1){
                let ret = this.analyse_qi_xiao_dui(logic,hands.length,magic);
                if(ret){
                    return ret;
                }
            }
            let tempHands = new Array();
            for (let i =0;i<hands.length;i++){
                tempHands.push(hands[i]);
            }

            if (params.hong_zhong_lai_zi == 1){
                tempHands.push(magic);
            }else{
                magic = this.getPesudoLaiZi();
                tempHands.push(magic);
            }
            
            logic = this.convert2LogicCards(tempHands);
            return this.analyse_hu(logic,tempHands.length,magic);
        }else if(this.roomInfo.mj_type == 2){
            let ret = this.analyse_qi_xiao_dui(logic,hands.length);
            if(ret){
                return ret;
            }          

            if(params.can_shi_san_yao == 1){
                ret = this.analyse_shi_san_yao(logic,hands.length);
                if(ret){
                    return ret;
                }
            }
            let tempHands = new Array();
            for (let i =0;i<hands.length;i++){
                tempHands.push(hands[i]);
            }
            let magic = this.getPesudoLaiZi();
            tempHands.push(magic);         
            logic = this.convert2LogicCards(tempHands);
            return this.analyse_hu(logic,tempHands.length,magic);
        }else if(this.roomInfo.mj_type == 3){
            let ret = this.analyse_qi_xiao_dui(logic,hands.length);
            if(ret){
                return ret;
            }          

            if(params.can_shi_san_yao == 1){
                ret = this.analyse_shi_san_yao(logic,hands.length);
                if(ret){
                    return ret;
                }
            }

            let tempHands = new Array();
            for (let i =0;i<hands.length;i++){
                tempHands.push(hands[i]);
            }
            let magic = this.getPesudoLaiZi();
            tempHands.push(magic);         
            logic = this.convert2LogicCards(tempHands);
            return this.analyse_hu(logic,tempHands.length,magic);
        }
    },

    onEnterRoom: function (msg,isRejoin, myNotify, vote,hu_data) {
        this.roomInfo = msg.roomInfo;
        let selfInfo = msg.selfInfo;
        let othersInfo = msg.othersInfo;
        this.setCardSet(msg.card_set);
        this.usermap.clear();
        this.usermap.set(selfInfo.index, selfInfo);
        this.myIndex = selfInfo.index;

        for (let i = 0; i < othersInfo.length; i++) {
            this.usermap.set(othersInfo[i].index, othersInfo[i]);
        }

        if (isRejoin) {
            cc.director.loadScene('mahjong', () => {
                if (this.view) {
                    this.view.onRejoinRoom(myNotify, vote, hu_data);
                    let tings = cc.mgr.mj.getTingCards(selfInfo.all_cards.cards,msg.selfInfo.all_cards.weaves);
                    this.view.ting.setTing(tings)
                    if (tings){
                        cc.log("rejoin----------------______"+JSON.stringify(tings)+" "+this.ting);
                    }
                }
            });
        }
        else {
            cc.director.loadScene('mahjong', () => {
                if (this.view) {
                    this.view.onJoinRoom();
                    let tings = cc.mgr.mj.getTingCards(selfInfo.all_cards.cards,selfInfo.all_cards.weaves);
                    this.view.ting.setTing(tings)
                    if (tings){
                        cc.log("join----------------______"+JSON.stringify(tings)+" "+this.ting);
                    }
                }
            });
        }
    },

    onChat: function (msg) {
        if (this.view) {
            this.view.onChat(msg);
        }
    },

    onNewPlayerJoinRoom: function (userinfo) {
        this.usermap.set(userinfo.index, userinfo);
        if (this.view) {
            this.view.onNewPlayer(userinfo);
        }
    },

    c2sReady: function () {
        cc.mgr.net.send(NetId.C2S_READY, { niu: 0 });
    },

    onLeaveRoom: function (msg) {
        cc.log('onLeaveRoom..')
        this.deleteUser(msg.index);
        if (this.view) {
            this.view.onLeaveRoom(msg);
        }
        else{
            cc.log('MahjongLogic.629');
        }
    },

    c2sDismiss: function () {
        cc.mgr.net.send(NetId.C2S_APPLY_JIESAN);
    },

    // 出牌
    c2sPlayMJ: function (mjid) {
        cc.mgr.net.send(NetId.C2S_MJ_OUT_CARD, { relevant_card: mjid });
    },

    // 操作
    c2sOperate: function (op, mjid) {
        cc.mgr.net.send(NetId.C2S_MJ_OPERATE_REQUEST, { action: op, relevant_card: mjid });
    },

    //--------------------------------------------------------------------

    showPlayerDetail: function (index, avatar) {
        let user = this.usermap.get(index);
        if (!user) {
            return;
        }

        cc.showPlayerDetail(user.name, user.uid, user.ip, avatar);
    },


    iamHost: function () {
        return this.myIndex == this.roomInfo.host_id;
    },

    isHost: function (index) {
        return index == this.roomInfo.host_id;
    },

    isRoomOwner: function () {
        return this.myIndex == 1;
    },

    deleteUser: function (index) {
        this.usermap.delete(index);
    },

    clear: function () {
        this.roomInfo = null;

        this.myIndex = 0;
        this.usermap.clear();

    },

    /**
     *  重新加入还没结束的房间
     */
    rejoinRoom: function (msg) {
        this.onEnterRoom(msg, true, msg.notify, msg.vote, msg.hu_data);
        //cc.log('rejoinRoom:' + JSON.stringify(msg))
        if (msg.currentCanOutCardFlag == 1) {
            this.turn = this.myIndex;
        }
    },

    onJiesan: function (msg) {
        this.clear();
    },

    //结算
    onGameResult: function (msg) {
        //cc.log("onGameResult:" + this.finalJiesuan_ + " view:" + this.view);
        if (this.finalJiesuan_ && this.view) {
            let bill = cc.find('Canvas/UI/bill').getComponent('MJBill');
            bill.onJiesuan(this.finalJiesuan_);
            this.finalJiesuan_ = null;
        }
    },

    isFinalRound: function () {
        return this.roomInfo.total_ju == this.roomInfo.cur_ju;
    },

    isMyTurn: function () {
        return this.myIndex == this.turn;
    },

    isLaizi: function () {
        let params = JSON.parse(this.roomInfo.params);
        return params.hong_zhong_lai_zi == 1;
    },

    isFangzhu: function (index) {
        return index == 1;
    },
});
