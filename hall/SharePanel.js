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
    },

    // use this for initialization
    onLoad: function () {

    },

    onClickedTimeline: function () {
	    cc.mgr.sdkMgr.share(WXScene.WXSceneTimeline, Config.wxurl, Config.wxtitle, Config.wxdesc);
        this.node.active = false;
    },

    onClickedSession: function () {
	    cc.mgr.sdkMgr.share(WXScene.WXSceneSession, Config.wxurl, Config.wxtitle, Config.wxdesc);
        this.node.active = false;
    },

    onClickedClose: function () {
        this.node.active = false;
    },
});
