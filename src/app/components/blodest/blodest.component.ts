import { Component, ElementRef, Input, Renderer2, ViewChild } from '@angular/core';
import { OpenInstance } from '../../models/OpenInstance';
import { NgIf, NgFor, NgStyle } from '@angular/common';

@Component({
  selector: 'app-blodest',
  imports: [NgIf, NgFor, NgStyle],
  templateUrl: './blodest.component.html',
  styleUrl: './blodest.component.scss'
})
export class BlodestComponent{
  @Input() instanceData!: OpenInstance;
  @ViewChild("gameBall", { static: false }) gameBall !: ElementRef;
  @ViewChild("gameContainer", {static: false}) gameContainer !: ElementRef;
  @ViewChild("playingBar", {static: false}) playingBar !: ElementRef;

  blockScoreMatrix: boolean[][] = new Array<boolean[]>(15);
  
  upperBlocks: boolean[] = new Array<boolean>(9).fill(false);
  lowerBlocks: boolean[] = new Array<boolean>(9).fill(false);
  blockWidth = 0; blockHeight = 40;

  upperBlocksPos !: number[][];
  lowerBlocksPos !: number[][];

  gameStarted : boolean = false;
  gameOver : boolean = false;

  currentScore : number = 0;
  maxScore : number = 0;

  translateX : string = "";
  translateBall : string = "";
  ballSpeed = 2;
  ballX = 0;
  ballY = 0;
  moveBallByX = 0;
  moveBallByY = this.ballSpeed;
  yDistance = 0;
  xDistance = 0;
  barSpeed : number = 0;

  constructor(private renderer : Renderer2, private el : ElementRef) {}


  startGame() {
    this.undoPlusOne();
    this.gameStarted = true;
    
    requestAnimationFrame(()=>{
      this.yDistance = this.gameContainer.nativeElement.getBoundingClientRect().height - this.playingBar.nativeElement.getBoundingClientRect().height - this.gameBall.nativeElement.getBoundingClientRect().height;
      this.xDistance = this.gameContainer.nativeElement.getBoundingClientRect().width - this.gameBall.nativeElement.getBoundingClientRect().width;
      this.blockWidth = Math.floor(this.gameContainer.nativeElement.getBoundingClientRect().width/5) - 5;
      this.renderer.setStyle(this.gameBall.nativeElement, 'top', Math.floor(this.yDistance/2)+'px');
      this.renderer.setStyle(this.gameBall.nativeElement, 'left', Math.floor(this.xDistance/2)+'px');
      this.animateBall();

      setTimeout(() => {this.setBlocksPositionsMatrix()}, 400);
    });
  }

  setBlocksPositionsMatrix() {
    const containerRect = this.gameContainer.nativeElement.getBoundingClientRect();
    this.upperBlocksPos = [];
    this.lowerBlocksPos = [];
    
    let i =0;
    this.el.nativeElement.querySelectorAll(".block").forEach((item : HTMLDivElement) => {
      const blockRect = item.getBoundingClientRect();
      if(i<9) this.upperBlocksPos.push([blockRect.left- containerRect.left, blockRect.top - containerRect.top]);
      else this.lowerBlocksPos.push([blockRect.left- containerRect.left, blockRect.top - containerRect.top]);
      i++;
    });

    
  }

  async onMouseMove(event : MouseEvent) {
    if(!this.gameOver && this.gameStarted) {
      const rect = this.gameContainer.nativeElement.getBoundingClientRect();
      this.barSpeed = (event.clientX - this.playingBar.nativeElement.getBoundingClientRect().left - this.playingBar.nativeElement.getBoundingClientRect().width/2 - this.gameBall.nativeElement.getBoundingClientRect().width/2) / rect.width;
      this.translateX = `translateX(${event.clientX - rect.left - rect.width*0.1}px)`;
    }
  }

  animateBall() {
    const ball = this.gameBall.nativeElement.getBoundingClientRect();
    const container = this.gameContainer.nativeElement.getBoundingClientRect();
    const bar = this.playingBar.nativeElement.getBoundingClientRect();

    if(!this.hitsABlock()) {
        if(ball.top == container.top) {
        this.moveBallByY = this.ballSpeed;
      } else if (ball.bottom == bar.top) {
        console.log("ball hit bottom");
        if(ball.right < bar.left || ball.left > bar.right) {
          this.gameOver = true;
          return;
        }
        if(this.barSpeed < 0) this.moveBallByX = -this.ballSpeed;
        else if (this.barSpeed > 0) this.moveBallByX = this.ballSpeed;
        this.moveBallByY = -this.ballSpeed;
      }


      if(ball.left == container.left) {
        this.moveBallByX = this.ballSpeed;
      } else if (ball.right == container.right) {
        this.moveBallByX = -this.ballSpeed;
      }
    } else {
      console.log("ball hit a block");
      this.plusOne();
      setTimeout(()=> this.undoPlusOne(), 500);
    }
    


    if(this.moveBallByY < 0) this.ballY += Math.max( this.moveBallByY, container.top - ball.top);
    else this.ballY += Math.min( this.moveBallByY, bar.top-ball.bottom);

    if(this.moveBallByX < 0) this.ballX += Math.max( this.moveBallByX, container.left - ball.left);
    else this.ballX += Math.min( this.moveBallByX, container.right - ball.right);
    this.translateBall = `translate( ${this.ballX}px, ${this.ballY}px)`;
    requestAnimationFrame(()=> this.animateBall());
  }

  hitsABlock() {
    if(!this.upperBlocksPos || !this.lowerBlocksPos) return false;
    const ballRect = this.gameBall.nativeElement.getBoundingClientRect();
    const containerRect = this.gameContainer.nativeElement.getBoundingClientRect();
    
    const ballLeft = ballRect.left - containerRect.left;
    const ballRight = ballRect.right - containerRect.left;

    const ballTop = ballRect.top - containerRect.top;
    const ballBottom = ballRect.bottom - containerRect.top;
    
    let i =0;

    for(let blockPos of this.lowerBlocksPos) {
      if(this.lowerBlocks[i]) {
        i++;
        continue;
      }
      const left = blockPos[0];
      const top = blockPos[1];
      const right = left + this.blockWidth;
      const bottom = top + this.blockHeight;

      // top and bottom sides collisions
      if(left <= ballRight && ballLeft <= right) {
        // top side collision
        if (ballTop < top && ballBottom >= top) {
          this.lowerBlocks[i]=true;
          this.moveBallByY = -this.ballSpeed;
          return true;
        }
        // bottom side collision
        if (ballBottom > bottom && ballTop <= bottom) {
          this.lowerBlocks[i]=true;
          this.moveBallByY = this.ballSpeed;
          return true;
        }
      }
      // left and right sides collisions
      if(ballBottom >= top && ballTop <= bottom) {
        //left side collision
        if(ballLeft < left && ballRight >= left) {
          this.lowerBlocks[i]=true;
          this.moveBallByX = -this.ballSpeed;
          return true;
        }
        //right side collision
        if(ballRight > right && ballLeft <= right) {
          this.lowerBlocks[i]=true;
          this.moveBallByX = this.ballSpeed;
          return true;
        }
      }
      i++;
    }

    i=0;
    for(let blockPos of this.upperBlocksPos) {
      if(this.upperBlocks[i]) {
        i++;
        continue;
      }
      const left = blockPos[0];
      const top = blockPos[1];
      const right = left + this.blockWidth;
      const bottom = top + this.blockHeight;

      // top and bottom sides collisions
      if(left <= ballRight && ballLeft <= right) {
        // top side collision
        if (ballTop < top && ballBottom >= top) {
          this.upperBlocks[i]=true;
          this.moveBallByY = -this.ballSpeed;
          return true;
        }
        // bottom side collision
        if (ballBottom > bottom && ballTop <= bottom) {
          this.upperBlocks[i]=true;
          this.moveBallByY = this.ballSpeed;
          return true;
        }
      }

      // left and right sides collisions
      if(ballBottom >= top && ballTop <= bottom) {
        //left side collision
        if(ballLeft < left && ballRight >= left) {
          this.upperBlocks[i]=true;
          this.moveBallByX = -this.ballSpeed;
          return true;
        }
        //right side collision
        if(ballRight > right && ballLeft <= right) {
          this.upperBlocks[i]=true;
          this.moveBallByX = this.ballSpeed;
          return true;
        }
      }
      i++;
    }
    
    
    return false;
  }

  plusOne() {
    //plus sign
    this.blockScoreMatrix[7][9] = true;
    this.blockScoreMatrix[7][10] = true;
    this.blockScoreMatrix[7][11] = true;

    this.blockScoreMatrix[6][10] = true;
    this.blockScoreMatrix[8][10] = true;

    //digit 1 sign
    this.blockScoreMatrix[4][14] = true;
    
    this.blockScoreMatrix[3][15] = true;
    this.blockScoreMatrix[4][15] = true;
    this.blockScoreMatrix[5][15] = true;
    this.blockScoreMatrix[6][15] = true;
    this.blockScoreMatrix[7][15] = true;
    this.blockScoreMatrix[8][15] = true;
    this.blockScoreMatrix[9][15] = true;
    this.blockScoreMatrix[10][15] = true;
    this.blockScoreMatrix[11][15] = true;this.blockScoreMatrix[11][14] = true;this.blockScoreMatrix[11][16] = true;

    for(let i =2; i<=12; i++) {
      for (let j=8; j<=17; j++) {
        this.blockScoreMatrix[i][j] = !this.blockScoreMatrix[i][j];
      }
    }
    this.currentScore++;
  }

  undoPlusOne() {
    for(let i=0; i<this.blockScoreMatrix.length; i++) {
      this.blockScoreMatrix[i] = new Array<boolean>(35).fill(false);
    }
  }
}
