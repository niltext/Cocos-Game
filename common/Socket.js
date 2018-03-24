

 let CCSocketStatus = {
	 eSocketConnected : 1,
	 eSocketConnecting : 2,
	 eSocketDisconnected : 3,
	 eSocketConnectFailed : 4,
	 eSocketConnectTimeout : 5,
	 eSocketIoClosed : 0,
	 eSocketIoError : -1,
	 eSocketCreateFailed : -2,
	 eSocketUndefined : -3,
};

cc.Class({
    extends: cc.Component,



	init: function(){
        if(cc.sys.isNative){
            if(!this._soc)
                this._soc = Net.NetInterface.getSharedNetInterface();
        }
        this.ip = '';
        this.port = 0;
        this.connectTime=0;
        this.status = CCSocketStatus.eSocketUndefined;
        this.onConnected = undefined;
        this.tryTimes=0;
    },

    connect: function(ip, port, onConnected)
    {
        if(!this._soc)
            return;
	    this.ip = ip;
	    this.port = port;
	    this.onConnected = onConnected;
	    this.status = this._soc.connect(this.ip, this.port);
	    this.connectTime = cc.sys.now();
    },

	connected: function(ip, port)
    {
	    if(this._soc){
		    return this.status == CCSocketStatus.eSocketConnected;
	    }
	    return false;
    },

    send:function(data){
        // cc.log("data: "+data+" len:"+ data.length);
        if(this._soc){
            this._soc.send(data)
        }
    },

    read:function(){
        if(this._soc)
            return this._soc.recv();
    },

    // called every frame, uncomment this function to activate update callback
    update: function (dt) {
        if(this._soc && this.status != CCSocketStatus.eSocketUndefined){
            var s = this._soc.updateFlush();
            if (this.status == CCSocketStatus.eSocketConnecting ){
                if(s == CCSocketStatus.eSocketConnected && this.onConnected){
	                this.tryTimes = 0;
	                cc.hideMask();
                    this.onConnected();
                }
                let now = cc.sys.now();
                if((now - this.connectTime) > 2*1000 ){
                	this.close();
	                this.connectTime = now;
                }
            }
            this.status = s;
	        if (this.status != CCSocketStatus.eSocketConnecting &&
		        this.status != CCSocketStatus.eSocketConnected &&
		        this.tryTimes != -1){
	        	if(this.tryTimes == 0){
			        cc.showMask('正在重连，马上就好', -1);
		        }
		        if (this.tryTimes > 3) {
			        this.tryTimes = -1;
			        cc.hideMask();
			        cc.alert({ content: '糟糕，重连出现问题了！', ok: '退 出', cancel: '重 连' },
				        () => {
				            cc.game.end();
				        }, true, () => {
				            this.tryTimes = 0;
			            });
		        }else{
			        this._soc.connect(this.ip, this.port);
			        this.status = this._soc.getStatus();
			        this.tryTimes += 1;
		        }
	        }

        }
    },

	close:function(){
		if(this._soc)
			return this._soc.close();
	},
});
