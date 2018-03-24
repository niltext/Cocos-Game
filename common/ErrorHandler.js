var ErrorHandler = cc.Class({

    properties: {
        floatTipPrefab: cc.Prefab,
    },


    ctor: function () {
        // 加载 Prefab
        cc.loader.loadRes("prefab/floatTip", (function (err, prefab) {
            this.floatTipPrefab = prefab;

        }).bind(this));
    },

    commonError: function (netId,errCode,err) {
        this.floatTip(err.msg);
    },


    floatTip: function (msg) {
        if (!this.floatTipPrefab) {
            cc.loader.loadRes("prefab/floatTip", function (err, prefab) {
                this.floatTipPrefab = prefab;

            });
            return;
        }
        let newNode = cc.instantiate(this.floatTipPrefab);
        let ftScript = newNode.getComponent('FloatTip');
        ftScript.tip(msg);
        let cvs = cc.find('Canvas')
        cvs.addChild(newNode);
        
    },


});

module.exports = ErrorHandler;