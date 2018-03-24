cc.Class({
    extends: cc.Component,

    properties: {
        lbl:cc.RichText
    },


    /**
     *   str richtext string
     */
    tip: function (str) {
        this.lbl.string = str;

        let self = this;
        cc.delayedCall(this.node,4, function () {
            self.node.destroy();
        })
    },
});
