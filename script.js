const URL_trophy = "https://new.chunithm-net.com/chuni-mobile/html/mobile/collection/trophy/";

async function main() {
    const parser = new DOMParser();
    const notify = document.createElement("div");
    notify.style = `position:fixed;
    top:50%;
    left:50%;
    transform:translate(-50%, -50%);
    -webkit-transform:translate(-50%, -50%);
    -ms-transform:translate(-50%, -50%);
    width:min(90%,400px);
    height:200px;
    padding:20px;
    overflow-x:hidden;
    border:2px solid black;
    border-radius:10px;
    background-color:white;`;
    document.body.appendChild(notify);

    notify.innerHTML = "<p>称号一覧を取得しています...</p>";

    // 称号ページ取得
    const page = parser.parseFromString(await (await fetch(URL_trophy)).text(), "text/html");
    const trophyBlocks = Array.prototype.slice.call(page.getElementsByClassName("box01 w420")).filter(e => e.getAttribute("name") !== null && e.getAttribute("name").startsWith("rareId"));
    
    let data = [];
    trophyBlocks.forEach(block => {
        let trophies = block.getElementsByClassName("honor_text");
        let gradeName = block.firstElementChild.innerText;
        let gradeData = [];
        for (let i = 1; i < trophies.length; i++) {
            gradeData.push(trophies[i].innerText);
        }
        console.log(gradeName)
        data.push({
            grade: gradeName,
            data: gradeData
        })
    });

    const now = new Date();
    const blob = new Blob([JSON.stringify(data)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.setAttribute("href", url);
    anchor.setAttribute("download", "chunithm_honor_data_" + String(Math.floor(now.getTime() / 1000)) + ".json");
    anchor.click();

    notify.innerHTML += "<p>データの取得が正常に完了しました！</p>";
    setTimeout(() => {
        notify.style.display = "none";
    }, 3000);
}

main();