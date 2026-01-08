import { Component, Input } from '@angular/core';
import { AppsObject } from '../../models/AppsObject';
import { KeyValuePipe, NgFor, NgClass } from '@angular/common';

@Component({
  selector: 'app-trash',
  imports: [NgFor, KeyValuePipe, NgClass],
  templateUrl: './trash.component.html',
  styleUrl: './trash.component.scss'
})
export class TrashComponent {
  @Input() deletedApps !: Map<number, AppsObject>;
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

  restore() {}

  delete() {}
}
