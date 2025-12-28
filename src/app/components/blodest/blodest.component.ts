import { Component, ElementRef, Input, ViewChild } from '@angular/core';
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


  gameStarted : boolean = false;
  gameOver : boolean = false;

  currentScore : number = 0;
  maxScore : number = 0;

  translateX : string = "";


  startGame() {
    this.gameStarted = true;
  }

  onMouseMove(event : MouseEvent) {
    if(this.gameStarted) {
      const rect = this.gameContainer.nativeElement.getBoundingClientRect();
      this.translateX = `translateX(${event.clientX - rect.left - rect.width*0.1}px)`;
    }
  }
}
