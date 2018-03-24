cc.Class({
    extends: cc.Component,

    properties: {
        lbOutput:cc.Label,
        nodeConsole:cc.Node,

        show:false
    },

    // use this for initialization
    onLoad: function () {
        cc.game.addPersistRootNode(this.node);

        this.hideAct = cc.moveTo(0.2,cc.v2(this.nodeConsole.x, cc.visibleRect.top.y+this.nodeConsole.height/2));
        this.showAct = cc.moveTo(0.2, cc.v2(this.nodeConsole.x,0));
        
        this.refreshUI();
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },

    log: function (msg) {
        this.lbOutput.string = this.lbOutput.string + '\r\n' + msg;
        console.log(msg);
    },

    onClickedClear: function () {
        this.lbOutput.string = '';
    },

    onClickedSwitch: function () {
        this.show = !this.show;
        
        this.refreshUI();
    },

    refreshUI: function () {
        if (this.show) {
            this.nodeConsole.runAction(this.showAct);
        }
        else{
            this.nodeConsole.runAction(this.hideAct);
        }
    },
});
