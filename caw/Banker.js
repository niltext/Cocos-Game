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

        tip: cc.Label
    },

    // use this for initialization
    onLoad: function () {
        this.count = 15;

        this.countdown = function () {
            this.count--;
            if (this.count <= 0) {
                this.unschedule(this.countdown)
                this.node.active = false;
                //todo
                return;
            };

            this.tip.string = '请抢庄：' + this.count;
        }
        this.schedule(this.countdown, 1);

    },

    onEnable: function () {
        this.count = 15;
        this.tip.string = '请抢庄：' + this.count;
        this.schedule(this.countdown, 1);
    }

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
