// set canvas
const canvas = document.createElement('canvas');
document.body.appendChild(canvas);
const ctx = canvas.getContext('2d');

//get score elements from the DOM
const playerScore = document.getElementById('playerScore');
const computerScore = document.getElementById('computerScore');

// use the full user screen
const width = window.innerWidth;
const height = window.innerHeight;
canvas.width = width;
canvas.height = height;
canvas.style.backgroundColor = '#000';

// listening to the keyboard
const isKeyPressed = [];
window.addEventListener('keydown',(event) => {
    isKeyPressed[event.keyCode] = true;
})
window.addEventListener('keyup',(e) => {
    isKeyPressed[event.keyCode] = false;
})

// returns object coordination X and Y
function vec2 (x, y) {
  return {
    X: x,
    Y:y
  }
}

// function that create the ball object
function Ball(position, radius, velocity) {
  this.X = position.X,
  this.Y = position.Y,
  this.radius = radius,
  this.velocityX = velocity.X,
  this.velocityY = velocity.Y,
  this.update = () => {
    this.X += this.velocityX;
    this.Y += this.velocityY;
}
  this.draw = () => {
    ctx.fillStyle = 'rgb(145, 255, 0)'
    ctx.beginPath();
    ctx.arc(this.X, this.Y, radius, 0, 2*Math.PI);
    ctx.fill();
  }
}

// function that create paddle object
function Paddle(position, dimension, velocityY) {
    this.X = position.X,
    this.Y = position.Y,
    this.width = dimension.X,
    this.height = dimension.Y,
    this.velocityY = velocityY,
    this.score = 0,
    this.update = () => {
        if (isKeyPressed[38]) {
            this.Y -= this.velocityY;
        } else if (isKeyPressed[40]) {
            this.Y += this.velocityY;
        }
      }
    this.draw = () => {
      ctx.fillStyle = '#fff'
      ctx.fillRect(this.X, this.Y, this.width, this.height)
    }
}

// the player paddle (paddle1)
const paddle1 = new Paddle(vec2(10, 100), vec2(10, 100), 7);

//the computer paddle (paddle2)
const paddle2 = new Paddle(vec2(width-20, 100), vec2(10, 100), 6);

// the ball object
const ball = new Ball(vec2(100,100), 20, vec2(15,15));

// ball collision with edges
function ballCollisionWithEdges (ball) {
    if (ball.Y+ball.radius >= height || ball.Y-ball.radius <= 0) {
        ball.velocityY *= -1;
    }
}

// paddles collision With Edgies
function paddleCollisionWithEdgies (paddle) {
    if(paddle.Y <= 0) {
        paddle.Y = 0;
    }else if(paddle.Y+paddle.height >= height) {
        paddle.Y = height-paddle.height;
    }
}

// ball collision with paddle
function ballCollisionWithPaddle (ball,paddle) {
  if(paddle === paddle1){
    if((ball.X-ball.radius <= paddle.X+paddle.width) 
        && (ball.Y+ball.radius >= paddle.Y) 
        && (ball.Y-ball.radius <= paddle.Y+paddle.height)) {
          ball.velocityX *= -1;
    }
  }else if(paddle === paddle2) {
    if((ball.X+ball.radius >= paddle.X) 
        && (ball.Y+ball.radius >= paddle.Y) 
        && (ball.Y-ball.radius <= paddle.Y+paddle.height)) {
      ball.velocityX *= -1;
      if((ball.Y <= paddle.Y+paddle.height/3) || (ball.Y >= paddle.Y+paddle.height/3)){
        ball.velocityY += 2
      } else {
        ball.velocityY -= 2
        ;
      }
    }
  }
}

// score and reset;
function handleScore () {
  if(ball.X+ball.radius <= 0) {
    ball.X = width/2;
    ball.Y = height/2;
    ball.velocityX = Math.abs(ball.velocityX);
    ball.velocityY = 4;
    paddle2.score++;
    computerScore.textContent = paddle2.score;
  } else if(ball.X+ball.radius >= width) {
    ball.X = width/2;
    ball.Y = height/2;
    ball.velocityX = Math.abs(ball.velocityX);
    ball.velocityY = 4;
    paddle1.score++; 
    playerScore.textContent = paddle1.score;
  }
}

// draw the center
function center () {
  ctx.strokeStyle = 'white';
  ctx.beginPath();
  ctx.setLineDash([5, 15]);
  ctx.moveTo(width/2, 0);
  ctx.lineTo(width/2, height);
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(width/2, height/2, 50, 0, 2*Math.PI);
  ctx.stroke();
}

//computer playing rules
function computerPlay () {
  if((ball.velocityX > 0) 
     && (paddle2.Y+paddle2.height <= height)
     && (paddle2.Y >= 0)) {
      // if the ball is going up (ball.velocityY<0)
    if((ball.velocityY<0) && (ball.Y<=paddle2.Y+paddle2.height/2)) {
            paddle2.Y -= paddle2.velocityY;
    } // if the ball is going down (ball.velocityY>0)
    else if((ball.velocityY>0) && (ball.Y>=paddle2.Y+paddle2.height)) {
      paddle2.Y += paddle2.velocityY;
    }
  }
}

// updating the game 
function gameUpdate () {
    ball.update();
    paddle1.update();
    computerPlay();
    ballCollisionWithEdges(ball);
    paddleCollisionWithEdgies(paddle1);
    paddleCollisionWithEdgies(paddle2);
    ballCollisionWithPaddle(ball,paddle1);
    ballCollisionWithPaddle(ball,paddle2);
    handleScore();
}

// draw updating changes 
function gameDraw() {
   ball.draw();
   paddle1.draw();
   paddle2.draw();
   center();
}

//looping 60 times every second
function gameLoop () {
    requestAnimationFrame(gameLoop);
    ctx.fillStyle= 'rgba(0, 0, 0, 0.45)'
     ctx.fillRect(0, 0, width, height);
    gameUpdate();
    gameDraw();
};
requestAnimationFrame(gameLoop);


