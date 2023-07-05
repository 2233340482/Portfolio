import React from "react";
import { useState, useContext } from "react";
//import "./App.css";
import "chartjs-adapter-moment";
import Select from "react-select";
import { Scatter } from "react-chartjs-2";
import _ from "lodash";
import { Helmet } from "react-helmet";
import { confirmAlert } from "react-confirm-alert"; // Import
import "react-confirm-alert/src/react-confirm-alert.css"; // Import css

//import { Helmet } from 'react-helmet'

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
} from "chart.js";

//import { faker } from "@faker-js/faker";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale
);

export default function App() {
  const [graphdate, setGraphDate] = useState("May 12 2023");
  //let graphdate = "May 12 2023";
  const [options, setOptions] = useState({
    //Line コンポーネントに入れるオプションのプロップ
    spanGaps: true,

    responsive: true,
    gridLines: {
      tickMarkLength: 100,
    },
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Chart.js Line Chart",
      },
    },
    scales: {
      x: {
        display: true,
        type: "time",
        time: {
          parser: "ll hh:mm:ss", //<- use 'parser'
          unit: "hour",
          unitStepSize: 1,
          displayFormats: {
            minute: "ll hh:mm:ss",
          },
        },
        min: `${graphdate} 08:00:00`,
        max: `${graphdate} 19:03:00`,
      },
      y: {
        display: true,
        labelString: "距離",

        //Y軸の範囲を指定

        min: -100,
        max: -20,
      },
    },
  });

  const changeRange = (min, max, date) => {
    //グラフのx軸の最大値と最小値を変更
    let optionBox = Object.assign({}, options); //options複製
    optionBox.scales.x.min = `${date} ${min}`;
    optionBox.scales.x.max = `${date} ${max}`;
    // optionBox.spanGaps = "true";
    setOptions(optionBox);
  };

  // const setGraphDate = (date) => {
  //   graphdate = date;
  // };
  console.log(graphdate);

  return (
    <>
      {
        <div className="App">
          <SelectOptionMenue
            options={options}
            setGraphDate={setGraphDate}
            changeRange={changeRange}
          />
          <p className="App-p1">
            <button
              className="App-RangeButton"
              onClick={() => changeRange(`00:00:00`, `24:00:00`, graphdate)}
            >
              00:00:00~24:00:00
            </button>
            <button
              className="App-RangeButton"
              onClick={() => changeRange(`08:00:00`, `$19:00:00`, graphdate)}
            >
              08:00:00~19:00:00
            </button>
            <button
              className="App-RangeButton"
              onClick={() => changeRange(`12:00:00`, `19:00:00`, graphdate)}
            >
              12:00:00~19:00:00
            </button>
          </p>
        </div>
      }
    </>
  );
}

function SelectOptionMenue({ options, setGraphDate, changeRange }) {
  //オプションメニュー
  const [data, setData] = useState([]);
  const japanStandardTime = new Date().toLocaleString({
    timeZone: "Asia/Tokyo",
  });
  const nowDate = new Date(japanStandardTime);
  const startDate = new Date(2023, 4, 12, 0);

  const [selectedValue, setSelectedValue] = useState({});
  // const selectedValue = {};
  let SelectOptions = [];

  const [persons, setPersons] = useState([
    { label: "Alice", checked: false },
    { label: "Bob", checked: false },
    { label: "Carol", checked: false },
    { label: "Dave", checked: false },
  ]);

  const [places, setPlaces] = useState([
    { label: "M01", checked: false },
    { label: "M02", checked: false },
    { label: "M03", checked: false },
    { label: "M04", checked: false },
  ]);

  while (true) {
    ///2023/5/12から現在までのSelectOptionsを設定する。

    let DateStr = `${String(startDate.getFullYear())}  ${String(
      startDate.getMonth() + 1
    )}/${String(startDate.getDate())}`;

    let month = String(startDate.getMonth() + 1);
    let date = String(startDate.getDate());

    if (month.length === 1) {
      month = `0${month}`;
      //console.log(month);
    }
    if (date.length === 1) {
      date = `0${date}`;
    }

    let ValueStr = `${String(startDate.getFullYear())}-${month}-${date}`;

    const Dateobj = { value: ValueStr, label: DateStr };

    SelectOptions.push(Dateobj);
    //console.log(startDate.getFullYear() + nowDate.getFullYear());
    if (
      startDate.getFullYear() === nowDate.getFullYear() &&
      startDate.getMonth() === nowDate.getMonth() &&
      startDate.getDate() === nowDate.getDate()
    ) {
      break;
    }
    startDate.setDate(startDate.getDate() + 1);
  }

  function getJsonData(Date, Persons, Places) {
    let newData = [];

    for (let i = 0; i < Persons.length; i++) {
      for (let j = 0; j < Places.length; j++) {
        console.log(`test/${Date}_${Places[j]}_${Persons[i]}.json`);

        fetch(`test/${Date}_${Places[j]}_${Persons[i]}.json`, {
          mode: "cors",
          // headers: {
          //   "Content-Type": "application/json",
          //   Accept: "application/json",
          //},
        })
          .then(function (response) {
            //console.log(response.status);
            //console.log(response.json());
            return response.json();
          })
          .then(function (myJson) {
            let jsonDataList = [];
            let i = 0;

            while (true) {
              //jsonデータを１行ずつ読みjsonDayalistにJsonをpush
              if (myJson[i]) {
                jsonDataList.push(JSON.parse(myJson[i]));
                i++;
              } else break;
            }

            newData = [...newData, jsonDataList];
            setData(newData);
          });
      }
    }
    console.log(data);
    const year = Date.substring(0, 4);
    const month = monthFormat(Date.substring(5, 7));
    const date = Date.substring(8, Date.length);
    setGraphDate(`${month} ${date} ${year}`);
    changeRange(`08:00:00`, `$19:00:00`, `${month} ${date} ${year}`);
  }

  //console.log(options);

  const monthFormat = (month) => {
    switch (month) {
      case "01":
        return "Jun";

      case "02":
        return "Feb";

      case "03":
        return "Mar";

      case "04":
        return "Apr";

      case "05":
        return "May";

      case "06":
        return "Jun";

      case "07":
        return "Jul";

      case "08":
        return "Aug";

      case "09":
        return "Sep";

      case "10":
        return "Oct";

      case "11":
        return "Nov";

      case "12":
        return "Dec";

      default:
        console.log("err:該当する月がありません.");
        return null;
    }
  };

  return (
    <>
      <div className="menue">
        <div style={{ width: "600px" }} className="selectDay-div">
          <Select
            className="selectDay-Select"
            id="selectbox"
            instanceId="selectbox"
            options={SelectOptions}
            defaultValue={selectedValue}
            onChange={(value) => {
              return value ? setSelectedValue(value) : null;
            }}
          />
        </div>

        <table className="personTable">
          <tbody>
            <tr>
              <th>
                <input
                  className="SelectOptionMenue-person-Input"
                  type="checkbox"
                  value="Alice"
                  onChange={() => {
                    let newPersons = persons.slice();
                    newPersons[0].checked = !newPersons[0].checked;
                    //console.log(newPersons);

                    setPersons(newPersons);
                  }}
                  // checked={checkedValues.includes("マウス")}
                />
              </th>

              <th>Alice</th>
            </tr>

            <tr>
              <th>
                <input
                  className="SelectOptionMenue-person-Input"
                  type="checkbox"
                  value="Bob"
                  onChange={() => {
                    let newPersons = persons.slice();
                    newPersons[1].checked = !newPersons[1].checked;
                    //console.log(newPersons);

                    setPersons(newPersons);
                  }}
                  // checked={checkedValues.includes("マウス")}
                />
              </th>

              <th>Bob</th>
            </tr>

            <tr>
              <th>
                <input
                  className="SelectOptionMenue-person-Input"
                  type="checkbox"
                  value="Carol"
                  onChange={() => {
                    let newPersons = persons.slice();
                    newPersons[2].checked = !newPersons[2].checked;
                    console.log(newPersons);

                    setPersons(newPersons);
                  }}
                  // checked={checkedValues.includes("マウス")}
                />
              </th>

              <th>Carol</th>
            </tr>

            <tr>
              <th>
                <input
                  className="SelectOptionMenue-person-Input"
                  type="checkbox"
                  value="Dave"
                  onChange={() => {
                    let newPersons = persons.slice();
                    newPersons[3].checked = !newPersons[3].checked;
                    console.log(newPersons);

                    setPersons(newPersons);
                  }}
                  // checked={checkedValues.includes("マウス")}
                />
              </th>

              <th>Dave</th>
            </tr>
          </tbody>
        </table>

        <table className="placeTable">
          <tbody>
            <tr>
              <th>
                <input
                  className="SelectOptionMenue-person-Input"
                  type="checkbox"
                  value="M01"
                  onChange={() => {
                    let newPlaces = places.slice();
                    newPlaces[0].checked = !newPlaces[0].checked;
                    //console.log(newPersons);

                    setPlaces(newPlaces);
                  }}
                  // checked={checkedValues.includes("マウス")}
                />
              </th>

              <th>M01</th>
            </tr>

            <tr>
              <th>
                <input
                  className="SelectOptionMenue-person-Input"
                  type="checkbox"
                  value="M02"
                  onChange={() => {
                    let newPlaces = places.slice();

                    newPlaces[1].checked = !newPlaces[1].checked;

                    setPlaces(newPlaces);
                    console.log(places);
                  }}
                  // checked={checkedValues.includes("マウス")}
                />
              </th>

              <th>M02</th>
            </tr>

            <tr>
              <th>
                <input
                  className="SelectOptionMenue-person-Input"
                  type="checkbox"
                  value="M03"
                  onChange={() => {
                    let newPlaces = places.slice();
                    newPlaces[2].checked = !newPlaces[2].checked;
                    //console.log(newPersons);

                    setPlaces(newPlaces);
                  }}
                  // checked={checkedValues.includes("マウス")}
                />
              </th>

              <th>M03</th>
            </tr>

            <tr>
              <th>
                <input
                  className="SelectOptionMenue-person-Input"
                  type="checkbox"
                  value="M04"
                  onChange={() => {
                    let newPlaces = places.slice();
                    newPlaces[3].checked = !newPlaces[3].checked;
                    //console.log(newPersons);

                    setPlaces(newPlaces);
                  }}
                  // checked={checkedValues.includes("マウス")}
                />
              </th>

              <th>M04</th>
            </tr>
          </tbody>
        </table>

        <button
          className="SelectedOptionMenue-button"
          onClick={() => {
            const Date = selectedValue.value;
            //console.log(Date);

            let Pe = persons.map((value, indent) => {
              if (persons[indent].checked === true)
                return persons[indent].label;
            });
            const Persons = Pe.filter((a) => a);

            let Pl = places.map((value, indent) => {
              //console.log(places[indent].label);
              if (places[indent].checked === true) return places[indent].label;
            });
            const Places = Pl.filter((a) => a);

            if (!Date) {
              //日付が選択されていない場合

              confirmAlert({
                //alert用の関数
                title: "日付を選択してください。",
                message: "",
                buttons: [
                  {
                    label: "OK",
                  },
                ],
              });
            } else if (Places.length === 0 || Persons.length === 0) {
              confirmAlert({
                //alert用の関数
                title: "チェック項目を選択してください。",
                message: "例. Alice,Bob...,M01,M02...など",
                buttons: [
                  {
                    label: "OK",
                    //onClick: () => alert("Click Yes"),
                  },
                  // {
                  //   label: "いいえ",
                  //   //onClick: () => alert("Click No"),
                  // },
                ],
              });
            } else {
              getJsonData(Date, Persons, Places);
            }
          }}
        >
          データ取得
          <span></span>
        </button>
      </div>

      <Graph data={data} options={options} />
    </>
  );
}

function Graph({ data, options }) {
  const diff = 10000; //何ミリ秒間の返金値を求めるか？
  let CopyData = data.slice();
  console.log(CopyData);
  let newData = []; //平均値を求めたアブジェクトを入れる配列

  newData = CopyData;

  //以下のコメントアウトを外すとnewDataにdiffの時間の中で距離の平均値を求めたデータを入れる
  // CopyData.map((value, indent) => {
  //   newData.push([]);
  //   let StandardDate = null;
  //   let distanceList = [];
  //   let beforeValue2 = null;
  //   value.map((value2, indent2) => {
  //     let date = new Date(formatDate(value2.a));

  //     if (StandardDate) {
  //       const difference = date.getTime() - StandardDate.getTime();
  //       //console.log(StandardDate);

  //       if (diff >= difference) {
  //         beforeValue2 = value2;
  //       } else {
  //         //console.log(distanceList);
  //         let sum = 0;

  //         distanceList.forEach((v) => {
  //           sum += v;
  //         });
  //         //console.log(StandardDate);

  //         let average = sum / distanceList.length;

  //         let copybeforeValue2 = Object.assign({}, beforeValue2);

  //         copybeforeValue2.r = Math.round(average);
  //         newData[indent].push(copybeforeValue2);
  //         //console.log(newData[indent]);

  //         StandardDate = date;
  //         distanceList = [];
  //       }
  //     } else {
  //       StandardDate = date;
  //     }
  //     distanceList.push(value2.r);
  //   });
  // });
  // //console.log(newData);

  const [graphData, setGraphData] = useState({
    datasets: [
      {
        label: "A dataset",
        data: [
          { x: "Oct 4 2023  10:15:30", y: "-80" },
          { x: "Oct 4 2023  15:15:30", y: "-27" },

          { x: "May 12 2023  12:00:05", y: -71 },
        ],
        pointRadius: 2,
        backgroundColor: "rgba(255, 99, 132, 1)",
        //showLine: true,
      },
      {
        label: "A dataset",
        data: [
          { x: "Oct 4 2023  10:15:30", y: "-80" },
          { x: "Oct 4 2023  15:15:30", y: "-27" },

          { x: "May 12 2023  14:00:05", y: -71 },
        ],
        pointRadius: 2,
        backgroundColor: "rgba(1, 99, 132, 1)",
      },
    ],
  });

  function setDataToGraph(JSONdata) {
    if (!(JSONdata.length === 0)) {
      let Datasets = [];
      JSONdata.map((d, indent) => {
        let Data = [];
        let randomColor =
          "rgb(" +
          ~~(256 * Math.random()) +
          ", " +
          ~~(256 * Math.random()) +
          ", " +
          ~~(256 * Math.random()) +
          ")";

        let place;
        let person;
        JSONdata[indent].map((value, indent) => {
          let Point = {
            x: formatDate(value.a),
            y: value.r,
          };

          Data.push(Point);
          if (indent === 0) {
            place = value.p;
            person = value.n;
          }

          //value.a;
        });
        let DataList = {
          label: `${place}_${person}`,
          data: Data,
          pointRadius: 2,
          backgroundColor: randomColor,
          //showLine: true,
        };

        Datasets.push(DataList);
        console.log(Datasets);
      });

      setGraphData({
        //Lineコンポーネントに入れるデータのプロップ
        datasets: Datasets,
      });
      console.log(graphData);

      // setGraphData({
      //   //Lineコンポーネントに入れるデータのプロップ
      //   datasets: [
      //     {
      //       label: place,
      //       data: graphDataList,
      //       pointRadius: 2,
      //       backgroundColor: "rgba(255, 99, 132, 1)",
      //       //showLine: true,
      //     },
      //   ],
      // });
    }
  }

  function formatDate(date) {
    //console.log(date);
    //jsonのkey"a"を引数とし、グラフデータに使用できる文字列に変更する
    //let date = "2023-05-12T08:00:05";

    let dateObj = {
      year: date.substring(0, date.indexOf("-")),
      month: date.substring(5, date.indexOf("-", 5)),
      day: date.substring(8, date.indexOf("T")),
      Time: date.substring(date.indexOf("T") + 1, date.length),
    };

    switch (dateObj.month) {
      case "01":
        dateObj["month"] = "Jun";
        break;
      case "02":
        dateObj["month"] = "Feb";
        break;
      case "03":
        dateObj["month"] = "Mar";
        break;
      case "04":
        dateObj["month"] = "Apr";
        break;
      case "05":
        dateObj["month"] = "May";
        break;
      case "06":
        dateObj["month"] = "Jun";
        break;
      case "07":
        dateObj["month"] = "Jul";
        break;
      case "08":
        dateObj["month"] = "Aug";
        break;
      case "09":
        dateObj["month"] = "Sep";
        break;
      case "10":
        dateObj["month"] = "Oct";
        break;
      case "11":
        dateObj["month"] = "Nov";
        break;
      case "12":
        dateObj["month"] = "Dec";
        break;

      default:
        console.log("err:該当する月がありません.");
    }

    //console.log(dateObj);
    return `${dateObj.month} ${dateObj.day} ${dateObj.year}  ${dateObj.Time}`;
  }

  return (
    <>
      <p className="Graph-p">
        <button
          className="Graph-button"
          onClick={() => {
            if (!data[0]) {
              //データがからの場合
              confirmAlert({
                //alert用の関数
                title: "データを取得してください",
                message: "",
                buttons: [
                  {
                    label: "OK",
                  },
                ],
              });
            }
            setDataToGraph(newData);
          }}
        >
          <span>更新</span>
        </button>
      </p>
      <h2>Scatter Example</h2>
      <Scatter options={options} data={graphData} />
    </>
  );
}

// function GraphSettings() {
//   return <DistanceButton distance="-50" />;
// }

// function DistanceButton({ distance }) {
//   return (
//     <button className="GraphSetting-button" onClick={() => {}}>
//       {distance}
//     </button>
//   );
// }
