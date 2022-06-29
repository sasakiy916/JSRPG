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