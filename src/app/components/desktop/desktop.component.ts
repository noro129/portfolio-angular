import { NgFor, NgIf } from '@angular/common';
import { Component, OnInit, ViewChild, Renderer2, ElementRef } from '@angular/core';
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
import DeletedItem from '../../models/DeletedItem';
import { ConfirmationWindowComponent } from '../confirmation-window/confirmation-window.component';
import { ConfirmationWindowService } from '../../services/confirmation-window.service';
import { Experience } from '../../models/Experience';
import CopyCutPaste from '../../models/CopyCutPaste';

@Component({
  selector: 'app-desktop',
  imports: [NgFor, NgIf,
    ActiveItemsPanelComponent, ApplicationsComponent, NotificationComponent, AppTileComponent, ContextMenuComponent, ConfirmationWindowComponent],
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
  applicationsMatrix !: number[][] | null[][];
  notifications = new Map<string, Notification>();
  deletedItems = new Map<number, DeletedItem>();
  stacksMap = new Map<string, OpenInstance[]>;
  draggedPosition = {row : -1, column : -1};draggedPositionEnd = {row : -1, column : -1}; draggedId : number | null = null; dragSource : ContentTreeStructure | null = null; dragDestination : ContentTreeStructure | null = null;
  AppType = AppType;
  contentTreeStructure : Map<number, ContentTreeStructure> = new Map<number, ContentTreeStructure>();
  openedFolders : Map<string, ContentTreeStructure> = new Map<string, ContentTreeStructure>();
  readonly desktopHomePath = ["root", "Desktop"]; appMatrixIsSet = false; desktopTreeObj !: ContentTreeStructure;
  readonly experienceFolderPath = ["root", "Desktop", "Experience"]; experienceIsSet = false;
  readonly projectsFolderPath = ["root", "Desktop", "Projects"]; projectsObjRef !: ContentTreeStructure; projectIsSet = false;
  readonly experienceData = "./experience.json"; experience : Map<number, Experience> = new Map<number, Experience>();
  readonly scriptData = "./script.json"; script : Map<number, Script> = new Map<number, Script>();
  id = 50;
  readonly copyCutPasteObj : CopyCutPaste = {
    app_id : null,
    source : null,
    destination : null,
    type : null
  }

  constructor(private renderer : Renderer2, private contextmenuService : ContextMenuService, private confirmationWindowService : ConfirmationWindowService) {
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
        this.insertAppData(jsonData, this.contentTreeStructure, 0, 0, 0);
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

  insertAppData(jsonData : any, treeNode : Map<number, ContentTreeStructure> | null, desktopDepthIndex : number, experienceDepthIndex : number, projectsDepthIndex : number) {
    if(!jsonData || treeNode===null) return;
    if (!this.appMatrixIsSet && desktopDepthIndex === this.desktopHomePath.length) this.setApplicationsMatrix(jsonData);
    if (!this.experienceIsSet && experienceDepthIndex === this.experienceFolderPath.length) this.setExperienceFolderContent(treeNode);
    for(let item of jsonData) {
      let content = new Map<number, ContentTreeStructure>();
      const app = {
          id : item.id,
          displayName : item.name,
          name : item.name,
          icon : item.icon,
          type : item.isFile ? AppType.File : (item.isFolder ? AppType.Folder : AppType.Application),
          canDelete : item.canDelete,
          extension : item.extension,
          defaultHeight : item.defaultHeight,
          defaultWidth : item.defaultWidth,
          resizeable : item.resizeable
      };
      let node : ContentTreeStructure = {
        application : app,
        content : content
      };
      if(item.name === this.desktopHomePath[this.desktopHomePath.length - 1] && desktopDepthIndex === this.desktopHomePath.length - 1) this.desktopTreeObj = node;
      if(item.name === this.projectsFolderPath[this.projectsFolderPath.length - 1] && projectsDepthIndex === this.projectsFolderPath.length - 1) this.projectsObjRef = node;
      treeNode.set(item.id, node);
      if(item.content !== null) {
        const desktopDepth = desktopDepthIndex + ( desktopDepthIndex < this.desktopHomePath.length && item.name === this.desktopHomePath[desktopDepthIndex] ? 1 : 0);
        const experienceDepth = experienceDepthIndex + ( experienceDepthIndex < this.experienceFolderPath.length && item.name === this.experienceFolderPath[experienceDepthIndex] ? 1 : 0);
        const projectDepth = projectsDepthIndex + ( projectsDepthIndex < this.projectsFolderPath.length && item.name === this.projectsFolderPath[projectsDepthIndex] ? 1 : 0);
        this.insertAppData(item.content, content, desktopDepth, experienceDepth, projectDepth);
      }
      this.applications.set(item.id,
        app
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
        let body = `company : ${item.company}\t\t${item.location}\n\n`+
        `from :   ${item.startDate}\n`+
        `to   :   ${item.endDate}\n\nDescription: \n`;
        item.description.forEach((el : string) => {
          body = body + ' - ' + el + '\n\n';
        });
        body = body + '\n\n\ntools & technologies :';
        item.tools_technologies.forEach((el : string) => {
          body = body + '  ' + el +',';
        });
        this.experience.set(id, {
          header : item.role.trim(),
          body : body+'\n',
          isBold : false,
          isItalic : false,
          isUnderlined : false
        });
        const app = {
            id : id,
            displayName : item.company,
            name : item.company,
            icon : "./file.png",
            type : AppType.File,
            canDelete : true,
            extension : ".txt",
            defaultHeight : 700,
            defaultWidth : 600,
            resizeable : true
        }
        content.set(
          id,
          {
            application : app,
            content : new Map<number, ContentTreeStructure>()
          }
        );
        this.applications.set(id,
          app
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
          label : "New Folder" , icon : './add.png', action : this.addFolder, disabled : false
        },
        {
          label : "New File" , icon : './add.png', action : this.addFile, disabled : false
        },
        {
          label : 'paste', icon : './paste.png', action : this.copyCutPasteObj.app_id === null ? this.nothing : this.paste, disabled : this.copyCutPasteObj.app_id === null
        }
      ])
  }

  nothing = () => {}

  addFolder = () => {
    this.addFolderFile(AppType.Folder, this.desktopTreeObj);
  }

  addFile = () => {
    this.addFolderFile(AppType.File, this.desktopTreeObj);
  }

  desktopCopyAction = (id : number) => {
    this.copyCutPasteObj.app_id = id;
    this.copyCutPasteObj.source = this.desktopTreeObj;
    this.copyCutPasteObj.type = 'copy';
  }

  desktopCutAction = (id : number) => {
    this.copyCutPasteObj.app_id = id;
    this.copyCutPasteObj.source = this.desktopTreeObj;
    this.copyCutPasteObj.type = 'cut';
  }

  paste = () => {
    this.copyCutPasteObj.destination = this.desktopTreeObj;
    this.copyCutPasteAction();
  }

  copyCutPasteAction = async () => {
    if(this.copyCutPasteObj.app_id === null || this.copyCutPasteObj.source === null || this.copyCutPasteObj.destination === null || this.copyCutPasteObj.type === null) {
      this.resetCopyPasteObj();
      return;
    }
    const id = this.copyCutPasteObj.app_id;
    const source = this.copyCutPasteObj.source;
    const destination = this.copyCutPasteObj.destination;
    const app = source.content.get(id);
    if(!app) return;
    const isSubF = app.application.type === AppType.Folder && this.isSubFolder(app, destination);
    if(this.copyCutPasteObj.source !== this.copyCutPasteObj.destination && ! isSubF) {
      if(this.copyCutPasteObj.type === 'cut') {
        if(app.application.type !== AppType.Application) {
          const count = this.existsAnother(destination, app.application.displayName, app.application.type, id);
          if(count !== 0) {
            const answer = await this.confirmationWindowService.ask((app.application.type === AppType.Folder ? 'Folder' : 'File' ) + ' exists in destination, want to replace it?');
            if(answer) {
              this.deleteAppWithName(destination, app.application.displayName);
            } else {
              const asnwer2 = await this.confirmationWindowService.ask((app.application.type === AppType.Folder ? 'Folder' : 'File' ) + ' exists in destination, rename to '+app.application.displayName +' '+ count + ' ?');
              if(asnwer2) {
                app.application.displayName = app.application.displayName+' '+count;
              } else {
                this.resetCopyPasteObj();
                return;
              }
            }
          }
        }
        source.content.delete(id);
        if(source === this.desktopTreeObj) {
          let found = false;
          for(let r=0; r<this.gridRows; r++) {
            for(let c=0; c<this.gridColumns; c++) {
              if(this.applicationsMatrix[r][c] === id) {
                this.applicationsMatrix[r][c] = null;
                found = true;
                break;
              }
            }
            if(found) break;
          }
        }
        if(app) destination.content.set(id, app);
        if(destination === this.desktopTreeObj) {
          let found = false;
          for(let c=0; c<this.gridColumns; c++) {
            for(let r=0; r<this.gridRows; r++) {
              if(this.applicationsMatrix[r][c] === null) {
                this.applicationsMatrix[r][c] = id;
                found = true;
                break;
              }
            }
            if(found) break;
          }
        }
      } else {
        const deepCopy = this.createDeepCopyOf(app);
        if(deepCopy.application.type !== AppType.Application) {
          const count = this.existsAnother(destination, deepCopy.application.displayName, deepCopy.application.type, deepCopy.application.id);
          if(count!==0) {
            const answer = await this.confirmationWindowService.ask((deepCopy.application.type === AppType.Folder ? 'Folder' : 'File' ) + ' exists in destination, want to replace it?');
            if(answer) {
              this.deleteAppWithName(destination, deepCopy.application.displayName);
            } else {
              const asnwer2 = await this.confirmationWindowService.ask((deepCopy.application.type === AppType.Folder ? 'Folder' : 'File' ) + ' exists in destination, rename to '+deepCopy.application.displayName +' '+ count + ' ?');
              if(asnwer2) {
                deepCopy.application.displayName = deepCopy.application.displayName + ' ' + count;
              } else{
                this.resetCopyPasteObj();
                return;
              }
            }
          }
        }
        destination.content.set(deepCopy.application.id, deepCopy);
        if(destination === this.desktopTreeObj) {
          let found = false;
          for(let c=0; c<this.gridColumns; c++) {
            for(let r=0; r<this.gridRows; r++) {
              if(this.applicationsMatrix[r][c] === null) {
                this.applicationsMatrix[r][c] = deepCopy.application.id;
                found = true;
                break;
              }
            }
            if(found) break;
          }
        }
      }
    } else if(isSubF) {
      this.addNotification("destination folder is a sub folder of source folder", NotifType.Error);
    }

    this.resetCopyPasteObj();
  }

  isSubFolder(folder : ContentTreeStructure, subFolder : ContentTreeStructure) {
    let stack : ContentTreeStructure[] = [];
    stack.push(folder);
    while(stack.length !== 0) {
      const f = stack.pop();
      if(f === subFolder) return true;
      if(f !== undefined) {
        for(let v of f.content.values()) {
          stack.push(v);
        }
      }
    }
    return false;
  }

  resetCopyPasteObj() {
    this.copyCutPasteObj.app_id = null;
    this.copyCutPasteObj.source = null;
    this.copyCutPasteObj.destination = null;
    this.copyCutPasteObj.type = null;
  }

  deleteAppWithName(node : ContentTreeStructure, name : string) {
    if(node === this.desktopTreeObj) {
      let found =false;
      for(let c=0; c<this.gridColumns; c++){
        for(let r=0; r<this.gridRows; r++) {
          const id = this.applicationsMatrix[r][c];
          if(id!== null && this.applications.get(id)?.displayName === name) {
            this.applicationsMatrix[r][c] = null;
            found = true;
            break;
          }
        }
        if(found) break;
      }
    }
    for(let [k, v] of node.content) {
      if(v.application.displayName === name) {
        node.content.delete(k);
        return;
      }
    }
  }

  createDeepCopyOf(node : ContentTreeStructure) : ContentTreeStructure {
    while(this.applications.has(this.id)) this.id++;
    
    const subContentCopy = new Map<number, ContentTreeStructure>();
    for(let v of node.content.values()) {
      const n = this.createDeepCopyOf(v);
      subContentCopy.set(n.application.id, n);
    }
    const app = {
                  id: this.id,
                  displayName : node.application.displayName,
                  name : node.application.name,
                  icon : node.application.icon,
                  type : node.application.type,
                  canDelete : node.application.canDelete,
                  extension : node.application.extension,
                  defaultWidth : node.application.defaultWidth,
                  defaultHeight : node.application.defaultHeight,
                  resizeable : node.application.resizeable
                };
    if(node.application.type === AppType.File) {
      if(node.application.extension === '.txt') {
        const exp = this.experience.get(node.application.id);
        if(exp) this.experience.set(this.id, {...exp});
      } else {
        const scr = this.script.get(node.application.id);
        if(scr) this.script.set(this.id, {...scr});
      }
    }
    this.applications.set(this.id, app);
    return {
              application : app
              ,
              content : subContentCopy
            }
  }

  addFolderFile = (type : AppType, node : ContentTreeStructure) => {
    while(this.applications.has(this.id)) this.id++;
    const count = this.existsAnother(node, 'New '+(type === AppType.Folder ? 'Folder' : 'File'), type, this.id);
    const app = {
          id : this.id,
          displayName : 'New '+(type === AppType.Folder ? 'Folder' : 'File')+(count === 0 ? '' : ' '+count),
          name : 'New '+(type === AppType.Folder ? 'Folder' : 'File')+(count === 0 ? '' : ' '+count),
          icon : type === AppType.Folder ? "./folder.png" : "./file.png",
          type : type,
          canDelete : true,
          extension : type === AppType.Folder ? "" : ".txt",
          defaultHeight : type === AppType.Folder ? 450 : 700,
          defaultWidth : type === AppType.Folder ? 700 : 600,
          resizeable : true
    };
    this.applications.set(this.id, app);
    const subNode = {
      application : app,
      content : new Map<number, ContentTreeStructure>()
    }
    node.content.set(this.id, subNode);
    if(node === this.desktopTreeObj) {
      let added = false;
      for(let c=0; c<this.gridColumns; c++){
        for(let r=0; r<this.gridRows; r++){
          if(this.applicationsMatrix[r][c] === null) {
            this.applicationsMatrix[r][c] = this.id;
            added = true;
            break;
          }
        }
        if(added) break
      }
    }

    if(type === AppType.File) {
      this.experience.set(this.id, {header : '', body : '', isBold : false, isItalic : false, isUnderlined : false});
    }
    this.id++;
  }

  openItem = (id : number) => {
    this.openWithId(id);
  }

  openWithId(id : number) {
    const toOpen = this.applications.get(id);
    if(!toOpen) return;
    const uuid = crypto.randomUUID();
    const app : OpenInstance = {id : uuid, application : toOpen, hidden : false, windowWidth : toOpen.defaultWidth, windowHeight : toOpen.defaultHeight, positionX : this.XOffsetPosition, positionY : this.YOffsetPosition, positionZ : this.ZOffsetPosition, focusedOn : false};
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
      if(this.stacksMap.has(AppType.File.toString()+toOpen.extension)){
        this.stacksMap.get(AppType.File.toString()+toOpen.extension)?.unshift(app);
      } else {
        this.stacksMap.set(AppType.File.toString()+toOpen.extension, [app]);
      }
    }
    else {
      if(this.stacksMap.has(app.application.name)){
        this.stacksMap.get(app.application.name)?.unshift(app);
      } else {
        this.stacksMap.set(app.application.name, [app]);
      }
    }
  }

  getDesktopFolderNode(treeNode : Map<number, ContentTreeStructure> | undefined, name : string, depth : number) : ContentTreeStructure | undefined {
    if (!treeNode) return undefined;
    for(let v of treeNode.values()) {
      if (depth === this.desktopHomePath.length-1 && v.application.name === this.desktopHomePath[depth]) {
        for(let v2 of v.content?.values() || []) {
          if (v2.application.name === name) return v2;
        }
      }
      if(v.application.name === this.desktopHomePath[depth]) {
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
      this.resetDrag();
      return;
    }
    const fromR = this.draggedPosition.row; const fromC = this.draggedPosition.column;
    const toR = this.draggedPositionEnd.row; const toC = this.draggedPositionEnd.column;

    if(this.dragDestination === this.dragSource) {
      if(this.dragSource === this.desktopTreeObj) {
        const dragTo = this.applicationsMatrix[toR][toC];
        if(dragTo !== null && this.applications.get(dragTo)?.name === 'recycle bin'){
          this.draggedId!==null && this.deleteApp(this.draggedId);
        } else {
          this.applicationsMatrix[toR][toC] = this.draggedId;
          this.applicationsMatrix[fromR][fromC] = dragTo;
        }
      }
    } else {
      if (this.dragSource === this.desktopTreeObj) {
        this.applicationsMatrix[fromR][fromC] = null;
      }
      if (this.dragDestination === this.desktopTreeObj) {
        const dragTo = this.applicationsMatrix[toR][toC];
        if(dragTo !== null && this.applications.get(dragTo)?.name === 'recycle bin') {
          this.draggedId!==null && this.deleteApp(this.draggedId);
          this.resetDrag();
          return;
        } else if (dragTo !== null) {
          this.moveAppDown(toR, toC);
          this.applicationsMatrix[toR][toC] = this.draggedId;
        } else {
          this.applicationsMatrix[toR][toC] = this.draggedId;
        }
        
      }
      
      if (this.draggedId !== null && this.dragSource !== null && this.dragDestination !== null) {
        const draggedContent = this.dragSource.content.get(this.draggedId);
        this.dragSource.content.delete(this.draggedId);
        if(draggedContent !== undefined) this.dragDestination.content.set(this.draggedId, draggedContent);
        console.log(this.dragSource);
      }
    }

    this.resetDrag();
  }

  moveAppDown(r : number , c : number) {
    const nextR = (r+1)%this.gridRows;
    const nextC = c + Math.floor((r+1)/this.gridRows);
    if(this.applicationsMatrix[nextR][nextC] !== null) {
      this.moveAppDown(nextR, nextC);
      this.applicationsMatrix[nextR][nextC] = this.applicationsMatrix[r][c];
    } else {
      this.applicationsMatrix[nextR][nextC] = this.applicationsMatrix[r][c];
      this.applicationsMatrix[r][c] = null;
    }
  }

  resetDrag() {
    this.draggedPosition = {'row' : -1, 'column' : -1};this.draggedPositionEnd = {'row' : -1, 'column' : -1}; this.draggedId = null;
    this.dragSource = null; this.dragDestination = null;
  }

  deleteDraggedItem = () => {
    if(this.draggedId != null) this.deleteApp(this.draggedId);
    this.resetDrag();
  }

  deleteWithId = (app_id : number) => {
    const isInDesktop = this.desktopTreeObj.content.has(app_id);
    this.deleteApp(app_id);
    this.resetDrag();
    if(isInDesktop) {
      for(let r=0; r<this.gridRows; r++) {
        for(let c=0; c<this.gridColumns; c++) {
          if(this.applicationsMatrix[r][c] === app_id) {
            this.applicationsMatrix[r][c]=null;
            return;
          }
        }
      }
    }
    
  }

  deleteApp = (app_id : number) => {
    const app = this.applications.get(app_id);
    let itemNodeRef : ContentTreeStructure | null = null;
    let parentNodeRef : ContentTreeStructure | null = null;
    if(!app) return;
    if(!app.canDelete) {
      this.addNotification("cannot delete "+app.displayName+app.extension, NotifType.Error);
      return;
    } else if (app.type === AppType.Folder){
      if(this.isFolderUsed(app_id)) {
        this.addNotification("unable to delete '"+app.displayName+"', it is in use.", NotifType.Warning);
        return;
      }
      
    } else {
      if(app.type === AppType.File && this.isFileOpen(app.id)) {
        this.addNotification("cannot delete '"+app.displayName+"', it is open", NotifType.Warning);
        return;
      } else if(app.type !== AppType.File && this.stacksMap.has(app.name)) {
        this.addNotification("cannot delete '"+app.displayName+"', it is open", NotifType.Warning);
        return;
      }
    }
    parentNodeRef = this.getParentNodeOf(app_id);
    itemNodeRef = parentNodeRef?.content.get(app_id) || null;
    if(itemNodeRef !== null && parentNodeRef !== null) {
      parentNodeRef.content.delete(app_id);
      this.deletedItems.set(app_id, {
        id : app_id,
        treeNodeRef : itemNodeRef,
        parentNodeRef : parentNodeRef
      })
    }
    if(this.draggedPosition.row !== -1) {
      this.applicationsMatrix[this.draggedPosition.row][this.draggedPosition.column] = null;
    }
  }

  isFolderUsed(folder_id : number) : boolean {

    return false;
  }

  isFileOpen(file_id : number) : boolean {
    const file_ext = this.applications.get(file_id)?.extension;
    if(!this.stacksMap.has(AppType.File.toString()+file_ext)) return false;
    else {
      for(let file of this.stacksMap.get(AppType.File.toString()+file_ext) || []) {
        if(file.application.id === file_id) return true;
      }
    }
    return false;
  }

  getParentNodeOf(item_id : number) : ContentTreeStructure | null {
    let stack : ContentTreeStructure[] = [];
    this.contentTreeStructure.forEach(c=> {
      stack.push(c);
    })
    while(stack.length !== 0) {
      const node = stack.pop();
      if(node?.content === null || node?.content.size === 0) continue;
      else if (node?.content.has(item_id)) return node;
      else {
        node?.content.forEach(c=> {
          stack.push(c);
        })
      }
    }
    return null;
  }

  restoreApp = (id : number) => {
    const parentNode = this.deletedItems.get(id)?.parentNodeRef;
    const node = this.deletedItems.get(id)?.treeNodeRef;
    if(parentNode === undefined || node === undefined) return;
    if(this.nodeExists(parentNode)) {
      parentNode.content.set(id, node);
      this.deletedItems.delete(id);
      if(parentNode === this.desktopTreeObj) {
        for(let c=0; c<this.gridColumns; c++) {
          for(let r =0; r<this.gridRows; r++) {
            if (this.applicationsMatrix[r][c] === null) {
              this.applicationsMatrix[r][c] = id;
              return;
            }
          }
        }
      }
    }
    else {
      this.desktopTreeObj.content.set(id, node);
      this.deletedItems.delete(id);
      for(let c=0; c<this.gridColumns; c++) {
        for(let r =0; r<this.gridRows; r++) {
          if (this.applicationsMatrix[r][c] === null) {
            this.applicationsMatrix[r][c] = id;
            return;
          }
        }
      }
    }
    
    
  }

  nodeExists(node : ContentTreeStructure) : boolean {
    if(node === null) return false;
    let stack : ContentTreeStructure[] = [];
    this.contentTreeStructure.forEach(c=> {
      stack.push(c);
    })
    while(stack.length !== 0) {
      const n = stack.pop();
      if(n === node) return true;
      if(n !== undefined && n?.content !== null && n.content.size !== 0) {
        n.content.forEach(c=> {
          stack.push(c);
        })
      }
    }
    return false;
  }

  editAppName = async (app_id : number, new_name : string) : Promise<boolean> => {
    const app = this.applications.get(app_id);
    if(app === undefined) return false;
    const res = this.existsAnother(this.dragSource, new_name, app.type, app_id);
    if( res !== 0) {
      const answer = await this.confirmationWindowService.ask((app.type === AppType.Folder ? 'folder' : 'file') +' \'' +new_name+ '\' exists, rename to \''+new_name+' '+res+'\' ?');
      if(answer) app.displayName = new_name + ' '+res;
      return answer;
    }
    else {
      app.displayName = new_name;
      return true;
    }
  }

  existsAnother(node : ContentTreeStructure | null, name : string, type : AppType, exclude_id : number) :number {
    let name_set = new Set<string>();
    if(node) {
      for( let v of node.content.values()) {
        if(v.application.type === type && v.application.id !== exclude_id) {
          name_set.add(v.application.displayName);
        }
      }
    } else {
      for( let v of this.desktopTreeObj.content.values()) {
        if(v.application.type === type && v.application.id !== exclude_id) {
          name_set.add(v.application.displayName);
        }
      }
    }

    if(!name_set.has(name)) return 0;
    
    let count = 1;
    while(name_set.has(name + ' ' + count)) {
      count++;
    }
    return count;
  }
}