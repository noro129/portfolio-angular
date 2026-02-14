import { Component, forwardRef, Input, OnInit } from '@angular/core';
import { KeyValuePipe, NgFor, NgIf, NgStyle } from '@angular/common';
import FolderContentStructure from '../../models/FolderContentStructure';

@Component({
  selector: 'app-folders-structure-panel',
  imports: [NgFor, NgIf, NgStyle, KeyValuePipe,forwardRef(()=> FoldersStructurePanelComponent)],
  templateUrl: './folders-structure-panel.component.html',
  styleUrl: './folders-structure-panel.component.scss'
})
export class FoldersStructurePanelComponent implements OnInit {
  @Input() selectedFolder : string = "Desktop";
  @Input() changeFolder !: (name : string) => void;
  @Input() folderContentStructure !: Map<string, FolderContentStructure>;
  @Input() key !: string;
  @Input() value !: FolderContentStructure;
  @Input() openedFolder !: FolderContentStructure | undefined;
  @Input() switchToFolder !: (f : FolderContentStructure) => void;


  hasSubFolders = false;
  showSubFolders = true;

  keepOrder = () => 0;

  trackByKey (index: number, item: { key: string; value: any }) : string {
    return item.key;
  }

  ngOnInit(): void {
    for(const v of this.value.content?.values() || []) {
      if(v.isFolder) {
        this.hasSubFolders = true;
        break;
      }
    }
  }

  hideReveal() {
    this.showSubFolders = !this.showSubFolders;
  }

  openFolder() {
    this.switchToFolder(this.value);
  }
}
