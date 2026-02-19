import { Component, Input } from '@angular/core';
import { InstancesStackComponent } from "../instances-stack/instances-stack.component";
import { NgFor, NgIf, KeyValuePipe } from '@angular/common';
import { OpenInstance } from '../../models/OpenInstance';
import { ContextMenuService } from '../../services/context-menu.service';

@Component({
  selector: 'app-active-items-panel',
  imports: [InstancesStackComponent, NgFor, NgIf, KeyValuePipe],
  templateUrl: './active-items-panel.component.html',
  styleUrl: './active-items-panel.component.scss'
})
export class ActiveItemsPanelComponent {
  @Input() stacksMap !: Map<string, OpenInstance[]>;
  @Input() removeItem !: (key : string, itemId : string) => void;
  @Input() putInstanceFront !: (key : string, itemId : string) => void;
  @Input() focusOnWindow !: (key : string, itemId : string) => void;
  @Input() removeFocusOnWindow !: (key : string, itemId : string) => void;
  @Input() hideRevealItem !: (key : string, itemId : string) => void;

  keepOrder = () => 0;

  constructor(private contextmenuService : ContextMenuService) {}

  onRightClick(event : MouseEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.contextmenuService.open(event.clientX, event.clientY, [{label : 'close all', icon : './delete.png', action : this.closeAll, disabled : this.stacksMap.size === 0}]);
  }

  closeAll = () => {
    this.stacksMap.clear();
  }
}
