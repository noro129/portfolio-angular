import { Component, HostListener, Input } from '@angular/core';
import { KeyValuePipe, NgFor } from '@angular/common';
import ContentTreeStructure from '../../models/ContentTreeStructure';
import { AppTileComponent } from '../app-tile/app-tile.component';
import { ContextMenuService } from '../../services/context-menu.service';
import { AppType } from '../../models/AppType';

@Component({
  selector: 'app-folder-content',
  imports: [NgFor, KeyValuePipe, AppTileComponent],
  templateUrl: './folder-content.component.html',
  styleUrl: './folder-content.component.scss'
})
export class FolderContentComponent {
  @Input() openedFolder !: ContentTreeStructure | undefined;
  @Input() switchToFolder !: (f : ContentTreeStructure) => void;
  @Input() open !: (id : number) => void;
  
  @Input() setDraggedId !: (input : number) => void;
  @Input() setDragSource !: (input : ContentTreeStructure) => void;
  @Input() setDragDestination !: (input : ContentTreeStructure) => void;
  @Input() moveContentInTree !: () => void;
  @Input() editAppName !: (app_id : number, new_name : string) => boolean;

  AppType = AppType;

  keepOrder = () => 0;

  trackByKey (index: number, item: { key: number; value: any }) : number {
    return item.key;
  }

  constructor(private contextmenuService : ContextMenuService) {}

  openItem(item : ContentTreeStructure) {
    if (item.application.type === AppType.Folder) {
      this.switchToFolder(item);
    } else {
      console.log(item.application.id);
      this.open(item.application.id);
    }
  }

  onDragStart() {
    if(this.openedFolder) this.setDragSource(this.openedFolder);
  }

  onDragOver(event : DragEvent) {
    event.preventDefault();
  }

  onDrop(event : DragEvent) {
    event.preventDefault();
    if(this.openedFolder) this.setDragDestination(this.openedFolder);
    this.moveContentInTree();
  }

  onRightClick(event : MouseEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.contextmenuService.open(event.clientX, event.clientY,
      [
        {
          label : "New Folder" , icon : './add.png', action : this.addFolder, disabled : false
        },
        {
          label : "New File" , icon : './add.png', action : this.addFile, disabled : false
        },
        {
          label : 'paste', icon : './paste.png', action : this.paste, disabled : false
        }
      ])
  }

  addFolder() {}

  addFile() {}

  paste() {}

  editAppNameHandler = (app_id : number, new_name : string) => {
    if(this.openedFolder) this.setDragSource(this.openedFolder);
    return this.editAppName(app_id, new_name);
  }
}
