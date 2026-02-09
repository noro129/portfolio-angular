import { NgClass, NgFor, NgIf } from '@angular/common';
import { Component, HostListener, OnInit, ViewChild, Renderer2, ElementRef } from '@angular/core';
import { Application } from '../../models/Application';
import { AppType } from '../../models/AppType';
import { ActiveItemsPanelComponent } from "../active-items-panel/active-items-panel.component";
import { OpenInstance } from '../../models/OpenInstance';
import { ApplicationsComponent } from "../applications/applications.component";
import { AppsObject } from '../../models/AppsObject';
import { NotificationComponent } from "../notification/notification.component";
import { NotifType } from '../../models/NotifType';
import { Notification } from '../../models/Notification';
import { HttpClient } from '@angular/common/http';
import { Experience } from '../../models/Experience';

@Component({
  selector: 'app-desktop',
  imports: [NgFor, NgIf, NgClass,
    ActiveItemsPanelComponent, ApplicationsComponent, NotificationComponent],
  templateUrl: './desktop.component.html',
  styleUrl: './desktop.component.scss'
})
export class DesktopComponent implements OnInit{
  @ViewChild("desktop" ,{ static: true }) desktop!: ElementRef;
  day = 1;
  weekDay = "Sunday";
  XOffsetPosition = 150;
  YOffsetPosition = 50;
  ZOffsetPosition = 10;
  gridColumns = 21;
  gridRows = 10;
  appFocusEl !: HTMLElement;
  readonly applications : Application[] = [
      {
        'id' : 0,
        'name' : 'Projects',
        'type' : AppType.Folder,
        'systemApp' : false,
        'icon' : './folder.png',
        'xPosition' : 0,
        'yPosition' : 0,
        'defaultHeight' : 450,
        'defaultWidth' : 700,
        'resizeable' : true
      },
      {
        'id' : 1,
        'name' : 'Experience',
        'type' : AppType.Folder,
        'systemApp' : false,
        'icon' : './folder.png',
        'xPosition' : 1,
        'yPosition' : 0,
        'defaultHeight' : 450,
        'defaultWidth' : 700,
        'resizeable' : true
      },
      {
        'id' : 2,
        'name' : 'WhoAmI',
        'type' : AppType.Application,
        'systemApp' : true,
        'icon' : './question-mark.png',
        'xPosition' : 2,
        'yPosition' : 0,
        'defaultHeight' : 600,
        'defaultWidth' : 460,
        'resizeable' : false
      },
      {
        'id' : 3,
        'name' : 'CMD',
        'type' : AppType.Application,
        'systemApp' : true,
        'icon' : './command-line.png',
        'xPosition' : 3,
        'yPosition' : 0,
        'defaultHeight' : 450,
        'defaultWidth' : 800,
        'resizeable' : true
      },
      {
        'id' : 4,
        'name' : 'bin',
        'type' : AppType.Application,
        'systemApp' : true,
        'icon' : './trash-can.png',
        'xPosition' : 4,
        'yPosition' : 0,
        'defaultHeight' : 450,
        'defaultWidth' : 700,
        'resizeable' : true
      }
  ];
  applicationsMatrix = new Map<number, AppsObject>();
  notifications = new Map<string, Notification>();
  deletedApps = new Map<number, AppsObject>();
  stacksMap = new Map<string, OpenInstance[]>;
  draggedIndex =-1;
  hoveredAppPosition = {'row' : -1, 'column' : -1};

  constructor(private renderer : Renderer2, private http : HttpClient) {
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
      const instance :OpenInstance = { id : uuid, name : app.name, hidden : false, icon : app.icon, windowWidth : app.defaultWidth, windowHeight : app.defaultHeight, positionX : this.XOffsetPosition, positionY : this.YOffsetPosition, positionZ : this.ZOffsetPosition, focusedOn : false, resizeable : app.resizeable};
      this.XOffsetPosition = this.XOffsetPosition + 10;
      this.YOffsetPosition = this.YOffsetPosition + 10;
      this.ZOffsetPosition++;
      if(app.type === AppType.Folder) {
        if(this.stacksMap.has(AppType.Folder.toString())){
          this.stacksMap.get(AppType.Folder.toString())?.unshift(instance);
        } else {
          this.stacksMap.set(AppType.Folder.toString(), [instance]);
        }
      } else {
        if(this.stacksMap.has(app.name)){
          this.stacksMap.get(app.name)?.unshift(instance);
        } else {
          this.stacksMap.set(app.name, [instance]);
        }
      }
      app.focused = false;
      break;
    }
  }

  ngOnInit(): void {
    this.setDate();
    for(let appIndex = 0; appIndex<this.applications.length; appIndex++) {
      const app = this.applications[appIndex];
      const index = app.yPosition + app.xPosition*this.gridColumns;
      this.applicationsMatrix.set(index, {
        'id' : app.id,
        'name' : app.name,
        'icon' : app.icon,
        'type' : app.type,
        'focused' : false,
        'systemApp' : app.systemApp,
        'defaultHeight' : app.defaultHeight,
        'defaultWidth' : app.defaultWidth,
        'resizeable' : app.resizeable
      });
    }
    //app not on desktop
    this.applicationsMatrix.set(-1, {
      'id' : -1,
      'name' : 'BloDest',
      'icon' : './BloDest.png',
      'type' : AppType.Application,
      'systemApp' : false,
      'focused' : false,
      'defaultHeight' : 700,
      'defaultWidth' : 700,
      'resizeable' : false
    });

    this.http.get<Experience[]>("./experience.json").subscribe({
          next: (response) => {
            let id = -2;
            for(let res of response) {
              this.applicationsMatrix.set(id, {
                'id' : id,
                'name' : res.company,
                'icon' : './file.png',
                'type' : AppType.File,
                'systemApp' : false,
                'focused' : false,
                'defaultHeight' : 700,
                'defaultWidth' : 600,
                'resizeable' : true
              });
              id--;
            }
          },
          error: (error) => {
            console.log(error);
          }
    });
  }

  addNotification(message : string, notifType : NotifType){
    const uuid = crypto.randomUUID();
    this.notifications.set(uuid, {id : uuid, message : message, type : notifType});
    setTimeout(()=>{
      this.notifications.delete(uuid);
    },2500);
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

  openItem = (id : number) => {
    this.open(id);
  }

  open(index : number) {
    const toOpen = this.applicationsMatrix.get(index);
    if(!toOpen) return;
    const uuid = crypto.randomUUID();
    const app : OpenInstance = {id : uuid, name : toOpen.name, hidden : false, icon : toOpen.icon, windowWidth : toOpen.defaultWidth, windowHeight : toOpen.defaultHeight, positionX : this.XOffsetPosition, positionY : this.YOffsetPosition, positionZ : this.ZOffsetPosition, focusedOn : false, resizeable : toOpen.resizeable};
    this.XOffsetPosition = this.XOffsetPosition + 10;
    this.YOffsetPosition = this.YOffsetPosition + 10;
    this.ZOffsetPosition++;
    if(toOpen.type === AppType.Folder) {
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
    toOpen.focused = false;
  }

  removeItem = (key : string, itemId : string)  => {
    const val = this.stacksMap.get(key) || [];
    var index = val.findIndex(item => item.id === itemId);
    if(index == -1) return;
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
      if(dragTo && dragTo.name === 'bin') {
        draggedApp.focused = false;
        if(draggedApp.systemApp) {
          this.addNotification("cannot delete "+draggedApp.name, NotifType.Error);
          return;
        } else if (draggedApp.type === AppType.Folder){
          for(let folder of this.stacksMap.get(AppType.Folder.toString()) || []) {
            if(folder.name === draggedApp.name) {
              this.addNotification("unable to delete '"+draggedApp.name+"', it is in use.", NotifType.Warning);
              return;
            }
          }
        } else if (this.stacksMap.has(draggedApp.name)) {
          this.addNotification("cannot delete '"+draggedApp.name+"', it is open", NotifType.Warning);
          return;
        }
        this.deletedApps.set(this.draggedIndex, draggedApp);
        this.applicationsMatrix.delete(this.draggedIndex);
        return;
      }
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

  isSameKey(key : number, row : number, column : number) : boolean {
    return row<this.gridRows && row>=0 && column>=0 && column<this.gridColumns && key === row*this.gridColumns + column;
  }

  restoreApp = (key : number) => {
    const app = this.deletedApps.get(key);
    if(!app) return;
    for(let c=0; c<this.gridColumns; c++) {
      for(let r =0; r<this.gridRows; r++) {
        if(!this.applicationsMatrix.has(r*this.gridColumns + c)) {
          this.applicationsMatrix.set(r*this.gridColumns + c, app);
          this.deletedApps.delete(key);
          return;
        }
      }
    }
    
  } 
}