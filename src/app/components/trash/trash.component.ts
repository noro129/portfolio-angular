import { Component, Input, OnDestroy } from '@angular/core';
import { KeyValuePipe, NgFor, NgClass } from '@angular/common';
import { AppType } from '../../models/AppType';
import { Application } from '../../models/Application';

@Component({
  selector: 'app-trash',
  imports: [
    // NgFor, KeyValuePipe, 
    NgClass],
  templateUrl: './trash.component.html',
  styleUrl: './trash.component.scss'
})
export class TrashComponent implements OnDestroy {
  @Input() deletedApplications !: Map<number, Application>;
  @Input() restoreApp !: (key : number) => void;
  focusedApps = 0;
  AppType = AppType;


  keepOrder = ()=>0;
  trackByKey (index: number, item: { key: number; value: any }) : number {
    return item.key;
  }


  onClick(key : number) {
    const app = this.deletedApplications.get(key);
    if(app) {
      // app.focused = !app.focused;
      // if(app.focused) this.focusedApps++;
      // else this.focusedApps--;
    }
  }

  restore() {
    let keys : number[] = [];
    for(let [key, value] of this.deletedApplications){
      // if(value.focused) keys.push(key);
    }
    for(let key of keys) {
      this.restoreApp(key);
    }
    this.focusedApps = 0;
  }

  delete() {
    let keys : number[] = [];
    for(let [key, value] of this.deletedApplications){
      // if(value.focused) keys.push(key);
    }
    for(let key of keys) {
      this.deletedApplications.delete(key);
    }
    this.focusedApps = 0;
  }

  restoreItem(key : number) {
    this.restoreApp(key);
  }

  deleteItem(key : number) {
    this.deletedApplications.delete(key);
  }

  ngOnDestroy(): void {
    for(let [key, deletedApp] of this.deletedApplications){
      // deletedApp.focused = false;
    }
  }
}
