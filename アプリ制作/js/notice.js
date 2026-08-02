let notices =
JSON.parse(localStorage.getItem("notices")) || [];



function showNotice(){

    let list =
    document.getElementById("noticeList");

    // 通知リスト画面ではない場合
    if(!list){
        return;
    }

    list.innerHTML = "";


    notices.forEach((notice,index)=>{

        let div = document.createElement("div");

        div.className = "card";


        // 昔の通知（文字だけ）にも対応
        if(typeof notice === "string"){

            div.innerHTML =
            `
            <div>
                🔔 ${notice}
            </div>

            <button onclick="deleteNotice(${index})">
                削除
            </button>
            `;

        }

        else{

    let today = new Date();

    today.setHours(0,0,0,0);


    let target = new Date(notice.date);

    target.setHours(0,0,0,0);


    let diff =
    Math.ceil(
        (target - today) / (1000 * 60 * 60 * 24)
    );


    let remainText;
    let remainClass;


    if(diff < 0){

        remainText = "❌ 期限切れ";
        remainClass = "expired";

    }

    else if(diff === 0){

        remainText = "⚠️ 今日";
        remainClass = "today";

    }

    else if(diff === 1){

        remainText = "⏰ 明日";
        remainClass = "tomorrow";

    }

    else{

        remainText = "あと" + diff + "日";
        remainClass = "";

    }


div.innerHTML =
`

<div>

    🔔 ${notice.text}

    <br>

    📅 ${notice.date}

    <br>

    <span class="${remainClass}">
    ${remainText}
    </span>

</div>


<button class="delete-btn" onclick="deleteNotice(${index})">
削除
</button>

    `;

}


        list.appendChild(div);

    });

}



function addNotice(){

    let text =
    document.getElementById("noticeText").value;


    let date =
    document.getElementById("noticeDate").value;


   if(text == ""){

    Swal.fire({
target: ".app",

position: "top",
        icon:"warning",

        title:"通知内容を入力してください",

        width:280,

        confirmButtonColor:"#6b3df5"

    });

    return;

}


if(date == ""){

    Swal.fire({
target: ".app",

position: "top",
        icon:"warning",

        title:"日付を選択してください",

        width:280,

        confirmButtonColor:"#6b3df5"

    });

    return;

}

    notices.push({

        text: text,

        date: date

    });


    localStorage.setItem(
        "notices",
        JSON.stringify(notices)
    );


    Swal.fire({
target: ".app",

position: "top",
    icon:"success",

    title:"保存しました！",

    width:280,

    confirmButtonColor:"#6b3df5"

}).then(()=>{

    location.href="notice.html";

});


    

}



function deleteNotice(index){

    notices.splice(index,1);


    localStorage.setItem(
        "notices",
        JSON.stringify(notices)
    );


    showNotice();

}



showNotice();


if(document.getElementById("noticeDate")){

    flatpickr("#noticeDate",{

        locale: flatpickr.l10ns.ja,

        dateFormat:"Y-m-d",

        allowInput:false,

        disableMobile:true,

        position:"center"
 });
}

function cancelNotice(){

    document.getElementById("noticeText").value="";

    document.getElementById("noticeDate").value="";


    document.getElementById("cancelNoticeBtn")
    .style.display="none";


    document.getElementById("homeNoticeBtn")
    .style.display="block";

}



function checkNoticeInput(){

    let text =
    document.getElementById("noticeText").value;


    let date =
    document.getElementById("noticeDate").value;


    let cancel =
    document.getElementById("cancelNoticeBtn");


    let home =
    document.getElementById("homeNoticeBtn");



    if(text != "" || date != ""){


        cancel.style.display="block";


        home.style.display="none";


    }else{


        cancel.style.display="none";


        home.style.display="block";


    }

}



document
.getElementById("noticeText")
.addEventListener(
"input",
checkNoticeInput
);



document
.getElementById("noticeDate")
.addEventListener(
"change",
checkNoticeInput
);



function goHomeNotice(){

    location.href="index.html";

}

function backNotice(){

    let text =
    document.getElementById("noticeText").value;


    let date =
    document.getElementById("noticeDate").value;



    if(text != "" || date != ""){


        Swal.fire({

            target: ".app",

            position:"top",

            icon:"warning",

            title:"保存されていません",

            text:"入力内容があります",

            width:280,

            confirmButtonColor:"#6b3df5"


        });


    }else{


        location.href="notice-menu.html";


    }

}