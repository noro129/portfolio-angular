import { Component, HostListener, Input } from '@angular/core';
import FolderContentStructure from '../../models/FolderContentStructure';
import { KeyValuePipe, NgFor } from '@angular/common';

@Component({
  selector: 'app-folder-content',
  imports: [NgFor, KeyValuePipe],
  templateUrl: './folder-content.component.html',
  styleUrl: './folder-content.component.scss'
})
export class FolderContentComponent {
  @Input() openedFolder !: FolderContentStructure | undefined;
  @Input() switchToFolder !: (f : FolderContentStructure) => void;
  showContextMenu = false

  keepOrder = () => 0;

  trackByKey (index: number, item: { key: string; value: any }) : string {
    return item.key;
  }

  @HostListener('contextmenu', ['$event'])
  onRightClick(event : MouseEvent) {
    event.preventDefault();
  }

  open(item : FolderContentStructure) {
    if (item.isFolder) {
      this.switchToFolder(item);
    }
  }
}
