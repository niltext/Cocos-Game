

var SdkMgr = cc.Class({
    properties: {
    },

    ctor: function () {
        this.androidApi = 'com/soda/{0}/WXAPI'.template(Config.game);
        this.iosApi = 'WxHelper';
        this.islogined = false;
    },

    login: function (flag) {
        let openid = cc.sys.localStorage.getItem('wx_openid');
        let psw = cc.sys.localStorage.getItem('wx_psw');

        // openid = 'o7xZ8xN1SikDO2NKwo-_xedL76bU';
        // psw = 'ab1082fa12b680bfaee10be4f7db1a76';
        if (openid && psw) {
            var param = {
                token: '',
                account: openid,
                password: psw,
                channel: 'wechat',
                lon: 0,
                lat: 0,
                game: Config.game
            };
            cc.mgr.userMgr.login(param);
        }
        else if (flag) {
            if (cc.sys.os == cc.sys.OS_ANDROID) {
                jsb.reflection.callStaticMethod(this.androidApi, 'Login', '()V');
            }
            else if (cc.sys.os == cc.sys.OS_IOS) {
                jsb.reflection.callStaticMethod(this.iosApi, 'login');
            }
            this.islogined = false;
        }
    },

    //注册账号登录
    login2: function () {

    },

    share: function (scene, url, title, desc) {
        if (cc.sys.os == cc.sys.OS_ANDROID) {
            jsb.reflection.callStaticMethod(this.androidApi, "Share", "(ILjava/lang/String;Ljava/lang/String;Ljava/lang/String;)V", scene, url, title, desc);
        }
        else if (cc.sys.os == cc.sys.OS_IOS) {
            jsb.reflection.callStaticMethod(this.iosApi, "share:url:shareTitle:shareDesc:", scene, url, title, desc);
        }
        else {
            cc.log("platform:" + cc.sys.os + 'dont support share.');
        }
    },

    shareScreen: function (scene) {
        var size = cc.director.getWinSize();
        var fileName = "result_share.png";
        var self = this;
        var fn = function (success, fullPath) {
            if (success) {
                var height = 600;
                var scale = height / size.height;
                var width = Math.floor(size.width * scale);

                if (cc.sys.os == cc.sys.OS_ANDROID) {
                    jsb.reflection.callStaticMethod(self.androidApi, "ShareIMG", "(ILjava/lang/String;II)V", scene, fullPath, width, height);
                }
                else if (cc.sys.os == cc.sys.OS_IOS) {
                    jsb.reflection.callStaticMethod(self.iosApi, "shareIMG:path:width:height:", scene, fullPath, width, height);
                }
                else {
                    console.log("platform:" + cc.sys.os + " dosn't implement share.");
                }
            }
        };
        cc.utils.captureScreen(fileName, fn);
    },

    onLoginResp: function (token) {
        cc.nc.log('onLoginResp ' + token);
        if (token == '-2') {
            //用户取消
            cc.nc.log('user cancel');
            return;
        }
        else if (token == '-4') {
            //用户拒绝
            cc.nc.log('user deny');
            return;
        }
        else if (token == '-6') {
            //签名错误
            cc.nc.log('sign error');
            return;
        }
        else { //拉取信息成功
            cc.nc.log('wx_token:' + token);

            var param = {
                token: token,
                account: "",
                password: "",
                channel: "wechat",
                lon: 0,
                lat: 0,
                game: Config.game
            }
            if (!this.islogined) {
                cc.mgr.userMgr.login(param);
                this.islogined = true;
            }

        }
    },

    verifyPurchaseWithPaymentTransaction: function (receipt) {
        var param = {
            transaction_id: receipt,
        };
        cc.mgr.net.send(NetId.C2S_APPLE_TRANS, param);

    }

});

module.exports = SdkMgr