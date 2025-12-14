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
  @Input() removeItem !: (keyI : number, i : number) => void;

  getValues() {
    return Array.from(this.stacksMap.values());
  }

  removeStackElement = (index : number, itemI: number) => {
    this.removeItem(index, itemI);
  }
}
