import { Component, HostListener, Input } from '@angular/core';
import { KeyValuePipe, NgFor } from '@angular/common';
import ContentTreeStructure from '../../models/ContentTreeStructure';
import { AppTileComponent } from '../app-tile/app-tile.component';

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
  showContextMenu = false

  keepOrder = () => 0;

  trackByKey (index: number, item: { key: number; value: any }) : number {
    return item.key;
  }

  @HostListener('contextmenu', ['$event'])
  onRightClick(event : MouseEvent) {
    event.preventDefault();
  }

  openItem(item : ContentTreeStructure) {
    if (item.isFolder) {
      this.switchToFolder(item);
    } else {
      console.log(item.id);
      this.open(item.id);
    }
  }
}
