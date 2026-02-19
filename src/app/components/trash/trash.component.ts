import { Component, Input } from '@angular/core';
import { KeyValuePipe, NgFor, NgClass } from '@angular/common';
import { AppType } from '../../models/AppType';
import DeletedItem from '../../models/DeletedItem';
import { AppTileComponent } from '../app-tile/app-tile.component';

@Component({
  selector: 'app-trash',
  imports: [NgFor, KeyValuePipe, 
    NgClass,AppTileComponent],
  templateUrl: './trash.component.html',
  styleUrl: './trash.component.scss'
})
export class TrashComponent {
  @Input() deletedItems !: Map<number, DeletedItem>;
  @Input() restoreApp !: (key : number) => void;
  focusTracker = new Set<number>();
  AppType = AppType;
  actionPressed = false;


  keepOrder = ()=>0;
  trackByKey (index: number, item: { key: number; value: any }) : number {
    return item.key;
  }

  restore() {
    for(let f of this.focusTracker) {
      this.restoreItem(f);
    }
    this.focusTracker.clear();
    this.actionPressed = false;
  }

  delete() {
    for(let f of this.focusTracker) {
      this.deletedItems.delete(f);
    }
    this.focusTracker.clear();
  }

  restoreItem(key : number) {
    this.actionPressed=true;
    this.restoreApp(key);
  }

  deleteItem(id : number) {
    this.actionPressed=true;
    this.deletedItems.delete(id);
    if(this.focusTracker.has(id)) this.focusTracker.delete(id);
  }

  onClick(id : number) {
    if(this.actionPressed) {
      this.actionPressed=false;
      return;
    }
    if(this.focusTracker.has(id)) this.focusTracker.delete(id);
    else this.focusTracker.add(id);
  }
}
