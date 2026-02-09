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

  blockScoreMatrix: boolean[][] = new Array<boolean[]>(11);
  
  upperBlocks: boolean[] = new Array<boolean>(9).fill(false);
  lowerBlocks: boolean[] = new Array<boolean>(9).fill(false);
  blockWidth = 0; blockHeight = 40;

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

  constructor(private renderer : Renderer2) {}


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
    });
  }

  onMouseMove(event : MouseEvent) {
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
        if (this.ballSpeed<10) this.ballSpeed++;
        console.log("ball hit bottom");
        this.plusOne();
        setTimeout(()=> this.undoPlusOne(), 500);
        if(ball.left + ball.width < bar.left || ball.left + ball.width > bar.right) {
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
    }
    


    if(this.moveBallByY < 0) this.ballY += Math.max( this.moveBallByY, container.top - ball.top);
    else this.ballY += Math.min( this.moveBallByY, bar.top-ball.bottom);

    if(this.moveBallByX < 0) this.ballX += Math.max( this.moveBallByX, container.left - ball.left);
    else this.ballX += Math.min( this.moveBallByX, container.right - ball.right);
    this.translateBall = `translate( ${this.ballX}px, ${this.ballY}px)`;
    requestAnimationFrame(()=> this.animateBall());
  }

  hitsABlock() {
    return false;
  }

  plusOne() {
    //plus sign
    this.blockScoreMatrix[6][9] = true;
    this.blockScoreMatrix[6][10] = true;
    this.blockScoreMatrix[6][11] = true;

    this.blockScoreMatrix[5][10] = true;
    this.blockScoreMatrix[7][10] = true;

    //digit 1 sign
    this.blockScoreMatrix[2][14] = true;
    this.blockScoreMatrix[3][13] = true;
    
    this.blockScoreMatrix[2][15] = true;
    this.blockScoreMatrix[3][15] = true;
    this.blockScoreMatrix[4][15] = true;
    this.blockScoreMatrix[5][15] = true;
    this.blockScoreMatrix[6][15] = true;
    this.blockScoreMatrix[7][15] = true;
    this.blockScoreMatrix[8][15] = true;this.blockScoreMatrix[8][14] = true;this.blockScoreMatrix[8][16] = true;this.blockScoreMatrix[8][13] = true;this.blockScoreMatrix[8][17] = true;


    console.log(this.blockScoreMatrix);
  }

  undoPlusOne() {
    for(let i=0; i<this.blockScoreMatrix.length; i++) {
      this.blockScoreMatrix[i] = new Array<boolean>(35).fill(false);
    }
  }
}
