cc.Class({
    extends: cc.Component,

    properties: {
        prefab: cc.Prefab,
    },

    // use this for initialization
    onLoad: function () {
        this.pool = new cc.NodePool('Bean');
    },

    get: function () {
        if (this.pool.size() == 0) {
            bean = cc.instantiate(this.prefab);
            this.pool.put(bean);
        }

        let bean = this.pool.get();
        bean.parent = this.node;
        return bean;
    },

    put: function (node) {
        this.pool.put(node);
    },
});
