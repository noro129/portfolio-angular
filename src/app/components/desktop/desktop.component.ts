import { NgClass, NgFor, NgIf } from '@angular/common';
import { Component, HostListener, OnInit, ViewChild, ViewContainerRef, EmbeddedViewRef } from '@angular/core';
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
  day = 1;
  weekDay = "Sunday";
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
      const uuid = crypto.randomUUID();
      if(app.type === AppType.Folder) {
        if(this.stacksMap.has(AppType.Folder.toString())){
          this.stacksMap.get(AppType.Folder.toString())?.unshift({ id : uuid, name : app.name, hidden : false, icon : "./folder.png"});
        } else {
          this.stacksMap.set(AppType.Folder.toString(), [{ id : uuid, name : app.name, hidden : false, icon : "./folder.png"}]);
        }
        this.addFolder(uuid, app.name, app.icon);
      } else {
        if(this.stacksMap.has(app.name)){
          this.stacksMap.get(app.name)?.unshift({ id : uuid, name : app.name, hidden : false, icon : app.icon});
        } else {
          this.stacksMap.set(app.name, [{ id : uuid, name : app.name, hidden : false, icon : app.icon}]);
        }
        //TODO: open app
      }
    }
  }

  ngOnInit(): void {
    this.setDate();
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

  setDate() {
    const weekdays: string[] = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const today = new Date();
    this.day = today.getDate();
    this.weekDay = weekdays[today.getDay()]
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
      const uuid = crypto.randomUUID();
      if(toOpen?.type === AppType.Folder) {
        
        this.addFolder(uuid, toOpen.name, toOpen.icon);
        if(this.stacksMap.has(AppType.Folder.toString())){
          this.stacksMap.get(AppType.Folder.toString())?.unshift({ id : uuid, name : toOpen.name, hidden : false, icon : "./folder.png"});
        } else {
          this.stacksMap.set(AppType.Folder.toString(), [{ id : uuid, name : toOpen.name, hidden : false, icon : "./folder.png"}]);
        }
      }
      else {
        //TODO: open APP
      }
    }
  }

  removeItem = (key : string, itemId : string)  => {
    const val = this.stacksMap.get(key) || [];
    var index = val.findIndex(item => item.id === itemId);
    if(index == -1) return;
    val.splice(index, 1);
    if(key === AppType.Folder.toString()) this.removeFolder(itemId);
    if(val.length == 0) this.stacksMap.delete(key);
  }

  putInstanceFront = (key : string, itemId : string) => {
    const instances = this.stacksMap.get(key) || [];
    var index = instances.findIndex(item => item.id === itemId);
    if(index == -1) return;
    const instance = instances[index];
    const folderRef = this.foldersManager.get(this.foldersManager.length - 1 - index);
    if(folderRef) {
      this.foldersManager.move(folderRef, this.foldersManager.length - 1);
      instances.splice(index, 1);
      instances.unshift(instance);
    }
    
  }

  changeFolderName = (newFolderName : string, folderId : string) => {
    const folders = this.stacksMap.get(AppType.Folder.toString()) || [];
    for(let folder of folders) {
      if(folder.id === folderId) {
        folder.name = newFolderName;
        break;
      }
    }
  }

  hideRevealItem = (key : string, itemId : string) => {
    const instances = this.stacksMap.get(key) || [];
    for(let instance of instances) {
      if(instance.id === itemId) {
        instance.hidden = !instance.hidden;
      } 
    }
  }

  addFolder(id : string, name: string, iconLogo: string) {
    const newFolder = this.foldersManager.createComponent(FolderComponent);
    newFolder.instance.name = name;
    newFolder.instance.folderId = id;
    newFolder.instance.removeFolder = this.removeItem;
    newFolder.instance.putFront = this.putInstanceFront;
    newFolder.instance.changeFolderName = this.changeFolderName;
    newFolder.instance.hideFolder = this.hideRevealItem;
    newFolder.instance.positionX = this.XOffsetfolderPosition;
    newFolder.instance.positionY = this.YOffsetfolderPosition;
    newFolder.instance.iconLogo = iconLogo;


    this.XOffsetfolderPosition = this.XOffsetfolderPosition + 50;
    this.YOffsetfolderPosition = this.YOffsetfolderPosition + 50;
  }

  removeFolder(id : string) {
    for(let folderI=0; folderI<this.foldersManager.length; folderI++){
      const ref = this.foldersManager.get(folderI) as EmbeddedViewRef<any>;
      const context = ref.context;
      if(context && context.folderId === id) {
        this.foldersManager.remove(folderI);
        return;
      }
    }
    
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