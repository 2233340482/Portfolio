# オンライン授業の資料からログ収集を行うアプリケーション（HLS 動画）

```
$ node testserver.js
```

先に上記のコマンドでテストサーバを起動しコンソール上で送信されたログの確認を行う。

コマンドは hls_App/LogCollect 上で実行する。

```
$ http-server
```

上記のコマンドでローカルホストを起動
ポート番号はおそらく 8080(既に使用されていたら 8081,8082....)
その後、http://localhost:8080/hlsapp.html
にアクセスすると hlsapp.html が表示される

hlsapp.html 上で動画を閲覧することでテストサーバにログが送信される。
サーバを起動したコンソール上で、サーバのアドレスのクエリに JSON 形式で送信されたログが確認できる。
一部文字化けしているため、ログの詳細を確認するには、ブラウザのデベロッパーツールの JavaScript コンソールで確認するのが良い。

ブラウザのデベロッパーツールの JavaScript コンソールより以下の２種類のログが確認できる。

```
actionData:
{"ProcessID":141829828499352,"StudentNumber":"967076bb839f63b40a2d06cd0650837ebe036c1e7ced9befe00791e0becee5bc","userAgent":"chrome,PC","title":"HLS Log","Action":"pause","nowTime1":"2023/7/4 14:59:18","Percents1":"null","Point1":"null"}




 HlsData:
{"ProcessID":141829828499352,"StudentNumber":"967076bb839f63b40a2d06cd0650837ebe036c1e7ced9befe00791e0becee5bc","userAgent":"chrome,PC","title":"HLS Log","Action":"null","nowTime1":"2023/7/4 15:45:27","Percents1":10,"Point1":31,"nowTime2":"2023/7/4 15:45:29","Percents2":11,"Point2":32,"nowTime3":"2023/7/4 15:45:31","Percents3":12,"Point3":33,"nowTime4":"2023/7/4 15:45:33","Percents4":13,"Point4":34,"nowTime5":"2023/7/4 15:45:35","Percents5":14,"Point5":35}
```

- actionData
  動画の停止ボタンや再生ボタン、音量変更や動画全体の％（１０％単位）の地点のログを収集し、送信される。
  上記の actionData の key の Action の要素に、これらのログのデータが記載されている。
  例えば、上記の actionData は、967076bb...(学籍番号をハッシュ化したもので key は StudentNumber)は 2023/7/4 14:59:18（key は nowTime1）に一時停止ボタン（pause key は Action）をクリックしたことがわかる。

- HlsData
  key である PercentN（N は自然数）に動画全体を 100%とした時に、閲覧しているパーセントの要素が入る。

  例えば、上記の HlsData は、967076bb...(学籍番号をハッシュ化したもので key は StudentNumber)は 2023/7/4 15:45:27（key は nowTime1）に 31％（key は Point1）を通過したことがわかる。

  また、HlsData のログの送信回数を減らすために、nowTime[1-5],Point[1-5]を作成し、最大５回分のログを 1 つのログにまとめて送信している。

## hlsapp.html

HLS 動画の視聴ログをサーバに送信する。

## hls

本アプリケーションで使用する hls を置くためのディレクトリ

## video.js

hlsapp.html で用いられる js ファイル

## testserver.js

sample1.js で送信したログは testserver に送信される。

## style.css

hlsapp.html のスタイル
