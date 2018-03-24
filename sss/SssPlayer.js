cc.Class({
    extends: cc.Component,

    properties: {
        _portritNode:null,
        _nickName:null,
        _score:null,
        _banker:null
    },

    // use this for initialization
    onLoad: function () {
        this._portritNode = this.node.getChildByName('portrit');
        this._nickName = this.node.getChildByName('name').getComponent(cc.Label);
        this._score = this.node.getChildByName('score').getComponent(cc.Label);
        this._banker = this.node.getChildByName('banker');

        // this.emoji = cc.find('emoji',this.node).getComponent(cc.Sprite);
        // this.chat = cc.find('chatText',this.node);
        // this.chatText = cc.find('chatText/text',this.node).getComponent(cc.Label);
        // this.floatNum = cc.find('floatNum',this.node);
        // this.floatNum.active = false;

        // let avator_default = cc.find('playerInfo/avatar_default',this.node);
    },

    setInfo: function() {
        
    }

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
