let HotUpdate = require('HotUpdate');

cc.Class({
    extends: cc.Component,

    properties: {

        hotUpdate: HotUpdate,
        btnSwitch: cc.Node,
        tryTimes: 0
    },

    // use this for initialization
    onLoad: function () {
        let dd = this.node.getChildByName('droid');
        if (cc.sys.os == cc.sys.OS_ANDROID) {   //如果是安卓版本,显示启动图
            this.scheduleOnce(() => {
                dd.active = false;
                this.node.opacity = 0;
                this.node.runAction(cc.fadeIn(0.4));
            }, 2);
        }
        else {
            dd.active = false;
            this.node.opacity = 0;
            this.node.runAction(cc.fadeIn(0.4));
        }

        this.initTouchEvent();
        this.initMgr();
        cc.view.setResolutionPolicy(cc.ResolutionPolicy.EXACT_FIT);
    },

    start: function () {
        cc.nc.log('loading 1');
        if (cc.sys.os == cc.sys.OS_WINDOWS || cc.sys.os == cc.sys.OS_ANDROID) {
            this.go();
            // this.requestReview();
            // this.hotUpdate.checkUpdate(this);
        }
        else {
            this.requestReview();
        }
    },

    requestReview: function () {
        cc.nc.log('loading 1');
        let self = this;
        this.tryTimes++;
        var fn = function (ret) {
            cc.nc.log('reviewing :' + ret.version);
            cc.nc.log('release :' + ret.release);
            cc.nc.log('version :' + cc.utils.getVersion());
            if (cc.sys.os == cc.sys.OS_IOS) {
                cc.utils.reviewingVersion = ret.version;
                if (ret.version == cc.utils.getVersion()) {
                    cc.nc.log('正在审核，直接进入');
                    cc.utils.reviewing = true;
                    self.go();
                }
                else if (ret.release.ios != cc.utils.getVersion()) {
                    cc.nc.log('有新版本奥');

                    cc.alert('有新版本需要更新哦', () => {
                        cc.sys.openURL(Config.wxurl);
                        cc.game.end();
                    });
                } else {
                    self.hotUpdate.checkUpdate(self);
                }
            } else {
                if (ret.release.android != cc.utils.getVersion()) {
                    cc.nc.log('有新版本奥');
                    cc.alert('有新版本需要更新哦', () => {
                        cc.sys.openURL(Config.wxurl);
                        cc.game.end();
                    });
                } else {
                    cc.nc.log('loading 2');
                    self.hotUpdate.checkUpdate(self);
                }
            }
        };
        cc.mgr.http.sendRequest(Config.game + "/review.json", {}, fn, Config.update, this.onerror.bind(this), this.ontimeout.bind(this))
    },
    // for test
    ontimeout: function () {
        var self = this;
        if (this.tryTimes < 3) {
            self.requestReview();
            return;
        };
        cc.alert({ content: '糟糕，重连出现问题了！', ok: '退 出', cancel: '重 连' },
            () => {
                cc.game.end();
            },
            true,
            () => {
                this.tryTimes = 0;
                self.requestReview();
            });
    },

    onerror: function (arg) {
        console.log('http onerror: ' + JSON.stringify(arg));
        this.ontimeout();
    },

    // for test
    go: function () {
        this.onUpdateFinished();
    },

    onUpdateFinished: function () {
        cc.director.loadScene('login');
    },

    initMgr: function () {
        var ConsoleNode = cc.find('Console')
        if (ConsoleNode && ConsoleNode.active) {
            cc.log('!! true')
            cc.nc = ConsoleNode.getComponent('NativeConsole');
        }
        else {
            cc.nc = {
                log: function () {
                },
            }
        }

        cc.mgr = {};
        cc.mgr.http = require("Http");

        var Net = require('Net');
        cc.mgr.net = new Net();

        var AudioMgr = require('AudioMgr');
        cc.mgr.audioMgr = new AudioMgr();
        cc.mgr.audioMgr.init();

        var VoiceMgr = require('VoiceMgr');
        cc.mgr.voiceMgr = new VoiceMgr();
        cc.mgr.voiceMgr.init();

        var SdkMgr = require('SdkMgr');
        cc.mgr.sdkMgr = new SdkMgr();

        var UserMgr = require('UserMgr');
        cc.mgr.userMgr = new UserMgr();

        var ErrorHandler = require('ErrorHandler');
        cc.mgr.err = new ErrorHandler();
        cc.mgr.net.setErrorHandler((cc.mgr.err.commonError).bind(cc.mgr.err));

        let Utils = require('Utils');
        cc.utils = new Utils();

        let HallLogic = require('HallLogic');
        cc.mgr.hallLogic = new HallLogic();
    },


    initTouchEvent: function () {
        this.touches = new Set();
        this.count = 0;


        this.node.on(cc.Node.EventType.TOUCH_START, function (event) {
            if (!this.touches.has(event.getID())) {
                this.touches.add(event.getID())
            }
        }, this);
        this.node.on(cc.Node.EventType.TOUCH_END, function (event) {
            cc.log('!size' + this.touches.size);
            if (this.touches.size == 3) {
                this.count++;

            }
            if (this.count == 2) {
                this.btnSwitch.active = true;
                this.count = 0;
            }

            let id = event.getID();
            if (this.touches.has(id)) {
                this.touches.delete(id);
            }
        }, this);

        this.node.on(cc.Node.EventType.TOUCH_CANCEL, function (event) {
            let id = event.getID();
            if (this.touches.has(id)) {
                this.touches.delete(id);
            }
        }, this);
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
