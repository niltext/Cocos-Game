
const help = {
    niuniu: `
<size=30><color=#ee5b13 >一、游戏介绍</c></size>
<color=#b1875a>“斗牛”又称“牛牛”，是一种简单有趣的棋牌游戏。最早起源于我国广东、广西和湖南三省，后又风靡全国。斗牛可同时供2-5人玩，游戏速度极快、刺激而惊险，主要是采用一副扑克牌其中的52张（除去大小王）。</c>
<size=30><color=#ee5b13 >二、基本规则</c></size>
<color=#b1875a>1.每局游戏中，必须要有1个庄家和若干个闲家，由庄家和闲家对比游戏
2.每个玩家拥有5张手牌（不同玩法规则不同，但只有5张手牌后才进行比较）
3.如果你有3张手牌（JQK按10计算）相加为10的倍数（如10、20），即为有牛，否则为没牛；有牛后再看2张牌相加的个位数，该数字越大则牌型越大。</c>
<size=30><color=#ee5b13 >三、基本牌型</c></size>
<color=#b1875a>没牛：3张相加不为10的倍数
牛九：3张相加为10的倍数，另外2张相加个位数为9
牛牛：3张相加为10的倍数，另外2张相加为10的倍数
五花牛：5张牌均为花牌JQK
五小牛：5张牌均小于5，且相加之和小于10</c>
<size=30><color=#ee5b13 >四、大小比较</c></size>
<color=#b1875a>1.基本牌型比较
五小牛＞五花牛＞牛牛＞有牛＞没牛
2.牌型相同比较牌数大小
牛九＞牛八＞牛七＞牛六＞牛五＞牛四＞牛三＞牛二＞牛一
3.牌型相同比较牌数字大小
K＞Q＞J＞10＞9＞8＞7＞6＞5＞4＞3＞2＞A
4.数字相同比较花色的大小
黑桃＞红桃＞梅花＞方块</c>
<size=30><color=#ee5b13 >五、看牌抢庄</c></size>
<color=#b1875a>游戏流程：发四张牌→抢庄→闲家下分→发第五张牌→配牌→与庄家比牌→结算</c>
<size=30><color=#ee5b13 >六、轮流坐庄</c></size>
<color=#b1875a>由房主首先坐庄，碰到无牛牌局，自动将庄转交给下架（顺时针）</c>
<size=30><color=#ee5b13 >七、固定庄家</c></size>
<color=#b1875a>由房主固定坐庄，牌局过程中不换庄。</c>
<size=30><color=#ee5b13 >八、获胜积分计算</c></size>
<color=#b1875a>无牛~牛六获胜则X1；牛七~牛九获胜积分X2；牛牛获胜积分X3；五花牛获胜积分X4倍；五小牛获胜积分X5倍。</c>
    `,
    zhuanzhuan: `
<size=30><color=#ee5b13 >一、 转转麻将</c></size>
<color=#b1875a>“转转麻将打法简单、节奏快速、极易胡牌</c>
<size=30><color=#ee5b13 >二、牌数</c></size>
<color=#b1875a>转转麻将，共108张：筒、索、万、不带东、西、南、北、中、发、白</c>
<size=30><color=#ee5b13 >三、摸牌</c></size>
<color=#b1875a>游戏开始，庄家14张牌，闲家13张牌，庄家从牌中选1张丢出。其他3家有权要那张丢出的牌，只能胡、碰、杠不能吃。 </c>
<size=30><color=#ee5b13 >四、胡牌规则</c></size>

<size=30><color=#ee5b13 >五、关于杠</c></size>
<color=#b1875a>1、明杠
A、手上有3张相同的牌，其他玩家打了第4张相同的牌即可开杠。举例：手上有3个一万，其他玩家打了个一万，则可开杠，如果没有流局，则放杠者出分。
B、碰牌之后，自己又摸了1张相同的牌即可开杠，举例：碰了一万，自摸个一万，则可开杠。
2、暗杠
手上抓了四张相同的牌，就是暗杠</c>
<size=30><color=#ee5b13 >六、庄家分配</c></size>
<color=#b1875a>1、第一局由创建房间者为庄家
2、以后谁胡牌，下局谁做庄
3、如果出现通炮情况，则下轮由放炮玩家当庄家</c>
<size=30><color=#ee5b13 >七、积分规则</c></size>
<color=#b1875a>1、自摸：
每人输2分，胡牌玩家赢6分，如庄家自摸，闲家每人输3分。
2、小胡接炮
点炮方输1分，胡牌玩家赢1分，如点炮方为庄家，则庄家多输1分，如接炮方为庄家，点炮的闲家多输1分。
3、开杠
A、暗杠相当于自摸，每人出2分
B、碰牌之后，再抓上1个所碰的牌开杠，每人出1分
C、手抓了3个相同的牌，然后有人打了1个相同的牌，开杠的话，放杠者出3分，但如果碰了不能再杠。
注：杠牌后如果流局依然算杠分。</c>
<size=30><color=#ee5b13 >八、特殊规则</c></size>
<color=#b1875a>1、通炮：即几个玩家可胡同一张牌，此牌即为通炮。
2、漏胡：如果玩家漏掉了炮胡，自己打牌后的同一圈内，胡牌分数没有发生变化的情况下，别人打出多张自己可以胡的牌，第一张牌不胡则后面的牌都不能胡。玩家有摸，吃，碰，杠，补等操作或番数变大情况下才可胡。
<size=30><color=#ee5b13 >九、红中癞子</c></size>
<color=#b1875a>1、红中在手中可以做万能牌使用
2、红中不能碰，不能杠。
3、红中不能和其他牌组合碰杠。比如：1万1万红中，别人打1万，是不能杠1万的。
4、起手4个红中可以直接胡。</c>
<size=30><color=#ee5b13 >十、抓鸟</c></size>
<color=#b1875a>抓鸟在胡牌后进行，由胡牌方进行（一炮多响时由点炮玩家进行），此时从牌堆上取创建房间时选的鸟牌张数，其中包含159（勾选红中癞子玩法时，抓鸟抓出红中算1）牌的个数既为中鸟个数，例如自摸中鸟1个，则最终赢得分数为6+3=9分。
<size=30><color=#ee5b13 >十一、转转麻将没有大牌之说，所有牌型算分都当作是平胡。</c></size>
	`,
}

let helpStr = [help.niuniu, help.zhuanzhuan];
cc.Class({
    extends: cc.Component,

    properties: {
        content: cc.RichText,
        tgGroup: cc.Node,
        container: cc.Node,
        scorllView:cc.ScrollView,
    },

    // use this for initialization
    onLoad: function () {
        this.toggles = this.tgGroup.getComponentsInChildren(cc.Toggle);
        this.contents = this.container.children;

        this.switchContent(0);
    },

    onClose: function () {
        this.node.destroy();
    },

    onToggleClicked: function (toggle, customData) {
        for (let i = 0; i < this.toggles.length; i++) {
            if (toggle == this.toggles[i]) {
                //this.content.string = helpStr[i];
                this.switchContent(i);
                return;
            }
        }
    },

    switchContent: function (idx) {
        for (let i = 0; i < this.contents.length; i++) {
            this.contents[i].active = i == idx;
        }
        this.scorllView.content = this.contents[idx];
    },
});
