import { NgClass } from '@angular/common';
import { Component, ElementRef, HostListener, Input, OnInit, Renderer2, ViewChild } from '@angular/core';
import { ContextMenuService } from '../../services/context-menu.service';
import CopyCutPaste from '../../models/CopyCutPaste';

@Component({
  selector: 'app-app-tile',
  imports: [NgClass],
  templateUrl: './app-tile.component.html',
  styleUrl: './app-tile.component.scss'
})
export class AppTileComponent implements OnInit {
  @ViewChild("appName", {static : false}) appName !: ElementRef;

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
  @Input() editAppName !: (app_id : number, new_name : string) => Promise<boolean>;
  @Input() copy !: (id : number) => void;
  @Input() cut !: (id : number) => void;
  focused : boolean = false;
  enable_rename : boolean = false;

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
          if(!this.focused && this.enable_rename) {
            this.enable_rename=false;
            this.editAppName(this.app_id, this.appName.nativeElement.textContent).then(
              res => {
                if(!res) {
                  this.appName.nativeElement.textContent = this.app_name+this.app_ext;
                }
              }
            );
          }
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
                action : this.copyAction,
                disabled : false
              },
              {
                label : "cut",
                icon : "./cut.png",
                action : this.cutAction,
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
  async onenterkey() {
    if(this.focused) this.open();
    if(this.enable_rename) {
      this.enable_rename = false;
      const res = await this.editAppName(this.app_id, this.appName.nativeElement.textContent);
    }
  }

  nothing = () => {};

  rename = () => {
    this.enable_rename=true;
    this.selectContentText();
  };

  delete = () => {
    console.log(this.app_id);
    this.deleteWithId(this.app_id);
  }

  open = () => {this.openWithId(this.app_id); this.focused = false;}

  copyAction = () => {
    this.copy(this.app_id);
  }

  cutAction = () => {
    this.cut(this.app_id);
  }

  setIdDragged() {
    this.setDraggedId(this.app_id);
  }

  selectContentText() {
    const range = document.createRange();
    const selection = window.getSelection();
    range.selectNodeContents(this.appName.nativeElement);

    selection?.removeAllRanges();
    selection?.addRange(range);
    setTimeout(() => {
      this.appName.nativeElement.focus();
    }, 0); 
  }
}
