function addSubmit(){

    let title =
    document.getElementById("title").value;

    let date =
    document.getElementById("date").value;

    if(title.trim() == ""){

    Swal.fire({
target: ".app",

    position: "top",

    icon: "warning",
    
    title: "提出物名を入力してください",
    width:280,
    confirmButtonColor: "#6b3df5"

});

    return;

}

if(date == ""){

    Swal.fire({
target: ".app",

    position: "top",

    icon: "warning",

    title: "提出日を選択してください",

    width: 280,
    confirmButtonColor: "#6b3df5"

});

    return;

}




    let submits =
    JSON.parse(localStorage.getItem("submits"))
    || [];


    let editIndex = localStorage.getItem("editSubmitIndex");

if(editIndex !== null){

    submits[editIndex] = {
        title:title,
        date:date
    };

    localStorage.removeItem("editSubmitIndex");

}else{

    let editIndex =
localStorage.getItem("editSubmitIndex");


if(editIndex !== null){

    submits[editIndex] = {

        title:title,

        date:date

    };


    localStorage.removeItem(
        "editSubmitIndex"
    );


}else{


    submits.push({

        title:title,

        date:date

    });


}

}


    localStorage.setItem(
        "submits",
        JSON.stringify(submits)
    );

submitSaved = true;
   Swal.fire({
target: ".app",

    position: "top",

    icon: "success",

    title: editIndex !== null ? "更新しました！" : "追加しました！",
     width: 300,
    confirmButtonColor: "#6b3df5"

}).then(() => {

    location.href = "tasks.html";

});

}

function loadSubmit(){

    let list =
    document.getElementById("submitList");


    if(!list){
        return;
    }


    let submits =
    JSON.parse(localStorage.getItem("submits"))
    || [];
submits.sort((a,b)=>{

    return new Date(a.date) - new Date(b.date);

});





    list.innerHTML="";


    submits.forEach((item,index)=>{
let today = new Date();

today.setHours(0,0,0,0);

let target = new Date(item.date);

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

    remainText = "⚠️ 今日提出！";
    remainClass = "today";

}

else if(diff === 1){

    remainText = "⏰ 明日提出";
    remainClass = "tomorrow";

}

else{

    remainText = "あと" + diff + "日";
    remainClass = "";

}

        list.innerHTML += `
<div class="task-card">

<div class="task-title">
${item.title}
</div>

<div class="task-date">
📅 期限：${item.date}
</div>

<div class="task-remain ${remainClass}">
${remainText}
</div>
<div class="task-buttons">

<button class="edit-btn" onclick="editSubmit(${index})">
編集
</button>

<button class="done-btn" onclick="deleteSubmit(${index})">
提出済み
</button>

</div>
`;
    });

}



function deleteSubmit(index){

    let submits =
    JSON.parse(localStorage.getItem("submits"))
    || [];


    submits.splice(index,1);


    localStorage.setItem(
        "submits",
        JSON.stringify(submits)
    );


    loadSubmit();

}
function editSubmit(index){

    localStorage.setItem("editSubmitIndex", index);

    location.href = "add-submit.html";

}

window.onload=function(){

    if(document.getElementById("submitList")){

        loadSubmit();

    }

}

if(document.getElementById("date")){

    flatpickr("#date",{

        locale: flatpickr.l10ns.ja,

        dateFormat:"Y-m-d",

        disableMobile:true,

      position:"center"
 });


}

let submitSaved = false;


function backSubmit(){

    let title =
    document.getElementById("title").value;


    let date =
    document.getElementById("date").value;



    if(title != "" || date != ""){

        Swal.fire({

            target:".app",

            position:"top",

            icon:"warning",

            title:"保存されていません",

            text:"入力内容があります",

            width:280,

            confirmButtonColor:"#6b3df5"


    


        });


    }else{


        location.href="submit-menu.html";


    }


}

function cancelSubmit(){

    document.getElementById("title").value="";


    document.getElementById("date").value="";


    document.getElementById("cancelBtn").style.display="none";

}

function checkInput(){

    let title =
    document.getElementById("title").value;


    let date =
    document.getElementById("date").value;


    let cancel =
    document.getElementById("cancelBtn");


    if(title != "" || date != ""){

        cancel.style.display="block";

    }else{

        cancel.style.display="none";

    }

}
document.getElementById("title")
.addEventListener("input",checkInput);



document.getElementById("date")
.addEventListener("change",checkInput);




function cancelSubmit(){

    let title =
    document.getElementById("title").value;


    let date =
    document.getElementById("date").value;



    if(title != "" || date != ""){


        Swal.fire({

            target: ".app",

            position:"top",

            icon:"question",

            title:"入力内容を消しますか？",

            width:280,

            showCancelButton:true,

            confirmButtonText:"消す",

            cancelButtonText:"戻る",

            confirmButtonColor:"#6b3df5"


        }).then((result)=>{


            if(result.isConfirmed){


                document.getElementById("title").value="";


                document.getElementById("date").value="";


            }


        });


    }

}





// 入力した時に確認

document
.getElementById("title")
.addEventListener(
"input",
checkInput
);


document
.getElementById("date")
.addEventListener(
"input",
checkInput
);






function goHome(){

    location.href="index.html";

}

function cancelSubmit(){

    document.getElementById("title").value="";

    document.getElementById("date").value="";


    document.getElementById("cancelBtn").style.display="none";


    document.getElementById("homeBtn").style.display="block";

}



function checkInput(){

    let title =
    document.getElementById("title").value;


    let date =
    document.getElementById("date").value;


    let cancel =
    document.getElementById("cancelBtn");


    let home =
    document.getElementById("homeBtn");



    if(title != "" || date != ""){

        cancel.style.display="block";

        home.style.display="none";


    }else{

        cancel.style.display="none";

        home.style.display="block";

    }

}



document
.getElementById("title")
.addEventListener(
"input",
checkInput
);



document
.getElementById("date")
.addEventListener(
"change",
checkInput
);



function goHome(){

    location.href="index.html";

}

window.onload = function(){

    flatpickr("#date",{
        locale:"ja",
        dateFormat:"Y-m-d"
    });

    let index = localStorage.getItem("editSubmitIndex");

    if(index !== null){

        let submits =
        JSON.parse(localStorage.getItem("submits")) || [];

        document.getElementById("title").value =
        submits[index].title;

        document.getElementById("date").value =
        submits[index].date;

        document.querySelector(".save").textContent =
        "💾 更新";
        document.getElementById("homeBtn").textContent =
"🔙 一覧に戻る";


document.getElementById("homeBtn").onclick =
function(){

    location.href="tasks.html";

};
    }

}