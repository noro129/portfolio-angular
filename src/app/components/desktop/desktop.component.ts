import { NgClass, NgFor, NgIf } from '@angular/common';
import { Component, HostListener, OnInit, ViewChild, Renderer2, ElementRef } from '@angular/core';
import { Application } from '../../models/Application';
import { AppType } from '../../models/AppType';
import { ActiveItemsPanelComponent } from "../active-items-panel/active-items-panel.component";
import { OpenInstance } from '../../models/OpenInstance';
import { ApplicationsComponent } from "../applications/applications.component";
import { NotificationComponent } from "../notification/notification.component";
import { NotifType } from '../../models/NotifType';
import { Notification } from '../../models/Notification';
import ContentTreeStructure from '../../models/ContentTreeStructure';
import { AppTileComponent } from '../app-tile/app-tile.component';
import Script from '../../models/Script';
import { ContextMenuComponent } from '../context-menu/context-menu.component';
import { ContextMenuService } from '../../services/context-menu.service';

@Component({
  selector: 'app-desktop',
  imports: [NgFor, NgIf,
    ActiveItemsPanelComponent, ApplicationsComponent, NotificationComponent, AppTileComponent, ContextMenuComponent],
  templateUrl: './desktop.component.html',
  styleUrl: './desktop.component.scss'
})
export class DesktopComponent implements OnInit{
  @ViewChild("desktop" ,{ static: true }) desktop!: ElementRef;
  XOffsetPosition = 150;
  YOffsetPosition = 50;
  ZOffsetPosition = 10;
  gridColumns = 21;
  gridRows = 10;
  appFocusEl !: HTMLElement;
  applications = new Map<number, Application>(); readonly applicationsData = "./applications.json";
  //     {
  //       'id' : 0,
  //       'name' : 'Projects',
  //       'type' : AppType.Folder,
  //       'systemApp' : false,
  //       'icon' : './folder.png',
  //       'xPosition' : 0,
  //       'yPosition' : 0,
  //       'defaultHeight' : 450,
  //       'defaultWidth' : 700,
  //       'resizeable' : true
  //     },
  //     {
  //       'id' : 1,
  //       'name' : 'Experience',
  //       'type' : AppType.Folder,
  //       'systemApp' : false,
  //       'icon' : './folder.png',
  //       'xPosition' : 1,
  //       'yPosition' : 0,
  //       'defaultHeight' : 450,
  //       'defaultWidth' : 700,
  //       'resizeable' : true
  //     },
  //     {
  //       'id' : 2,
  //       'name' : 'WhoAmI',
  //       'type' : AppType.Application,
  //       'systemApp' : true,
  //       'icon' : './question-mark.png',
  //       'xPosition' : 2,
  //       'yPosition' : 0,
  //       'defaultHeight' : 600,
  //       'defaultWidth' : 460,
  //       'resizeable' : false
  //     },
  //     {
  //       'id' : 3,
  //       'name' : 'CMD',
  //       'type' : AppType.Application,
  //       'systemApp' : true,
  //       'icon' : './command-line.png',
  //       'xPosition' : 3,
  //       'yPosition' : 0,
  //       'defaultHeight' : 450,
  //       'defaultWidth' : 800,
  //       'resizeable' : true
  //     },
  //     {
  //       'id' : 4,
  //       'name' : 'bin',
  //       'type' : AppType.Application,
  //       'systemApp' : true,
  //       'icon' : './trash-can.png',
  //       'xPosition' : 4,
  //       'yPosition' : 0,
  //       'defaultHeight' : 450,
  //       'defaultWidth' : 700,
  //       'resizeable' : true
  //     }
  // ];
  applicationsMatrix !: number[][] | null[][];
  notifications = new Map<string, Notification>();
  deletedApplications = new Map<number, Application>();
  stacksMap = new Map<string, OpenInstance[]>;
  draggedPosition = {row : -1, column : -1};draggedPositionEnd = {row : -1, column : -1}; draggedId : number | null = null; dragSource : ContentTreeStructure | null = null; dragDestination : ContentTreeStructure | null = null;
  AppType = AppType;
  contentTreeStructure : Map<number, ContentTreeStructure> = new Map<number, ContentTreeStructure>();
  openedFolders : Map<string, ContentTreeStructure> = new Map<string, ContentTreeStructure>();
  readonly desktopHomePath = ["root", "Desktop"]; appMatrixIsSet = false; desktopTreeObj !: ContentTreeStructure;
  readonly experienceFolderPath = ["root", "Desktop", "Experience"]; experienceIsSet = false;
  readonly experienceData = "./experience.json"; experience : Map<string, any> = new Map<string, any>();
  readonly scriptData = "./script.json"; script : Map<string, Script> = new Map<string, Script>();

  constructor(private renderer : Renderer2, private contextmenuService : ContextMenuService) {
    this.gridColumns = Math.floor(window.innerWidth / 100);
    this.gridRows = Math.floor(window.innerHeight / 100);
    this.applicationsMatrix = [];
    for(let i =0; i<this.gridRows; i++) {
      this.applicationsMatrix[i] = [];
      for(let j=0; j<this.gridColumns; j++) {
        this.applicationsMatrix[i][j] = null;
      }
    }
  }

  arrayOfSize(length : number) : number[] {
    return Array.from({ length }, (_, i) => i);
  }

  getApplication(id : number | null) {
    if (id !== null) return this.applications.get(id);
    return null;
  }

  ngOnInit(): void {
    fetch(this.applicationsData).then(res=>res.json()).then(
      jsonData=> {
        this.insertAppData(jsonData, this.contentTreeStructure, 0, 0);
      }
    );
    fetch(this.scriptData).then(res => res.json()).then(
      jsonData=> {
        for(let item of jsonData) {
          this.script.set(item.script, {
            name : item.script,
            script_code : item.script_code,
            permission : "r-x",
            author : "oussama errazi",
            version : "1.0.0"
          });
        }
        
      }
    )
  }

  insertAppData(jsonData : any, treeNode : Map<number, ContentTreeStructure> | null, desktopDepthIndex : number, experienceDepthIndex : number) {
    if(!jsonData || treeNode===null) return;
    if (!this.appMatrixIsSet && desktopDepthIndex === this.desktopHomePath.length) this.setApplicationsMatrix(jsonData);
    if (!this.experienceIsSet && experienceDepthIndex === this.experienceFolderPath.length) this.setExperienceFolderContent(treeNode);
    for(let item of jsonData) {
      let content = new Map<number, ContentTreeStructure>();
      let node : ContentTreeStructure = {
        id : item.id,
        name : item.name,
        extension : item.extension,
        icon : item.icon,
        isFile : item.isFile,
        isFolder : item.isFolder,
        content : content
      };
      if(item.name === this.desktopHomePath[this.desktopHomePath.length - 1] && desktopDepthIndex === this.desktopHomePath.length - 1) this.desktopTreeObj = node;
      treeNode.set(item.id, node);
      if(item.content !== null) {
        const desktopDepth = desktopDepthIndex + ( desktopDepthIndex < this.desktopHomePath.length && item.name === this.desktopHomePath[desktopDepthIndex] ? 1 : 0);
        const experienceDepth = experienceDepthIndex + ( experienceDepthIndex < this.experienceFolderPath.length && item.name === this.experienceFolderPath[experienceDepthIndex] ? 1 : 0);
        this.insertAppData(item.content, content, desktopDepth, experienceDepth);
      }
      this.applications.set(item.id,
        {
          id : item.id,
          name : item.name,
          icon : item.icon,
          type : item.isFile ? AppType.File : (item.isFolder ? AppType.Folder : AppType.Application),
          canDelete : item.canDelete,
          extension : item.extension,
          defaultHeight : item.defaultHeight,
          defaultWidth : item.defaultWidth,
          resizeable : item.resizeable
        }
      );
    }
  }

  setApplicationsMatrix(node : any) {
    let i =0;
    for(let c=0; c<this.gridColumns; c++) {
      for(let r=0; r<this.gridRows; r++) {
        if(i=== node.length) return;
        const item = node[i];
        this.applicationsMatrix[r][c] = item.id;
        i++;
      }
    }
    this.appMatrixIsSet = true;
  }

  setExperienceFolderContent(content : Map<number, ContentTreeStructure>) {
    fetch(this.experienceData).then(res => res.json()).then(json => {
      let id =20;
      for(let item of json) {
        this.experience.set(item.company, item);
        content.set(
          id,
          {
            id : id,
            name : item.company,
            extension : ".txt",
            icon : "./file.png",
            isFolder : false,
            isFile : true,
            content : new Map<number, ContentTreeStructure>()
          }
        );
        this.applications.set(id,
          {
            id : id,
            name : item.company,
            icon : "./file.png",
            type : AppType.File,
            canDelete : true,
            extension : ".txt",
            defaultHeight : 700,
            defaultWidth : 600,
            resizeable : true
          }
        );
        id++;
      }
    });
    this.experienceIsSet = true;
  }

  setDraggedId = (input : number) => {
    this.draggedId = input;
  }

  setDragSource = (input : ContentTreeStructure) => {
    this.dragSource = input;
  }

  setDragDestination = (input : ContentTreeStructure) => {
    this.dragDestination = input;
  }

  addNotification(message : string, notifType : NotifType){
    const uuid = crypto.randomUUID();
    this.notifications.set(uuid, {id : uuid, message : message, type : notifType});
    setTimeout(()=>{
      this.notifications.delete(uuid);
    },2500);
  }

  onRightClick(event : MouseEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.contextmenuService.open(event.clientX, event.clientY,
      [
        {
          label : "New Folder" , icon : './add.png', action : this.nothing, disabled : false
        },
        {
          label : "New File" , icon : './add.png', action : this.nothing, disabled : false
        },
        {
          label : 'paste', icon : './paste.png', action : this.nothing, disabled : false
        }
      ])
  }

  nothing = () => {}

  openItem = (id : number) => {
    this.openWithId(id);
  }

  openWithId(id : number) {
    const toOpen = this.applications.get(id);
    if(!toOpen) return;
    const uuid = crypto.randomUUID();
    const app : OpenInstance = {id : uuid, name : toOpen.name, hidden : false, icon : toOpen.icon, windowWidth : toOpen.defaultWidth, windowHeight : toOpen.defaultHeight, positionX : this.XOffsetPosition, positionY : this.YOffsetPosition, positionZ : this.ZOffsetPosition, focusedOn : false, resizeable : toOpen.resizeable};
    this.XOffsetPosition = this.XOffsetPosition + 10;
    this.YOffsetPosition = this.YOffsetPosition + 10;
    this.ZOffsetPosition++;
    if(toOpen.type === AppType.Folder) {
      const val = this.getDesktopFolderNode(this.contentTreeStructure, toOpen.name, 0);
      if(val) this.openedFolders.set(uuid, val);
      if(this.stacksMap.has(AppType.Folder.toString())){
        this.stacksMap.get(AppType.Folder.toString())?.unshift(app);
      } else {
        this.stacksMap.set(AppType.Folder.toString(), [app]);
      }
    } else if (toOpen.type === AppType.File) {
      if(this.stacksMap.has(AppType.File.toString())){
        this.stacksMap.get(AppType.File.toString())?.unshift(app);
      } else {
        this.stacksMap.set(AppType.File.toString(), [app]);
      }
    }
    else {
      if(this.stacksMap.has(app.name)){
        this.stacksMap.get(app.name)?.unshift(app);
      } else {
        this.stacksMap.set(app.name, [app]);
      }
    }
  }

  getDesktopFolderNode(treeNode : Map<number, ContentTreeStructure> | undefined, name : string, depth : number) : ContentTreeStructure | undefined {
    if (!treeNode) return undefined;
    for(let v of treeNode.values()) {
      if (depth === this.desktopHomePath.length-1 && v.name === this.desktopHomePath[depth]) {
        for(let v2 of v.content?.values() || []) {
          if (v2.name === name) return v2;
        }
      }
      if(v.name === this.desktopHomePath[depth]) {
        return this.getDesktopFolderNode(v.content, name, depth+1);
      }
    }
    return undefined;
  }

  removeItem = (key : string, itemId : string)  => {
    const val = this.stacksMap.get(key) || [];
    var index = val.findIndex(item => item.id === itemId);
    if(index == -1) return;
    if(key === AppType.Folder.toString()) this.openedFolders.delete(val[index].id);
    val.splice(index, 1);
    if(val.length == 0) this.stacksMap.delete(key);
  }

  putInstanceFront = (key : string, itemId : string) => {
    const instances = this.stacksMap.get(key) || [];
    var index = instances.findIndex(item => item.id === itemId);
    if(index == -1) return;
    const instance = instances[index];
    instances.splice(index, 1);
    instances.unshift(instance);
    instance.positionZ=this.ZOffsetPosition;
    this.ZOffsetPosition++;
  }

  hideRevealItem = (key : string, itemId : string) => {
    const instances = this.stacksMap.get(key) || [];
    for(let instance of instances) {
      if(instance.id === itemId) {
        instance.hidden = !instance.hidden;
        break;
      } 
    }
  }

  focusOnWindow = (key : string, itemId : string) => {
    const instances = this.stacksMap.get(key) || [];
    for(let instance of instances) {
      if(instance.id === itemId) {
        instance.focusedOn = true;
        break;
      } 
    }

    this.appFocusEl = this.renderer.createElement("div");
    this.renderer.setStyle(this.appFocusEl, 'background', 'rgba(0,0,0,0)');
    this.renderer.setStyle(this.appFocusEl, 'backdrop-filter', 'blur(0)');
    this.renderer.setStyle(this.appFocusEl, 'transition', 'background .2s ease, backdrop-filter .2s .1s ease');
    this.renderer.setStyle(this.appFocusEl, 'z-index', "9998");
    this.renderer.setStyle(this.appFocusEl, 'position', 'absolute');
    this.renderer.setStyle(this.appFocusEl, 'top', '0');
    this.renderer.setStyle(this.appFocusEl, 'left', '0');
    this.renderer.setStyle(this.appFocusEl, 'width', '100%');
    this.renderer.setStyle(this.appFocusEl, 'height', '100%');

    setTimeout(()=> {
      this.renderer.setStyle(this.appFocusEl, 'background', 'rgba(0,0,0,0.3)');
      this.renderer.setStyle(this.appFocusEl, 'backdrop-filter', 'blur(5px)');
    }, 100);

    this.renderer.appendChild(this.desktop.nativeElement, this.appFocusEl);
  }

  removeFocusOnWindow = (key : string, itemId : string) => {
    const instances = this.stacksMap.get(key) || [];
    for(let instance of instances) {
      if(instance.id === itemId) {
        instance.focusedOn = false;
        break;
      } 
    }
    if(this.appFocusEl) {
      this.renderer.removeChild(this.desktop.nativeElement, this.appFocusEl);
      this.appFocusEl = null!;
    }
  }

  onDragStart(app_id : number ,row : number, column : number) {
    this.draggedPosition = { row : row , column : column};
    this.draggedId = app_id;
    this.dragSource = this.desktopTreeObj;
  }

  onDragOver(event : DragEvent) {
    event.preventDefault();
  }


  onDrop(event : DragEvent, row : number, column : number) {
    event.preventDefault();
    this.dragDestination = this.desktopTreeObj;
    this.draggedPositionEnd = {row : row , column : column};
    

    this.moveContentInTree();
    
  }

  moveContentInTree = () => {
    if(this.draggedId === undefined || this.dragSource === undefined || this.dragDestination === undefined) {
      this.draggedPosition = {'row' : -1, 'column' : -1}; this.draggedPositionEnd = {'row' : -1, 'column' : -1}; this.draggedId = null;
      this.dragSource = null; this.dragDestination = null;
      return;
    }
    const fromR = this.draggedPosition.row; const fromC = this.draggedPosition.column;
    const toR = this.draggedPositionEnd.row; const toC = this.draggedPositionEnd.column;

    if(this.dragDestination === this.dragSource) {
      if(this.dragSource === this.desktopTreeObj) {
        const dragTo = this.applicationsMatrix[toR][toC];
        this.applicationsMatrix[toR][toC] = this.draggedId;
        this.applicationsMatrix[fromR][fromC] = dragTo;
      }
    } else {
      if (this.dragSource === this.desktopTreeObj) {
        this.applicationsMatrix[fromR][fromC] = null;
      }
      if (this.dragDestination === this.desktopTreeObj) {
        this.applicationsMatrix[toR][toC] = this.draggedId;
      }
      
      if (this.draggedId !== null && this.dragSource !== null && this.dragDestination !== null) {
        const draggedContent = this.dragSource.content.get(this.draggedId);
        this.dragSource.content.delete(this.draggedId);
        if(draggedContent !== undefined) this.dragDestination.content.set(this.draggedId, draggedContent);
        console.log(this.dragSource);
      }
    }

    this.draggedPosition = {'row' : -1, 'column' : -1};this.draggedPositionEnd = {'row' : -1, 'column' : -1}; this.draggedId = null;
    this.dragSource = null; this.dragDestination = null;
  }

  deleteDraggedItem = () => {
    console.log("delete this item "+this.draggedPosition + "?");
    const app_id = this.applicationsMatrix[this.draggedPosition.row][this.draggedPosition.column];
    if(app_id) this.deleteApp(app_id);
    this.draggedPosition = {'row' : -1, 'column' : -1};
  }

  deleteApp(app_id : number) {
    const app = this.applications.get(app_id);
    if(!app) return;
    if(!app.canDelete) {
      this.addNotification("cannot delete "+app.name, NotifType.Error);
      return;
    } else if (app.type === AppType.Folder){
      if(app.name === 'Experience' && this.stacksMap.has(AppType.File.toString())) {
        this.addNotification("unable to delete '"+app.name+"', it is in use.", NotifType.Warning);
        return;
      }
      for(let folder of this.stacksMap.get(AppType.Folder.toString()) || []) {
        if(folder.name === app.name) {
          this.addNotification("unable to delete '"+app.name+"', it is in use.", NotifType.Warning);
          return;
        }
      }
      // this.desktopFolders.delete(app.name);
      this.deleteFolderFile(app.name);
    } else if (this.stacksMap.has(app.name)) {
      this.addNotification("cannot delete '"+app.name+"', it is open", NotifType.Warning);
      return;
    }
    // this.deletedApps.set(this.dagge, app);
    // this.applicationsMatrix.delete(this.draggedIndex);
  }

  deleteFolderFile(name : string) {
    if(name === 'Experience' && this.stacksMap.has(AppType.File.toString())) {
      this.addNotification("unable to delete '"+name+"', it is in use.", NotifType.Warning);
      return;
    }
    for(let folder of this.stacksMap.get(AppType.Folder.toString()) || []) {
      if(folder.name === name) {
        this.addNotification("unable to delete '"+name+"', it is in use.", NotifType.Warning);
        return;
      }
    }
    // this.desktopFolders.delete(name);
  }

  restoreApp = (key : number) => {
    const app = this.deletedApplications.get(key);
    if(!app) return;
    // if(app.type === AppType.Folder) this.desktopFolders.add(app.name);
    for(let c=0; c<this.gridColumns; c++) {
      for(let r =0; r<this.gridRows; r++) {
        if(!this.applicationsMatrix[r][c]) {
          this.applicationsMatrix[r][c] = app.id;
          this.deletedApplications.delete(key);
          return;
        }
      }
    }
    
  }
}