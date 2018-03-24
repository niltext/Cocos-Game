cc.Class({
    extends: cc.Component,

    properties: {
        animName:{
            default:'',
            tooltip:'要自动播放的动画名称，如果为空则播放animation',
        }
    },

    // use this for initialization
    onLoad: function () {
        this.skeleton = this.node.getComponent(sp.Skeleton);
    },

    onEnable: function () {
        if (!this.skeleton) {
            return;
        }

        if (this.animName.length > 0) {
            this.skeleton.setAnimation(0, this.animName, false);
        }
        else{
            this.skeleton.setAnimation(0, 'animation', false);
        }
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
