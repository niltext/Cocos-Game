let UIBase = require('UIBase');
cc.Class({
    extends: UIBase,

    properties: {
        tgMusic: cc.Toggle,
        tgSFX: cc.Toggle,
        tgSake: cc.Toggle,
        tgDialect: cc.Toggle,

        avatar: cc.Sprite,
        nick: cc.Label,
        uid: cc.Label,

        feedback: cc.Node,
    },

    onEnable: function () {
        this._super();
        this.tgMusic.isChecked = cc.mgr.audioMgr.bgmVolume > 0 ? true : false;
        this.tgSFX.isChecked = cc.mgr.audioMgr.sfxVolume > 0 ? true : false;

        cc.utils.setPortrit(this.avatar, cc.mgr.userMgr.userinfo.head);
        this.nick.string = cc.mgr.userMgr.userinfo.name;
        this.uid.string = 'ID: ' + cc.mgr.userMgr.userinfo.uid;

        let v = cc.sys.localStorage.getItem('dialect');
        this.tgDialect.isChecked = v > 0 ? true : false;
    },

    onToggleMusic: function (sender) {
        let v = sender.isChecked ? 1 : 0;
        cc.mgr.audioMgr.setBGMVolume(v);

        let bgmnode = cc.find('bgm');
        if (bgmnode) {
            let bgm = bgmnode.getComponent('Bgm');
            bgm.setVolume(v);
        }
    },

    onToggleSFX: function (sender) {
        let v = sender.isChecked ? 1 : 0;
        cc.mgr.audioMgr.setSFXVolume(v)
    },
    onToggleShake: function (sender) {

    },

    onToggleDialect: function (sender) {
        cc.sys.localStorage.setItem("dialect", sender.isChecked ? 1 : 0);
    },

    OnClickedLogout: function () {
        cc.mgr.audioMgr.playButton();
        cc.sys.localStorage.removeItem('wx_psw');
        cc.director.loadScene('login');
        cc.mgr.net.close();
    },


    onClickedClose: function () {
        //cc.mgr.audioMgr.playButton();
        this.close();
    },

    onClickedFeedback: function () {
        cc.mgr.audioMgr.playButton();
        this.node.active = false;
        this.feedback.active = true;
    },
});
