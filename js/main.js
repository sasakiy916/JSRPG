"use strict";
window.onload = () => {
  const enemy = document.getElementById("enemies");
  const player = document.getElementById("player");
  const commands = document.getElementById("textWindow");
  //ボタン関連DOM
  const btn = document.getElementsByClassName("btn");
  const attackBtn = document.getElementById("attack");
  const itemBtn = document.getElementById("item");
  const magicBtn = document.getElementById("magic");
  const runBtn = document.getElementById("run");

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
  //グリッド線描画
  drawGrid();
  battleManager();

  //戦闘システム
  function battleManager() {
    let target; //テスト中 攻撃相手のパーティ
    let party; //テスト 攻撃番のパーティ
    let targetDOM; //テスト
    let dareka = 0;
    //攻撃順決定
    let turn = decideAttackTurn(playerParty, enemyParty);
    //キャラ画像読み込み
    loadImages(turn);
    //キャラの初期座標を設定
    for (let i = 0; i < turn.length; i++) {
      turn[i].setPos(characterPos[i][1], characterPos[i][0]);
    }
    //どのキャラの順番か表示
    let turnPosX;
    let turnPosY;
    const showTurn = (dareka) => {
      if (turn[dareka] instanceof Player) {
        party = playerParty;
        target = enemyParty;
        targetDOM = enemy;
      } else {
        party = enemyParty;
        target = playerParty;
        targetDOM = player;
      }
      turnDom.innerHTML = `〇攻撃順<br>`;
      let current = "";
      let turnDiv = "<div>";
      let span = "";
      //ターン開始時の座標保存
      [turnPosX, turnPosY] = [turn[dareka].posX, turn[dareka].posY];
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
        turnDom.innerHTML += `${turnDiv}${i + 1}.${span}${
          turn[i].name
        }</spna> ${current}</div>`;
        current = "";
        turnDiv = "<div>";
      }
    };
    showTurn(dareka);
    //キーの入力(条件式は仮)
    document.onkeydown = (e) => {
      //e.key,e.codeの内容確認
      // console.log(e.key);
      // console.log(e.code);

      //現在の座標取得
      let tpx = turn[dareka].posX;
      let tpy = turn[dareka].posY;
      //現在位置の描画削除
      let cpx = tpx * blockSize;
      let cpy = tpy * blockSize;
      ctx.clearRect(cpx, cpy, blockSize, blockSize);
      //グリッド線再描画
      ctx.strokeRect(cpx, cpy, blockSize, blockSize);
      // if (false) return;
      switch (e.key) {
        case "ArrowLeft": //左
          if (
            tpx - 1 >= 0 &&
            tpx - 1 >= turnPosX - turn[dareka].moveDir &&
            board[tpy][tpx - 1] === 0
          ) {
            turn[dareka].posX--;
          }
          break;
        case "ArrowUp": //上
          if (
            tpy - 1 >= 0 &&
            tpy - 1 >= turnPosY - turn[dareka].moveDir &&
            board[tpy - 1][tpx] === 0
          ) {
            turn[dareka].posY--;
          }
          break;
        case "ArrowRight": //右
          if (
            tpx + 1 < boardCol &&
            tpx + 1 <= turnPosX + turn[dareka].moveDir &&
            board[tpy][tpx + 1] === 0
          ) {
            turn[dareka].posX++;
          }
          break;
        case "ArrowDown": //下
          if (
            tpy + 1 < boardRow &&
            tpy + 1 <= turnPosY + turn[dareka].moveDir &&
            board[tpy + 1][tpx] === 0
          ) {
            turn[dareka].posY++;
          }
          break;
      }
      //ボード更新
      board[tpy][tpx] = 0;
      board[turn[dareka].posY][turn[dareka].posX] = 1;
      //移動後の座標に画像描画
      cpx = turn[dareka].posX * blockSize;
      cpy = turn[dareka].posY * blockSize;
      ctx.drawImage(imgs[dareka], cpx, cpy, blockSize, blockSize);
      console.log(target);
      addSelectButton(target, turn[dareka], dareka);
    };
    //攻撃ボタン押した時
    attackBtn.addEventListener("click", (e) => {
      //テスト中
      //選択用のボタン追加
      addSelectButton(target, turn[dareka], dareka);
      //攻撃対象用
      let index = 0;
      for (let c of commands.children) {
        c.addEventListener("click", atkBtn(e));
      }
    }); //攻撃ボタンここまで
    const atkBtn = (e) => {
      //攻撃対象決定
      index = e.target.value;
      //攻撃(HPを減らす)
      turn[dareka++].attack(target[index]);
      // if (target[index].hp <= 0) target[index].status = "dead";
      if (dareka >= turn.length) dareka = 0;
      // const character = targetDOM.getElementsByClassName("character");
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
      //次ターンのキャラがやられてたら次のキャラへ
      while (turn[dareka].status === "dead") {
        if (dareka >= turn.length - 1) {
          dareka = 0;
        } else {
          dareka++;
        }
      }
      showTurn(dareka);
    };
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
      //div用意
      let div = document.createElement("div");
      div.classList.add("character");
      //キャラ画像用意
      let divImg = document.createElement("div");
      divImg.style.marginRight = "10px";
      let img = document.createElement("img");
      img.src = "./images/" + m.img;
      img.style.width = "100px";
      img.style.height = "100px";
      divImg.append(img);
      //パーティ表示に追加
      party.append(divImg);
      party.append(div);
      //キャラのステータス表示
      div.innerHTML = `名前:${m.name}<br>HP:${m.hp}<br>MP:${m.mp}`;
    }
  }
  //攻撃時の選択ボタン
  function addSelectButton(party, turn, dareka) {
    console.log(board);
    console.log(party);
    //テキストを空にする
    commands.textContent = "";
    //選択肢のボタン追加
    for (let i = 0; i < party.length; i++) {
      //HPが残ってる場合
      if (party[i].hp > 0) {
        console.log(turn.name);
        for (
          let y = turn.posY - turn.hitDir;
          y <= turn.posY + turn.hitDir;
          y++
        ) {
          for (
            let x = turn.posX - turn.hitDir;
            x <= turn.posX + turn.hitDir;
            x++
          ) {
            if (
              x >= 0 &&
              y >= 0 &&
              party[i].posX === x &&
              party[i].posY === y &&
              board[y][x] === 1
            ) {
              const button = document.createElement("button");
              button.value = i;
              button.textContent = `${party[i].name}`;
              // button.addEventListener("click", atkBtn(e));
              commands.append(button);
            }
          }
        }
      }
    }
  } //addSelectButton ここまで
};
