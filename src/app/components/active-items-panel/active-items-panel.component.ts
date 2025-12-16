import { Component, Input } from '@angular/core';
import { InstancesStackComponent } from "../instances-stack/instances-stack.component";
import { NgFor, NgIf, KeyValuePipe } from '@angular/common';
import { OpenInstance } from '../../models/OpenInstance';

@Component({
  selector: 'app-active-items-panel',
  imports: [InstancesStackComponent, NgFor, NgIf, KeyValuePipe],
  templateUrl: './active-items-panel.component.html',
  styleUrl: './active-items-panel.component.scss'
})
export class ActiveItemsPanelComponent {
  @Input() stacksMap !: Map<string, OpenInstance[]>;
  @Input() removeItem !: (key : string, itemId : string) => void;

  removeStackElement = (stackId : string, itemId: string) => {
    this.removeItem(stackId, itemId);
  }
}
