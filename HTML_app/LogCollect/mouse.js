//let urlForSend = "http://localhost:3000";
//let urlForSend = "https://ecls.info.kindai.ac.jp";

//let target_child = document.querySelectorAll("[id^='m']"); //mから始まるID属性を持つ要素を返す
let target_child = document.querySelectorAll("[id]");
//let Type = "page";
var mouseOverTime = "null";

// console.log(target_child);
// console.log(target_child.length);
// console.log(target_child[1]);

let elemList = target_child;

for (const elem of elemList) {
  elem.addEventListener(
    //マウスカーソルが乗った時
    "mouseenter",
    function (event) {
      var elemOfId = elem.getAttribute("id");
      mouseOverTime = new Date().toLocaleString({ timeZone: "Asia/Tokyo" });

      //event.target.style.backgroundColor = "orange";
      //console.log(elemOfId + "mouseenter");
    },
    false
  );
}

for (const elem of elemList) {
  elem.addEventListener(
    //マウスカーソルが離れた時
    "mouseleave",
    function (event) {
      var mouseLeaveTime;
      var elemOfId = elem.getAttribute("id");
      mouseLeaveTime = new Date().toLocaleString({
        timeZone: "Asia/Tokyo",
      });
      //event.target.style.backgroundColor = "white";

      if (elemOfId != null) {
        //console.log(elemOfId + "mouseleave");
        //console.log(elemOfId);
        isAgree = localStorage.getItem("isAgree");
        if (isAgree == 0) {
          sendInfoM(mouseOverTime, mouseLeaveTime, elemOfId);
        }
      }
    },
    false
  );
}

function sendInfoM(mouseOverTime, mouseLeaveTime, elemOfId) {
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
    i: elemOfId, //id
    s: mouseOverTime, //starttime
    e: mouseLeaveTime, //endtime
    t: getPageTitle, //閲覧しているページのタイトル
    y: userAgentTerminal, //アクセス元の端末
    z: userAgentBrowser, //アクセス元のヴラウザ
    p: processID, ///プロセスID
  };

  var dataForSend = JSON.stringify(data);
  console.log("sendInfo（mouse)" + dataForSend);
  var urlForSend2 = `${urlForSend}/log.eid?j=${dataForSend}`;
  img.setAttribute("src", urlForSend2);
  img.setAttribute("width", "0");
  img.setAttribute("height", "0");
  document.body.appendChild(img);
}
