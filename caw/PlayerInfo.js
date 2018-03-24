cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //    default: null,      // The default value will be used only when the component attaching
        //                           to a node for the first time
        //    url: cc.Texture2D,  // optional, default is typeof default
        //    serializable: true, // optional, default is true
        //    visible: true,      // optional, default is true
        //    displayName: 'Foo', // optional
        //    readonly: false,    // optional, default is false
        // },
        // ...
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
    },

    setInfo: function() {
        
    }

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
