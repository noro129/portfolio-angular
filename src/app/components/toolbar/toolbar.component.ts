import { NgClass, NgStyle, NgIf } from '@angular/common';
import { Component, ElementRef, EventEmitter, HostListener, Input, OnDestroy, OnInit, Output, Renderer2, ViewChild } from '@angular/core';
import { MenuItem } from '../../models/MenuItem';
import { HttpClient } from '@angular/common/http';
import { NotifType } from '../../models/NotifType';

@Component({
  selector: 'app-toolbar',
  imports: [NgClass, NgStyle, NgIf],
  templateUrl: './toolbar.component.html',
  styleUrl: './toolbar.component.scss'
})
export class ToolbarComponent implements OnInit, OnDestroy {
  @ViewChild("menuItemsManager") menuItemsManager !: ElementRef<HTMLDivElement>;
  @Output() openApp = new EventEmitter<number>();
  @Output() addNotification = new EventEmitter<{message : string, type : NotifType}>();
  battery = Math.floor(Math.random()*101);
  readonly fullName = "Oussama Errazi";
  readonly occupation = "software engineer";
  dateDay = "12";
  dateMonth = "06";
  dateYear = "2025";
  time = "12:09";
  currentHour = 0; currentMinute = 0; currentSecond = 0;
  showMenu = false;
  private interval : any;
  menuItems!: MenuItem[];
  cover = false;
  shuttingDown = false;
  info = '';
  
  constructor(private http : HttpClient, private renderer : Renderer2, private el : ElementRef) {}

  ngOnInit(): void {
    this.http.get<MenuItem[]>("./menu-items.json").subscribe({
      next: (response) =>{
        this.menuItems = response;
        this.fillTheMenu(this.menuItemsManager.nativeElement, this.menuItems, 0);
      }
    });
    this.interval = setInterval(
      ()=>{
        const now = new Date();
        this.dateYear = now.getFullYear().toString();
        this.dateMonth = (now.getMonth()+1).toString();
        if(this.dateMonth.length == 1) this.dateMonth = "0"+this.dateMonth;
        this.dateDay = now.getDate().toString();
        if(this.dateDay.length === 1) this.dateDay = "0"+this.dateDay;

        this.time = now.getMinutes().toString();
        if(now.getMinutes()<10) this.time = ":0"+this.time;
        else this.time = ":"+this.time;
        this.time = now.getHours()+this.time;
        if(this.time.length===4) this.time="0"+this.time;
      },
      1000
    );

  }

  ngOnDestroy(): void {
    clearInterval(this.interval);
  }

  fillTheMenu(el: HTMLDivElement, menuItems : MenuItem[] , leftMargin : number) {
    if(!menuItems) return;
    for(let menuItem of menuItems) {
      const container = this.renderer.createElement("div");
      this.renderer.addClass(container, "item");
      let spanItem = this.renderer.createElement("span");
      if(menuItem.item_name.endsWith(".pdf")) {
        const aTag = this.renderer.createElement("a");
        this.renderer.setAttribute(aTag, 'download', menuItem.item_name);
        this.renderer.setAttribute(aTag, 'href', menuItem.item_name);
        this.renderer.setStyle(aTag, 'all', 'unset');
        this.renderer.appendChild(spanItem, aTag);
        this.renderer.listen(spanItem, 'click', () => {aTag.click()});
      }
      const spanTextContent = this.renderer.createText(menuItem.item_name);
      this.renderer.addClass(spanItem, "item-name");
      this.renderer.setStyle(spanItem, "margin-left", `${leftMargin}px`);
      this.renderer.appendChild(spanItem, spanTextContent);
      this.renderer.appendChild(container, spanItem);
      if(menuItem.content) {
        const subItemsContainerDiv = this.renderer.createElement("div");
        this.renderer.addClass(subItemsContainerDiv, "sub-items-content");
        this.fillTheMenu(subItemsContainerDiv, menuItem.content, leftMargin+10);
        this.renderer.appendChild(container, subItemsContainerDiv);
        const revealButton = this.renderer.createElement("span");
        const revealIcon = this.renderer.createText("▼");
        this.renderer.addClass(revealButton, "reveal-hide-button");
        this.renderer.appendChild(revealButton, revealIcon);
        this.renderer.appendChild(spanItem, revealButton);

        this.renderer.listen(spanItem, 'click', () => {
          if(revealButton.textContent === '▼') {
            this.renderer.setProperty(revealButton, 'textContent', '▲');
            this.renderer.setStyle(subItemsContainerDiv, 'max-height', `${menuItem.content.length*25}px`);
          } else {
            this.renderer.setProperty(revealButton, 'textContent', '▼');
            this.renderer.setStyle(subItemsContainerDiv, 'max-height', '0');
          }
        })
      } else {
        this.renderer.setStyle(spanItem, 'cursor', 'pointer');
        this.renderer.listen(spanItem, 'click', () => {
          this.open(menuItem.item_name);
          this.showMenu = false;
        })
      }
      this.renderer.appendChild(el, container);
    }
  }

  menuToggle(){
    this.showMenu = !this.showMenu;
  }

  powerOff() {
    this.cover = true;
    this.showMenu = false;
    this.shuttingDown = true;
    setTimeout(() => {
      this.info = 'shutting down';
      setTimeout(() => {
        this.info += '.';
        setTimeout(() => {
          this.info += '.';
          setTimeout(() => {
            this.info += '.';
            setTimeout(() => {
              this.info = '';
            }, 500);
          },500);
        },500);
      },500);
    }, 200);
  }

  sleepMode() {
    this.cover = true;
    this.showMenu = false;
    this.setWatch();
  }

  setWatch() {
    const now = new Date();
    this.currentHour = now.getHours() % 12;
    this.currentMinute = now.getMinutes();
    this.currentSecond = now.getSeconds();
    console.log(this.currentHour + ' ' + this.currentMinute + ' ' + this.currentSecond);
  }

  open(appName : string) {
    switch (appName) {
      case "bloDest" : 
        this.openApp.emit(-1);
        break;
      case "github" :
        navigator.clipboard.writeText("https://github.com/noro129");
        this.addNotification.emit({message : 'copied!', type : NotifType.Info});
        break;
      case "email" :
        navigator.clipboard.writeText("errazi111@gmail.com");
        this.addNotification.emit({message : 'copied!', type : NotifType.Info});
        break;
      case "phone number" :
        navigator.clipboard.writeText("+212694105029");
        this.addNotification.emit({message : 'copied!', type : NotifType.Info});
        break;
      case "linkedin" :
        navigator.clipboard.writeText("https://www.linkedin.com/in/oussama-errazi/");
        this.addNotification.emit({message : 'copied!', type : NotifType.Info});
        break;
      default :
        return;
    }
  }

  @HostListener('document:click', ['$event'])
  clickout(event : MouseEvent) {
    if(!this.el.nativeElement.contains(event.target)){
      this.showMenu = false;
    }
  }
}
