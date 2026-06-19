let installPrompt = null;
let clockclickinterval = null;

document.addEventListener("DOMContentLoaded", async () => {
    const pwaBtn = document.getElementById("pwa-install");
    const msgCan = document.getElementById("can-pwa-install-by-button");
    const msgCannot = document.getElementById("cannot-pwa-install-by-button");
    const msgAlready = document.getElementById("pwa-already-installed");
    const msgPWAWarning = document.getElementsByClassName("pwa-warning");

    if (installPrompt) {
        if (pwaBtn) pwaBtn.style.display = "block";
        if (msgCan) msgCan.style.display = "list-item";
    }

    const isRunningInPWA = window.matchMedia('(display-mode: standalone)').matches ||
        window.matchMedia('(display-mode: fullscreen)').matches ||
        window.navigator.standalone === true;

    if (isRunningInPWA) {
        if (msgAlready) msgAlready.style.display = "list-item";
        return;
    }

    if ('getInstalledRelatedApps' in navigator) {
        try {
            const relatedApps = await navigator.getInstalledRelatedApps();
            if (relatedApps.length > 0) {
                if (msgAlready) msgAlready.style.display = "list-item";
                return;
            }
        } catch (e) {
            console.log("getInstalledRelatedApps error:", e);
        }
    }

    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) ||
        (navigator.userAgent.includes("Mac") && "ontouchend" in document);

    if (isIOS) {
        if (msgCannot) msgCannot.style.display = "list-item";
        return;
    }

    if (pwaBtn) {
        pwaBtn.addEventListener("click", async function () {
            if (!installPrompt) return;

            installPrompt.prompt();
            localStorage.setItem("fin-tutorial", "true");

            const { outcome } = await installPrompt.userChoice;
            console.log(`Install prompt was: ${outcome}`);

            installPrompt = null;
            pwaBtn.style.display = "none";
            if (msgCan) msgCan.style.display = "none";
        });
    }

    setTimeout(() => {
        if (!installPrompt && msgPWAWarning) {
            for (let i = 0; i < msgPWAWarning.length; i++) {
                msgPWAWarning[i].style.display = "list-item";
            }
        }
    }, 1500);
});

window.addEventListener("beforeinstallprompt", (event) => {
    event.preventDefault();
    installPrompt = event;

    const pwaBtn = document.getElementById("pwa-install");
    const msgCan = document.getElementById("can-pwa-install-by-button");
    const msgCannot = document.getElementById("cannot-pwa-install-by-button");
    const msgAlready = document.getElementById("pwa-already-installed");
    const msgPWAWarning = document.getElementsByClassName("pwa-warning");

    if (pwaBtn) pwaBtn.style.display = "block";
    if (msgCan) msgCan.style.display = "list-item";
    if (msgCannot) msgCannot.style.display = "none";
    if (msgAlready) msgAlready.style.display = "none";
    if (msgPWAWarning) {
        for (let i = 0; i < msgPWAWarning.length; i++) {
            msgPWAWarning[i].style.display = "none";
        }
    }
});

window.onload = function () {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('sw.js', { updateViaCache: 'none' })
            .then(
                function (registration) {
                    if (typeof registration.update === "function") {
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

    const dialog_button_1 = document.getElementById("tutorial-to-page2");
    const dialog_button_2 = document.getElementById("back-to-page1");
    const dialog_button_3 = document.getElementById("close-tutorial");
    const dialog_button_4 = document.getElementById("next-to-pwa-install");
    const dialog_button_5 = document.getElementById("back-to-page2");
    const dialog_button_6 = document.getElementById("pwa-install");

    const tutorial_dialog1 = document.getElementById("tutorial-dialog1");
    const tutorial_dialog2 = document.getElementById("tutorial-dialog2");
    const tutorial_dialog3 = document.getElementById("tutorial-dialog3");

    // ボタンにイベントリスナーを追加
    dialog_button_1.addEventListener("click", function () {
        switchDialog(tutorial_dialog1, tutorial_dialog2, true);
    });
    dialog_button_2.addEventListener("click", function () {
        switchDialog(tutorial_dialog2, tutorial_dialog1, true);
    });
    dialog_button_3.addEventListener("click", function () {
        switchDialog(tutorial_dialog2, null, false);
        localStorage.setItem("fin-tutorial", "true");
    });
    dialog_button_4.addEventListener("click", function () {
        switchDialog(tutorial_dialog2, tutorial_dialog3, true);
    });
    dialog_button_5.addEventListener("click", function () {
        switchDialog(tutorial_dialog3, tutorial_dialog2, true);
    });

    clock.addEventListener("click", function () {
        if (clockclickinterval != null && Date.now() - clockclickinterval < 750) {
            tutorial_dialog1.style.visibility = "visible";
            tutorial_dialog1.classList.remove('fade-out');
            tutorial_dialog1.classList.remove('fade-in');
            tutorial_dialog1.querySelectorAll("ul, button").forEach(el => {
                el.classList.remove('fade-out');
            });

            void tutorial_dialog1.offsetWidth;

            tutorial_dialog1.classList.add('fade-in');

        } else {
            clockclickinterval = Date.now();
        }
    });

    // 気温の地点情報取得・変更
    const placeSelect = document.getElementById("location-select");
    const latitudeInput = document.getElementById("latitude-input");
    const longitudeInput = document.getElementById("longitude-input");

    // 初期化時にlocalStorageから保存された値を読み込む
    const finTutorial = localStorage.getItem("fin-tutorial");
    const savedPlace = localStorage.getItem("selectedPlace");
    const savedLatitude = localStorage.getItem("latitude");
    const savedLongitude = localStorage.getItem("longitude");

    if (finTutorial === null) {
        localStorage.setItem("fin-tutorial", "false");
    }

    if (finTutorial === "false" || finTutorial === null) {
        tutorial_dialog1.style.visibility = "visible";
    }

    if (savedPlace) {
        placeSelect.value = savedPlace;
    }
    if (savedLatitude && savedLongitude) {
        latitudeInput.value = savedLatitude;
        longitudeInput.value = savedLongitude;
        latitudeInput.disabled = true;
        longitudeInput.disabled = true;
    }

    placeSelect.addEventListener("change", function () {
        const selectedPlace = placeSelect.value;
        const area = findArea(selectedPlace);
        if (area) {
            latitudeInput.value = area.latitude;
            longitudeInput.value = area.longitude;
            latitudeInput.disabled = true;
            longitudeInput.disabled = true;
        } else {
            // 緯度経度の入力欄のdisableを解除して、値を空にする
            latitudeInput.value = "";
            longitudeInput.value = "";
            latitudeInput.disabled = false;
            longitudeInput.disabled = false;
        }

        // localStorageに保存
        localStorage.setItem("selectedPlace", selectedPlace);
        localStorage.setItem("latitude", latitudeInput.value);
        localStorage.setItem("longitude", longitudeInput.value);

        // 保存されていた気温情報のフラッシュ
        localStorage.removeItem("lastWeatherUpdate");
    });

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
        setSegmentA("clock-minute-value1", Math.floor(minute / 10));
        setSegmentB("clock-minute-value2", minute % 10);

        // 気温の表示
        // 前回の取得から10分以上経過している場合にのみ、気温を更新する
        const lastUpdated = localStorage.getItem("lastWeatherUpdate");
        if (!lastUpdated || now.getTime() - parseInt(lastUpdated) > 600000) {
            const temperature = await fetchWeather();
            setSegmentB("clock-temp-value1", Math.floor(temperature / 10));
            setSegmentA("clock-temp-value2", Math.floor(temperature % 10));
            localStorage.setItem("lastWeatherUpdate", now.getTime().toString());
            localStorage.setItem("saveTemperature", temperature.toString());
        } else {
            // 前回の取得から10分以上経過していない場合は、前回の気温を表示する
            const temperature = localStorage.getItem("saveTemperature");
            setSegmentB("clock-temp-value1", Math.floor(temperature / 10));
            setSegmentA("clock-temp-value2", Math.floor(temperature % 10));
        }

        blinkColon();

        setTimeout(updateClock, 1000);
    }

}

// segment-aの場合
function setSegmentA(id, num) {
    const segmenta_set_0 = [1, 2, 3, 4, 5, 7];
    const segmenta_set_1 = [1, 3];
    const segmenta_set_2 = [1, 2, 4, 6, 7];
    const segmenta_set_3 = [1, 2, 3, 4, 6];
    const segmenta_set_4 = [1, 3, 5, 6];
    const segmenta_set_5 = [2, 3, 4, 5, 6];
    const segmenta_set_6 = [2, 3, 4, 5, 6, 7];
    const segmenta_set_7 = [1, 2, 3, 5];
    const segmenta_set_8 = [1, 2, 3, 4, 5, 6, 7];
    const segmenta_set_9 = [1, 2, 3, 4, 5, 6];

    const parentElement = document.getElementById(id);

    // idに対応するオブジェクトのid:"segment-a-*"をvisibleにする
    for (let i = 1; i <= 7; i++) {
        var segment = parentElement.querySelector("#segment-a-" + i);
        if (eval("segmenta_set_" + num).includes(i)) {
            segment.style.visibility = "visible";
        } else {
            segment.style.visibility = "hidden";
        }
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
    const latitude = localStorage.getItem("latitude") || findArea("立川").latitude;
    const longitude = localStorage.getItem("longitude") || findArea("立川").longitude;

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

function findArea(name) {
    const data = [
        { name: "立川", latitude: 35.6983863, longitude: 139.4119972 },
        { name: "札幌", latitude: 43.0736997, longitude: 141.3422968 },
        { name: "仙台", latitude: 38.2536776, longitude: 140.8740725 },
        { name: "東京", latitude: 35.7128933, longitude: 139.7596674 },
        { name: "名古屋", latitude: 35.1542928, longitude: 136.9667901 },
        { name: "大阪", latitude: 34.8210270, longitude: 135.5227468 },
        { name: "広島", latitude: 34.3985176, longitude: 132.7115982 },
        { name: "松山", latitude: 33.8524660, longitude: 132.7743677 },
        { name: "福岡", latitude: 33.5603602, longitude: 130.4305085 },
        { name: "沖縄", latitude: 26.2527118, longitude: 127.7649552 }
    ];

    // リスト中にnameと一致するものがあれば、その緯度経度を返す
    for (const area of data) {
        if (area.name === name) {
            return { latitude: area.latitude, longitude: area.longitude };
        }
    }

    // 一致するものがなければnullを返す
    return null;

}

function switchDialog(currentDialog, nextDialog, inner_only = false) {
    if (inner_only) {
        const currentTargets = currentDialog.querySelectorAll("ul, .dialog-button-container");

        currentTargets.forEach(el => {
            el.classList.remove('fade-in');
            el.classList.add('fade-out');
        });

        setTimeout(() => {
            currentDialog.style.visibility = "hidden";

            if (nextDialog) {
                nextDialog.style.visibility = "visible";
                nextDialog.classList.remove('fade-out', 'fade-in');
                const nextElements = nextDialog.querySelectorAll("ul, .dialog-button-container");

                nextElements.forEach(element => {
                    element.classList.remove('fade-out', 'fade-in');
                    void element.offsetWidth;
                    element.classList.add('fade-in');
                });
            }
        }, 250);

    } else {
        currentDialog.classList.remove('fade-in');
        currentDialog.classList.add('fade-out');

        setTimeout(() => {
            currentDialog.style.visibility = "hidden";

            if (nextDialog) {
                nextDialog.style.visibility = "visible";
                nextDialog.classList.remove('fade-out', 'fade-in');
                nextDialog.querySelectorAll("ul, .dialog-button-container").forEach(element => {
                    element.classList.remove('fade-out');
                });
                void nextDialog.offsetWidth;
                nextDialog.classList.add('fade-in');
            }
        }, 250);
    }
}

function adjustScale() {
    const currentWidth = window.innerWidth;
    const currentHeight = window.innerHeight;

    const targetHeight = currentWidth * 0.5625;

    document.body.style.margin = "0";
    document.body.style.width = "100vw";
    document.body.style.height = "100vh";

    document.body.style.display = "flex";
    document.body.style.justifyContent = "center";
    document.body.style.alignItems = "center";

    if (currentHeight < targetHeight) {
        const scaleRate = currentHeight / targetHeight;

        document.body.style.transform = `scale(${scaleRate})`;
        document.body.style.transformOrigin = 'center center';
    } else {
        document.body.style.transform = 'scale(1)';
        document.body.style.transformOrigin = 'center center';
    }
}

window.addEventListener('DOMContentLoaded', adjustScale);
window.addEventListener('resize', adjustScale);