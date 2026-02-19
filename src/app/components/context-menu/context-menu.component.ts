import { Component, HostListener } from '@angular/core';
import { ContextMenuService } from '../../services/context-menu.service';
import ContextMenuItem from '../../models/ContextMenuItem';
import { AsyncPipe, NgIf, NgStyle, NgFor } from '@angular/common';
import { every } from 'rxjs';

@Component({
  selector: 'app-context-menu',
  imports: [NgIf, NgStyle, AsyncPipe, NgFor],
  templateUrl: './context-menu.component.html',
  styleUrl: './context-menu.component.scss'
})
export class ContextMenuComponent {


  constructor(private contextmenuService : ContextMenuService) {}

  get state$() {
    return this.contextmenuService.state$;
  }

  onItemClick(item : ContextMenuItem) {
    item.action();
    this.contextmenuService.close();
  }

  @HostListener("document:click")
  closeContextmenu(){
    this.contextmenuService.close();
  }

  @HostListener("document:contextmenu", ["$event"])
  preventDefaultContextmenu(event : MouseEvent) {
    if(this.contextmenuService){
      event.preventDefault();
    }
  }
}
