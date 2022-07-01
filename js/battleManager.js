//キャラの攻撃順決定
function decideAttackTurn(playerParty, enemyParty) {
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
