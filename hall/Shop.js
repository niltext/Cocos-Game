const goodslist = [
    [//金币
        { id: 101, name: '金币', amount: '6w', img: 'image_bean_1', price: 6 },
        { id: 102, name: '金币', amount: '12w', img: 'image_bean_2', price: 12 },
        { id: 103, name: '金币', amount: '30w', img: 'image_bean_3', price: 30 },
        { id: 104, name: '金币', amount: '60w', img: 'image_bean_4', price: 60 },
        // { id: 105, name: '金币', amount: '108w', img: 'image_bean_5', price: 108 },
        // { id: 106, name: '金币', amount: '208w', img: 'image_bean_6', price: 208 },
        // { id: 107, name: '金币', amount: '388w', img: 'image_bean_7', price: 388 },
        // { id: 108, name: '金币', amount: '488w', img: 'image_bean_8', price: 488 },
    ],
    [//房卡
        { id: 1, name: '房卡', amount: 6, img: 'image_shop_fangka', price: 6 },
        { id: 2, name: '房卡', amount: 12, img: 'image_shop_fangka', price: 12 },
        { id: 3, name: '房卡', amount: 30, img: 'image_shop_fangka', price: 30 },
        { id: 4, name: '房卡', amount: 60, img: 'image_shop_fangka', price: 60 },
        // { id: 5, name: '房卡', amount: 108, img: 'image_fangka_5', price: 108 },
        // { id: 6, name: '房卡', amount: 208, img: 'image_fangka_6', price: 208 },
        // { id: 7, name: '房卡', amount: 388, img: 'image_fangka_7', price: 388 },
        // { id: 8, name: '房卡', amount: 488, img: 'image_fangka_8', price: 488 },
    ]
]
let UIBase = require('UIBase');
cc.Class({
    extends: UIBase,

    properties: {
        showcase: cc.Node,

        toggleType: cc.Toggle,

        shopType: 0, //0 金币 1 房卡
    },

    // use this for initialization
    onLoad: function () {
        this.items = this.showcase.children;
        for (let i = 0; i < this.items.length; i++) {
            let item = this.items[i];
            let btn = cc.find('img', item).getComponent(cc.Button);

            var clickEventHandler = new cc.Component.EventHandler();
            clickEventHandler.target = this.node; //这个 node 节点是你的事件处理代码组件所属的节点
            clickEventHandler.component = "Shop";//这个是代码文件名
            clickEventHandler.handler = "onClickedItem";
            clickEventHandler.customEventData = i.toString();// 因为0传入会有问题，所以转成string

            btn.clickEvents.push(clickEventHandler);
        }
        cc.mgr.net.on(NetId.S2C_SHOP_ORDER, this.onShopOrder, this);

        cc.mgr.net.on(NetId.S2C_SHOP, this.s2cGoodsList, this);
    },

    open: function (type) {
        this.node.active = true;
        cc.mgr.audioMgr.playSFX('shopopen.mp3');
        this.toggleType.isChecked = (type == 1);

        this.c2sGetGoodsList();
        if (typeof(type) != 'undefined') {
            this.shopType = type;
        }
        else{
            this.shopType = 1; // 默认房卡
        }
    },

    switchType: function (type) {
        this.shopType = type;
        let goods = this.goodslist[type];
        for (let i = 0; i < this.items.length && i < goods.length; i++) {
            let item = this.items[i];
            item.active = true;

            let lb = cc.find('price', item).getComponent(cc.Label);
            lb.string = '充值' + goods[i].price / 100 + '元';

            let amount = cc.find('amount', item).getComponent(cc.Label);
            amount.string = goods[i].name;

            let song = cc.find('song', item).getComponent(cc.Label);
            song.string = goods[i].extra > 0 ? goods[i].extra : '';

            let bd = cc.find('bd', item);
            bd.active = this.shopType == 1;// 是房卡商店时才显示
        }

        for (let i = goods.length; i < this.items.length;i++) {
            this.items[i].active = false;
        }
    },

    onShopOrder: function (event) {
        let data = event.detail.msg.data;
        let obj = JSON.parse(data);
        cc.log("NetId.S2C_SHOP_ORDER", data);
        let money = cc.utils.jsonGet(obj.money, '');
        let cpparam = cc.utils.jsonGet(obj.cpparam, 0).toString();
        let trans_id = cc.utils.jsonGet(obj.trans_id, "");
        let name = cc.utils.jsonGet(obj.appFeeName, "");
        let way = "1";


        if (cc.sys.os == cc.sys.OS_ANDROID) {
            jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "pay", "(Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;)V", money, cpparam, trans_id, name);
        }
        else if (cc.sys.os == cc.sys.OS_IOS) {
            jsb.reflection.callStaticMethod("IosHelper", "pay:cpParam:trans_id:name:way:", money, cpparam, trans_id, name,way);
        }
    },

    onClickedItem: function (event, customEventData) {
        if (cc.mgr.hallLogic.checkInviteCode(true)) {
            return;
        }

        let index = parseInt(customEventData);
        let goods = this.goodslist[this.shopType];
        let id = goods[index].id;

        if (cc.utils.reviewing && cc.sys.os == cc.sys.OS_IOS) {
            cc.showMask('正在下单', 2);
            jsb.reflection.callStaticMethod("IosHelper", "inAppPurchase:", goods[index].appstoreid);
        }
        else {
            var param = {
                product_id: id,
                uid: 0,
                os: '',
                style: 1
            };
            cc.showMask('', 2);
            cc.mgr.net.send(NetId.C2S_SHOP_ORDER, param);
        }
    },

    onClickedToggleMode: function (sender) {
        let mode = sender.isChecked ? 1 : 0;
        this.switchType(mode);
    },
    onClickedClose: function () {
        this.close();
    },

    onDestroy: function () {
        cc.mgr.net.off(NetId.S2C_SHOP_ORDER, this.onShopOrder, this);
        cc.mgr.net.off(NetId.S2C_SHOP, this.s2cGoodsList, this);
    },

    s2cGoodsList: function (event) {
        let msg = event.detail.msg;
        this.style = msg.style;// 保留字段，暂不用
        let products = JSON.parse(msg.products);
        cc.log(JSON.stringify(products))
        let roomCards = [];
        let goldCoins = [];
        for (let i = 0; i < products.length; i++) {
            let item = {
                id: products[i].id,
                name: products[i].name,
                price: products[i].amount,
                amount: products[i].card,
                extra: products[i].card_add,
                appstoreid: products[i].product_id || 'android_useless'
            };
            if (products[i].mtype == 1) {
                roomCards.push(item);
            }
            else if (products[i].mtype == 2) {
                goldCoins.push(item);
            }
        }

        this.goodslist = new Array();
        this.goodslist.push(goldCoins);
        this.goodslist.push(roomCards);

        this.switchType(this.shopType);
    },

    c2sGetGoodsList: function () {
        let iosCheck = 0;
        let listid = 1;
        if (cc.sys.os == cc.sys.OS_IOS) {
            if (cc.utils.reviewing) {
                iosCheck = 1;
                listid = 2; // IOS审核期间使用列表2
            }
        }
        cc.mgr.net.send(NetId.C2S_SHOP, { ios_checking: iosCheck, idtyp: listid })

    },
});
