import { Component, Input } from '@angular/core';
import { OpenInstance } from '../../models/OpenInstance';
import { NgFor, KeyValuePipe, NgSwitch, NgSwitchCase } from '@angular/common';
import { AppType } from '../../models/AppType';
import { BlodestComponent } from "../blodest/blodest.component";
import { WindowComponent } from "../window/window.component";
import { FolderComponent } from "../folder/folder.component";
import { CMDComponent } from "../cmd/cmd.component";
import { WhoamiComponent } from "../whoami/whoami.component";
import { TrashComponent } from "../trash/trash.component";
import { AppsObject } from '../../models/AppsObject';

@Component({
  selector: 'app-applications',
  imports: [NgFor, KeyValuePipe, NgSwitch, NgSwitchCase, BlodestComponent, WindowComponent, FolderComponent, CMDComponent, WhoamiComponent, TrashComponent],
  templateUrl: './applications.component.html',
  styleUrl: './applications.component.scss'
})
export class ApplicationsComponent {
  @Input() deletedApps !: Map<number, AppsObject>;
  @Input() openedAplications!: Map<string, OpenInstance[]>;
  @Input() removeOpenInstance !: (key: string, itemId: string)=> void;
  @Input() putOpenInstanceFront !: (key: string, itemId: string)=> void;
  AppType = AppType;
  keepOrder = () => 0;

  trackByKey (index: number, item: { key: string; value: any }) : string {
    return item.key;
  }

  trackById (index: number, item : OpenInstance) : string {
    return item.id;
  }
}
