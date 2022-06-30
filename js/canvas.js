'use strict';
const blockSize = 50;//1マスの大きさ
const boardRow = 5;//行
const boardCol = 10;//列
//キャンバス用意
const cvs = document.getElementById("cvs");//キャンバス読み込み
const ctx = cvs.getContext("2d");//コンテキスト用意
//キャンバスの大きさ設定
cvs.width = blockSize * boardCol;//幅
cvs.height = blockSize * boardRow;//高さ
let imgs = [];
const board = [];
for (let y = 0; y < boardRow; y++) {
    board[y] = [];
    for (let x = 0; x < boardCol; x++) {
        board[y][x] = 0;
    }
}
//キャラ画像読み込み
const loadImages = (turn) => {
    //画像パス用意
    for (let i = 0; i < turn.length; i++) {
        imgs.push(new Image());
        imgs[i].src = "./images/" + turn[i].img;
    }
    //画像読み込み
    for (let i = 0; i < turn.length; i++) {
        imgs[i].onload = () => {
            ctx.drawImage(imgs[i], turn[i].posX * blockSize, turn[i].posY * blockSize, blockSize, blockSize);
            board[turn[i].posY][turn[i].posX] = 1;
        };
    }
};
//グリッド線描画
const drawGrid = () => {
    ctx.strokeStyle = "black";//線の色
    for (let y = 0; y < boardRow; y++) {
        for (let x = 0; x < boardCol; x++) {
            let px = x * blockSize;
            let py = y * blockSize;
            //グリッド線表示
            ctx.strokeRect(px, py, blockSize, blockSize);
        }
    }
};