let Shop = require('Shop');
let GiftAlert = require('GiftAlert');
let ReplayControl = require('ReplayControl');


cc.Class({
    extends: cc.Component,

    properties: {
        joinRoom: cc.Node,
        createRoom: cc.Node,
        setting: cc.Node,
        share: cc.Node,
        relief: cc.Node,
        servicePanel: cc.Node,
        goldRoomPanel: cc.Node,
        recordPanel: cc.Node,
        inviationCode: cc.Node,

        shop: Shop,
        giftAlert: GiftAlert,
        mainBtns: cc.Node,
        bottomBar: cc.Node,

        replayCtrl: ReplayControl,

    },

    // use this for initialization
    onLoad: function () {
        cc.view.setResolutionPolicy(cc.ResolutionPolicy.EXACT_FIT);
        cc.mgr.hallLogic.hallView = this;

        this.node.opacity = 0;
        this.node.runAction(cc.fadeIn(0.3))

        // setTimeout(function () {
        //     cc.director.preloadScene('sss', function () {
        //         cc.log('sss scene preloaded');
        //     });
        // }, 1000);
    },

    start: function () {
        this.updateDailyMsg();
    },

    updateDailyMsg: function () {

        if (cc.mgr.hallLogic.dailyGift > 0) {
            this.giftAlert.open(1, cc.mgr.hallLogic.dailyGift);
        }
    },

    onClickedCreateRoom: function () {
        this.createRoom.active = true;
    },

    onClickedJoinRoom: function () {
        this.joinRoom.active = true;
    },

    onClickedGoldCoinRoom: function () {
        this.goldRoomPanel.active = true;
        this.mainBtns.active = false;
        this.bottomBar.active = false;
    },

    onClickedSetting: function () {
        cc.mgr.audioMgr.playButton();
        this.setting.active = true;
    },

    onClickedShop: function (event, customEventData) {
        this.shop.open(parseInt(customEventData));
    },

    // onClickedFuli: function () {
    //     cc.mgr.audioMgr.playButton();
    //     this.relief.active = true;
    // },

    onClickedService: function () {
        cc.mgr.audioMgr.playButton();
        this.servicePanel.active = true;
    },

    onClickedShare: function () {
        cc.mgr.audioMgr.playButton();
        cc.mgr.sdkMgr.share(WXScene.WXSceneTimeline, Config.wxurl, Config.wxtitle, Config.wxdesc);
    },

    onClickedSettingHelp: function () {
        cc.mgr.audioMgr.playButton();
        this.setting.active = false;

        cc.showHelpPanel();
    },

    onClickedRecord: function () {
        cc.mgr.audioMgr.playButton();
        this.recordPanel.active = true;
    },

    onBackToHall: function () {
        this.mainBtns.active = true;
        this.bottomBar.active = true;
    },

    showInviationCodePanel: function () {
        this.inviationCode.active = true;
    },

    replayGameLog: function (msg) {
        if (0) {
            cc.floatTip('敬请期待');
            return;
        }
        this.replayCtrl.open(msg);
    },
});
