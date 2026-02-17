import { NgClass, NgIf, NgStyle } from '@angular/common';
import { Component, ElementRef, HostListener, Input, Renderer2, ViewChild } from '@angular/core';

@Component({
  selector: 'app-app-tile',
  imports: [NgClass, NgStyle],
  templateUrl: './app-tile.component.html',
  styleUrl: './app-tile.component.scss'
})
export class AppTileComponent {
  @ViewChild("contextmenu", {static : false}) cm !: ElementRef;

  @Input() app_icon !: string;
  @Input() app_id !: number;
  @Input() app_name !: string;
  @Input() app_ext !: string;
  @Input() openWithId !: (id : number) => void;
  focused : boolean = false;
  showContextmenu = false;

  constructor(private el : ElementRef, private renderer : Renderer2) {}

  @HostListener("document:keydown.enter")
  onenterkey() {
    if(this.focused) this.open();
  }

  @HostListener("document:contextmenu", ['$event'])
  contextMenu(event : MouseEvent) {
    const elRect = this.el.nativeElement.getBoundingClientRect();
    const left = elRect.left; const right = elRect.right; const top = elRect.top; const bottom = elRect.bottom;
    const x = event.clientX; const y = event.clientY;
    if(left <= x && x <= right && top <= y && y <= bottom) {
      event.preventDefault();
      event.stopPropagation();
      this.showContextmenu = true;
      requestAnimationFrame(()=> {
        this.renderer.setStyle(this.cm.nativeElement, 'top', `${y-top}px`);
        this.renderer.setStyle(this.cm.nativeElement, 'left', `${x-left}px`);
      })
      
    } else {
      this.showContextmenu = false;
    }
  }

  open() {this.openWithId(this.app_id); this.focused = false;}

  @HostListener("document:click", ["$event"])
  onclick(event : MouseEvent) {
    const elRect = this.el.nativeElement.getBoundingClientRect();
    const left = elRect.left; const right = elRect.right; const top = elRect.top; const bottom = elRect.bottom;
    const x = event.clientX; const y = event.clientY;

    this.focused = (left <= x && x <= right && top <= y && y <= bottom);
    this.showContextmenu = false;
  }
}
