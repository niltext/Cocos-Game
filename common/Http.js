var URL = "http://118.89.235.34:9000";
//var URL = "http://120.24.181.145:9000";
//var URL = "http://120.24.59.70:9000";

cc.VERSION = 20161227;
var Http = cc.Class({
    extends: cc.Component,

    statics:{
        sessionId : 0,
        userId : 0,
        master_url:URL,
        url:URL,
        sendRequest : function(path,data,handler,extraUrl, onerror, ontimeout){
            var xhr = cc.loader.getXMLHttpRequest();
            xhr.timeout = 5000;
            var str = "?";
            var flag = false;
            for(var k in data){
                if(str != "?"){
                    str += "&";
                }
                str += k + "=" + data[k];
                flag = true;
            }
            if(flag == false){
                str = '';
            }
            if(extraUrl == null){
                extraUrl = Http.url;
            }else{
                if (cc.sys.os != cc.sys.OS_IOS ) {
                    extraUrl = extraUrl.replace(/https/, 'http');
                }
            }
            var requestURL = extraUrl + path + encodeURI(str);
            console.log("RequestURL:" + requestURL);

            cc.mgr.net.emit('uilog',{msg:"RequestURL:" + requestURL})

            xhr.open("GET",requestURL, true);
            if (cc.sys.isNative){
                xhr.setRequestHeader("Accept-Encoding","gzip,deflate","text/html;charset=UTF-8");
            }

            xhr.onreadystatechange = function() {
                if(xhr.readyState === 4 && (xhr.status >= 200 && xhr.status < 300)){
                    console.log("http res("+ xhr.responseText.length + "):" + xhr.responseText);
                    try {
                        var ret = JSON.parse(xhr.responseText);
                        if(handler !== null){
                            handler(ret);
                        }                        /* code */
                    } catch (e) {
                        console.log("err:" + e);
                        //handler(null);
                    }
                    finally{
                        if(cc.vv && cc.vv.wc){
                        //       cc.vv.wc.hide();
                        }
                    }
                }
            };

            xhr.onerror = onerror;
            xhr.ontimeout = ontimeout;

            if(cc.vv && cc.vv.wc){
                //cc.vv.wc.show();
            }
            xhr.send();
            return xhr;
        },

        post:function (url, data) {
            var xhr = new XMLHttpRequest();
            xhr.onreadystatechange = function () {
                if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status < 400)) {
                    var response = xhr.responseText;
                    console.log(response);
                }
            };
            xhr.open("POST", url, true);
            xhr.send(data);
        }
    },
});

module.exports = Http;