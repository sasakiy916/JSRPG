window.onload=()=>{
    const enemy=document.getElementById("enemies");
    const eTable=document.getElementById("eTable");
    const player=document.getElementById("player");
    const pTable=document.getElementById("pTable");
    const commands=document.getElementById("textWindow");
    const btn = document.getElementsByClassName("btn");
    let text = ["早く選んで",
    "この間一緒に居た女誰？",
    "何回クリックしたら気が済むの？",
    "私のこと好きなの？",
    "許さない"];
    class Enemy{
        constructer(name,hp,mp,atk){
            this.name = name;
            this.hp = hp;
            this.mp = mp;
            this.atk = atk;
        }
        getName(){
            return this.hp;
        }
    }
    class Player{
        constructer(name,hp,mp,atk){
            this.name = name;
            this.hp = hp;
            this.mp = mp;
            this.atk = atk;
        }
    }
    let e1 = new Enemy("ああああ",1450,50);
    let character = document.createElement("div");
    character.classList.add("character");
    character.textContent("text");
    enemy.append(character);

    let index = 0;
    commands.addEventListener("click",(c)=>{
        console.log("click");
        idx = index++%text.length;
        c.target.textContent = text[idx];
        if(idx===text.length-1){
            c.target.style.color="red";
            // setInterval(()=>{
            //     c.target.textContent+="許さない";
            // },30);
        }else{
            c.target.style.color="black";
        }
    });

    const battleManager=(party1,party2)=>{
        btn[0].addEventListener("click",()=>{

        });
    }
};