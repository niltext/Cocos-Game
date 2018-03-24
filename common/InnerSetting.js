let UIBase = require('UIBase');

cc.Class({
    extends: UIBase,

    properties: {
        tgBGM: cc.Toggle,
        tgSFX: cc.Toggle,
        tgSake: cc.Toggle,
    },

    onEnable: function () {
        this._super();
        this.tgBGM.isChecked = cc.mgr.audioMgr.bgmVolume > 0 ? true : false;
        this.tgSFX.isChecked = cc.mgr.audioMgr.sfxVolume > 0 ? true : false;
    },

    onToggleBGM: function (sender) {
        let v = sender.isChecked ? 1 : 0;
        cc.mgr.audioMgr.setBGMVolume(v)

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

    onClickedClose: function () {
        let self = this;
        this.close(function () {
            self.node.destroy();
        });
    },
});
