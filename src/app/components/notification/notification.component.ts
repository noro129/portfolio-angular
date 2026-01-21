import { Component, Input } from '@angular/core';
import { Notification } from '../../models/Notification';
import { KeyValuePipe, NgFor, NgStyle } from '@angular/common';
import { NotifType } from '../../models/NotifType';

@Component({
  selector: 'app-notification',
  imports: [NgFor, KeyValuePipe, NgStyle],
  templateUrl: './notification.component.html',
  styleUrl: './notification.component.scss'
})
export class NotificationComponent {
  @Input() notifications !: Map<string, Notification>;

  keepOrder = () => 0;
  NotifType = NotifType;

  trackByKey (index: number, item: { key: string; value: any }) : string {
    return item.key;
  }
}
