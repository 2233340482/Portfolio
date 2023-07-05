# ログファイルを csv 形式に変換するアプリケーション

＊　本ポートフォリオでは LogCollect/mouse.js により送信されたログを csv に変換するアプリケーションを紹介します。
また、../LogCollect を先に動作検証することをおすすめします。

コマンドは mouse_App/FormatChange 上で実行する。

```
$ http-server
```

上記のコマンドでローカルホストを起動
ポート番号はおそらく 8080(既に使用されていたら 8081,8082....)
その後、http://localhost:8080/formatChanger.html
にアクセスすると formatChanger.html が表示される

../sampleLog/eid.2023-03-28-07-0.log（相対パス）と../sampleLog/MouseFirstCSV.csv（相対パス）を使用する。
eid.2023-03-28-07-0.log は実際に研究室のサーバに送信されたログである。（本ポートフォリオでは研究室のサーバには送信していない）

formatChanger.html の「整形したいログファイルを入力してください(複数可) :」の右にあるファイル選択ボタンをクリックし、../sampleLog/eid.2023-03-28-07-0.log（相対パス）を選択する。
次に、「過去のログのテキスト var を入力してください(なければプレーンテキスト) :」に../sampleLog/MouseFirstCSV.csv（相対パス）を選択すると csv ファイルと txt ファイルがダウンロードされる。

ダウンロードされた csv ファイルを開き、eid.2023-03-28-07-0.log が csv ファイルに変換されたことを確認する。
