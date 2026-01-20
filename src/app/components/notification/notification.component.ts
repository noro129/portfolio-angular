import { Component, Input } from '@angular/core';
import { Notification } from '../../models/Notification';
import { KeyValuePipe, NgFor } from '@angular/common';

@Component({
  selector: 'app-notification',
  imports: [NgFor, KeyValuePipe],
  templateUrl: './notification.component.html',
  styleUrl: './notification.component.scss'
})
export class NotificationComponent {
  @Input() notifications !: Map<string, Notification>;

  keepOrder = () => 0;
}
