//クラス
class Character {
  posX = 0; //x座標
  posY = 0; //y座標
  hitDir = 4; //射程
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
      enemy.status = "dead";
    }
  };
  hitOK = (enemy) => {
    if (hitDir > Math.abs(enemy.posX - this.posX)) {
      return true;
    }
    return false;
  };
}
class Enemy extends Character { }
class Player extends Character { }
