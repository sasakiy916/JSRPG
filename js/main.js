"use strict";
window.onload = () => {
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
    posX = 0; //x座標
    posY = 0; //y座標
    hitDir = 2; //射程
    moveDir = 2; //移動距離
    status = "alive"; //生死判定（alive,dead）
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
  class Enemy extends Character {}
  class Player extends Character {}
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
    let target; //テスト中
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
    };
    let dareka = 0;
    let turn = decideAttackTurn();
    //キャラ画像読み込み
    loadImages(turn);
    //キャラの位置を設定
    for (let i = 0; i < turn.length; i++) {
      turn[i].setPos(characterPos[i][1], characterPos[i][0]);
    }
    //どのキャラの順番か表示
    let turnPosX;
    let turnPosY;
    const showTurn = (dareka) => {
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
        }</spna>${current}</div>`;
        current = "";
        turnDiv = "<div>";
      }
    };
    showTurn(dareka);
    //キーの入力(条件式は仮)
    document.onkeydown = (e) => {
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
      switch (e.keyCode) {
        case 37: //左
          if (
            tpx - 1 >= 0 &&
            tpx - 1 >= turnPosX - turn[dareka].moveDir &&
            board[tpy][tpx - 1] === 0
          ) {
            turn[dareka].posX--;
          }
          break;
        case 38: //上
          if (
            tpy - 1 >= 0 &&
            tpy - 1 >= turnPosY - turn[dareka].moveDir &&
            board[tpy - 1][tpx] === 0
          ) {
            turn[dareka].posY--;
          }
          break;
        case 39: //右
          if (
            tpx + 1 < boardCol &&
            tpx + 1 <= turnPosX + turn[dareka].moveDir &&
            board[tpy][tpx + 1] === 0
          ) {
            turn[dareka].posX++;
          }
          break;
        case 40: //下
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
      addSelectButton(target, turn[dareka], dareka);
    };
    let party;
    // let target;
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
      addSelectButton(target, turn[dareka], dareka);
      //攻撃対象用
      let index = 0;
      for (let c of commands.children) {
        c.addEventListener("click", (e) => {
          //攻撃対象決定
          index = e.target.value;
          //攻撃(HPを減らす)
          turn[dareka++].attack(target[index]);
          if (target[index].hp <= 0) target[index].status = "dead";
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
          //次ターンのキャラがやられてたら次のキャラへ
          while (turn[dareka].status === "dead") {
            if (dareka >= turn.length - 1) {
              dareka = 0;
            } else {
              dareka++;
            }
          }
          showTurn(dareka);
        });
      }
    }); //攻撃ボタンここまで
    const atkBtn = (e) => {
      //攻撃対象決定
      index = e.target.value;
      //攻撃(HPを減らす)
      turn[dareka++].attack(target[index]);
      if (target[index].hp <= 0) target[index].status = "dead";
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
  function addSelectButton(party, turn, dareka) {
    //テキストを空にする
    commands.textContent = "";
    console.log(turn.name);
    //選択肢のボタン追加
    for (let i = 0; i < party.length; i++) {
      //HPが残ってる場合
      console.log(party[i].name);
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
              board[y][x] === 1 &&
              party[i].posX === x &&
              party[i].posY === y
            ) {
              const button = document.createElement("button");
              button.value = i;
              button.textContent = `${party[i].name}`;
              commands.append(button);
            }
          }
        }
      }
    }
  }
};
