let PokerLogic = require('PokerLogic');
let mask = {
    //数值掩码
    LOGIC_MASK_COLOR: 0xF0,						//花色掩码
    LOGIC_MASK_VALUE: 0x0F,						//数值掩码
};

// 排列类型
let enSortType = {
    enDescend: 1,					//降序类型 
    enAscend: 2,					//升序类型
    enColor: 3,                     //花色类型
};

let tagAnalyseType = {
    onePare: false,        //有一对
    twoPare: false,        //有两对
    threeSame: false,      //有三条
    straight: false,       //有顺子
    flush: false,          //有同花
    gourd: false,          //有葫芦
    fourSame: false,       //有铁支
    straightFlush: false,  //有同花顺
    specialCard: false,    //有特殊牌

    //符合类型
    match: [],

    //serial number
    snOnePare: [],        //一对的序号
    snTwoPare: [],        //两对的序号
    snThreeSame: [],      //三条的序号
    snStraight: [],       //顺子的序号
    snFlush: [],          //同花的序号
    snGourd: [],          //葫芦的序号
    snFourSame: [],       //铁支的序号
    snStraightFlush: [],  //同花顺的序号

    //amount
    amOnePare: 0,        //一对的数量
    amTwoPare: 0,        //两对的数量
    amThreeSame: 0,      //三条的数量
    amStraight: 0,       //顺子的数量
    amFlush: 0,          //同花的数量
    amGourd: 0,          //葫芦的数量
    amFourSame: 0,       //铁支的数量
    amStraightFlush: 0,  //同花顺的数量
};

cc.Class({
    extends: cc.Component,

    properties: {

    },

    // use this for initialization
    onLoad: function () {
        this.pokerLogic = new PokerLogic();
    },

    //获取牌数值
    getCardValue: function (bCardData) {
        return bCardData & mask.LOGIC_MASK_VALUE;
    },

    //获取花色
    getCardColor: function (bCardData) {
        return bCardData & mask.LOGIC_MASK_COLOR;
    },

    //获取牌总数
    getCardCount: function (bCardData) {
        var iNumber = 0;
        if (0 == this.getCardLogicValue(bCardData[1]) && 0 == this.getCardLogicValue(bCardData[2])) {
            return 0;
        }
        else {
            for (var i = 0; i < 5; i++) {
                if (this.getCardLogicValue(bCardData[i]) > 0) {
                    iNumber++;
                }
                else {
                    break;
                }
            }
        }
        return iNumber;
    },

    //获取逻辑数值
    getCardLogicValue: function (bCardData) {
        let bCardValue = this.getCardValue(bCardData);
        return (bCardValue == 1) ? (bCardValue + 13) : bCardValue;
    },

    //分析扑克的单张，一对及多张(<=4)的数目，并记录下每种类型扑克的第一张牌(也就是最大的牌)位置以便比较大小，同时判断同一花色是否有五张
    analyseCard: function (bCardDataList, bCardCount, analyseData) {

        var bCardData = new Array();

        bCardData = this.sortCardList(bCardDataList, bCardCount, enSortType.enDescend);
        var bSameCount = 1;
        var bCardValueTemp = 0;
        var bSameColorCount = 1;
        var bFirstCardIndex = 0;  //记录下标

        var bLogicValue = this.getCardLogicValue(bCardData[0]);
        var bCardColor = this.getCardColor(bCardData[0]);

        if (!(3 == bCardCount || 5 == bCardCount || 13 == bCardCount)) {
            cc.error('牌型不对');
        }

        //扑克分析
        for (var i = 1; i < bCardCount; i++) {
            //获取扑克
            bCardValueTemp = this.getCardLogicValue(bCardData[i]);
            if (bCardValueTemp == bLogicValue) {
                bSameCount++;
            }
            //保存结果
            if ((bCardValueTemp != bLogicValue) || (i == (bCardCount - 1))) {
                switch (bSameCount) {
                    case 1:		//一张
                        break;
                    case 2:		//两张
                        {
                            analyseData.bTwoFirst[analyseData.bTwoCount] = bFirstCardIndex;
                            analyseData.bTwoCount++;
                            break;
                        }
                    case 3:		//三张
                        {
                            analyseData.bThreeFirst[analyseData.bThreeCount] = bFirstCardIndex;
                            analyseData.bThreeCount++;
                            break;
                        }
                    case 4:		//四张
                        {
                            analyseData.bFourFirst[analyseData.bFourCount] = bFirstCardIndex;
                            analyseData.bFourCount++;
                            break;
                        }
                    default:
                        cc.error('错误扑克');
                        break;
                }
            }

            //设置计数
            if (bCardValueTemp != bLogicValue) {
                if (bSameCount == 1) {
                    if (i != bCardCount - 1) {
                        analyseData.bOneFirst[analyseData.bOneCount] = bFirstCardIndex;
                        analyseData.bOneCount++;
                    }
                    else {
                        analyseData.bOneFirst[analyseData.bOneCount] = bFirstCardIndex;
                        analyseData.bOneCount++;
                        analyseData.bOneFirst[analyseData.bOneCount] = i;
                        analyseData.bOneCount++;
                    }
                }
                else {
                    if (i == bCardCount - 1) {
                        analyseData.bOneFirst[analyseData.bOneCount] = i;
                        analyseData.bOneCount++;
                    }
                }
                bSameCount = 1;
                bLogicValue = bCardValueTemp;
                bFirstCardIndex = i;
            }
            if (this.getCardColor(bCardData[i]) != bCardColor) {
                bSameColorCount = 1;
            }
            else {
                bSameColorCount++;
            }
        }

        //是否同花
        this.pokerLogic.analyseData.bStraight = (bCardCount == bSameColorCount) ? true : false;
        return;
    },

    analyseCardData: function (cbCardData, cbCardCount, analyseResult) {
        for (var i = 0; i < cbCardCount; i++) {
            //变量定义
            var cbSameCount = 1;
            var cbCardValueTemp = 0;
            var cbLogicValue = this.getCardLogicValue(cbCardData[i]);

            //搜索同牌
            for (var j = i + 1; j < cbCardCount; j++) {
                //获取扑克
                if (this.getCardLogicValue(cbCardData[j]) != cbLogicValue) {
                    break;
                }
                //设置变量
                cbSameCount++;
            }
            //设置结果
            switch (cbSameCount) {
                case 1:     //单张
                    {
                        var cbIndex = analyseResult.cbSignedCount++;
                        analyseResult.cbSignedCardData[cbIndex * cbSameCount] = cbCardData[i];
                        break;
                    }
                case 2:		//两张
                    {
                        var cbIndex = analyseResult.cbDoubleCount++;
                        analyseResult.cbDoubleCardData[cbIndex * cbSameCount] = cbCardData[i];
                        analyseResult.cbDoubleCardData[cbIndex * cbSameCount + 1] = cbCardData[i + 1];
                        break;
                    }
                case 3:		//三张
                    {
                        var cbIndex = analyseResult.cbThreeCount++;
                        analyseResult.cbThreeCardData[cbIndex * cbSameCount] = cbCardData[i];
                        analyseResult.cbThreeCardData[cbIndex * cbSameCount + 1] = cbCardData[i + 1];
                        analyseResult.cbThreeCardData[cbIndex * cbSameCount + 2] = cbCardData[i + 2];
                        break;
                    }
                case 4:		//四张
                    {
                        var cbIndex = analyseResult.cbFourCount++;
                        analyseResult.cbFourCardData[cbIndex * cbSameCount] = cbCardData[i];
                        analyseResult.cbFourCardData[cbIndex * cbSameCount + 1] = cbCardData[i + 1];
                        analyseResult.cbFourCardData[cbIndex * cbSameCount + 2] = cbCardData[i + 2];
                        analyseResult.cbFourCardData[cbIndex * cbSameCount + 3] = cbCardData[i + 3];
                        break;
                    }
            }
            //设置索引
            i += cbSameCount - 1;
        }
        return;
    },

    //排序扑克
    sortCardList: function (bCardData, bCardCount, sortCardType) {

        var bLogicValue = new Array();
        if (bCardCount < 1 || bCardCount > 13) {
            return;
        }
        for (var i = 0; i < bCardCount; i++) {
            bLogicValue[i] = this.getCardLogicValue(bCardData[i]);
        }

        if (enSortType.enDescend == sortCardType) {

            var bSorted = true;
            var bTempData;
            var bLast = bCardCount - 1;
            // var m_bCardCount = 1;
            do {
                bSorted = true;
                for (let i = 0; i < bLast; i++) {
                    if ((bLogicValue[i] < bLogicValue[i + 1]) ||
                        ((bLogicValue[i] == bLogicValue[i + 1]) && (bCardData[i] < bCardData[i + 1]))) {
                        //交换位置
                        bTempData = bCardData[i];
                        bCardData[i] = bCardData[i + 1];
                        bCardData[i + 1] = bTempData;
                        bTempData = bLogicValue[i];
                        bLogicValue[i] = bLogicValue[i + 1];
                        bLogicValue[i + 1] = bTempData;
                        bSorted = false;
                    }
                }
                bLast--;
            } while (bSorted == false);
        }
        else if (enSortType.enAscend == sortCardType) {

            var bSorted = true;
            var bTempData;
            var bLast = bCardCount - 1;
            //排序操作
            do {
                bSorted = true;
                for (let i = 0; i < bLast; i++) {
                    if ((bLogicValue[i] > bLogicValue[i + 1]) ||
                        ((bLogicValue[i] == bLogicValue[i + 1]) && (bCardData[i] > bCardData[i + 1]))) {
                        //交换位置
                        bTempData = bCardData[i];
                        bCardData[i] = bCardData[i + 1];
                        bCardData[i + 1] = bTempData;
                        bTempData = bLogicValue[i];
                        bLogicValue[i] = bLogicValue[i + 1];
                        bLogicValue[i + 1] = bTempData;
                        bSorted = false;
                    }
                }
                bLast--;
            } while (bSorted == false);
        }
        else if (enSortType.enColor == sortCardType) {

            var bSorted = true;
            var bTempData;
            var bLast = bCardCount - 1;
            //排序操作
            var bColor = new Array();
            for (var i = 0; i < bCardCount; i++) {
                bColor[i] = this.getCardColor(bCardData[i]);
            }
            do {
                bSorted = true;
                for (var i = 0; i < bLast; i++) {
                    if ((bColor[i] < bColor[i + 1]) ||
                        ((bColor[i] == bColor[i + 1]) && (bLogicValue[i]) < bLogicValue[i + 1])) {
                        //交换位置
                        bTempData = bCardData[i];
                        bCardData[i] = bCardData[i + 1];
                        bCardData[i + 1] = bTempData;
                        bTempData = bColor[i];
                        bColor[i] = bColor[i + 1];
                        bColor[i + 1] = bTempData;
                        bSorted = false;
                    }
                }
                bLast--;
            } while (bSorted == false);
        }
        return bCardData;
    },

    //点数是否相同(同一道若点数相同,则视为大小相同)
    isSameCardData: function (firstCard, nextCard, firstCount, nextCount) {
        if (nextCount != firstCount) {
            return false;
        }
        for (var i = 0; i < firstCount; i++) {
            if (firstCard[i] != nextCard[i]) {
                return false;
            }
        }
        return true;
    },

    //获取牌类型
    /**
     * @param bCardData 牌数组带原始值
     * @param bCardCount 牌总数
     */
    getType: function (bCardData, bCardCount) {
        let type = tagAnalyseType;

        let cardData = new Array();
        cardData = this.sortCardList(bCardData, bCardCount, enSortType.enDescend);

        let index = new Array();
        let iNumber = 0;
        let sameValueCount = 1;
        for (let i = 0; i < 9; i++) {
            type.match[i] = false;
        }

        let LCardData = new Array();
        for (let i = 0; i < bCardCount; i++) {
            LCardData[i] = this.getCardLogicValue(cardData[i]);
        }

        let bLogicValue = LCardData[0];
        index[iNumber++] = 0;
        let num = new Array();
        for (let i = 0; i < 9; i++) {
            num[i] = 0;
        }

        for (let i = 1; i < bCardCount; i++) {
            if (bLogicValue == LCardData[i]) {
                sameValueCount++;
                index[iNumber++] = i;
            }
            if (bLogicValue != LCardData[i] || i == bCardCount - 1) {
                if (sameValueCount == 2)//一对
                {
                    type.onePare = true;
                    type.match[0] = true;
                    type.snOnePare[num[0]++] = index[sameValueCount - 2];
                    type.snOnePare[num[0]++] = index[sameValueCount - 1];
                    type.amOnePare++;
                }
                else if (sameValueCount == 3)//三条
                {
                    type.onePare = true;
                    type.match[0] = true;
                    type.snOnePare[num[0]++] = index[sameValueCount - 3];
                    type.snOnePare[num[0]++] = index[sameValueCount - 2];
                    type.threeSame = true;
                    type.match[2] = true;
                    type.snThreeSame[num[2]++] = index[sameValueCount - 3];
                    type.snThreeSame[num[2]++] = index[sameValueCount - 2];
                    type.snThreeSame[num[2]++] = index[sameValueCount - 1];
                    type.amThreeSame++;
                }
                else if (sameValueCount == 4)//铁支
                {
                    type.onePare = true;
                    type.match[0] = true;
                    type.snOnePare[num[0]++] = index[sameValueCount - 4];
                    type.snOnePare[num[0]++] = index[sameValueCount - 3];
                    type.threeSame = true;
                    type.match[2] = true;
                    type.snThreeSame[num[2]++] = index[sameValueCount - 4];
                    type.snThreeSame[num[2]++] = index[sameValueCount - 3];
                    type.snThreeSame[num[2]++] = index[sameValueCount - 2];
                    type.fourSame = true;
                    type.match[6] = true;
                    type.snFourSame[num[6]++] = index[sameValueCount - 4];
                    type.snFourSame[num[6]++] = index[sameValueCount - 3];
                    type.snFourSame[num[6]++] = index[sameValueCount - 2];
                    type.snFourSame[num[6]++] = index[sameValueCount - 1];
                    type.amFourSame++;
                }
                iNumber = 0;
                index = [];
                index[iNumber++] = i;
                sameValueCount = 1;
                bLogicValue = LCardData[i];
            }
        }
        //判断两对
        let onePareCount = num[0] / 2;
        let threeSameCount = num[2] / 3;
        if (onePareCount >= 2) {
            type.twoPare = true;
            type.match[1] = true;
            for (let i = 0; i < onePareCount; i++) {
                for (let j = i + 1; j < onePareCount; j++) {
                    type.snTwoPare[num[1]++] = type.snOnePare[i * 2];
                    type.snTwoPare[num[1]++] = type.snOnePare[i * 2 + 1];
                    type.snTwoPare[num[1]++] = type.snOnePare[j * 2];
                    type.snTwoPare[num[1]++] = type.snOnePare[j * 2 + 1];
                    type.amTwoPare++;
                }
            }
        }
        //判断葫芦
        if (type.onePare && type.threeSame) {
            for (let i = 0; i < threeSameCount; i++) {
                for (let j = 0; j < onePareCount; j++) {
                    if (this.getCardLogicValue(type.snThreeSame[i * 3]) == this.getCardLogicValue(type.snOnePare[j * 2])) {
                        continue;
                    }
                    type.gourd = true;
                    type.match[5] = true;
                    type.snGourd[num[5]++] = type.snThreeSame[i * 3];
                    type.snGourd[num[5]++] = type.snThreeSame[i * 3 + 1];
                    type.snGourd[num[5]++] = type.snThreeSame[i * 3 + 2];
                    type.snGourd[num[5]++] = type.snOnePare[j * 2];
                    type.snGourd[num[5]++] = type.snOnePare[j * 2 + 1];
                    type.amGourd++;
                }
            }
        }
        //判断顺子及同花顺
        iNumber = 0;
        index = [];
        let iStraight = 1;
        let bStraight = LCardData[0];

        index[iNumber++] = 0;
        if (bStraight != 14) {
            for (let i = 1; i < bCardCount; i++) {
                if (bStraight == LCardData[i] + 1) {
                    iStraight++;
                    index[iNumber++] = i;
                    bStraight = LCardData[i];
                }
                if (bStraight > LCardData[i] + 1 || i == bCardCount - 1) {
                    if (iStraight >= 5) {
                        type.straight = true;
                        type.match[3] = true;

                        for (let j = 0; j < iStraight; j++) {
                            if (iStraight - j >= 5) {
                                type.snStraight[num[3]++] = index[j];
                                type.snStraight[num[3]++] = index[j + 1];
                                type.snStraight[num[3]++] = index[j + 2];
                                type.snStraight[num[3]++] = index[j + 3];
                                type.snStraight[num[3]++] = index[j + 4];
                                type.amStraight++;

                                let colorCard = new Array();
                                for (let i = 0; i < bCardCount; i++) {
                                    colorCard[i] = bCardData[i];
                                }
                                for (let k = j; k < j + 5; k++) {
                                    for (let m = 0; m < bCardCount; m++) {
                                        if (LCardData[index[k]] == LCardData[m] && this.getCardColor(colorCard[index[k]]) != this.getCardColor(colorCard[m])) {
                                            for (let n = j; n < j + 5; n++) {
                                                if (n == k) {
                                                    type.snStraight[num[3]++] = m;
                                                }
                                                else {
                                                    type.snStraight[num[3]++] = index[n];
                                                }
                                            }
                                            type.amStraight++;
                                        }
                                    }
                                }
                            }
                            else {
                                break;
                            }
                        }
                    }
                    if (bCardCount - i < 5) {
                        break;
                    }
                    bStraight = LCardData[i];
                    iStraight = 1;
                    iNumber = 0;
                    index = [];
                    index[iNumber++] = i;
                }
            }
        }
        if (bStraight == 14) {
            for (let i = 1; i < bCardCount; i++) {
                if (bStraight == LCardData[i] + 1) {
                    iStraight++;
                    index[iNumber++] = i;
                    bStraight = LCardData[i];
                }
                if (bStraight > LCardData[i] + 1 || i == bCardCount - 1) {
                    if (iStraight >= 5) {
                        type.straight = true;
                        type.match[3] = true;
                        for (let j = 0; j < iStraight; j++) {
                            if (iStraight - j >= 5) {
                                type.snStraight[num[3]++] = index[j];
                                type.snStraight[num[3]++] = index[j + 1];
                                type.snStraight[num[3]++] = index[j + 2];
                                type.snStraight[num[3]++] = index[j + 3];
                                type.snStraight[num[3]++] = index[j + 4];
                                type.amStraight++;
                                //从手牌中找到和顺子5张中其中一张数值相同的牌，组成另一种顺子
                                for (let k = j; k < j + 5; k++) {
                                    for (let m = 0; m < bCardCount; m++) {
                                        let colorCard = new Array();
                                        for (let i = 0; i < bCardCount; i++) {
                                            colorCard[i] = bCardData[i];
                                        }
                                        if (LCardData[index[k]] == LCardData[m] &&

                                            this.getCardColor(colorCard[index[k]]) != this.getCardColor(colorCard[m])) {
                                            for (let n = j; n < j + 5; n++) {
                                                if (n == k) {
                                                    type.snStraight[num[3]++] = m;
                                                }
                                                else {
                                                    type.snStraight[num[3]++] = index[n];
                                                }
                                            }
                                            type.amStraight++;
                                        }
                                    }
                                }
                            }
                            else {
                                break;
                            }
                        }
                    }
                    if (bCardCount - i < 5) {
                        break;
                    }
                    bStraight = LCardData[i];
                    iStraight = 1;
                    iNumber = 0;
                    index = [];
                    index[iNumber++] = i;
                }
            }
            if (LCardData[bCardCount - 1] == 2) {
                iNumber = 0;
                let backA = 1;
                let frontA = 1;
                bStraight = LCardData[0];
                index = [];
                index[iNumber++] = 0;
                bStraight = LCardData[bCardCount - 1];
                index[iNumber++] = bCardCount - 1;
                for (let i = bCardCount - 2; i >= 0; i--) {
                    if (bStraight == LCardData[i] - 1) {
                        frontA++;
                        index[iNumber++] = i;
                        bStraight = LCardData[i];
                    }
                }
                if (frontA + backA >= 5) {
                    type.straight = true;
                    type.match[3] = true;
                    for (let i = backA; i > 0; i--) {
                        for (let j = 1; j <= frontA; j++) {
                            if (i + j == 5) {
                                for (let k = 0; k < i; k++) {
                                    type.snStraight[num[3]++] = index[k];
                                }
                                for (let k = 0; k < j; k++) {
                                    type.snStraight[num[3]++] = index[k + backA];
                                }
                                break;
                            }
                        }
                    }
                }
            }
        }
        //判断同花及同花顺
        iNumber = 0;
        index = [];

        let cbCardData = new Array();
        cbCardData = this.sortCardList(bCardData, bCardCount, enSortType.enDescend);

        let clCardData = new Array();
        for (let i = 0; i < bCardCount; i++) {
            clCardData[i] = bCardData[i];
        }
        clCardData = this.sortCardList(clCardData, bCardCount, enSortType.enColor);
        let sameColorCount = 1;
        let LCardColor = new Array();
        for (let i = 0; i < bCardCount; i++) {
            LCardColor[i] = this.getCardColor(clCardData[i]);
        }
        let bCardColor = LCardColor[0];
        index[iNumber++] = 0;
        for (let i = 1; i < bCardCount; i++) {
            if (bCardColor == LCardColor[i]) {
                sameColorCount++;
                index[iNumber++] = i;
            }
            if (bCardColor != LCardColor[i] || i == bCardCount - 1) {
                if (sameColorCount >= 5) {
                    type.flush = true;
                    type.match[4] = true;

                    for (let j = 0; j < sameColorCount; j++) {
                        for (let k = 0; k < bCardCount; k++) {
                            if (LCardColor[index[j]] == this.getCardLogicValue(cbCardData[k])
                                && LCardColor[index[j]] == LCardColor[k]) {
                                index[j] = k;
                                break;
                            }
                        }
                    }
                    let saveIndex = 0;
                    for (let j = 0; j < sameColorCount; j++) {
                        for (let k = j + 1; k < sameColorCount; k++) {
                            if (index[j] > index[k]) {
                                saveIndex = index[j];
                                index[j] = index[k];
                                index[k] = saveIndex;
                            }
                        }
                    }
                    for (let j = 0; j < sameColorCount; j++) {
                        if (sameColorCount - j >= 5) {
                            type.snFlush[num[4]++] = index[j];
                            type.snFlush[num[4]++] = index[j + 1];
                            type.snFlush[num[4]++] = index[j + 2];
                            type.snFlush[num[4]++] = index[j + 3];
                            type.snFlush[num[4]++] = index[j + 4];
                            type.amFlush++;
                            if (this.getCardLogicValue(cbCardData[index[j]]) == 14) {
                                if (this.getCardLogicValue(cbCardData[index[j + 1]]) == 5 && this.getCardLogicValue(cbCardData[index[j + 2]]) == 4 &&
                                    this.getCardLogicValue(cbCardData[index[j + 3]]) == 3 && this.getCardLogicValue(cbCardData[index[j + 4]]) == 2) {
                                    type.straightFlush = true;
                                    type.match[7] = true;
                                    type.snStraightFlush[num[7]++] = index[j];
                                    type.snStraightFlush[num[7]++] = index[j + 1];
                                    type.snStraightFlush[num[7]++] = index[j + 2];
                                    type.snStraightFlush[num[7]++] = index[j + 3];
                                    type.snStraightFlush[num[7]++] = index[j + 4];
                                    type.amStraightFlush++;
                                }
                            }
                            if (this.getCardLogicValue(cbCardData[index[j]]) == this.getCardLogicValue(cbCardData[index[j + 1]]) + 1 &&
                                this.getCardLogicValue(cbCardData[index[j]]) == this.getCardLogicValue(cbCardData[index[j + 2]]) + 2 &&
                                this.getCardLogicValue(cbCardData[index[j]]) == this.getCardLogicValue(cbCardData[index[j + 3]]) + 3 &&
                                this.getCardLogicValue(cbCardData[index[j]]) == this.getCardLogicValue(cbCardData[index[j + 4]]) + 4) {
                                type.straightFlush = true;
                                type.match[7] = true;
                                type.snStraightFlush[num[7]++] = index[j];
                                type.snStraightFlush[num[7]++] = index[j + 1];
                                type.snStraightFlush[num[7]++] = index[j + 2];
                                type.snStraightFlush[num[7]++] = index[j + 3];
                                type.snStraightFlush[num[7]++] = index[j + 4];
                                type.amStraightFlush++;
                            }
                        }
                        else {
                            break;
                        }
                    }
                }
                if (bCardCount - i < 5) {
                    break;
                }
                iNumber = 0;
                index = [];
                sameColorCount = 1;
                index[iNumber++] = i;
            }
            bCardColor = LCardColor[i];
        }

        return type;
    },

    //是否比前面的大
    isBiggerThanFront: function (frontFrontCard, frontMidCard, frontBackCard, frontCard, midCard, backCard) {

        var btFrontShuiShu = this.threeDunAllShuiShu(frontFrontCard, frontMidCard, frontBackCard);
        var btShuiShu = this.threeDunAllShuiShu(frontCard, midCard, backCard);

        var tagFrontFrontCardType = tagAnalyseType;
        var tagFrontMidCardType = tagAnalyseType;
        var tagFrontBackCardType = tagAnalyseType;
        var tagFrontCardType = tagAnalyseType;
        var tagMidCardType = tagAnalyseType;
        var tagBackCardType = tagAnalyseType;

        tagFrontFrontCardType = this.getType(frontFrontCard, 3);
        tagFrontMidCardType = this.getType(frontMidCard, 5);
        tagFrontBackCardType = this.getType(frontBackCard, 5);
        tagFrontCardType = this.getType(frontCard, 3);
        tagMidCardType = this.getType(midCard, 5);
        tagBackCardType = this.getType(backCard, 5);

        var btFrontWin = 0;
        var btWin = 0;
        var btCompare = 0;

        var btFrontCanWin = 0;
        var btCanWin = 0;
        if (this.isSameCardData(frontFrontCard, frontCard, 3, 3) == false) {
            if (!(tagFrontFrontCardType.threeSame && tagFrontCardType.threeSame)) {
                if (pokerLogic.compareCard(frontFrontCard, frontCard, 3, 3, true)) {
                    btCompare++;
                }
                else {
                    btCompare--;
                }
            }
        }

        if (this.isSameCardData(frontMidCard, midCard, 5, 5) == false) {
            if (!(tagFrontMidCardType.threeSame && tagMidCardType.threeSame)) {
                if (pokerLogic.compareCard(frontMidCard, midCard, 5, 5, true)) {
                    btCompare++;
                }
                else {
                    btCompare--;
                }
            }
            else {
                var btSpecialCard = [];
                if (pokerLogic.getCardType(midCard, 5, btSpecialCard) > pokerLogic.getCardType(frontMidCard, 5, btSpecialCard)) {
                    btCompare++;
                }
                else if (pokerLogic.getCardType(midCard, 5, btSpecialCard) < pokerLogic.getCardType(frontMidCard, 5, btSpecialCard)) {
                    btCompare--;
                }
            }
        }

        if (this.isSameCardData(frontBackCard, backCard, 5, 5) == false) {
            if (!(tagFrontBackCardType.threeSame && tagBackCardType.threeSame)) {
                if (pokerLogic.compareCard(frontBackCard, backCard, 5, 5, true)) {
                    btCompare++;
                }
                else {
                    btCompare--;
                }
            }
            else {
                var btSpecialCard = [];
                if (pokerLogic.getCardType(backCard, 5, btSpecialCard) > pokerLogic.getCardType(frontBackCard, 5, btSpecialCard)) {
                    btCompare++;
                }
                else if (pokerLogic.getCardType(backCard, 5, btSpecialCard) < pokerLogic.getCardType(frontBackCard, 5, btSpecialCard)) {
                    btCompare--;
                }
            }
        }
        //前面的牌
        if (tagFrontFrontCardType.threeSame) {
            btFrontWin += 1;
            btFrontCanWin += 3;
        }
        else if (tagFrontFrontCardType.onePare) {
            btFrontWin += 1;
            btFrontCanWin += 1;
        }
        else {
            if (this.getCardLogicValue(frontFrontCard[0]) == 14) {
                btFrontWin += 0;
                btFrontCanWin += 0;
            }
            else {
                btFrontWin += -1;
                btFrontCanWin += -1;
            }
        }
        //中道
        if (tagFrontMidCardType.straightFlush) {
            btFrontWin += 1;
            btFrontCanWin += 10;
        }
        else if (tagFrontMidCardType.fourSame) {
            btFrontWin += 1;
            btFrontCanWin += 8;
        }
        else if (tagFrontMidCardType.gourd) {
            btFrontWin += 1;
            btFrontCanWin += 5;
        }
        else if (tagFrontMidCardType.flush) {
            btFrontWin += 1;
            btFrontCanWin += 4;
        }
        else if (tagFrontMidCardType.straight) {
            btFrontWin += 1;
            btFrontCanWin += 3;
        }
        else if (tagFrontMidCardType.threeSame) {
            btFrontWin += 1;
            btFrontCanWin += 2;
        }
        else if (tagFrontMidCardType.twoPare) {
            if (this.getCardLogicValue(frontMidCard[tagFrontMidCardType.snTwoPare[0]]) < 6) {
                btFrontWin += 0;
                btFrontCanWin += 0;
            }
            else {
                btFrontWin += 1;
                btFrontCanWin += 1;
            }
        }
        else if (tagFrontMidCardType.onePare) {
            if (this.getCardLogicValue(frontMidCard[tagFrontMidCardType.snOnePare[0]]) < 12) {
                btFrontWin += -1;
                btFrontCanWin += -1;
            }
            else {
                btFrontWin += 0;
                btFrontCanWin += 0;
            }
        }
        else {
            btFrontWin += -1;
            btFrontCanWin += -2;
        }
        //尾道
        if (tagFrontBackCardType.straightFlush) {
            btFrontWin += 1;
            btFrontCanWin += 5;
        }
        else if (tagFrontBackCardType.fourSame) {
            btFrontWin += 1;
            btFrontCanWin += 4;
        }
        else if (tagFrontBackCardType.gourd) {
            btFrontWin += 1;
            btFrontCanWin += 3;
        }
        else if (tagFrontBackCardType.flush) {
            if (this.getCardLogicValue(frontBackCard[tagFrontBackCardType.snFlush[0]]) < 11) {
                btFrontWin += 0;
                btFrontCanWin += 1;
            }
            else {
                btFrontWin += 1;
                btFrontCanWin += 2;
            }
        }
        else if (tagFrontBackCardType.straight) {
            if (this.getCardLogicValue(frontBackCard[tagFrontBackCardType.snStraight[0]]) < 11) {
                btFrontWin += -1;
                btFrontCanWin += -1;
            }
            else {
                btFrontWin += 0;
                btFrontCanWin += 0;
            }
        }
        else {
            if (tagFrontBackCardType.threeSame) {
                btFrontCanWin += -2;
            }
            else if (tagFrontBackCardType.twoPare) {
                btFrontCanWin += -3;
            }
            else if (tagFrontBackCardType.onePare) {
                btFrontCanWin += -4;
            }
            else {
                btFrontCanWin += -5;
            }
            btFrontWin += -1;
        }
        //现在的牌
        if (tagFrontCardType.threeSame) {
            btWin += 1;
            btCanWin += 3;
        }
        else if (tagFrontCardType.onePare) {
            btWin += 1;
            btCanWin += 1;
        }
        else {
            if (this.getCardLogicValue(frontCard[0]) == 14) {
                btWin += 0;
                btCanWin += 0;
            }
            else {
                btWin += -1;
                btCanWin += -1;
            }
        }
        //中道
        if (tagMidCardType.straightFlush) {
            btWin += 1;
            btCanWin += 10;
        }
        else if (tagMidCardType.fourSame) {
            btWin += 1;
            btCanWin += 8;
        }
        else if (tagMidCardType.gourd) {
            btWin += 1;
            btCanWin += 5;
        }
        else if (tagMidCardType.flush) {
            btWin += 1;
            btCanWin += 4;
        }
        else if (tagMidCardType.straight) {
            btWin += 1;
            btCanWin += 3;
        }
        else if (tagMidCardType.threeSame) {
            btWin += 1;
            btCanWin += 2;
        }
        else if (tagMidCardType.twoPare) {
            if (this.getCardLogicValue(midCard[tagMidCardType.snTwoPare[0]]) < 6) {
                btWin += 0;
                btCanWin += 0;
            }
            else {
                btWin += 1;
                btCanWin += 1;
            }
        }
        else if (tagMidCardType.onePare) {
            if (this.getCardLogicValue(midCard[tagMidCardType.snOnePare[0]]) < 12) {
                btWin += -1;
                btCanWin += -1;
            }
            else {
                btWin += 0;
                btCanWin += 0;
            }
        }
        else {
            btWin += -1;
            btCanWin += -2;
        }
        //尾道
        if (tagBackCardType.straightFlush) {
            btWin += 1;
            btCanWin += 5;
        }
        else if (tagBackCardType.fourSame) {
            btWin += 1;
            btCanWin += 4;
        }
        else if (tagBackCardType.gourd) {
            btWin += 1;
            btCanWin += 3;
        }
        else if (tagBackCardType.flush) {
            if (this.getCardLogicValue(backCard[tagBackCardType.snFlush[0]]) < 11) {
                btWin += 0;
                btCanWin += 1;
            }
            else {
                btWin += 1;
                btCanWin += 2;
            }
        }
        else if (tagBackCardType.straight) {
            if (this.getCardLogicValue(backCard[tagBackCardType.snStraight[0]]) < 11) {
                btWin += -1;
                btCanWin += -1;
            }
            else {
                btWin += 0;
                btCanWin += 0;
            }
        }
        else {
            if (tagBackCardType.threeSame) {
                btCanWin += -2;
            }
            else if (tagBackCardType.twoPare) {
                btCanWin += -3;
            }
            else if (tagBackCardType.onePare) {
                btCanWin += -4;
            }
            else {
                btCanWin += -5;
            }
            btWin += -1;
        }

        if (btShuiShu == btFrontShuiShu) {
            if (btWin > btFrontWin) {
                return true;
            }
            else if (btWin == btFrontWin) {
                if (btCompare >= 1) {
                    return true;
                }
                else {
                    if (btCanWin > btFrontCanWin) {
                        return true;
                    }
                    else {
                        return false;
                    }
                }
            }
            else {
                return false;
            }
        }
        else if (btShuiShu == btFrontShuiShu + 1) {
            if (btFrontWin - btWin >= 4) {
                return false;
            }
            else {
                return true;
            }
        }
        else if (btShuiShu + 1 == btFrontShuiShu) {
            if (btWin - btFrontWin >= 4) {
                return true;
            }
            else {
                return false;
            }
        }
        else if (btShuiShu > btFrontShuiShu) {
            return true;
        }
        else if (btShuiShu < btFrontShuiShu) {
            return false;
        }
        return false;
    },

    //三道总共的水数
    threeDunAllShuiShu: function (frontCard, midCard, backCard) {
        var allShuiShu = 0;
        var tagCardType1 = tagAnalyseType;
        var tagCardType2 = tagAnalyseType;
        var tagCardType3 = tagAnalyseType;

        tagCardType1 = this.getType(frontCard, 3);
        tagCardType2 = this.getType(midCard, 5);
        tagCardType3 = this.getType(backCard, 5);

        if (tagCardType1.threeSame) {
            allShuiShu += 3;
        }
        else {
            allShuiShu += 1;
        }

        if (tagCardType2.straightFlush) {
            allShuiShu += 10;
        }
        else if (tagCardType2.fourSame) {
            allShuiShu += 8;
        }
        else if (tagCardType2.gourd) {
            allShuiShu += 2;
        }
        else {
            allShuiShu += 1;
        }

        if (tagCardType3.straightFlush) {
            allShuiShu += 5;
        }
        else if (tagCardType3.fourSame) {
            allShuiShu += 4;
        }
        else {
            allShuiShu += 1;
        }
        return allShuiShu;
    },
});
