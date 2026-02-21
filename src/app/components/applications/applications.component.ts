import { Component, Input } from '@angular/core';
import { OpenInstance } from '../../models/OpenInstance';
import { NgFor, KeyValuePipe, NgSwitch, NgSwitchCase, NgSwitchDefault } from '@angular/common';
import { AppType } from '../../models/AppType';
import { BlodestComponent } from "../blodest/blodest.component";
import { WindowComponent } from "../window/window.component";
import { FolderComponent } from "../folder/folder.component";
import { CMDComponent } from "../cmd/cmd.component";
import { WhoamiComponent } from "../whoami/whoami.component";
import { TrashComponent } from "../trash/trash.component";
import { FileReaderComponent } from "../file-reader/file-reader.component";
import ContentTreeStructure from '../../models/ContentTreeStructure';
import Script from '../../models/Script';
import DeletedItem from '../../models/DeletedItem';

@Component({
  selector: 'app-applications',
  imports: [NgFor, KeyValuePipe, NgSwitch, NgSwitchCase, BlodestComponent, WindowComponent, FolderComponent, CMDComponent, WhoamiComponent, TrashComponent, FileReaderComponent, NgSwitchDefault],
  templateUrl: './applications.component.html',
  styleUrl: './applications.component.scss'
})
export class ApplicationsComponent {
  @Input() deletedItems !: Map<number, DeletedItem>;
  @Input() openedAplications!: Map<string, OpenInstance[]>;
  @Input() removeOpenInstance !: (key: string, itemId: string)=> void;
  @Input() putOpenInstanceFront !: (key: string, itemId: string)=> void;
  @Input() restoreApp !: (key : number)=> void;
  @Input() open !: (id : number) => void;
  @Input() deleteDraggedItem !: () => void;
  @Input() editAppName !: (app_id : number, new_name : string) => Promise<boolean>;
  @Input() experience !: any;
  @Input() contentTreeStructure !: Map<number, ContentTreeStructure>;
  @Input() script !: Map<number, Script>;
  @Input() deleteApp !: (id: number) => void;

  @Input() setDraggedId !: (input : number) => void;
  @Input() setDragSource !: (input : ContentTreeStructure) => void;
  @Input() setDragDestination !: (input : ContentTreeStructure) => void;
  @Input() moveContentInTree !: () => void;
  @Input() addFolderFile !: (type : AppType,node : ContentTreeStructure) => void;

  @Input() openedFolders !: Map<string, ContentTreeStructure>;
  @Input() projectsObjRef !: ContentTreeStructure;
  AppType = AppType;
  keepOrder = () => 0;

  trackByKey (index: number, item: { key: string; value: any }) : string {
    return item.key;
  }

  trackById (index: number, item : OpenInstance) : string {
    return item.id;
  }

  dragOver(event : DragEvent) {
    event.preventDefault();
  }

  dropToDelete(event : DragEvent) {
    event.preventDefault();
    this.deleteDraggedItem();
  }

  dropToMove(event : DragEvent) {
    event.preventDefault();
    console.log("dropping ");
  }

  switchingToFolder = (key : string, newF : ContentTreeStructure) => {
    this.openedFolders.set(key, newF);
    this.openedAplications.get(AppType.Folder.toString())?.forEach(
      (f) => {
        if(f.id === key) {
          f.application = newF.application;
        }
      }
    )
  }
}
