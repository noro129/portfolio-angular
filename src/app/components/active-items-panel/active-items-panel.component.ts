import { Component, Input } from '@angular/core';
import { InstancesStackComponent } from "../instances-stack/instances-stack.component";
import { NgFor, NgIf } from '@angular/common';
import { OpenInstance } from '../../models/OpenInstance';

@Component({
  selector: 'app-active-items-panel',
  imports: [InstancesStackComponent, NgFor, NgIf],
  templateUrl: './active-items-panel.component.html',
  styleUrl: './active-items-panel.component.scss'
})
export class ActiveItemsPanelComponent {
  @Input() stacksMap !: Map<string, OpenInstance[]>;

  getValues() {
    return Array.from(this.stacksMap.values());
  }
}
