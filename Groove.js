cc.Class({
    extends: cc.Component,
    properties: {

    },

    onLoad: function () {

    },

    // 最好的一道
    theBestCard: function (tagCardType, btHandCardData, btHandCardCount, btFrontCard, btMidCard, btBackCard) {
        if (btHandCardCount != 13) {
            return;
        }
        var btCardCount = btHandCardCount;
        var btCardData = new Array();
        btCardData = btHandCardData;
        var btCardData1 = new Array();
        var btCardData2 = new Array();

        var btCardCount1 = 0;
        var btCardCount2 = 0;
        var frontCard = new Array();
        var midCard = new Array();
        var backCard = new Array();
        var btAllShuiShu = 0;

        var frontFrontCard = new Array();
        var frontMidCard = new Array();
        var frontBackCard = new Array();
        var btFrontAllShuiShu = 0;

        var bCycling = true;
        var bFront = false;
        var bMid = false;
        var bBack = false;
        var bFirst = true;

        var btFront = 0;
        var btMid = 0;
        var btBack = 0;

        var tagCardType1 = tagAnalyseType;
        var tagCardType2 = tagAnalyseType;
        var btTemp = new Array();

        if (tagCardType.straightFlush)  //有同花顺
        {
            for (var i = 0; i < tagCardType.amStraightFlush; i++) {
                btCardData = btHandCardData;
                btCardCount = btHandCardCount;
                for (var j = 0; j < 5; j++) {
                    backCard[j] = btCardData[tagCardType.snStraightFlush[i * 5 + j]];
                }
                pokerLogic.removeCard(backCard, 5, btCardData, btCardCount);
                btCardCount1 = btCardCount -= 5;
                btCardData1 = btCardData;
                tagCardType1 = this.getType(btCardData1, btCardCount1);
                if (tagCardType1.straightFlush) //有同花顺
                {
                    for (var j = 0; j < tagCardType1.amStraightFlush; j++) {
                        btCardCount1 = btCardCount;
                        btCardData1 = btCardCount;

                        for (var k = 0; k < 5; k++) {
                            midCard[k] = btCardData1[tagCardType1.snStraightFlush[j * 5 + k]];
                        }
                        pokerLogic.removeCard(midCard, 5, btCardData1, btCardCount1);
                        for (var k = 0; k < 3; k++) {
                            frontCard[k] = btCardData1[k];
                        }
                        if (bFirst) {
                            if (pokerLogic.compareCard(frontCard, midCard, 3, 5, false) && pokerLogic.compareCard(midCard, backCard, 5, 5, false)) {
                                frontFrontCard = frontCard;
                                frontMidCard = midCard;
                                frontBackCard = backCard;
                                btFrontAllShuiShu = this.threeDunAllShuiShu(frontFrontCard, frontMidCard, frontBackCard);
                                bFirst = false;
                            }
                        }
                        else {
                            btAllShuiShu = this.threeDunAllShuiShu(frontCard, midCard, backCard);
                            if (pokerLogic.compareCard(frontCard, midCard, 3, 5, false) && pokerLogic.compareCard(midCard, backCard, 5, 5, false) &&
                                (btAllShuiShu > btFrontAllShuiShu || (pokerLogic.compareCard(frontFrontCard, frontCard, 3, 3, false) && btAllShuiShu == btFrontAllShuiShu))) {
                                frontFrontCard = frontCard;
                                frontMidCard = midCard;
                                frontBackCard = backCard;
                                btFrontAllShuiShu = btAllShuiShu;
                            }
                        }
                    }
                }
                else if (tagCardType1.fourSame) //有铁支
                {
                    for (var j = 0; j < tagCardType1.amFourSame; j++) {
                        btCardCount1 = btCardCount;
                        btCardData1 = btCardData;

                        for (var k = 0; k < 4; k++) {
                            midCard[k] = btCardData1[tagCardType1.snFourSame[j * 4 + k]];
                        }
                        pokerLogic.removeCard(midCard, 4, btCardData1, btCardCount1);
                        btCardCount2 = btCardCount1 -= 4;
                        btCardData2 = btCardData1;
                        tagCardType2 = this.getType(btCardData2, btCardCount2);
                        if (tagCardType2.threeSame) //剩下三条
                        {
                            for (var k = 3; k >= 0; k--) {
                                if (ctoType.getCardLogicValue(btCardData2[k]) != ctoType.getCardLogicValue(btCardData2[tagCardType2.snThreeSame[0]])) {
                                    btTemp[0] = midCard[4] = btCardData2[k];
                                    break;
                                }
                            }
                            pokerLogic.removeCard(btTemp, 1, btCardData2, btCardCount2);
                            frontCard = btCardData2;
                        }
                        else if (tagCardType2.onePare)  //剩下一对
                        {
                            for (var k = 3; k >= 0; k--) {
                                if (ctoType.getCardLogicValue(btCardData2[k]) != ctoType.getCardLogicValue(btCardData2[tagCardType2.snOnePare[0]])) {
                                    btTemp[0] = midCard[4] = btCardData2[k];
                                    break;
                                }
                            }
                            pokerLogic.removeCard(btTemp, 1, btCardData2, btCardCount2);
                            frontCard = btCardData2;
                        }
                        else {
                            modCard[4] = btCArdData2[3];
                            frontCArd = btCardData2;

                        }
                        if (bFirst) {
                            if (pokerLogic.compareCard(frontCard, midCard, 3, 5, false) && pokerLogic.compareCard(midCard, backCard, 5, 5, false)) {
                                frontFrontCard = frontCard;
                                frontMidCard = midCard;
                                frontBackCard = backCard;
                                btFrontAllShuiShu = this.threeDunAllShuiShu(frontFrontCard, frontMidCard, frontBackCard);
                                bFirst = false;
                            }
                        }
                        else {
                            btAllShuiShu = this.threeDunAllShuiShu(frontCard, midCard, backCard);
                            if (pokerLogic.compareCard(frontCard, midCard, 3, 5, false) && pokerLogic.compareCard(midCard, backCard, 5, 5, false) &&
                                (btAllShuiShu > btFrontAllShuiShu || (pokerLogic.compareCard(frontFrontCard, frontCard, 3, 3, false) && btAllShuiShu == btFrontAllShuiShu))) {
                                frontFrontCard = frontCard;
                                frontMidCard = midCard;
                                frontBackCard = backCard;
                                btFrontAllShuiShu = btAllShuiShu;
                            }
                        }
                    }
                }
                else {
                    if (tagCardType1.gourd) //有葫芦
                    {
                        if (tagCardType1.gourd) {
                            var threeSame = false;
                            for (var j = 0; j < tagCardType1.amThreeSame; j++) {
                                btCardCount1 = btCardCount;
                                btCardData1 = btCardData;

                                for (var k = 0; k < 3; k++) {
                                    frontCard[k] = btCardData1[tagCardType1.snThreeSame[j * 3 + k]];
                                }
                                pokerLogic.removeCard(frontCard, 3, btCardData1, btCardCount1);
                                btCardCount2 = btCardCount1 -= 3;
                                midCard = btCardData1;
                                if (bFirst) {
                                    if (pokerLogic.compareCard(frontCard, midCard, 3, 5, false) && pokerLogic.compareCard(midCard, backCard, 5, 5, false)) {
                                        threeSame = true;
                                        frontFrontCard = frontCard;
                                        frontMidCard = midCard;
                                        frontBackCard = backCard;
                                        btFrontAllShuiShu = this.threeDunAllShuiShu(frontFrontCard, frontMidCard, frontBackCard);
                                        bFirst = false;
                                    }
                                }
                                else {
                                    btAllShuiShu = this.threeDunAllShuiShu(frontCard, midCard, backCard);
                                    if (pokerLogic.compareCard(frontCard, midCard, 3, 5, false) && pokerLogic.compareCard(midCard, backCard, 5, 5, false) &&
                                        (btAllShuiShu > btFrontAllShuiShu || (pokerLogic.compareCard(frontFrontCard, frontCard, 3, 3, false) && btAllShuiShu == btFrontAllShuiShu))) {
                                        threeSame = true;
                                        frontFrontCard = frontCard;
                                        frontMidCard = midCard;
                                        frontBackCard = backCard;
                                        btFrontAllShuiShu = btAllShuiShu;
                                    }
                                }
                            }
                            if (threeSame == false) //头道不能为三条
                            {
                                for (var j = 0; j < tagCardType1.amGourd; j++)   //中道葫芦
                                {
                                    btCardCount1 = btCardCount;
                                    btCardData1 = btCardData;
                                    for (var k = 0; k < 5; k++) {
                                        midCard[k] = btCardData1[tagCardType1.snStraight[j * 5 + k]];
                                    }
                                    pokerLogic.removeCard(midCard, 5, btCardData1, btCardCount1);
                                    frontCard = btCardData1;
                                    if (bFirst) {
                                        if (pokerLogic.compareCard(frontCard, midCard, 3, 5, false) && pokerLogic.compareCard(midCard, backCard, 5, 5, false)) {
                                            frontFrontCard = frontCard;
                                            frontMidCard = midCard;
                                            frontBackCard = backCard;
                                            btFrontAllShuiShu = this.threeDunAllShuiShu(frontFrontCard, frontMidCard, frontBackCard);
                                            bFirst = false;
                                        }
                                    }
                                    else {
                                        btAllShuiShu = this.threeDunAllShuiShu(frontCard, midCard, backCard);
                                        if (pokerLogic.compareCard(frontCard, midCard, 3, 5, false) && pokerLogic.compareCard(midCard, backCard, 5, 5, false) &&
                                            (btAllShuiShu > btFrontAllShuiShu || (pokerLogic.compareCard(frontFrontCard, frontCard, 3, 3, false) && btAllShuiShu == btFrontAllShuiShu))) {
                                            frontFrontCard = frontCard;
                                            frontMidCard = midCard;
                                            frontBackCard = backCard;
                                            btFrontAllShuiShu = btAllShuiShu;
                                        }
                                    }
                                }
                            }
                        }
                        else if (tagCardType1.flush)    //有同花
                        {
                            var threeSame = false;
                            if (tagCardType1.threeSame) //有三条
                            {
                                for (var j = 0; j < tagCardType1.amThreeSame; j++) {  //头道三条
                                    btCardCount1 = btCardCount;
                                    btCardData1 = btCardData;

                                    for (var k = 0; k < 3; k++) {
                                        frontCard[k] = btCardData1[tagCardType1.snThreeSame[j * 3 + k]];
                                    }
                                    pokerLogic.removeCard(frontCard, 3, btCardData1, btCardCount1);
                                    btCardCount2 = btCardCount1 -= 3;
                                    midCard = btCardData1;
                                    if (bFirst) {
                                        if (pokerLogic.compareCard(frontCard, midCard, 3, 5, false) && pokerLogic.compareCard(midCard, backCard, 5, 5, false)) {
                                            threeSame = true;
                                            frontFrontCard = frontCard;
                                            frontMidCard = midCard;
                                            frontBackCard = backCard;
                                            btFrontAllShuiShu = this.threeDunAllShuiShu(frontFrontCard, frontMidCard, frontBackCard);
                                            bFirst = false;
                                        }
                                    }
                                    else {
                                        btAllShuiShu = this.threeDunAllShuiShu(frontCard, midCard, backCard);
                                        if (pokerLogic.compareCard(frontCard, midCard, 3, 5, false) && pokerLogic.compareCard(midCard, backCard, 5, 5, false) &&
                                            (btAllShuiShu > btFrontAllShuiShu || (pokerLogic.compareCard(frontFrontCard, frontCard, 3, 3, false) && btAllShuiShu == btFrontAllShuiShu))) {
                                            threeSame = true;
                                            frontFrontCard = frontCard;
                                            frontMidCard = midCard;
                                            frontBackCard = backCard;
                                            btFrontAllShuiShu = btAllShuiShu;
                                        }
                                    }
                                }
                            }
                            if (threeSame == false) //头道不能为三条
                            {
                                for (var j = 0; j < tagCardType1.amFlush; j++)   //中道葫芦
                                {
                                    btCardCount1 = btCardCount;
                                    btCardData1 = btCardData;
                                    for (var k = 0; k < 5; k++) {
                                        midCard[k] = btCardData1[tagCardType1.snGourd[j * 5 + k]];
                                    }
                                    pokerLogic.removeCard(midCard, 5, btCardData1, btCardCount1);
                                    frontCard = btCardData1;
                                    if (bFirst) {
                                        if (pokerLogic.compareCard(frontCard, midCard, 3, 5, false) && pokerLogic.compareCard(midCard, backCard, 5, 5, false)) {
                                            frontFrontCard = frontCard;
                                            frontMidCard = midCard;
                                            frontBackCard = backCard;
                                            btFrontAllShuiShu = this.threeDunAllShuiShu(frontFrontCard, frontMidCard, frontBackCard);
                                            bFirst = false;
                                        }
                                    }
                                    else {
                                        btAllShuiShu = this.threeDunAllShuiShu(frontCard, midCard, backCard);
                                        if (pokerLogic.compareCard(frontCard, midCard, 3, 5, false) && pokerLogic.compareCard(midCard, backCard, 5, 5, false) &&
                                            (btAllShuiShu > btFrontAllShuiShu || (pokerLogic.compareCard(frontFrontCard, frontCard, 3, 3, false) && btAllShuiShu == btFrontAllShuiShu))) {
                                            frontFrontCard = frontCard;
                                            frontMidCard = midCard;
                                            frontBackCard = backCard;
                                            btFrontAllShuiShu = btAllShuiShu;
                                        }
                                    }
                                }
                                if (tagCardType1.straight)  //有顺子
                                {
                                    for (var j = 0; j < tagCardType1.amStraight; j++)   //中道顺子
                                    {
                                        btCardCount1 = btCardCount;
                                        btCardData1 = btCardData;
                                        for (var k = 0; k < 5; k++) {
                                            midCard[k] = btCardData1[tagCardType1.snStraight[j * 5 + k]];
                                        }
                                        pokerLogic.removeCard(midCard, 5, btCardData1, btCardCount1);
                                        frontCard = btCardData1;
                                        if (bFirst) {
                                            if (pokerLogic.compareCard(frontCard, midCard, 3, 5, false) && pokerLogic.compareCard(midCard, backCard, 5, 5, false)) {
                                                frontFrontCard = frontCard;
                                                frontMidCard = midCard;
                                                frontBackCard = backCard;
                                                btFrontAllShuiShu = this.threeDunAllShuiShu(frontFrontCard, frontMidCard, frontBackCard);
                                                bFirst = false;
                                            }
                                        }
                                        else {
                                            btAllShuiShu = this.threeDunAllShuiShu(frontCard, midCard, backCard);
                                            if (pokerLogic.compareCard(frontCard, midCard, 3, 5, false) && pokerLogic.compareCard(midCard, backCard, 5, 5, false) &&
                                                (btAllShuiShu > btFrontAllShuiShu || (pokerLogic.compareCard(frontFrontCard, frontCard, 3, 3, false) && btAllShuiShu == btFrontAllShuiShu))) {
                                                frontFrontCard = frontCard;
                                                frontMidCard = midCard;
                                                frontBackCard = backCard;
                                                btFrontAllShuiShu = btAllShuiShu;
                                            }
                                        }
                                    }
                                }
                                if (tagCardType1.threeSame) //有三条
                                {
                                    for (var j = 0; j < tagCardType1.amThreeSame; j++)  //中道三条
                                    {
                                        btCardCount1 = btCardCount;
                                        btCardData1 = btCardData;
                                        for (var k = 0; k < 3; k++) {
                                            midCard[k] = btCardData1[tagCardType1.snStraight[j * 3 + k]];
                                        }
                                        pokerLogic.removeCard(midCard, 3, btCardData1, btCardCount1);
                                        midCard[3] = btCardData1[3];
                                        midCard[4] = btCardData1[4];
                                        frontCard = btCardData1;
                                        if (bFirst) {
                                            if (pokerLogic.compareCard(frontCard, midCard, 3, 5, false) && pokerLogic.compareCard(midCard, backCard, 5, 5, false)) {
                                                frontFrontCard = frontCard;
                                                frontMidCard = midCard;
                                                frontBackCard = backCard;
                                                btFrontAllShuiShu = this.threeDunAllShuiShu(frontFrontCard, frontMidCard, frontBackCard);
                                                bFirst = false;
                                            }
                                        }
                                        else {
                                            btAllShuiShu = this.threeDunAllShuiShu(frontCard, midCard, backCard);
                                            if (pokerLogic.compareCard(frontCard, midCard, 3, 5, false) && pokerLogic.compareCard(midCard, backCard, 5, 5, false) &&
                                                (btAllShuiShu > btFrontAllShuiShu || (pokerLogic.compareCard(frontFrontCard, frontCard, 3, 3, false) && btAllShuiShu == btFrontAllShuiShu))) {
                                                frontFrontCard = frontCard;
                                                frontMidCard = midCard;
                                                frontBackCard = backCard;
                                                btFrontAllShuiShu = btAllShuiShu;
                                            }
                                        }
                                    }
                                }
                            }
                        }
                        else if (tagCardType1.straight)    //有顺子
                        {
                            var threeSame = false;
                            if (tagCardType1.threeSame) //有三条
                            {
                                for (var j = 0; j < tagCardType1.amThreeSame; j++) {  //头道三条
                                    btCardCount1 = btCardCount;
                                    btCardData1 = btCardData;

                                    for (var k = 0; k < 3; k++) {
                                        frontCard[k] = btCardData1[tagCardType1.snThreeSame[j * 3 + k]];
                                    }
                                    pokerLogic.removeCard(frontCard, 3, btCardData1, btCardCount1);
                                    btCardCount2 = btCardCount1 -= 3;
                                    midCard = btCardData1;
                                    if (bFirst) {
                                        if (pokerLogic.compareCard(frontCard, midCard, 3, 5, false) && pokerLogic.compareCard(midCard, backCard, 5, 5, false)) {
                                            threeSame = true;
                                            frontFrontCard = frontCard;
                                            frontMidCard = midCard;
                                            frontBackCard = backCard;
                                            btFrontAllShuiShu = this.threeDunAllShuiShu(frontFrontCard, frontMidCard, frontBackCard);
                                            bFirst = false;
                                        }
                                    }
                                    else {
                                        btAllShuiShu = this.threeDunAllShuiShu(frontCard, midCard, backCard);
                                        if (pokerLogic.compareCard(frontCard, midCard, 3, 5, false) && pokerLogic.compareCard(midCard, backCard, 5, 5, false) &&
                                            (btAllShuiShu > btFrontAllShuiShu || (pokerLogic.compareCard(frontFrontCard, frontCard, 3, 3, false) && btAllShuiShu == btFrontAllShuiShu))) {
                                            threeSame = true;
                                            frontFrontCard = frontCard;
                                            frontMidCard = midCard;
                                            frontBackCard = backCard;
                                            btFrontAllShuiShu = btAllShuiShu;
                                        }
                                    }
                                }
                            }
                            if (threeSame == false) //头道不能为三条
                            {
                                for (var j = 0; j < tagCardType1.amStraight; j++)   //中道顺子
                                {
                                    btCardCount1 = btCardCount;
                                    btCardData1 = btCardData;
                                    for (var k = 0; k < 5; k++) {
                                        midCard[k] = btCardData1[tagCardType1.snStraight[j * 5 + k]];
                                    }
                                    pokerLogic.removeCard(midCard, 5, btCardData1, btCardCount1);
                                    frontCard = btCardData1;
                                    if (bFirst) {
                                        if (pokerLogic.compareCard(frontCard, midCard, 3, 5, false) && pokerLogic.compareCard(midCard, backCard, 5, 5, false)) {
                                            frontFrontCard = frontCard;
                                            frontMidCard = midCard;
                                            frontBackCard = backCard;
                                            btFrontAllShuiShu = this.threeDunAllShuiShu(frontFrontCard, frontMidCard, frontBackCard);
                                            bFirst = false;
                                        }
                                    }
                                    else {
                                        btAllShuiShu = this.threeDunAllShuiShu(frontCard, midCard, backCard);
                                        if (pokerLogic.compareCard(frontCard, midCard, 3, 5, false) && pokerLogic.compareCard(midCard, backCard, 5, 5, false) &&
                                            (btAllShuiShu > btFrontAllShuiShu || (pokerLogic.compareCard(frontFrontCard, frontCard, 3, 3, false) && btAllShuiShu == btFrontAllShuiShu))) {
                                            frontFrontCard = frontCard;
                                            frontMidCard = midCard;
                                            frontBackCard = backCard;
                                            btFrontAllShuiShu = btAllShuiShu;
                                        }
                                    }
                                }
                                if (tagCardType1.threeSame) //有三条
                                {
                                    for (var j = 0; j < tagCardType1.amThreeSame; j++)  //中道三条
                                    {
                                        btCardCount1 = btCardCount;
                                        btCardData1 = btCardData;
                                        for (var k = 0; k < 3; k++) {
                                            midCard[k] = btCardData1[tagCardType1.snStraight[j * 3 + k]];
                                        }
                                        pokerLogic.removeCard(midCard, 3, btCardData1, btCardCount1);
                                        midCard[3] = btCardData1[3];
                                        midCard[4] = btCardData1[4];
                                        frontCard = btCardData1;
                                        if (bFirst) {
                                            if (pokerLogic.compareCard(frontCard, midCard, 3, 5, false) && pokerLogic.compareCard(midCard, backCard, 5, 5, false)) {
                                                frontFrontCard = frontCard;
                                                frontMidCard = midCard;
                                                frontBackCard = backCard;
                                                btFrontAllShuiShu = this.threeDunAllShuiShu(frontFrontCard, frontMidCard, frontBackCard);
                                                bFirst = false;
                                            }
                                        }
                                        else {
                                            btAllShuiShu = this.threeDunAllShuiShu(frontCard, midCard, backCard);
                                            if (pokerLogic.compareCard(frontCard, midCard, 3, 5, false) && pokerLogic.compareCard(midCard, backCard, 5, 5, false) &&
                                                (btAllShuiShu > btFrontAllShuiShu || (pokerLogic.compareCard(frontFrontCard, frontCard, 3, 3, false) && btAllShuiShu == btFrontAllShuiShu))) {
                                                frontFrontCard = frontCard;
                                                frontMidCard = midCard;
                                                frontBackCard = backCard;
                                                btFrontAllShuiShu = btAllShuiShu;
                                            }
                                        }
                                    }
                                }
                            }
                        }
                        else if (tagCardType1.threeSame) //有三条
                        {
                            for (var j = 0; j < tagCardType1.amThreeSame; j++)  //中道三条
                            {
                                btCardCount1 = btCardCount;
                                btCardData1 = btCardData;
                                for (var k = 0; k < 3; k++) {
                                    midCard[k] = btCardData1[tagCardType1.snStraight[j * 3 + k]];
                                }
                                pokerLogic.removeCard(midCard, 3, btCardData1, btCardCount1);
                                midCard[3] = btCardData1[3];
                                midCard[4] = btCardData1[4];
                                frontCard = btCardData1;
                                if (bFirst) {
                                    if (pokerLogic.compareCard(frontCard, midCard, 3, 5, false) && pokerLogic.compareCard(midCard, backCard, 5, 5, false)) {
                                        frontFrontCard = frontCard;
                                        frontMidCard = midCard;
                                        frontBackCard = backCard;
                                        btFrontAllShuiShu = this.threeDunAllShuiShu(frontFrontCard, frontMidCard, frontBackCard);
                                        bFirst = false;
                                    }
                                }
                                else {
                                    btAllShuiShu = this.threeDunAllShuiShu(frontCard, midCard, backCard);
                                    if (pokerLogic.compareCard(frontCard, midCard, 3, 5, false) && pokerLogic.compareCard(midCard, backCard, 5, 5, false) &&
                                        (btAllShuiShu > btFrontAllShuiShu || (pokerLogic.compareCard(frontFrontCard, frontCard, 3, 3, false) && btAllShuiShu == btFrontAllShuiShu))) {
                                        frontFrontCard = frontCard;
                                        frontMidCard = midCard;
                                        frontBackCard = backCard;
                                        btFrontAllShuiShu = btAllShuiShu;
                                    }
                                }
                            }
                        }
                        else if (tagCardType1.twoPare)  //有两对
                        {
                            if (tagCardType1.amOnePare >= 3) {
                                btCardCount1 = btCardCount;
                                btCardData1 = btCardData;
                                btTemp[0] = frontCard[0] = btCardData1[tagCardType1.snOnePare[0]];
                                btTemp[1] = frontCard[1] = btCardData1[tagCardType1.snOnePare[1]];
                                btTemp[2] = midCard[0] = btCardData1[tagCardType1.snOnePare[2]];
                                btTemp[3] = midCard[1] = btCardData1[tagCardType1.snOnePare[3]];
                                btTemp[4] = midCard[2] = btCardData1[tagCardType1.snOnePare[4]];
                                btTemp[5] = midCard[3] = btCardData1[tagCardType1.snOnePare[5]];
                                pokerLogic.removeCard(btTemp, 6, btCardData1, btCardCount1);
                                frontCard[2] = btCardData1[0];
                                midCard[4] = btCardData1[1];
                                if (bFirst) {
                                    if (pokerLogic.compareCard(frontCard, midCard, 3, 5, false) && pokerLogic.compareCard(midCard, backCard, 5, 5, false)) {
                                        frontFrontCard = frontCard;
                                        frontMidCard = midCard;
                                        frontBackCard = backCard;
                                        btFrontAllShuiShu = this.threeDunAllShuiShu(frontFrontCard, frontMidCard, frontBackCard);
                                        bFirst = false;
                                    }
                                }
                                else {
                                    btAllShuiShu = this.threeDunAllShuiShu(frontCard, midCard, backCard);
                                    if (pokerLogic.compareCard(frontCard, midCard, 3, 5, false) && pokerLogic.compareCard(midCard, backCard, 5, 5, false) &&
                                        (btAllShuiShu > btFrontAllShuiShu || (pokerLogic.compareCard(frontFrontCard, frontCard, 3, 3, false) && btAllShuiShu == btFrontAllShuiShu))) {
                                        frontFrontCard = frontCard;
                                        frontMidCard = midCard;
                                        frontBackCard = backCard;
                                        btFrontAllShuiShu = btAllShuiShu;
                                    }
                                }
                            }
                            else {
                                for (var j = 0; j < tagCardType1.amTwoPare; j++) //中道两对
                                {
                                    btCardCount1 = btCardCount;
                                    btCardData1 = btCardData;
                                    for (var k = 0; k < 4; k++) {
                                        midCard[k] = btCardData1[tagCardType1.snTwoPare[j * 4 + k]];
                                    }
                                    pokerLogic.removeCard(midCard, 4, btCardData1, btCardCount1);
                                    btCardCount2 = btCardCount1 -= 4;
                                    btCardData2 = btCardData1;

                                    tagCardType2 = this.getType(btCardData2, btCardCount2);
                                    if (tagCardType2.twoPare)   //剩下两对
                                    {
                                        midCard[4] = btCardData2[tagCardType2.snTwoPare[3]];
                                        frontCard[0] = btCardData2[tagCardType2.snTwoPare[0]];
                                        frontCard[1] = btCardData2[tagCardType2.snTwoPare[1]];
                                        frontCard[2] = btCardData2[tagCardType2.snTwoPare[2]];
                                    }
                                    else if (tagCardType2.onePare)  //剩下一对
                                    {
                                        for (var k = 3; k >= 0; k--) {
                                            if (ctoType.getCardLogicValue(btCardData2[k]) != ctoType.getCardLogicValue(btCardData2[tagCardType2.snOnePare[0]])) {
                                                btTemp[0] = midCard[4] = btCardData2[k];
                                                break;
                                            }
                                        }
                                        pokerLogic.removeCard(btTemp, 1, btCardData2, btCardCount2);
                                        frontCard = btCardData2;
                                    }
                                    else {   //剩下散牌
                                        midCard[4] = btCardData2[3];
                                        frontCard = btCardData2;
                                    }
                                    if (bFirst) {
                                        if (pokerLogic.compareCard(frontCard, midCard, 3, 5, false) && pokerLogic.compareCard(midCard, backCard, 5, 5, false)) {
                                            frontFrontCard = frontCard;
                                            frontMidCard = midCard;
                                            frontBackCard = backCard;
                                            btFrontAllShuiShu = this.threeDunAllShuiShu(frontFrontCard, frontMidCard, frontBackCard);
                                            bFirst = false;
                                        }
                                    }
                                    else {
                                        btAllShuiShu = this.threeDunAllShuiShu(frontCard, midCard, backCard);
                                        if (pokerLogic.compareCard(frontCard, midCard, 3, 5, false) && pokerLogic.compareCard(midCard, backCard, 5, 5, false) &&
                                            (btAllShuiShu > btFrontAllShuiShu || (pokerLogic.compareCard(frontFrontCard, frontCard, 3, 3, false) && btAllShuiShu == btFrontAllShuiShu))) {
                                            frontFrontCard = frontCard;
                                            frontMidCard = midCard;
                                            frontBackCard = backCard;
                                            btFrontAllShuiShu = btAllShuiShu;
                                        }
                                    }
                                }
                            }
                        }
                        else if (tagCardType1.onePare)  //有一对
                        {
                            for (var j = 0; j < tagCardType1.amOnePare; j++)   //中道一对
                            {
                                btCardCount1 = btCardCount;
                                btCardData1 = btCardData;
                                for (var k = 0; k < 2; k++) {
                                    midCard[k] = btCardData1[tagCardType1.snOnePare[j * 2 + k]];
                                }
                                pokerLogic.removeCard(midCard, 2, btCardData1, btCardCount1);
                                btCardCount2 = btCardCount1 -= 2;
                                btCardData2 = btCardData1;
                                for (var k = 0; k < 6; k++) {
                                    if (k < 3) {
                                        frontCard[k] = btCardData2[k];
                                    }
                                    else {
                                        midCard[k - 1] = btCardData2[k];
                                    }
                                }
                                if (bFirst) {
                                    if (pokerLogic.compareCard(frontCard, midCard, 3, 5, false) && pokerLogic.compareCard(midCard, backCard, 5, 5, false)) {
                                        frontFrontCard = frontCard;
                                        frontMidCard = midCard;
                                        frontBackCard = backCard;
                                        btFrontAllShuiShu = this.threeDunAllShuiShu(frontFrontCard, frontMidCard, frontBackCard);
                                        bFirst = false;
                                    }
                                }
                                else {
                                    btAllShuiShu = this.threeDunAllShuiShu(frontCard, midCard, backCard);
                                    if (pokerLogic.compareCard(frontCard, midCard, 3, 5, false) && pokerLogic.compareCard(midCard, backCard, 5, 5, false) &&
                                        (btAllShuiShu > btFrontAllShuiShu || (pokerLogic.compareCard(frontFrontCard, frontCard, 3, 3, false) && btAllShuiShu == btFrontAllShuiShu))) {
                                        frontFrontCard = frontCard;
                                        frontMidCard = midCard;
                                        frontBackCard = backCard;
                                        btFrontAllShuiShu = btAllShuiShu;
                                    }
                                }
                            }
                        }
                        else {   //散牌
                            btCardCount1 = btCardCount;
                            btCardData1 = btCardData;
                            midCard[0] = btCardData1[0];
                            midCard[1] = btCardData1[4];
                            midCard[2] = btCardData1[5];
                            midCard[3] = btCardData1[6];
                            midCard[4] = btCardData1[7];

                            frontCard[0] = btCardData1[1];
                            frontCard[1] = btCardData1[2];
                            frontCard[2] = btCardData1[3];
                            if (bFirst) {
                                if (pokerLogic.compareCard(frontCard, midCard, 3, 5, false) && pokerLogic.compareCard(midCard, backCard, 5, 5, false)) {
                                    frontFrontCard = frontCard;
                                    frontMidCard = midCard;
                                    frontBackCard = backCard;
                                    btFrontAllShuiShu = this.threeDunAllShuiShu(frontFrontCard, frontMidCard, frontBackCard);
                                    bFirst = false;
                                }
                            }
                            else {
                                btAllShuiShu = this.threeDunAllShuiShu(frontCard, midCard, backCard);
                                if (pokerLogic.compareCard(frontCard, midCard, 3, 5, false) && pokerLogic.compareCard(midCard, backCard, 5, 5, false) &&
                                    (btAllShuiShu > btFrontAllShuiShu || (pokerLogic.compareCard(frontFrontCard, frontCard, 3, 3, false) && btAllShuiShu == btFrontAllShuiShu))) {
                                    frontFrontCard = frontCard;
                                    frontMidCard = midCard;
                                    frontBackCard = backCard;
                                    btFrontAllShuiShu = btAllShuiShu;
                                }
                            }
                        }
                    }
                }
            }
        }
        else if (tagAnalyseType.fourSame) {    //铁支
            for (var i = 0; i < tagCardType.amFourSame; i++) {
                btCardData = btHandCardData;
                btCardCount = btHandCardCount;
                for (var j = 0; j < 4; j++) {
                    backCard[j] = btCardData[tagCardType.snFourSame[i * 4 + j]];
                }
                pokerLogic.removeCard(backCard, 4, btCardData, btCardCount);
                btCardCount1 = btCardCount -= 4;
                btCardData1 = btCardData;
                tagCardType1 = this.getType(btCardData1, btCardCount1);
                if (tagCardType1.fourSame)  //有铁支
                {
                    btCardCount1 = btCardCount;
                    btCardData1 = btCardData;
                    for (var k = 0; k < 4; k++) {
                        midCard[k] = btCardData1[tagCardType1.snFourSame[j * 4 + k]];
                    }
                    pokerLogic.removeCard(midCard, 4, btCardData1, btCardCount1);
                    btCardCount2 = btCardCount1 -= 4;
                    btCardData2 = btCardData1;
                    tagCardType2 = this.getType(btCardData2, btCardCount2);
                    if (tagCardType2.fourSame)  //剩下铁支
                    {
                        if (ctoType.getCardLogicValue(btCardData2[0]) == ctoType.getCardLogicValue(btCardData2[1])) {
                            backCard[4] = btCardData2[4];
                            midCard[4] = btCardData2[3];
                            frontCard = btCardData2;
                        }
                        else {
                            backCard[4] = btCardData2[0];
                            midCard[4] = btCardData2[4];
                            frontCard = btCardData2[1];
                        }
                    }
                    else if (tagCardType2.gourd)    //剩下葫芦
                    {
                        backCard[4] = btCardData2[tagCardType2.snGourd[4]];
                        midCard[4] = btCardData2[tagCardType2.snGourd[3]];
                        frontCard[0] = btCardData2[tagCardType2.snGourd[0]];
                        frontCard[1] = btCardData2[tagCardType2.snGourd[1]];
                        frontCard[2] = btCardData2[tagCardType2.snGourd[2]];
                    }
                    else if (tagCardType2.flush)    //剩下同花
                    {
                        backCard[4] = btCardData2[tagCardType2.snFlush[4]];
                        midCard[4] = btCardData2[tagCardType2.snFlush[3]];
                        frontCard[0] = btCardData2[tagCardType2.snFlush[0]];
                        frontCard[1] = btCardData2[tagCardType2.snFlush[1]];
                        frontCard[2] = btCardData2[tagCardType2.snFlush[2]];
                    }
                    else if (tagCardType2.straight)    //剩下顺子
                    {
                        backCard[4] = btCardData2[tagCardType2.snStraight[4]];
                        midCard[4] = btCardData2[tagCardType2.snStraight[3]];
                        frontCard[0] = btCardData2[tagCardType2.snStraight[0]];
                        frontCard[1] = btCardData2[tagCardType2.snStraight[1]];
                        frontCard[2] = btCardData2[tagCardType2.snStraight[2]];
                    }
                    else if (tagCardType2.threeSame)    //剩下三条
                    {
                        for (var k = 0; k < 3; k++) {
                            btTemp[k] = frontCard[k] = btCardData2[tagCardType2.snThreeSame[k]];
                        }
                        pokerLogic.removeCard(btTemp, 3, btCardData2[tagCardType2.snThreeSame[k]]);
                        backCard[4] = btCardData2[1];
                        midCard[4] = btCardData2[0];
                    }
                    else if (tagCardType2.twoPare)  //剩下两对
                    {
                        for (var k = 4; k >= 0; k--) {
                            if (ctoType.getCardLogicValue(btCardData2[k]) != ctoType.getCardLogicValue(btCardData2[tagCardType2.snTwoPare[0]])
                                && ctoType.getCardLogicValue(btCardData2[k]) != ctoType.getCardLogicValue(btCardData2[tagCardType2.snTwoPare[2]])) {
                                btTemp[0] = backCard[4] = btCardData2[k];
                                break;
                            }
                        }
                        midCard[4] = btCardData2[tagCardType2.snTwoPare[3]];
                        frontCard[0] = btCardData2[tagCardType2.snTwoPare[0]];
                        frontCard[1] = btCardData2[tagCardType2.snTwoPare[1]];
                        frontCard[2] = btCardData2[tagCardType2.snTwoPare[2]];
                    }
                    else if (tagCardType2.onePare) {    //剩下一对
                        btTemp[0] = frontCard[0] = btCardData2[tagCardType2.snOnePare[0]];
                        btTemp[1] = frontCard[1] = btCardData2[tagCardType2.snOnePare[1]];
                        pokerLogic.removeCard(btTemp, 2, btCardData2, btCardCount2);
                        frontCard[2] = btCardData2[0];
                        backCard[4] = btCardData2[2];
                        midCard[4] = btCardData2[1];
                    }
                    else {  //剩下散牌
                        backCard[4] = btCardData2[4];
                        midCard[4] = btCardData2[3];
                        frontCard = btCardData2;
                    }
                    if (bFirst) {
                        if (pokerLogic.compareCard(frontCard, midCard, 3, 5, false) && pokerLogic.compareCard(midCard, backCard, 5, 5, false)) {
                            frontFrontCard = frontCard;
                            frontMidCard = midCard;
                            frontBackCard = backCard;
                            btFrontAllShuiShu = this.threeDunAllShuiShu(frontFrontCard, frontMidCard, frontBackCard);
                            bFirst = false;
                        }
                    }
                    else {
                        btAllShuiShu = this.threeDunAllShuiShu(frontCard, midCard, backCard);
                        if (pokerLogic.compareCard(frontCard, midCard, 3, 5, false) && pokerLogic.compareCard(midCard, backCard, 5, 5, false) &&
                            (btAllShuiShu > btFrontAllShuiShu || (pokerLogic.compareCard(frontFrontCard, frontCard, 3, 3, false) && btAllShuiShu == btFrontAllShuiShu))) {
                            frontFrontCard = frontCard;
                            frontMidCard = midCard;
                            frontBackCard = backCard;
                            btFrontAllShuiShu = btAllShuiShu;
                        }
                    }
                }
                else {
                    if (tagCardType1.gourd) //有葫芦
                    {
                        var threeSame = false;
                        for (var j = 0; j < tagCardType1.amThreeSame; j++)   //头道三条
                        {
                            btCardCount1 = btCardCount;
                            btCardData1 = btCardData;

                            for (var k = 0; k < 3; k++) {
                                frontCard[k] = btCardData1[tagCardType1.snThreeSame[j * 3 + k]];
                            }
                            pokerLogic.removeCard(frontCard, 3, btCardData1, btCardCount1);
                            btCardCount2 = btCardCount1 -= 3;
                            btCardData2 = btCardData1;
                            tagCardType2 = this.getType(btCardData2, btCardCount2);
                            if (tagCardType2.gourd) {  //剩下葫芦
                                for (var k = 0; k < 5; k++) {
                                    btTemp[k] = midCard[k] = btCardData2[tagCardType2.snGourd[k]];
                                }
                                pokerLogic.removeCard(btTemp, 5, btCardData2, btCardCount2);
                                backCard[4] = btCardData2[0];
                            }
                            else if (tagCardType2.flush)    //剩下同花
                            {
                                for (var k = 0; k < 5; k++) {
                                    btTemp[k] = midCard[k] = btCardData2[tagCardType2.snFlush[k]];
                                }
                                pokerLogic.removeCard(btTemp, 5, btCardData2, btCardCount2);
                                backCard[4] = btCardData2[0];
                            }
                            else if (tagCardType2.straight) //剩下顺子
                            {
                                for (var k = 0; k < 5; k++) {
                                    btTemp[k] = midCard[k] = btCardData2[tagCardType2.snStraight[k]];
                                }
                                pokerLogic.removeCard(btTemp, 5, btCardData2, btCardCount2);
                                backCard[4] = btCardData2[0];
                            }
                            else if (tagCardType2.threeSame) //剩下三条
                            {
                                for (var k = 0; k < 3; k++) {
                                    btTemp[k] = midCard[k] = btCardData2[tagCardType2.snThreeSame[k]];
                                }
                                pokerLogic.removeCard(btTemp, 3, btCardData2, btCardCount2);
                                midCard[3] = btCardData2[0];
                                midCard[4] = btCardData2[1];
                                backCard[4] = btCardData2[2];
                            }
                            else {
                                for (var k = 0; k < 5; k++) {
                                    midCard[k] = btCardData2[k];
                                }
                                backCard[4] = btCardData2[5];
                            }
                            if (bFirst) {
                                if (pokerLogic.compareCard(frontCard, midCard, 3, 5, false) && pokerLogic.compareCard(midCard, backCard, 5, 5, false)) {
                                    threeSame = true;
                                    frontFrontCard = frontCard;
                                    frontMidCard = midCard;
                                    frontBackCard = backCard;
                                    btFrontAllShuiShu = this.threeDunAllShuiShu(frontFrontCard, frontMidCard, frontBackCard);
                                    bFirst = false;
                                }
                            }
                            else {
                                btAllShuiShu = this.threeDunAllShuiShu(frontCard, midCard, backCard);
                                if (pokerLogic.compareCard(frontCard, midCard, 3, 5, false) && pokerLogic.compareCard(midCard, backCard, 5, 5, false) &&
                                    (btAllShuiShu > btFrontAllShuiShu || (pokerLogic.compareCard(frontFrontCard, frontCard, 3, 3, false) && btAllShuiShu == btFrontAllShuiShu))) {
                                    threeSame = true;
                                    frontFrontCard = frontCard;
                                    frontMidCard = midCard;
                                    frontBackCard = backCard;
                                    btFrontAllShuiShu = btAllShuiShu;
                                }
                            }
                        }
                        if (threeSame == false) //头道不能为三条
                        {
                            for (var j = 0; j < tagCardType1.amGourd; j++)   //中道葫芦
                            {
                                btCardCount1 = btCardCount;
                                btCardData1 = btCardData;
                                for (var k = 0; k < 5; k++) {
                                    midCard[k] = btCardData1[tagCardType1.snGourd[j * 5 + k]];
                                }
                                pokerLogic.removeCard(midCard, 5, btCardData1, btCardCount1);
                                btCardCount2 = btCardCount1 -= 5;
                                btCardData2 = btCardData1;
                                tagCardType2 = this.getType(btCardData2, btCardCount2);
                                if (tagCardType2.twoPare)   //剩下两对
                                {
                                    backCard[4] = btCardData2[tagCardType2.snTwoPare[3]];
                                    for (var k = 0; k < 3; k++) {
                                        frontCard[k] = btCardData2[tagCardType2.snTwoPare[k]];
                                    }
                                }
                                else if (tagCardType2.onePare)  //剩下一对
                                {
                                    for (var k = 3; k >= 0; k--) {
                                        if (ctoType.getCardLogicValue(btCardData2[k]) != ctoType.getCardLogicValue(btCardData2[tagCardType2.snOnePare[0]])) {
                                            btTemp[0] = backCard[4] = btCardData2[k];
                                            break;
                                        }
                                    }
                                    pokerLogic.removeCard(btTemp, 1, btCardData2, btCardCount2);
                                    frontCard = btCardData2;
                                }
                                else    //剩下散牌 
                                {
                                    backCard[4] = btCardData2[3];
                                    frontCard = btCardData2;
                                }
                                if (bFirst) {
                                    if (pokerLogic.compareCard(frontCard, midCard, 3, 5, false) && pokerLogic.compareCard(midCard, backCard, 5, 5, false)) {
                                        frontFrontCard = frontCard;
                                        frontMidCard = midCard;
                                        frontBackCard = backCard;
                                        btFrontAllShuiShu = this.threeDunAllShuiShu(frontFrontCard, frontMidCard, frontBackCard);
                                        bFirst = false;
                                    }
                                }
                                else {
                                    btAllShuiShu = this.threeDunAllShuiShu(frontCard, midCard, backCard);
                                    if (pokerLogic.compareCard(frontCard, midCard, 3, 5, false) && pokerLogic.compareCard(midCard, backCard, 5, 5, false) &&
                                        (btAllShuiShu > btFrontAllShuiShu || (pokerLogic.compareCard(frontFrontCard, frontCard, 3, 3, false) && btAllShuiShu == btFrontAllShuiShu))) {
                                        frontFrontCard = frontCard;
                                        frontMidCard = midCard;
                                        frontBackCard = backCard;
                                        btFrontAllShuiShu = btAllShuiShu;
                                    }
                                }
                            }
                        }
                    }
                    else if (tagCardType1.flush)    //有同花
                    {
                        var threeSame = false;
                        if (tagCardType1.threeSame) //有三条
                        {
                            for (var j = 0; j < tagCardType1.amThreeSame; j++) //头道三条
                            {
                                btCardCount1 = btCardCount;
                                btCardData1 = btCardData;

                                for (var k = 0; k < 3; k++) {
                                    frontCard[k] = btCardData1[tagCardType1, snThreeSame[j * 3 + k]];
                                }
                                pokerLogic.removeCard(frontCard, 3, btCardData1, btCardCount1);
                                btCardCount2 = btCardCount1 -= 3;
                                btCardData2 = btCardData1;
                                tagCardType2 = this.getType(btCardData2, btCardCount2);
                                if (tagCardType2.flush)        //剩下同花
                                {
                                    for (var k = 0; k < 5; k++) {
                                        btTemp[k] = midCard[k] = btCardData2[tagCardType2.snFlush[k]];
                                    }
                                    pokerLogic.removeCard(btTemp, 5, btCardData2, btCardCount2);
                                    backCard[4] = btCardData2[0];
                                }
                                else if (tagCardType2.straight)     //剩下顺子
                                {
                                    for (var k = 0; k < 5; k++) {
                                        btTemp[k] = MidCard[k] = btCardData2[tagCardType2.snStraight[k]];
                                    }
                                    pokerLogic.removeCard(btTemp, 5, btCardData2, btCardCount2);
                                    backCard[4] = btCardData2[0];
                                }
                                else                                //其他
                                {
                                    for (var k = 0; k < 5; k++) {
                                        midCard[k] = btCardData2[k];
                                    }
                                    backCard[4] = btCardData2[5];
                                }
                                if (bFirst) {
                                    if (pokerLogic.compareCard(frontCard, midCard, 3, 5, false) && pokerLogic.compareCard(midCard, backCard, 5, 5, false)) {
                                        threeSame = true;
                                        frontFrontCard = frontCard;
                                        frontMidCard = midCard;
                                        frontBackCard = backCard;
                                        btFrontAllShuiShu = this.threeDunAllShuiShu(frontFrontCard, frontMidCard, frontBackCard);
                                        bFirst = false;
                                    }
                                }
                                else {
                                    btAllShuiShu = this.threeDunAllShuiShu(frontCard, midCard, backCard);
                                    if (pokerLogic.compareCard(frontCard, midCard, 3, 5, false) && pokerLogic.compareCard(midCard, backCard, 5, 5, false) && (btAllShuiShu > btFrontAllShuiShu
                                        || (pokerLogic.compareCard(frontFrontCard, frontCard, 3, 3, false) && btAllShuiShu == btFrontAllShuiShu))) {
                                        threeSame = true;
                                        frontFrontCard = frontCard;
                                        frontMidCard = midCard;
                                        frontBackCard = backCard;
                                        btFrontAllShuiShu = btAllShuiShu;
                                    }
                                }
                            }
                        }
                        if (threeSame == false) {  //头道不能为三条
                            for (var j = 0; j < tagCArdType1.amFlush; j++) {    //中道同花
                                btCardCount1 = btCardCount;
                                btCardData1 = btCardData;
                                for (var k = 0; k < 5; k++) {
                                    midCard[k] = btCardData1[tagCardType1.snFlush[j * 5 + k]];
                                }
                                pokerLogic.removeCard(midCard, 5, btCardData1, btCardCount1);
                                btCardCount2 = btCardCount1 -= 5;
                                btCardData2 = btCardData1;
                                tagCardType2 = this.getType(btCardData2, btCardCount2);
                                if (tagCardType2.twoPare)            //剩下两对
                                {
                                    backCard[4] = btCardData2[tagCardType2.snTwoPare[3]];
                                    for (var k = 0; k < 3; k++) {
                                        frontCard[k] = btCardData2[tagCardType2.snTwoPare[k]];
                                    }
                                }
                                else if (tagCardType2.onePare)       //剩下一对
                                {
                                    for (var k = 3; k >= 0; k--) {
                                        if (ctoType.getCardLogicValue(btCardData2[k]) != ctoType.getCardLogicValue(btCardData2[tagCardType2.snOnePare[0]])) {
                                            btTemp[0] = backCard[4] = btCardData2[k];
                                            break;
                                        }
                                    }
                                    pokerLogic.removeCard(btTemp, 1, btCardData2, btCardCount2);
                                    frontCard = btCardData2;
                                }
                                else                                 //剩下散牌
                                {
                                    backCard[4] = btCardData2[3];
                                    frontCard = btCardData2;
                                }
                                if (bFirst) {
                                    if (pokerLogic.compareCard(frontCard, midCard, 3, 5, false) && pokerLogic.compareCard(midCard, backCard, 5, 5, false)) {
                                        frontFrontCard = frontCard;
                                        frontMidCard = midCard;
                                        frontBackCard = backCard;
                                        btFrontAllShuiShu = this.threeDunAllShuiShu(frontFrontCard, frontMidCard, frontBackCard);
                                        bFirst = false;
                                    }
                                }
                                else {
                                    btAllShuiShu = this.threeDunAllShuiShu(frontCard, midCard, backCard);
                                    if (pokerLogic.compareCard(frontCard, midCard, 3, 5, false) && pokerLogic.compareCard(midCard, backCard, 5, 5, false) && (btAllShuiShu > btFrontAllShuiShu
                                        || (pokerLogic.compareCard(frontFrontCard, frontCard, 3, 3, false) && btAllShuiShu == btFrontAllShuiShu))) {
                                        frontFrontCard = frontCard;
                                        frontMidCard = midCard;
                                        frontBackCard = backCard;
                                        btFrontAllShuiShu = btAllShuiShu;
                                    }
                                }
                            }
                            if (tagCardType1.straight) { //有顺子
                                for (var j = 0; j < tagCardType1.amStraight; j++) { //中道顺子
                                    btCardCount1 = btCardCount;
                                    btCardData1 = btCardData;
                                    for (var k = 0; k < 5; k++) {
                                        midCard[k] = btCardData1[tagCardType1.snStraight[j * 5 + k]];
                                    }
                                    pokerLogic.removeCard(midCard, 5, btCardData1, btCardCount1);
                                    btCardCount2 = btCardCount1 -= 5;
                                    btCardData2 = btCardData1;
                                    tagCardType2 = this.getType(btCardData2, btCardCount2);
                                    if (tagCardType2.twoPare)            //剩下两对
                                    {
                                        backCard[4] = btCardData2[tagCardType2.snTwoPare[3]];
                                        for (var k = 0; k < 3; k++) {
                                            frontCard[k] = btCardData2[tagCardType2.snTwoPare[k]];
                                        }
                                    }
                                    else if (tagCardType2.onePare)       //剩下一对
                                    {
                                        for (var k = 3; k >= 0; k--) {
                                            if (ctoType.getCardLogicValue(btCardData2[k]) != ctoType.getCardLogicValue(btCardData2[tagCardType2.snOnePare[0]])) {
                                                btTemp[0] = BackCard[4] = btCardData2[k];
                                                break;
                                            }
                                        }
                                        pokerLogic.removeCard(btTemp, 1, btCardData2, btCardCount2);
                                        frontCard = btCardData2;
                                    }
                                    else                                 //剩下散牌
                                    {
                                        backCard[4] = btCardData2[3];
                                        frontCard = btCardData2;
                                    }
                                    if (bFirst) {
                                        if (pokerLogic.compareCard(frontCard, midCard, 3, 5, false) && pokerLogic.compareCard(midCard, backCard, 5, 5, false)) {
                                            frontFrontCard = frontCard;
                                            frontMidCard = midCard;
                                            frontBackCard = backCard;
                                            btFrontAllShuiShu = this.threeDunAllShuiShu(frontFrontCard, frontMidCard, frontBackCard);
                                            bFirst = false;
                                        }
                                    }
                                    else {
                                        btAllShuiShu = this.threeDunAllShuiShu(frontCard, midCard, backCard);
                                        if (pokerLogic.compareCard(frontCard, midCard, 3, 5, false) && pokerLogic.compareCard(midCard, backCard, 5, 5, false) && (btAllShuiShu > btFrontAllShuiShu
                                            || (pokerLogic.compareCard(frontFrontCard, frontCard, 3, 3, false) && btAllShuiShu == btFrontAllShuiShu))) {
                                            frontFrontCard = frontCard;
                                            frontMidCard = midCard;
                                            frontBackCard = backCard;
                                            btFrontAllShuiShu = btAllShuiShu;
                                        }
                                    }
                                }
                            }
                            if (tagCardType1.threeSame)                //有三条
                            {
                                for (var j = 0; j < tagCardType1.amThreeSame; j++)    //中道三条
                                {
                                    btCardCount1 = btCardCount;
                                    btCardData1 = btCardData;
                                    for (var k = 0; k < 3; k++) {
                                        midCard[k] = btCardData1[tagCardType1.snThreeSame[j * 3 + k]];
                                    }
                                    pokerLogic.removeCard(midCard, 3, btCardData1, btCardCount1);
                                    midCard[3] = btCardData1[3];
                                    midCard[4] = btCardData1[4];
                                    btCardCount2 = btCardCount1 -= 5;
                                    btCardData2 = btCardData1;
                                    //剩下散牌
                                    backCard[4] = btCardData2[3];
                                    frontCard = btCardData2;
                                    if (bFirst) {
                                        if (pokerLogic.compareCard(frontCard, midCard, 3, 5, false) && pokerLogic.compareCard(midCard, backCard, 5, 5, false)) {
                                            frontFrontCard = frontCard;
                                            frontMidCard = midCard;
                                            frontBackCard = backCard;
                                            btFrontAllShuiShu = this.threeDunAllShuiShu(frontFrontCard, frontMidCard, frontBackCard);
                                            bFirst = false;
                                        }
                                    }
                                    else {
                                        btAllShuiShu = this.threeDunAllShuiShu(frontCard, midCard, backCard);
                                        if (pokerLogic.compareCard(frontCard, midCard, 3, 5, false) && pokerLogic.compareCard(midCard, backCard, 5, 5, false) && (btAllShuiShu > btFrontAllShuiShu
                                            || (pokerLogic.compareCard(frontFrontCard, frontCard, 3, 3, false) && btAllShuiShu == btFrontAllShuiShu))) {
                                            frontFrontCard = frontCard;
                                            frontMidCard = midCard;
                                            frontBackCard = backCard;
                                            btFrontAllShuiShu = btAllShuiShu;
                                        }
                                    }
                                }
                            }
                        }
                    }
                    else if (tagCardType1.straight)      //有顺子
                    {
                        var threeSame = false;
                        if (tagCardType1.threeSame)      //有三条
                        {
                            for (var j = 0; j < tagCardType1.amThreeSame; j++)     //头道三条
                            {
                                btCardCount1 = btCardCount;
                                btCardData1 = btCardData;

                                for (var k = 0; k < 3; k++) {
                                    frontCard[k] = btCardData1[tagCardType1.snThreeSame[j * 3 + k]];
                                }
                                pokerLogic.removeCard(frontCard, 3, btCardData1, btCardCount1);
                                btCardCount2 = btCardCount1 -= 3;
                                btCardData2 = btCardData1;
                                tagCardType2 = this.getType(btCardData2, btCardCount2);
                                if (tagCardType2.straight)     //剩下顺子
                                {
                                    for (var k = 0; k < 5; k++) {
                                        btTemp[k] = MidCard[k] = btCardData2[tagCardType2.snStraight[k]];
                                    }
                                    pokerLogic.removeCard(btTemp, 5, btCardData2, btCardCount2);
                                    backCard[4] = btCardData2[0];
                                }
                                else                                //其他
                                {
                                    for (var k = 0; k < 5; k++) {
                                        midCard[k] = btCardData2[k];
                                    }
                                    backCard[4] = btCardData2[5];
                                }
                                if (bFirst) {
                                    if (pokerLogic.compareCard(frontCard, midCard, 3, 5, false) && pokerLogic.compareCard(midCard, backCard, 5, 5, false)) {
                                        threeSame = true;
                                        frontFrontCard = frontCard;
                                        frontMidCard = midCard;
                                        frontBackCard = backCard;
                                        btFrontAllShuiShu = this.threeDunAllShuiShu(frontFrontCard, frontMidCard, frontBackCard);
                                        bFirst = false;
                                    }
                                }
                                else {
                                    btAllShuiShu = this.threeDunAllShuiShu(frontCard, midCard, backCard);
                                    if (pokerLogic.compareCard(frontCard, midCard, 3, 5, false) && pokerLogic.compareCard(midCard, backCard, 5, 5, false) && (btAllShuiShu > btFrontAllShuiShu
                                        || (pokerLogic.compareCard(frontFrontCard, frontCard, 3, 3, false) && btAllShuiShu == btFrontAllShuiShu))) {
                                        threeSame = true;
                                        frontFrontCard = frontCard;
                                        frontMidCard = midCard;
                                        frontBackCard = backCard;
                                        btFrontAllShuiShu = btAllShuiShu;
                                    }
                                }
                            }
                        }
                        if (threeSame == false)                          //头道不能为三条
                        {
                            for (var j = 0; j < tagCardType1.amStraight; j++)    //中道顺子
                            {
                                btCardCount1 = btCardCount;
                                btCardData1 = btCardData;
                                for (var k = 0; k < 5; k++) {
                                    midCard[k] = btCardData1[tagCardType1.snStraight[j * 5 + k]];
                                }
                                pokerLogic.removeCard(midCard, 5, btCardData1, btCardCount1);
                                btCardCount2 = btCardCount1 -= 5;
                                btCardData2 = btCardData1;
                                tagCardType2 = this.getType(btCardData2, btCardCount2);
                                if (tagCardType2.twoPare)            //剩下两对
                                {
                                    backCard[4] = btCardData2[tagCardType2.snTwoPare[3]];
                                    for (var k = 0; k < 3; k++) {
                                        frontCard[k] = btCardData2[tagCardType2.snTwoPare[k]];
                                    }
                                }
                                else if (tagCardType2.onePare)       //剩下一对
                                {
                                    for (var k = 3; k >= 0; k--) {
                                        if (ctoType.getCardLogicValue(btCardData2[k]) != ctoType.getCardLogicValue(btCardData2[tagCardType2.snOnePare[0]])) {
                                            btTemp[0] = backCard[4] = btCardData2[k];
                                            break;
                                        }
                                    }
                                    pokerLogic.removeCard(btTemp, 1, btCardData2, btCardCount2);
                                    frontCard = btCardData2;
                                }
                                else                                 //剩下散牌
                                {
                                    backCard[4] = btCardData2[3];
                                    frontCard = btCardData2;
                                }
                                if (bFirst) {
                                    if (pokerLogic.compareCard(frontCard, midCard, 3, 5, false) && pokerLogic.compareCard(midCard, backCard, 5, 5, false)) {
                                        frontFrontCard = frontCard;
                                        frontMidCard = midCard;
                                        frontBackCard = backCard;
                                        btFrontAllShuiShu = this.threeDunAllShuiShu(frontFrontCard, frontMidCard, frontBackCard);
                                        bFirst = false;
                                    }
                                }
                                else {
                                    btAllShuiShu = this.threeDunAllShuiShu(frontCard, midCard, backCard);
                                    if (pokerLogic.compareCard(frontCard, midCard, 3, 5, false) && pokerLogic.compareCard(midCard, backCard, 5, 5, false) && (btAllShuiShu > btFrontAllShuiShu
                                        || (pokerLogic.compareCard(frontFrontCard, frontCard, 3, 3, false) && btAllShuiShu == btFrontAllShuiShu))) {
                                        frontFrontCard = frontCard;
                                        frontMidCard = midCard;
                                        frontBackCard = backCard;
                                        btFrontAllShuiShu = btAllShuiShu;
                                    }
                                }
                            }
                            if (tagCardType1.threeSame)                //有三条
                            {
                                for (var j = 0; j < tagCardType1.amThreeSame; j++)    //中道三条
                                {
                                    btCardCount1 = btCardCount;
                                    btCardData1 = btCardData;
                                    for (var k = 0; k < 3; k++) {
                                        midCard[k] = btCardData1[tagCardType1.snThreeSame[j * 3 + k]];
                                    }
                                    pokerLogic.removeCard(midCard, 3, btCardData1, btCardCount1);
                                    midCard[3] = btCardData1[3];
                                    midCard[4] = btCardData1[4];
                                    btCardCount2 = btCardCount1 -= 5;
                                    btCardData2 = btCardData1;
                                    //剩下散牌
                                    backCard[4] = btCardData2[3];
                                    frontCard = btCardData2;
                                    if (bFirst) {
                                        if (pokerLogic.compareCard(frontCard, midCard, 3, 5, false) && pokerLogic.compareCard(midCard, backCard, 5, 5, false)) {
                                            frontFrontCard = frontCard;
                                            frontMidCard = midCard;
                                            frontBackCard = backCard;
                                            btFrontAllShuiShu = this.threeDunAllShuiShu(frontFrontCard, frontMidCard, frontBackCard);
                                            bFirst = false;
                                        }
                                    }
                                    else {
                                        btAllShuiShu = this.threeDunAllShuiShu(frontCard, midCard, backCard);
                                        if (pokerLogic.compareCard(frontCard, midCard, 3, 5, false) && pokerLogic.compareCard(midCard, backCard, 5, 5, false) && (btAllShuiShu > btFrontAllShuiShu
                                            || (pokerLogic.compareCard(frontFrontCard, frontCard, 3, 3, false) && btAllShuiShu == btFrontAllShuiShu))) {
                                            frontFrontCard = frontCard;
                                            frontMidCard = midCard;
                                            frontBackCard = backCard;
                                            btFrontAllShuiShu = btAllShuiShu;
                                        }
                                    }
                                }
                            }
                        }
                    }
                    else if (tagCardType1.threeSame)    //有三条
                    {
                        for (var j = 0; j < tagCardType1.amThreeSame; j++)    //中道三条
                        {
                            btCardCount1 = btCardCount;
                            btCardData1 = btCardData;
                            for (var k = 0; k < 3; k++) {
                                midCard[k] = btCardData1[tagCardType1.snThreeSame[j * 3 + k]];
                            }
                            pokerLogic.removeCard(midCard, 3, btCardData1, btCardCount1);
                            midCard[3] = btCardData1[3];
                            midCard[4] = btCardData1[4];
                            backCard[4] = btCardData1[5];
                            frontCard = btCardData1;
                            if (bFirst) {
                                if (pokerLogic.compareCard(frontCard, midCard, 3, 5, false) && pokerLogic.compareCard(midCard, backCard, 5, 5, false)) {
                                    frontFrontCard = frontCard;
                                    frontMidCard = midCard;
                                    frontBackCard = backCard;
                                    btFrontAllShuiShu = this.threeDunAllShuiShu(frontFrontCard, frontMidCard, frontBackCard);
                                    bFirst = false;
                                }
                            }
                            else {
                                btAllShuiShu = this.threeDunAllShuiShu(frontCard, midCard, backCard);
                                if (pokerLogic.compareCard(frontCard, midCard, 3, 5, false) && pokerLogic.compareCard(midCard, backCard, 5, 5, false) && (btAllShuiShu > btFrontAllShuiShu
                                    || (pokerLogic.compareCard(frontFrontCard, frontCard, 3, 3, false) && btAllShuiShu == btFrontAllShuiShu))) {
                                    frontFrontCard = frontCard;
                                    frontMidCard = midCard;
                                    frontBackCard = backCard;
                                    btFrontAllShuiShu = btAllShuiShu;
                                }
                            }
                        }
                    }
                    else if (tagCardType1.twoPare)  //有两对
                    {
                        if (tagCardType1.amOnePare >= 3) {
                            btCardCount1 = btCardCount;
                            btCardData1 = btCardData;
                            btTemp[0] = frontCard[0] = btCardData1[tagCardType1.snOnePare[0]];
                            btTemp[1] = frontCard[1] = btCardData1[tagCardType1.snOnePare[1]];
                            btTemp[2] = midCard[0] = btCardData1[tagCardType1.snOnePare[2]];
                            btTemp[3] = midCard[1] = btCardData1[tagCardType1.snOnePare[3]];
                            btTemp[4] = midCard[2] = btCardData1[tagCardType1.snOnePare[4]];
                            btTemp[5] = midCard[3] = btCardData1[tagCardType1.snOnePare[5]];
                            pokerLogic.removeCard(btTemp, 6, btCardData1, btCardCount1);
                            frontCard[2] = btCardData1[0];
                            midCard[4] = btCardData1[1];
                            if (bFirst) {
                                if (pokerLogic.compareCard(frontCard, midCard, 3, 5, false) && pokerLogic.compareCard(midCard, backCard, 5, 5, false)) {
                                    frontFrontCard = frontCard;
                                    frontMidCard = midCard;
                                    frontBackCard = backCard;
                                    btFrontAllShuiShu = this.threeDunAllShuiShu(frontFrontCard, frontMidCard, frontBackCard);
                                    bFirst = false;
                                }
                            }
                            else {
                                btAllShuiShu = this.threeDunAllShuiShu(frontCard, midCard, backCard);
                                if (pokerLogic.compareCard(frontCard, midCard, 3, 5, false) && pokerLogic.compareCard(midCard, backCard, 5, 5, false) &&
                                    (btAllShuiShu > btFrontAllShuiShu || (pokerLogic.compareCard(frontFrontCard, frontCard, 3, 3, false) && btAllShuiShu == btFrontAllShuiShu))) {
                                    frontFrontCard = frontCard;
                                    frontMidCard = midCard;
                                    frontBackCard = backCard;
                                    btFrontAllShuiShu = btAllShuiShu;
                                }
                            }
                        }
                        else {
                            for (var j = 0; j < tagCardType1.amTwoPare; j++) //中道两对
                            {
                                btCardCount1 = btCardCount;
                                btCardData1 = btCardData;
                                for (var k = 0; k < 4; k++) {
                                    midCard[k] = btCardData1[tagCardType1.snTwoPare[j * 4 + k]];
                                }
                                pokerLogic.removeCard(midCard, 4, btCardData1, btCardCount1);
                                btCardCount2 = btCardCount1 -= 4;
                                btCardData2 = btCardData1;

                                tagCardType2 = this.getType(btCardData2, btCardCount2);
                                if (tagCardType2.twoPare)   //剩下两对
                                {
                                    midCard[4] = btCardData2[tagCardType2.snTwoPare[3]];
                                    frontCard[0] = btCardData2[tagCardType2.snTwoPare[0]];
                                    frontCard[1] = btCardData2[tagCardType2.snTwoPare[1]];
                                    frontCard[2] = btCardData2[tagCardType2.snTwoPare[2]];
                                }
                                else if (tagCardType2.onePare)  //剩下一对
                                {
                                    btTemp[0] = frontCard[0] = btCardData2[tagCardType2.snOnePare[0]];
                                    btTemp[1] = frontCard[1] = btCardData2[tagCardType2.snOnePare[1]];
                                    pokerLogic.removeCard(btTemp, 2, btCardData2, btCardCount2);
                                    frontCard[2] = btCardData2[0];
                                    midCard[4] = btCardData2[1];
                                    backCard[4] = btCardData2[2];
                                }
                                else {   //剩下散牌
                                    midCard[4] = btCardData2[3];
                                    backCard[4] = btCardData2[4]
                                }
                                if (bFirst) {
                                    if (pokerLogic.compareCard(frontCard, midCard, 3, 5, false) && pokerLogic.compareCard(midCard, backCard, 5, 5, false)) {
                                        frontFrontCard = frontCard;
                                        frontMidCard = midCard;
                                        frontBackCard = backCard;
                                        btFrontAllShuiShu = this.threeDunAllShuiShu(frontFrontCard, frontMidCard, frontBackCard);
                                        bFirst = false;
                                    }
                                }
                                else {
                                    btAllShuiShu = this.threeDunAllShuiShu(frontCard, midCard, backCard);
                                    if (pokerLogic.compareCard(frontCard, midCard, 3, 5, false) && pokerLogic.compareCard(midCard, backCard, 5, 5, false) &&
                                        (btAllShuiShu > btFrontAllShuiShu || (pokerLogic.compareCard(frontFrontCard, frontCard, 3, 3, false) && btAllShuiShu == btFrontAllShuiShu))) {
                                        frontFrontCard = frontCard;
                                        frontMidCard = midCard;
                                        frontBackCard = backCard;
                                        btFrontAllShuiShu = btAllShuiShu;
                                    }
                                }
                            }
                        }
                    }
                    else if (tagCardType1.onePare)  //有一对
                    {
                        for (var j = 0; j < tagCardType1.amOnePare; j++)   //中道一对
                        {
                            btCardCount1 = btCardCount;
                            btCardData1 = btCardData;
                            for (var k = 0; k < 2; k++) {
                                midCard[k] = btCardData1[tagCardType1.snOnePare[j * 2 + k]];
                            }
                            pokerLogic.removeCard(midCard, 2, btCardData1, btCardCount1);
                            btCardCount2 = btCardCount1 -= 2;
                            btCardData2 = btCardData1;

                            backCard[4] = btCardData2[6];
                            midCard[2] = btCardData2[5];
                            midCard[3] = btCardData2[4];
                            midCard[4] = btCardData2[3];
                            frontCard = btCardData2;
                            if (bFirst) {
                                if (pokerLogic.compareCard(frontCard, midCard, 3, 5, false) && pokerLogic.compareCard(midCard, backCard, 5, 5, false)) {
                                    frontFrontCard = frontCard;
                                    frontMidCard = midCard;
                                    frontBackCard = backCard;
                                    btFrontAllShuiShu = this.threeDunAllShuiShu(frontFrontCard, frontMidCard, frontBackCard);
                                    bFirst = false;
                                }
                            }
                            else {
                                btAllShuiShu = this.threeDunAllShuiShu(frontCard, midCard, backCard);
                                if (pokerLogic.compareCard(frontCard, midCard, 3, 5, false) && pokerLogic.compareCard(midCard, backCard, 5, 5, false) &&
                                    (btAllShuiShu > btFrontAllShuiShu || (pokerLogic.compareCard(frontFrontCard, frontCard, 3, 3, false) && btAllShuiShu == btFrontAllShuiShu))) {
                                    frontFrontCard = frontCard;
                                    frontMidCard = midCard;
                                    frontBackCard = backCard;
                                    btFrontAllShuiShu = btAllShuiShu;
                                }
                            }
                        }
                    }
                    else    //散牌
                    {
                        btCardCount1 = btCardCount;
                        btCardData1 = btCardData;
                        backCard[4] = btCardData1[8];
                        midCard[0] = btCardData1[0];
                        midCard[1] = btCardData1[4];
                        midCard[2] = btCardData1[5];
                        midCard[3] = btCardData1[6];
                        midCard[4] = btCardData1[7];

                        frontCard[0] = btCardData1[1];
                        frontCard[1] = btCardData1[2];
                        frontCard[2] = btCardData1[3];
                        if (bFirst) {
                            if (pokerLogic.compareCard(frontCard, midCard, 3, 5, false) && pokerLogic.compareCard(midCard, backCard, 5, 5, false)) {
                                frontFrontCard = frontCard;
                                frontMidCard = midCard;
                                frontBackCard = backCard;
                                btFrontAllShuiShu = this.threeDunAllShuiShu(frontFrontCard, frontMidCard, frontBackCard);
                                bFirst = false;
                            }
                        }
                        else {
                            btAllShuiShu = this.threeDunAllShuiShu(frontCard, midCard, backCard);
                            if (pokerLogic.compareCard(frontCard, midCard, 3, 5, false) && pokerLogic.compareCard(midCard, backCard, 5, 5, false) && (btAllShuiShu > btFrontAllShuiShu
                                || (pokerLogic.compareCard(frontFrontCard, frontCard, 3, 3, false) && btAllShuiShu == btFrontAllShuiShu))) {
                                frontFrontCard = frontCard;
                                frontMidCard = midCard;
                                frontBackCard = backCard;
                                btFrontAllShuiShu = btAllShuiShu;
                            }
                        }
                    }
                }
            }
        }
        else if (tagCardType.gourd) {    //有葫芦
            var threeSame = false
            for (var i = 0; i < tagCardType.amThreeSame; i++) {
                btCardData = btHandCardData;
                btCardCount = btHandCardCount;
                for (var j = 0; j < 3; j++) {
                    frontCard[j] = btCardData[tagCardType.snThreeSame[i * 3 + j]];
                }
                pokerLogic.removeCard(frontCard, 3, btCardData, btCardCount);
                btCardCount1 = btCardCount -= 3;
                btCardData1 = btCardData;
                tagCardType1 = this.getType(btCardData1, btCardCount1);
                if (tagCardType1.gourd) //有葫芦
                {
                    for (var j = 0; j < tagCardType1.amGourd; j++) {
                        btCardCount1 = btCardCount;
                        btCardData1 = btCardData;
                        for (var k = 0; k < 5; k++) {
                            backCard[k] = btCardData1[tagCardType1.snGourd[j * 5 + k]];
                        }
                        pokerLogic.removeCard(backCard, 5, btCardData1, btCardCount1);
                        midCard = btCardData1;
                        if (bFirst) {
                            if (pokerLogic.compareCard(frontCard, midCard, 3, 5, false) && pokerLogic.compareCard(midCard, backCard, 5, 5, false)) {
                                threeSame = true;
                                frontFrontCard = frontCard;
                                frontMidCard = midCard;
                                frontBackCard = backCard;
                                bFirst = false;
                            }
                        }
                        else {
                            if (pokerLogic.compareCard(frontCard, midCard, 3, 5, false) && pokerLogic.compareCard(midCard, backCard, 5, 5, false) &&
                                this.isBiggerThanFront(frontFrontCard, frontMidCard, frontBackCard, frontCard, midCard, backCard)) {
                                threeSame = true;
                                frontFrontCard = frontCard;
                                frontMidCard = midCard;
                                frontBackCard = backCard;
                                btFrontAllShuiShu = btAllShuiShu;
                            }
                        }
                    }
                }
                if (tagCardType1.flush) //有同花
                {
                    for (var j = 0; j < tagCardType1.flush; j++) {
                        btCardCount1 = btCardCount;
                        btCardData1 = btCardData;
                        for (var k = 0; k < 5; k++) {
                            backCard[k] = btCardData1[tagCardType1.snFlush[j * 5 + k]];
                        }
                        pokerLogic.removeCard(backCard, 5, btCardData1, btCardCount1);
                        midCard = btCardData1;
                        if (bFirst) {
                            if (pokerLogic.compareCard(frontCard, midCard, 3, 5, false) && pokerLogic.compareCard(midCard, backCard, 5, 5, false)) {
                                threeSame = true;
                                frontFrontCard = frontCard;
                                frontMidCard = midCard;
                                frontBackCard = backCard;
                                bFirst = false;
                            }
                        }
                        else {
                            if (pokerLogic.compareCard(frontCard, midCard, 3, 5, false) && pokerLogic.compareCard(midCard, backCard, 5, 5, false) &&
                                this.isBiggerThanFront(frontFrontCard, frontMidCard, frontBackCard, frontCard, midCard, backCard)) {
                                threeSame = true;
                                frontFrontCard = frontCard;
                                frontMidCard = midCard;
                                frontBackCard = backCard;
                                btFrontAllShuiShu = btAllShuiShu;
                            }
                        }
                    }
                }
                if (tagCardType1.straight) //有顺子
                {
                    for (var j = 0; j < tagCardType1.amStraight; j++) {
                        btCardCount1 = btCardCount;
                        btCardData1 = btCardData;
                        for (var k = 0; k < 5; k++) {
                            backCard[k] = btCardData1[tagCardType1.snStraight[j * 5 + k]];
                        }
                        pokerLogic.removeCard(backCard, 5, btCardData1, btCardCount1);
                        midCard = btCardData1;
                        if (bFirst) {
                            if (pokerLogic.compareCard(frontCard, midCard, 3, 5, false) && pokerLogic.compareCard(midCard, backCard, 5, 5, false)) {
                                threeSame = true;
                                frontFrontCard = frontCard;
                                frontMidCard = midCard;
                                frontBackCard = backCard;
                                bFirst = false;
                            }
                        }
                        else {
                            if (pokerLogic.compareCard(frontCard, midCard, 3, 5, false) && pokerLogic.compareCard(midCard, backCard, 5, 5, false) &&
                                this.isBiggerThanFront(frontFrontCard, frontMidCard, frontBackCard, frontCard, midCard, backCard)) {
                                threeSame = true;
                                frontFrontCard = frontCard;
                                frontMidCard = midCard;
                                frontBackCard = backCard;
                                btFrontAllShuiShu = btAllShuiShu;
                            }
                        }
                    }
                }
                if (tagCardType1.threeSame) //有三条
                {
                    for (var j = 0; j < tagCardType1.amThreeSame; j++) {
                        btCardCount1 = btCardCount;
                        btCardData1 = btCardData;
                        for (var k = 0; k < 3; k++) {
                            backCard[k] = btCardData1[tagCardType1.threeSame[j * 3 + k]];
                        }
                        pokerLogic.removeCard(backCard, 3, btCardData1, btCardCount1);
                        btCardCount2 = btCardCount1 -= 3;
                        btCardData2 = btCardData1;
                        tagCardType2 = this.getType(btCardData2, btCardCount2);
                        if (tagCardType2.threeSame) {
                            for (var k = 0; k < tagCardType.amThreeSame; k++) {
                                for (var m = 0; m < 3; m++) {
                                    midCard[m] = btCardData2[tagCardType2.snThreeSame[k * 3 + m]];
                                }
                                pokerLogic.removeCard(midCard, 3, btCardData2, btCardCount2);
                                backCard[3] = btCardData2[2];
                                backCard[4] = btCardData2[3];
                                midCard[3] = btCardData2[0];
                                midCard[4] = btCardData2[1];
                                if (bFirst) {
                                    if (pokerLogic.compareCard(frontCard, midCard, 3, 5, false) && pokerLogic.compareCard(midCard, backCard, 5, 5, false)) {
                                        threeSame = true;
                                        frontFrontCard = frontCard;
                                        frontMidCard = midCard;
                                        frontBackCard = backCard;
                                        bFirst = false;
                                    }
                                }
                                else {
                                    if (pokerLogic.compareCard(frontCard, midCard, 3, 5, false) && pokerLogic.compareCard(midCard, backCard, 5, 5, false) &&
                                        this.isBiggerThanFront(frontFrontCard, frontMidCard, frontBackCard, frontCard, midCard, backCard)) {
                                        threeSame = true;
                                        frontFrontCard = frontCard;
                                        frontMidCard = midCard;
                                        frontBackCard = backCard;
                                        btFrontAllShuiShu = btAllShuiShu;
                                    }
                                }
                            }
                        }
                    }
                }
            }
            if (threeSame == false) {
                for (var i = 0; i < tagCardType.amGourd; i++) { //尾道为葫芦
                    btCardData = btHandCardData;
                    btCardCount = btHandCardCount;
                    for (var j = 0; j < 5; j++) {
                        backCard[j] = btCardData[tagCardType.snGourd[i * 5 + j]];
                    }
                    pokerLogic.removeCard(backCard, 5, btCardData, btCardCount);
                    btCardCount1 = btCardCount -= 5;
                    btCardData1 = btCardData;
                    tagCardType1 = this.getType(btCardData1, btCardCount1);
                    if (tagCardType1.gourd) //剩下葫芦
                    {
                        for (var j = 0; j < tagCardType1.amGourd; j++) {
                            btCardCount1 = btCardCount;
                            btCardData1 = btCardData;
                            for (var k = 0; k < 5; k++) {
                                midCard[k] = btCardData1[tagCardType1.snGourd[j * 5 + k]];
                            }
                            pokerLogic.removeCard(midCard, 5, btCardData1, btCardCount1);
                            frontCard = btCardData1;
                            if (bFirst) {
                                if (pokerLogic.compareCard(frontCard, midCard, 3, 5, false) && pokerLogic.compareCard(midCard, backCard, 5, 5, false)) {
                                    frontFrontCard = frontCard;
                                    frontMidCard = midCard;
                                    frontBackCard = backCard;
                                    bFirst = false;
                                }
                            }
                            else {
                                if (pokerLogic.compareCard(frontCard, midCard, 3, 5, false) && pokerLogic.compareCard(midCard, backCard, 5, 5, false) &&
                                    this.isBiggerThanFront(frontFrontCard, frontMidCard, frontBackCard, frontCard, midCard, backCard)) {
                                    frontFrontCard = frontCard;
                                    frontMidCard = midCard;
                                    frontBackCard = backCard;
                                }
                            }
                        }
                    }
                    if (tagCardType1.flush) //剩下同花
                    {
                        for (var j = 0; j < tagCardType1.amFlush; j++) {
                            btCardCount1 = btCardCount;
                            btCardData1 = btCardData;
                            for (var k = 0; k < 5; k++) {
                                midCard[k] = btCardData1[tagCardType1.snGourd[j * 5 + k]];
                            }
                            pokerLogic.removeCard(midCard, 5, btCardData1, btCardCount1);
                            frontCard = btCardData1;
                            if (bFirst) {
                                if (pokerLogic.compareCard(frontCard, midCard, 3, 5, false) && pokerLogic.compareCard(midCard, backCard, 5, 5, false)) {
                                    frontFrontCard = frontCard;
                                    frontMidCard = midCard;
                                    frontBackCard = backCard;
                                    bFirst = false;
                                }
                            }
                            else {
                                if (pokerLogic.compareCard(frontCard, midCard, 3, 5, false) && pokerLogic.compareCard(midCard, backCard, 5, 5, false) &&
                                    this.isBiggerThanFront(frontFrontCard, frontMidCard, frontBackCard, frontCard, midCard, backCard)) {
                                    frontFrontCard = frontCard;
                                    frontMidCard = midCard;
                                    frontBackCard = backCard;
                                }
                            }
                        }
                    }
                    if (tagCardType1.straight)  //剩下顺子
                    {
                        for (var j = 0; j < tagCardType1.amStraight; j++) {
                            btCardCount1 = btCardCount;
                            btCardData1 = btCardData;
                            for (var k = 0; k < 5; k++) {
                                midCard[k] = btCardData1[tagCardType1.snGourd[j * 5 + k]];
                            }
                            pokerLogic.removeCard(midCard, 5, btCardData1, btCardCount1);
                            frontCard = btCardData1;
                            if (bFirst) {
                                if (pokerLogic.compareCard(frontCard, midCard, 3, 5, false) && pokerLogic.compareCard(midCard, backCard, 5, 5, false)) {
                                    frontFrontCard = frontCard;
                                    frontMidCard = midCard;
                                    frontBackCard = backCard;
                                    bFirst = false;
                                }
                            }
                            else {
                                if (pokerLogic.compareCard(frontCard, midCard, 3, 5, false) && pokerLogic.compareCard(midCard, backCard, 5, 5, false) &&
                                    this.isBiggerThanFront(frontFrontCard, frontMidCard, frontBackCard, frontCard, midCard, backCard)) {
                                    frontFrontCard = frontCard;
                                    frontMidCard = midCard;
                                    frontBackCard = backCard;
                                }
                            }
                        }
                    }
                    if (tagCardType1.threeSame) //剩下三条
                    {
                        for (var j = 0; j < tagCardType1.amStraight; j++) {
                            btCardCount1 = btCardCount;
                            btCardData1 = btCardData;
                            for (var k = 0; k < 3; k++) {
                                midCard[k] = btCardData1[tagCardType1.snGourd[j * 3 + k]];
                            }
                            pokerLogic.removeCard(midCard, 3, btCardData1, btCardCount1);
                            btCardCount2 = btCardCount1 -= 3;
                            btCardData2 = btCardData1;
                            tagCardType2 = this.getType(btCardData2, btCardCount2);
                            if (tagCardType2.threeSame) //三条
                            {
                                for (var k = 0; k < 3; k++) {
                                    frontCard[k] = btCardData2[tagCardType2.snThreeSame[k]];
                                }
                                pokerLogic.removeCard(frontCard, 3, btCardData2, btCardCount2);
                                midCard[3] = btCardData2[0];
                                midCard[4] = btCardData2[1];
                            }
                            else if (tagCardType2.twoPare)  //两对
                            {
                                for (var k = 0; k < 4; k++) {
                                    if (k < 2) {
                                        btTemp[k] = frontCard[k] = btCardData2[tagCardType2.snTwoPare[k]];
                                    }
                                    else {
                                        btTemp[k] = midCard[k + 1] = btCardData2[tagCardType2.snTwoPare[k]];
                                    }
                                }
                                pokerLogic.removeCard(btTemp, 4, btCardData2, btCardCount2);
                                frontCard[2] = btCardData2[0];
                            }
                            else if (tagCardType2.onePare)  //一对
                            {
                                for (var k = 0; k < 2; k++) {
                                    btTemp[k] = frontCard[k] = btCardData2[tagCardType2.snOnePare[k]];
                                }
                                pokerLogic.removeCard(btTemp, 2, btCardData2, btCardCount2);
                                frontCard[2] = btCardData2[0];
                                midCard[3] = btCardData2[1];
                                midCard[4] = btCardData2[2];
                            }
                            else    //散牌
                            {
                                for (var k = 0; k < 5; k++) {
                                    if (k < 3) {
                                        frontCard[k] = btCardData2[k];
                                    }
                                    else {
                                        midCard[k] = btCardData2[k];
                                    }
                                }
                            }
                            if (bFirst) {
                                if (pokerLogic.compareCard(frontCard, midCard, 3, 5, false) && pokerLogic.compareCard(midCard, backCard, 5, 5, false)) {
                                    frontFrontCard = frontCard;
                                    frontMidCard = midCard;
                                    frontBackCard = backCard;
                                    bFirst = false;
                                }
                            }
                            else {
                                if (pokerLogic.compareCard(frontCard, midCard, 3, 5, false) && pokerLogic.compareCard(midCard, backCard, 5, 5, false) &&
                                    this.isBiggerThanFront(frontFrontCard, frontMidCard, frontBackCard, frontCard, midCard, backCard)) {
                                    frontFrontCard = frontCard;
                                    frontMidCard = midCard;
                                    frontBackCard = backCard;
                                }
                            }
                        }
                    }
                    if (tagCardType1.twoPare)   //剩下两对
                    {
                        if (tagCardType1.amOnePare >= 3) {
                            btCardCount1 = btCardCount;
                            btCardData1 = btCardData;
                            btTemp[0] = frontCard[0] = btCardData1[tagCardType.snOnePare[0]];
                            btTemp[1] = frontCard[1] = btCardData1[tagCardType.snOnePare[1]];
                            btTemp[2] = midCard[0] = btCardData1[tagCardType.snOnePare[2]];
                            btTemp[3] = midCard[1] = btCardData1[tagCardType.snOnePare[3]];
                            btTemp[4] = midCard[2] = btCardData1[tagCardType.snOnePare[4]];
                            btTemp[5] = midCard[3] = btCardData1[tagCardType.snOnePare[5]];
                            pokerLogic.removeCard(btTemp, 6, btCardData1, btCardCount1);
                            frontCard[2] = btCardData1[0];
                            midCard[4] = btCardData1[1];
                            if (bFirst) {
                                if (pokerLogic.compareCard(frontCard, midCard, 3, 5, false) && pokerLogic.compareCard(midCard, backCard, 5, 5, false)) {
                                    frontFrontCard = frontCard;
                                    frontMidCard = midCard;
                                    frontBackCard = backCard;
                                    bFirst = false;
                                }
                            }
                            else {
                                btAllShuiShu = this.threeDunAllShuiShu(frontCard, midCard, backCard);
                                if (pokerLogic.compareCard(frontCard, midCard, 3, 5, false) && pokerLogic.compareCard(midCard, backCard, 5, 5, false) &&
                                    this.isBiggerThanFront(frontFrontCard, frontMidCard, frontBackCard, frontCard, midCard, backCard)) {
                                    frontFrontCard = frontCard;
                                    frontMidCard = midCard;
                                    frontBackCard = backCard;
                                }
                            }
                        }
                        else {
                            for (var j = 0; j < tagCardType1.amTwoPare; j++) {
                                btCardCount1 = btCardCount;
                                btCardData1 = btCardData;
                                for (var k = 0; k < 4; k++) {
                                    midCard[k] = btCardData1[tagCardType1.snTwoPare[j * 4 + k]];
                                }
                                pokerLogic.removeCard(midCard, 4, btCardData1, btCardCount1);
                                btCardCount2 = btCardCount1 -= 4;
                                btCardData2 = btCardData1;
                                tagCardType2 = this.getType(btCardData2, btCardCount2);
                                if (tagCardType2.twoPare)   //两对
                                {
                                    for (var k = 0; k < 4; k++) {
                                        if (k < 3) {
                                            frontCard[k] = btCardData2[tagCardType2.snTwoPare[k]];
                                        }
                                        else {
                                            midCard[k + 1] = btCardData2[tagCardType2.snTwoPare[k]];
                                        }
                                    }
                                }
                                else if (tagCardType2.onePare)  //一对
                                {
                                    for (var k = 0; k < 2; k++) {
                                        btTemp[k] = frontCard[k] = btCardData2[tagCardType2.snOnePare[k]];
                                    }
                                    pokerLogic.removeCard(btTemp, 2, btCardData2, btCardCount2);
                                    frontCard[2] = btCardData2[0];
                                    midCard[4] = btCardData2[1];
                                }
                                else {   //散牌
                                    for (var k = 0; k < 4; k++) {
                                        if (k < 3) {
                                            frontCard[k] = btCardData2[k];
                                        }
                                        else {
                                            midCard[k + 1] = btCardData2[k];
                                        }
                                    }
                                }
                                if (bFirst) {
                                    if (pokerLogic.compareCard(frontCard, midCard, 3, 5, false) && pokerLogic.compareCard(midCard, backCard, 5, 5, false)) {
                                        frontFrontCard = frontCard;
                                        frontMidCard = midCard;
                                        frontBackCard = backCard;
                                        bFirst = false;
                                    }
                                }
                                else {
                                    if (pokerLogic.compareCard(frontCard, midCard, 3, 5, false) && pokerLogic.compareCard(midCard, backCard, 5, 5, false) &&
                                        this.isBiggerThanFront(frontFrontCard, frontMidCard, frontBackCard, frontCard, midCard, backCard)) {
                                        frontFrontCard = frontCard;
                                        frontMidCard = midCard;
                                        frontBackCard = backCard;
                                    }
                                }
                            }
                        }
                    }
                    if (tagCardType1.onePare)   //剩下一对
                    {
                        for (var j = 0; j < tagCardType1.amOnePare; j++) {
                            btCardCount1 = btCardCount;
                            btCardData1 = btCardData;
                            for (var k = 0; k < 2; k++) {
                                midCard[k] = btCardData1[tagCardType1.snOnePare[j * 2 + k]];
                            }
                            pokerLogic.removeCard(midCard, 2, btCardData1, btCardCount1);
                            btCardCount2 = btCardCount1 -= 2;
                            btCardData2 = btCardData1;
                            tagCardType2 = this.getType(btCardData2, btCardCount);
                            if (tagCardType2.onePare)   //一对
                            {
                                for (var k = 0; k < 2; k++) {
                                    btTemp[k] = frontCard[k] = btCardData2[tagCardType2.snOnePare[k]];
                                }
                                pokerLogic.removeCard(btTemp, 2, btCardData2, btCardCount2);
                                frontCard[2] = btCardData2[0];
                                midCard[2] = btCardData2[1];
                                midCard[3] = btCardData2[2];
                                midCard[4] = btCardData2[3];
                            }
                            else    //散牌
                            {
                                for (var k = 0; k < 6; k++) {
                                    if (k < 3) {
                                        frontCard[k] = btCardData2[k];
                                    }
                                    else {
                                        midCard[k - 1] = btCardData2[k];
                                    }
                                }
                            }
                            if (bFirst) {
                                if (pokerLogic.compareCard(frontCard, midCard, 3, 5, false) && pokerLogic.compareCard(midCard, backCard, 5, 5, false)) {
                                    frontFrontCard = frontCard;
                                    frontMidCard = midCard;
                                    frontBackCard = backCard;
                                    bFirst = false;
                                }
                            }
                            else {
                                if (pokerLogic.compareCard(frontCard, midCard, 3, 5, false) && pokerLogic.compareCard(midCard, backCard, 5, 5, false) &&
                                    this.isBiggerThanFront(frontFrontCard, frontMidCard, frontBackCard, frontCard, midCard, backCard)) {
                                    frontFrontCard = frontCard;
                                    frontMidCard = midCard;
                                    frontBackCard = backCard;
                                }
                            }
                        }
                    }
                    //散牌
                    btCardCount1 = btCardCount;
                    btCardData1 = btCardData;
                    midCard[0] = btCardData1[0];
                    midCard[1] = btCardData1[4];
                    midCard[2] = btCardData1[5];
                    midCard[3] = btCardData1[6];
                    midCard[4] = btCardData1[7];
                    frontCard[0] = btCardData1[1];
                    frontCard[1] = btCardData1[2];
                    frontCard[2] = btCardData1[3];
                    if (bFirst) {
                        if (pokerLogic.compareCard(frontCard, midCard, 3, 5, false) && pokerLogic.compareCard(midCard, backCard, 5, 5, false)) {
                            frontFrontCard = frontCard;
                            frontMidCard = midCard;
                            frontBackCard = backCard;
                            bFirst = false;
                        }
                    }
                    else {
                        if (pokerLogic.compareCard(frontCard, midCard, 3, 5, false) && pokerLogic.compareCard(midCard, backCard, 5, 5, false) &&
                            this.isBiggerThanFront(frontFrontCard, frontMidCard, frontBackCard, frontCard, midCard, backCard)) {
                            frontFrontCard = frontCard;
                            frontMidCard = midCard;
                            frontBackCard = backCard;
                        }
                    }
                }
                if (tagCardType.flush)  //尾道为同花
                {
                    for (var i = 0; i < tagCardType.amFlush; i++) {
                        btCardData = btHandCardData;
                        btCardCount = btHandCardCount;
                        for (var j = 0; j < 5; j++) {
                            backCard[j] = btCardData[tagCardType.snFlush[i * 5 + j]];
                        }
                        pokerLogic.removeCard(backCard, 5, btCardData, btCardCount);
                        btCardCount1 = btCardCount -= 5;
                        btCardData1 = btCardData;
                        tagCardType1 = this.getType(btCardData1, btCardCount1);
                        if (tagCardType1.flush) //剩下同花
                        {
                            for (var j = 0; j < tagCardType1.amFlush; j++) {
                                btCardCount1 = btCardCount;
                                btCardData1 = btCardData;
                                for (var k = 0; k < 5; k++) {
                                    midCard[k] = btCardData1[tagCardType1.snFlush[j * 5 + k]];
                                }
                                pokerLogic.removeCard(midCard, 5, btCardData1, btCardCount1);
                                frontCard = btCardData1;
                                if (bFirst) {
                                    if (pokerLogic.compareCard(frontCard, midCard, 3, 5, false) && pokerLogic.compareCard(midCard, backCard, 5, 5, false)) {
                                        frontFrontCard = frontCard;
                                        frontMidCard = midCard;
                                        frontBackCard = backCard;
                                        bFirst = false;
                                    }
                                }
                                else {
                                    if (pokerLogic.compareCard(frontCard, midCard, 3, 5, false) && pokerLogic.compareCard(midCard, backCard, 5, 5, false) &&
                                        this.isBiggerThanFront(frontFrontCard, frontMidCard, frontBackCard, frontCard, midCard, backCard)) {
                                        frontFrontCard = frontCard;
                                        frontMidCard = midCard;
                                        frontBackCard = backCard;
                                    }
                                }
                            }
                        }
                        if (tagCardType1.straight)  //剩下顺子
                        {
                            for (var j = 0; j < tagCardType1.amStraight; j++) {
                                btCardCount1 = btCardCount;
                                btCardData1 = btCardData;
                                for (var k = 0; k < 5; k++) {
                                    midCard[k] = btCardData1[tagCardType1.snStraight[j * 5 + k]];
                                }
                                pokerLogic.removeCard(midCard, 5, btCardData1, btCardCount1);
                                frontCard = btCardData1;
                                if (bFirst) {
                                    if (pokerLogic.compareCard(frontCard, midCard, 3, 5, false) && pokerLogic.compareCard(midCard, backCard, 5, 5, false)) {
                                        frontFrontCard = frontCard;
                                        frontMidCard = midCard;
                                        frontBackCard = backCard;
                                        bFirst = false;
                                    }
                                }
                                else {
                                    if (pokerLogic.compareCard(frontCard, midCard, 3, 5, false) && pokerLogic.compareCard(midCard, backCard, 5, 5, false) &&
                                        this.isBiggerThanFront(frontFrontCard, frontMidCard, frontBackCard, frontCard, midCard, backCard)) {
                                        frontFrontCard = frontCard;
                                        frontMidCard = midCard;
                                        frontBackCard = backCard;
                                    }
                                }
                            }
                        }
                        if (tagCardType1.threeSame) //剩下三条
                        {
                            for (var j = 0; j < tagCardType1.amThreeSame; j++) {
                                btCardCount1 = btCardCount;
                                btCardData1 = btCardData;
                                for (var k = 0; k < 3; k++) {
                                    midCard[k] = btCardData1[tagCardType1.snThreeSame[j * 3 + k]];
                                }
                                pokerLogic.removeCard(midCard, 3, btCardData1, btCardCount1);
                                btCardCount2 = btCardCount1 -= 3;
                                btCardData2 = btCardData1;
                                tagCardType2 = this.getType(btCardData2, btCardCount2);
                                if (tagCardType2.threeSame) //三条
                                {
                                    for (var k = 0; k < 3; k++) {
                                        frontCard[k] = btCardData2[tagCardType2.snThreeSame[k]];
                                    }
                                    pokerLogic.removeCard(frontCard, 3, btCardData2, btCardCount2);
                                    midCard[3] = btCardData2[0];
                                    midCard[4] = btCardData2[1];
                                }
                                else if (tagCardType2.twoPare)  //两对
                                {
                                    for (var k = 0; k < 4; k++) {
                                        if (k < 2) {
                                            btTemp[k] = frontCard[k] = btCardData2[tagCardType2.snTwoPare[k]];
                                        }
                                        else {
                                            btTemp[k] = midCard[k + 1] = btCardData2[tagCardType2.snTwoPare[k]];
                                        }
                                    }
                                    pokerLogic.removeCard(btTemp, 4, btCardData2, btCardCount);
                                    frontCard[2] = btCardData2[0];
                                }
                                else if (tagCardType2.onePare)  //一对
                                {
                                    for (var k = 0; k < 2; k++) {
                                        btTemp[k] = frontCard[k] = btCardData2[tagCardType2.snOnePare[k]];
                                    }
                                    pokerLogic.removeCard(btTemp, 2, btCardData2, btCardCount2);
                                    frontCard[2] = btCardData2[0];
                                    midCard[3] = btCardData2[1];
                                    midCard[4] = btCardData2[2];
                                }
                                else    //散牌
                                {
                                    for (var k = 0; k < 5; k++) {
                                        if (k < 3) {
                                            frontCard[k] = btCardData2[k];
                                        }
                                        else {
                                            midCard[k] = btCardData2[k];
                                        }
                                    }
                                }
                                if (bFirst) {
                                    if (pokerLogic.compareCard(frontCard, midCard, 3, 5, false) && pokerLogic.compareCard(midCard, backCard, 5, 5, false)) {
                                        frontFrontCard = frontCard;
                                        frontMidCard = midCard;
                                        frontBackCard = backCard;
                                        bFirst = false;
                                    }
                                }
                                else {
                                    if (pokerLogic.compareCard(frontCard, midCard, 3, 5, false) && pokerLogic.compareCard(midCard, backCard, 5, 5, false) &&
                                        this.isBiggerThanFront(frontFrontCard, frontMidCard, frontBackCard, frontCard, midCard, backCard)) {
                                        frontFrontCard = frontCard;
                                        frontMidCard = midCard;
                                        frontBackCard = backCard;
                                    }
                                }
                            }
                        }
                        if (tagCardType1.twoPare)   //剩下两对
                        {
                            if (tagCardType1.amOnePare >= 3) {
                                btCardCount1 = btCardCount;
                                btCardData1 = btCardData;
                                btTemp[0] = frontCard[0] = btCardData1[tagCardType1.snOnePare[0]];
                                btTemp[1] = frontCard[1] = btCardData1[tagCardType1.snOnePare[1]];
                                btTemp[2] = midCard[0] = btCardData1[tagCardType1.snOnePare[2]];
                                btTemp[3] = midCard[1] = btCardData1[tagCardType1.snOnePare[3]];
                                btTemp[4] = midCard[2] = btCardData1[tagCardType1.snOnePare[4]];
                                btTemp[5] = midCard[3] = btCardData1[tagCardType1.snOnePare[5]];
                                pokerLogic.removeCard(btTemp, 6, btCardData1, btCardCount1);
                                frontCard[2] = btCardData1[0];
                                midCard[4] = btCardData1[1];
                                if (bFirst) {
                                    if (pokerLogic.compareCard(frontCard, midCard, 3, 5, false) && pokerLogic.compareCard(midCard, backCard, 5, 5, false)) {
                                        frontFrontCard = frontCard;
                                        frontMidCard = midCard;
                                        frontBackCard = backCard;
                                        bFirst = false;
                                    }
                                }
                                else {
                                    if (pokerLogic.compareCard(frontCard, midCard, 3, 5, false) && pokerLogic.compareCard(midCard, backCard, 5, 5, false) &&
                                        this.isBiggerThanFront(frontFrontCard, frontMidCard, frontBackCard, frontCard, midCard, backCard)) {
                                        frontFrontCard = frontCard;
                                        frontMidCard = midCard;
                                        frontBackCard = backCard;
                                    }
                                }
                            }
                            else {
                                for (var j = 0; j < tagCardType1.amTwoPare; j++) {
                                    btCardCount1 = btCardCount;
                                    btCardData1 = btCardData;
                                    for (var k = 0; k < 4; k++) {
                                        midCard[k] = btCardData1[tagCardType1.snTwoPare[j * 4 + k]];
                                    }
                                    pokerLogic.removeCard(midCard, 4, btCardData1, btCardCount1);
                                    btCardCount2 = btCardCount1 -= 4;
                                    btCardData2 = btCardData1;
                                    tagCardType2 = this.getType(btCardData2, btCardCount2);
                                    if (tagCardType2.twoPare)   //两对
                                    {
                                        for (var k = 0; k < 4; k++) {
                                            if (k < 3) {
                                                frontCard[k] = btCardData2[tagCardType2.snTwoPare[k]];
                                            }
                                            else {
                                                midCard[k + 1] = btCardData2[tagCardType2.snTwoPare[k]];
                                            }
                                        }
                                    }
                                    else if (tagCardType2.onePare)  //一对
                                    {
                                        for (var k = 0; k < 2; k++) {
                                            btTemp[k] = frontCard[k] = btCardData2[tagCardType2.snOnePare[k]];
                                        }
                                        pokerLogic.removeCard(btTemp, 2, btCardData2, btCardCount2);
                                        frontCard[2] = btCardData2[0];
                                        midCard[4] = btCardData2[1];
                                    }
                                    else    //散牌
                                    {
                                        for (var k = 0; k < 4; k++) {
                                            if (k < 3) {
                                                frontCard[k] = btCardData2[k];
                                            }
                                            else {
                                                midCard[k + 1] = btCardData2[k];
                                            }
                                        }
                                    }
                                    if (bFirst) {
                                        if (pokerLogic.compareCard(frontCard, midCard, 3, 5, false) && pokerLogic.compareCard(midCard, backCard, 5, 5, false)) {
                                            frontFrontCard = frontCard;
                                            frontMidCard = midCard;
                                            frontBackCard = backCard;
                                            bFirst = false;
                                        }
                                    }
                                    else {
                                        if (pokerLogic.compareCard(frontCard, midCard, 3, 5, false) && pokerLogic.compareCard(midCard, backCard, 5, 5, false) &&
                                            this.isBiggerThanFront(frontFrontCard, frontMidCard, frontBackCard, frontCard, midCard, backCard)) {
                                            frontFrontCard = frontCard;
                                            frontMidCard = midCard;
                                            frontBackCard = backCard;
                                        }
                                    }
                                }
                            }
                        }
                        if (tagCardType1.onePare)   //剩下一对
                        {
                            for (var j = 0; j < tagCardType1.amOnePare; j++) {
                                btCardCount1 = btCardCount;
                                btCardData1 = btCardData;
                                for (var k = 0; k < 2; k++) {
                                    midCard[k] = btCardData1[tagCardType1.snOnePare[j * 2 + k]];
                                }
                                pokerLogic.removeCard(midCard, 2, btCardData1, btCardCount1);
                                btCardCount2 = btCardCount1 -= 2;
                                btCardData2 = btCardData1;
                                tagCardType2 = this.getType(btCardData2, btCardCount2);
                                if (tagCardType2.onePare)   //一对
                                {
                                    for (var k = 0; k < 2; k++) {
                                        btTemp[k] = frontCard[k] = btCardData2[tagCardType2.snOnePare[k]];
                                    }
                                    pokerLogic.removeCard(btTemp, 2, btCardData2, btCardCount2);
                                    frontCard[2] = btCardData2[0];
                                    midCard[2] = btCardData2[1];
                                    midCard[3] = btCardData2[2];
                                    midCard[4] = btCardData2[3];
                                }
                                else {   //散牌
                                    for (var k = 0; k < 6; k++) {
                                        if (k < 3) {
                                            frontCard[k] = btCardData2[k];
                                        }
                                        else {
                                            midCard[k - 1] = btCardData2[k];
                                        }
                                    }
                                }
                                if (bFirst) {
                                    if (pokerLogic.compareCard(frontCard, midCard, 3, 5, false) && pokerLogic.compareCard(midCard, backCard, 5, 5, false)) {
                                        frontFrontCard = frontCard;
                                        frontMidCard = midCard;
                                        frontBackCard = backCard;
                                        bFirst = false;
                                    }
                                }
                                else {
                                    if (pokerLogic.compareCard(frontCard, midCard, 3, 5, false) && pokerLogic.compareCard(midCard, backCard, 5, 5, false) &&
                                        this.isBiggerThanFront(frontFrontCard, frontMidCard, frontBackCard, frontCard, midCard, backCard)) {
                                        frontFrontCard = frontCard;
                                        frontMidCard = midCard;
                                        frontBackCard = backCard;
                                    }
                                }
                            }
                        }
                        //散牌
                        btCardCount1 = btCardCount;
                        btCardData1 = btCardData;
                        midCard[0] = btCardData1[0];
                        midCard[1] = btCardData1[4];
                        midCard[2] = btCardData1[5];
                        midCard[3] = btCardData1[6];
                        midCard[4] = btCardData1[7];
                        frontCard[0] = btCardData1[1];
                        frontCard[1] = btCardData1[2];
                        frontCard[2] = btCardData1[3];
                        if (bFirst) {
                            if (pokerLogic.compareCard(frontCard, midCard, 3, 5, false) && pokerLogic.compareCard(midCard, backCard, 5, 5, false)) {
                                frontFrontCard = frontCard;
                                frontMidCard = midCard;
                                frontBackCard = backCard;
                                bFirst = false;
                            }
                        }
                        else {
                            if (pokerLogic.compareCard(frontCard, midCard, 3, 5, false) && pokerLogic.compareCard(midCard, backCard, 5, 5, false) &&
                                this.isBiggerThanFront(frontFrontCard, frontMidCard, frontBackCard, frontCard, midCard, backCard)) {
                                frontFrontCard = frontCard;
                                frontMidCard = midCard;
                                frontBackCard = backCard;
                            }
                        }
                    }
                }
                if (tagCardType.straight)  //尾道为顺子
                {
                    for (var i = 0; i < tagCardType.amStraight; i++) {
                        btCardData = btHandCardData;
                        btCardCount = btHandCardCount;
                        for (var j = 0; j < 5; j++) {
                            backCard[j] = btCardData[tagCardType.snStraight[i * 5 + j]];
                        }
                        pokerLogic.removeCard(backCard, 5, btCardData, btCardCount);
                        btCardCount1 = btCardCount -= 5;
                        btCardData1 = btCardData;
                        tagCardType1 = this.getType(btCardData1, btCardCount1);
                        if (tagCardType1.straight) //剩下顺子
                        {
                            for (var j = 0; j < tagCardType1.amFlush; j++) {
                                btCardCount1 = btCardCount;
                                btCardData1 = btCardData;
                                for (var k = 0; k < 5; k++) {
                                    midCard[k] = btCardData1[tagCardType1.snFlush[j * 5 + k]];
                                }
                                pokerLogic.removeCard(midCard, 5, btCardData1, btCardCount1);
                                frontCard = btCardData1;
                                if (bFirst) {
                                    if (pokerLogic.compareCard(frontCard, midCard, 3, 5, false) && pokerLogic.compareCard(midCard, backCard, 5, 5, false)) {
                                        frontFrontCard = frontCard;
                                        frontMidCard = midCard;
                                        frontBackCard = backCard;
                                        bFirst = false;
                                    }
                                }
                                else {
                                    if (pokerLogic.compareCard(frontCard, midCard, 3, 5, false) && pokerLogic.compareCard(midCard, backCard, 5, 5, false) &&
                                        this.isBiggerThanFront(frontFrontCard, frontMidCard, frontBackCard, frontCard, midCard, backCard)) {
                                        frontFrontCard = frontCard;
                                        frontMidCard = midCard;
                                        frontBackCard = backCard;
                                    }
                                }
                            }
                        }
                        if (tagCardType1.threeSame) //剩下三条
                        {
                            for (var j = 0; j < tagCardType1.amThreeSame; j++) {
                                btCardCount1 = btCardCount;
                                btCardData1 = btCardData;
                                for (var k = 0; k < 3; k++) {
                                    midCard[k] = btCardData1[tagCardType1.snThreeSame[j * 3 + k]];
                                }
                                pokerLogic.removeCard(midCard, 3, btCardData1, btCardCount1);
                                btCardCount2 = btCardCount1 -= 3;
                                btCardData2 = btCardData1;
                                tagCardType2 = this.getType(btCardData2, btCardCount2);
                                if (tagCardType2.threeSame) //三条
                                {
                                    for (var k = 0; k < 3; k++) {
                                        frontCard[k] = btCardData2[tagCardType2.snThreeSame[k]];
                                    }
                                    pokerLogic.removeCard(frontCard, 3, btCardData2, btCardCount2);
                                    midCard[3] = btCardData2[0];
                                    midCard[4] = btCardData2[1];
                                }
                                else if (tagCardType2.twoPare)  //两对
                                {
                                    for (var k = 0; k < 4; k++) {
                                        if (k < 2) {
                                            btTemp[k] = frontCard[k] = btCardData2[tagCardType2.snTwoPare[k]];
                                        }
                                        else {
                                            btTemp[k] = midCard[k + 1] = btCardData2[tagCardType2.snTwoPare[k]];
                                        }
                                    }
                                    pokerLogic.removeCard(btTemp, 4, btCardData2, btCardCount);
                                    frontCard[2] = btCardData2[0];
                                }
                                else if (tagCardType2.onePare)  //一对
                                {
                                    for (var k = 0; k < 2; k++) {
                                        btTemp[k] = frontCard[k] = btCardData2[tagCardType2.snOnePare[k]];
                                    }
                                    pokerLogic.removeCard(btTemp, 2, btCardData2, btCardCount2);
                                    frontCard[2] = btCardData2[0];
                                    midCard[3] = btCardData2[1];
                                    midCard[4] = btCardData2[2];
                                }
                                else    //散牌
                                {
                                    for (var k = 0; k < 5; k++) {
                                        if (k < 3) {
                                            frontCard[k] = btCardData2[k];
                                        }
                                        else {
                                            midCard[k] = btCardData2[k];
                                        }
                                    }
                                }
                                if (bFirst) {
                                    if (pokerLogic.compareCard(frontCard, midCard, 3, 5, false) && pokerLogic.compareCard(midCard, backCard, 5, 5, false)) {
                                        frontFrontCard = frontCard;
                                        frontMidCard = midCard;
                                        frontBackCard = backCard;
                                        bFirst = false;
                                    }
                                }
                                else {
                                    if (pokerLogic.compareCard(frontCard, midCard, 3, 5, false) && pokerLogic.compareCard(midCard, backCard, 5, 5, false) &&
                                        this.isBiggerThanFront(frontFrontCard, frontMidCard, frontBackCard, frontCard, midCard, backCard)) {
                                        frontFrontCard = frontCard;
                                        frontMidCard = midCard;
                                        frontBackCard = backCard;
                                    }
                                }
                            }
                        }
                        if (tagCardType1.twoPare)   //剩下两对
                        {
                            if (tagCardType1.amOnePare >= 3) {
                                btCardCount1 = btCardCount;
                                btCardData1 = btCardData;
                                btTemp[0] = frontCard[0] = btCardData1[tagCardType1.snOnePare[0]];
                                btTemp[1] = frontCard[1] = btCardData1[tagCardType1.snOnePare[1]];
                                btTemp[2] = midCard[0] = btCardData1[tagCardType1.snOnePare[2]];
                                btTemp[3] = midCard[1] = btCardData1[tagCardType1.snOnePare[3]];
                                btTemp[4] = midCard[2] = btCardData1[tagCardType1.snOnePare[4]];
                                btTemp[5] = midCard[3] = btCardData1[tagCardType1.snOnePare[5]];
                                pokerLogic.removeCard(btTemp, 6, btCardData1, btCardCount1);
                                frontCard[2] = btCardData1[0];
                                midCard[4] = btCardData1[1];
                                if (bFirst) {
                                    if (pokerLogic.compareCard(frontCard, midCard, 3, 5, false) && pokerLogic.compareCard(midCard, backCard, 5, 5, false)) {
                                        frontFrontCard = frontCard;
                                        frontMidCard = midCard;
                                        frontBackCard = backCard;
                                        bFirst = false;
                                    }
                                }
                                else {
                                    if (pokerLogic.compareCard(frontCard, midCard, 3, 5, false) && pokerLogic.compareCard(midCard, backCard, 5, 5, false) &&
                                        this.isBiggerThanFront(frontFrontCard, frontMidCard, frontBackCard, frontCard, midCard, backCard)) {
                                        frontFrontCard = frontCard;
                                        frontMidCard = midCard;
                                        frontBackCard = backCard;
                                    }
                                }
                            }
                            else {
                                for (var j = 0; j < tagCardType1.amTwoPare; j++) {
                                    btCardCount1 = btCardCount;
                                    btCardData1 = btCardData;
                                    for (var k = 0; k < 4; k++) {
                                        midCard[k] = btCardData1[tagCardType1.snTwoPare[j * 4 + k]];
                                    }
                                    pokerLogic.removeCard(midCard, 4, btCardData1, btCardCount1);
                                    btCardCount2 = btCardCount1 -= 4;
                                    btCardData2 = btCardData1;
                                    tagCardType2 = this.getType(btCardData2, btCardCount2);
                                    if (tagCardType2.twoPare)   //两对
                                    {
                                        for (var k = 0; k < 4; k++) {
                                            if (k < 3) {
                                                frontCard[k] = btCardData2[tagCardType2.snTwoPare[k]];
                                            }
                                            else {
                                                midCard[k + 1] = btCardData2[tagCardType2.snTwoPare[k]];
                                            }
                                        }
                                    }
                                    else if (tagCardType2.onePare)  //一对
                                    {
                                        for (var k = 0; k < 2; k++) {
                                            btTemp[k] = frontCard[k] = btCardData2[tagCardType2.snOnePare[k]];
                                        }
                                        pokerLogic.removeCard(btTemp, 2, btCardData2, btCardCount2);
                                        frontCard[2] = btCardData2[0];
                                        midCard[4] = btCardData2[1];
                                    }
                                    else    //散牌
                                    {
                                        for (var k = 0; k < 4; k++) {
                                            if (k < 3) {
                                                frontCard[k] = btCardData2[k];
                                            }
                                            else {
                                                midCard[k + 1] = btCardData2[k];
                                            }
                                        }
                                    }
                                    if (bFirst) {
                                        if (pokerLogic.compareCard(frontCard, midCard, 3, 5, false) && pokerLogic.compareCard(midCard, backCard, 5, 5, false)) {
                                            frontFrontCard = frontCard;
                                            frontMidCard = midCard;
                                            frontBackCard = backCard;
                                            bFirst = false;
                                        }
                                    }
                                    else {
                                        if (pokerLogic.compareCard(frontCard, midCard, 3, 5, false) && pokerLogic.compareCard(midCard, backCard, 5, 5, false) &&
                                            this.isBiggerThanFront(frontFrontCard, frontMidCard, frontBackCard, frontCard, midCard, backCard)) {
                                            frontFrontCard = frontCard;
                                            frontMidCard = midCard;
                                            frontBackCard = backCard;
                                        }
                                    }
                                }
                            }
                        }
                        if (tagCardType1.onePare)   //剩下一对
                        {
                            for (var j = 0; j < tagCardType1.amOnePare; j++) {
                                btCardCount1 = btCardCount;
                                btCardData1 = btCardData;
                                for (var k = 0; k < 2; k++) {
                                    midCard[k] = btCardData1[tagCardType1.snOnePare[j * 2 + k]];
                                }
                                pokerLogic.removeCard(midCard, 2, btCardData1, btCardCount1);
                                btCardCount2 = btCardCount1 -= 2;
                                btCardData2 = btCardData1;
                                tagCardType2 = this.getType(btCardData2, btCardCount2);
                                if (tagCardType2.onePare)   //一对
                                {
                                    for (var k = 0; k < 2; k++) {
                                        btTemp[k] = frontCard[k] = btCardData2[tagCardType2.snOnePare[k]];
                                    }
                                    pokerLogic.removeCard(btTemp, 2, btCardData2, btCardCount2);
                                    frontCard[2] = btCardData2[0];
                                    midCard[2] = btCardData2[1];
                                    midCard[3] = btCardData2[2];
                                    midCard[4] = btCardData2[3];
                                }
                                else {   //散牌
                                    for (var k = 0; k < 6; k++) {
                                        if (k < 3) {
                                            frontCard[k] = btCardData2[k];
                                        }
                                        else {
                                            midCard[k - 1] = btCardData2[k];
                                        }
                                    }
                                }
                                if (bFirst) {
                                    if (pokerLogic.compareCard(frontCard, midCard, 3, 5, false) && pokerLogic.compareCard(midCard, backCard, 5, 5, false)) {
                                        frontFrontCard = frontCard;
                                        frontMidCard = midCard;
                                        frontBackCard = backCard;
                                        bFirst = false;
                                    }
                                }
                                else {
                                    if (pokerLogic.compareCard(frontCard, midCard, 3, 5, false) && pokerLogic.compareCard(midCard, backCard, 5, 5, false) &&
                                        this.isBiggerThanFront(frontFrontCard, frontMidCard, frontBackCard, frontCard, midCard, backCard)) {
                                        frontFrontCard = frontCard;
                                        frontMidCard = midCard;
                                        frontBackCard = backCard;
                                    }
                                }
                            }
                        }
                        //散牌
                        btCardCount1 = btCardCount;
                        btCardData1 = btCardData;
                        midCard[0] = btCardData1[0];
                        midCard[1] = btCardData1[4];
                        midCard[2] = btCardData1[5];
                        midCard[3] = btCardData1[6];
                        midCard[4] = btCardData1[7];
                        frontCard[0] = btCardData1[1];
                        frontCard[1] = btCardData1[2];
                        frontCard[2] = btCardData1[3];
                        if (bFirst) {
                            if (pokerLogic.compareCard(frontCard, midCard, 3, 5, false) && pokerLogic.compareCard(midCard, backCard, 5, 5, false)) {
                                frontFrontCard = frontCard;
                                frontMidCard = midCard;
                                frontBackCard = backCard;
                                bFirst = false;
                            }
                        }
                        else {
                            if (pokerLogic.compareCard(frontCard, midCard, 3, 5, false) && pokerLogic.compareCard(midCard, backCard, 5, 5, false) &&
                                this.isBiggerThanFront(frontFrontCard, frontMidCard, frontBackCard, frontCard, midCard, backCard)) {
                                frontFrontCard = frontCard;
                                frontMidCard = midCard;
                                frontBackCard = backCard;
                            }
                        }
                    }
                }
                if (tagCardType.threeSame)  //尾道为三条
                {
                    for (var i = 0; i < tagCardType.amThreeSame; i++) {
                        btCardData = btHandCardData;
                        btCardCount = btHandCardCount;
                        for (var j = 0; j < 3; j++) {
                            backCard[j] = btCardData[tagCardType.snStraight[i * 3 + j]];
                        }
                        pokerLogic.removeCard(backCard, 5, btCardData, btCardCount);
                        btCardCount1 = btCardCount -= 5;
                        btCardData1 = btCardData;
                        tagCardType1 = this.getType(btCardData1, btCardCount1);
                        if (tagCardType1.threeSame) //剩下三条
                        {
                            for (var j = 0; j < tagCardType1.amThreeSame; j++) {
                                btCardCount1 = btCardCount;
                                btCardData1 = btCardData;
                                for (var k = 0; k < 3; k++) {
                                    midCard[k] = btCardData1[tagCardType1.snThreeSame[j * 3 + k]];
                                }
                                pokerLogic.removeCard(midCard, 3, btCardData1, btCardCount1);
                                btCardCount2 = btCardCount1 -= 3;
                                btCardData2 = btCardData1;
                                tagCardType2 = this.getType(btCardData2, btCardCount2);
                                if (tagCardType2.threeSame) //三条
                                {
                                    for (var k = 0; k < 3; k++) {
                                        frontCard[k] = btCardData2[tagCardType2.snThreeSame[k]];
                                    }
                                    pokerLogic.removeCard(frontCard, 3, btCardData2, btCardCount2);
                                    midCard[3] = btCardData2[0];
                                    midCard[4] = btCardData2[1];
                                    backCard[3] = btCardData2[2];
                                    backCard[4] = btCardData2[3];
                                }
                                else if (tagCardType2.twoPare)  //两对
                                {
                                    for (var k = 0; k < 4; k++) {
                                        if (k < 2) {
                                            btTemp[k] = frontCard[k] = btCardData2[tagCardType2.snTwoPare[k]];
                                        }
                                        else {
                                            btTemp[k] = midCard[k + 1] = btCardData2[tagCardType2.snTwoPare[k]];
                                        }
                                    }
                                    pokerLogic.removeCard(btTemp, 4, btCardData2, btCardCount);
                                    frontCard[2] = btCardData2[0];
                                    midCard[3] = btCardData2[1];
                                    midCard[4] = btCardData2[2];
                                }
                                else if (tagCardType2.onePare)  //一对
                                {
                                    for (var k = 0; k < 2; k++) {
                                        btTemp[k] = frontCard[k] = btCardData2[tagCardType2.snOnePare[k]];
                                    }
                                    pokerLogic.removeCard(btTemp, 2, btCardData2, btCardCount2);
                                    frontCard[2] = btCardData2[0];
                                    midCard[3] = btCardData2[1];
                                    midCard[4] = btCardData2[2];
                                    backCard[3] = btCardData2[3];
                                    backCard[4] = btCardData2[4];
                                }
                                else    //散牌
                                {
                                    frontCard[0] = btCardData2[0];
                                    frontCard[1] = btCardData2[1];
                                    frontCard[2] = btCardData2[2];
                                    midCard[3] = btCardData2[3];
                                    midCard[4] = btCardData2[4];
                                    backCard[3] = btCardData2[5];
                                    backCard[4] = btCardData2[6];
                                }
                                if (bFirst) {
                                    if (pokerLogic.compareCard(frontCard, midCard, 3, 5, false) && pokerLogic.compareCard(midCard, backCard, 5, 5, false)) {
                                        frontFrontCard = frontCard;
                                        frontMidCard = midCard;
                                        frontBackCard = backCard;
                                        bFirst = false;
                                    }
                                }
                                else {
                                    if (pokerLogic.compareCard(frontCard, midCard, 3, 5, false) && pokerLogic.compareCard(midCard, backCard, 5, 5, false) &&
                                        this.isBiggerThanFront(frontFrontCard, frontMidCard, frontBackCard, frontCard, midCard, backCard)) {
                                        frontFrontCard = frontCard;
                                        frontMidCard = midCard;
                                        frontBackCard = backCard;
                                    }
                                }
                            }
                        }
                        if (tagCardType1.twoPare)   //剩下两对
                        {
                            if (tagCardType1.amOnePare >= 3) {
                                btCardCount1 = btCardCount;
                                btCardData1 = btCardData;
                                btTemp[0] = frontCard[0] = btCardData1[tagCardType1.snOnePare[0]];
                                btTemp[1] = frontCard[1] = btCardData1[tagCardType1.snOnePare[1]];
                                btTemp[2] = midCard[0] = btCardData1[tagCardType1.snOnePare[2]];
                                btTemp[3] = midCard[1] = btCardData1[tagCardType1.snOnePare[3]];
                                btTemp[4] = midCard[2] = btCardData1[tagCardType1.snOnePare[4]];
                                btTemp[5] = midCard[3] = btCardData1[tagCardType1.snOnePare[5]];
                                pokerLogic.removeCard(btTemp, 6, btCardData1, btCardCount1);
                                frontCard[2] = btCardData1[0];
                                midCard[4] = btCardData1[1];
                                backCard[3] = btCardData1[2]
                                backCard[4] = btCardData1[3]
                                if (bFirst) {
                                    if (pokerLogic.compareCard(frontCard, midCard, 3, 5, false) && pokerLogic.compareCard(midCard, backCard, 5, 5, false)) {
                                        frontFrontCard = frontCard;
                                        frontMidCard = midCard;
                                        frontBackCard = backCard;
                                        bFirst = false;
                                    }
                                }
                                else {
                                    if (pokerLogic.compareCard(frontCard, midCard, 3, 5, false) && pokerLogic.compareCard(midCard, backCard, 5, 5, false) &&
                                        this.isBiggerThanFront(frontFrontCard, frontMidCard, frontBackCard, frontCard, midCard, backCard)) {
                                        frontFrontCard = frontCard;
                                        frontMidCard = midCard;
                                        frontBackCard = backCard;
                                    }
                                }
                            }
                            else {
                                for (var j = 0; j < tagCardType1.amTwoPare; j++) {
                                    btCardCount1 = btCardCount;
                                    btCardData1 = btCardData;
                                    for (var k = 0; k < 4; k++) {
                                        midCard[k] = btCardData1[tagCardType1.snTwoPare[j * 4 + k]];
                                    }
                                    pokerLogic.removeCard(midCard, 4, btCardData1, btCardCount1);
                                    btCardCount2 = btCardCount1 -= 4;
                                    btCardData2 = btCardData1;
                                    tagCardType2 = this.getType(btCardData2, btCardCount2);
                                    if (tagCardType2.twoPare)   //两对
                                    {
                                        for (var k = 0; k < 4; k++) {
                                            if (k < 3) {
                                                frontCard[k] = btCardData2[tagCardType2.snTwoPare[k]];
                                            }
                                            else {
                                                midCard[k + 1] = btCardData2[tagCardType2.snTwoPare[k]];
                                            }
                                        }
                                        pokerLogic.removeCard(btTemp, 4, btCardData2.btCardCount2);
                                        backCard[3] = btCardData2[0];
                                        backCard[4] = btCardData2[1];
                                    }
                                    else if (tagCardType2.onePare)  //一对
                                    {
                                        for (var k = 0; k < 2; k++) {
                                            btTemp[k] = frontCard[k] = btCardData2[tagCardType2.snOnePare[k]];
                                        }
                                        pokerLogic.removeCard(btTemp, 2, btCardData2, btCardCount2);
                                        frontCard[2] = btCardData2[0];
                                        midCard[4] = btCardData2[1];
                                        backCard[3] = btCardData2[2];
                                        backCard[4] = btCardData2[3];
                                    }
                                    else    //散牌
                                    {
                                        frontCard[0] = btCardData2[0];
                                        frontCard[1] = btCardData2[1];
                                        frontCard[2] = btCardData2[2];
                                        midCard[4] = btCardData2[3];
                                        backCard[3] = btCardData2[4];
                                        backCard[4] = btCardData2[5];
                                    }
                                    if (bFirst) {
                                        if (pokerLogic.compareCard(frontCard, midCard, 3, 5, false) && pokerLogic.compareCard(midCard, backCard, 5, 5, false)) {
                                            frontFrontCard = frontCard;
                                            frontMidCard = midCard;
                                            frontBackCard = backCard;
                                            bFirst = false;
                                        }
                                    }
                                    else {
                                        if (pokerLogic.compareCard(frontCard, midCard, 3, 5, false) && pokerLogic.compareCard(midCard, backCard, 5, 5, false) &&
                                            this.isBiggerThanFront(frontFrontCard, frontMidCard, frontBackCard, frontCard, midCard, backCard)) {
                                            frontFrontCard = frontCard;
                                            frontMidCard = midCard;
                                            frontBackCard = backCard;
                                        }
                                    }
                                }
                            }
                        }
                        if (tagCardType1.onePare)   //剩下一对
                        {
                            for (var j = 0; j < tagCardType1.amOnePare; j++) {
                                btCardCount1 = btCardCount;
                                btCardData1 = btCardData;
                                for (var k = 0; k < 2; k++) {
                                    midCard[k] = btCardData1[tagCardType1.snOnePare[j * 2 + k]];
                                }
                                pokerLogic.removeCard(midCard, 2, btCardData1, btCardCount1);
                                btCardCount2 = btCardCount1 -= 2;
                                btCardData2 = btCardData1;
                                tagCardType2 = this.getType(btCardData2, btCardCount2);
                                if (tagCardType2.onePare)   //一对
                                {
                                    for (var k = 0; k < 2; k++) {
                                        btTemp[k] = frontCard[k] = btCardData2[tagCardType2.snOnePare[k]];
                                    }
                                    pokerLogic.removeCard(btTemp, 2, btCardData2, btCardCount2);
                                    frontCard[2] = btCardData2[0];
                                    midCard[2] = btCardData2[1];
                                    midCard[3] = btCardData2[2];
                                    midCard[4] = btCardData2[3];
                                    backCard[3] = btCardData2[4];
                                    backCard[4] = btCardData2[5];
                                }
                                else {   //散牌
                                    frontCard[0] = btCardData2[0];
                                    frontCard[1] = btCardData2[1];
                                    frontCard[2] = btCardData2[2];
                                    midCard[2] = btCardData2[3];
                                    midCard[3] = btCardData2[4];
                                    midCard[4] = btCardData2[5];
                                    backCard[3] = btCardData2[6];
                                    backCard[4] = btCardData2[7];
                                }
                                if (bFirst) {
                                    if (pokerLogic.compareCard(frontCard, midCard, 3, 5, false) && pokerLogic.compareCard(midCard, backCard, 5, 5, false)) {
                                        frontFrontCard = frontCard;
                                        frontMidCard = midCard;
                                        frontBackCard = backCard;
                                        bFirst = false;
                                    }
                                }
                                else {
                                    if (pokerLogic.compareCard(frontCard, midCard, 3, 5, false) && pokerLogic.compareCard(midCard, backCard, 5, 5, false) &&
                                        this.isBiggerThanFront(frontFrontCard, frontMidCard, frontBackCard, frontCard, midCard, backCard)) {
                                        frontFrontCard = frontCard;
                                        frontMidCard = midCard;
                                        frontBackCard = backCard;
                                    }
                                }
                            }
                        }
                        //散牌
                        btCardCount1 = btCardCount;
                        btCardData1 = btCardData;
                        midCard[0] = btCardData1[0];
                        midCard[1] = btCardData1[4];
                        midCard[2] = btCardData1[5];
                        midCard[3] = btCardData1[6];
                        midCard[4] = btCardData1[7];
                        backCard[3] = btCardData1[8];
                        backCard[4] = btCardData1[9];
                        frontCard[0] = btCardData1[1];
                        frontCard[1] = btCardData1[2];
                        frontCard[2] = btCardData1[3];
                        if (bFirst) {
                            if (pokerLogic.compareCard(frontCard, midCard, 3, 5, false) && pokerLogic.compareCard(midCard, backCard, 5, 5, false)) {
                                frontFrontCard = frontCard;
                                frontMidCard = midCard;
                                frontBackCard = backCard;
                                bFirst = false;
                            }
                        }
                        else {
                            if (pokerLogic.compareCard(frontCard, midCard, 3, 5, false) && pokerLogic.compareCard(midCard, backCard, 5, 5, false) &&
                                this.isBiggerThanFront(frontFrontCard, frontMidCard, frontBackCard, frontCard, midCard, backCard)) {
                                frontFrontCard = frontCard;
                                frontMidCard = midCard;
                                frontBackCard = backCard;
                            }
                        }
                    }
                }
                if (tagCardType.twoPare)  //尾道为两对
                {
                    if (tagCardType.amOnePare < 4) {
                        for (var i = 0; i < tagCardType.amTwoPare; i++) {
                            btCardData = btHandCardData;
                            btCardCount = btHandCardCount;
                            for (var j = 0; j < 4; j++) {
                                backCard[j] = btCardData[tagCardType.snStraight[i * 4 + j]];
                            }
                            pokerLogic.removeCard(backCard, 4, btCardData, btCardCount);
                            btCardCount1 = btCardCount -= 4;
                            btCardData1 = btCardData;
                            tagCardType1 = this.getType(btCardData1, btCardCount1);
                            if (tagCardType1.twoPare) //剩下两对
                            {
                                if (tagCardType1.amOnePare >= 3) {
                                    btCardCount1 = btCardCount;
                                    btCardData1 = btCardData;
                                    btTemp[0] = frontCard[0] = btCardData1[tagCardType1.snOnePare[0]];
                                    btTemp[1] = frontCard[1] = btCardData1[tagCardType1.snOnePare[1]];
                                    btTemp[2] = midCard[0] = btCardData1[tagCardType1.snOnePare[2]];
                                    btTemp[3] = midCard[1] = btCardData1[tagCardType1.snOnePare[3]];
                                    btTemp[4] = midCard[2] = btCardData1[tagCardType1.snOnePare[4]];
                                    btTemp[5] = midCard[3] = btCardData1[tagCardType1.snOnePare[5]];
                                    pokerLogic.removeCard(btTemp, 6, btCardData1, btCardCount1);
                                    frontCard[2] = btCardData1[0];
                                    midCard[4] = btCardData1[1];
                                    backCard[4] = btCardData1[2];
                                    if (bFirst) {
                                        if (pokerLogic.compareCard(frontCard, midCard, 3, 5, false) && pokerLogic.compareCard(midCard, backCard, 5, 5, false)) {
                                            frontFrontCard = frontCard;
                                            frontMidCard = midCard;
                                            frontBackCard = backCard;
                                            btFrontAllShuiShu = this.threeDunAllShuiShu(frontFrontCard, frontMidCard, frontBackCard);
                                            bFirst = false;
                                        }
                                    }
                                    else {
                                        btAllShuiShu = this.threeDunAllShuiShu(frontCard, midCard, backCard);
                                        if (pokerLogic.compareCard(frontCard, midCard, 3, 5, false) && pokerLogic.compareCard(midCard, backCard, 5, 5, false) &&
                                            this.isBiggerThanFront(frontFrontCard, frontMidCard, frontBackCard, frontCard, midCard, backCard)) {
                                            frontFrontCard = frontCard;
                                            frontMidCard = midCard;
                                            frontBackCard = backCard;
                                            btFrontAllShuiShu = btAllShuiShu;
                                        }
                                    }
                                }
                                else {
                                    for (var j = 0; j < tagCardType1.amTwoPare; j++) {
                                        btCardCount1 = btCardCount;
                                        btCardData1 = btCardData;
                                        for (var k = 0; k < 4; k++) {
                                            midCard[k] = btCardData1[tagCardType1.snTwoPare[j * 4 + k]];
                                        }
                                        pokerLogic.removeCard(midCard, 4, btCardData1, btCardCount1);
                                        btCardCount2 = btCardCount1 -= 4;
                                        btCardData2 = btCardData1;
                                        tagCardType2 = this.getType(btCardData2, btCardCount2);
                                        if (tagCardType2.twoPare)   //两对
                                        {
                                            for (var k = 0; k < 4; k++) {
                                                if (k < 3) {
                                                    btTemp[k] = frontCard[k] = btCardData2[tagCardType2.snTwoPare[k]];
                                                }
                                                else {
                                                    btTemp[k] = midCard[k + 1] = btCardData2[tagCardType2.snTwoPare[k]];
                                                }
                                            }
                                            pokerLogic.removeCard(btTemp, 4, btCardData2.btCardCount2);
                                            backCard[4] = btCardData2[0];
                                        }
                                        else if (tagCardType2.onePare)  //一对
                                        {
                                            for (var k = 0; k < 2; k++) {
                                                btTemp[k] = frontCard[k] = btCardData2[tagCardType2.snOnePare[k]];
                                            }
                                            pokerLogic.removeCard(btTemp, 2, btCardData2, btCardCount2);
                                            frontCard[2] = btCardData2[0];
                                            midCard[4] = btCardData2[1];
                                            backCard[4] = btCardData2[2];
                                        }
                                        else    //散牌
                                        {
                                            frontCard[0] = btCardData2[0];
                                            frontCard[1] = btCardData2[1];
                                            frontCard[2] = btCardData2[2];
                                            midCard[4] = btCardData2[3];
                                            backCard[4] = btCardData2[4];
                                        }
                                        if (bFirst) {
                                            if (pokerLogic.compareCard(frontCard, midCard, 3, 5, false) && pokerLogic.compareCard(midCard, backCard, 5, 5, false)) {
                                                frontFrontCard = frontCard;
                                                frontMidCard = midCard;
                                                frontBackCard = backCard;
                                                bFirst = false;
                                            }
                                        }
                                        else {
                                            if (pokerLogic.compareCard(frontCard, midCard, 3, 5, false) && pokerLogic.compareCard(midCard, backCard, 5, 5, false) &&
                                                this.isBiggerThanFront(frontFrontCard, frontMidCard, frontBackCard, frontCard, midCard, backCard)) {
                                                frontFrontCard = frontCard;
                                                frontMidCard = midCard;
                                                frontBackCard = backCard;
                                            }
                                        }
                                    }
                                }
                            }
                            if (tagCardType1.onePare)   //剩下一对
                            {
                                for (var j = 0; j < tagCardType1.amOnePare; j++) {
                                    btCardCount1 = btCardCount;
                                    btCardData1 = btCardData;
                                    for (var k = 0; k < 2; k++) {
                                        midCard[k] = btCardData1[tagCardType1.snOnePare[j * 2 + k]];
                                    }
                                    pokerLogic.removeCard(midCard, 2, btCardData1, btCardCount1);
                                    btCardCount2 = btCardCount1 -= 2;
                                    btCardData2 = btCardData1;
                                    tagCardType2 = this.getType(btCardData2, btCardCount2);
                                    if (tagCardType2.onePare)   //一对
                                    {
                                        for (var k = 0; k < 2; k++) {
                                            btTemp[k] = frontCard[k] = btCardData2[tagCardType2.snOnePare[k]];
                                        }
                                        pokerLogic.removeCard(btTemp, 2, btCardData2, btCardCount2);
                                        frontCard[2] = btCardData2[0];
                                        midCard[2] = btCardData2[1];
                                        midCard[3] = btCardData2[2];
                                        midCard[4] = btCardData2[3];
                                        backCard[4] = btCardData2[4];
                                    }
                                    else {   //散牌
                                        frontCard[0] = btCardData2[0];
                                        frontCard[1] = btCardData2[1];
                                        frontCard[2] = btCardData2[2];
                                        midCard[2] = btCardData2[3];
                                        midCard[3] = btCardData2[4];
                                        midCard[4] = btCardData2[5];
                                        backCard[4] = btCardData2[6];
                                    }
                                    if (bFirst) {
                                        if (pokerLogic.compareCard(frontCard, midCard, 3, 5, false) && pokerLogic.compareCard(midCard, backCard, 5, 5, false)) {
                                            frontFrontCard = frontCard;
                                            frontMidCard = midCard;
                                            frontBackCard = backCard;
                                            bFirst = false;
                                        }
                                    }
                                    else {
                                        if (pokerLogic.compareCard(frontCard, midCard, 3, 5, false) && pokerLogic.compareCard(midCard, backCard, 5, 5, false) &&
                                            this.isBiggerThanFront(frontFrontCard, frontMidCard, frontBackCard, frontCard, midCard, backCard)) {
                                            frontFrontCard = frontCard;
                                            frontMidCard = midCard;
                                            frontBackCard = backCard;
                                        }
                                    }
                                }
                            }
                            //散牌
                            btCardCount1 = btCardCount;
                            btCardData1 = btCardData;
                            midCard[0] = btCardData1[0];
                            midCard[1] = btCardData1[4];
                            midCard[2] = btCardData1[5];
                            midCard[3] = btCardData1[6];
                            midCard[4] = btCardData1[7];
                            backCard[4] = btCardData1[8];
                            frontCard[0] = btCardData1[1];
                            frontCard[1] = btCardData1[2];
                            frontCard[2] = btCardData1[3];
                            if (bFirst) {
                                if (pokerLogic.compareCard(frontCard, midCard, 3, 5, false) && pokerLogic.compareCard(midCard, backCard, 5, 5, false)) {
                                    frontFrontCard = frontCard;
                                    frontMidCard = midCard;
                                    frontBackCard = backCard;
                                    bFirst = false;
                                }
                            }
                            else {
                                if (pokerLogic.compareCard(frontCard, midCard, 3, 5, false) && pokerLogic.compareCard(midCard, backCard, 5, 5, false) &&
                                    this.isBiggerThanFront(frontFrontCard, frontMidCard, frontBackCard, frontCard, midCard, backCard)) {
                                    frontFrontCard = frontCard;
                                    frontMidCard = midCard;
                                    frontBackCard = backCard;
                                }
                            }
                        }
                    }
                    else {
                        if (tagCardType.amOnePare == 4) {
                            btCardData = btHandCardData;
                            btCardCount = btHandCardCount;
                            btTemp[0] = backCard[0] = btCardData[tagCardType.snOnePare[0]];
                            btTemp[1] = backCard[1] = btCardData[tagCardType.snOnePare[1]];
                            btTemp[2] = backCard[2] = btCardData[tagCardType.snOnePare[6]];
                            btTemp[3] = backCard[3] = btCardData[tagCardType.snOnePare[7]];
                            btTemp[4] = midCard[0] = btCardData[tagCardType.snOnePare[2]];
                            btTemp[5] = midCard[1] = btCardData[tagCardType.snOnePare[3]];
                            btTemp[6] = midCard[2] = btCardData[tagCardType.snOnePare[4]];
                            btTemp[7] = midCard[3] = btCardData[tagCardType.snOnePare[5]];
                            pokerLogic.removeCard(btTemp, 8, btCardData, btCardCount);
                            frontCard[0] = btCardData[0];
                            frontCard[1] = btCardData[1];
                            frontCard[2] = btCardData[2];
                            midCard[4] = btCardData[3];
                            backCard[4] = btCardData[4];
                            if (ctoType.getCardLogicValue(frontCard[0]) == 14 && ctoType.getCardLogicValue(frontCard[1]) == 13) {
                                if (bFirst) {
                                    if (pokerLogic.compareCard(frontCard, midCard, 3, 5, false) && pokerLogic.compareCard(midCard, backCard, 5, 5, false)) {
                                        frontFrontCard = frontCard;
                                        frontMidCard = midCard;
                                        frontBackCard = backCard;
                                        bFirst = false;
                                    }
                                }
                                else {
                                    if (pokerLogic.compareCard(frontCard, midCard, 3, 5, false) && pokerLogic.compareCard(midCard, backCard, 5, 5, false) &&
                                        this.isBiggerThanFront(frontFrontCard, frontMidCard, frontBackCard, frontCard, midCard, backCard)) {
                                        frontFrontCard = frontCard;
                                        frontMidCard = midCard;
                                        frontBackCard = backCard;
                                    }
                                }
                            }
                            else {
                                btCardData = btHandCardData;
                                btCardCount = btHandCardCount;
                                btTemp[0] = backCard[0] = btCardData[tagCardType.snOnePare[4]];
                                btTemp[1] = backCard[1] = btCardData[tagCardType.snOnePare[5]];
                                btTemp[2] = backCard[2] = btCardData[tagCardType.snOnePare[6]];
                                btTemp[3] = backCard[3] = btCardData[tagCardType.snOnePare[7]];
                                btTemp[4] = midCard[0] = btCardData[tagCardType.snOnePare[0]];
                                btTemp[5] = midCard[1] = btCardData[tagCardType.snOnePare[1]];
                                btTemp[6] = frontCard[0] = btCardData[tagCardType.snOnePare[2]];
                                btTemp[7] = frontCard[1] = btCardData[tagCardType.snOnePare[3]];
                                pokerLogic.removeCard(btTemp, 8, btCardData, btCardCount);
                                frontCard[2] = btCardData[0];
                                midCard[2] = btCardData[1];
                                midCard[3] = btCardData[2];
                                midCard[4] = btCardData[3];
                                backCard[4] = btCardData[4];
                                if (bFirst) {
                                    if (pokerLogic.compareCard(frontCard, midCard, 3, 5, false) && pokerLogic.compareCard(midCard, backCard, 5, 5, false)) {
                                        frontFrontCard = frontCard;
                                        frontMidCard = midCard;
                                        frontBackCard = backCard;
                                        bFirst = false;
                                    }
                                }
                                else {
                                    if (pokerLogic.compareCard(frontCard, midCard, 3, 5, false) && pokerLogic.compareCard(midCard, backCard, 5, 5, false) &&
                                        this.isBiggerThanFront(frontFrontCard, frontMidCard, frontBackCard, frontCard, midCard, backCard)) {
                                        frontFrontCard = frontCard;
                                        frontMidCard = midCard;
                                        frontBackCard = backCard;
                                    }
                                }
                            }
                        }
                        else if (tagCardType.amOnePare == 5) {
                            btCardData = btHandCardData;
                            btCardCount = btHandCardCount;
                            btTemp[0] = frontCard[0] = btCardData[tagCardType.snOnePare[0]];
                            btTemp[1] = frontCard[1] = btCardData[tagCardType.snOnePare[1]];
                            btTemp[2] = midCard[0] = btCardData[tagCardType.snOnePare[4]];
                            btTemp[3] = midCard[1] = btCardData[tagCardType.snOnePare[5]];
                            btTemp[4] = midCard[2] = btCardData[tagCardType.snOnePare[6]];
                            btTemp[5] = midCard[3] = btCardData[tagCardType.snOnePare[7]];
                            btTemp[6] = backCard[0] = btCardData[tagCardType.snOnePare[2]];
                            btTemp[7] = backCard[1] = btCardData[tagCardType.snOnePare[3]];
                            btTemp[8] = backCard[2] = btCardData[tagCardType.snOnePare[8]];
                            btTemp[9] = backCard[3] = btCardData[tagCardType.snOnePare[9]];
                            pokerLogic.removeCard(btTemp, 8, btCardData, btCardCount);
                            frontCard[2] = btCardData[0];
                            midCard[4] = btCardData[1];
                            backCard[4] = btCardData[2];
                            if (bFirst) {
                                if (pokerLogic.compareCard(frontCard, midCard, 3, 5, false) && pokerLogic.compareCard(midCard, backCard, 5, 5, false)) {
                                    frontFrontCard = frontCard;
                                    frontMidCard = midCard;
                                    frontBackCard = backCard;
                                    bFirst = false;
                                }
                            }
                            else {
                                if (pokerLogic.compareCard(frontCard, midCard, 3, 5, false) && pokerLogic.compareCard(midCard, backCard, 5, 5, false) &&
                                    this.isBiggerThanFront(frontFrontCard, frontMidCard, frontBackCard, frontCard, midCard, backCard)) {
                                    frontFrontCard = frontCard;
                                    frontMidCard = midCard;
                                    frontBackCard = backCard;
                                }
                            }
                        }
                    }
                }

                if (tagCardType.onePare)  //尾道为一对
                {
                    for (var i = 0; i < tagCardType.amTwoPare; i++) {
                        btCardData = btHandCardData;
                        btCardCount = btHandCardCount;
                        for (var j = 0; j < 2; j++) {
                            backCard[j] = btCardData[tagCardType.snStraight[i * 4 + j]];
                        }
                        pokerLogic.removeCard(backCard, 2, btCardData, btCardCount);
                        btCardCount1 = btCardCount -= 2;
                        btCardData1 = btCardData;
                        tagCardType1 = this.getType(btCardData1, btCardCount1);
                        if (tagCardType1.onePare) //剩下一对
                        {

                            for (var j = 0; j < tagCardType1.amTwoPare; j++) {
                                btCardCount1 = btCardCount;
                                btCardData1 = btCardData;
                                for (var k = 0; k < 2; k++) {
                                    midCard[k] = btCardData1[tagCardType1.snTwoPare[j * 2 + k]];
                                }
                                pokerLogic.removeCard(midCard, 2, btCardData1, btCardCount1);
                                btCardCount2 = btCardCount1 -= 2;
                                btCardData2 = btCardData1;
                                tagCardType2 = this.getType(btCardData2, btCardCount2);
                                if (tagCardType2.twoPare)   //一对
                                {
                                    for (var k = 0; k < 2; k++) {
                                        btTemp[k] = frontCard[k] = btCardData2[tagCardType2.snOnePare[k]];
                                    }
                                    pokerLogic.removeCard(btTemp, 2, btCardData2.btCardCount2);
                                    frontCard[2] = btCardData2[0];
                                    midCard[2] = btCardData2[1];
                                    midCard[3] = btCardData2[2];
                                    midCard[4] = btCardData2[3];
                                    backCard[2] = btCardData2[4];
                                    backCard[3] = btCardData2[5];
                                    backCard[4] = btCardData2[6];
                                }
                                else    //散牌
                                {
                                    frontCard[0] = btCardData2[0];
                                    frontCard[1] = btCardData2[1];
                                    frontCard[2] = btCardData2[2];
                                    midCard[2] = btCardData2[3];
                                    midCard[3] = btCardData2[4];
                                    midCard[4] = btCardData2[5];
                                    backCard[2] = btCardData2[6];
                                    backCard[3] = btCardData2[7];
                                    backCard[4] = btCardData2[8];
                                }
                                if (bFirst) {
                                    if (pokerLogic.compareCard(frontCard, midCard, 3, 5, false) && pokerLogic.compareCard(midCard, backCard, 5, 5, false)) {
                                        frontFrontCard = frontCard;
                                        frontMidCard = midCard;
                                        frontBackCard = backCard;
                                        bFirst = false;
                                    }
                                }
                                else {
                                    if (pokerLogic.compareCard(frontCard, midCard, 3, 5, false) && pokerLogic.compareCard(midCard, backCard, 5, 5, false) &&
                                        this.isBiggerThanFront(frontFrontCard, frontMidCard, frontBackCard, frontCard, midCard, backCard)) {
                                        frontFrontCard = frontCard;
                                        frontMidCard = midCard;
                                        frontBackCard = backCard;
                                    }
                                }
                            }
                        }
                        //散牌
                        btCardCount1 = btCardCount;
                        btCardData1 = btCardData;
                        midCard[0] = btCardData1[0];
                        midCard[1] = btCardData1[4];
                        midCard[2] = btCardData1[5];
                        midCard[3] = btCardData1[6];
                        midCard[4] = btCardData1[7];
                        backCard[2] = btCardData1[8];
                        backCard[3] = btCardData1[9];
                        backCard[4] = btCardData1[10];
                        frontCard[0] = btCardData1[1];
                        frontCard[1] = btCardData1[2];
                        frontCard[2] = btCardData1[3];
                        if (bFirst) {
                            if (pokerLogic.compareCard(frontCard, midCard, 3, 5, false) && pokerLogic.compareCard(midCard, backCard, 5, 5, false)) {
                                frontFrontCard = frontCard;
                                frontMidCard = midCard;
                                frontBackCard = backCard;
                                bFirst = false;
                            }
                        }
                        else {
                            if (pokerLogic.compareCard(frontCard, midCard, 3, 5, false) && pokerLogic.compareCard(midCard, backCard, 5, 5, false) &&
                                this.isBiggerThanFront(frontFrontCard, frontMidCard, frontBackCard, frontCard, midCard, backCard)) {
                                frontFrontCard = frontCard;
                                frontMidCard = midCard;
                                frontBackCard = backCard;
                            }
                        }
                    }
                }
            }
        }
        else if (tagCardType.flush) //有同花
        {
            var threeSame = false;
            for (var i = 0; i < tagCardType.amThreeSame; i++) {
                btCardData = btHandCardData;
                btCardCount = btHandCardCount;
                for (var j = 0; j < 3; j++) {
                    frontCard[j] = btCardData[tagCardType.snThreeSame[i * 3 + j]];
                }
                pokerLogic.removeCard(frontCard, 3, btCardData, btCardCount);
                btCardCount1 = btCardCount -= 3;
                btCardData1 = btCardData;
                tagCardType1 = this.getType(btCardData1, btCardCount1);
                if (tagCardType1.flush) {  //有同花
                    for (var j = 0; j < tagCardType1.amFlush; j++) {
                        btCardCount1 = btCardCount;
                        btCardData1 = btCardData;
                        for (var k = 0; k < 5; k++) {
                            backCard[k] = btCardData1[tagCardType1.snFlush[j * 5 + k]];
                        }
                        pokerLogic.removeCard(backCard, 5, btCardData1, btCardCount1);
                        midCard = btCardData1;
                        if (bFirst) {
                            if (pokerLogic.compareCard(frontCard, midCard, 3, 5, false) && pokerLogic.compareCard(midCard, backCard, 5, 5, false)) {
                                threeSame = true;
                                frontFrontCard = frontCard;
                                frontMidCard = midCard;
                                frontBackCard = backCard;
                                bFirst = false;
                            }
                        }
                        else {
                            if (pokerLogic.compareCard(frontCard, midCard, 3, 5, false) && pokerLogic.compareCard(midCard, backCard, 5, 5, false) &&
                                this.isBiggerThanFront(frontFrontCard, frontMidCard, frontBackCard, frontCard, midCard, backCard)) {
                                threeSame = true;
                                frontFrontCard = frontCard;
                                frontMidCard = midCard;
                                frontBackCard = backCard;
                                btFrontAllShuiShu = btAllShuiShu;
                            }
                        }
                    }
                }
                if (tagCardType1.straight)  //有顺子
                {
                    for (var j = 0; j < tagCardType1.straight; j++) {
                        btCardCount1 = btCardCount;
                        btCardData1 = btCardData;
                        for (var k = 0; k < 5; k++) {
                            backCard[k] = btCardData1[tagCardType1.snStraight[j * 5 + k]];
                        }
                        pokerLogic.removeCard(backCard, 5, btCardData1, btCardCount1);
                        midCard = btCardData1;
                        if (bFirst) {
                            if (pokerLogic.compareCard(frontCard, midCard, 3, 5, false) && pokerLogic.compareCard(midCard, backCard, 5, 5, false)) {
                                threeSame = true;
                                frontFrontCard = frontCard;
                                frontMidCard = midCard;
                                frontBackCard = backCard;
                                bFirst = false;
                            }
                        }
                        else {
                            if (pokerLogic.compareCard(frontCard, midCard, 3, 5, false) && pokerLogic.compareCard(midCard, backCard, 5, 5, false) &&
                                this.isBiggerThanFront(frontFrontCard, frontMidCard, frontBackCard, frontCard, midCard, backCard)) {
                                threeSame = true;
                                frontFrontCard = frontCard;
                                frontMidCard = midCard;
                                frontBackCard = backCard;
                                btFrontAllShuiShu = btAllShuiShu;
                            }
                        }
                    }
                }
                if (tagCardType1.threeSame)  //有三条
                {
                    for (var j = 0; j < tagCardType1.threeSame; j++) {
                        btCardCount1 = btCardCount;
                        btCardData1 = btCardData;
                        for (var k = 0; k < 3; k++) {
                            backCard[k] = btCardData1[tagCardType1.snThreeSame[j * 3 + k]];
                        }
                        pokerLogic.removeCard(backCard, 3, btCardData1, btCardCount1);
                        btCardCount2 = btCardCount1 -= 3;
                        btCardData2 = btCardData1;
                        tagCardType2 = this.getType(btCardData2, btCardCount2);
                        if (tagCardType2.threeSame) {
                            for (var k = 0; k < tagCardType2.amThreeSame; k++) {
                                for (var m = 0; m < 3; m++) {
                                    midCard[m] = btCardData2[tagCardType2.snThreeSame[k * 3 + m]];
                                }
                                pokerLogic.removeCard(midCard, 3, btCardData2.btCardCount2);
                                backCard[3] = btCardData2[2];
                                backCard[4] = btCardData2[3];
                                midCard[3] = btCardData2[0];
                                midCard[4] = btCardData2[1];
                                if (bFirst) {
                                    if (pokerLogic.compareCard(frontCard, midCard, 3, 5, false) && pokerLogic.compareCard(midCard, backCard, 5, 5, false)) {
                                        threeSame = true;
                                        frontFrontCard = frontCard;
                                        frontMidCard = midCard;
                                        frontBackCard = backCard;
                                        bFirst = false;
                                    }
                                }
                                else {
                                    if (pokerLogic.compareCard(frontCard, midCard, 3, 5, false) && pokerLogic.compareCard(midCard, backCard, 5, 5, false) &&
                                        this.isBiggerThanFront(frontFrontCard, frontMidCard, frontBackCard, frontCard, midCard, backCard)) {
                                        threeSame = true;
                                        frontFrontCard = frontCard;
                                        frontMidCard = midCard;
                                        frontBackCard = backCard;
                                        btFrontAllShuiShu = btAllShuiShu;
                                    }
                                }
                            }
                        }
                    }
                }
            }
            if (threeSame == false) {
                if (tagCardType.flush)  //尾道为同花
                {
                    for (var i = 0; i < tagCardType.amFlush; i++) {
                        btCardData = btHandCardData;
                        btCardCount = btHandCardCount;
                        for (var j = 0; j < 5; j++) {
                            backCard[j] = btCardData[tagCardType.snFlush[i * 5 + j]];
                        }
                        pokerLogic.removeCard(backCard, 5, btCardData, btCardCount);
                        btCardCount1 = btCardCount -= 5;
                        btCardData1 = btCardData;
                        tagCardType1 = this.getType(btCardData1, btCardCount1);
                        if (tagCardType1.flush) //剩下同花
                        {
                            for (var j = 0; j < tagCardType1.amFlush; j++) {
                                btCardCount1 = btCardCount;
                                btCardData1 = btCardData;
                                for (var k = 0; k < 5; k++) {
                                    midCard[k] = btCardData1[tagCardType.snFlush[j * 5 + k]];
                                }
                                pokerLogic.removeCard(midCard, 5, btCardData1, btCardCount1);
                                frontCard = btCardData1;
                                if (bFirst) {
                                    if (pokerLogic.compareCard(frontCard, midCard, 3, 5, false) && pokerLogic.compareCard(midCard, backCard, 5, 5, false)) {
                                        frontFrontCard = frontCard;
                                        frontMidCard = midCard;
                                        frontBackCard = backCard;
                                        bFirst = false;
                                    }
                                }
                                else {
                                    if (pokerLogic.compareCard(frontCard, midCard, 3, 5, false) && pokerLogic.compareCard(midCard, backCard, 5, 5, false) &&
                                        this.isBiggerThanFront(frontFrontCard, frontMidCard, frontBackCard, frontCard, midCard, backCard)) {
                                        frontFrontCard = frontCard;
                                        frontMidCard = midCard;
                                        frontBackCard = backCard;
                                    }
                                }
                            }
                        }
                        if (tagCardType1.straight)  //剩下顺子
                        {
                            for (var j = 0; j < tagCardType1.amStraight; j++) {
                                btCardCount1 = btCardCount;
                                btCardData1 = btCardData;
                                for (var k = 0; k < 5; k++) {
                                    midCard[k] = btCardData1[tagCardType1.snStraight[j * 5 + k]];
                                }
                                pokerLogic.removeCard(midCard, 5, btCardData1, btCardCount1);
                                frontCard = btCardData1;
                                if (bFirst) {
                                    if (pokerLogic.compareCard(frontCard, midCard, 3, 5, false) && pokerLogic.compareCard(midCard, backCard, 5, 5, false)) {
                                        frontFrontCard = frontCard;
                                        frontMidCard = midCard;
                                        frontBackCard = backCard;
                                        bFirst = false;
                                    }
                                }
                                else {
                                    if (pokerLogic.compareCard(frontCard, midCard, 3, 5, false) && pokerLogic.compareCard(midCard, backCard, 5, 5, false) &&
                                        this.isBiggerThanFront(frontFrontCard, frontMidCard, frontBackCard, frontCard, midCard, backCard)) {
                                        frontFrontCard = frontCard;
                                        frontMidCard = midCard;
                                        frontBackCard = backCard;
                                    }
                                }
                            }
                        }
                        if (tagCardType1.threeSame) //剩下三条
                        {
                            for (var j = 0; j < tagCardType1.amThreeSame; j++) {
                                btCardCount1 = btCardCount;
                                btCardData1 = btCardData;
                                for (var k = 0; k < 3; k++) {
                                    midCard[k] = btCardData1[tagCardType1.snThreeSame[j * 3 + k]];
                                }
                                pokerLogic.removeCard(midCard, 3, btCardData1, btCardCount1);
                                btCardCount2 = btCardCount1 -= 3;
                                btCardData2 = btCardData1;
                                tagCardType2 = this.getType(btCardData2, btCardCount2);
                                if (tagCardType2.threeSame) //三条
                                {
                                    for (var k = 0; k < 3; k++) {
                                        frontCard[k] = btCardData2[tagCardType2.snThreeSame[k]];
                                    }
                                    pokerLogic.removeCard(frontCard, 3, btCardData2, btCardCount2);
                                    midCard[3] = btCardData2[0];
                                    midCard[4] = btCardData2[1];
                                }
                                else if (tagCardType2.twoPare)  //两对
                                {
                                    for (var k = 0; k < 4; k++) {
                                        if (k < 2) {
                                            btTemp[k] = frontCard[k] = btCardData2[tagCardType2.snTwoPare[k]];
                                        }
                                        else {
                                            btTemp[k] = frontCard[k + 1] = btCardData2[tagCardType2.snTwoPare[k]]
                                        }
                                    }
                                    pokerLogic.removeCard(btTemp, 4, btCardData2, btCardCount2);
                                    frontCard[2] = btCardData2[0];
                                }
                                else if (tagCardType2.onePare)  //一对
                                {
                                    for (var k = 0; k < 2; k++) {
                                        btTemp[k] = frontCard[k] = btCardData2[tagCardType2.snOnePare[k]];
                                    }
                                    pokerLogic.removeCard(btTemp, 2, btCardData2, btCardCount);
                                    frontCard[2] = btCardData2[0];
                                    midCard[3] = btCardData2[1];
                                    midCard[4] = btCardData2[2];
                                }
                                else {  //散牌
                                    for (var k = 0; k < 5; k++) {
                                        if (k < 3) {
                                            frontCard[k] = btCardData2[k];
                                        }
                                        else {
                                            midCard[k] = btCardData2[k];
                                        }
                                    }
                                }
                                if (bFirst) {
                                    if (pokerLogic.compareCard(frontCard, midCard, 3, 5, false) && pokerLogic.compareCard(midCard, backCard, 5, 5, false)) {
                                        frontFrontCard = frontCard;
                                        frontMidCard = midCard;
                                        frontBackCard = backCard;
                                        bFirst = false;
                                    }
                                }
                                else {
                                    if (pokerLogic.compareCard(frontCard, midCard, 3, 5, false) && pokerLogic.compareCard(midCard, backCard, 5, 5, false) &&
                                        this.isBiggerThanFront(frontFrontCard, frontMidCard, frontBackCard, frontCard, midCard, backCard)) {
                                        frontFrontCard = frontCard;
                                        frontMidCard = midCard;
                                        frontBackCard = backCard;
                                    }
                                }
                            }
                        }
                        if (tagCardType1.twoPare)   //剩下两对
                        {
                            if (tagCardType1.amOnePare >= 3) {
                                btCardCount1 = btCardCount;
                                btCardData1 = btCardData;
                                btTemp[0] = frontCard[0] = btCardData1[tagCardType1.snOnePare[0]];
                                btTemp[1] = frontCard[1] = btCardData1[tagCardType1.snOnePare[1]];
                                btTemp[2] = midCard[0] = btCardData1[tagCardType1.snOnePare[2]];
                                btTemp[3] = midCard[1] = btCardData1[tagCardType1.snOnePare[3]];
                                btTemp[4] = midCard[2] = btCardData1[tagCardType1.snOnePare[4]];
                                btTemp[5] = midCard[3] = btCardData1[tagCardType1.snOnePare[5]];
                                pokerLogic.removeCard(btTemp, 6, btCardData1, btCardCount1);
                                frontCard[2] = btCardData1[0];
                                midCard[4] = btCardData1[1];
                                if (bFirst) {
                                    if (pokerLogic.compareCard(frontCard, midCard, 3, 5, false) && pokerLogic.compareCard(midCard, backCard, 5, 5, false)) {
                                        frontFrontCard = frontCard;
                                        frontMidCard = midCard;
                                        frontBackCard = backCard;
                                        btFrontAllShuiShu = this.threeDunAllShuiShu(frontFrontCard, frontMidCard, frontBackCard);
                                        bFirst = false;
                                    }
                                }
                                else {
                                    btAllShuiShu = this.threeDunAllShuiShu(frontCard, midCard, BackCard);
                                    if (pokerLogic.compareCard(frontCard, midCard, 3, 5, false) && pokerLogic.compareCard(midCard, backCard, 5, 5, false) &&
                                        this.isBiggerThanFront(frontFrontCard, frontMidCard, frontBackCard, frontCard, midCard, backCard)) {
                                        frontFrontCard = frontCard;
                                        frontMidCard = midCard;
                                        frontBackCard = backCard;
                                        btFrontAllShuiShu = btAllShuiShu;
                                    }
                                }
                            }
                            else {
                                for (var j = 0; j < tagCardType1.amTwoPare; j++) {
                                    btCardCount1 = btCardCount;
                                    btCardData1 = btCardData;
                                    for (var k = 0; k < 4; k++) {
                                        midCard[k] = btCardData1[tagCardType1.snTwoPare[j * 4 + k]];
                                    }
                                    pokerLogic.removeCard(midCard, 4, btCardData1, btCardCount1);
                                    btCardCount2 = btCardCount1 -= 4;
                                    btCardData2 = btCardData1;
                                    tagCardType2 = this.getType(btCardData2, btCardCount2);
                                    if (tagCardType2.twoPare)   //两对
                                    {
                                        for (var k = 0; k < 4; k++) {
                                            if (k < 3) {
                                                frontCard[k] = btCardData2[tagCardType2.snTwoPare[k]];
                                            }
                                            else {
                                                midCard[k + 1] = btCardData2[tagCardType2.snTwoPare[k]];
                                            }
                                        }
                                    }
                                    else if (tagCardType2.onePare)  //一对
                                    {
                                        for (var k = 0; k < 2; k++) {
                                            btTemp[k] = frontCard[k] = btCardData2[tagCardType2.snOnePare[k]];
                                        }
                                        pokerLogic.removeCard(btTemp, 2, btCardData2, btCardCount2);
                                        frontCard[2] = btCardData2[0];
                                        midCard[4] = btCardData2[1];
                                    }
                                    else    //散牌
                                    {
                                        for (var k = 0; k < 4; k++) {
                                            if (k < 3) {
                                                frontCard[k] = btCardData2[k];
                                            }
                                            else {
                                                midCard[k + 1] = btCardData2[k];
                                            }
                                        }
                                    }
                                    if (bFirst) {
                                        if (pokerLogic.compareCard(frontCard, midCard, 3, 5, false) && pokerLogic.compareCard(midCard, backCard, 5, 5, false)) {
                                            frontFrontCard = frontCard;
                                            frontMidCard = midCard;
                                            frontBackCard = backCard;
                                            bFirst = false;
                                        }
                                    }
                                    else {
                                        if (pokerLogic.compareCard(frontCard, midCard, 3, 5, false) && pokerLogic.compareCard(midCard, backCard, 5, 5, false) &&
                                            this.isBiggerThanFront(frontFrontCard, frontMidCard, frontBackCard, frontCard, midCard, backCard)) {
                                            frontFrontCard = frontCard;
                                            frontMidCard = midCard;
                                            frontBackCard = backCard;
                                        }
                                    }
                                }
                            }
                        }
                        if (tagCardType1.onePare)   //剩下一对
                        {
                            for (var j = 0; j < tagCardType1.amOnePare; j++) {
                                btCardCount1 = btCardCount;
                                btCardData1 = btCardData;
                                for (var k = 0; k < 2; k++) {
                                    midCard[k] = btCardData1[tagCardType1.snTwoPare[j * 2 + k]];
                                }
                                pokerLogic.removeCard(midCard, 4, btCardData1, btCardCount1);
                                btCardCount2 = btCardCount1 -= 2;
                                btCardData2 = btCardData1;
                                tagCardType2 = this.getType(btCardData2, btCardCount2);
                                if (tagCardType2.onePare)  //一对
                                {
                                    for (var k = 0; k < 2; k++) {
                                        btTemp[k] = frontCard[k] = btCardData2[tagCardType2.snOnePare[k]];
                                    }
                                    pokerLogic.removeCard(btTemp, 2, btCardData2, btCardCount2);
                                    frontCard[2] = btCardData2[0];
                                    midCard[2] = btCardData2[1];
                                    midCard[3] = btCardData2[2];
                                    midCard[4] = btCardData2[3];
                                }
                                else    //散牌
                                {
                                    for (var k = 0; k < 6; k++) {
                                        if (k < 3) {
                                            frontCard[k] = btCardData2[k];
                                        }
                                        else {
                                            midCard[k - 1] = btCardData2[k];
                                        }
                                    }
                                }
                                if (bFirst) {
                                    if (pokerLogic.compareCard(frontCard, midCard, 3, 5, false) && pokerLogic.compareCard(midCard, backCard, 5, 5, false)) {
                                        frontFrontCard = frontCard;
                                        frontMidCard = midCard;
                                        frontBackCard = backCard;
                                        bFirst = false;
                                    }
                                }
                                else {
                                    if (pokerLogic.compareCard(frontCard, midCard, 3, 5, false) && pokerLogic.compareCard(midCard, backCard, 5, 5, false) &&
                                        this.isBiggerThanFront(frontFrontCard, frontMidCard, frontBackCard, frontCard, midCard, backCard)) {
                                        frontFrontCard = frontCard;
                                        frontMidCard = midCard;
                                        frontBackCard = backCard;
                                    }
                                }
                            }
                        }
                        //散牌
                        btCardCount1 = btCardCount;
                        btCardData1 = btCardData;
                        midCard[0] = btCardData1[0];
                        midCard[1] = btCardData1[4];
                        midCard[2] = btCardData1[5];
                        midCard[3] = btCardData1[6];
                        midCard[4] = btCardData1[7];
                        frontCard[0] = btCardData1[1];
                        frontCard[1] = btCardData1[2];
                        frontCard[2] = btCardData1[3];
                        if (bFirst) {
                            if (pokerLogic.compareCard(frontCard, midCard, 3, 5, false) && pokerLogic.compareCard(midCard, backCard, 5, 5, false)) {
                                frontFrontCard = frontCard;
                                frontMidCard = midCard;
                                frontBackCard = backCard;
                                bFirst = false;
                            }
                        }
                        else {
                            if (pokerLogic.compareCard(frontCard, midCard, 3, 5, false) && pokerLogic.compareCard(midCard, backCard, 5, 5, false) &&
                                this.isBiggerThanFront(frontFrontCard, frontMidCard, frontBackCard, frontCard, midCard, backCard)) {
                                frontFrontCard = frontCard;
                                frontMidCard = midCard;
                                frontBackCard = backCard;
                            }
                        }
                    }
                }
                if (tagCardType.straight)   //尾道为顺子
                {
                    for (var i = 0; i < tagCardType.amStraight; i++) {
                        btCardData = btHandCardData;
                        btCardCount = btHandCardCount;
                        for (var j = 0; j < 5; j++) {
                            backCard[j] = btCardData[tagCardType.snStraight[i * 5 + j]];
                        }
                        pokerLogic.removeCard(backCard, 5, btCardData, btCardCount);
                        btCardCount1 = btCardCount -= 5;
                        btCardData1 = btCardData;
                        tagCardType1 = this.getType(btCardData1, btCardCount1);
                        if (tagCardType1.straight)  //剩下顺子
                        {
                            for (var j = 0; j < tagCardType1.amStraight; j++) {
                                btCardCount1 = btCardCount;
                                btCardData1 = btCardData;
                                for (var k = 0; k < 5; k++) {
                                    midCard[k] = btCardData1[tagCardType1.snStraight[j * 5 + k]];
                                }
                                pokerLogic.removeCard(midCard, 5, btCardData1, btCardCount1);
                                frontCard = btCardData1;
                                if (bFirst) {
                                    if (pokerLogic.compareCard(frontCard, midCard, 3, 5, false) && pokerLogic.compareCard(midCard, backCard, 5, 5, false)) {
                                        frontFrontCard = frontCard;
                                        frontMidCard = midCard;
                                        frontBackCard = backCard;
                                        bFirst = false;
                                    }
                                }
                                else {
                                    if (pokerLogic.compareCard(frontCard, midCard, 3, 5, false) && pokerLogic.compareCard(midCard, backCard, 5, 5, false) &&
                                        this.isBiggerThanFront(frontFrontCard, frontMidCard, frontBackCard, frontCard, midCard, backCard)) {
                                        frontFrontCard = frontCard;
                                        frontMidCard = midCard;
                                        frontBackCard = backCard;
                                    }
                                }
                            }
                        }
                        if (tagCardType1.threeSame) //剩下三条
                        {
                            for (var j = 0; j < tagCardType1.amThreeSame; j++) {
                                btCardCount1 = btCardCount;
                                btCardData1 = btCardData;
                                for (var k = 0; k < 3; k++) {
                                    midCard[k] = btCardData1[tagCardType1.snThreeSame[j * 3 + k]];
                                }
                                pokerLogic.removeCard(MidCard, 3, btCardData1, btCardCount1);
                                btCardCount2 = btCardCount1 -= 3;
                                btCardData2 = btCardData1;
                                tagCardType2 = this.getType(btCardData2, btCardCount2);
                                if (tagCardType2.threeSame) //三条
                                {
                                    for (var k = 0; k < 3; k++) {
                                        frontCard[k] = btCardData2[tagCardType2.snThreeSame[k]];
                                    }
                                    pokerLogic.removeCard(frontCard, 3, btCardData2, btCardCount2);
                                    midCard[3] = btCardData2[0];
                                    midCard[4] = btCardData2[1];
                                }
                                else if (tagCardType2.twoPare)  //两对
                                {
                                    for (var k = 0; k < 4; k++) {
                                        if (k < 2) {
                                            btTemp[k] = frontCard[k] = btCardData2[tagCardType2.snTwoPare[k]];
                                        }
                                        else {
                                            btTemp[k] = frontCard[k + 1] = btCardData2[tagCardType2.snTwoPare[k]];
                                        }
                                    }
                                    pokerLogic.removeCard(btTemp, 4, btCardData2, btCardCount2);
                                    frontCard[2] = btCardData2[0];
                                }
                                else if (tagCardType2.onePare)  //一对
                                {
                                    for (var k = 0; k < 2; k++) {
                                        btTemp[k] = frontCard[k] = btCardData2[tagCardType2.snOnePare[k]];
                                    }
                                    pokerLogic.removeCard(btTemp, 2, btCardData2, btCardCount2);
                                    frontCard[2] = btCardData2[0];
                                    midCard[3] = btCardData2[1];
                                    midCard[4] = btCardData2[2];
                                }
                                else    //散牌
                                {
                                    for (var k = 0; k < 5; k++) {
                                        if (k < 3) {
                                            frontCard[k] = btCardData2[k];
                                        }
                                        else {
                                            midCard[k] = btCardData2[k];
                                        }
                                    }
                                }
                                if (bFirst) {
                                    if (pokerLogic.compareCard(frontCard, midCard, 3, 5, false) && pokerLogic.compareCard(midCard, backCard, 5, 5, false)) {
                                        frontFrontCard = frontCard;
                                        frontMidCard = midCard;
                                        frontBackCard = backCard;
                                        bFirst = false;
                                    }
                                }
                                else {
                                    if (pokerLogic.compareCard(frontCard, midCard, 3, 5, false) && pokerLogic.compareCard(midCard, backCard, 5, 5, false) &&
                                        this.isBiggerThanFront(frontFrontCard, frontMidCard, frontBackCard, frontCard, midCard, backCard)) {
                                        frontFrontCard = frontCard;
                                        frontMidCard = midCard;
                                        frontBackCard = backCard;
                                    }
                                }
                            }
                        }
                        if (tagCardType1.twoPare)   //剩下两对
                        {
                            if (tagCardType1.amOnePare >= 3) {
                                btCardCount1 = btCardCount;
                                btCardData1 = btCardData;
                                btTemp[0] = frontCard[0] = btCardData1[tagCardType.snOnePare[0]];
                                btTemp[1] = frontCard[1] = btCardData1[tagCardType.snOnePare[1]];
                                btTemp[2] = midCard[0] = btCardData1[tagCardType.snOnePare[2]];
                                btTemp[3] = midCard[1] = btCardData1[tagCardType.snOnePare[3]];
                                btTemp[4] = midCard[2] = btCardData1[tagCardType.snOnePare[4]];
                                btTemp[5] = midCard[3] = btCardData1[tagCardType.snOnePare[5]];
                                pokerLogic.removeCard(btTemp, 6, btCardData1, btCardCount1);
                                frontCard[2] = btCardData1[0];
                                midCard[4] = btCardData1[1];
                                if (bFirst) {
                                    if (pokerLogic.compareCard(frontCard, midCard, 3, 5, false) && pokerLogic.compareCard(midCard, backCard, 5, 5, false)) {
                                        frontFrontCard = frontCard;
                                        frontMidCard = midCard;
                                        frontBackCard = backCard;
                                        btFrontAllShuiShu = this.threeDunAllShuiShu(frontFrontCard, frontMidCard, frontBackCard);
                                        bFirst = false;
                                    }
                                }
                                else {
                                    btAllShuiShu = this.threeDunAllShuiShu(frontCard, midCard, backCard);
                                    if (pokerLogic.compareCard(frontCard, midCard, 3, 5, false) && pokerLogic.compareCard(midCard, backCard, 5, 5, false) &&
                                        this.isBiggerThanFront(frontFrontCard, frontMidCard, frontBackCard, frontCard, midCard, backCard)) {
                                        frontFrontCard = frontCard;
                                        frontMidCard = midCard;
                                        frontBackCard = backCard;
                                        btFrontAllShuiShu = btAllShuiShu;
                                    }
                                }
                            }
                            else {
                                for (var j = 0; j < tagCardType1.amTwoPare; j++) {
                                    btCardCount1 = btCardCount;
                                    btCardData1 = btCardData;
                                    for (var k = 0; k < 4; k++) {
                                        midCard[k] = btCardData1[tagCardType1.snTwoPare[j * 4 + k]];
                                    }
                                    pokerLogic.removeCard(midCard, 4, btCardData1, btCardCount1);
                                    btCardCount2 = btCardCount1 -= 4;
                                    btCardData2 = btCardData1;
                                    tagCardType2 = this.getType(btCardData2, btCardCount2);
                                    if (tagCardType2.twoPare)   //两对
                                    {
                                        for (var k = 0; k < 4; k++) {
                                            if (k < 3) {
                                                frontCard[k] = btCardData2[tagCardType2.snTwoPare[k]];
                                            }
                                            else {
                                                midCard[k + 1] = btCardData2[tagCardType2.snTwoPare[k]];
                                            }
                                        }
                                    }
                                    else if (tagCardType2.onePare)  //一对
                                    {
                                        for (var k = 0; k < 2; k++) {
                                            btTemp[k] = frontCard[k] = btCardData2[tagCardType2.snOnePare[k]];
                                        }
                                        pokerLogic.removeCard(btTemp, 2, btCardData2, btCardCount2);
                                        frontCard[2] = btCardData2[0];
                                        midCard[4] = btCardData2[1];
                                    }
                                    else {   //散牌
                                        for (var k = 0; k < 4; k++) {
                                            if (k < 3) {
                                                frontCard[k] = btCardData2[k];
                                            }
                                            else {
                                                midCard[k + 1] = btCardData2[k];
                                            }
                                        }
                                    }
                                    if (bFirst) {
                                        if (pokerLogic.compareCard(frontCard, midCard, 3, 5, false) && pokerLogic.compareCard(midCard, backCard, 5, 5, false)) {
                                            frontFrontCard = frontCard;
                                            frontMidCard = midCard;
                                            frontBackCard = backCard;
                                            bFirst = false;
                                        }
                                    }
                                    else {
                                        if (pokerLogic.compareCard(frontCard, midCard, 3, 5, false) && pokerLogic.compareCard(midCard, backCard, 5, 5, false) &&
                                            this.isBiggerThanFront(frontFrontCard, frontMidCard, frontBackCard, frontCard, midCard, backCard)) {
                                            frontFrontCard = frontCard;
                                            frontMidCard = midCard;
                                            frontBackCard = backCard;
                                        }
                                    }
                                }
                            }
                        }
                        if (tagCardType1.onePare)   //剩下一对
                        {
                            for (var j = 0; j < tagCardType1.amOnePare; j++) {
                                btCardCount1 = btCardCount;
                                btCardData1 = btCardData;
                                for (var k = 0; k < 2; k++) {
                                    midCard[k] = btCardData1[tagCardType1.snOnePare[j * 2 + k]];
                                }
                                pokerLogic.removeCard(midCard, 2, btCardData1, btCardCount1);
                                btCardCount2 = btCardCount1 -= 2;
                                btCardData2 = btCardData1;
                                tagCardType2 = this.getType(btCardData2, btCardCount);
                                if (tagCardType2.onePare)   //一对
                                {
                                    for (var k = 0; k < 2; k++) {
                                        btTemp[k] = frontCard[k] = btCardData2[tagCardType2.snOnePare[k]];
                                    }
                                    pokerLogic.removeCard(btTemp, 2, btCardData2, btCardCount2);
                                    frontCard[2] = btCardData2[0];
                                    midCard[2] = btCardData2[1];
                                    midCard[3] = btCardData2[2];
                                    midCard[4] = btCardData2[3];
                                }
                                else    //散牌
                                {
                                    for (var k = 0; k < 6; k++) {
                                        if (k < 3) {
                                            frontCard[k] = btCardData2[k];
                                        }
                                        else {
                                            midCard[k - 1] = btCardData2[k];
                                        }
                                    }
                                }
                                if (bFirst) {
                                    if (pokerLogic.compareCard(frontCard, midCard, 3, 5, false) && pokerLogic.compareCard(midCard, backCard, 5, 5, false)) {
                                        frontFrontCard = frontCard;
                                        frontMidCard = midCard;
                                        frontBackCard = backCard;
                                        bFirst = false;
                                    }
                                }
                                else {
                                    if (pokerLogic.compareCard(frontCard, midCard, 3, 5, false) && pokerLogic.compareCard(midCard, backCard, 5, 5, false) &&
                                        this.isBiggerThanFront(frontFrontCard, frontMidCard, frontBackCard, frontCard, midCard, backCard)) {
                                        frontFrontCard = frontCard;
                                        frontMidCard = midCard;
                                        frontBackCard = backCard;
                                    }
                                }
                            }
                        }
                        //散牌
                        btCardCount1 = btCardCount;
                        btCardData1 = btCardData;
                        midCard[0] = btCardData1[0];
                        midCard[1] = btCardData1[4];
                        midCard[2] = btCardData1[5];
                        midCard[3] = btCardData1[6];
                        midCard[4] = btCardData1[7];
                        frontCard[0] = btCardData1[1];
                        frontCard[1] = btCardData1[2];
                        frontCard[2] = btCardData1[3];
                        if (bFirst) {
                            if (pokerLogic.compareCard(frontCard, midCard, 3, 5, false) && pokerLogic.compareCard(midCard, backCard, 5, 5, false)) {
                                frontFrontCard = frontCard;
                                frontMidCard = midCard;
                                frontBackCard = backCard;
                                bFirst = false;
                            }
                        }
                        else {
                            if (pokerLogic.compareCard(frontCard, midCard, 3, 5, false) && pokerLogic.compareCard(midCard, backCard, 5, 5, false) &&
                                this.isBiggerThanFront(frontFrontCard, frontMidCard, frontBackCard, frontCard, midCard, backCard)) {
                                frontFrontCard = frontCard;
                                frontMidCard = midCard;
                                frontBackCard = backCard;
                            }
                        }
                    }
                }
                if (tagCardType.threeSame)   //尾道为三条
                {
                    for (var i = 0; i < tagCardType.amThreeSame; i++) {
                        btCardData = btHandCardData;
                        btCardCount = btHandCardCount;
                        for (var j = 0; j < 3; j++) {
                            backCard[j] = btCardData[tagCardType.snStraight[i * 3 + j]];
                        }
                        pokerLogic.removeCard(backCard, 3, btCardData, btCardCount);
                        btCardCount1 = btCardCount -= 3;
                        btCardData1 = btCardData;
                        tagCardType1 = this.getType(btCardData1, btCardCount1);
                        if (tagCardType1.threeSame) //剩下三条
                        {
                            for (var j = 0; j < tagCardType1.amThreeSame; j++) {
                                btCardCount1 = btCardCount;
                                btCardData1 = btCardData;
                                for (var k = 0; k < 3; k++) {
                                    midCard[k] = btCardData1[tagCardType1.snThreeSame[j * 3 + k]];
                                }
                                pokerLogic.removeCard(MidCard, 3, btCardData1, btCardCount1);
                                btCardCount2 = btCardCount1 -= 3;
                                btCardData2 = btCardData1;
                                tagCardType2 = this.getType(btCardData2, btCardCount2);
                                if (tagCardType2.threeSame) //三条
                                {
                                    for (var k = 0; k < 3; k++) {
                                        frontCard[k] = btCardData2[tagCardType2.snThreeSame[k]];
                                    }
                                    pokerLogic.removeCard(frontCard, 3, btCardData2, btCardCount2);
                                    midCard[3] = btCardData2[0];
                                    midCard[4] = btCardData2[1];
                                    backCard[3] = btCardData2[2];
                                    backCard[4] = btCardData2[3];
                                }
                                else if (tagCardType2.twoPare)  //两对
                                {
                                    for (var k = 0; k < 4; k++) {
                                        if (k < 2) {
                                            btTemp[k] = frontCard[k] = btCardData2[tagCardType2.snTwoPare[k]];
                                        }
                                        else {
                                            btTemp[k] = frontCard[k + 1] = btCardData2[tagCardType2.snTwoPare[k]];
                                        }
                                    }
                                    pokerLogic.removeCard(btTemp, 4, btCardData2, btCardCount2);
                                    frontCard[2] = btCardData2[0];
                                    midCard[3] = btCardData2[1];
                                    midCard[4] = btCardData2[2];
                                }
                                else if (tagCardType2.onePare)  //一对
                                {
                                    for (var k = 0; k < 2; k++) {
                                        btTemp[k] = frontCard[k] = btCardData2[tagCardType2.snOnePare[k]];
                                    }
                                    pokerLogic.removeCard(btTemp, 2, btCardData2, btCardCount2);
                                    frontCard[2] = btCardData2[0];
                                    midCard[3] = btCardData2[1];
                                    midCard[4] = btCardData2[2];
                                    backCard[3] = btCardData2[3];
                                    backCard[4] = btCardData2[4];
                                }
                                else    //散牌
                                {
                                    frontCard[0] = btCardData2[0];
                                    frontCard[1] = btCardData2[1];
                                    frontCard[2] = btCardData2[2];
                                    midCard[3] = btCardData2[3];
                                    midCard[4] = btCardData2[4];
                                    backCard[3] = btCardData2[5];
                                    backCard[4] = btCardData2[6];
                                }
                                if (bFirst) {
                                    if (pokerLogic.compareCard(frontCard, midCard, 3, 5, false) && pokerLogic.compareCard(midCard, backCard, 5, 5, false)) {
                                        frontFrontCard = frontCard;
                                        frontMidCard = midCard;
                                        frontBackCard = backCard;
                                        bFirst = false;
                                    }
                                }
                                else {
                                    if (pokerLogic.compareCard(frontCard, midCard, 3, 5, false) && pokerLogic.compareCard(midCard, backCard, 5, 5, false) &&
                                        this.isBiggerThanFront(frontFrontCard, frontMidCard, frontBackCard, frontCard, midCard, backCard)) {
                                        frontFrontCard = frontCard;
                                        frontMidCard = midCard;
                                        frontBackCard = backCard;
                                    }
                                }
                            }
                        }
                        if (tagCardType1.twoPare)   //剩下两对
                        {
                            if (tagCardType1.amOnePare >= 3) {
                                btCardCount1 = btCardCount;
                                btCardData1 = btCardData;
                                btTemp[0] = frontCard[0] = btCardData1[tagCardType.snOnePare[0]];
                                btTemp[1] = frontCard[1] = btCardData1[tagCardType.snOnePare[1]];
                                btTemp[2] = midCard[0] = btCardData1[tagCardType.snOnePare[2]];
                                btTemp[3] = midCard[1] = btCardData1[tagCardType.snOnePare[3]];
                                btTemp[4] = midCard[2] = btCardData1[tagCardType.snOnePare[4]];
                                btTemp[5] = midCard[3] = btCardData1[tagCardType.snOnePare[5]];
                                pokerLogic.removeCard(btTemp, 6, btCardData1, btCardCount1);
                                frontCard[2] = btCardData1[0];
                                midCard[4] = btCardData1[1];
                                backCard[3] = btCardData1[2];
                                backCard[4] = btCardData1[3];
                                if (bFirst) {
                                    if (pokerLogic.compareCard(frontCard, midCard, 3, 5, false) && pokerLogic.compareCard(midCard, backCard, 5, 5, false)) {
                                        frontFrontCard = frontCard;
                                        frontMidCard = midCard;
                                        frontBackCard = backCard;
                                        btFrontAllShuiShu = this.threeDunAllShuiShu(frontFrontCard, frontMidCard, frontBackCard);
                                        bFirst = false;
                                    }
                                }
                                else {
                                    btAllShuiShu = this.threeDunAllShuiShu(frontCard, midCard, backCard);
                                    if (pokerLogic.compareCard(frontCard, midCard, 3, 5, false) && pokerLogic.compareCard(midCard, backCard, 5, 5, false) &&
                                        this.isBiggerThanFront(frontFrontCard, frontMidCard, frontBackCard, frontCard, midCard, backCard)) {
                                        frontFrontCard = frontCard;
                                        frontMidCard = midCard;
                                        frontBackCard = backCard;
                                        btFrontAllShuiShu = btAllShuiShu;
                                    }
                                }
                            }
                            else {
                                for (var j = 0; j < tagCardType1.amTwoPare; j++) {
                                    btCardCount1 = btCardCount;
                                    btCardData1 = btCardData;
                                    for (var k = 0; k < 4; k++) {
                                        midCard[k] = btCardData1[tagCardType1.snTwoPare[j * 4 + k]];
                                    }
                                    pokerLogic.removeCard(midCard, 4, btCardData1, btCardCount1);
                                    btCardCount2 = btCardCount1 -= 4;
                                    btCardData2 = btCardData1;
                                    tagCardType2 = this.getType(btCardData2, btCardCount2);
                                    if (tagCardType2.twoPare)   //两对
                                    {
                                        for (var k = 0; k < 4; k++) {
                                            if (k < 3) {
                                                btTemp[k] = frontCard[k] = btCardData2[tagCardType2.snTwoPare[k]];
                                            }
                                            else {
                                                btTemp[k] = midCard[k + 1] = btCardData2[tagCardType2.snTwoPare[k]];
                                            }
                                        }
                                        pokerLogic.removeCard(btTemp, 4, btCardData2.btCardCount2);
                                        backCard[3] = btCardData2[0];
                                        backCard[4] = btCardData2[1];
                                    }
                                    else if (tagCardType2.onePare)  //一对
                                    {
                                        for (var k = 0; k < 2; k++) {
                                            btTemp[k] = frontCard[k] = btCardData2[tagCardType2.snOnePare[k]];
                                        }
                                        pokerLogic.removeCard(btTemp, 2, btCardData2, btCardCount2);
                                        frontCard[2] = btCardData2[0];
                                        midCard[4] = btCardData2[1];
                                        backCard[3] = btCardData2[2];
                                        backCard[4] = btCardData2[3];
                                    }
                                    else {   //散牌
                                        frontCard[0] = btCardData2[0];
                                        frontCard[1] = btCardData2[1];
                                        frontCard[2] = btCardData2[2];
                                        midCard[4] = btCardData2[3];
                                        backCard[3] = btCardData2[4];
                                        backCard[4] = btCardData2[5];
                                    }
                                    if (bFirst) {
                                        if (pokerLogic.compareCard(frontCard, midCard, 3, 5, false) && pokerLogic.compareCard(midCard, backCard, 5, 5, false)) {
                                            frontFrontCard = frontCard;
                                            frontMidCard = midCard;
                                            frontBackCard = backCard;
                                            bFirst = false;
                                        }
                                    }
                                    else {
                                        if (pokerLogic.compareCard(frontCard, midCard, 3, 5, false) && pokerLogic.compareCard(midCard, backCard, 5, 5, false) &&
                                            this.isBiggerThanFront(frontFrontCard, frontMidCard, frontBackCard, frontCard, midCard, backCard)) {
                                            frontFrontCard = frontCard;
                                            frontMidCard = midCard;
                                            frontBackCard = backCard;
                                        }
                                    }
                                }
                            }
                        }
                        if (tagCardType1.onePare)   //剩下一对
                        {
                            for (var j = 0; j < tagCardType1.amOnePare; j++) {
                                btCardCount1 = btCardCount;
                                btCardData1 = btCardData;
                                for (var k = 0; k < 2; k++) {
                                    midCard[k] = btCardData1[tagCardType1.snOnePare[j * 2 + k]];
                                }
                                pokerLogic.removeCard(midCard, 2, btCardData1, btCardCount1);
                                btCardCount2 = btCardCount1 -= 2;
                                btCardData2 = btCardData1;
                                tagCardType2 = this.getType(btCardData2, btCardCount);
                                if (tagCardType2.onePare)   //一对
                                {
                                    for (var k = 0; k < 2; k++) {
                                        btTemp[k] = frontCard[k] = btCardData2[tagCardType2.snOnePare[k]];
                                    }
                                    pokerLogic.removeCard(btTemp, 2, btCardData2, btCardCount2);
                                    frontCard[2] = btCardData2[0];
                                    midCard[2] = btCardData2[1];
                                    midCard[3] = btCardData2[2];
                                    midCard[4] = btCardData2[3];
                                    backCard[3] = btCardData2[4];
                                    backCard[4] = btCardData2[5];
                                }
                                else    //散牌
                                {
                                    frontCard[0] = btCardData2[0];
                                    frontCard[1] = btCardData2[1];
                                    frontCard[2] = btCardData2[2];
                                    midCard[2] = btCardData2[3];
                                    midCard[3] = btCardData2[4];
                                    midCard[4] = btCardData2[5];
                                    backCard[3] = btCardData2[6];
                                    backCard[4] = btCardData2[7];
                                }
                                if (bFirst) {
                                    if (pokerLogic.compareCard(frontCard, midCard, 3, 5, false) && pokerLogic.compareCard(midCard, backCard, 5, 5, false)) {
                                        frontFrontCard = frontCard;
                                        frontMidCard = midCard;
                                        frontBackCard = backCard;
                                        bFirst = false;
                                    }
                                }
                                else {
                                    if (pokerLogic.compareCard(frontCard, midCard, 3, 5, false) && pokerLogic.compareCard(midCard, backCard, 5, 5, false) &&
                                        this.isBiggerThanFront(frontFrontCard, frontMidCard, frontBackCard, frontCard, midCard, backCard)) {
                                        frontFrontCard = frontCard;
                                        frontMidCard = midCard;
                                        frontBackCard = backCard;
                                    }
                                }
                            }
                        }
                        //散牌
                        btCardCount1 = btCardCount;
                        btCardData1 = btCardData;
                        midCard[0] = btCardData1[0];
                        midCard[1] = btCardData1[4];
                        midCard[2] = btCardData1[5];
                        midCard[3] = btCardData1[6];
                        midCard[4] = btCardData1[7];
                        backCard[3] = btCardData1[8];
                        backCard[4] = btCardData1[9];
                        frontCard[0] = btCardData1[1];
                        frontCard[1] = btCardData1[2];
                        frontCard[2] = btCardData1[3];
                        if (bFirst) {
                            if (pokerLogic.compareCard(frontCard, midCard, 3, 5, false) && pokerLogic.compareCard(midCard, backCard, 5, 5, false)) {
                                frontFrontCard = frontCard;
                                frontMidCard = midCard;
                                frontBackCard = backCard;
                                bFirst = false;
                            }
                        }
                        else {
                            if (pokerLogic.compareCard(frontCard, midCard, 3, 5, false) && pokerLogic.compareCard(midCard, backCard, 5, 5, false) &&
                                this.isBiggerThanFront(frontFrontCard, frontMidCard, frontBackCard, frontCard, midCard, backCard)) {
                                frontFrontCard = frontCard;
                                frontMidCard = midCard;
                                frontBackCard = backCard;
                            }
                        }
                    }
                }
                if (tagCardType.twoPare)  //尾道为两对
                {
                    if (tagCardType.amOnePare < 4) {
                        for (var i = 0; i < tagCardType.amTwoPare; i++) {
                            btCardData = btHandCardData;
                            btCardCount = btHandCardCount;
                            for (var j = 0; j < 4; j++) {
                                backCard[j] = btCardData[tagCardType.snStraight[i * 4 + j]];
                            }
                            pokerLogic.removeCard(backCard, 4, btCardData, btCardCount);
                            btCardCount1 = btCardCount -= 4;
                            btCardData1 = btCardData;
                            tagCardType1 = this.getType(btCardData1, btCardCount1);
                            if (tagCardType1.twoPare) //剩下两对
                            {
                                if (tagCardType1.amOnePare >= 3) {
                                    btCardCount1 = btCardCount;
                                    btCardData1 = btCardData;
                                    btTemp[0] = frontCard[0] = btCardData1[tagCardType1.snOnePare[0]];
                                    btTemp[1] = frontCard[1] = btCardData1[tagCardType1.snOnePare[1]];
                                    btTemp[2] = midCard[0] = btCardData1[tagCardType1.snOnePare[2]];
                                    btTemp[3] = midCard[1] = btCardData1[tagCardType1.snOnePare[3]];
                                    btTemp[4] = midCard[2] = btCardData1[tagCardType1.snOnePare[4]];
                                    btTemp[5] = midCard[3] = btCardData1[tagCardType1.snOnePare[5]];
                                    pokerLogic.removeCard(btTemp, 6, btCardData1, btCardCount1);
                                    frontCard[2] = btCardData1[0];
                                    midCard[4] = btCardData1[1];
                                    backCard[4] = btCardData1[2];
                                    if (bFirst) {
                                        if (pokerLogic.compareCard(frontCard, midCard, 3, 5, false) && pokerLogic.compareCard(midCard, backCard, 5, 5, false)) {
                                            frontFrontCard = frontCard;
                                            frontMidCard = midCard;
                                            frontBackCard = backCard;
                                            btFrontAllShuiShu = this.threeDunAllShuiShu(frontFrontCard, frontMidCard, frontBackCard);
                                            bFirst = false;
                                        }
                                    }
                                    else {
                                        btAllShuiShu = this.threeDunAllShuiShu(frontCard, midCard, backCard);
                                        if (pokerLogic.compareCard(frontCard, midCard, 3, 5, false) && pokerLogic.compareCard(midCard, backCard, 5, 5, false) &&
                                            this.isBiggerThanFront(frontFrontCard, frontMidCard, frontBackCard, frontCard, midCard, backCard)) {
                                            frontFrontCard = frontCard;
                                            frontMidCard = midCard;
                                            frontBackCard = backCard;
                                            btFrontAllShuiShu = btAllShuiShu;
                                        }
                                    }
                                }
                                else {
                                    for (var j = 0; j < tagCardType1.amTwoPare; j++) {
                                        btCardCount1 = btCardCount;
                                        btCardData1 = btCardData;
                                        for (var k = 0; k < 4; k++) {
                                            midCard[k] = btCardData1[tagCardType1.snTwoPare[j * 4 + k]];
                                        }
                                        pokerLogic.removeCard(midCard, 4, btCardData1, btCardCount1);
                                        btCardCount2 = btCardCount1 -= 4;
                                        btCardData2 = btCardData1;
                                        tagCardType2 = this.getType(btCardData2, btCardCount2);
                                        if (tagCardType2.twoPare)   //两对
                                        {
                                            for (var k = 0; k < 4; k++) {
                                                if (k < 3) {
                                                    bTemp[k] = frontCard[k] = btCardData2[tagCardType2.snTwoPare[k]];
                                                }
                                                else {
                                                    bTemp[k] = midCard[k + 1] = btCardData2[tagCardType2.snTwoPare[k]];
                                                }
                                            }
                                            pokerLogic.removeCard(btTemp, 4, btCardData2.btCardCount2);
                                            backCard[4] = btCardData2[0];
                                        }
                                        else if (tagCardType2.onePare)  //一对
                                        {
                                            for (var k = 0; k < 2; k++) {
                                                btTemp[k] = frontCard[k] = btCardData2[tagCardType2.snOnePare[k]];
                                            }
                                            pokerLogic.removeCard(btTemp, 2, btCardData2, btCardCount2);
                                            frontCard[2] = btCardData2[0];
                                            midCard[4] = btCardData2[1];
                                            backCard[4] = btCardData2[2];
                                        }
                                        else    //散牌
                                        {
                                            frontCard[0] = btCardData2[0];
                                            frontCard[1] = btCardData2[1];
                                            frontCard[2] = btCardData2[2];
                                            midCard[4] = btCardData2[3];
                                            backCard[4] = btCardData2[4];
                                        }
                                        if (bFirst) {
                                            if (pokerLogic.compareCard(frontCard, midCard, 3, 5, false) && pokerLogic.compareCard(midCard, backCard, 5, 5, false)) {
                                                frontFrontCard = frontCard;
                                                frontMidCard = midCard;
                                                frontBackCard = backCard;
                                                bFirst = false;
                                            }
                                        }
                                        else {
                                            if (pokerLogic.compareCard(frontCard, midCard, 3, 5, false) && pokerLogic.compareCard(midCard, backCard, 5, 5, false) &&
                                                this.isBiggerThanFront(frontFrontCard, frontMidCard, frontBackCard, frontCard, midCard, backCard)) {
                                                frontFrontCard = frontCard;
                                                frontMidCard = midCard;
                                                frontBackCard = backCard;
                                            }
                                        }
                                    }
                                }
                            }
                            if (tagCardType1.onePare)   //剩下一对
                            {
                                for (var j = 0; j < tagCardType1.amOnePare; j++) {
                                    btCardCount1 = btCardCount;
                                    btCardData1 = btCardData;
                                    for (var k = 0; k < 2; k++) {
                                        midCard[k] = btCardData1[tagCardType1.snOnePare[j * 2 + k]];
                                    }
                                    pokerLogic.removeCard(midCard, 2, btCardData1, btCardCount1);
                                    btCardCount2 = btCardCount1 -= 2;
                                    btCardData2 = btCardData1;
                                    tagCardType2 = this.getType(btCardData2, btCardCount2);
                                    if (tagCardType2.onePare)   //一对
                                    {
                                        for (var k = 0; k < 2; k++) {
                                            btTemp[k] = frontCard[k] = btCardData2[tagCardType2.snOnePare[k]];
                                        }
                                        pokerLogic.removeCard(btTemp, 2, btCardData2, btCardCount2);
                                        frontCard[2] = btCardData2[0];
                                        midCard[2] = btCardData2[1];
                                        midCard[3] = btCardData2[2];
                                        midCard[4] = btCardData2[3];
                                        backCard[4] = btCardData2[4];
                                    }
                                    else {   //散牌
                                        frontCard[0] = btCardData2[0];
                                        frontCard[1] = btCardData2[1];
                                        frontCard[2] = btCardData2[2];
                                        midCard[2] = btCardData2[3];
                                        midCard[3] = btCardData2[4];
                                        midCard[4] = btCardData2[5];
                                        backCard[4] = btCardData2[6];
                                    }
                                    if (bFirst) {
                                        if (pokerLogic.compareCard(frontCard, midCard, 3, 5, false) && pokerLogic.compareCard(midCard, backCard, 5, 5, false)) {
                                            frontFrontCard = frontCard;
                                            frontMidCard = midCard;
                                            frontBackCard = backCard;
                                            bFirst = false;
                                        }
                                    }
                                    else {
                                        if (pokerLogic.compareCard(frontCard, midCard, 3, 5, false) && pokerLogic.compareCard(midCard, backCard, 5, 5, false) &&
                                            this.isBiggerThanFront(frontFrontCard, frontMidCard, frontBackCard, frontCard, midCard, backCard)) {
                                            frontFrontCard = frontCard;
                                            frontMidCard = midCard;
                                            frontBackCard = backCard;
                                        }
                                    }
                                }
                            }
                            //散牌
                            btCardCount1 = btCardCount;
                            btCardData1 = btCardData;
                            midCard[0] = btCardData1[0];
                            midCard[1] = btCardData1[4];
                            midCard[2] = btCardData1[5];
                            midCard[3] = btCardData1[6];
                            midCard[4] = btCardData1[7];
                            backCard[4] = btCardData1[8];
                            frontCard[0] = btCardData1[1];
                            frontCard[1] = btCardData1[2];
                            frontCard[2] = btCardData1[3];
                            if (bFirst) {
                                if (pokerLogic.compareCard(frontCard, midCard, 3, 5, false) && pokerLogic.compareCard(midCard, backCard, 5, 5, false)) {
                                    frontFrontCard = frontCard;
                                    frontMidCard = midCard;
                                    frontBackCard = backCard;
                                    bFirst = false;
                                }
                            }
                            else {
                                if (pokerLogic.compareCard(frontCard, midCard, 3, 5, false) && pokerLogic.compareCard(midCard, backCard, 5, 5, false) &&
                                    this.isBiggerThanFront(frontFrontCard, frontMidCard, frontBackCard, frontCard, midCard, backCard)) {
                                    frontFrontCard = frontCard;
                                    frontMidCard = midCard;
                                    frontBackCard = backCard;
                                }
                            }
                        }
                    }
                    else {
                        if (tagCardType.amOnePare == 4) {
                            btCardData = btHandCardData;
                            btCardCount = btHandCardCount;
                            btTemp[0] = backCard[0] = btCardData[tagCardType.snOnePare[0]];
                            btTemp[1] = backCard[1] = btCardData[tagCardType.snOnePare[1]];
                            btTemp[2] = backCard[2] = btCardData[tagCardType.snOnePare[6]];
                            btTemp[3] = backCard[3] = btCardData[tagCardType.snOnePare[7]];
                            btTemp[4] = midCard[0] = btCardData[tagCardType.snOnePare[2]];
                            btTemp[5] = midCard[1] = btCardData[tagCardType.snOnePare[3]];
                            btTemp[6] = midCard[2] = btCardData[tagCardType.snOnePare[4]];
                            btTemp[7] = midCard[3] = btCardData[tagCardType.snOnePare[5]];
                            pokerLogic.removeCard(btTemp, 8, btCardData, btCardCount);
                            frontCard[0] = btCardData[0];
                            frontCard[1] = btCardData[1];
                            frontCard[2] = btCardData[2];
                            midCard[4] = btCardData[3];
                            backCard[4] = btCardData[4];
                            if (ctoType.getCardLogicValue(frontCard[0]) == 14 && ctoType.getCardLogicValue(frontCard[1]) == 13) {
                                if (bFirst) {
                                    if (pokerLogic.compareCard(frontCard, midCard, 3, 5, false) && pokerLogic.compareCard(midCard, backCard, 5, 5, false)) {
                                        frontFrontCard = frontCard;
                                        frontMidCard = midCard;
                                        frontBackCard = backCard;
                                        bFirst = false;
                                    }
                                }
                                else {
                                    if (pokerLogic.compareCard(frontCard, midCard, 3, 5, false) && pokerLogic.compareCard(midCard, backCard, 5, 5, false) &&
                                        this.isBiggerThanFront(frontFrontCard, frontMidCard, frontBackCard, frontCard, midCard, backCard)) {
                                        frontFrontCard = frontCard;
                                        frontMidCard = midCard;
                                        frontBackCard = backCard;
                                    }
                                }
                            }
                            else {
                                btCardData = btHandCardData;
                                btCardCount = btHandCardCount;
                                btTemp[0] = backCard[0] = btCardData[tagCardType.snOnePare[4]];
                                btTemp[1] = backCard[1] = btCardData[tagCardType.snOnePare[5]];
                                btTemp[2] = backCard[2] = btCardData[tagCardType.snOnePare[6]];
                                btTemp[3] = backCard[3] = btCardData[tagCardType.snOnePare[7]];
                                btTemp[4] = midCard[0] = btCardData[tagCardType.snOnePare[0]];
                                btTemp[5] = midCard[1] = btCardData[tagCardType.snOnePare[1]];
                                btTemp[6] = frontCard[0] = btCardData[tagCardType.snOnePare[2]];
                                btTemp[7] = frontCard[1] = btCardData[tagCardType.snOnePare[3]];
                                pokerLogic.removeCard(btTemp, 8, btCardData, btCardCount);
                                frontCard[2] = btCardData[0];
                                midCard[2] = btCardData[1];
                                midCard[3] = btCardData[2];
                                midCard[4] = btCardData[3];
                                backCard[4] = btCardData[4];
                                if (bFirst) {
                                    if (pokerLogic.compareCard(frontCard, midCard, 3, 5, false) && pokerLogic.compareCard(midCard, backCard, 5, 5, false)) {
                                        frontFrontCard = frontCard;
                                        frontMidCard = midCard;
                                        frontBackCard = backCard;
                                        bFirst = false;
                                    }
                                }
                                else {
                                    if (pokerLogic.compareCard(frontCard, midCard, 3, 5, false) && pokerLogic.compareCard(midCard, backCard, 5, 5, false) &&
                                        this.isBiggerThanFront(frontFrontCard, frontMidCard, frontBackCard, frontCard, midCard, backCard)) {
                                        frontFrontCard = frontCard;
                                        frontMidCard = midCard;
                                        frontBackCard = backCard;
                                    }
                                }
                            }
                        }
                        else if (tagCardType.amOnePare == 5) {
                            btCardData = btHandCardData;
                            btCardCount = btHandCardCount;
                            btTemp[0] = frontCard[0] = btCardData[tagCardType.snOnePare[0]];
                            btTemp[1] = frontCard[1] = btCardData[tagCardType.snOnePare[1]];
                            btTemp[2] = midCard[0] = btCardData[tagCardType.snOnePare[4]];
                            btTemp[3] = midCard[1] = btCardData[tagCardType.snOnePare[5]];
                            btTemp[4] = midCard[2] = btCardData[tagCardType.snOnePare[6]];
                            btTemp[5] = midCard[3] = btCardData[tagCardType.snOnePare[7]];
                            btTemp[6] = backCard[0] = btCardData[tagCardType.snOnePare[2]];
                            btTemp[7] = backCard[1] = btCardData[tagCardType.snOnePare[3]];
                            btTemp[8] = backCard[2] = btCardData[tagCardType.snOnePare[8]];
                            btTemp[9] = backCard[3] = btCardData[tagCardType.snOnePare[9]];
                            pokerLogic.removeCard(btTemp, 8, btCardData, btCardCount);
                            frontCard[2] = btCardData[0];
                            midCard[4] = btCardData[1];
                            backCard[4] = btCardData[2];
                            if (bFirst) {
                                if (pokerLogic.compareCard(frontCard, midCard, 3, 5, false) && pokerLogic.compareCard(midCard, backCard, 5, 5, false)) {
                                    frontFrontCard = frontCard;
                                    frontMidCard = midCard;
                                    frontBackCard = backCard;
                                    bFirst = false;
                                }
                            }
                            else {
                                if (pokerLogic.compareCard(frontCard, midCard, 3, 5, false) && pokerLogic.compareCard(midCard, backCard, 5, 5, false) &&
                                    this.isBiggerThanFront(frontFrontCard, frontMidCard, frontBackCard, frontCard, midCard, backCard)) {
                                    frontFrontCard = frontCard;
                                    frontMidCard = midCard;
                                    frontBackCard = backCard;
                                }
                            }
                        }
                    }
                }
                if (tagCardType.onePare)  //尾道为一对
                {
                    if (tagCardType.amOnePare < 4) {
                        for (var i = 0; i < tagCardType.amTwoPare; i++) {
                            btCardData = btHandCardData;
                            btCardCount = btHandCardCount;
                            for (var j = 0; j < 2; j++) {
                                backCard[j] = btCardData[tagCardType.snStraight[i * 2 + j]];
                            }
                            pokerLogic.removeCard(backCard, 2, btCardData, btCardCount);
                            btCardCount1 = btCardCount -= 2;
                            btCardData1 = btCardData;
                            tagCardType1 = this.getType(btCardData1, btCardCount1);
                            if (tagCardType1.onePare)   //剩下一对
                            {
                                for (var j = 0; j < tagCardType1.amOnePare; j++) {
                                    btCardCount1 = btCardCount;
                                    btCardData1 = btCardData;
                                    for (var k = 0; k < 2; k++) {
                                        midCard[k] = btCardData1[tagCardType1.snOnePare[j * 2 + k]];
                                    }
                                    pokerLogic.removeCard(midCard, 2, btCardData1, btCardCount1);
                                    btCardCount2 = btCardCount1 -= 2;
                                    btCardData2 = btCardData1;
                                    tagCardType2 = this.getType(btCardData2, btCardCount2);
                                    if (tagCardType2.onePare)   //一对
                                    {
                                        for (var k = 0; k < 2; k++) {
                                            btTemp[k] = frontCard[k] = btCardData2[tagCardType2.snOnePare[k]];
                                        }
                                        pokerLogic.removeCard(btTemp, 2, btCardData2, btCardCount2);
                                        frontCard[2] = btCardData2[0];
                                        midCard[2] = btCardData2[1];
                                        midCard[3] = btCardData2[2];
                                        midCard[4] = btCardData2[3];
                                        backCard[2] = btCardData2[4];
                                        backCard[3] = btCardData2[5];
                                        backCard[4] = btCardData2[6];
                                    }
                                    else {   //散牌
                                        frontCard[0] = btCardData2[0];
                                        frontCard[1] = btCardData2[1];
                                        frontCard[2] = btCardData2[2];
                                        midCard[2] = btCardData2[3];
                                        midCard[3] = btCardData2[4];
                                        midCard[4] = btCardData2[5];
                                        backCard[2] = btCardData2[6];
                                        backCard[3] = btCardData2[7];
                                        backCard[4] = btCardData2[8];
                                    }
                                    if (bFirst) {
                                        if (pokerLogic.compareCard(frontCard, midCard, 3, 5, false) && pokerLogic.compareCard(midCard, backCard, 5, 5, false)) {
                                            frontFrontCard = frontCard;
                                            frontMidCard = midCard;
                                            frontBackCard = backCard;
                                            bFirst = false;
                                        }
                                    }
                                    else {
                                        if (pokerLogic.compareCard(frontCard, midCard, 3, 5, false) && pokerLogic.compareCard(midCard, backCard, 5, 5, false) &&
                                            this.isBiggerThanFront(frontFrontCard, frontMidCard, frontBackCard, frontCard, midCard, backCard)) {
                                            frontFrontCard = frontCard;
                                            frontMidCard = midCard;
                                            frontBackCard = backCard;
                                        }
                                    }
                                }
                            }
                            //散牌
                            btCardCount1 = btCardCount;
                            btCardData1 = btCardData;
                            midCard[0] = btCardData1[0];
                            midCard[1] = btCardData1[4];
                            midCard[2] = btCardData1[5];
                            midCard[3] = btCardData1[6];
                            midCard[4] = btCardData1[7];
                            backCard[2] = btCardData1[8];
                            backCard[3] = btCardData1[9];
                            backCard[4] = btCardData1[10];
                            frontCard[0] = btCardData1[1];
                            frontCard[1] = btCardData1[2];
                            frontCard[2] = btCardData1[3];
                            if (bFirst) {
                                if (pokerLogic.compareCard(frontCard, midCard, 3, 5, false) && pokerLogic.compareCard(midCard, backCard, 5, 5, false)) {
                                    frontFrontCard = frontCard;
                                    frontMidCard = midCard;
                                    frontBackCard = backCard;
                                    bFirst = false;
                                }
                            }
                            else {
                                if (pokerLogic.compareCard(frontCard, midCard, 3, 5, false) && pokerLogic.compareCard(midCard, backCard, 5, 5, false) &&
                                    this.isBiggerThanFront(frontFrontCard, frontMidCard, frontBackCard, frontCard, midCard, backCard)) {
                                    frontFrontCard = frontCard;
                                    frontMidCard = midCard;
                                    frontBackCard = backCard;
                                }
                            }
                        }
                    }
                }
            }
        }
        else if (tagCardType.straight)  //有顺子
        {
            var threeSame = false;
            for (var i = 0; i < tagCardType.amThreeSame; i++) {
                btCardData = btHandCardData;
                btCardCount = btHandCardCount;
                for (var j = 0; j < 3; j++) {
                    frontCard[i] = btCardData[tagCardType.snThreeSame[i * 3 + j]];
                }
                pokerLogic.removeCard(frontCard, 3, btCardData, btCardCount);
                btCardCount1 = btCardCount -= 3;
                btCardData1 = btCardData;
                tagCardType1 = this.getType(btCardData1, btCardCount1);
                if (tagCardType1.straight)  //有顺子
                {
                    for (var j = 0; j < tagCardType1.amStraight; j++) {
                        btCardCount1 = btCardCount;
                        btCardData1 = btCardData;
                        for (var k = 0; k < 5; k++) {
                            backCard[k] = btCardData1[tagCardType1.snStraight[j * 5 + k]];
                        }
                        pokerLogic.removeCard(backCard, 5, btCardData1, btCardCount1);
                        midCard = btCardData1;
                        if (bFirst) {
                            if (pokerLogic.compareCard(frontCard, midCard, 3, 5, false) && pokerLogic.compareCard(midCard, backCard, 5, 5, false)) {
                                threeSame = true;
                                frontFrontCard = frontCard;
                                frontMidCard = midCard;
                                frontBackCard = backCard;
                                bFirst = false;
                            }
                        }
                        else {
                            if (pokerLogic.compareCard(frontCard, midCard, 3, 5, false) && pokerLogic.compareCard(midCard, backCard, 5, 5, false) &&
                                this.isBiggerThanFront(frontFrontCard, frontMidCard, frontBackCard, frontCard, midCard, backCard)) {
                                threeSame = true;
                                frontFrontCard = frontCard;
                                frontMidCard = midCard;
                                frontBackCard = backCard;
                                btFrontAllShuiShu = btAllShuiShu;
                            }
                        }
                    }
                }
                if (tagCardType1.threeSame) //有三条
                {
                    for (var j = 0; j < tagCardType1.amThreeSame; j++) {
                        btCardCount1 = btCardCount;
                        btCardData1 = btCardData;
                        for (var k = 0; k < 3; k++) {
                            backCard[k] = btCardData1[tagCardType1.snThreeSame[j * 3 + k]];
                        }
                        pokerLogic.removeCard(backCard, 3, btCardData1, btCardCount1);
                        btCardCount2 = btCardCount1 -= 3;
                        btCardData2 = btCardData1;
                        tagCardType2 = this.getType(btCardData2, btCardCount2);
                        if (tagCardType2.threeSame) {
                            for (var k = 0; k < tagCardType2.amThreeSame; k++) {
                                for (var m = 0; m < 3; m++) {
                                    midCard[m] = btCardData2[tagCardType2.snThreeSame[k * 3 + m]];
                                }
                                pokerLogic.removeCard(midCard, 3, btCardData2, btCardCount2);
                                backCard[3] = btCardData2[2];
                                backCard[4] = btCardData2[3];
                                midCard[3] = btCardData2[0];
                                midCard[4] = btCardData2[1];
                                if (bFirst) {
                                    if (pokerLogic.compareCard(frontCard, midCard, 3, 5, false) && pokerLogic.compareCard(midCard, backCard, 5, 5, false)) {
                                        threeSame = true;
                                        frontFrontCard = frontCard;
                                        frontMidCard = midCard;
                                        frontBackCard = backCard;
                                        bFirst = false;
                                    }
                                }
                                else {
                                    if (pokerLogic.compareCard(frontCard, midCard, 3, 5, false) && pokerLogic.compareCard(midCard, backCard, 5, 5, false) &&
                                        this.isBiggerThanFront(frontFrontCard, frontMidCard, frontBackCard, frontCard, midCard, backCard)) {
                                        threeSame = true;
                                        frontFrontCard = frontCard;
                                        frontMidCard = midCard;
                                        frontBackCard = backCard;
                                        btFrontAllShuiShu = btAllShuiShu;
                                    }
                                }
                            }
                        }
                    }
                }
            }
            if (threeSame == false) {
                if (tagCardType.straight)   //尾道为顺子
                {
                    for (var i = 0; i < tagCardType.straight; i++) {
                        btCardData = btHandCardData;
                        btCardCount = btHandCardCount;
                        for (var j = 0; j < 5; j++) {
                            backCard[j] = btCardData[tagCardType.snStraight[i * 5 + j]];
                        }
                        pokerLogic.removeCard(backCard, 5, btCardData, btCardCount);
                        btCardCount1 = btCardCount -= 5;
                        btCardData1 = btCardData;
                        tagCardType1 = this.getType(btCardData1, btCardCount1);
                        if (tagCardType1.straight)  //剩下顺子
                        {
                            for (var j = 0; j < tagCardType1.amStraight; j++) {
                                btCardCount1 = btCardCount;
                                btCardData1 = btCardData;
                                for (var k = 0; k < 5; k++) {
                                    midCard[k] = btCardData1[tagCardType1.snStraight[j * 5 + k]];
                                }
                                pokerLogic.removeCard(midCard, 5, btCardData1, btCardCount1);
                                frontCard = btCardData1;
                                if (bFirst) {
                                    if (pokerLogic.compareCard(frontCard, midCard, 3, 5, false) && pokerLogic.compareCard(midCard, backCard, 5, 5, false)) {
                                        frontFrontCard = frontCard;
                                        frontMidCard = midCard;
                                        frontBackCard = backCard;
                                        bFirst = false;
                                    }
                                }
                                else {
                                    if (pokerLogic.compareCard(frontCard, midCard, 3, 5, false) && pokerLogic.compareCard(midCard, backCard, 5, 5, false) &&
                                        this.isBiggerThanFront(frontFrontCard, frontMidCard, frontBackCard, frontCard, midCard, backCard)) {
                                        frontFrontCard = frontCard;
                                        frontMidCard = midCard;
                                        frontBackCard = backCard;
                                    }
                                }
                            }
                        }
                        if (tagCardType1.threeSame)  //剩下三条
                        {
                            for (var j = 0; j < tagCardType1.amThreeSame; j++) {
                                btCardCount1 = btCardCount;
                                btCardData1 = btCardData;
                                for (var k = 0; k < 3; k++) {
                                    midCard[k] = btCardData1[tagCardType1.snStraight[j * 3 + k]];
                                }
                                pokerLogic.removeCard(midCard, 3, btCardData1, btCardCount1);
                                btCardCount2 = btCardCount1 -= 3;
                                btCardData2 = btCardData1;
                                tagCardType2 = this.getType(btCardData2, btCardCount2);
                                if (tagCardType2.threeSame) //三条
                                {
                                    for (var k = 0; k < 3; k++) {
                                        frontCard[k] = btCardData2[tagCardType2.snThreeSame[k]];
                                    }
                                    pokerLogic.removeCard(frontCard, 3, btCardData2, btCardCount2);
                                    midCard[3] = btCardData2[0];
                                    midCard[4] = btCardData2[1];
                                }
                                else if (tagCardType2.twoPare) { //两对
                                    for (var k = 0; k < 4; k++) {
                                        if (k < 2) {
                                            btTemp[k] = frontCard[k] = btCardData2[tagCardType2.snTwoPare[k]];
                                        }
                                        else {
                                            btTemp[k] = frontCard[k + 1] = btCardData2[tagCardType2.snTwoPare[k]];
                                        }
                                    }
                                    pokerLogic.removeCard(btTemp, 4, btCardData2, btCardCount2);
                                    frontCard[2] = btCardData2[0];
                                }
                                else if (tagCardType2.onePare)  //一对
                                {
                                    for (var k = 0; k < 2; k++) {
                                        btTemp[k] = frontCard[k] = btCardData2[tagCardType2.snOnePare[k]];
                                    }
                                    pokerLogic.removeCard(btTemp, 2, btCardData2, btCardCount2);
                                    frontCard[2] = btCardData2[0];
                                    midCard[3] = btCardData2[1];
                                    midCard[4] = btCardData2[2];
                                }
                                else    //散牌
                                {
                                    for (var k = 0; k < 5; k++) {
                                        if (k < 3) {
                                            frontCard[k] = btCardData2[k];
                                        }
                                        else {
                                            midCard[k] = btCardData2[k];
                                        }
                                    }
                                }
                                if (bFirst) {
                                    if (pokerLogic.compareCard(frontCard, midCard, 3, 5, false) && pokerLogic.compareCard(midCard, backCard, 5, 5, false)) {
                                        frontFrontCard = frontCard;
                                        frontMidCard = midCard;
                                        frontBackCard = backCard;
                                        bFirst = false;
                                    }
                                }
                                else {
                                    if (pokerLogic.compareCard(frontCard, midCard, 3, 5, false) && pokerLogic.compareCard(midCard, backCard, 5, 5, false) &&
                                        this.isBiggerThanFront(frontFrontCard, frontMidCard, frontBackCard, frontCard, midCard, backCard)) {
                                        frontFrontCard = frontCard;
                                        frontMidCard = midCard;
                                        frontBackCard = backCard;
                                    }
                                }
                            }
                        }
                        if (tagCardType1.twoPare)   //剩下两对
                        {
                            if (tagCardType1.amOnePare >= 3) {
                                btCardCount1 = btCardCount;
                                btCardData1 = btCardData;
                                btTemp[0] = frontCard[0] = btCardData1[tagCardType.snOnePare[0]];
                                btTemp[1] = frontCard[1] = btCardData1[tagCardType.snOnePare[1]];
                                btTemp[2] = midCard[0] = btCardData1[tagCardType.snOnePare[2]];
                                btTemp[3] = midCard[1] = btCardData1[tagCardType.snOnePare[3]];
                                btTemp[4] = midCard[2] = btCardData1[tagCardType.snOnePare[4]];
                                btTemp[5] = midCard[3] = btCardData1[tagCardType.snOnePare[5]];
                                pokerLogic.removeCard(btTemp, 6, btCardData1, btCardCount1);
                                frontCard[2] = btCardData1[0];
                                midCard[4] = btCardData1[1];
                                if (bFirst) {
                                    if (pokerLogic.compareCard(frontCard, midCard, 3, 5, false) && pokerLogic.compareCard(midCard, backCard, 5, 5, false)) {
                                        frontFrontCard = frontCard;
                                        frontMidCard = midCard;
                                        frontBackCard = backCard;
                                        btFrontAllShuiShu = this.threeDunAllShuiShu(frontFrontCard, frontMidCard, frontBackCard);
                                        bFirst = false;
                                    }
                                }
                                else {
                                    btAllShuiShu = this.threeDunAllShuiShu(frontCard, midCard, backCard);
                                    if (pokerLogic.compareCard(frontCard, midCard, 3, 5, false) && pokerLogic.compareCard(midCard, backCard, 5, 5, false) &&
                                        this.isBiggerThanFront(frontFrontCard, frontMidCard, frontBackCard, frontCard, midCard, backCard)) {
                                        frontFrontCard = frontCard;
                                        frontMidCard = midCard;
                                        frontBackCard = backCard;
                                        btFrontAllShuiShu = btAllShuiShu;
                                    }
                                }
                            }
                            else {
                                for (var j = 0; j < tagCardType1.amTwoPare; j++) {
                                    btCardCount1 = btCardCount;
                                    btCardData1 = btCardData;
                                    for (var k = 0; k < 4; k++) {
                                        midCard[k] = btCardData1[tagCardType1.snTwoPare[j * 4 + k]];
                                    }
                                    pokerLogic.removeCard(midCard, 4, btCardData1, btCardCount1);
                                    btCardCount2 = btCardCount1 -= 4;
                                    btCardData2 = btCardData1;
                                    tagCardType2 = this.getType(btCardData2, btCardCount2);
                                    if (tagCardType2.twoPare)   //两对
                                    {
                                        for (var k = 0; k < 4; k++) {
                                            if (k < 3) {
                                                frontCard[k] = btCardData2[tagCardType2.snTwoPare[k]];
                                            }
                                            else {
                                                midCard[k + 1] = btCardData2[tagCardType2.snTwoPare[k]];
                                            }
                                        }
                                    }
                                    else if (tagCardType2.onePare)  //一对
                                    {
                                        for (var k = 0; k < 2; k++) {
                                            btTemp[k] = frontCard[k] = btCardData2[tagCardType2.snOnePare[k]];
                                        }
                                        pokerLogic.removeCard(btTemp, 2, btCardData2, btCardCount2);
                                        frontCard[2] = btCardData2[0];
                                        midCard[4] = btCardData2[1];
                                    }
                                    else {   //散牌
                                        for (var k = 0; k < 4; k++) {
                                            if (k < 3) {
                                                frontCard[k] = btCardData2[k];
                                            }
                                            else {
                                                midCard[k + 1] = btCardData2[k];
                                            }
                                        }
                                    }
                                    if (bFirst) {
                                        if (pokerLogic.compareCard(frontCard, midCard, 3, 5, false) && pokerLogic.compareCard(midCard, backCard, 5, 5, false)) {
                                            frontFrontCard = frontCard;
                                            frontMidCard = midCard;
                                            frontBackCard = backCard;
                                            bFirst = false;
                                        }
                                    }
                                    else {
                                        if (pokerLogic.compareCard(frontCard, midCard, 3, 5, false) && pokerLogic.compareCard(midCard, backCard, 5, 5, false) &&
                                            this.isBiggerThanFront(frontFrontCard, frontMidCard, frontBackCard, frontCard, midCard, backCard)) {
                                            frontFrontCard = frontCard;
                                            frontMidCard = midCard;
                                            frontBackCard = backCard;
                                        }
                                    }
                                }
                            }
                        }
                        if (tagCardType1.onePare)   //剩下一对
                        {
                            for (var j = 0; j < tagCardType1.amOnePare; j++) {
                                btCardCount1 = btCardCount;
                                btCardData1 = btCardData;
                                for (var k = 0; k < 2; k++) {
                                    midCard[k] = btCardData1[tagCardType1.snOnePare[j * 2 + k]];
                                }
                                pokerLogic.removeCard(midCard, 2, btCardData1, btCardCount1);
                                btCardCount2 = btCardCount1 -= 2;
                                btCardData2 = btCardData1;
                                tagCardType2 = this.getType(btCardData2, btCardCount);
                                if (tagCardType2.onePare)   //一对
                                {
                                    for (var k = 0; k < 2; k++) {
                                        btTemp[k] = frontCard[k] = btCardData2[tagCardType2.snOnePare[k]];
                                    }
                                    pokerLogic.removeCard(btTemp, 2, btCardData2, btCardCount2);
                                    frontCard[2] = btCardData2[0];
                                    midCard[2] = btCardData2[1];
                                    midCard[3] = btCardData2[2];
                                    midCard[4] = btCardData2[3];
                                }
                                else    //散牌
                                {
                                    for (var k = 0; k < 6; k++) {
                                        if (k < 3) {
                                            frontCard[k] = btCardData2[k];
                                        }
                                        else {
                                            midCard[k - 1] = btCardData2[k];
                                        }
                                    }
                                }
                                if (bFirst) {
                                    if (pokerLogic.compareCard(frontCard, midCard, 3, 5, false) && pokerLogic.compareCard(midCard, backCard, 5, 5, false)) {
                                        frontFrontCard = frontCard;
                                        frontMidCard = midCard;
                                        frontBackCard = backCard;
                                        bFirst = false;
                                    }
                                }
                                else {
                                    if (pokerLogic.compareCard(frontCard, midCard, 3, 5, false) && pokerLogic.compareCard(midCard, backCard, 5, 5, false) &&
                                        this.isBiggerThanFront(frontFrontCard, frontMidCard, frontBackCard, frontCard, midCard, backCard)) {
                                        frontFrontCard = frontCard;
                                        frontMidCard = midCard;
                                        frontBackCard = backCard;
                                    }
                                }
                            }
                        }
                        //散牌
                        btCardCount1 = btCardCount;
                        btCardData1 = btCardData;
                        midCard[0] = btCardData1[0];
                        midCard[1] = btCardData1[4];
                        midCard[2] = btCardData1[5];
                        midCard[3] = btCardData1[6];
                        midCard[4] = btCardData1[7];
                        frontCard[0] = btCardData1[1];
                        frontCard[1] = btCardData1[2];
                        frontCard[2] = btCardData1[3];
                        if (bFirst) {
                            if (pokerLogic.compareCard(frontCard, midCard, 3, 5, false) && pokerLogic.compareCard(midCard, backCard, 5, 5, false)) {
                                frontFrontCard = frontCard;
                                frontMidCard = midCard;
                                frontBackCard = backCard;
                                bFirst = false;
                            }
                        }
                        else {
                            if (pokerLogic.compareCard(frontCard, midCard, 3, 5, false) && pokerLogic.compareCard(midCard, backCard, 5, 5, false) &&
                                this.isBiggerThanFront(frontFrontCard, frontMidCard, frontBackCard, frontCard, midCard, backCard)) {
                                frontFrontCard = frontCard;
                                frontMidCard = midCard;
                                frontBackCard = backCard;
                            }
                        }
                    }
                }
            }
            if (tagCardType.threeSame)   //尾道为三条
            {
                for (var i = 0; i < tagCardType.amThreeSame; i++) {
                    btCardData = btHandCardData;
                    btCardCount = btHandCardCount;
                    for (var j = 0; j < 3; j++) {
                        backCard[j] = btCardData[tagCardType.snStraight[i * 3 + j]];
                    }
                    pokerLogic.removeCard(backCard, 3, btCardData, btCardCount);
                    btCardCount1 = btCardCount -= 3;
                    btCardData1 = btCardData;
                    tagCardType1 = this.getType(btCardData1, btCardCount1);
                    if (tagCardType1.threeSame) //剩下三条
                    {
                        for (var j = 0; j < tagCardType1.amThreeSame; j++) {
                            btCardCount1 = btCardCount;
                            btCardData1 = btCardData;
                            for (var k = 0; k < 3; k++) {
                                midCard[k] = btCardData1[tagCardType1.snThreeSame[j * 3 + k]];
                            }
                            pokerLogic.removeCard(MidCard, 3, btCardData1, btCardCount1);
                            btCardCount2 = btCardCount1 -= 3;
                            btCardData2 = btCardData1;
                            tagCardType2 = this.getType(btCardData2, btCardCount2);
                            if (tagCardType2.threeSame) //三条
                            {
                                for (var k = 0; k < 3; k++) {
                                    frontCard[k] = btCardData2[tagCardType2.snThreeSame[k]];
                                }
                                pokerLogic.removeCard(frontCard, 3, btCardData2, btCardCount2);
                                midCard[3] = btCardData2[0];
                                midCard[4] = btCardData2[1];
                                backCard[3] = btCardData2[2];
                                backCard[4] = btCardData2[3];
                            }
                            else if (tagCardType2.twoPare)  //两对
                            {
                                for (var k = 0; k < 4; k++) {
                                    if (k < 2) {
                                        btTemp[k] = frontCard[k] = btCardData2[tagCardType2.snTwoPare[k]];
                                    }
                                    else {
                                        btTemp[k] = frontCard[k + 1] = btCardData2[tagCardType2.snTwoPare[k]];
                                    }
                                }
                                pokerLogic.removeCard(btTemp, 4, btCardData2, btCardCount2);
                                frontCard[2] = btCardData2[0];
                                midCard[3] = btCardData2[1];
                                midCard[4] = btCardData2[2];
                            }
                            else if (tagCardType2.onePare)  //一对
                            {
                                for (var k = 0; k < 2; k++) {
                                    btTemp[k] = frontCard[k] = btCardData2[tagCardType2.snOnePare[k]];
                                }
                                pokerLogic.removeCard(btTemp, 2, btCardData2, btCardCount2);
                                frontCard[2] = btCardData2[0];
                                midCard[3] = btCardData2[1];
                                midCard[4] = btCardData2[2];
                                backCard[3] = btCardData2[3];
                                backCard[4] = btCardData2[4];
                            }
                            else    //散牌
                            {
                                frontCard[0] = btCardData2[0];
                                frontCard[1] = btCardData2[1];
                                frontCard[2] = btCardData2[2];
                                midCard[3] = btCardData2[3];
                                midCard[4] = btCardData2[4];
                                backCard[3] = btCardData2[5];
                                backCard[4] = btCardData2[6];
                            }
                            if (bFirst) {
                                if (pokerLogic.compareCard(frontCard, midCard, 3, 5, false) && pokerLogic.compareCard(midCard, backCard, 5, 5, false)) {
                                    frontFrontCard = frontCard;
                                    frontMidCard = midCard;
                                    frontBackCard = backCard;
                                    bFirst = false;
                                }
                            }
                            else {
                                if (pokerLogic.compareCard(frontCard, midCard, 3, 5, false) && pokerLogic.compareCard(midCard, backCard, 5, 5, false) &&
                                    this.isBiggerThanFront(frontFrontCard, frontMidCard, frontBackCard, frontCard, midCard, backCard)) {
                                    frontFrontCard = frontCard;
                                    frontMidCard = midCard;
                                    frontBackCard = backCard;
                                }
                            }
                        }
                    }
                    if (tagCardType1.twoPare)   //剩下两对
                    {
                        if (tagCardType1.amOnePare >= 3) {
                            btCardCount1 = btCardCount;
                            btCardData1 = btCardData;
                            btTemp[0] = frontCard[0] = btCardData1[tagCardType.snOnePare[0]];
                            btTemp[1] = frontCard[1] = btCardData1[tagCardType.snOnePare[1]];
                            btTemp[2] = midCard[0] = btCardData1[tagCardType.snOnePare[2]];
                            btTemp[3] = midCard[1] = btCardData1[tagCardType.snOnePare[3]];
                            btTemp[4] = midCard[2] = btCardData1[tagCardType.snOnePare[4]];
                            btTemp[5] = midCard[3] = btCardData1[tagCardType.snOnePare[5]];
                            pokerLogic.removeCard(btTemp, 6, btCardData1, btCardCount1);
                            frontCard[2] = btCardData1[0];
                            midCard[4] = btCardData1[1];
                            backCard[3] = btCardData1[2];
                            backCard[4] = btCardData1[3];
                            if (bFirst) {
                                if (pokerLogic.compareCard(frontCard, midCard, 3, 5, false) && pokerLogic.compareCard(midCard, backCard, 5, 5, false)) {
                                    frontFrontCard = frontCard;
                                    frontMidCard = midCard;
                                    frontBackCard = backCard;
                                    btFrontAllShuiShu = this.threeDunAllShuiShu(frontFrontCard, frontMidCard, frontBackCard);
                                    bFirst = false;
                                }
                            }
                            else {
                                btAllShuiShu = this.threeDunAllShuiShu(frontCard, midCard, backCard);
                                if (pokerLogic.compareCard(frontCard, midCard, 3, 5, false) && pokerLogic.compareCard(midCard, backCard, 5, 5, false) &&
                                    this.isBiggerThanFront(frontFrontCard, frontMidCard, frontBackCard, frontCard, midCard, backCard)) {
                                    frontFrontCard = frontCard;
                                    frontMidCard = midCard;
                                    frontBackCard = backCard;
                                    btFrontAllShuiShu = btAllShuiShu;
                                }
                            }
                        }
                        else {
                            for (var j = 0; j < tagCardType1.amTwoPare; j++) {
                                btCardCount1 = btCardCount;
                                btCardData1 = btCardData;
                                for (var k = 0; k < 4; k++) {
                                    midCard[k] = btCardData1[tagCardType1.snTwoPare[j * 4 + k]];
                                }
                                pokerLogic.removeCard(midCard, 4, btCardData1, btCardCount1);
                                btCardCount2 = btCardCount1 -= 4;
                                btCardData2 = btCardData1;
                                tagCardType2 = this.getType(btCardData2, btCardCount2);
                                if (tagCardType2.twoPare)   //两对
                                {
                                    for (var k = 0; k < 4; k++) {
                                        if (k < 3) {
                                            btTemp[k] = frontCard[k] = btCardData2[tagCardType2.snTwoPare[k]];
                                        }
                                        else {
                                            btTemp[k] = midCard[k + 1] = btCardData2[tagCardType2.snTwoPare[k]];
                                        }
                                    }
                                    pokerLogic.removeCard(btTemp, 4, btCardData2.btCardCount2);
                                    backCard[3] = btCardData2[0];
                                    backCard[4] = btCardData2[1];
                                }
                                else if (tagCardType2.onePare)  //一对
                                {
                                    for (var k = 0; k < 2; k++) {
                                        btTemp[k] = frontCard[k] = btCardData2[tagCardType2.snOnePare[k]];
                                    }
                                    pokerLogic.removeCard(btTemp, 2, btCardData2, btCardCount2);
                                    frontCard[2] = btCardData2[0];
                                    midCard[4] = btCardData2[1];
                                    backCard[3] = btCardData2[2];
                                    backCard[4] = btCardData2[3];
                                }
                                else {   //散牌
                                    frontCard[0] = btCardData2[0];
                                    frontCard[1] = btCardData2[1];
                                    frontCard[2] = btCardData2[2];
                                    midCard[4] = btCardData2[3];
                                    backCard[3] = btCardData2[4];
                                    backCard[4] = btCardData2[5];
                                }
                                if (bFirst) {
                                    if (pokerLogic.compareCard(frontCard, midCard, 3, 5, false) && pokerLogic.compareCard(midCard, backCard, 5, 5, false)) {
                                        frontFrontCard = frontCard;
                                        frontMidCard = midCard;
                                        frontBackCard = backCard;
                                        bFirst = false;
                                    }
                                }
                                else {
                                    if (pokerLogic.compareCard(frontCard, midCard, 3, 5, false) && pokerLogic.compareCard(midCard, backCard, 5, 5, false) &&
                                        this.isBiggerThanFront(frontFrontCard, frontMidCard, frontBackCard, frontCard, midCard, backCard)) {
                                        frontFrontCard = frontCard;
                                        frontMidCard = midCard;
                                        frontBackCard = backCard;
                                    }
                                }
                            }
                        }
                    }
                    if (tagCardType1.onePare)   //剩下一对
                    {
                        for (var j = 0; j < tagCardType1.amOnePare; j++) {
                            btCardCount1 = btCardCount;
                            btCardData1 = btCardData;
                            for (var k = 0; k < 2; k++) {
                                midCard[k] = btCardData1[tagCardType1.snOnePare[j * 2 + k]];
                            }
                            pokerLogic.removeCard(midCard, 2, btCardData1, btCardCount1);
                            btCardCount2 = btCardCount1 -= 2;
                            btCardData2 = btCardData1;
                            tagCardType2 = this.getType(btCardData2, btCardCount);
                            if (tagCardType2.onePare)   //一对
                            {
                                for (var k = 0; k < 2; k++) {
                                    btTemp[k] = frontCard[k] = btCardData2[tagCardType2.snOnePare[k]];
                                }
                                pokerLogic.removeCard(btTemp, 2, btCardData2, btCardCount2);
                                frontCard[2] = btCardData2[0];
                                midCard[2] = btCardData2[1];
                                midCard[3] = btCardData2[2];
                                midCard[4] = btCardData2[3];
                                backCard[3] = btCardData2[4];
                                backCard[4] = btCardData2[5];
                            }
                            else    //散牌
                            {
                                frontCard[0] = btCardData2[0];
                                frontCard[1] = btCardData2[1];
                                frontCard[2] = btCardData2[2];
                                midCard[2] = btCardData2[3];
                                midCard[3] = btCardData2[4];
                                midCard[4] = btCardData2[5];
                                backCard[3] = btCardData2[6];
                                backCard[4] = btCardData2[7];
                            }
                            if (bFirst) {
                                if (pokerLogic.compareCard(frontCard, midCard, 3, 5, false) && pokerLogic.compareCard(midCard, backCard, 5, 5, false)) {
                                    frontFrontCard = frontCard;
                                    frontMidCard = midCard;
                                    frontBackCard = backCard;
                                    bFirst = false;
                                }
                            }
                            else {
                                if (pokerLogic.compareCard(frontCard, midCard, 3, 5, false) && pokerLogic.compareCard(midCard, backCard, 5, 5, false) &&
                                    this.isBiggerThanFront(frontFrontCard, frontMidCard, frontBackCard, frontCard, midCard, backCard)) {
                                    frontFrontCard = frontCard;
                                    frontMidCard = midCard;
                                    frontBackCard = backCard;
                                }
                            }
                        }
                    }
                    //散牌
                    btCardCount1 = btCardCount;
                    btCardData1 = btCardData;
                    midCard[0] = btCardData1[0];
                    midCard[1] = btCardData1[4];
                    midCard[2] = btCardData1[5];
                    midCard[3] = btCardData1[6];
                    midCard[4] = btCardData1[7];
                    backCard[3] = btCardData1[8];
                    backCard[4] = btCardData1[9];
                    frontCard[0] = btCardData1[1];
                    frontCard[1] = btCardData1[2];
                    frontCard[2] = btCardData1[3];
                    if (bFirst) {
                        if (pokerLogic.compareCard(frontCard, midCard, 3, 5, false) && pokerLogic.compareCard(midCard, backCard, 5, 5, false)) {
                            frontFrontCard = frontCard;
                            frontMidCard = midCard;
                            frontBackCard = backCard;
                            bFirst = false;
                        }
                    }
                    else {
                        if (pokerLogic.compareCard(frontCard, midCard, 3, 5, false) && pokerLogic.compareCard(midCard, backCard, 5, 5, false) &&
                            this.isBiggerThanFront(frontFrontCard, frontMidCard, frontBackCard, frontCard, midCard, backCard)) {
                            frontFrontCard = frontCard;
                            frontMidCard = midCard;
                            frontBackCard = backCard;
                        }
                    }
                }
            }
            if (tagCardType.twoPare)  //尾道为两对
            {
                if (tagCardType.amOnePare < 4) {
                    for (var i = 0; i < tagCardType.amTwoPare; i++) {
                        btCardData = btHandCardData;
                        btCardCount = btHandCardCount;
                        for (var j = 0; j < 4; j++) {
                            backCard[j] = btCardData[tagCardType.snStraight[i * 4 + j]];
                        }
                        pokerLogic.removeCard(backCard, 4, btCardData, btCardCount);
                        btCardCount1 = btCardCount -= 4;
                        btCardData1 = btCardData;
                        tagCardType1 = this.getType(btCardData1, btCardCount1);
                        if (tagCardType1.twoPare) //剩下两对
                        {
                            if (tagCardType1.amOnePare >= 3) {
                                btCardCount1 = btCardCount;
                                btCardData1 = btCardData;
                                btTemp[0] = frontCard[0] = btCardData1[tagCardType1.snOnePare[0]];
                                btTemp[1] = frontCard[1] = btCardData1[tagCardType1.snOnePare[1]];
                                btTemp[2] = midCard[0] = btCardData1[tagCardType1.snOnePare[2]];
                                btTemp[3] = midCard[1] = btCardData1[tagCardType1.snOnePare[3]];
                                btTemp[4] = midCard[2] = btCardData1[tagCardType1.snOnePare[4]];
                                btTemp[5] = midCard[3] = btCardData1[tagCardType1.snOnePare[5]];
                                pokerLogic.removeCard(btTemp, 6, btCardData1, btCardCount1);
                                frontCard[2] = btCardData1[0];
                                midCard[4] = btCardData1[1];
                                backCard[4] = btCardData1[2];
                                if (bFirst) {
                                    if (pokerLogic.compareCard(frontCard, midCard, 3, 5, false) && pokerLogic.compareCard(midCard, backCard, 5, 5, false)) {
                                        frontFrontCard = frontCard;
                                        frontMidCard = midCard;
                                        frontBackCard = backCard;
                                        btFrontAllShuiShu = this.threeDunAllShuiShu(frontFrontCard, frontMidCard, frontBackCard);
                                        bFirst = false;
                                    }
                                }
                                else {
                                    btAllShuiShu = this.threeDunAllShuiShu(frontCard, midCard, backCard);
                                    if (pokerLogic.compareCard(frontCard, midCard, 3, 5, false) && pokerLogic.compareCard(midCard, backCard, 5, 5, false) &&
                                        this.isBiggerThanFront(frontFrontCard, frontMidCard, frontBackCard, frontCard, midCard, backCard)) {
                                        frontFrontCard = frontCard;
                                        frontMidCard = midCard;
                                        frontBackCard = backCard;
                                        btFrontAllShuiShu = btAllShuiShu;
                                    }
                                }
                            }
                            else {
                                for (var j = 0; j < tagCardType1.amTwoPare; j++) {
                                    btCardCount1 = btCardCount;
                                    btCardData1 = btCardData;
                                    for (var k = 0; k < 4; k++) {
                                        midCard[k] = btCardData1[tagCardType1.snTwoPare[j * 4 + k]];
                                    }
                                    pokerLogic.removeCard(midCard, 4, btCardData1, btCardCount1);
                                    btCardCount2 = btCardCount1 -= 4;
                                    btCardData2 = btCardData1;
                                    tagCardType2 = this.getType(btCardData2, btCardCount2);
                                    if (tagCardType2.twoPare)   //两对
                                    {
                                        for (var k = 0; k < 4; k++) {
                                            if (k < 3) {
                                                bTemp[k] = frontCard[k] = btCardData2[tagCardType2.snTwoPare[k]];
                                            }
                                            else {
                                                bTemp[k] = midCard[k + 1] = btCardData2[tagCardType2.snTwoPare[k]];
                                            }
                                        }
                                        pokerLogic.removeCard(btTemp, 4, btCardData2.btCardCount2);
                                        backCard[4] = btCardData2[0];
                                    }
                                    else if (tagCardType2.onePare)  //一对
                                    {
                                        for (var k = 0; k < 2; k++) {
                                            btTemp[k] = frontCard[k] = btCardData2[tagCardType2.snOnePare[k]];
                                        }
                                        pokerLogic.removeCard(btTemp, 2, btCardData2, btCardCount2);
                                        frontCard[2] = btCardData2[0];
                                        midCard[4] = btCardData2[1];
                                        backCard[4] = btCardData2[2];
                                    }
                                    else    //散牌
                                    {
                                        frontCard[0] = btCardData2[0];
                                        frontCard[1] = btCardData2[1];
                                        frontCard[2] = btCardData2[2];
                                        midCard[4] = btCardData2[3];
                                        backCard[4] = btCardData2[4];
                                    }
                                    if (bFirst) {
                                        if (pokerLogic.compareCard(frontCard, midCard, 3, 5, false) && pokerLogic.compareCard(midCard, backCard, 5, 5, false)) {
                                            frontFrontCard = frontCard;
                                            frontMidCard = midCard;
                                            frontBackCard = backCard;
                                            bFirst = false;
                                        }
                                    }
                                    else {
                                        if (pokerLogic.compareCard(frontCard, midCard, 3, 5, false) && pokerLogic.compareCard(midCard, backCard, 5, 5, false) &&
                                            this.isBiggerThanFront(frontFrontCard, frontMidCard, frontBackCard, frontCard, midCard, backCard)) {
                                            frontFrontCard = frontCard;
                                            frontMidCard = midCard;
                                            frontBackCard = backCard;
                                        }
                                    }
                                }
                            }
                        }
                        if (tagCardType1.onePare)   //剩下一对
                        {
                            for (var j = 0; j < tagCardType1.amOnePare; j++) {
                                btCardCount1 = btCardCount;
                                btCardData1 = btCardData;
                                for (var k = 0; k < 2; k++) {
                                    midCard[k] = btCardData1[tagCardType1.snOnePare[j * 2 + k]];
                                }
                                pokerLogic.removeCard(midCard, 2, btCardData1, btCardCount1);
                                btCardCount2 = btCardCount1 -= 2;
                                btCardData2 = btCardData1;
                                tagCardType2 = this.getType(btCardData2, btCardCount2);
                                if (tagCardType2.onePare)   //一对
                                {
                                    for (var k = 0; k < 2; k++) {
                                        btTemp[k] = frontCard[k] = btCardData2[tagCardType2.snOnePare[k]];
                                    }
                                    pokerLogic.removeCard(btTemp, 2, btCardData2, btCardCount2);
                                    frontCard[2] = btCardData2[0];
                                    midCard[2] = btCardData2[1];
                                    midCard[3] = btCardData2[2];
                                    midCard[4] = btCardData2[3];
                                    backCard[4] = btCardData2[4];
                                }
                                else {   //散牌
                                    frontCard[0] = btCardData2[0];
                                    frontCard[1] = btCardData2[1];
                                    frontCard[2] = btCardData2[2];
                                    midCard[2] = btCardData2[3];
                                    midCard[3] = btCardData2[4];
                                    midCard[4] = btCardData2[5];
                                    backCard[4] = btCardData2[6];
                                }
                                if (bFirst) {
                                    if (pokerLogic.compareCard(frontCard, midCard, 3, 5, false) && pokerLogic.compareCard(midCard, backCard, 5, 5, false)) {
                                        frontFrontCard = frontCard;
                                        frontMidCard = midCard;
                                        frontBackCard = backCard;
                                        bFirst = false;
                                    }
                                }
                                else {
                                    if (pokerLogic.compareCard(frontCard, midCard, 3, 5, false) && pokerLogic.compareCard(midCard, backCard, 5, 5, false) &&
                                        this.isBiggerThanFront(frontFrontCard, frontMidCard, frontBackCard, frontCard, midCard, backCard)) {
                                        frontFrontCard = frontCard;
                                        frontMidCard = midCard;
                                        frontBackCard = backCard;
                                    }
                                }
                            }
                        }
                        //散牌
                        btCardCount1 = btCardCount;
                        btCardData1 = btCardData;
                        midCard[0] = btCardData1[0];
                        midCard[1] = btCardData1[4];
                        midCard[2] = btCardData1[5];
                        midCard[3] = btCardData1[6];
                        midCard[4] = btCardData1[7];
                        backCard[4] = btCardData1[8];
                        frontCard[0] = btCardData1[1];
                        frontCard[1] = btCardData1[2];
                        frontCard[2] = btCardData1[3];
                        if (bFirst) {
                            if (pokerLogic.compareCard(frontCard, midCard, 3, 5, false) && pokerLogic.compareCard(midCard, backCard, 5, 5, false)) {
                                frontFrontCard = frontCard;
                                frontMidCard = midCard;
                                frontBackCard = backCard;
                                bFirst = false;
                            }
                        }
                        else {
                            if (pokerLogic.compareCard(frontCard, midCard, 3, 5, false) && pokerLogic.compareCard(midCard, backCard, 5, 5, false) &&
                                this.isBiggerThanFront(frontFrontCard, frontMidCard, frontBackCard, frontCard, midCard, backCard)) {
                                frontFrontCard = frontCard;
                                frontMidCard = midCard;
                                frontBackCard = backCard;
                            }
                        }
                    }
                }
                else {
                    if (tagCardType.amOnePare == 4) {
                        btCardData = btHandCardData;
                        btCardCount = btHandCardCount;
                        btTemp[0] = backCard[0] = btCardData[tagCardType.snOnePare[0]];
                        btTemp[1] = backCard[1] = btCardData[tagCardType.snOnePare[1]];
                        btTemp[2] = backCard[2] = btCardData[tagCardType.snOnePare[6]];
                        btTemp[3] = backCard[3] = btCardData[tagCardType.snOnePare[7]];
                        btTemp[4] = midCard[0] = btCardData[tagCardType.snOnePare[2]];
                        btTemp[5] = midCard[1] = btCardData[tagCardType.snOnePare[3]];
                        btTemp[6] = midCard[2] = btCardData[tagCardType.snOnePare[4]];
                        btTemp[7] = midCard[3] = btCardData[tagCardType.snOnePare[5]];
                        pokerLogic.removeCard(btTemp, 8, btCardData, btCardCount);
                        frontCard[0] = btCardData[0];
                        frontCard[1] = btCardData[1];
                        frontCard[2] = btCardData[2];
                        midCard[4] = btCardData[3];
                        backCard[4] = btCardData[4];
                        if (ctoType.getCardLogicValue(frontCard[0]) == 14 && ctoType.getCardLogicValue(frontCard[1]) == 13) {
                            if (bFirst) {
                                if (pokerLogic.compareCard(frontCard, midCard, 3, 5, false) && pokerLogic.compareCard(midCard, backCard, 5, 5, false)) {
                                    frontFrontCard = frontCard;
                                    frontMidCard = midCard;
                                    frontBackCard = backCard;
                                    bFirst = false;
                                }
                            }
                            else {
                                if (pokerLogic.compareCard(frontCard, midCard, 3, 5, false) && pokerLogic.compareCard(midCard, backCard, 5, 5, false) &&
                                    this.isBiggerThanFront(frontFrontCard, frontMidCard, frontBackCard, frontCard, midCard, backCard)) {
                                    frontFrontCard = frontCard;
                                    frontMidCard = midCard;
                                    frontBackCard = backCard;
                                }
                            }
                        }
                        else {
                            btCardData = btHandCardData;
                            btCardCount = btHandCardCount;
                            btTemp[0] = backCard[0] = btCardData[tagCardType.snOnePare[4]];
                            btTemp[1] = backCard[1] = btCardData[tagCardType.snOnePare[5]];
                            btTemp[2] = backCard[2] = btCardData[tagCardType.snOnePare[6]];
                            btTemp[3] = backCard[3] = btCardData[tagCardType.snOnePare[7]];
                            btTemp[4] = midCard[0] = btCardData[tagCardType.snOnePare[0]];
                            btTemp[5] = midCard[1] = btCardData[tagCardType.snOnePare[1]];
                            btTemp[6] = frontCard[0] = btCardData[tagCardType.snOnePare[2]];
                            btTemp[7] = frontCard[1] = btCardData[tagCardType.snOnePare[3]];
                            pokerLogic.removeCard(btTemp, 8, btCardData, btCardCount);
                            frontCard[2] = btCardData[0];
                            midCard[2] = btCardData[1];
                            midCard[3] = btCardData[2];
                            midCard[4] = btCardData[3];
                            backCard[4] = btCardData[4];
                            if (bFirst) {
                                if (pokerLogic.compareCard(frontCard, midCard, 3, 5, false) && pokerLogic.compareCard(midCard, backCard, 5, 5, false)) {
                                    frontFrontCard = frontCard;
                                    frontMidCard = midCard;
                                    frontBackCard = backCard;
                                    bFirst = false;
                                }
                            }
                            else {
                                if (pokerLogic.compareCard(frontCard, midCard, 3, 5, false) && pokerLogic.compareCard(midCard, backCard, 5, 5, false) &&
                                    this.isBiggerThanFront(frontFrontCard, frontMidCard, frontBackCard, frontCard, midCard, backCard)) {
                                    frontFrontCard = frontCard;
                                    frontMidCard = midCard;
                                    frontBackCard = backCard;
                                }
                            }
                        }
                    }
                    else if (tagCardType.amOnePare == 5) {
                        btCardData = btHandCardData;
                        btCardCount = btHandCardCount;
                        btTemp[0] = frontCard[0] = btCardData[tagCardType.snOnePare[0]];
                        btTemp[1] = frontCard[1] = btCardData[tagCardType.snOnePare[1]];
                        btTemp[2] = midCard[0] = btCardData[tagCardType.snOnePare[4]];
                        btTemp[3] = midCard[1] = btCardData[tagCardType.snOnePare[5]];
                        btTemp[4] = midCard[2] = btCardData[tagCardType.snOnePare[6]];
                        btTemp[5] = midCard[3] = btCardData[tagCardType.snOnePare[7]];
                        btTemp[6] = backCard[0] = btCardData[tagCardType.snOnePare[2]];
                        btTemp[7] = backCard[1] = btCardData[tagCardType.snOnePare[3]];
                        btTemp[8] = backCard[2] = btCardData[tagCardType.snOnePare[8]];
                        btTemp[9] = backCard[3] = btCardData[tagCardType.snOnePare[9]];
                        pokerLogic.removeCard(btTemp, 8, btCardData, btCardCount);
                        frontCard[2] = btCardData[0];
                        midCard[4] = btCardData[1];
                        backCard[4] = btCardData[2];
                        if (bFirst) {
                            if (pokerLogic.compareCard(frontCard, midCard, 3, 5, false) && pokerLogic.compareCard(midCard, backCard, 5, 5, false)) {
                                frontFrontCard = frontCard;
                                frontMidCard = midCard;
                                frontBackCard = backCard;
                                bFirst = false;
                            }
                        }
                        else {
                            if (pokerLogic.compareCard(frontCard, midCard, 3, 5, false) && pokerLogic.compareCard(midCard, backCard, 5, 5, false) &&
                                this.isBiggerThanFront(frontFrontCard, frontMidCard, frontBackCard, frontCard, midCard, backCard)) {
                                frontFrontCard = frontCard;
                                frontMidCard = midCard;
                                frontBackCard = backCard;
                            }
                        }
                    }
                }
            }
            if (tagCardType.onePare)  //尾道为一对
            {
                if (tagCardType.amOnePare < 4) {
                    for (var i = 0; i < tagCardType.amTwoPare; i++) {
                        btCardData = btHandCardData;
                        btCardCount = btHandCardCount;
                        for (var j = 0; j < 2; j++) {
                            backCard[j] = btCardData[tagCardType.snStraight[i * 2 + j]];
                        }
                        pokerLogic.removeCard(backCard, 2, btCardData, btCardCount);
                        btCardCount1 = btCardCount -= 2;
                        btCardData1 = btCardData;
                        tagCardType1 = this.getType(btCardData1, btCardCount1);
                        if (tagCardType1.onePare)   //剩下一对
                        {
                            for (var j = 0; j < tagCardType1.amOnePare; j++) {
                                btCardCount1 = btCardCount;
                                btCardData1 = btCardData;
                                for (var k = 0; k < 2; k++) {
                                    midCard[k] = btCardData1[tagCardType1.snOnePare[j * 2 + k]];
                                }
                                pokerLogic.removeCard(midCard, 2, btCardData1, btCardCount1);
                                btCardCount2 = btCardCount1 -= 2;
                                btCardData2 = btCardData1;
                                tagCardType2 = this.getType(btCardData2, btCardCount2);
                                if (tagCardType2.onePare)   //一对
                                {
                                    for (var k = 0; k < 2; k++) {
                                        btTemp[k] = frontCard[k] = btCardData2[tagCardType2.snOnePare[k]];
                                    }
                                    pokerLogic.removeCard(btTemp, 2, btCardData2, btCardCount2);
                                    frontCard[2] = btCardData2[0];
                                    midCard[2] = btCardData2[1];
                                    midCard[3] = btCardData2[2];
                                    midCard[4] = btCardData2[3];
                                    backCard[2] = btCardData2[4];
                                    backCard[3] = btCardData2[5];
                                    backCard[4] = btCardData2[6];
                                }
                                else {   //散牌
                                    frontCard[0] = btCardData2[0];
                                    frontCard[1] = btCardData2[1];
                                    frontCard[2] = btCardData2[2];
                                    midCard[2] = btCardData2[3];
                                    midCard[3] = btCardData2[4];
                                    midCard[4] = btCardData2[5];
                                    backCard[2] = btCardData2[6];
                                    backCard[3] = btCardData2[7];
                                    backCard[4] = btCardData2[8];
                                }
                                if (bFirst) {
                                    if (pokerLogic.compareCard(frontCard, midCard, 3, 5, false) && pokerLogic.compareCard(midCard, backCard, 5, 5, false)) {
                                        frontFrontCard = frontCard;
                                        frontMidCard = midCard;
                                        frontBackCard = backCard;
                                        bFirst = false;
                                    }
                                }
                                else {
                                    if (pokerLogic.compareCard(frontCard, midCard, 3, 5, false) && pokerLogic.compareCard(midCard, backCard, 5, 5, false) &&
                                        this.isBiggerThanFront(frontFrontCard, frontMidCard, frontBackCard, frontCard, midCard, backCard)) {
                                        frontFrontCard = frontCard;
                                        frontMidCard = midCard;
                                        frontBackCard = backCard;
                                    }
                                }
                            }
                        }
                        //散牌
                        btCardCount1 = btCardCount;
                        btCardData1 = btCardData;
                        midCard[0] = btCardData1[0];
                        midCard[1] = btCardData1[4];
                        midCard[2] = btCardData1[5];
                        midCard[3] = btCardData1[6];
                        midCard[4] = btCardData1[7];
                        backCard[2] = btCardData1[8];
                        backCard[3] = btCardData1[9];
                        backCard[4] = btCardData1[10];
                        frontCard[0] = btCardData1[1];
                        frontCard[1] = btCardData1[2];
                        frontCard[2] = btCardData1[3];
                        if (bFirst) {
                            if (pokerLogic.compareCard(frontCard, midCard, 3, 5, false) && pokerLogic.compareCard(midCard, backCard, 5, 5, false)) {
                                frontFrontCard = frontCard;
                                frontMidCard = midCard;
                                frontBackCard = backCard;
                                bFirst = false;
                            }
                        }
                        else {
                            if (pokerLogic.compareCard(frontCard, midCard, 3, 5, false) && pokerLogic.compareCard(midCard, backCard, 5, 5, false) &&
                                this.isBiggerThanFront(frontFrontCard, frontMidCard, frontBackCard, frontCard, midCard, backCard)) {
                                frontFrontCard = frontCard;
                                frontMidCard = midCard;
                                frontBackCard = backCard;
                            }
                        }
                    }
                }
            }
        }
        else if (tagCardType.threeSame) //有三条
        {
            btCardData = btHandCardData;
            btCardCount = btHandCardCount;
            for (var i = 0; i < 3; i++) {
                frontBackCard[i] = btCardData[tagCardType.snThreeSame[i]];
            }
            pokerLogic.removeCard(backCard, 3, btCardData, btCardCount);
            btCardCount1 = btCardCount -= 3;
            btCardData1 = btCardData;
            frontFrontCard[0] = btCardData1[1];
            frontFrontCard[1] = btCardData1[2];
            frontFrontCard[2] = btCardData1[3];
            frontMidCard[0] = btCardData1[0];
            frontMidCard[1] = btCardData1[4];
            frontMidCard[2] = btCardData1[5];
            frontMidCard[3] = btCardData1[6];
            frontMidCard[4] = btCardData1[7];
            frontBackCard[3] = btCardData1[8];
            frontBackCard[4] = btCardData1[9];
        }
        else if (tagCardType.twoPare)   //有两对
        {
            if (tagCardType.onePare == 2) {
                btCardData = btHandCardData;
                btCardCount = btHandCardCount;
                btTemp[0] = frontBackCard[0] = btCardData[tagCardType.snOnePare[0]];
                btTemp[1] = frontBackCard[1] = btCardData[tagCardType.snOnePare[1]];
                btTemp[2] = frontMidCard[0] = btCardData[tagCardType.snOnePare[2]];
                btTemp[3] = frontMidCard[1] = btCardData[tagCardType.snOnePare[3]];
                pokerLogic.removeCard(btTemp, 4, btCardData, btCardCount);
                frontFrontCard[0] = btCardData[0];
                frontFrontCard[1] = btCardData[1];
                frontFrontCard[2] = btCardData[2];
                frontMidCard[2] = btCardData[3];
                frontMidCard[3] = btCardData[4];
                frontMidCard[4] = btCardData[5];
                frontBackCard[2] = btCardData[6];
                frontBackCard[3] = btCardData[7];
                frontBackCard[4] = btCardData[8];
            }
            else if (tagCardType.amOnePare == 3) {
                btCardData = btHandCardData;
                btCardCount = btHandCardCount;
                btTemp[0] = frontBackCard[0] = btCardData[tagCardType.snOnePare[0]];
                btTemp[1] = frontBackCard[1] = btCardData[tagCardType.snOnePare[1]];
                btTemp[2] = frontMidCard[0] = btCardData[tagCardType.snOnePare[2]];
                btTemp[3] = frontMidCard[1] = btCardData[tagCardType.snOnePare[3]];
                btTemp[4] = frontFrontCard[0] = btCardData[tagCardType.snOnePare[4]];
                btTemp[5] = frontFrontCard[1] = btCardData[tagCardType.snOnePare[5]];
                pokerLogic.removeCard(btTemp, 6, btCardData, btCardCount);
                frontFrontCard[2] = btCardData[1];
                frontMidCard[2] = btCardData[1];
                frontMidCard[3] = btCardData[2];
                frontMidCard[4] = btCardData[3];
                frontBackCard[2] = btCardData[4]
                frontBackCard[3] = btCardData[5]
                frontBackCard[4] = btCardData[6]
            }
            else if (tagCardType.amOnePare == 4) {
                btCardData = btHandCardData;
                btCardCount = btHandCardCount;
                btTemp[0] = backCard[0] = btCardData[tagCardType.snOnePare[0]];
                btTemp[1] = backCard[1] = btCardData[tagCardType.snOnePare[1]];
                btTemp[2] = backCard[2] = btCardData[tagCardType.snOnePare[6]];
                btTemp[3] = backCard[3] = btCardData[tagCardType.snOnePare[7]];
                btTemp[4] = midCard[0] = btCardData[tagCardType.snOnePare[2]];
                btTemp[5] = midCard[1] = btCardData[tagCardType.snOnePare[3]];
                btTemp[6] = midCard[2] = btCardData[tagCardType.snOnePare[4]];
                btTemp[7] = midCard[3] = btCardData[tagCardType.snOnePare[5]];
                pokerLogic.removeCard(btTemp, 8, btCardData, btCardCount);
                frontCard[0] = btCardData[0];
                frontCard[1] = btCardData[1];
                frontCard[2] = btCardData[2];
                midCard[4] = btCardData[3];
                backCard[4] = btCardData[4];
                if (ctoType.getCardLogicValue(frontCard[0]) == 14 && ctoType.getCardLogicValue(frontCard[1]) == 13) {
                    if (bFirst) {
                        if (pokerLogic.compareCard(frontCard, midCard, 3, 5, false) && pokerLogic.compareCard(midCard, backCard, 5, 5, false)) {
                            frontFrontCard = frontCard;
                            frontMidCard = midCard;
                            frontBackCard = backCard;
                            bFirst = false;
                        }
                    }
                    else {
                        if (pokerLogic.compareCard(frontCard, midCard, 3, 5, false) && pokerLogic.compareCard(midCard, backCard, 5, 5, false) &&
                            this.isBiggerThanFront(frontFrontCard, frontMidCard, frontBackCard, frontCard, midCard, backCard)) {
                            frontFrontCard = frontCard;
                            frontMidCard = midCard;
                            frontBackCard = backCard;
                        }
                    }
                }
                else {
                    btCardData = btHandCardData;
                    btCardCount = btHandCardCount;
                    btTemp[0] = backCard[0] = btCardData[tagCardType.snOnePare[4]];
                    btTemp[1] = backCard[1] = btCardData[tagCardType.snOnePare[5]];
                    btTemp[2] = backCard[2] = btCardData[tagCardType.snOnePare[6]];
                    btTemp[3] = backCard[3] = btCardData[tagCardType.snOnePare[7]];
                    btTemp[4] = midCard[0] = btCardData[tagCardType.snOnePare[0]];
                    btTemp[5] = midCard[1] = btCardData[tagCardType.snOnePare[1]];
                    btTemp[6] = frontCard[2] = btCardData[tagCardType.snOnePare[2]];
                    btTemp[7] = frontCard[3] = btCardData[tagCardType.snOnePare[3]];
                    pokerLogic.removeCard(btTemp, 8, btCardData, btCardCount);
                    frontCard[2] = btCardData[0];
                    midCard[2] = btCardData[1];
                    midCard[3] = btCardData[2];
                    midCard[4] = btCardData[3];
                    backCard[4] = btCardData[4];
                    if (bFirst) {
                        if (pokerLogic.compareCard(frontCard, midCard, 3, 5, false) && pokerLogic.compareCard(midCard, backCard, 5, 5, false)) {
                            frontFrontCard = frontCard;
                            frontMidCard = midCard;
                            frontBackCard = backCard;
                            bFirst = false;
                        }
                    }
                    else {
                        if (pokerLogic.compareCard(frontCard, midCard, 3, 5, false) && pokerLogic.compareCard(midCard, backCard, 5, 5, false) &&
                            this.isBiggerThanFront(frontFrontCard, frontMidCard, frontBackCard, frontCard, midCard, backCard)) {
                            frontFrontCard = frontCard;
                            frontMidCard = midCard;
                            frontBackCard = backCard;
                        }
                    }
                }
            }
            else if (tagCardType.amOnePare == 5) {
                btCardData = btHandCardData;
                btCardCount = btHandCardCount;
                btTemp[0] = frontFrontCard[0] = btCardData[tagCardType.snOnePare[0]];
                btTemp[1] = frontFrontCard[1] = btCardData[tagCardType.snOnePare[1]];
                btTemp[2] = frontMidCard[0] = btCardData[tagCardType.snOnePare[4]];
                btTemp[3] = frontMidCard[1] = btCardData[tagCardType.snOnePare[5]];
                btTemp[4] = frontMidCard[2] = btCardData[tagCardType.snOnePare[6]];
                btTemp[5] = frontMidCard[3] = btCardData[tagCardType.snOnePare[7]];
                btTemp[6] = frontBackCard[0] = btCardData[tagCardType.snOnePare[2]];
                btTemp[7] = frontBackCard[1] = btCardData[tagCardType.snOnePare[3]];
                btTemp[8] = frontBackCard[2] = btCardData[tagCardType.snOnePare[8]];
                btTemp[9] = frontBackCard[3] = btCardData[tagCardType.snOnePare[9]];
                pokerLogic.removeCard(btTemp, 10, btCardData, btCardCount);
                frontFrontCard[2] = btCardData[0];
                frontMidCard[4] = btCardData[1];
                frontBackCard[4] = btCardData[2];
            }
        }
        ctoType.sortCardList(frontFrontCard, 3);
        ctoType.sortCardList(frontMidCard, 5);
        ctoType.sortCardList(frontBackCard, 5);
        btFrontCard = frontFrontCard;
        btMidCard = frontMidCard;
        btBackCard = frontBackCard;
    },
});
