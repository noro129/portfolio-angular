import { KeyValuePipe, NgFor, NgIf } from '@angular/common';
import { Component, ElementRef, Input, OnInit, Renderer2, ViewChild } from '@angular/core';
import { ProjectsComponent } from "../projects/projects.component";
import { OpenInstance } from '../../models/OpenInstance';
import { FoldersStructurePanelComponent } from '../folders-structure-panel/folders-structure-panel.component';
import FolderContentStructure from '../../models/FolderContentStructure';
import { FolderContentComponent } from '../folder-content/folder-content.component';

@Component({
  selector: 'app-folder',
  imports: [ NgFor, NgIf, KeyValuePipe,ProjectsComponent, FoldersStructurePanelComponent, FolderContentComponent],
  templateUrl: './folder.component.html',
  styleUrl: './folder.component.scss'
})
export class FolderComponent{
  @ViewChild("folderTab") folderTab!: ElementRef<HTMLDivElement>;
  @Input() folder !: OpenInstance;
  @Input() open !: (id : number) => void;
  @Input() dragOver !: (event : DragEvent) => void;
  @Input() dropToMove !: (event : DragEvent) => void;
  @Input() folderContentStructure !: Map<string, FolderContentStructure>;
  @Input() openedFolder !: FolderContentStructure | undefined;
  @Input() switchingToFolder !: (key : string, f : FolderContentStructure) => void;

  keepOrder = () => 0;

  trackByKey (index: number, item: { key: string; value: any }) : string {
    return item.key;
  }

  changeFolder = (folderName : string) => {
    if(folderName === this.folder.name) return;
    this.folder.name = folderName;
  }

  switchToFolder = (f : FolderContentStructure) => {
    this.switchingToFolder(this.folder.id ,f);
  }
}
