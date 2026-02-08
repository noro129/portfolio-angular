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
  @ViewChild("watch", {static : false}) watch !: ElementRef<HTMLDivElement>;
  @ViewChild("bgWatch", {static : false}) bgWatch !: ElementRef<HTMLDivElement>;
  @Output() openApp = new EventEmitter<number>();
  @Output() addNotification = new EventEmitter<{message : string, type : NotifType}>();
  battery = Math.floor(Math.random()*101);
  readonly fullName = "Oussama Errazi";
  readonly occupation = "software engineer";
  dateDay = "12";
  dateMonth = "06";
  dateYear = "2025";
  time = "12:09";
  private WatchInterval !: any;
  showMenu = false;
  private interval : any;
  menuItems!: MenuItem[];
  cover = false; showConnectWindow = false; mouseLeft = true; connecting = false; emptyPassword = false;
  shuttingDown = false;
  info = '';
  musicIsPlaying = true; nextMusic = false; prevMusic = false;
  
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
    clearInterval(this.WatchInterval);
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

  toggleConnectWindow(b : boolean) {
    this.showConnectWindow = b;
  }

  connect(event : any) {
    if (event.target.value === '') {
      this.emptyPassword = true;
      setTimeout(()=>{this.emptyPassword = false;}, 200);
      return;
    }
    this.connecting = true;
    setTimeout(() => {
      this.cover = false;
      this.showConnectWindow = false;
      this.mouseLeft = true;
      this.connecting = false;
    }, 2000);
    
  }

  playPauseMusic() {
    this.musicIsPlaying = !this.musicIsPlaying;
  }

  playPrevMusic() {
    if(this.prevMusic || this.nextMusic) return;
    this.prevMusic = true;
    setTimeout(() => {this.prevMusic = false;}, 400);
  }

  playNextMusic() {
    if(this.prevMusic || this.nextMusic) return;
    this.nextMusic = true;
    setTimeout(() => {this.nextMusic = false;}, 400);
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
    }, 900);
  }

  sleepMode() {
    this.cover = true;
    this.showMenu = false;
    this.setWatch();
  }

  setWatch() {
    this.setWatchHands(this.watch.nativeElement);
    this.setWatchHands(this.bgWatch.nativeElement);

    this.WatchInterval = setInterval(()=> {
      this.setWatchHands(this.watch.nativeElement);
      this.setWatchHands(this.bgWatch.nativeElement);
    }, 1000);
  }

  setWatchHands(watch : HTMLDivElement) {
    const hours = watch.querySelector('.hours') as HTMLElement;
    const minutes = watch.querySelector('.minutes') as HTMLElement;
    const seconds = watch.querySelector('.seconds') as HTMLElement;

    const now = new Date();
    const hour = now.getHours() % 12;
    const minute = now.getMinutes();
    const second = now.getSeconds();

    this.renderer.setStyle(hours, 'transform' , 'translate(-50%, -50%) rotateZ('+(30*hour + 30*minute/60)+'deg)');
    this.renderer.setStyle(minutes, 'transform' , 'translate(-50%, -50%) rotateZ('+(6*minute + 6*second/60)+'deg)');
    this.renderer.setStyle(seconds, 'transform' , 'translate(-50%, -50%) rotateZ('+(6*second)+'deg)');
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

  @HostListener('document:keydown')
  onKeyPressed(){
    if(this.cover && !this.shuttingDown) this.showConnectWindow = true;
  }
}
