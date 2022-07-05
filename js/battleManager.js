//攻撃順
const turnDom = document.getElementById("turn");

//作成途中
function battleManagerKARI(player, enemy) {
  let turn = initBattle();
  let index = 0; //現在の手番index
  //初期化処理
  //行動決定
  //攻撃順更新
}
//作成途中
function initBattle() {
  //攻撃対象の選択ボタン作成
  //キャラの初期座標設定
  //キャラ画像読み込み
  //攻撃順決定
  let turn = decideAttackTurn(player, enemy);
  //攻撃順の表示
  return turn;
}
//作成途中
const showTurn = (index) => {
  if (turn[index] instanceof Player) {
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
  [turnPosX, turnPosY] = [turn[index].posX, turn[index].posY];
  for (let i = 0; i < turn.length; i++) {
    if (turn[i] instanceof Player) {
      span = "<span style='color:blue;'>";
    } else {
      span = "<span style='color:red;'>";
    }
    if (index === i) {
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
//キャラの攻撃順決定
function decideAttackTurn(playerParty, enemyParty) {
  let order = [];
  //配列に追加
  for (let p of playerParty) {
    order.push(p);
  }
  for (let e of enemyParty) {
    order.push(e);
  }
  //speedの高い順に入れ替え
  for (let i = 0; i < order.length - 1; i++) {
    for (let j = i + 1; j < order.length; j++) {
      if (order[i].speed < order[j].speed) {
        let temp = order[i];
        order[i] = order[j];
        order[j] = temp;
      }
    }
  }
  return order;
}
