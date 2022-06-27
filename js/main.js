'use strict';
window.onload = () => {
    const enemy = document.getElementById("enemies");
    const player = document.getElementById("player");
    const commands = document.getElementById("textWindow");
    const btn = document.getElementsByClassName("btn");
    const attackBtn = document.getElementById("attack");
    let text = ["早く選んで",
        "この間一緒に居た女誰？",
        "何回クリックしたら気が済むの？",
        "私のこと好きなの？",
        "許さない"];
    class Enemy {
        constructor(name, hp = 10, mp = 10, atk = 10) {
            this.name = name;
            this.hp = hp;
            this.mp = mp;
            this.atk = atk;
        }
    }
    class Player {
        constructor(name, hp, mp, atk) {
            this.name = name;
            this.hp = hp;
            this.mp = mp;
            this.atk = atk;
        }
    }
    //味方追加
    let playerParty = [
        new Player("勇者", 100, 20, 30),
        new Player("遊び人", 100, 20, 30),
    ];
    addPartyMember(playerParty, player);
    //敵追加
    let enemyParty = [
        new Enemy("ゴブリン", 50, 10, 10),
        new Enemy("オーク", 100, 20, 20),
        new Enemy("デーモン", 80, 50, 40),
    ];
    addPartyMember(enemyParty);

    battleManager();
    //戦闘システム
    function battleManager() {
        //味方のターン
        attackBtn.addEventListener("click", (e) => {
            addSelectButton(enemyParty);
            //攻撃対象用
            let target = 0;
            for (let c of commands.children) {
                c.addEventListener("click", (e) => {
                    //攻撃対象決定
                    target = e.target.value;
                    //HPを減らす
                    enemyParty[target].hp -= playerParty[0].atk;

                    const character = enemy.getElementsByClassName("character");
                    //子要素全削除
                    while (enemy.lastChild) {
                        enemy.removeChild(enemy.lastChild);
                    }
                    //更新後のパーティ情報を再表示
                    addPartyMember(enemyParty);
                    while (commands.lastChild) {
                        commands.removeChild(commands.lastChild);
                    }
                    commands.textContent = "";
                });
            }
        });
        //敵のターン
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
            const button = document.createElement("button");
            button.value = i;
            button.textContent = `${party[i].name}`;
            commands.append(button);
        }
    }

    let index = 0;
    //テキスト送りのテスト用
    // commands.addEventListener("click", (c) => {
    //     let idx = index++ % text.length;
    //     c.target.textContent = text[idx];
    //     if (idx === text.length - 1) {
    //         c.target.style.color = "red";
    //         // setInterval(()=>{
    //         //     c.target.textContent+="許さない";
    //         // },30);
    //     } else {
    //         c.target.style.color = "black";
    //     }
    // });
};