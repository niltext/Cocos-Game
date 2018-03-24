
let PokerCtor = require('PokerCtor');

let pokerType = {
    INVALID: 0,								//错误类型
    SINGLE: 1,								//单牌类型
    ONE_DOUBLE: 2,							//只有一对
    FIVE_TWO_DOUBLE: 3,						//两对牌型
    THREE: 4,								//三张牌型
    FIVE_MIXED_FLUSH_NO_A: 5,				//没A杂顺
    FIVE_MIXED_FLUSH_FIRST_A: 6,			//A在前顺子
    FIVE_MIXED_FLUSH_BACK_A: 7,				//A在后顺子
    FIVE_FLUSH: 8,							//同花五牌
    FIVE_THREE_DEOUBLE: 9,					//三条一对
    FIVE_FOUR_ONE: 10,						//四带一张
    FIVE_STRAIGHT_FLUSH_NO_A: 11,			//没A同花顺
    FIVE_STRAIGHT_FLUSH_FIRST_A: 12,		//A在前同花顺
    FIVE_STRAIGHT_FLUSH_BACK_A: 13,			//A在后同花顺

    //特殊牌型
    THIRTEEN_FLUSH: 26,                      //同花十三水
    THIRTEEN: 25,                            //十三水
    TWELVE_KING: 24,                         //十二皇族
    THREE_STRAIGHTFLUSH: 23,                 //三同花顺
    THREE_BOMB: 22,                          //三炸弹
    ALL_BIG: 21,                        	 //全大
    ALL_SMALL: 20,                       	 //全小
    SAME_COLOR: 19,                      	 //凑一色
    FOUR_THREESAME: 18,                      //四套冲三
    FIVEPAIR_THREE: 17,                   	 //五对冲三
    SIXPAIR: 16,                             //六对半
    THREE_FLUSH: 15,                         //三同花
    THREE_STRAIGHT: 14,                 	 //三顺子
};

const tagAnalyseData = {
    bOneCount: 1,       //单张数目
    bTwoCount: 2,       //两张数目
    bThreeCount: 3,     //三张数目
    bFourCount: 4,      //四张数目
    bFiveCount: 5,      //五张数目
    bOneFirst: 6,       //单牌位置
    bTwoFirst: 7,       //对牌位置
    bThreeFirst: 8,     //三条位置
    bFourFirst: 9,      //四张位置
    bStraight: false,   //是否顺子
};

//牌型大小，同花顺＞铁支＞葫芦＞同花＞顺子＞三条＞两对＞一对＞乌龙
//     0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 0x09, 0x0A, 0x0B, 0x0C, 0x0D,	//方块 A - K
//     0x11, 0x12, 0x13, 0x14, 0x15, 0x16, 0x17, 0x18, 0x19, 0x1A, 0x1B, 0x1C, 0x1D,	//梅花 A - K
//     0x21, 0x22, 0x23, 0x24, 0x25, 0x26, 0x27, 0x28, 0x29, 0x2A, 0x2B, 0x2C, 0x2D,	//红桃 A - K
//     0x31, 0x32, 0x33, 0x34, 0x35, 0x36, 0x37, 0x38, 0x39, 0x3A, 0x3B, 0x3C, 0x3D,	//黑桃 A - K

cc.Class({
    extends: cc.Component,

    properties: {

    },

    // use this for initialization
    onLoad: function () {
        this.ctoType = new PokerCtor();
    },

    //获取扑克类型
    /**
     * @param bCardData 牌数组带原始值
     * @param bCardCount 牌总数
     * @param btSpecialCard 特殊牌数组
     */
    getCardType: function (bCardData, bCardCount, btSpecialCard) {
        if (bCardCount != 3 && bCardCount != 5 && bCardCount != 13) {
            return pokerType.INVALID;
        }

        let analyseData = tagAnalyseData;
        let LCardData = new Array();
        for (let i = 0; i < bCardCount; i++) {
            LCardData[i] = this.ctoType.getCardLogicValue(bCardData[i]);
        }
        this.ctoType.analyseCard(bCardData, bCardCount, analyseData);

        switch (bCardCount) {
            case 3:	//三条类型
                {
                    //单牌类型
                    if (3 == analyseData.bOneCount) return pokerType.SINGLE;

                    //对带一张
                    if (1 == analyseData.bTwoCount && 1 == analyseData.bOneCount) return pokerType.ONE_DOUBLE;

                    //三张牌型
                    if (1 == analyseData.bThreeCount) return pokerType.THREE;

                    //错误类型
                    return pokerType.INVALID;
                }
            case 5:	//五张牌型
                {
                    let flushNoA = false;
                    let flushFirstA = false;
                    let flushBackA = false;

                    //A连在后
                    if (14 == LCardData[0] && 10 == LCardData[4])
                        flushBackA = true;
                    else
                        flushNoA = true;
                    for (let i = 0; i < 4; ++i)
                        if (1 != LCardData[i] - LCardData[i + 1]) {
                            flushBackA = false;
                            flushNoA = false;
                        }
                    //A连在前
                    if (false == flushBackA && false == flushNoA && 14 == LCardData[0]) {
                        flushFirstA = true;
                        for (let i = 1; i < 4; ++i) {
                            if (1 != LCardData[i] - LCardData[i + 1]) {
                                flushFirstA = false;
                            }
                        }
                        if (2 != LCardData[4]) {
                            flushFirstA = false;
                        }
                    }

                    //同花五牌
                    if (false == flushBackA && false == flushNoA && false == flushFirstA) {
                        if (true == analyseData.bStraight) return pokerType.FIVE_FLUSH;
                    }
                    else if (true == flushNoA) {
                        //杂顺类型
                        if (false == analyseData.bStraight) return pokerType.FIVE_MIXED_FLUSH_NO_A;
                        //同花顺牌
                        else return pokerType.FIVE_STRAIGHT_FLUSH_NO_A;
                    }
                    else if (true == flushFirstA) {
                        //杂顺类型
                        if (false == analyseData.bStraight) return pokerType.FIVE_MIXED_FLUSH_FIRST_A;
                        //同花顺牌
                        else return pokerType.FIVE_STRAIGHT_FLUSH_FIRST_A;
                    }
                    else if (true == flushBackA) {
                        //杂顺类型
                        if (false == analyseData.bStraight) return pokerType.FIVE_MIXED_FLUSH_BACK_A;
                        //同花顺牌
                        else return pokerType.FIVE_STRAIGHT_FLUSH_BACK_A;
                    }

                    //四带单张
                    if (1 == analyseData.bFourCount && 1 == analyseData.bOneCount) return pokerType.FIVE_FOUR_ONE;
                    //三条一对
                    if (1 == analyseData.bThreeCount && 1 == analyseData.bTwoCount) return pokerType.FIVE_THREE_DEOUBLE;
                    //三条带单
                    if (1 == analyseData.bThreeCount && 2 == analyseData.bOneCount) return pokerType.THREE;
                    //两对牌型
                    if (2 == analyseData.bTwoCount && 1 == analyseData.bOneCount) return pokerType.FIVE_TWO_DOUBLE;
                    //只有一对
                    if (1 == analyseData.bTwoCount && 3 == analyseData.bOneCount) return pokerType.ONE_DOUBLE;
                    //单牌类型
                    if (5 == analyseData.bOneCount && false == analyseData.bStraight) return pokerType.SINGLE;
                    //错误类型
                    return pokerType.INVALID;
                }
            case 13://13张特殊牌型
                {
                    let twelveKing = false;
                    //同花十三水
                    if (13 == analyseData.bOneCount && true == analyseData.bStraight)
                        return pokerType.THIRTEEN_FLUSH;
                    //十三水
                    if (13 == analyseData.bOneCount)
                        return pokerType.THIRTEEN;
                    //十二皇族
                    twelveKing = true;
                    for (let i = 0; i < 13; i++) {
                        if (LCardData[i] < 11) {
                            twelveKing = false;
                            break;
                        }
                    }
                    if (twelveKing) {
                        return pokerType.TWELVE_KING;
                    }
                    //三同花顺
                    let btCardData = new Array();
                    let rbtCardData = new Array();
                    let LtCardData = new Array();
                    let straightflush1 = false;
                    let straightflush2 = false;
                    let straightflush3 = false;
                    let straightflush = 1;
                    let number = 0;
                    let count1 = 0;
                    let count2 = 0;
                    let count3 = 0;
                    for (let i = 0; i < bCardCount; i++) {
                        LtCardData[i] = this.ctoType.getCardLogicValue(btCardData[i]);
                    }
                    let fCardData = LtCardData[0];
                    let sColor = this.ctoType.getCardColor(btCardData[0]);
                    rbtCardData[number++] = btCardData[0];
                    for (let i = 1; i < 13; i++) {
                        if (fCardData == LtCardData[i] + 1 && sColor == this.ctoType.getCardColor(btCardData[i])) {
                            straightflush++;
                            fCardData = LtCardData[i];
                            rbtCardData[number++] = btCardData[i];
                        }
                        if (fCardData != LtCardData[i] + 1 && sColor == this.ctoType.getCardColor(btCardData[i])) {
                            if (3 == straightflush) {
                                straightflush1 = true;
                                count1 = 3;
                                this.removeCard(rbtCardData, 3, btCardData, 13);
                            }
                            break;
                        }
                        if (5 == straightflush) {
                            straightflush1 = true;
                            count1 = 5;
                            this.removeCard(rbtCardData, 5, btCardData, 13);
                            break;
                        }

                    }
                    if (straightflush1) {
                        straightflush = 1;
                        number = 0;
                        fCardData = LtCardData[0];
                        sColor = this.ctoType.getCardColor(btCardData[0]);
                        rbtCardData[number++] = btCardData[0];
                        for (let i = 1; i < 13 - count1; i++) {
                            if (fCardData == LtCardData[i] + 1 && sColor == this.ctoType.getCardColor(btCardData[i])) {
                                straightflush++;
                                fCardData = LtCardData[i];
                                rbtCardData[number++] = btCardData[i];
                            }
                            if (fCardData != LtCardData[i] + 1 && fCardData != LtCardData[i]) {
                                if (3 == straightflush) {
                                    straightflush1 = true;
                                    count2 = 3;
                                    this.removeCard(rbtCardData, 3, btCardData, 13 - count1);
                                }
                                break;
                            }
                            if (5 == straightflush) {
                                straightflush2 = true;
                                count2 = 5;
                                this.removeCard(rbtCardData, 5, btCardData, 13 - count1);
                                break;
                            }
                        }
                    }
                    if (straightflush2) {
                        straightflush = 1;
                        number = 0;
                        fCardData = LtCardData[0];
                        sColor = this.ctoType.getCardColor(btCardData[0]);
                        rbtCardData[number++] = btCardData[0];
                        for (let i = 1; i < 13 - count1 - count2; i++) {
                            if (fCardData == LtCardData[i] + 1 && sColor == this.ctoType.getCardColor(btCardData[i])) {
                                straightflush++;
                                fCardData = LtCardData[i];
                                rbtCardData[number++] = btCardData[i];
                            }
                            if (fCardData != LtCardData[i] + 1 && fCardData != LtCardData[i]) {
                                if (3 == straightflush) {
                                    straightflush1 = true;
                                    count3 = 3;
                                    this.removeCard(rbtCardData, 3, btCardData, 13 - count1 - count2);
                                }
                                break;
                            }
                            if (5 == straightflush) {
                                straightflush3 = true;
                                count3 = 5;
                                this.removeCard(rbtCardData, 5, btCardData, 13 - count1 - count2);
                                break;
                            }
                        }
                    }
                    if (straightflush1 && straightflush2 && straightflush3 && count1 + count2 + count3 == 13) {
                        return pokerType.THREE_STRAIGHTFLUSH;
                    }
                    //三炸弹
                    if (3 == analyseData.bFourCount) {
                        return pokerType.THREE_BOMB;
                    }
                    //全大
                    let allBig = true;
                    for (let i = 0; i < 13; i++) {
                        if (LCardData[i] < 8) {
                            allBig = false;
                            break;
                        }
                    }
                    if (allBig) {
                        return pokerType.ALL_BIG;
                    }
                    //全小
                    let allSmall = true;
                    for (let i = 0; i < 13; i++) {
                        if (LCardData[i] > 8) {
                            allSmall = false;
                            break;
                        }
                    }
                    if (allSmall) {
                        return pokerType.ALL_SMALL;
                    }
                    //凑一色
                    let flush = 1;
                    sColor = this.ctoType.getCardColor(bCardData[0]);
                    for (let i = 1; i < 13; i++) {
                        if (sColor == this.ctoType.getCardColor(bCardData[i])) {
                            flush++;
                        }
                        else {
                            break;
                        }
                    }
                    if (13 == flush) {
                        return pokerType.SAME_COLOR;
                    }
                    //四套冲三
                    if (4 == analyseData.bThreeCount) {
                        return pokerType.FOUR_THREESAME;
                    }
                    //五对冲三
                    if ((5 == analyseData.bTwoCount && 1 == analyseData.bThreeCount) || (3 == analyseData.bTwoCount && 1 == analyseData.bFourCount && 1 == analyseData.bThreeCount)
                        || (1 == analyseData.bTwoCount && 2 == analyseData.bFourCount && 1 == analyseData.bThreeCount)) {
                        return pokerType.FIVEPAIR_THREE;
                    }
                    //六对半
                    if (6 == analyseData.bTwoCount || (4 == analyseData.bTwoCount && 1 == analyseData.bFourCount) || (2 == analyseData.bTwoCount && 2 == analyseData.bFourCount)
                        || (3 == analyseData.bFourCount)) {
                        return pokerType.SIXPAIR;
                    }
                    //三同花
                    let flush1 = false;
                    let flush2 = false;
                    let flush3 = false;
                    flush = 1;
                    count1 = 0;
                    count2 = 0;
                    count3 = 0;
                    number = 0;
                    rbtCardData[number++] = btCardData[0];
                    sColor = this.ctoType.getCardColor(btCardData[0]);
                    for (let i = 1; i < 13; i++) {
                        if (sColor == this.ctoType.getCardColor(btCardData[i])) {
                            flush++;
                            rbtCardData[number++] = btCardData[i];
                        }
                        if (3 == flush && i == 12) {
                            flush1 = true;
                            count1 = 3;
                            this.removeCard(rbtCardData, 3, btCardData, 13);
                            break;
                        }
                        if (5 == flush) {
                            flush1 = true;
                            count1 = 5;
                            this.removeCard(rbtCardData, 5, btCardData, 13);
                            break;
                        }
                    }
                    if (flush1) {
                        flush = 1;
                        number = 0;
                        rbtCardData[number++] = btCardData[0];
                        sColor = this.ctoType.getCardColor(btCardData[0]);
                        for (let i = 1; i < 13 - count1; i++) {
                            if (sColor == this.ctoType.getCardColor(btCardData[i])) {
                                flush++;
                                rbtCardData[number++] = btCardData[i];
                            }
                            if (3 == flush && i == 13 - count1 - 1 && count1 != 3) {
                                flush2 = true;
                                count2 = 3;
                                this.removeCard(rbtCardData, 3, btCardData, 13 - count1);
                                break;
                            }
                            if (5 == flush) {
                                flush2 = true;
                                count2 = 5;
                                this.removeCard(rbtCardData, 5, btCardData, 13 - count1);
                                break;
                            }
                        }
                    }
                    if (flush2) {
                        flush = 1;
                        number = 0;
                        rbtCardData[number++] = btCardData[0];
                        sColor = this.ctoType.getCardColor(btCardData[0]);
                        for (let i = 1; i < 13 - count1 - count2; i++) {
                            if (sColor == this.ctoType.getCardColor(btCardData[i])) {
                                flush++;
                                rbtCardData[number++] = btCardData[i];
                            }
                            if (3 == flush && i == 13 - count1 - count2 - 1 && count1 != 3 && count2 != 3) {
                                flush3 = true;
                                count3 = 3;
                                this.removeCard(rbtCardData, 3, btCardData, 13 - count1 - count2);
                                break;
                            }
                            if (5 == flush) {
                                flush3 = true;
                                count3 = 5;
                                this.removeCard(rbtCardData, 5, btCardData, 13 - count1 - count2);
                                break;
                            }
                        }
                    }
                    if (flush1 && flush2 && flush3 && count1 + count2 + count3 == 13) {
                        return pokerType.THREE_FLUSH;
                    }
                    //三顺子
                    let nCount = 0;
                    while (nCount < 4) {
                        nCount++;
                        let straight1 = false;
                        let straight2 = false;
                        let straight3 = false;
                        let straight = 1;
                        count1 = 0;
                        count2 = 0;
                        count3 = 0;
                        number = 0;
                        btCardData = bCardData;
                        this.ctoType.sortCardList(btCardData, 13);
                        rbtCardData[number++] = btCardData[0];
                        fCardData = LtCardData[0];
                        for (let i = 1; i < 13; i++) {
                            if (fCardData == LtCardData[i] + 1 || (fCardData == 14 && LtCardData[i] == 5) || (fCardData == 14 && LtCardData[i] == 3)) {
                                straight++;
                                rbtCardData[number++] = btCardData[i];
                                fCardData = LtCardData[i];
                            }
                            else if (fCardData != LtCardData[i]) {
                                if (3 == straight) {
                                    straight1 = true;
                                    count1 = 3;
                                    this.removeCard(rbtCardData, 3, btCardData, 13);
                                    break;
                                }
                                straight = 1;
                                number = 0;
                                fCardData = LtCardData[i];
                                rbtCardData[number++] = btCardData[i];
                            }
                            if (nCount == 0 || nCount == 1) {
                                if (i == 12 && 3 == straight) {
                                    straight1 = true;
                                    count1 = 3;
                                    this.removeCard(rbtCardData, 3, btCardData, 13);
                                    break;

                                }
                            }
                            else if (nCount == 2 || nCount == 3) {
                                if (3 == straight) {
                                    straight1 = true;
                                    count1 = 3;
                                    this.removeCard(rbtCardData, 3, btCardData, 13);
                                    break;
                                }
                            }
                            if (5 == straight) {
                                straight1 = true;
                                count1 = 5;
                                this.removeCard(rbtCardData, 5, btCardData, 13);
                                break;
                            }
                        }
                        if (straight1) {
                            straight = 1;
                            number = 0;
                            this.ctoType.sortCardList(btCardData, 13 - count1);
                            rbtCardData[number++] = btCardData[0];
                            fCardData = LtCardData[0];
                            for (let i = 1; i < 13 - count1; i++) {
                                if (fCardData == LtCardData[i] + 1 || (fCardData == 14 && LtCardData[i] == 5) || (fCardData == 14 && LtCardData[i] == 3)) {
                                    straight++;
                                    rbtCardData[number++] = btCardData[i];
                                    fCardData = LtCardData[i];
                                }
                                else if (fCardData != LtCardData[i]) {
                                    if (3 == straight && count1 != 3) {
                                        straight2 = true;
                                        count2 = 3;
                                        this.removeCard(rbtCardData, 3, btCardData, 13 - count1);
                                        break;
                                    }
                                    straight = 1;
                                    number = 0;
                                    fCardData = LtCardData[i];
                                    rbtCardData[number++] = btCardData[i];
                                }
                                if (nCount == 0 || nCount == 2) {
                                    if (i == 13 - count1 - 1 && 3 == straight && count1 != 3) {
                                        straight2 = true;
                                        count2 = 3;
                                        this.removeCard(rbtCardData, 3, btCardData, 13 - count1);
                                        break;
                                    }
                                }
                                else if (nCount == 1 || nCount == 3) {
                                    if (3 == straight && count1 != 3) {
                                        straight2 = true;
                                        count2 = 3;
                                        this.removeCard(rbtCardData, 3, btCardData, 13 - count1);
                                        break;
                                    }
                                }
                                if (5 == straight) {
                                    straight2 = true;
                                    count2 = 5;
                                    this.removeCard(rbtCardData, 5, btCardData, 13 - count1);
                                    break;
                                }
                            }
                        }
                        if (straight2) {
                            straight = 1;
                            number = 0;
                            this.ctoType.sortCardList(btCardData, 13 - count1 - count2);
                            rbtCardData[number++] = btCardData[0];
                            fCardData = LtCardData[0];
                            for (let i = 1; i < 13 - count1 - count2; i++) {
                                if (fCardData == LtCardData[i] + 1 || (fCardData == 14 && LtCardData[i] == 3) || (fCardData == 14 && LtCardData[i] == 5)) {
                                    straight++;
                                    rbtCardData[number++] = btCardData[i];
                                    fCardData = LtCardData[i];
                                }
                                else if (fCardData != LtCardData[i]) {
                                    if (3 == straight && count1 != 3 && count2 != 3) {
                                        straight3 = true;
                                        count3 = 3;
                                        this.removeCard(rbtCardData, 3, btCardData, 13 - count1 - count2);
                                        break;
                                    }
                                    straight = 1;
                                    number = 0;
                                    fCardData = LtCardData[i];
                                    rbtCardData[number++] = btCardData[i];
                                }
                                if (i == 13 - count1 - count2 - 1 && 3 == straight && count1 != 3 && count2 != 3) {
                                    straight3 = true;
                                    count3 = 3;
                                    this.removeCard(rbtCardData, 3, btCardData, 13 - count1 - count2);
                                    break;
                                }
                                if (5 == straight) {
                                    straight3 = true;
                                    count3 = 5;
                                    this.removeCard(rbtCardData, 5, btCardData, 13 - count1 - count2);
                                    break;
                                }
                            }
                        }
                        if (straight1 && straight2 && straight3 && count1 + count2 + count3 == 13) {
                            return pokerType.THREE_STRAIGHT;
                        }
                    }
                }
                return pokerType.INVALID;
        }
    },
    //比对扑克
    /**
     * @param bCompareWithOther: bool
     * @param bIsDragonCompare: bool
     */
    compareCard: function (bFirstList, bNextList, bFirstCount, bNextCount, bCompareWithOther, bIsDragonCompare) {
        let firstAnalyseData = tagAnalyseData;
        let nextAnalyseData = tagAnalyseData;

        this.ctoType.sortCardList(bFirstList, bFirstCount, enSortCardType.enDescend);
        this.ctoType.sortCardList(bNextList, bNextCount, enSortCardType.enDescend);

        this.ctoType.analyseCard(bFirstList, bFirstCount, firstAnalyseData);
        this.ctoType.analyseCard(bNextList, bNextCount, nextAnalyseData);

        if (bFirstCount != (firstAnalyseData.bOneCount + firstAnalyseData.bTwoCount * 2 + firstAnalyseData.bThreeCount * 3 + firstAnalyseData.bFourCount * 4 + firstAnalyseData.bFiveCount * 5)) {
            return false;
        }
        if (bNextCount != (nextAnalyseData.bOneCount + nextAnalyseData.bTwoCount * 2 + nextAnalyseData.bThreeCount * 3 + nextAnalyseData.bFourCount * 4 + nextAnalyseData.bFiveCount * 5)) {
            return false;
        }

        if (!((bFirstCount == bNextCount) || (bFirstCount != bNextCount && (3 == bFirstCount && 5 == bNextCount || 5 == bFirstCount && 3 == bNextCount)))) {
            return false;
        }

        var bNextType = this.getCardType(bNextList, bNextCount, btCardSpecialData);
        var bFirstType = this.getCardType(bFirstList, bFirstCount, btCardSpecialData);

        let LbNextList = new Array();
        let LbFirstList = new Array();
        for (let i = 0; i < bFirstCount; i++) {
            LbFirstList[i] = this.ctoType.getCardLogicValue(bFirstList[i]);
        }
        for (let i = 0; i < bNextCount; i++) {
            LbNextList[i] = this.ctoType.getCardLogicValue(bNextList[i]);
        }

        if (pokerType.INVALID == bFirstType || pokerType.INVALID == bNextType) {
            return false;
        }

        //头段比较
        if (true == bCompareWithOther) {
            if (3 == bFirstCount) {
                //开始对比
                if (bNextType == bFirstType) {
                    switch (bFirstType) {
                        case pokerType.SINGLE:   //单牌类型
                            {
                                if (bNextList[0] == bFirstList[0]) {
                                    return false;
                                }
                                var bAllSame = true;

                                for (var i = 0; i < 3; ++i) {
                                    if (LbNextList[i] != LbFirstList[i]) {
                                        bAllSame = false;
                                        break;
                                    }

                                    if (true == bAllSame) {
                                        return 2;
                                    }
                                    else {
                                        for (var i = 0; i < 3; ++i) {
                                            if (LbNextList[i] != LbFirstList[i]) {
                                                return LbNextList[i] > LbFirstList[i];
                                            }
                                            return false;
                                        }
                                    }
                                }
                            }
                        case pokerType.ONE_DOUBLE:   //对带一张
                            {
                                if (bNextList[nextAnalyseData.bTwoFirst[0]] == bFirstList[firstAnalyseData.bFirst[0]]) {
                                    return false;
                                }
                                if (LbNextList[nextAnalyseData.bTwoFirst[0]] == LbFirstList[firstAnalyseData.bTwoFirst[0]]) {
                                    if (LbNextList[nextAnalyseData.bOneFirst[0]] != LbFirstList[firstAnalyseData.bOneFirst[0]]) {
                                        return LbNextList[nextAnalyseData.bOneFirst[0]] > LbFirstList[firstAnalyseData.bOneFirst[0]];
                                    }

                                    else {
                                        return 2;
                                    }

                                }
                                else {
                                    return LbNextList[nextAnalyseData.bTwoFirst[0]] > LbFirstList[firstAnalyseData.bTwoFirst[0]];
                                }
                            }
                        case pokerType.THREE:    //三张牌型
                            {
                                if (bNextList[nextAnalyseData.bThreeFirst[0]] == bFirstList[firstAnalyseData.bThreeFirst[0]]) {
                                    return false;
                                }

                                if (LbNextList[nextAnalyseData.bThreeFirst[0]] == LbFirstList[firstAnalyseData.bThreeFirst[0]]) {
                                    return 2;
                                }
                                else {
                                    return LbNextList[nextAnalyseData.bThreeFirst[0]] > LbFirstList[firstAnalyseData.bThreeFirst[0]]; 	//比较数值
                                }
                            }
                    }
                }
                else {
                    return bNextType > bFirstType;
                }
            }
            else if (5 == bFirstCount) {
                //开始对比
                if (bNextType == bFirstType) {
                    switch (bFirstType) {

                        case pokerType.SINGLE:   //单牌类型
                            {
                                if (bNextList[0] == bFirstList[0]) {
                                    return false;
                                }
                                var bAllSame = true;

                                for (var i = 0; i < 5; ++i) {
                                    if (LbNextList[i] != LbFirstList[i]) {
                                        bAllSame = false;
                                        break;
                                    }

                                    if (true == bAllSame) {
                                        return 2;
                                    }
                                    else {
                                        for (var i = 0; i < 3; ++i) {
                                            if (LbNextList[i] != LbFirstList[i]) {
                                                return LbNextList[i] > LbFirstList[i];
                                            }
                                            return false;
                                        }
                                    }
                                }
                            }
                        case pokerType.ONE_DOUBLE:   //对带一张
                            {
                                if (bNextList[nextAnalyseData.bTwoFirst[0]] == bFirstList[firstAnalyseData.bFirst[0]]) {
                                    return false;
                                }
                                if (LbNextList[nextAnalyseData.bTwoFirst[0]] == LbFirstList[firstAnalyseData.bTwoFirst[0]]) {
                                    //对比单张
                                    for (var i = 0; i < 3; ++i) {
                                        if (LbNextList[nextAnalyseData.bOneFirst[i]] != LbFirstList[firstAnalyseData.bOneFirst[i]]) {
                                            return LbNextList[nextAnalyseData.bOneFirst[i]] > LbFirstList[firstAnalyseData.bOneFirst[i]];
                                        }

                                    }
                                    return 2;
                                }
                                else {
                                    return LbNextList[nextAnalyseData.bTwoFirst[0]] > LbFirstList[firstAnalyseData.bTwoFirst[0]];
                                }
                            }
                        case pokerType.FIVE_TWO_DOUBLE:  //两对牌型
                            {
                                if (bNextList[nextAnalyseData.bTwoFirst[0]] == bFirstList[firstAnalyseData.bTwoFirst[0]]) {
                                    return false;
                                }

                                if (LbNextList[nextAnalyseData.bTwoFirst[0]] == LbFirstList[firstAnalyseData.bTwoFirst[0]]) {
                                    if (LbNextList[nextAnalyseData.bTwoFirst[1]] == LbFirstList[firstAnalyseData.bTwoFirst[1]]) {
                                        if (LbNextList[nextAnalyseData.bOneFirst[0]] != LbFirstList[firstAnalyseData.bOneFirst[0]])
                                            return LbNextList[nextAnalyseData.bOneFirst[0]] > LbFirstList[firstAnalyseData.bOneFirst[0]];

                                        return 2;			//比较花色
                                    }
                                    else
                                        return LbNextList[nextAnalyseData.bTwoFirst[1]] > LbFirstList[firstAnalyseData.bTwoFirst[1]]; 	//比较数值
                                }
                                else
                                    return LbNextList[nextAnalyseData.bTwoFirst[0]] > LbFirstList[firstAnalyseData.bTwoFirst[0]]; 	//比较数值
                            }
                        case pokerType.THREE:    //三张牌型
                            {
                                if (bNextList[nextAnalyseData.bThreeFirst[0]] == bFirstList[firstAnalyseData.bThreeFirst[0]]) {
                                    return false;
                                }

                                if (LbNextList[nextAnalyseData.bThreeFirst[0]] == LbFirstList[firstAnalyseData.bThreeFirst[0]]) {
                                    return 2;
                                }
                                else {
                                    return LbNextList[nextAnalyseData.bThreeFirst[0]] > LbFirstList[firstAnalyseData.bThreeFirst[0]]; 	//比较数值
                                }
                            }
                        case pokerType.FIVE_MIXED_FLUSH_FIRST_A:				//A在前顺子
                            {
                                if (bNextList[0] == bFirstList[0]) return false;

                                if (LbNextList[0] == LbFirstList[0])
                                    return 2;			//比较花色
                                else
                                    return LbNextList[0] > LbFirstList[0];	//比较数值
                            }
                        case pokerType.FIVE_MIXED_FLUSH_NO_A:			//没A杂顺
                            {
                                if (bNextList[0] == bFirstList[0]) return false;

                                if (LbNextList[0] == LbFirstList[0])
                                    return 2;			//比较花色
                                else
                                    return LbNextList[0] > LbFirstList[0]; 	//比较数值
                            }
                        case pokerType.FIVE_MIXED_FLUSH_BACK_A:		//A在后顺子
                            {
                                if (bNextList[0] == bFirstList[0]) return false;

                                if (LbNextList[0] == LbFirstList[0])
                                    return 2;			//比较花色
                                else
                                    return LbNextList[0] > LbFirstList[0]; 	//比较数值
                            }
                        case pokerType.FIVE_FLUSH:				//同花五牌
                            {
                                if (bNextList[0] == bFirstList[0]) return false;

                                //比较数值
                                for (var i = 0; i < 5; ++i)
                                    if (LbNextList[i] != LbFirstList[i])
                                        return LbNextList[i] > LbFirstList[i];
                                //比较花色
                                return 2;
                            }
                        case pokerType.FIVE_THREE_DEOUBLE:			//三条一对
                            {
                                if (bNextList[nextAnalyseData.bThreeFirst[0]] == bFirstList[firstAnalyseData.bThreeFirst[0]]) return false;

                                if (LbNextList[nextAnalyseData.bThreeFirst[0]] == LbFirstList[firstAnalyseData.bThreeFirst[0]])
                                    return 2;			//比较花色
                                else
                                    return LbNextList[nextAnalyseData.bThreeFirst[0]] > LbFirstList[firstAnalyseData.bThreeFirst[0]]; 	//比较数值
                            }

                        case pokerType.FIVE_FOUR_ONE:			//四带一张
                            {
                                if (bNextList[nextAnalyseData.bFourFirst[0]] == bFirstList[firstAnalyseData.bFourFirst[0]]) return false;

                                if (LbNextList[nextAnalyseData.bFourFirst[0]] == LbFirstList[firstAnalyseData.bFourFirst[0]])
                                    return 2;			//比较花色
                                else
                                    return LbNextList[nextAnalyseData.bFourFirst[0]] > LbFirstList[firstAnalyseData.bFourFirst[0]];	//比较数值
                            }
                        case pokerType.FIVE_STRAIGHT_FLUSH_NO_A:   //没A同花顺
                        case pokerType.FIVE_STRAIGHT_FLUSH_FIRST_A://A在前同花顺
                        case pokerType.FIVE_STRAIGHT_FLUSH_BACK_A: //A在后同花顺
                            {
                                if (bNextList[0] == bFirstList[0]) return false;

                                //比较数值
                                for (var i = 0; i < 5; ++i)
                                    if (LbNextList[i] != LbFirstList[i])
                                        return LbNextList[i] > LbFirstList[i];

                                //比较花色
                                return 2;

                            }
                        default:
                            {
                                return false;
                            }
                    }
                }
                else {
                    return bNextType > bFirstType;
                }
            }
            else {
                if (bNextType == bFirstType) {
                    switch (bFirstType) {
                        case pokerType.THIRTEEN_FLUSH:
                            {
                                // return 2;
                                return false;
                            }
                        case pokerType.TWELVE_KING:
                            {
                                var bAllSame = true;
                                for (var i = 0; i < 13; i++) {
                                    if (LbNextList[i] != LbFirstList[i]) {
                                        bAllSame = false;
                                        return LbNextList[i] > LbFirstList[i];
                                    }
                                }
                                if (bAllSame) {
                                    return 2;
                                }
                                return false;
                            }
                        case pokerType.THREE_STRAIGHTFLUSH:
                            {
                                var bAllSame = true;
                                for (var i = 0; i < 13; i++) {
                                    if (LbNextList[i] != LbFirstList[i]) {
                                        bAllSame = false;
                                        return LbNextList[i] > LbFirstList[i];
                                    }
                                }
                                if (bAllSame) {
                                    return 2;
                                }
                                return false;
                            }
                        case pokerType.THREE_BOMB:
                            {
                                if (bNextList[nextAnalyseData.bFourFirst[0]] == bFirstList[firstAnalyseData.bFourFirst[0]]) {
                                    return false;
                                }

                                if (LbNextList[nextAnalyseData.bFourFirst[0]] == LbFirstList[firstAnalyseData.bFourFirst[0]]) {
                                    if (LbNextList[nextAnalyseData.bFourFirst[1]] == LbFirstList[firstAnalyseData.bFourFirst[1]]) {
                                        if (LbNextList[nextAnalyseData.bFourFirst[2]] == LbFirstList[firstAnalyseData.bFourFirst[2]]) {
                                            if (LbNextList[nextAnalyseData.bOneFirst[0]] == LbFirstList[nextAnalyseData.bOneFirst[0]]) {
                                                return false;
                                            }
                                            else {
                                                return LbNextList[nextAnalyseData.bOneFirst[0]] > LbFirstList[firstAnalyseData.bOneFirst[0]];
                                            }
                                        }
                                        else {
                                            return LbNextList[nextAnalyseData.bFourFirst[2]] > LbFirstList[firstAnalyseData.bFourFirst[2]];
                                        }
                                    } else {
                                        return LbNextList[nextAnalyseData.bFourFirst[1]] > LbFirstList[firstAnalyseData.bFourFirst[1]];
                                    }
                                }
                                else {
                                    return LbNextList[nextAnalyseData.bFourFirst[0]] > LbFirstList[firstAnalyseData.bFourFirst[0]];
                                }
                            }
                        case pokerType.ALL_BIG:
                            {
                                var bAllSame = true;
                                for (var i = 0; i < 13; i++) {
                                    if (LbNextList[i] != LbFirstList[i]) {
                                        bAllSame = false;
                                        return LbNextList[i] > LbFirstList[i];
                                    }
                                }
                                if (bAllSame) {
                                    return 2;
                                }
                                return false;
                            }
                        case pokerType.ALL_SMALL:
                            {
                                var bAllSame = true;
                                for (var i = 0; i < 13; i++) {
                                    if (LbNextList[i] != LbFirstList[i]) {
                                        bAllSame = false;
                                        return LbNextList[i] > LbFirstList[i];
                                    }
                                }
                                if (bAllSame) {
                                    return 2;
                                }
                                return false;
                            }
                        case pokerType.SAME_COLOR:
                            {
                                var bAllSame = true;
                                for (var i = 0; i < 13; i++) {
                                    if (LbNextList[i] != LbFirstList[i]) {
                                        bAllSame = false;
                                        return LbNextList[i] > LbFirstList[i];
                                    }
                                }
                                if (bAllSame) {
                                    return 2;
                                }
                                return false;
                            }
                        case pokerType.FOUR_THREESAME:
                            {
                                if (bNextList[nextAnalyseData.bThreeFirst[0]] == bFirstList[firstAnalyseData.bThreeFirst[0]]) {
                                    return false;
                                }

                                if (bNextList[nextAnalyseData.bThreeFirst[0]] == bFirstList[firstAnalyseData.bThreeFirst[0]]) {
                                    if (LbNextList[nextAnalyseData.bThreeFirst[1]] == LbFirstList[firstAnalyseData.bThreeFirst[1]]) {
                                        if (LbNextList[nextAnalyseData.bThreeFirst[2]] == LbFirstList[firstAnalyseData.bThreeFirst[2]]) {
                                            if (LbNextList[nextAnalyseData.bThreeFirst[3]] == LbFirstList[firstAnalyseData.bThreeFirst[3]]) {
                                                if (LbNextList[nextAnalyseData.bOneFirst[0]] == LbFirstList[firstAnalyseData.bOneFirst[0]]) {
                                                    return 2;
                                                }
                                                else {
                                                    return LbNextList[nextAnalyseData.bOneFirst[0]] > LbFirstList[firstAnalyseData.bOneFirst[0]];
                                                }
                                            }
                                            else {
                                                return LbNextList[nextAnalyseData.bThreeFirst[3]] > LbFirstList[firstAnalyseData.bThreeFirst[3]];
                                            }
                                        }
                                        else {
                                            return LbNextList[nextAnalyseData.bThreeFirst[2]] > LbFirstList[firstAnalyseData.bThreeFirst[2]];
                                        }
                                    }
                                    else {
                                        return LbNextList[nextAnalyseData.bThreeFirst[1]] == LbFirstList[firstAnalyseData.bThreeFirst[1]];
                                    }
                                }
                                else {
                                    return LbNextList[nextAnalyseData.bThreeFirst[0]] > LbFirstList[firstAnalyseData.bThreeFirst[0]];
                                }
                            }
                        case pokerType.FIVEPAIR_THREE:
                            {
                                if (bNextList[nextAnalyseData.bTwoFirst[0]] == bFirstList[firstAnalyseData.bTwoFirst[0]]) {
                                    return false;
                                }

                                if (bNextList[nextAnalyseData.bTwoFirst[0]] == bFirstList[firstAnalyseData.bTwoFirst[0]]) {
                                    if (LbNextList[nextAnalyseData.bTwoFirst[1]] == LbFirstList[firstAnalyseData.bTwoFirst[1]]) {
                                        if (LbNextList[nextAnalyseData.bTwoFirst[2]] == LbFirstList[firstAnalyseData.bTwoFirst[2]]) {
                                            if (LbNextList[nextAnalyseData.bTwoFirst[3]] == LbFirstList[firstAnalyseData.bTwoFirst[3]]) {
                                                if (LbNextList[nextAnalyseData.bTwoFirst[4]] == LbFirstList[firstAnalyseData.bTwoFirst[4]]) {
                                                    if (LbNextList[nextAnalyseData.bOneFirst[0]] == LbFirstList[firstAnalyseData.bOneFirst[0]]) {
                                                        return 2;
                                                    }
                                                    else {
                                                        return LbNextList[nextAnalyseData.bOneFirst[0]] > LbFirstList[firstAnalyseData.bOneFirst[0]];
                                                    }
                                                }
                                                else {
                                                    return LbNextList[nextAnalyseData.bTwoFirst[4]] > LbFirstList[firstAnalyseData.bTwoFirst[4]];
                                                }
                                            }
                                            else {
                                                return LbNextList[nextAnalyseData.bTwoFirst[3]] > LbFirstList[firstAnalyseData.bTwoFirst[3]];
                                            }
                                        }
                                        else {
                                            return LbNextList[nextAnalyseData.bTwoFirst[2]] > LbFirstList[firstAnalyseData.bTwoFirst[2]];
                                        }
                                    }
                                    else {
                                        return LbNextList[nextAnalyseData.bTwoFirst[1]] == LbFirstList[firstAnalyseData.bTwoFirst[1]];
                                    }
                                }
                                else {
                                    return LbNextList[nextAnalyseData.bTwoFirst[0]] > LbFirstList[firstAnalyseData.bTwoFirst[0]];
                                }
                            }
                        case pokerType.SIXPAIR:
                            {
                                if (bNextList[nextAnalyseData.bTwoFirst[0]] == bFirstList[firstAnalyseData.bTwoFirst[0]]) {
                                    return false;
                                }

                                if (bNextList[nextAnalyseData.bTwoFirst[0]] == bFirstList[firstAnalyseData.bTwoFirst[0]]) {
                                    if (LbNextList[nextAnalyseData.bTwoFirst[1]] == LbFirstList[firstAnalyseData.bTwoFirst[1]]) {
                                        if (LbNextList[nextAnalyseData.bTwoFirst[2]] == LbFirstList[firstAnalyseData.bTwoFirst[2]]) {
                                            if (LbNextList[nextAnalyseData.bTwoFirst[3]] == LbFirstList[firstAnalyseData.bTwoFirst[3]]) {
                                                if (LbNextList[nextAnalyseData.bTwoFirst[4]] == LbFirstList[firstAnalyseData.bTwoFirst[4]]) {
                                                    if (LbNextList[nextAnalyseData.bTwoFirst[5]] == LbFirstList[firstAnalyseData.bTwoFirst[5]]) {
                                                        if (LbNextList[nextAnalyseData.bOneFirst[0]] == LbFirstList[firstAnalyseData.bOneFirst[0]]) {
                                                            return 2;
                                                        }
                                                        else {
                                                            return LbNextList[nextAnalyseData.bOneFirst[0]] > LbFirstList[firstAnalyseData.bOneFirst[0]];
                                                        }
                                                    }
                                                    else {
                                                        return LbNextList[nextAnalyseData.bTwoFirst[5]] > LbFirstList[firstAnalyseData.bTwoFirst[5]];
                                                    }

                                                }
                                                else {
                                                    return LbNextList[nextAnalyseData.bTwoFirst[4]] > LbFirstList[firstAnalyseData.bTwoFirst[4]];
                                                }
                                            }
                                            else {
                                                return LbNextList[nextAnalyseData.bTwoFirst[3]] > LbFirstList[firstAnalyseData.bTwoFirst[3]];
                                            }
                                        }
                                        else {
                                            return LbNextList[nextAnalyseData.bTwoFirst[2]] > LbFirstList[firstAnalyseData.bTwoFirst[2]];
                                        }
                                    }
                                    else {
                                        return LbNextList[nextAnalyseData.bTwoFirst[1]] == LbFirstList[firstAnalyseData.bTwoFirst[1]];
                                    }
                                }
                                else {
                                    return LbNextList[nextAnalyseData.bTwoFirst[0]] > LbFirstList[firstAnalyseData.bTwoFirst[0]];
                                }
                            }
                        case pokerType.THREE_FLUSH:
                            {
                                var bAllSame = true;
                                for (var i = 0; i < 13; i++) {
                                    if (LbNextList[i] != LbFirstList[i]) {
                                        bAllSame = false;
                                        return LbNextList[i] > LbFirstList[i];
                                    }
                                }
                                if (bAllSame) {
                                    return 2;
                                }
                                return false;
                            }
                        case pokerType.THREE_STRAIGHT:
                            {
                                var bAllSame = true;
                                for (var i = 0; i < 13; i++) {
                                    if (LbNextList[i] != LbFirstList[i]) {
                                        bAllSame = false;
                                        return LbNextList[i] > LbFirstList[i];
                                    }
                                }
                                if (bAllSame) {
                                    return 2;
                                }
                                return false;
                            }
                    }
                }
                else {
                    return bNextType > bFirstType;
                }
            }
        }
        else {
            //开始对比
            if (bNextType == bFirstType) {
                switch (bFirstType) {
                    case pokerType.SINGLE:
                        {
                            if (bNextList[0] == bFirstList[0]) {
                                return false;
                            }

                            var bAllSame = true;

                            for (var i = 0; i < 3; ++i) {
                                if (LbNextList[i] != LbFirstList[i]) {
                                    bAllSame = false;
                                    break;
                                }
                            }
                            if (bAllSame == true) {
                                if (!bIsDragonCompare) {
                                    return false;
                                }
                                else {
                                    return true;
                                }
                            }
                            else {
                                for (var i = 0; i < 3; ++i) {
                                    if (LbNextList[i] != LbFirstList[i]) {
                                        return LbNextList[i] > LbFirstList[i];
                                    }
                                }
                            }
                            return bNextCount < bFirstCount;
                        }
                    case pokerType.ONE_DOUBLE:
                        {
                            if (bNextList[nextAnalyseData.bTwoFirst[0]] == bFirstList[firstAnalyseData.bTwoFirst[0]]) {
                                return false;
                            }
                            if (LbNextList[nextAnalyseData.bTwoFirst[0]] == LbFirstList[firstAnalyseData.bTwoFirst[0]]) {
                                if (LbNextList[nextAnalyseData.bOneFirst[0]] != LbFirstList[firstAnalyseData.bOneFirst[0]])
                                    return LbNextList[nextAnalyseData.bOneFirst[0]] > LbFirstList[firstAnalyseData.bOneFirst[0]];

                                if (!bIsDragonCompare) {
                                    return false;			//比较花色
                                }
                                else {
                                    return true;
                                }
                            }
                            else {
                                return LbNextList[nextAnalyseData.bTwoFirst[0]] > LbFirstList[firstAnalyseData.bTwoFirst[0]]; 	//比较数值
                            }
                        }
                    case pokerType.FIVE_TWO_DOUBLE:
                        {
                            if (bNextList[nextAnalyseData.bTwoFirst[0]] == bFirstList[firstAnalyseData.bTwoFirst[0]]) {
                                return false;
                            }
                            if (LbNextList[nextAnalyseData.bTwoFirst[0]] == LbFirstList[firstAnalyseData.bTwoFirst[0]]) {
                                if (LbNextList[nextAnalyseData.bTwoFirst[1]] != LbFirstList[firstAnalyseData.bTwoFirst[1]]) {
                                    //对比单牌
                                    if (LbNextList[nextAnalyseData.bOneFirst[0]] != LbFirstList[firstAnalyseData.bOneFirst[0]]) {
                                        return LbNextList[nextAnalyseData.bOneFirst[0]] > LbFirstList[firstAnalyseData.bOneFirst[0]];
                                    }
                                    if (!bIsDragonCompare) {
                                        return false;			//比较花色
                                    }
                                    else {
                                        return true;
                                    }
                                }
                                else {
                                    return LbNextList[nextAnalyseData.bTwoFirst[1]] > LbFirstList[firstAnalyseData.bTwoFirst[1]]; 	//比较数值
                                }

                            }
                            else {
                                return LbNextList[nextAnalyseData.bTwoFirst[0]] > LbFirstList[firstAnalyseData.bTwoFirst[0]]; 	//比较数值
                            }
                        }
                    case pokerType.THREE:
                        {
                            if (bNextList[nextAnalyseData.bThreeFirst[0]] == bFirstList[firstAnalyseData.bThreeFirst[0]]) {
                                return false;
                            }
                            if (LbNextList[nextAnalyseData.bThreeFirst[0]] == LbFirstList[firstAnalyseData.bThreeFirst[0]]) {
                                if (!bIsDragonCompare) {
                                    return false;			//比较花色
                                }
                                else {
                                    return true;
                                }
                            }
                            else {
                                return LbNextList[nextAnalyseData.bThreeFirst[0]] > LbFirstList[firstAnalyseData.bThreeFirst[0]]; 	//比较数值
                            }
                        }
                    case pokerType.FIVE_MIXED_FLUSH_FIRST_A:				//A在前顺子
                        {

                            if (bNextList[0] == bFirstList[0]) return false;

                            if (LbNextList[0] == LbFirstList[0]) {
                                if (!bIsDragonCompare) {
                                    return false;			//比较花色
                                }
                                else {
                                    return true;
                                }
                            }
                            else
                                return LbNextList[0] > LbFirstList[0];	//比较数值
                        }
                    case pokerType.FIVE_MIXED_FLUSH_NO_A:			//没A杂顺
                        {
                            if (bNextList[0] == bFirstList[0]) return false;

                            if (LbNextList[0] == LbFirstList[0]) {
                                if (!bIsDragonCompare) {
                                    return false;			//比较花色
                                }
                                else {
                                    return true;
                                }
                            }
                            else
                                return LbNextList[0] > LbFirstList[0]; 	//比较数值
                        }
                    case pokerType.FIVE_MIXED_FLUSH_BACK_A:		//A在后顺子
                        {
                            if (bNextList[0] == bFirstList[0]) return false;

                            if (LbNextList[0] == LbFirstList[0]) {
                                if (!bIsDragonCompare) {
                                    return false;			//比较花色
                                }
                                else {
                                    return true;
                                }
                            }
                            else
                                return LbNextList[0] > LbFirstList[0]; 	//比较数值
                        }

                    case pokerType.FIVE_FLUSH:				//同花五牌
                        {
                            if (bNextList[0] == bFirstList[0]) return false;

                            //比较数值
                            for (var i = 0; i < 5; ++i)
                                if (LbNextList[i] != LbFirstList[i])
                                    return LbNextList[i] > LbFirstList[i];

                            if (!bIsDragonCompare) {
                                //比较花色
                                return false;
                            }
                            else {
                                return true;
                            }
                        }

                    case pokerType.FIVE_THREE_DEOUBLE:			//三条一对
                        {
                            if (bNextList[nextAnalyseData.bThreeFirst[0]] == bFirstList[firstAnalyseData.bThreeFirst[0]]) return false;

                            if (LbNextList[nextAnalyseData.bThreeFirst[0]] == LbFirstList[firstAnalyseData.bThreeFirst[0]]) {
                                if (!bIsDragonCompare) {
                                    return false;			//比较花色
                                }
                                else {
                                    return true;
                                }
                            }
                            else
                                return LbNextList[nextAnalyseData.bThreeFirst[0]] > LbFirstList[firstAnalyseData.bThreeFirst[0]]; 	//比较数值
                        }

                    case pokerType.FIVE_FOUR_ONE:			//四带一张
                        {
                            if (bNextList[nextAnalyseData.bFourFirst[0]] == bFirstList[firstAnalyseData.bFourFirst[0]]) return false;

                            if (LbNextList[nextAnalyseData.bFourFirst[0]] == LbFirstList[firstAnalyseData.bFourFirst[0]]) {
                                if (!bIsDragonCompare) {
                                    return false;			//比较花色
                                }
                                else {
                                    return true;
                                }
                            }
                            else
                                return LbNextList[nextAnalyseData.bFourFirst[0]] > LbFirstList[firstAnalyseData.bFourFirst[0]];	//比较数值

                        }
                    case pokerType.FIVE_STRAIGHT_FLUSH_NO_A:   //没A同花顺
                    case pokerType.FIVE_STRAIGHT_FLUSH_FIRST_A://A在前同花顺
                    case pokerType.FIVE_STRAIGHT_FLUSH_BACK_A: //A在后同花顺
                        {
                            if (bNextList[0] == bFirstList[0]) return false;

                            //比较数值
                            for (var i = 0; i < 5; ++i)
                                if (LbNextList[i] != LbFirstList[i])
                                    return LbNextList[i] > LbFirstList[i];

                            if (!bIsDragonCompare) {
                                //比较花色
                                return false/*this.ctoType.getCardColor(bNextList[0]) > this.ctoType.getCardColor(bFirstList[0])*/;
                            }
                            else {
                                return true;
                            }
                        }
                    default:
                        return false;
                }
            }
            else {
                return bNextType > bFirstType;
            }
        }
        return false;
    },

    //删除扑克
    removeCard: function (bremoveCard, bRemoveCount, bCardData, bCardCount) {
        if (bRemoveCount > bCardCount) {
            return;
        }
        else {
            var bDeleteCount = 0;
            var bTempCardData = new Array();
            if (bCardCount > this.ctoType.getCardCount(bTempCardData)) {
                return false;
            }
            bTempCardData = bCardData;

            //置零扑克
            for (var i = 0; i < bRemoveCount; i++) {
                for (var j = 0; j < bCardCount; j++) {
                    if (bremoveCard[i] == bTempCardData[j]) {
                        bDeleteCount++;
                        bTempCardData[j] = 0;
                        break;
                    }
                }
            }
            if (bDeleteCount != bRemoveCount) {
                return false;
            }

            //清理扑克
            var bCardPos = 0;
            for (var i = 0; i < bCardCount; i++) {
                if (bTempCardData[i] != 0) {
                    bCardData[bCardPos++] = bTempCardData[i];
                }
            }
            return true;
        }
    },
});
