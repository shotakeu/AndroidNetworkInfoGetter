# AndroidNetworkInfoGetter

PCに接続したAndroid端末のネットワーク情報をデスクトップから見るツール

------------------------------

## 必要なもの

node.jsとnpmとAndroidSdk

## 確認できる情報

* 端末のID
* 端末モデル
* Wifiステータス
* IPアドレス
* ゲートウェイIP
* DNS1レコードの値
* DNS2レコードの値

## 使い方

Android端末をPCに接続しておく。

```
$ git clone https://github.com/shotakeu/AndroidNetworkInfoGetter.git
$ cd AndroidNetworkInfoGetter/
$ node app.js
Node.js is listening to PORT:3000
```

その後、[http://localhost:3000](http://localhost:3000/)にブラウザからアクセス

### 現状のUI
![UI](http://takelab.sub.jp/wp-content/uploads/スクリーンショット-2017-09-17-10.32.29.png "UI")

### 注意点
* 事前にADBコマンドの準備が必須、こちら参照

[http://butsuyoku-gadget.com/android_sdk_install/](http://butsuyoku-gadget.com/android_sdk_install/)

------------------------------
## 利用方法

### 起動時に立ち上げる

foreverを利用する場合

#### 起動させる

```
$ sudo npm install forever -g
$ forever start app.js
```

#### restart

```
$ forever restart app.js
```
