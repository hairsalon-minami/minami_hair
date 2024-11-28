// 祝日の設定
const shukujitu = (y, m, mon) => {
  // 元日 1月1日
  // 成人の日 1月の第2月曜日

  // 建国記念の日 政令で定める日(2月11日)
  // 天皇誕生日 2月23日

  // 春分の日 3月春分日

  // 昭和の日 4月29日

  // 憲法記念日 5月3日
  // みどりの日 5月4日
  // こどもの日 5月5日

  // 海の日 7月の第3月曜日

  // 山の日 8月11日

  // 敬老の日 9月の第3月曜日
  // 秋分の日 9月秋分日

  // スポーツの日 10月の第2月曜日

  // 文化の日 11月3日
  // 勤労感謝の日 11月23日

  // 春分の日
  const shunbun = Math.floor(
    20.8431 + 0.242194 * (y - 1980) - Math.floor((y - 1980) / 4)
  );
  // 秋分の日
  const shuubun = Math.floor(
    23.2488 + 0.242194 * (y - 1980) - Math.floor((y - 1980) / 4)
  );

  const holidayAry = [
    [1, mon + 7],
    [11, 23],
    [shunbun],
    [29],
    [3, 4, 5],
    [],
    [mon + 14],
    [11],
    [mon + 14, shuubun],
    [mon + 7],
    [3, 23],
    [],
  ];
  // 「前日と翌日の両方を祝日に挟まれた平日は休日」の設定
  // 現在この休日が発生するのは9月のみ
  if (m == 8 && holidayAry[8][1] - holidayAry[8][0] == 1)
    holidayAry[8].push(mon + 15);

  return holidayAry[m];
};

const week_style = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
// const year_style = "年";
// const month_style = "月";

// 月の日数
// 参考：うるう年の計算 西暦が4で割り切れる年。ただし、西暦が100で割り切れて400で割り切れない年は平年
const month_day = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

//現在の年・月・日・曜日の取得
const to_date = new Date();
const to_year = to_date.getFullYear();
const to_month = to_date.getMonth();
const to_day = to_date.getDate();

// 次月の年・月・日・曜日の取得
const nx_year = to_month < 11 ? to_year : to_year + 1;
const nx_month = to_year == nx_year ? to_month + 1 : 0;

// カレンダー設置場所の取得
const calendar = document.getElementById("businessCalendar");

const createCalendar = (year, month, today) => {
  // カレンダーを配列で制作
  //1日が金・土で月30日以上の場合、第6週まであるので、調整する
  const todate = new Date(year, month, 1);
  const week1st = todate.getDay();
  const month_end =
    month == 1 && year % 4 == 0 && !(year % 100 == 0 && year % 400 != 0)
      ? 29
      : month_day[month];

  // 読み上げ用テキストの初期設定
  let readText = String(month + 1) + "月のお休みは";

  // 配列番号を日としてカレンダー用配列を宣言
  const calArray = Array.from(new Array(month_end + 1), () => new Array());

  // 月最初の月曜日（第一月曜日）を取得
  const mon1st = week1st > 1 ? 9 - week1st : 2 - week1st;

  // 日曜日と定休日（毎週月曜、第2第3火曜日）を指定
  for (let d = mon1st; d <= month_end; d += 7) {
    // 日曜日
    if (d - 1 > 0) calArray[d - 1].push("sunday");

    // 12月24日以降以外は月曜定休日
    if (!(month == 11 && d >= 24)) {
      calArray[d].push("closed");
      readText += "、" + d + "日";
    }
    //第2・第3火曜定休日
    if (8 <= d && d <= 22) {
      calArray[d + 1].push("closed");
      readText += "、" + d + "日";
    }
  }

  // 読み上げ用テキスト完成
  readText += "です。";

  // 正月・夏休みの月の場合は指定
  // 正月休み
  if (month == 0) {
    let d = 1;
    while (d <= 5) {
      if (mon1st != d) calArray[d].push("closed");
      d++;
    }
  }
  // 夏休み
  if (month == 7) calArray[mon1st + 16].push("closed");

  // 祝休日の取得
  const holiday = shukujitu(year, month, mon1st);

  // 振替休日チェック関数
  let holidayCheck = (n) => {
    while (calArray[n].includes("sunday") || calArray[n].includes("holiday"))
      n++;
    return n;
  };
  // 祝日休日設定
  if (holiday.length) {
    holiday.forEach((v) => {
      let hd = holidayCheck(v);
      calArray[hd].push("holiday");
    });
  }

  //table
  const table = document.createElement("table");
  table.className = "calendar";
  table.title = readText;
  table.setAttribute("aria-hidden", "true");
  calendar.appendChild(table);

  //caption

  const caption = document.createElement("caption");
  caption.className = "label";
  table.appendChild(caption);

  const span = (str) => {
    let element = document.createElement("span");
    element.textContent = str;
    caption.appendChild(element);
  };

  //年月作成
  span(month + 1);
  span(year);

  //tr
  let tr;
  const row = () => {
    let element = document.createElement("tr");
    table.appendChild(element);
    tr = element;
  };

  //th
  const toWeek = (week) => {
    let th = document.createElement("th");
    th.textContent = week;
    tr.appendChild(th);
  };
  //曜日作成
  row();
  week_style.forEach((s) => toWeek(s));

  //td
  const days = (day, cls) => {
    let td = document.createElement("td");
    if (Array.isArray(cls) && cls.length) td.className = cls.join(" ");
    if (day) {
      td.textContent = day;
      if (day == today) td.classList.add("today");
    }
    tr.appendChild(td);
  };

  //日作成
  //繰り返す週数の取得
  const max = Math.floor((month_end + week1st + 6) / 7);

  let dy = 0 - week1st + 1;
  for (let n = 0; n < max; n++) {
    row();

    for (let m = 0; m < 7; m++) {
      if (dy < 1 || month_end < dy) days();
      else days(dy, calArray[dy]);
      dy++;
    }
  }
};

const notes = () => {
  const small = document.createElement("small");
  small.className = "note";
  small.setAttribute("aria-hidden", "true");
  calendar.appendChild(small);

  const noto_span = (str) => {
    let element = document.createElement("span");
    element.textContent = str;
    small.appendChild(element);
  };

  noto_span("今日");
  noto_span("休業日");
};

createCalendar(to_year, to_month, to_day);
notes();
createCalendar(nx_year, nx_month);
