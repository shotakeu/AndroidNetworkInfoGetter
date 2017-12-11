// 1. expressモジュールをロードし、インスタンス化してappに代入
var express = require("express");
var app = express();
var execSync = require("child_process").execSync;
/** File System */
const fs = require('fs');

/* for multi devices. */
var i = 0;

/* port number */
var portNum = 3000;

/* result of pushing crt file object */
var pushCrtFileResult = {
  execresult1: 'Faild.',
  execresult2: 'Faild.'
}

/* Result of adb command */
var adbResultObj = {
                    ipaddress: '',
                    device: '',
                    gateway: '',
                    dns1: '',
                    dns2: '',
                    wifistat: '',
                    devicemodel: '',
                    androidversion: '',
                    connecteddevice: []
                };

// 2, listen()メソッドを実行して指定のポートで待受。
var server = app.listen(portNum, function() {
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
    // execute adb command if more than 1 devices connected.
    if (deviceListArray.length > 0) {
      var targetDevice = deviceListArray[i];
      adbResultObj = {
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
    }
    return adbResultObj;
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
* push crt file to connected and selected device.
*/
function pushCrtFileToDevice(i) {
    var deviceList = getDevices();
    var targetDevice = deviceList[i];
    if (isExistFile('example.cer')) {
      pushCrtFileResult = {
          execresult1: execSync("adb -s " + targetDevice + " push example.cer /sdcard/").toString(),
          execresult2: execSync("adb -s " + targetDevice + " push example.crt /sdcard/").toString()
      };
      return pushCrtFileResult;
    }
    return pushCrtFileResult;
}

/*
* file appearence check.
*/
function isExistFile(file) {
  try {
    fs.statSync(file);
    return true;
  } catch(err) {
    if(err.code === 'ENOENT') return false;
  }
}
