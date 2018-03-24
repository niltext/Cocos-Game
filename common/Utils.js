
module.exports = cc.Class({

    properties: {
        iosApi: 'IosHelper',
        version: '0.0.0',
        reviewingVersion: '0.0.0',
        reviewing: false,// 是否正在审核
    },

    getVersion: function () {
        if (cc.sys.os == cc.sys.OS_IOS) {
            var appVersion = jsb.reflection.callStaticMethod(this.iosApi, "appVersion");
            var buildVersion = jsb.reflection.callStaticMethod(this.iosApi, "buildVersion");
            return appVersion + '_' + buildVersion;
        } else {
            return sys._application.getVersion();
        }
    },


    /** 通过url设置头像
    @param sprite  cc.Sprite
    */
    setPortrit: function (sprite, url) {
        if (!url || url.length === 0) {
            return;
        }

        let ret = url.indexOf('http');
        if (ret != -1) {
            cc.loader.load(url + '.jpg', function (err, tex) {
                if (err) {
                    cc.error(err.message || err);
                    return;
                }
                if (sprite.node == null) {
                    return;
                }
                let spriteFrame = new cc.SpriteFrame(tex, cc.Rect(0, 0, sprite.node.width, sprite.node.height));
                sprite.spriteFrame = spriteFrame;
            });
        }
        else { //使用本地头像
            cc.loader.loadRes("roboticon/" + url, cc.SpriteFrame, function (err, spriteFrame) {
                sprite.spriteFrame = spriteFrame;
            });
        }

    },

    setEmoji: function (sprite, idx) {
        cc.loader.loadRes("texture/emoji/biaoqing_" + idx, cc.SpriteFrame, function (err, spriteFrame) {
            sprite.spriteFrame = spriteFrame;
        });
    },

    getChatText: function (idx) {
        let quickChat = require('QuickChat');
        return quickChat.quickChat.get(parseInt(idx));
    },
    jsonGet: function (obj, def) {
        if (obj)
            return obj;
        else
            return def;
    },

    captureScreen: function (file, afterCaptured) {
        Utils.Utility.captureScreen(file, afterCaptured);
    },

    formatNumber: function (num, mode) {
        let ret = num;
        num = parseInt(num);
        if (num > 9999) {
            let t = (num / 10000).toString();
            t = t.slice(0, 5);
            if (t.lastIndexOf('.') == t.length - 1) {
                t = t.slice(0, 4)
            }
            ret = t + 'w';
        }
        return ret;
    },

    getTimeString: function (unixtime) {
        let date = new Date();
        date.setTime(parseInt(unixtime) * 1000);
        let m = date.getMonth() + 1;
        let d = date.getDate();

        let h = date.getHours();
        let mi = date.getMinutes();

        let str = m + '-' + d + ' ' + h + ':' + mi;
        return str;
    },

    dec2HexStr: function (d) {
        var h = parseInt(d / 16);
        var l = parseInt(d % 16);
        let p = h.toString(16) + l.toString(16);
        return "0x" + p.toUpperCase();
    },

    getMJVoicePath: function (mj_type) {
        let v = cc.sys.localStorage.getItem('dialect');
        if (v == true && DialectList.indexOf(mj_type) != -1) {
            return 'mj/dialect/' + mj_type + '/';
        }
        else {
            return 'mj/mandarin/';
        }
    },

    getMJRule: function (roominfo) {

        let params = JSON.parse(roominfo.params);

        let rules = new Array();

        if (params.zhuang_xian == 1) {
            rules.push('庄闲(算分)');
        }

        if (typeof (params.can_dian_pao) != 'undefined') {
            rules.push(params.can_dian_pao == 1 ? '点炮胡' : '自摸胡');
        }


        if (params.can_qi_xiao_dui == 1) {
            rules.push('可胡七对');
        }

        if (typeof (params.can_ping_hu_dian_pao) != 'undefined') {
            rules.push(params.can_ping_hu_dian_pao == 1 ? '平胡可点炮' : '平胡需自摸');
        }

        if (params.hong_zhong_lai_zi == 1) {
            rules.push('红中赖子');
        }

        if (params.can_men_qing == 1) {
            rules.push('门清');
        }
        if (params.can_shi_san_yao == 1) {
            rules.push('十三幺');
        }

        if (params.niao_num > 0) {
            let niao = '抓{0}鸟'.template(params.niao_num);
            rules.push(niao);
        }

        if (params.ma > 0) {
            let ma = '';

            if (roominfo.mj_type == 2) {// 钦州
                let madesc = new Map([[1, '2/4个马'], [2, '3/6个马'], [3, '4/8个马'], [4, '5/10个马'],
                [5, '10/20个马'], [100, '一马全中']]);
                ma = madesc.get(params.ma);
            }
            else if (roominfo.mj_type == 3) {
                ma = params.ma + '匹马';
            }

            rules.push(ma);
        }

        //扣费
        switch (parseInt(roominfo.qunzhu)) {
            case 0:
                rules.push('AA扣费');
                break;
            case 2:
                rules.push('房主扣费')
                break;
        }

        return rules.toString();
    },

    trimCNStr: function (str, n) {
        if (str.replace(/[\u4e00-\u9fa5]/g, "**").length <= n) {
            return str;
        }
        else {
            var len = 0;
            var tmpStr = "";
            for (var i = 0; i < str.length; i++) {//遍历字符串
                if (/[\u4e00-\u9fa5]/.test(str[i])) {//中文 长度为两字节
                    len += 2;
                }
                else {
                    len += 1;
                }
                if (len > n) {
                    break;
                }
                else {
                    tmpStr += str[i];
                }
            }
            return tmpStr + " ...";
        }
    },

    getCurGameInfo: function () {
        let roomid = 0;
        let userid = 0;
        let game = cc.mgr.hallLogic.gameLogic
        if (game) {
            roomid = game.roomInfo.room_id;
            let user = game.getUserInfo(game.myIndex);
            userid = user.uid;
        }

        return { roomid: roomid, uid: userid };
    },

});
