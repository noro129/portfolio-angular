import { Component, Input, OnDestroy } from '@angular/core';
import { AppsObject } from '../../models/AppsObject';
import { KeyValuePipe, NgFor, NgClass } from '@angular/common';

@Component({
  selector: 'app-trash',
  imports: [NgFor, KeyValuePipe, NgClass],
  templateUrl: './trash.component.html',
  styleUrl: './trash.component.scss'
})
export class TrashComponent implements OnDestroy {
  @Input() deletedApps !: Map<number, AppsObject>;
  @Input() restoreApp !: (key : number) => void;
  focusedApps = 0;


  keepOrder = ()=>0;
  trackByKey (index: number, item: { key: number; value: any }) : number {
    return item.key;
  }


  onClick(key : number) {
    const app = this.deletedApps.get(key);
    if(app) {
      app.focused = !app.focused;
      if(app.focused) this.focusedApps++;
      else this.focusedApps--;
    }
  }

  restore() {
    let keys = [];
    for(let [key, value] of this.deletedApps){
      if(value.focused) keys.push(key);
    }
    for(let key of keys) {
      this.restoreApp(key);
    }
    this.focusedApps = 0;
  }

  delete() {
    let keys = [];
    for(let [key, value] of this.deletedApps){
      if(value.focused) keys.push(key);
    }
    for(let key of keys) {
      this.deletedApps.delete(key);
    }
    this.focusedApps = 0;
  }

  restoreItem(key : number) {
    console.log("restoring item "+key);
    this.restoreApp(key);
  }

  deleteItem(key : number) {
    console.log("deleting item "+ key);
    this.deletedApps.delete(key);
  }

  ngOnDestroy(): void {
    for(let [key, deletedApp] of this.deletedApps){
      deletedApp.focused = false;
    }
  }
}
