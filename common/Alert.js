cc.Class({
    extends: cc.Component,

    properties: {
        btnOK: cc.Node,
        btnCancel: cc.Node,
        content: cc.RichText,

        _onOK: null,
        _onCancel: null
    },

    alert: function (text, onok, needCancel, oncancel) {
        this.node.active = true;

        if (text.indexOf('color=') == -1) {
            text = '<color=#874F47>' + text + '</c>';
        }

        this.content.string = text;
        this.btnCancel.active = needCancel ? true : false;

        this._onOK = onok;
        this._onCancel = oncancel;
    },


    setBtnTitle: function (ok, cancel) {
        if (ok && ok.length > 0) {
            this.btnOK.getComponentInChildren(cc.Label).string = ok;
        }

        if (cancel && cancel.length > 0) {
            this.btnCancel.getComponentInChildren(cc.Label).string = cancel;
        }
    },

    onClickedOK: function () {
        cc.log('--11')
        if (this._onOK) {
            cc.log('--12')
            this._onOK();
            this._onOK = null;
        }
        this.close();
    },
    onClickedCancel: function () {
        if (this._onCancel) {
            this._onCancel();
            this._onCancel = null;
        }
        this.close();
    },

    close: function () {
        this.node.destroy();
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});

