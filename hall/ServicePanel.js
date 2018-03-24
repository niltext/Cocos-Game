let UIBase = require('UIBase');

cc.Class({
    extends: UIBase,
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
    },

    // use this for initialization
    onLoad: function () {
        let lb = cc.find('body/New Label',this.node).getComponent(cc.Label);
        lb.string = LocalText.serviceText;
    },


    onClickedClose: function () {
        this.close();
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
