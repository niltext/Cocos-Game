cc.Class({
    extends: cc.Component,

    properties: {
        show:false,
    },

    // use this for initialization
    onLoad: function () {

    },

    onEnable: function () {
        if (cc.utils.reviewing) {
            this.node.active = this.show;
        }
    },

});
