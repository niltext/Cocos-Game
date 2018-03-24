cc.Class({
    extends: cc.Component,

    properties: {
    },

    onEnable: function () {
        this.node.scale = 0.01;
        this.node.runAction(cc.scaleTo(0.2, 1).easing(cc.easeBackOut()));
    },

    close: function (onComplete) {
        if (onComplete == null) {
            onComplete = () => {
                this.node.active = false;
            };
        }

        let act = cc.sequence(
            cc.scaleTo(0.2, 0.01).easing(cc.easeBackIn()),
            cc.callFunc(onComplete)
        );
        this.node.runAction(act);
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
