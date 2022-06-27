'use strict';
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
        constructor(name,hp=10,mp=10,atk=10){
            this.name = name;
            this.hp = hp;
            this.mp = mp;
            this.atk = atk;
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
    //敵追加
    let e1 = new Enemy("name");
    console.log(e1);
    let mob = document.createElement("div");
    mob.classList.add("character");
    // character.textContent("text");
    enemy.append(mob);
    mob.innerHTML = `名前:${e1.name}<br>HP:${e1.hp}`;

    let index = 0;
    commands.addEventListener("click",(c)=>{
        let idx = index++%text.length;
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
    };
};