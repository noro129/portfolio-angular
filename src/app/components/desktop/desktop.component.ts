import { NgClass, NgFor, NgIf } from '@angular/common';
import { Component, ElementRef, HostListener, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { Application } from '../../models/Application';
import { AppType } from '../../models/AppType';
import { FolderComponent } from "../folder/folder.component";
import { ActiveItemsPanelComponent } from "../active-items-panel/active-items-panel.component";
import { OpenInstance } from '../../models/OpenInstance';

@Component({
  selector: 'app-desktop',
  imports: [NgFor, NgIf, NgClass, 
    FolderComponent, 
    ActiveItemsPanelComponent],
  templateUrl: './desktop.component.html',
  styleUrl: './desktop.component.scss'
})
export class DesktopComponent implements OnInit{
  @ViewChild("foldersManager" ,{ read: ViewContainerRef, static: true }) foldersManager!: ViewContainerRef;
  XOffsetfolderPosition = 250;
  YOffsetfolderPosition = 150;
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
        'xPosition' : 4,
        'yPosition' : 0
      }
  ];
  applicationsMatrix = new Map<number, AppsObject>();
  stacksMap = new Map<string, OpenInstance[]>;
  draggedIndex =-1;
  hoveredAppPosition = {'row' : -1, 'column' : -1};

  constructor() {
    this.gridColumns = window.innerWidth / 100;
    this.gridRows = window.innerHeight / 100;
  }

  arrayOfSize(length : number) : number[] {
    return Array.from({ length }, (_, i) => i);
  }

  @HostListener('document:keydown.enter')
  handleEnterKey() {
    for(let [key, app] of this.applicationsMatrix) {
      if(!app.focused) continue;
      if(app.type === AppType.Folder) {
        if(this.stacksMap.has(AppType.Folder.toString())){
          this.stacksMap.get(AppType.Folder.toString())?.unshift({ name : app.name, hidden : false, icon : "./folder.png"});
        } else {
          this.stacksMap.set(AppType.Folder.toString(), [{ name : app.name, hidden : false, icon : "./folder.png"}]);
        }
        this.addFolder(app.name, app.icon);
      } else {
        if(this.stacksMap.has(app.name)){
          this.stacksMap.get(app.name)?.unshift({ name : app.name, hidden : false, icon : app.icon});
        } else {
          this.stacksMap.set(app.name, [{ name : app.name, hidden : false, icon : app.icon}]);
        }
        //TODO: open app
      }
    }
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

  open(index : number) {
    if(this.applicationsMatrix.has(index)) {
      const toOpen = this.applicationsMatrix.get(index);
      if(toOpen?.type === AppType.Folder) {
        this.addFolder(toOpen.name, toOpen.icon);
        if(this.stacksMap.has(AppType.Folder.toString())){
          this.stacksMap.get(AppType.Folder.toString())?.unshift({ name : toOpen.name, hidden : false, icon : "./folder.png"});
        } else {
          this.stacksMap.set(AppType.Folder.toString(), [{ name : toOpen.name, hidden : false, icon : "./folder.png"}]);
        }
      }
      else {
        //TODO: open APP
      }
    }
  }

  removeItem = (keyI : number, itemI : number)  => {
    var i =-1;
    for( const [key, val] of this.stacksMap) {
      i++;
      if(i == keyI) {
        
        val.splice(itemI, 1);
        if(key === AppType.Folder.toString()) this.removeFolder(itemI);
        if(val.length == 0) this.stacksMap.delete(key);
        return;
      }
    }
  }

  addFolder(name: string, iconLogo: string) {
    const newFolder = this.foldersManager.createComponent(FolderComponent);
    newFolder.instance.name = name;
    newFolder.instance.positionX = this.XOffsetfolderPosition;
    newFolder.instance.positionY = this.YOffsetfolderPosition;
    newFolder.instance.iconLogo = iconLogo;


    this.XOffsetfolderPosition = this.XOffsetfolderPosition + 50;
    this.YOffsetfolderPosition = this.YOffsetfolderPosition + 50;
  }

  removeFolder(index : number) {
    this.foldersManager.remove(index);
  }

  onDragStart(event : DragEvent, key : number) {
    this.draggedIndex = key;
    event.dataTransfer?.setData('plain/text', key.toString());
  }

  onDragOver(event : DragEvent, row : number, column : number) {
    event.preventDefault();
    this.hoveredAppPosition = {'row' : row, 'column' : column};
  }


  onDrop(event : DragEvent, key : number) {
    event.preventDefault();
    if(this.draggedIndex === -1 || key === this.draggedIndex) {
      this.draggedIndex = -1;
      this.hoveredAppPosition = {'row' : -1, 'column' : -1};
      return;
    }
    const draggedApp = this.applicationsMatrix.get(this.draggedIndex);

    if(draggedApp) {
      const dragTo = this.applicationsMatrix.get(key);
      this.applicationsMatrix.set(key, draggedApp);
      if(dragTo) {
        this.applicationsMatrix.set(this.draggedIndex, dragTo);
      } else {
        this.applicationsMatrix.delete(this.draggedIndex);
      }
      
    }
    this.draggedIndex = -1;
    this.hoveredAppPosition = {'row' : -1, 'column' : -1};
  }

  hoveringNeighbour(key : number) : boolean{
    if(this.hoveredAppPosition.row === -1) return false;
    const row = this.hoveredAppPosition.row, column = this.hoveredAppPosition.column;
    return this.isSameKey(key, row, column) ||
           this.isSameKey(key, row, column-1) ||
           this.isSameKey(key, row, column+1) || 

           this.isSameKey(key, row-1, column) ||
           this.isSameKey(key, row-1, column-1) ||
           this.isSameKey(key, row-1, column+1) ||

           this.isSameKey(key, row+1, column-1) ||
           this.isSameKey(key, row+1, column+1) ||
           this.isSameKey(key, row+1, column);
  }

  isSameKey(key : number, row : number, column : number) : boolean {
    return row<this.gridRows && row>=0 && column>=0 && column<this.gridColumns && key === row*this.gridColumns + column;
  }
}

interface AppsObject {
  id : number;
  name : string;
  icon : string;
  type : AppType;
  focused : boolean;
}