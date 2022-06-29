
function battleManager(playerParty, enemyParty, turnDom) {
    //攻撃順決定
    let dareka = 0;
    let turn = decideAttackTurn(playerParty, enemyParty);
    //キャラクターの初期座標
    let characterPos = [
        [0, 0],
        [1, 0],
        [2, 1],
        [4, 2],
        [0, 6],
        [3, 8],
    ];
    //キャラの位置を設定
    for (let i = 0; i < turn.length; i++) {
        turn[i].setPos(characterPos[i][1], characterPos[i][0]);
    }
    //キャラ画像読み込み,描画
    loadImages(turn);
    //キャラをキャンバスに描画
    // drawCharacter(turn);
    // ctx.drawImage("./images/knight.png", 0, 0, blockSize, blockSize);
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
        //グリッド線再描画
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
const decideAttackTurn = (playerParty, enemyParty) => {
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
};