

const logIgnore = new Set([
    NetId.C2S_HEARTBEAT,
    NetId.S2C_HEARTBEAT,

]);

module.exports = cc.Class({
    extends: cc.EventTarget,

    ctor: function () {
        this._errHandler = null;
        // net mission list;
        this._netMissions = [];

        // init protohelper
        var ProtoHelper = require("ProtoHelper");
        var protohelper = new ProtoHelper();
        protohelper.loadProtoFiles();
        this._protohelper = protohelper;

        // init socket
        var Socket = require("Socket");
        this._soc = new Socket();
        this._soc.init();
    },
    connect: function (ip, port, onConnected) {
        this._soc.connect(ip, port, onConnected);
    },

    connected: function () {
        return this._soc.connected();
    },

    setErrorHandler: function (handler) {
        this._errHandler = handler;
    },

    findCreator: function (name) {
        if (this._protohelper)
            return this._protohelper.findCreator(name);
    },

    onNetCall: function (netid, protoObj) {
        var net = cc.mgr.net;
        // if (!logIgnore.has(netid)) {
        //     cc.log("onNetCall id:" + netid + "-------------------------");
        // }

        net.emit(netid, {
            id: netid,
            msg: protoObj,
        });
    },

    //send
    send: function (id, obj) {
        this.addNetMission(id, function (builder, net) {
            if (obj)
                return builder.encode(obj);
        });
    },

    // the type of bindedFn is "function(Creator,net)"
    addNetMission: function (id, bindedFn) {
        var self = this;
        var msgName = NetIdForSend[id];
        if (msgName) {
            if (typeof (bindedFn) != "function") {
                cc.error("bindedFn must be a function for netId:" + id + " ProtoName:" + msgName);
                return;
            }

            var ProtoCreator = self.findCreator(msgName);
            if (!ProtoCreator) {
                cc.error("creator is not found for ProtoCreator:" + msgName + " netId:" + id);
                return;
            }

            this._netMissions.push(function () {
                var protoObj = bindedFn(ProtoCreator, self);
                var data = self._createData(id, protoObj);
                if (!logIgnore.has(id.toString())) {
                    cc.log("send id:" + id + " len:" + data.length);
                }

                self._soc.send(data);
            });
        } else {
            //cc.warn("protoMsgName is not found for NetId:" + id);
            this._netMissions.push(function () {
                if (typeof (bindedFn) == "function")
                    bindedFn(null, self);
                var data = self._createData(id);
                if (!logIgnore.has(id.toString())) {
                    cc.log("send id:" + id + " len:" + data.length);
                }

                self._soc.send(data);
            });
        }
    },



    onCallNetMission: function () {
        var mission = this._netMissions.shift();
        if (mission) {
            mission();
        }
    },

    _createData: function (netId, protoObj) {
        var id_len = 4;
        var protolen = 0;
        var arraybuffer = null;
        var raw = null;
        if (protoObj) {
            arraybuffer = protoObj.toArrayBuffer();
            raw = new Uint8Array(arraybuffer);
            protolen = raw.length;
        }

        var data = new ArrayBuffer(protolen + id_len);
        var iddata = new Uint8Array(data);

        iddata[0] = netId.charCodeAt(0);
        iddata[1] = netId.charCodeAt(1);
        iddata[2] = netId.charCodeAt(2);
        iddata[3] = netId.charCodeAt(3);

        if (0 < protolen) {
            iddata.set(raw, id_len);
        }

        return iddata;
    },


    onRecvData: function (packet) {
        var netId = String.fromCharCode(packet[0], packet[1], packet[2], packet[3]);
        var errCode = String.fromCharCode(packet[4], packet[5]);
        var raw_data = packet.buffer.slice(6, packet.length);

        if (!logIgnore.has(netId)) {
            cc.log("onRecvData netId:" + netId + " errCode:" + errCode);
        }
        
        if ("ok" != errCode) {
            var err = this.findCreator("Common.Error").decode(raw_data);
            cc.log("error netId:" + netId + " errCode:" + errCode + " msg:" + err.msg);
            if (this._errHandler)
                this._errHandler(netId, errCode, err);
            return;
        }

        if (6 < packet.length) {
            var msgName = NetIdForRecv[netId];
            if (!msgName) {
                cc.log("Error: onRecvData cann't not find the msgname for netId:" + netId);
                return;
            }

            var Parser = this.findCreator(msgName);
            if (!Parser) {
                cc.log("Error: onRecvData cann't not find the Parser for msgName:" + msgName);
                return;
            }

            var msg = Parser.decode(raw_data);
            if (!msg) {
                cc.log("Error: onRecvData parse error msgName:" + msgName + " id:" + netId);
                return;
            }

            this.onNetCall(netId, msg);
        } else {
            //cc.log("Warnning: onRecvData netId:" + netId + " is empty !!");
            this.onNetCall(netId);
        }
    },

    // called every frame, uncomment this function to activate update callback
    update: function (dt) {
        if (this._soc) {
            this._soc.update(dt);
            var packet = this._soc.read();
            if (packet) {
                //cc.log("recv a packet len:" + packet.length)
                this.onRecvData(packet)
            }

            this.onCallNetMission();
        }
    },
    updateHeartbeat:function () {
        if (this._soc) {
            this.send(NetId.C2S_HEARTBEAT);
        }
    },

    close: function () {
        this._soc.close();
    },
});
