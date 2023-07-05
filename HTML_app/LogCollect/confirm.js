let hashNumber = 0; //ハッシュ化した学籍番号を格納する変数
let isAgree = 0; //0:同意,1:同意していない
let isPast = 0; //0:15日以上経過している,1:15日以上経過していない
let pastTime = 0; //最後の同意した時
var processIDforDate = new Date();
var processID = processIDforDate.valueOf() * getRandomInt(1, 100); //プロセスID
console.log("pID: " + processID);

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}

//ページが読まれた際にその時刻を保存する関数
document.body.onload = function () {
  //前回ログ収集同意から２ヶ月経過しているか
  var date = new Date();
  pastTime = localStorage.getItem("pastTime");
  var s = date.valueOf() - pastTime; //経過時間
  console.log(date.valueOf());
  console.log("pastTime" + pastTime);
  console.log(s);
  if (pastTime == null) {
    confirmSend();
  } else {
    if (s > 1296000000000 * 4) {
      //s > 1296000000000
      isPast = 0;
    } else {
      isPast = 1;
    }
  }
  s;
  //学籍番号入力
  checkLocalstorage();
  //リロード時、リロード前の閲覧時間を引き継ぐ
  var num = localStorage.getItem("viewingTime");

  if (num == null) {
    //ローカルストレージに保存されていない場合閲覧時間0からスタート
    sum = 0;
  } else {
    //ローカルストレージに保存されている場合リロード前の閲覧時間を引き継ぐ
    sum = parseInt(localStorage.getItem("viewingTime"), 10); //ローカルストレージに保存される形式がString?だったのでintに変換
  }

  window.setTimeout(function () {
    if (Type == "page" && localStorage.getItem("isAgree") == 0) {
      //リンクやブックマーク、または、URLの直接入力でアクセス時の初回送信
      if (
        performance.navigation.type == 0 ||
        performance.navigation.type == 2
      ) {
        sum = 0;
        localStorage.setItem("viewingTime", 0);
        sendInfo(0, 0);
        localStorage.setItem("yMove", 0);
      }
      //リロード時の初回送信
      else if (performance.navigation.type === 1) {
        var yy = localStorage.getItem("yMove");
        if (yy % 20 != 0) {
          yy = Math.round((yy + 10) / 10) * 10;
        }
        sendInfo(yy, 1);
        localStorage.setItem("yMove", yy);
      }
    }
  }, 1000);

  isFocus = 0;
};

//ローカルストレージに学籍番号が保存されているか
function checkLocalstorage() {
  var num = localStorage.getItem("studentNumber");
  if (num == null) {
    //ローカルストレージに保存されていない場合再度入力画面
    form();
  } else {
    //入力確認
    redyLog(num);
  }
}

//入力画面
function form() {
  var user = prompt(
    "学籍番号は10桁で入力してください。\n(学籍番号はハッシュ化を行っています。)"
  );
  //未入力の場合
  if (user == null) {
    form();
  }
  //10桁の学籍番号を入力された場合
  else if (user.length == 10) {
    //学籍番号を10桁で入力した場合
    confirmNum(user);
  }
  //キャンセルが押下された場合、再度入力画面
  else {
    alert(
      "学籍番号は10桁で入力してください。\n(学籍番号はハッシュ化を行っています。)"
    );
    form();
  }
}
//学籍番号の確認　初回に学籍番号が入力された際に呼び出される
function confirmNum(num) {
  var result = confirm("学籍番号 : " + num + "でよろしいですか？");
  //キャンセルが押下された場合、再度入力画面
  if (!result) {
    form();
  }
  //ローカルストレージに書き込み、ハッシュ化
  else {
    var y = localStorage.getItem("yMove");
    if (y == null) {
      localStorage.setItem("yMove", 0);
    }
    localStorage.setItem("studentNumber", num);
    // check the API support:
    if (!crypto || !crypto.subtle) {
      throw Error("crypto.subtle is not supported."); // ブラウザ未対応
    }
    const algo = "SHA-256";
    // generate hash!
    crypto.subtle.digest(algo, new TextEncoder().encode(num)).then((x) => {
      const hex = hexString(x); // convert to hex string.
      localStorage.setItem("hashNumber", hex);
      hashNumber = hex;
      if (Type == "mov") {
        setstudentNumber2(hashNumber);
      }
    });
    //前回アクセスから15日以上経過している場合
    if (isPast == 0) {
      confirmSend();
    }
  }
}

//学籍番号の入力確認
function redyLog(num) {
  var y = localStorage.getItem("yMove");
  if (y == null) {
    localStorage.setItem("yMove", 0);
  }
  localStorage.setItem("studentNumber", num);
  // check the API support:
  if (!crypto || !crypto.subtle) {
    throw Error("crypto.subtle is not supported."); // ブラウザ未対応
  }
  const algo = "SHA-256";
  // generate hash!
  crypto.subtle.digest(algo, new TextEncoder().encode(num)).then((x) => {
    const hex = hexString(x); // convert to hex string.
    localStorage.setItem("hashNumber", hex);
    hashNumber = hex;
  });
  //前回アクセスから15日以上経過している場合
  if (isPast == 0) {
    confirmSend();
  }
}

//ログ送信の同意を得る
function confirmSend() {
  let date = new Date();
  pastTime = date.valueOf();
  localStorage.setItem("pastTime", pastTime);
  var result = confirm(
    " ウェブ閲覧行動分析の研究を目的とし、閲覧ログを収集してもよろしいでしょうか。 \n\n 閲覧ログには、ハッシュ化を行った学籍番号、閲覧している時刻、閲覧しているページタイトル、閲覧に要した時間、アクセス元のブラウザ、が含まれます。 学籍番号のみハッシュ化し匿名化して収集を行います。 \n\n ウェブ閲覧行動分析の研究以外の目的ではこれらの情報を使用致しません。 \n\n\n OK : 同意 \n キャンセル : 同意しない"
  );
  if (result) {
    //OK

    localStorage.setItem("isAgree", 0);
  } else {
    //NG
    isAgree = 1;

    localStorage.setItem("isAgree", 1);
  }
  isPast = 1;
}

/** array buffer to hex string */
function hexString(buffer) {
  const byteArray = new Uint8Array(buffer);
  const hexCodes = [...byteArray].map((value) => {
    const hexCode = value.toString(16);
    const paddedHexCode = hexCode.padStart(2, "0");
    return paddedHexCode;
  });
  return hexCodes.join("");
}
