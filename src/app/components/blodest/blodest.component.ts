import { Component, ElementRef, Input, Renderer2, ViewChild } from '@angular/core';
import { OpenInstance } from '../../models/OpenInstance';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-blodest',
  imports: [NgIf],
  templateUrl: './blodest.component.html',
  styleUrl: './blodest.component.scss'
})
export class BlodestComponent{
  @Input() instanceData!: OpenInstance;
  @ViewChild("gameBall", { static: false }) gameBall !: ElementRef;
  @ViewChild("gameContainer", {static: false}) gameContainer !: ElementRef;
  @ViewChild("playingBar", {static: false}) playingBar !: ElementRef;


  gameStarted : boolean = false;
  gameOver : boolean = false;

  currentScore : number = 1234;
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
    this.gameStarted = true;
    
    requestAnimationFrame(()=>{
      this.yDistance = this.gameContainer.nativeElement.getBoundingClientRect().height - this.playingBar.nativeElement.getBoundingClientRect().height - this.gameBall.nativeElement.getBoundingClientRect().height;
      this.xDistance = this.gameContainer.nativeElement.getBoundingClientRect().width - this.gameBall.nativeElement.getBoundingClientRect().width;
      this.renderer.setStyle(this.gameBall.nativeElement, 'top', Math.floor(this.yDistance/2)+'px');
      this.renderer.setStyle(this.gameBall.nativeElement, 'left', Math.floor(this.xDistance/2)+'px');
      this.animateBall();
    });
  }

  onMouseMove(event : MouseEvent) {
    if(this.gameStarted && !this.gameOver) {
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
        this.ballSpeed++;
        console.log("ball hit bottom");
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
}
