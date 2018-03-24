cc.Class({
    extends: cc.Component,

    properties: {
        btns:[cc.Button],

        _bets:[],
    },

    // use this for initialization
    onLoad: function () {
        this.labels = [];
        for (let i = 0; i < this.btns.length; i++) {
            this.labels.push(this.btns[i].node.getComponentInChildren(cc.Label));
        }
    },

    initBets: function (bets) {
        this.bets = bets;
        cc.log(JSON.stringify(bets));
        for (let i = 0; i < bets.length; i++) {
            this.labels[i].string = Math.abs(bets[i]) + '倍';
            this.btns[i].interactable = bets[i] > 0;
        }
    },

    onClickedBet: function (event, customData) {
        let i = parseInt(customData);
        let bet = this.bets[i];
        if (bet) {
            cc.mgr.caw.bet(bet);
            this.node.active = false;
        }
    },
});
