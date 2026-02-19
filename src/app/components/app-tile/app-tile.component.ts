import { NgClass } from '@angular/common';
import { Component, ElementRef, HostListener, Input, Renderer2, ViewChild } from '@angular/core';
import { ContextMenuService } from '../../services/context-menu.service';

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
  @Input() setDraggedId !: (id : number) => void;
  focused : boolean = false;

  constructor(private el : ElementRef, private contextmenuService : ContextMenuService) {}

  @HostListener("document:keydown.enter")
  onenterkey() {
    if(this.focused) this.open();
  }

  onRightClick(event : MouseEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.contextmenuService.open(
      event.clientX,
      event.clientY,
      [
        {
          label : "open",
          icon : "./shortcut.png",
          action : open,
          disabled : false
        },
        {
          label : "copy",
          icon : "./copy.png",
          action : open,
          disabled : false
        },
        {
          label : "cut",
          icon : "./cut.png",
          action : open,
          disabled : false
        },
        {
          label : "delete",
          icon : "./delete.png",
          action : open,
          disabled : true
        }
      ]
    )
  }

  open = () => {this.openWithId(this.app_id); this.focused = false;}

  setIdDragged() {
    this.setDraggedId(this.app_id);
  }

  @HostListener("document:click", ["$event"])
  onclick(event : MouseEvent) {
    const elRect = this.el.nativeElement.getBoundingClientRect();
    const left = elRect.left; const right = elRect.right; const top = elRect.top; const bottom = elRect.bottom;
    const x = event.clientX; const y = event.clientY;

    this.focused = (left <= x && x <= right && top <= y && y <= bottom);
  }
}
