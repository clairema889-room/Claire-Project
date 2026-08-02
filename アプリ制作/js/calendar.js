let calendar =
document.getElementById("calendar");


let today = new Date();


let year =
today.getFullYear();


let month =
today.getMonth();



function createCalendar(){


let first =
new Date(year,month,1);


let last =
new Date(year,month+1,0);



let html = `

<div class="calendar-header">

<button onclick="prevMonth()" class="month-btn">◀</button>

<h2>${year}年${month+1}月</h2>

<button onclick="nextMonth()" class="month-btn">▶</button>

</div>

<table class="calendar-table">

<tr>

<th>日</th>
<th>月</th>
<th>火</th>
<th>水</th>
<th>木</th>
<th>金</th>
<th>土</th>

</tr>

<tr>
`;



for(let i=0;i<first.getDay();i++){

html += "<td></td>";

}



for(let day=1;day<=last.getDate();day++){


html += `

<td id="day${day}" onclick="selectDay(${day})">

${day}

</td>

`;


if((first.getDay()+day)%7==0){

html += "</tr><tr>";

}


}


html += `

</tr>

</table>

<div id="dayPlan">

日付を選択してください

</div>

`;



calendar.innerHTML=html;
// 今月のときだけ今日の日付を選択
if(
    year === today.getFullYear() &&
    month === today.getMonth()
){
    selectDay(today.getDate());
}


}
function prevMonth(){

    month--;

    if(month < 0){

        month = 11;

        year--;

    }

    createCalendar();

}

function nextMonth(){

    month++;

    if(month > 11){

        month = 0;

        year++;

    }

    createCalendar();

}


function selectDay(day){

    // 前の選択を消す
    document.querySelectorAll(".calendar-table td").forEach(td => {
        td.classList.remove("selected-day");
    });


    // 今選んだ日を紫にする
    document.getElementById("day" + day)
    .classList.add("selected-day");


    let date =
        year + "-" +
        String(month + 1).padStart(2,"0") + "-" +
        String(day).padStart(2,"0");


    let submits =
        JSON.parse(localStorage.getItem("submits")) || [];

    let notices =
        JSON.parse(localStorage.getItem("notices")) || [];

    let submitText = "";

    submits.forEach(item => {
        if(item.date === date){
            submitText += "・" + item.title + "<br>";
        }
    });

    

    let noticeText = "";

    notices.forEach(item => {
        if(item.date === date){
            noticeText += "・" + item.text + "<br>";
        }
    });

 let html = `
<b>${year}年${month+1}月${day}日</b><br><br>
`;

if(submitText !== ""){

    html += `
    📝 提出物<br>
    ${submitText}
    
    `;

}

if(noticeText !== ""){

    html += `
    🔔 通知<br>
    ${noticeText}
    `;

}

if(submitText === "" && noticeText === ""){

    html += "ありません";

}
document.getElementById("dayPlan").innerHTML = html;

document.getElementById("dayPlan").scrollIntoView({

    behavior: "smooth",

    block: "start"

});
   
document.activeElement.blur();
    
}

createCalendar();

