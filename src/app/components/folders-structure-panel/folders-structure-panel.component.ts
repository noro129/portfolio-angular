import { Component, forwardRef, Input, OnInit } from '@angular/core';
import { KeyValuePipe, NgFor, NgIf, NgStyle } from '@angular/common';
import ContentTreeStructure from '../../models/ContentTreeStructure';

@Component({
  selector: 'app-folders-structure-panel',
  imports: [NgFor, NgIf, NgStyle, KeyValuePipe,forwardRef(()=> FoldersStructurePanelComponent)],
  templateUrl: './folders-structure-panel.component.html',
  styleUrl: './folders-structure-panel.component.scss'
})
export class FoldersStructurePanelComponent implements OnInit {
  @Input() selectedFolder : string = "Desktop";
  @Input() changeFolder !: (name : string) => void;
  @Input() folderContentStructure !: Map<string, ContentTreeStructure>;
  @Input() key !: number;
  @Input() value !: ContentTreeStructure;
  @Input() openedFolder !: ContentTreeStructure | undefined;
  @Input() switchToFolder !: (f : ContentTreeStructure) => void;


  hasSubFolders = false;
  showSubFolders = true;

  keepOrder = () => 0;

  trackByKey (index: number, item: { key: number; value: any }) : number {
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
