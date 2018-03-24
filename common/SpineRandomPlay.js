cc.Class({
    extends: cc.Component,

    properties: {
        tickInterval: 4,
        ratio: {
            default: 0.5,
            tooltip:'每次tick，播放动画的概率'
        },

        phase:{
            default:2,
            tooltip:'首次tick的相位滞后最大值（/秒）'
        }
    },

    // use this for initialization
    onLoad: function () {
        this.skeleton = this.node.getComponent(sp.Skeleton);
    },

    onEnable: function () {
        let phase = cc.random0To1()*this.phase;
        this.schedule(this.tick, this.tickInterval,999,phase);
    },

    tick: function () {
        let rd = cc.random0To1()
        if (rd < this.ratio) {
            this.skeleton.setAnimation(0, 'play', false);
        }
    },

    onDisable: function () {
        this.unschedule(this.tick);
    },
});
