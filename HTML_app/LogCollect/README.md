# オンライン授業の資料からログ収集を行うアプリケーション（HTML）

```
$ node testserver.js
```

先に上記のコマンドでテストサーバを起動しコンソール上で送信されたログの確認を行う。

コマンドは mouse_App/LogCollect 上で実行する。

```
$ http-server
```

上記のコマンドでローカルホストを起動
ポート番号はおそらく 8080(既に使用されていたら 8081,8082....)
その後、http://localhost:8080/sample.html
にアクセスすると sample.html が表示される

sample.html 上でマウスを動かしたり、ページをスクロールすることでテストサーバにログが送信される。
サーバを起動したコンソール上で、サーバのアドレスのクエリに JSON 形式で送信されたログが確認できる。
一部文字化けしているため、ログの詳細を確認するには、ブラウザのデベロッパーツールの JavaScript コンソールで確認するのが良い。

ブラウザのデベロッパーツールの JavaScript コンソールより以下の２種類のログが確認できる。

```
sendInfo（page){"c":"c775e7b757ede630cd0aa1113bd102661ab38829ca52a6422ab782862f268646","s":"2023/7/4 12:33:27","e":"2023/7/4 12:33:27","t":"マウスログ　サンプル","p":"80","g":"373.619","y":"chrome","z":"PC","i":52341673337617}







 sendInfo（mouse){"c":"c775e7b757ede630cd0aa1113bd102661ab38829ca52a6422ab782862f268646","i":"sample","s":"2023/7/4 12:33:26","e":"2023/7/4 12:33:27","t":"マウスログ　サンプル","y":"chrome","z":"PC","p":52341673337617}
```

- sendInfo（page)は page.js により送信されるログで、それぞれの key が持つ意味は下記の page.js の節を参照
  主に HTML の最上部を 0％とし、最下部を 100％としたときに閲覧者がどの地点を閲覧しているかのログを収集している。
  例えば、上記のログからは、c775e7b...(ページ表示時に入力してもらった学籍番号をハッシュ化したもの)が 2023/7/4 12:33:27 に 80%地点(key は p)を閲覧していたことがわかる。

- sendInfo（mouse)は mouse.js により送信されるログでそれぞれの key が持つ意味は下記の mouse.js の節を参照
  HTML のタグの全ての ID 属性を読み込み、閲覧者のマウスカーソルがタグを通過するとログが送信される。
  例えば、上記のログからは、c775e7b...(ページ表示時に入力してもらった学籍番号をハッシュ化したもの)が 2023/7/4 12:33:26 に sample（key は i)という ID 属性を持つタグの上にマウスカーソルが乗り、2023/7/4 12:33:27 に通過したことがわかる。

## sample.html

マウスログ収集するためのサンプル HTML
全ての id 属性も持つタグ上にマウスポインタが乗るってから、離れるまでのログを収集する。
サンプルのため、ログが送信される箇所の色が変化する。
送信されるログは javascript コンソールでも確認できる。

## mouse.js

sample.html で用いられる js ファイルで、マウスログを収集し、サーバに送信する。 送信するログのフォーマットは以下の通りである。

```
 const data = {
    c: hashStudentID, //個人識別用ID(学籍番号)
    i: elemOfId, //id
    s: mouseOverTime, //starttime
    e: mouseLeaveTime, //endtime
    t: getPageTitle, //閲覧しているページのタイトル
    y: userAgentTerminal, //アクセス元の端末
    z: userAgentBrowser, //アクセス元のヴラウザ
    p: processID, ///プロセスID
  };
```

## page.js

sample.html で用いられる js ファイルで、HTML での閲覧箇所のログを収集し、サーバに送信する。 送信するログのフォーマットは以下の通りである。

```
const data = {
    c: hashStudentID, //個人識別用ID(学籍番号)
    s: prevDate.toLocaleString({ timeZone: "Asia/Tokyo" }), //starttime
    e: new Date().toLocaleString({ timeZone: "Asia/Tokyo" }), //endtime
    t: getPageTitle, //閲覧しているページのタイトル
    p: String(yy), //何％閲覧したか
    g: String(sum), //合計閲覧時間
    y: userAgentTerminal, //アクセス元の端末
    z: userAgentBrowser, //アクセス元のヴラウザ
    i: processID,
  };
```

## testserver.js

sample1.js で送信したログは testserver に送信される。
