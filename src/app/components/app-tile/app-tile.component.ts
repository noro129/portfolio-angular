import { NgClass } from '@angular/common';
import { Component, ElementRef, HostListener, Input, OnInit, Renderer2, ViewChild } from '@angular/core';
import { ContextMenuService } from '../../services/context-menu.service';

@Component({
  selector: 'app-app-tile',
  imports: [NgClass],
  templateUrl: './app-tile.component.html',
  styleUrl: './app-tile.component.scss'
})
export class AppTileComponent implements OnInit {

  @Input() app_icon !: string;
  @Input() app_id !: number;
  @Input() app_name !: string;
  @Input() app_ext !: string;
  @Input() can_delete !: boolean;
  @Input() openWithId !: (id : number) => void;
  @Input() deleteWithId !: (id : number) => void;
  @Input() setDraggedId !: (id : number) => void;
  @Input() type : number =1;
  @Input() enable_self_focus : boolean = true;
  @Input() enable_context_menu : boolean = true;
  focused : boolean = false;

  constructor(private el : ElementRef, private renderer : Renderer2, private contextmenuService : ContextMenuService) {}

  ngOnInit(): void {
    if(this.enable_self_focus) {
      this.renderer.listen(
        'document',
        'click',
        (event : MouseEvent) => {
          const elRect = this.el.nativeElement.getBoundingClientRect();
          const left = elRect.left; const right = elRect.right; const top = elRect.top; const bottom = elRect.bottom;
          const x = event.clientX; const y = event.clientY;

          this.focused = (left <= x && x <= right && top <= y && y <= bottom);
        }
      )
    }
    if(this.enable_context_menu) {
      this.renderer.listen(
        this.el.nativeElement,
        'contextmenu',
        (event : MouseEvent) => {
          event.preventDefault();
          event.stopPropagation();
          this.contextmenuService.open(
            event.clientX,
            event.clientY,
            [
              {
                label : "open",
                icon : "./shortcut.png",
                action : this.open,
                disabled : false
              },
              {
                label : "copy",
                icon : "./copy.png",
                action : this.open,
                disabled : false
              },
              {
                label : "cut",
                icon : "./cut.png",
                action : this.open,
                disabled : false
              },
              {
                label : "rename",
                icon : "./rename.png",
                action : this.rename,
                disabled : false
              },
              {
                label : "delete",
                icon : "./delete.png",
                action : this.can_delete ? this.delete : this.nothing,
                disabled : !this.can_delete
              }
            ]
          )
        }
      )
    }
  }

  @HostListener("document:keydown.enter")
  onenterkey() {
    if(this.focused) this.open();
  }

  nothing = () => {};

  rename = () => {};

  delete = () => {this.deleteWithId(this.app_id);}

  open = () => {this.openWithId(this.app_id); this.focused = false;}

  setIdDragged() {
    this.setDraggedId(this.app_id);
  }
}
