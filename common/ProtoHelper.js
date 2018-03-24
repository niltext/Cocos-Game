
cc.Class({
    extends: cc.Component,

    properties: {
        text: 'protofile',
    },

    // load all of the proto files
    loadProtoFiles: function () {
        this._protobuf = dcodeIO.ProtoBuf;
        this._builders = [];
        this._cache_ctor = {};
        var self = this;
        cc.loader.loadResDir(this.text,function(err,ress){
            self._protos = ress;
            console.log("ress len: " + ress.length);
            for (var i = 0; i < ress.length; ++i) {
                if (typeof(ress[i]) == "string"){
                    //console.log("proto------####"+ ress[i]);
                    var builder = self._protobuf.loadProto(ress[i]);
                    if (builder){
                        console.log("add builder:"+ builder);
                        self._builders.push(builder);
                    }
                }
            }
        });        
    },

    findCreator: function(name){
        if(this._cache_ctor[name]){
            return this._cache_ctor[name];
        }
        
        for(var i = 0;i < this._builders.length;i++){
            var cf = this._builders[i].build(name);
            if(cf){
                this._cache_ctor[name] = cf;
                return cf;
            }
        }
    },
});
