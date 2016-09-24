# AndroidNetworkInfoGetter

## 概要
PCに接続したAndroid端末のネットワーク情報をデスクトップから見るツール

### 確認できる情報
* 端末のID
* IPアドレス
* DNS1レコードの値
* DNS2レコードの値
* ゲートウェイIP

### 使い方
Android端末をPCに接続しておく。
```
$ git clone https://git.corp.yahoo.co.jp/shotakeu/AndroidNetworkInfoGetter.git
$ cd AndroidNetworkInfoGetter/
$ node app.js 
Node.js is listening to PORT:3000
```
その後、[http://localhost:3000](http://localhost:3000/)にブラウザからアクセス

### 現状のUI
![UI](http://mym.corp.yahoo.co.jp/paster/97afd7701f88ca6a30d0.png "UI")
