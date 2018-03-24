cc.Class({
    extends: cc.Component,

    properties: {
        animName:{
            default:'',
            tooltip:'自动播放的Animation Clip 名称，如果为空则播放 default Clip',
        }
    },

    // use this for initialization
    onLoad: function () {
        this.anim = this.node.getComponent(cc.Animation);
    },

    onEnable: function () {
        if (this.anim) {
            if (this.animName.length > 0) {
                this.anim.play(this.animName);
            }
            else{
                this.anim.play();
            }
        }
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
