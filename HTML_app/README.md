＊ 実行手順はそれぞれのディレクトリの README.md を参照
。

# LogCollect

オンライン授業の資料からログ収集を行うアプリケーション（HTML）

使用方法は LogCollect 内の README.md を参照

＊HLS（動画資料）からログを収集するアプリケーションは別にあります。

# FormatChange

ログファイルを csv 形式に変換するアプリケーション

sampleLog 内のログファイルを使用して動作検証が行える。

＊　本ポートフォリオでは mouse.js から収集したログファイルを csv 形式に変換します。

# sampleLog

ログのサンプル　テスト用

- eid.2023-03-28-07_0.log ： mouse.js で収集した、ログのサンプル

- MouseFirstCSV : ログファイルを csv 形式に変換するアプリケーション で使用する。

# サンプルの HTML 以外で使用する場合

＊　ポートフォリを実行する上では関係ないです。

- LogCollect/mouse.js (Element ID を収集する)
- LogCollect/page.js(従来の HTML から％を収集する)
- LogCollect/confirm.js(HLS の confirm.js と共通)

上記の３つの js ファイルをログを収集する HTML に script で挿入する

```

 <script type="text/javascript" src="page.js" charset="UTF-8"></script>
  <script type="text/javascript" src="mouse.js" charset="UTF-8"></script>
  <script type="text/javascript" src="confirm.js" charset="UTF-8"></script>

```
