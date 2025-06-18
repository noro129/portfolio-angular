import { Component, Input } from '@angular/core';
import { InstancesStackComponent } from "../instances-stack/instances-stack.component";
import { NgFor } from '@angular/common';
import { OpenInstance } from '../../models/OpenInstance';

@Component({
  selector: 'app-active-items-panel',
  imports: [InstancesStackComponent, NgFor],
  templateUrl: './active-items-panel.component.html',
  styleUrl: './active-items-panel.component.scss'
})
export class ActiveItemsPanelComponent {
  @Input() stacksList !: OpenInstance[][];


}
