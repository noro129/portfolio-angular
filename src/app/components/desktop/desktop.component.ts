import { NgClass, NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Application } from '../../models/Application';
import { AppType } from '../../models/AppType';
import { FolderComponent } from "../folder/folder.component";

@Component({
  selector: 'app-desktop',
  imports: [NgFor, NgIf, NgClass, FolderComponent],
  templateUrl: './desktop.component.html',
  styleUrl: './desktop.component.scss'
})
export class DesktopComponent implements OnInit{
  gridColumns = 21;
  gridRows = 10;
  readonly applications : Application[] = [
      {
        'id' : 0,
        'name' : 'Projects',
        'type' : AppType.Folder,
        'icon' : '',
        'xPosition' : 0,
        'yPosition' : 0 
      },
      {
        'id' : 1,
        'name' : 'Experience',
        'type' : AppType.Folder,
        'icon' : './question-mark.png',
        'xPosition' : 1,
        'yPosition' : 0
      },
      {
        'id' : 2,
        'name' : 'WhoAmI',
        'type' : AppType.Application,
        'icon' : './question-mark.png',
        'xPosition' : 2,
        'yPosition' : 0 
      },
      {
        'id' : 3,
        'name' : 'CMD',
        'type' : AppType.Application,
        'icon' : './command-line.png',
        'xPosition' : 3,
        'yPosition' : 0 
      },
      {
        'id' : 4,
        'name' : 'Dr. Trash',
        'type' : AppType.Application,
        'icon' : './trash-can.png',
        'xPosition' : this.gridRows-1,
        'yPosition' : this.gridColumns-1
      }
  ];
  applicationsMatrix = new Map<number, AppsObject>();

  arrayOfSize(length : number) : number[] {
    return Array.from({ length }, (_, i) => i);
  }


  ngOnInit(): void {
    for(let appIndex = 0; appIndex<this.applications.length; appIndex++) {
      const app = this.applications[appIndex];
      let iconLocation = app.icon;
      if(app.type === AppType.Folder) iconLocation = "./folder.png";
      const index = app.yPosition + app.xPosition*this.gridColumns;
      this.applicationsMatrix.set(index, {
        'id' : app.id,
        'name' : app.name,
        'icon' : iconLocation,
        'type' : app.type,
        'focused' : false
      });
    }

  }

  appFocus(index : number) {
    for(let [key, app] of this.applicationsMatrix){
      app.focused = (index === key);
      this.applicationsMatrix.set(key, { ...app });
    }
  }
}

interface AppsObject {
  id : number;
  name : string;
  icon : string;
  type : AppType;
  focused : boolean;
}