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
    let imgs = [];
    const board = [];
    //描画処理 作成中
    const draw = () => {
        ctx.strokeStyle = "black";
        for (let y = 0; y < boardRow; y++) {
            for (let x = 0; x < boardCol; x++) {
                let px = x * blockSize;
                let py = y * blockSize;
                //グリッド線表示
                ctx.strokeRect(px, py, blockSize, blockSize);
            }
        }
    };
    //キャラ画像描画
    const drawCharacter = (turn) => {
        for (let y = 0; y < boardRow; y++) {
            for (let x = 0; x < boardCol; x++) {
                let px = x * blockSize;
                let py = y * blockSize;
                //画像表示
                for (let i = 0; i < turn.length; i++) {
                    if (y === turn[i].posY && turn[i].posX === x) {
                        imgs[i].onload = () => {
                            ctx.drawImage(imgs[i], px, py, blockSize, blockSize);
                        };
                    }
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
    const itemBtn = document.getElementById("item");
    const magicBtn = document.getElementById("magic");
    const runBtn = document.getElementById("run");
    const turnDom = document.getElementById("turn");

    //クラス
    class Character {
        posX = 0;//x座標
        posY = 0;//y座標
        hitDir = 4;//射程
        constructor(name, img, hp = 10, mp = 10, atk = 10, speed = 10) {
            this.name = name;
            this.img = img;
            this.hp = hp;
            this.mp = mp;
            this.atk = atk;
            this.speed = speed;
        }

        setPos = (x, y) => {
            this.posX = x;
            this.posY = y;
        };
        attack = (enemy) => {
            enemy.hp -= this.atk;
            if (enemy.hp < 0) {
                enemy.hp = 0;
            }
        };
        hitOK = (enemy) => {
            if (hitDir > Math.abs(enemy.posX - this.posX)) {
                return true;
            }
            return false;
        };
    }
    class Enemy extends Character {
    }
    class Player extends Character {
    }
    //味方追加
    let playerParty = [
        new Player("騎士", "knight.png", 100, 20, 30, 100),
        new Player("アリア", "girl1.png", 100, 20, 30, 60),
        new Player("ハゲ王", "hage.png", 100, 20, 30, 60),
    ];
    addPartyMember(playerParty, player);
    //敵追加
    let enemyParty = [
        new Enemy("ゴブリン", "goblin.png", 50, 10, 30, 30),
        new Enemy("コボルド", "kobold.png", 100, 20, 20),
        new Enemy("ゴーレム", "golem.png", 150, 50, 40, 90),
    ];
    addPartyMember(enemyParty);

    //キャラクターの初期座標
    let characterPos = [
        [0, 0],
        [1, 0],
        [2, 1],
        [4, 2],
        [0, 6],
        [3, 8],
    ];
    battleManager();

    //戦闘システム
    function battleManager() {
        //攻撃順決定
        const decideAttackTurn = () => {
            let junban = [];
            //配列に追加
            for (let p of playerParty) {
                junban.push(p);
            }
            for (let e of enemyParty) {
                junban.push(e);
            }
            //speedの高い順に入れ替え
            for (let i = 0; i < junban.length - 1; i++) {
                for (let j = i + 1; j < junban.length; j++) {
                    if (junban[i].speed < junban[j].speed) {
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
        for (let i = 0; i < turn.length; i++) {
            turn[i].setPos(characterPos[i][1], characterPos[i][0]);
        }
        for (let i = 0; i < turn.length; i++) {
            //画像用意
            imgs.push(new Image());
            imgs[i].src = "./images/" + turn[i].img;
        }
        //キャラをキャンバスに描画
        drawCharacter(turn);
        //どのキャラの順番か表示
        const showTurn = (dareka) => {
            turnDom.innerHTML = `〇攻撃順<br>`;
            let current = "";
            let turnDiv = "<div>";
            let span = "";
            for (let i = 0; i < turn.length; i++) {
                if (turn[i] instanceof Player) {
                    span = "<span style='color:blue;'>";
                } else {
                    span = "<span style='color:red;'>";
                }
                if (dareka === i) {
                    current = "←";
                    turnDiv = "<div style='border:2px solid red;'>";
                }
                turnDom.innerHTML += `${turnDiv}${i + 1}.${span}${turn[i].name}</spna>${current}</div>`;
                current = "";
                turnDiv = "<div>";
            }
        };
        showTurn(dareka);
        //キーの入力(条件式は仮)
        document.onkeydown = (e) => {
            let cpx = turn[dareka].posX * blockSize;
            let cpy = turn[dareka].posY * blockSize;
            ctx.clearRect(cpx, cpy, blockSize, blockSize);
            ctx.strokeStyle = "black";
            ctx.strokeRect(cpx, cpy, blockSize, blockSize);
            // if (false) return;
            switch (e.keyCode) {
                case 37://左
                    if (turn[dareka].posX - 1 >= 0) turn[dareka].posX--;
                    break;
                case 38://上
                    if (turn[dareka].posY - 1 >= 0) turn[dareka].posY--;
                    break;
                case 39://右
                    if (turn[dareka].posX + 1 < boardCol) turn[dareka].posX++;
                    break;
                case 40://下
                    if (turn[dareka].posY + 1 < boardRow) turn[dareka].posY++;
                    break;
            }
            cpx = turn[dareka].posX * blockSize;
            cpy = turn[dareka].posY * blockSize;
            ctx.drawImage(imgs[dareka], cpx, cpy, blockSize, blockSize);
        };
        let party;
        let target;
        let targetDOM;
        //攻撃ボタン押した時
        attackBtn.addEventListener("click", (e) => {
            //テスト中
            if (turn[dareka] instanceof Player) {
                party = playerParty;
                target = enemyParty;
                targetDOM = enemy;
            } else {
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
                    if (dareka >= turn.length) dareka = 0;
                    const character = targetDOM.getElementsByClassName("character");
                    //子要素全削除
                    while (targetDOM.lastChild) {
                        targetDOM.removeChild(targetDOM.lastChild);
                    }
                    //更新後のパーティ情報を再表示
                    addPartyMember(target, targetDOM);
                    //選択ボタン削除
                    while (commands.lastChild) {
                        commands.removeChild(commands.lastChild);
                    }
                    commands.innerHTML = "行動選択";
                    showTurn(dareka);
                });
            }
        });//攻撃ボタンここまで
        //itemボタン
        itemBtn.addEventListener("click", () => {
            textWindow.innerHTML = "そんなモノは無い!";
        });
        //magicボタン
        magicBtn.addEventListener("click", () => {
            textWindow.innerHTML = "魔法なんて無かった";
        });
        //runボタン
        runBtn.addEventListener("click", () => {
            textWindow.innerHTML = "逃がさねえよ？";
        });
    }
    //キャラをパーティに追加
    function addPartyMember(member, party = enemy) {
        for (let m of member) {
            let div = document.createElement("div");
            div.classList.add("character");
            let divImg = document.createElement("div");
            divImg.style.marginRight = "10px";
            let img = document.createElement("img");
            img.src = "./images/" + m.img;
            img.style.width = "100px";
            img.style.height = "100px";
            divImg.append(img);
            party.append(divImg);
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
            if (party[i].hp > 0) {
                const button = document.createElement("button");
                button.value = i;
                button.textContent = `${party[i].name}`;
                commands.append(button);
            }
        }
    }
};