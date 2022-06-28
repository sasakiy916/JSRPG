'use strict';
window.onload = () => {
    //キャンバス用意
    const blockSize = 50;
    const boardRow = 5;
    const boardCol = 10;
    const cvs = document.getElementById("cvs");
    const ctx = cvs.getContext("2d"); 
    const canvasW = blockSize * boardCol;
    const canvasH = blockSize * boardRow;
    cvs.width = canvasW;
    cvs.height = canvasH;
    const image = new Image();
    image.src = "./images/kaba1.jpg";
    let imgPosX = 0;
    let imgPosY = 3;
    const board = [];
    //描画処理 作成中
    const draw=()=>{
        ctx.strokeStyle="black";
        for(let y=0;y<boardRow;y++){
            for(let x=0;x<boardCol;x++){
                let px = x*blockSize;
                let py = y*blockSize;
                if(y===0){
                    ctx.strokeStyle="red";
                    ctx.strokeRect(px,py,blockSize,blockSize);
                }else{
                    ctx.strokeStyle="black";
                    ctx.strokeRect(px,py,blockSize,blockSize);
                }
                if(y===imgPosY&&imgPosX===x){
                    image.onload=()=>{
                        console.log("x:"+ x +" y:"+ y);
                        console.log(imgPosY);
                        ctx.drawImage(image,px,py,blockSize,blockSize);
                    };
                }
            }
        }
    };
    draw();

    const enemy = document.getElementById("enemies");
    const player = document.getElementById("player");
    const commands = document.getElementById("textWindow");
    const btn = document.getElementsByClassName("btn");
    const attackBtn = document.getElementById("attack");
    const turnDom = document.getElementById("turn");
    let text = ["早く選んで",
        "この間一緒に居た女誰？",
        "何回クリックしたら気が済むの？",
        "私のこと好きなの？",
        "許さない"];
    class Enemy {
        constructor(name, hp = 10, mp = 10, atk = 10,speed=10) {
            this.name = name;
            this.hp = hp;
            this.mp = mp;
            this.atk = atk;
            this.speed = speed;
        }
        attack=(enemy)=>{
            enemy.hp -= this.atk;
            if(enemy.hp < 0){
                enemy.hp = 0;
            }
        };
    }
    class Player {
        constructor(name, hp, mp, atk,speed=10) {
            this.name = name;
            this.hp = hp;
            this.mp = mp;
            this.atk = atk;
            this.speed = speed;
        }
        attack=(enemy)=>{
            enemy.hp -= this.atk;
            if(enemy.hp < 0){
                enemy.hp = 0;
            }
        };
    }
    //味方追加
    let playerParty = [
        new Player("勇者", 100, 20, 30,100),
        new Player("遊び人", 100, 20, 30,60),
    ];
    addPartyMember(playerParty, player);
    //敵追加
    let enemyParty = [
        new Enemy("ゴブリン", 50, 10, 30,30),
        new Enemy("オーク", 100, 20, 20),
        new Enemy("デーモン", 80, 50, 40,90),
    ];
    addPartyMember(enemyParty);

    battleManager();
    //戦闘システム
    function battleManager() {
        //攻撃順決定
        const decideAttackTurn=()=>{
            let junban = [];
            //配列に追加
            for(let p of playerParty){
                junban.push(p);
            }
            for(let e of enemyParty){
                junban.push(e);
            }
            //speedの高い順に入れ替え
            for(let i=0;i<junban.length-1;i++){
                for(let j=i+1;j<junban.length;j++){
                    if(junban[i].speed < junban[j].speed){
                        let temp = junban[i];
                        junban[i] = junban[j];
                        junban[j] = temp;
                    }
                }
            }
            return junban;
        }
        let dareka = 0;
        let turn = decideAttackTurn();
        const showTurn=(dareka)=>{
            turnDom.innerHTML=`〇攻撃順<br>`;
            let current = "";
            for(let i=0;i<turn.length;i++){
                if(dareka === i)current="←";
                turnDom.innerHTML+=`${i+1}.${turn[i].name}${current}<br>`;
                current="";
            }
        };
        showTurn(dareka);
        let party;
        let target;
        let targetDOM;
        //攻撃ボタン押した時
        attackBtn.addEventListener("click", (e) => {
            //テスト中
            if(turn[dareka] instanceof Player){
                party = playerParty;
                target = enemyParty;
                targetDOM = enemy;
            }else{
                party = enemyParty;
                target = playerParty;
                targetDOM = player;
            }
            //選択用のボタン追加
            addSelectButton(target);
            //攻撃対象用
            let index = 0;
            for (let c of commands.children) {
                c.addEventListener("click", (e) => {
                    //攻撃対象決定
                    index = e.target.value;
                    //攻撃(HPを減らす)
                    // party[target].hp -= playerParty[0].atk;
                    // playerParty[0].attack(party[target]);
                    turn[dareka++].attack(target[index]);
                    if(dareka >= turn.length)dareka=0;
                    const character = targetDOM.getElementsByClassName("character");
                    //子要素全削除
                    while (targetDOM.lastChild) {
                        targetDOM.removeChild(targetDOM.lastChild);
                    }
                    //更新後のパーティ情報を再表示
                    addPartyMember(target,targetDOM);
                    //選択ボタン削除
                    while (commands.lastChild) {
                        commands.removeChild(commands.lastChild);
                    }
                    commands.innerHTML = "行動選択";
                    showTurn(dareka);
                });
            }
        });//攻撃ボタンここまで
    }
    //キャラをパーティに追加
    function addPartyMember(member, party = enemy) {
        for (let m of member) {
            let div = document.createElement("div");
            div.classList.add("character");
            party.append(div);
            div.innerHTML = `名前:${m.name}<br>HP:${m.hp}<br>MP:${m.mp}`;
        }
    }
    //攻撃時の選択ボタン
    function addSelectButton(party) {
        //テキストを空にする
        commands.textContent = "";
        //選択肢のボタン追加
        for (let i = 0; i < party.length; i++) {
            //HPが残ってる場合
            if(party[i].hp > 0){
                const button = document.createElement("button");
                button.value = i;
                button.textContent = `${party[i].name}`;
                commands.append(button);
            }
        }
    }
};