# AndroidNetworkInfoGetter

## 概要
PCに接続したAndroid端末のネットワーク情報をデスクトップから見るツール

### 確認できる情報
* 端末のID
* 端末モデル
* Wifiステータス
* IPアドレス
* ゲートウェイIP
* DNS1レコードの値
* DNS2レコードの値


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
![UI](https://mym.corp.yahoo.co.jp/paster/b8e3cb96e8be91bdd40d.png "UI")

### 起動時に立ち上げる
#### 起動させる
```
$ sudo npm install forever -g
$ forever start app.js
```

#### restart
```
$ forever restart app.js
```
