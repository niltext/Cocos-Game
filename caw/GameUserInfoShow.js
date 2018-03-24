cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //    default: null,      // The default value will be used only when the component attaching
        //                           to a node for the first time
        //    url: cc.Texture2D,  // optional, default is typeof default
        //    serializable: true, // optional, default is true
        //    visible: true,      // optional, default is true
        //    displayName: 'Foo', // optional
        //    readonly: false,    // optional, default is false
        // },
        // ...
        icon_ : cc.Sprite,
        name_ : cc.Label,
        male_ : cc.Sprite,
        female_ : cc.Sprite,
        ip_ : cc.Label,
        id_ : cc.Label,
    },

    // use this for initialization
    onLoad: function () {

    },


    show: function(o){
        self.name_.string = o.name;
        self.icon_.spriteFrame = o.spriteframe;
        self.id_.string = o.id;
        self.ip_.string = o.ip;
        if(o.sex == 1){
            this.female_.active = true;
            this.male_.active = false;
        }else{
            this.male_.active = true;
            this.female_.active = false;
        }
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
