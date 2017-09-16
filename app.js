// 1. expressモジュールをロードし、インスタンス化してappに代入
var express = require("express");
var app = express();
var execSync = require("child_process").execSync;

// 複数デバイス対応用
var i = 0;

// 2, listen()メソッドを実行して3000番ポートで待受。
var server = app.listen(3000, function() {
    console.log("Node.js is listening to PORT:" + server.address().port);
});

// View EngineにEJSを指定。
app.set('view engine', 'ejs');

// postデータを扱う準備
// 参考: http://qiita.com/K_ichi/items/c70bf4b08467717460d5
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));
//css 読み込み
app.use('/css',express.static('css'));
app.use('/img',express.static('img'));

// "/"へのGETリクエストでindex.ejsを表示する。拡張子(.ejs)は省略されているらしい
app.get("/", function(req, res, next) {
    var i = 0;
    if (req.query.device) { 
        i = req.query.device;
    }
    var data = getAdbResult(i);
    res.render("index", data);
});
// post処理
app.post("/", function(req, res) {
    var query = req.body.device;
    var i = 0;
    if (query) {
        i = query;
    }
    res.render("result", pushCrtFileToDevice(i));
});


/*
* get network status via adb.
*/
function getAdbResult(i) {
    var deviceListArray = getDevices();
    var targetDevice = deviceListArray[i];
    var resultObj = {
                        ipaddress: execSync("adb -s " + targetDevice + " shell ip route | cut -d ' ' -f 12").toString(),
                        device: execSync("adb -s " + targetDevice + " get-serialno").toString(),
                        gateway: execSync("adb -s " + targetDevice + " shell cat /proc/net/arp | sed -n '2,2p' | cut -d' ' -f 1").toString(),
                        dns1: execSync("adb -s " + targetDevice + " shell  getprop net.dns1").toString(),
                        dns2: execSync("adb -s " + targetDevice +" shell getprop net.dns2").toString(),
                        wifistat: execSync("adb -s " + targetDevice + " shell dumpsys netstats | grep -E 'iface' | sed -n '1,1p'").toString(),
                        devicemodel: execSync("adb -s " + targetDevice + " shell getprop ro.product.model").toString(),
                        androidversion: execSync("adb -s " + targetDevice + " shell getprop ro.build.version.release").toString(),
                        connecteddevice: deviceListArray
                    };
    return resultObj;
}

/**
 * get attached device list.
 */
function getDevices() {
    deviceList =  execSync("adb devices | sed 1d | cut -f 1").toString();
    var deviceArray = deviceList.split(/\r\n|\r|\n/);
    var returnArray = [];
    // 環境によって謎の空白ができるのでそれを対応
    for (var i = 0; i < deviceArray.length; i++) {
        if(deviceArray[i] != null && deviceArray[i] != "" )  {
            returnArray[i] = deviceArray[i];
        }
    }
    return returnArray;
}

/*
* push crt file to connected device.
*/
function pushCrtFileToDevice(i) {
    var deviceList = getDevices();
    var targetDevice = deviceList[i];
    var resultObj = {
                        execresult1: execSync("adb -s " + targetDevice + " push ypki_root_ca.cer /sdcard/").toString(),
                        execresult2: execSync("adb -s " + targetDevice + " push ypki_root_cacert_v2.crt /sdcard/").toString()
                    };
    return resultObj;
}
