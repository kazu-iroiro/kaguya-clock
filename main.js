window.onload = function () {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('sw.js')
            .then(
                function (registration) {
                    if (typeof registration.update == 'function') {
                        registration.update();
                    }
                })
            .catch(function (error) {
                console.log("Error Log: " + error);
            });

    }

    // 要素の取得
    const clock = document.getElementById("clock");
    const disp_month = document.getElementById("clock-date-1");
    const disp_day_1 = document.getElementById("clock-date-2");
    const disp_day_2 = document.getElementById("clock-date-3");

    const disp_dayofweek_matrix = document.getElementById("clock-dayofweek-matrix");

    const disp_temp_1 = document.getElementById("clock-temp-value1");
    const disp_temp_2 = document.getElementById("clock-temp-value2");

    const disp_hour_1 = document.getElementById("clock-hour-value1");
    const disp_hour_2 = document.getElementById("clock-hour-value2");

    const disp_minute_1 = document.getElementById("clock-minute-value1");
    const disp_minute_2 = document.getElementById("clock-minute-value2");

    updateClock();

    // 時刻の更新
    async function updateClock() {
        const now = new Date();
        const month = now.getMonth() + 1;
        const day = now.getDate();
        const dayOfWeek = now.getDay();
        const hour = now.getHours();
        const minute = now.getMinutes();

        // 月の表示

        setSegmentA2(disp_month, month);

        // 日の表示
        setSegmentB("clock-date-2", Math.floor(day / 10));
        setSegmentB("clock-date-3", day % 10);

        // 曜日の表示
        setDayOfWeek(dayOfWeek);

        // 時の表示
        setSegmentB("clock-hour-value1", Math.floor(hour / 10));
        setSegmentB("clock-hour-value2", hour % 10);

        // 分の表示
        setSegmentB("clock-minute-value1", Math.floor(minute / 10));
        setSegmentB("clock-minute-value2", minute % 10);

        // 気温の表示
        // 前回の取得から10分以上経過している場合にのみ、気温を更新する
        const lastUpdated = localStorage.getItem("lastWeatherUpdate");
        if (!lastUpdated || now.getTime() - parseInt(lastUpdated) > 600000) {
            const temperature = await fetchWeather();
            setSegmentB("clock-temp-value1", Math.floor(temperature / 10));
            setSegmentB("clock-temp-value2", Math.floor(temperature % 10));
            localStorage.setItem("lastWeatherUpdate", now.getTime().toString());
            localStorage.setItem("saveTemperature", temperature.toString());
        } else {
            // 前回の取得から10分以上経過していない場合は、前回の気温を表示する
            const temperature = localStorage.getItem("saveTemperature");
            setSegmentB("clock-temp-value1", Math.floor(temperature / 10));
            setSegmentB("clock-temp-value2", Math.floor(temperature % 10));
        }

        blinkColon();

        setTimeout(updateClock, 1000);
    }

}

// segment-a2の場合
function setSegmentA2(id, num) {
    const segmenta2_set_0 = [1, 2, 3, 4, 7, 8, 11, 12];
    const segmenta2_set_1 = [1, 2];
    const segmenta2_set_2 = [1, 4, 7, 8, 9, 10, 11, 12];
    const segmenta2_set_3 = [1, 2, 7, 8, 9, 10, 11, 12];
    const segmenta2_set_4 = [1, 2, 3, 9, 10];
    const segmenta2_set_5 = [2, 3, 7, 8, 9, 10, 11, 12];
    const segmenta2_set_6 = [2, 3, 4, 7, 8, 9, 10, 11, 12];
    const segmenta2_set_7 = [1, 2, 3, 7, 8];
    const segmenta2_set_8 = [1, 2, 3, 4, 7, 8, 9, 10, 11, 12];
    const segmenta2_set_9 = [1, 2, 3, 7, 8, 9, 10, 11, 12];
    const segmenta2_set_10 = [1, 2, 3, 4, 5, 6, 7, 12];
    const segmenta2_set_11 = [1, 2, 3, 4];
    const segmenta2_set_12 = [1, 3, 4, 6, 7, 9, 12];

    // 16進数表示Ver
    // const segmenta2_set_10 = [1, 2, 3, 4, 7, 8, 9, 10];
    // const segmenta2_set_11 = [2, 3, 4, 9, 10, 11, 12];
    // const segmenta2_set_12 = [3, 4, 7, 8, 11, 12];


    // console.log(eval("segmenta2_set_" + num));

    // idに対応するオブジェクトのid:"segment-a2-*"をvisibleにする
    for (let i = 1; i <= 12; i++) {
        var segment = document.getElementById("segment-a2-" + i);
        if (eval("segmenta2_set_" + num).includes(i)) {
            segment.style.visibility = "visible";
        } else {
            segment.style.visibility = "hidden";
        }
    }
}

// segment-bの場合
function setSegmentB(id, num) {
    const segmentb_set_0 = [1, 2, 3, 4, 5, 7];
    const segmentb_set_1 = [1, 3];
    const segmentb_set_2 = [1, 2, 4, 6, 7];
    const segmentb_set_3 = [1, 2, 3, 4, 6];
    const segmentb_set_4 = [1, 3, 5, 6];
    const segmentb_set_5 = [2, 3, 4, 5, 6];
    const segmentb_set_6 = [2, 3, 4, 5, 6, 7];
    const segmentb_set_7 = [1, 2, 3, 5];
    const segmentb_set_8 = [1, 2, 3, 4, 5, 6, 7];
    const segmentb_set_9 = [1, 2, 3, 4, 5, 6];


    // console.log(eval("segmentb_set_" + num));

    const container = document.getElementById(id);
    if (!container) {
        return;
    }

    // idに対応するオブジェクトのid:"segment-b-*"をvisibleにする
    for (let i = 1; i <= 7; i++) {
        const segment = container.querySelector("#segment-b-" + i);
        if (!segment) {
            continue;
        }
        if (eval("segmentb_set_" + num).includes(i)) {
            segment.style.visibility = "visible";
        } else {
            segment.style.visibility = "hidden";
        }
    }
}


function setDayOfWeek(num) {
    const dayOfWeekClasses = ["show-sun", "show-mon", "show-tue", "show-wed", "show-thu", "show-fri", "show-sat"];
    const matrixContainer = document.getElementById("clock-dayofweek-matrix");


    if (!matrixContainer) {
        return;
    }

    dayOfWeekClasses.forEach(cls => {
        matrixContainer.classList.remove(cls);
    });

    matrixContainer.classList.add(dayOfWeekClasses[num]);
}

// 天気情報を取得する関数
async function fetchWeather() {
    const latitude = 35.6895;
    const longitude = 139.6917;

    // Open-Meteo
    const apiUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`;

    const response = await fetch(apiUrl);
    const data = await response.json();

    return data.current_weather.temperature;
}

function blinkColon() {
    const colon1 = document.getElementById("clock-colon-top");
    const colon2 = document.getElementById("clock-colon-bottom");

    if (colon1.style.visibility === "hidden") {
        colon1.style.visibility = "visible";
        colon2.style.visibility = "visible";
    }
    else {
        colon1.style.visibility = "hidden";
        colon2.style.visibility = "hidden";
    }
}