'use strict';
//html要素の取得
const startButton = document.getElementById("start-button");
const result = document.getElementById("result");
const message = document.getElementById("message");
const back = document.getElementById("back");
//canvas要素の取得
const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");
//描画のための変数定義
let ballRadius = 5;
let x = canvas.width/2;
let y = canvas.height-30;
let dx = 4;
let dy = -4;
let paddleHeight = 10;
let paddleWidth = 80;
let paddleX = (canvas.width-paddleWidth)/2;
let rightPressed = false;
let leftPressed = false;
let brickRowCount = 8;
let brickColumnCount = 3;
let brickWidth = 90;
let brickHeight = 7.5;
let brickPadding = 10;
let brickOffsetTop = 50;
let brickOffsetLeft = 50;
let score = 0;
let lives = 3;
let clear = null;
function reset() {
  message.innerText = "　";
  result.innerText= "　";
}

//スタートボタンが押されるまで待機
startButton.onclick = () => {
  //スタートボタンを非表示化
  reset();
  startButton.style.display = 'none';

  //ブロックの描画
  let bricks = [];
  for(let c=0; c<brickColumnCount; c++) {
    bricks[c] = [];
    for(let r=0; r<brickRowCount; r++) {
      bricks[c][r] = { x: 0, y: 0, status: 1 };
    }
  }

  document.addEventListener("keydown", keyDownHandler, false);
  document.addEventListener("keyup", keyUpHandler, false);
  document.addEventListener("mousemove", mouseMoveHandler, false);

  //キーボードでの移動用関数
  function keyDownHandler(e) {
      if(e.key == "Right" || e.key == "ArrowRight") {
          rightPressed = true;
      } else if(e.key == "Left" || e.key == "ArrowLeft") {
          leftPressed = true;
      }
  }
  
  function keyUpHandler(e) {
      if(e.key == "Right" || e.key == "ArrowRight") {
          rightPressed = false;
      } else if(e.key == "Left" || e.key == "ArrowLeft") {
          leftPressed = false;
      }
  }

  //マウスでの移動用関数
  function mouseMoveHandler(e) {
    let relativeX = e.clientX - canvas.offsetLeft;
    if(relativeX > 0 && relativeX < canvas.width) {
      paddleX = relativeX - paddleWidth/2;
    }
  }

  //ブロック破壊判定
  function collisionDetection() {
    for(let c=0; c<brickColumnCount; c++) {
      for(let r=0; r<brickRowCount; r++) {
        let b = bricks[c][r];
        if(b.status == 1) {
          if(x > b.x && x < b.x+brickWidth && y > b.y && y < b.y+brickHeight) {
            //スコア追加・跳ね返り処理
            dy = -dy + (score / 15);
            b.status = 0;
            score++;
            if(score == brickRowCount*brickColumnCount) {
              //ゲームクリア
              clear = "clear";
              
            }
          }
        }
      }
    }
  }
  
  //ボールの描画
  function drawBall() {
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI*2);
    ctx.fillStyle = "#8ab";
    ctx.fill();
    ctx.closePath();
  }

  //パドルの描画
  function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height-paddleHeight, paddleWidth, paddleHeight);
    ctx.fillStyle = "#8ab";
    ctx.fill();
    ctx.closePath();
  }

  //ブロックの描画
  function drawBricks() {
    for(let c=0; c<brickColumnCount; c++) {
      for(let r=0; r<brickRowCount; r++) {
        if(bricks[c][r].status == 1) {
          let brickX = (r*(brickWidth+brickPadding))+brickOffsetLeft;
          let brickY = (c*(brickHeight+brickPadding))+brickOffsetTop;
          bricks[c][r].x = brickX;
          bricks[c][r].y = brickY;
          ctx.beginPath();
          ctx.rect(brickX, brickY, brickWidth, brickHeight);
          ctx.fillStyle = "#8ab";
          ctx.fill();
          ctx.closePath();
        }
      }
    }
  }

  //スコア・ライフの描画
  function drawScore() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#8ab";
    ctx.fillText("Score: "+score, 8, 20);
  }
  function drawLives() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#8ab";
    ctx.fillText("Lives: "+lives, canvas.width-65, 20);
  }
  
  //描画
  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBricks();
    drawBall();
    drawPaddle();
    drawScore();
    drawLives();
    collisionDetection();
    if(clear === "clear") {
      back.style.display = 'block';
      message.innerText = "GAME CLEAR! CONGRATULATS!"
      return result.innerText = "Your score: " + score + " Your lives: " + lives;
    }
    
  
    if(x + dx > canvas.width-ballRadius || x + dx < ballRadius) {
      dx = -dx + (score / 15);
    }
    if(y + dy < ballRadius) {
      dy = -dy + (score / 15);
    } else if(y + dy > canvas.height-ballRadius) {
      if(x > paddleX && x < paddleX + paddleWidth) {
        dy = -dy;
      } else {
        lives--;
        if(!lives) {
          //ゲームオーバー
          message.innerText = "GAME OVER! Try again!";
          back.style.display = 'block';
          return result.innerText = "Your score: " + score + " Your lives: " + lives;
        } else {
          //ライフ減少時の処理
          message.innerText = "Miss!";
          setTimeout(reset , 1000);
          x = canvas.width/2;
          y = canvas.height-30;
          dx = 3.5 + score / 15;
          dy = -3.5 - score / 15;
          paddleX = (canvas.width-paddleWidth)/2;
        }
      }
    }

    //移動
    if(rightPressed && paddleX < canvas.width-paddleWidth) {
      paddleX += 12 - score / 2;
    } else if(leftPressed && paddleX > 0) {
      paddleX -= 12 - score / 2;
    }
  
    x += dx;
    y += dy;
    requestAnimationFrame(draw);
  }


  //実行
  draw();
}
