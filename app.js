// 1. expressモジュールをロードし、インスタンス化してappに代入
var express = require("express");
var app = express();
var execSync = require("child_process").execSync;

// 2, listen()メソッドを実行して3000番ポートで待受。
var server = app.listen(3000, function() {
    console.log("Node.js is listening to PORT:" + server.address().port);
});

// View EngineにEJSを指定。
app.set('view engine', 'ejs');
app.use('/bootstrap', express.static(__dirname + '/bootstrap'));

// "/"へのGETリクエストでindex.ejsを表示する。拡張子(.ejs)は省略されているらしい
app.get("/", function(req, res, next) {
    res.render("index",getAdbResult());
});

app.get("/bootstrap", function(req, res, next){
    // TODO 直す
});

function getAdbResult() {
    var resultObj = {
                        ipaddress: execSync("adb shell ip route | cut -d ' ' -f 12").toString(),
                        device: execSync("adb devices | sed -n '2,2p' | cut -f 1").toString(),
                        gateway: execSync("adb shell cat /proc/net/arp | sed -n '2,2p' | cut -d' ' -f 1").toString(),
                        dns1: execSync("adb shell getprop net.dns1").toString(),
                        dns2: execSync("adb shell getprop net.dns2").toString(),
                        wifistat: execSync("adb shell dumpsys netstats | grep -E 'iface' | sed -n '1,1p'").toString(),
                        devicemodel: execSync("adb shell getprop ro.product.model").toString(),
                        androidversion: execSync("adb shell getprop ro.build.version.release").toString()
                    };
    return resultObj;
}
