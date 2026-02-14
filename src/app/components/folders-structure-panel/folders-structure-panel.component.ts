import { Component, forwardRef, Input } from '@angular/core';
import { FolderStructure } from '../../models/FolderStructure';
import { NgFor, NgIf, NgStyle } from '@angular/common';

@Component({
  selector: 'app-folders-structure-panel',
  imports: [NgFor, NgIf, NgStyle, forwardRef(()=> FoldersStructurePanelComponent)],
  templateUrl: './folders-structure-panel.component.html',
  styleUrl: './folders-structure-panel.component.scss'
})
export class FoldersStructurePanelComponent {
  @Input() folderStructure !: FolderStructure;
  @Input() selectedFolder : string = "Desktop";
  @Input() changeFolder !: (name : string) => void;
  showSubFolders = true;

  hideReveal() {
    this.showSubFolders = !this.showSubFolders;
  }

  openFolder() {
    this.changeFolder(this.folderStructure.name);
  }
}
