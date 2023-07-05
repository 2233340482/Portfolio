"use strict";
const Type = "page";
let num = [20, 40, 60, 80, 100]; //視聴チェックポイント(%表記)
let prevDate = new Date(); //アクセスした時刻、前回チェックポイントに到達した際の時刻を格納する変数
let sum = 0; //合計閲覧時間を保管するための変数

let urlForSend = "http://localhost:3000";
//let urlForSend = "https://ecls.info.kindai.ac.jp";
let isFocus = 0; //focusが外れているかどうか
let notWatchDate = new Date(); //focusが外れた時刻
let notWatchTime = 0; //閲覧していない時間

//ページがフォーカスされた場合
//フォーカスが外れた時刻からの閲覧していない時間を算出
window.addEventListener("focus", () => {
  // console.log("on");
  if (isFocus == 1) {
    isFocus = 0;
    var nowDate = new Date();
    notWatchTime += nowDate.getTime() - notWatchDate.getTime();
    // console.log(notWatchTime / 1000);
    localStorage.setItem("notWatchTime", notWatchTime / 1000);
  }
});
//フォーカスが外れた場合
//フォーカスが外れた時刻を取得、リロード時の発火を避けるためにsetTimeout
window.addEventListener("blur", () => {
  // console.log("off");
  notWatchDate = new Date();
  isFocus = 1;
});

window.addEventListener("beforeunload", () => {
  var nowDate = new Date();
  var diff = nowDate.getTime() - prevDate.getTime();
  sum = sum + diff / 1000;
  localStorage.setItem("viewingTime", sum);
});

//ページの現在位置の算出
function coordinate() {
  var h = document.body.clientHeight; //body要素の全長
  var y1 = window.pageYOffset; //垂直方向のスクロール量
  var y2 = document.documentElement.clientHeight; //表示されているサイズ(スクロールバーを除く)
  var yy = Math.round((y1 / (h - y2)) * 10) * 10; //ページの全長を100とした時のパーセンテージ
  return yy;
}

document.body.onscroll = function () {
  var yy = coordinate();
  let check = num.some(function (element) {
    //チェックポイントに到達した際
    return element == yy;
  });
  //前回ポイントから20離れているか
  var yMove = localStorage.getItem("yMove");
  var yCheck = Math.abs(yMove - yy) / 20;
  if (yCheck > 0 && yCheck < 2) {
    if (check) {
      //チェックポイントに到達した際
      var removals = [yy];
      num = num.filter(function (v) {
        //チェックポイントを格納している配列からそのチェックポイントを除外、ポイント0を追加
        return !removals.includes(v);
      });
      isAgree = localStorage.getItem("isAgree");
      if (isAgree == 0) {
        if (yy == 2) {
          sendInfo(0, 1);
          localStorage.setItem("yMove", 0);
        } else {
          sendInfo(yy, 1);
          localStorage.setItem("yMove", yy);
        }
      }
    }
  }
};

//hashNumber更新
function upDatehashNumber() {
  if (localStorage.getItem("hashNumber") == null) {
    var hashStudentID = hashNumber;
  } else {
    var hashStudentID = localStorage.getItem("hashNumber");
  }
  return hashStudentID;
}
//各情報を送信する関数
function sendInfo(yy, isFirst) {
  //送信ポイント,初回アクセスかどうか
  //ログ送信ポイント送信時にログ送信ポイント配列に前後のポイントを追加
  num.push(yy + 20);
  num.push(yy - 20);
  //初回時のみ20に到達したらページトップのポイントを追加
  if (yy == 20) {
    num.push(2);
  }
  if (localStorage.getItem("hashNumber") == null) {
    var hashStudentID = hashNumber;
  } else {
    var hashStudentID = localStorage.getItem("hashNumber");
  }
  //ログ送信情報取得
  var getPageTitle = document.title;
  var userAgent = window.navigator.userAgent.toLowerCase();
  var userAgentTerminal = "";
  var userAgentBrowser = "";
  var nowDate = new Date();
  var diff = nowDate.getTime() - prevDate.getTime();
  sum = sum + diff / 1000 - notWatchTime / 1000;
  localStorage.setItem("viewingTime", sum);

  //初回ログインの場合、合計閲覧時間を0に設定(閲覧開始までにも時間が加算されるから)
  if (isFirst == 0) {
    sum = 0;
  }
  //ページの先頭でログを送信したいが、0が取れないんのでページトップから2とし、確認した後に0としている
  var useY = yy;
  if (useY == 2) {
    useY = 0;
  }

  if (userAgent.indexOf("msie") != -1 || userAgent.indexOf("trident") != -1) {
    //IE向けの記述
    userAgentTerminal += "IE";
  } else if (userAgent.indexOf("edge") != -1) {
    //旧Edge向けの記述
    userAgentTerminal += "edge";
  } else if (userAgent.indexOf("chrome") != -1) {
    //Google Chrome向けの記述
    userAgentTerminal += "chrome";
  } else if (userAgent.indexOf("safari") != -1) {
    //Safari向けの記述
    userAgentTerminal += "safari";
  } else if (userAgent.indexOf("firefox") != -1) {
    //FireFox向けの記述
    userAgentTerminal += "firefox";
  } else {
    //その他のブラウザ向けの記述
    userAgentTerminal += "other";
  }
  if (
    userAgent.indexOf("iPhone") > 0 ||
    (userAgent.indexOf("Android") > 0 && userAgent.indexOf("Mobile") > 0)
  ) {
    // スマートフォン向けの記述
    userAgentBrowser += "Smartphone";
  } else if (
    userAgent.indexOf("iPad") > 0 ||
    userAgent.indexOf("Android") > 0
  ) {
    // タブレット向けの記述
    userAgentBrowser += "Tablet";
  } else {
    // PC向けの記述
    userAgentBrowser += "PC";
  }

  const img = document.createElement("img");
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
  prevDate = nowDate;
  notWatchTime = 0;
  var dataForSend = JSON.stringify(data);
  console.log("sendInfo（page)" + dataForSend);
  var urlForSend2 = `${urlForSend}/log.page?j=${dataForSend}`;
  img.setAttribute("src", urlForSend2);
  img.setAttribute("width", "0");
  img.setAttribute("height", "0");
  document.body.appendChild(img);
}

//ここからmouse
