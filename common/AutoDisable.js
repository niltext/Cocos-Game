cc.Class({
    extends: cc.Component,

    properties: {
        aliveTime: 3,
        fadeOutTime: 0.5,
    },


    onEnable: function () {

        this.scheduleOnce(this.callback,this.aliveTime);
    },

    callback: function () {
        this.node.active = false;
    },

    onDisable: function () {
        this.unschedule(this.callback);
    },

    reset: function (alivetime) {
        if (alivetime) {
            this.aliveTime = alivetime;
        }
        this.unschedule(this.callback);
        this.scheduleOnce(this.callback,this.aliveTime);
    },

});
