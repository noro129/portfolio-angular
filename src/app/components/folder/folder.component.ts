import { KeyValuePipe, NgFor, NgIf } from '@angular/common';
import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { ProjectsComponent } from "../projects/projects.component";
import { OpenInstance } from '../../models/OpenInstance';
import { FoldersStructurePanelComponent } from '../folders-structure-panel/folders-structure-panel.component';
import { FolderContentComponent } from '../folder-content/folder-content.component';
import ContentTreeStructure from '../../models/ContentTreeStructure';
import { AppType } from '../../models/AppType';

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
  @Input() contentTreeStructure !: Map<number, ContentTreeStructure>;
  @Input() openedFolder !: ContentTreeStructure | undefined;
  @Input() switchingToFolder !: (key : string, f : ContentTreeStructure) => void;
  @Input() editAppName !: (app_id : number, new_name : string) => Promise<boolean>;
  
  @Input() setDraggedId !: (input : number) => void;
  @Input() setDragSource !: (input : ContentTreeStructure) => void;
  @Input() setDragDestination !: (input : ContentTreeStructure) => void;
  @Input() moveContentInTree !: () => void;

  @Input() projectsObjRef !: ContentTreeStructure;

  AppType = AppType;

  keepOrder = () => 0;

  trackByKey (index: number, item: { key: number; value: any }) : number {
    return item.key;
  }

  switchToFolder = (f : ContentTreeStructure) => {
    this.switchingToFolder(this.folder.id ,f);
  }
}
