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
  focusedApps = 0;
  AppType = AppType;


  keepOrder = ()=>0;
  trackByKey (index: number, item: { key: number; value: any }) : number {
    return item.key;
  }

  restore() {}

  delete() {}

  restoreItem(key : number) {
    this.restoreApp(key);
  }

  // deleteItem(key : number) {
  //   this.deletedApplications.delete(key);
  // }

  // ngOnDestroy(): void {
  //   for(let [key, deletedApp] of this.deletedApplications){
  //     // deletedApp.focused = false;
  //   }
  // }
}
