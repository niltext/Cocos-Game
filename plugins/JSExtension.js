
/** 字符串格式化
usage :
var a = "I Love {0}, and You Love {1},Where are {0}!";
alert(a.template("You","Me"));
 */
String.prototype.template = function () {
    var args = arguments;
    return this.replace(/\{(\d+)\}/g, function (m, i) {
        return args[i];
    }
    );
};

// 得到字节长度 
String.prototype.byteLength = function() {
    return this.replace(/[^x00-xff]/g, "--").length;
}

window.__errorHandler = function (fileName, lineno, msg) {
    if (cc.sys.os == cc.sys.OS_WINDOWS) {
        return;
    }
    try {
        var file = Config.game + '@';
        var info = JSON.stringify(cc.utils.getCurGameInfo()) + '\n';
        fileName = 'fileName:' + fileName + '\n';
        lineno = 'lineno:' + lineno + '\n';
        var url = 'http://120.24.158.80:9999/test.aspx';
        var data = file + fileName + lineno + msg + '\n' + info;

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
    catch (e) {
    }
};