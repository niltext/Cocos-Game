cc.Class({
    extends: cc.Component,

    properties: {
    },

    // use this for initialization
    onLoad: function () {
        Array.prototype.contains = function (obj) {
            var i = this.length;
            while (i--) {
                if (this[i] === obj) {
                    return true;
                }
            }
            return false;
        }


        cc.delayedCall = function (node, d, func) {
            let dl = cc.delayTime(d);
            let call = cc.callFunc(func);

            node.runAction(cc.sequence(dl, call));
        };

        /** 
        弹窗口提示
         */
        cc.alert = function (text, onok, needCancel, oncancel) {
            cc.loader.loadRes("prefab/alert", function (err, prefab) {
                let newNode = cc.instantiate(prefab);
                let cvs = cc.find('Canvas');
                cvs.addChild(newNode);

                let alert = newNode.getComponent('Alert');
                if (typeof (text) == 'string') {
                    alert.alert(text, onok, needCancel, oncancel)
                }
                else if (typeof (text) == 'object') {
                    alert.alert(text.content, onok, needCancel, oncancel)
                    alert.setBtnTitle(text.ok, text.cancel);
                }

            });
        };

        cc.floatTip = function (msg) {
            cc.mgr.err.floatTip(msg);
        };

        /**
         @param str 显示的提示
         @param alive 显示alive 秒后自动关闭
         @param callback mask显示出来之后的回调
         */
        cc.showMask = function (str, alive, callback) {
            cc.loader.loadRes("prefab/loadingMask", function (err, prefab) {
                let newNode = cc.instantiate(prefab);
                let cvs = cc.find('Canvas');
                cvs.addChild(newNode);

                cc._loadingMask = newNode.getComponent('LoadingMask');
                cc._loadingMask.tip(str);
                if (alive > 0) {
                    cc._loadingMask.closeAfter(alive);
                }

                if (callback) {
                    callback();
                }
            });
        };


        cc.hideMask = function () {
            cc.log('cc.hideMask:' + typeof (cc._loadingMask))
            if (cc._loadingMask) {
                cc._loadingMask.close();
                cc._loadingMask = null;
            }
        };



        cc.showPlayerDetail = function (name, uid, ip, avatar) {
            cc.loader.loadRes("prefab/playerDetail", function (err, prefab) {
                let newNode = cc.instantiate(prefab);
                let cvs = cc.find('Canvas');
                cvs.addChild(newNode);

                let playerDetail = newNode.getComponent('PlayerDetail');
                playerDetail.init(name, uid, ip, avatar);
            });
        };

        cc.showHelpPanel = function (idx) {
            cc.loader.loadRes('prefab/HelpPanel', function (err, prefab) {
                let newNode = cc.instantiate(prefab);
                let ui = cc.find('Canvas/UI');
                newNode.parent = ui;
                newNode.setLocalZOrder(100);
            });

        };

    },


});
