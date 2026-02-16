import { NgClass } from '@angular/common';
import { Component, ElementRef, HostListener, Input } from '@angular/core';

@Component({
  selector: 'app-app-tile',
  imports: [NgClass],
  templateUrl: './app-tile.component.html',
  styleUrl: './app-tile.component.scss'
})
export class AppTileComponent {

  @Input() app_icon !: string;
  @Input() app_id !: number;
  @Input() app_name !: string;
  @Input() app_ext !: string;
  @Input() openWithId !: (id : number) => void;
  focused : boolean = false;

  constructor(private el : ElementRef) {}

  @HostListener("document:keydown.enter")
  onenterkey() {
    if(this.focused) this.open();
  }

  open() {this.openWithId(this.app_id); this.focused = false;}

  @HostListener("document:click", ["$event"])
  onclick(event : MouseEvent) {
    const elRect = this.el.nativeElement.getBoundingClientRect();
    const left = elRect.left; const right = elRect.right; const top = elRect.top; const bottom = elRect.bottom;
    const x = event.clientX; const y = event.clientY;

    this.focused = (left <= x && x <= right && top <= y && y <= bottom);
  }
}
