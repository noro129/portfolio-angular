import { NgClass, NgFor, NgIf } from '@angular/common';
import { Component, HostListener, OnInit, ViewChild, Renderer2, ElementRef } from '@angular/core';
import { Application } from '../../models/Application';
import { AppType } from '../../models/AppType';
import { ActiveItemsPanelComponent } from "../active-items-panel/active-items-panel.component";
import { OpenInstance } from '../../models/OpenInstance';
import { ApplicationsComponent } from "../applications/applications.component";

@Component({
  selector: 'app-desktop',
  imports: [NgFor, NgIf, NgClass,
    ActiveItemsPanelComponent, ApplicationsComponent],
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
        'icon' : './folder.png',
        'xPosition' : 0,
        'yPosition' : 0,
        'defaultHeight' : 450,
        'defaultWidth' : 700
      },
      {
        'id' : 1,
        'name' : 'Experience',
        'type' : AppType.Folder,
        'icon' : './folder.png',
        'xPosition' : 1,
        'yPosition' : 0,
        'defaultHeight' : 450,
        'defaultWidth' : 700
      },
      {
        'id' : 2,
        'name' : 'WhoAmI',
        'type' : AppType.Application,
        'icon' : './question-mark.png',
        'xPosition' : 2,
        'yPosition' : 0,
        'defaultHeight' : 250,
        'defaultWidth' : 700
      },
      {
        'id' : 3,
        'name' : 'CMD',
        'type' : AppType.Application,
        'icon' : './command-line.png',
        'xPosition' : 3,
        'yPosition' : 0,
        'defaultHeight' : 250,
        'defaultWidth' : 700
      },
      {
        'id' : 4,
        'name' : 'Dr. Trash',
        'type' : AppType.Application,
        'icon' : './trash-can.png',
        'xPosition' : 4,
        'yPosition' : 0,
        'defaultHeight' : 250,
        'defaultWidth' : 700
      }
  ];
  applicationsMatrix = new Map<number, AppsObject>();
  stacksMap = new Map<string, OpenInstance[]>;
  draggedIndex =-1;
  hoveredAppPosition = {'row' : -1, 'column' : -1};

  constructor(private renderer : Renderer2) {
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
      const instance :OpenInstance = { id : uuid, name : app.name, hidden : false, icon : app.icon, windowWidth : app.defaultWidth, windowHeight : app.defaultHeight, positionX : this.XOffsetPosition, positionY : this.YOffsetPosition, positionZ : this.ZOffsetPosition, focusedOn : false};
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
        'defaultHeight' : app.defaultHeight,
        'defaultWidth' : app.defaultWidth
      });
    }
    //app not on desktop
    this.applicationsMatrix.set(-1, {
      'id' : -1,
      'name' : 'BloDest',
      'icon' : './BloDest.png',
      'type' : AppType.Application,
      'focused' : false,
      'defaultHeight' : 700,
      'defaultWidth' : 700
    });
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
    const toOpen = this.applicationsMatrix.get(index);
    if(!toOpen) return;
    const uuid = crypto.randomUUID();
    const app : OpenInstance = {id : uuid, name : toOpen.name, hidden : false, icon : toOpen.icon, windowWidth : toOpen.defaultWidth, windowHeight : toOpen.defaultHeight, positionX : this.XOffsetPosition, positionY : this.YOffsetPosition, positionZ : this.ZOffsetPosition, focusedOn : false};
    this.XOffsetPosition = this.XOffsetPosition + 10;
    this.YOffsetPosition = this.YOffsetPosition + 10;
    this.ZOffsetPosition++;
    if(toOpen.type === AppType.Folder) {
      if(this.stacksMap.has(AppType.Folder.toString())){
        this.stacksMap.get(AppType.Folder.toString())?.unshift(app);
      } else {
        this.stacksMap.set(AppType.Folder.toString(), [app]);
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
}

interface AppsObject {
  id : number;
  name : string;
  icon : string;
  type : AppType;
  focused : boolean;
  defaultHeight : number;
  defaultWidth : number;
}