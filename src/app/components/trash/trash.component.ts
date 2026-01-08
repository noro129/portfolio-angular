import { Component, Input } from '@angular/core';
import { AppsObject } from '../../models/AppsObject';
import { KeyValuePipe, NgFor } from '@angular/common';

@Component({
  selector: 'app-trash',
  imports: [NgFor, KeyValuePipe],
  templateUrl: './trash.component.html',
  styleUrl: './trash.component.scss'
})
export class TrashComponent {
  @Input() deletedApps !: Map<number, AppsObject>;


  keepOrder = ()=>0;
  trackByKey (index: number, item: { key: number; value: any }) : number {
    return item.key;
  }
}
