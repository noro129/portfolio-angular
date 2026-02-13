import { NgClass, NgStyle, NgIf } from '@angular/common';
import { AfterViewInit, Component, ElementRef, EventEmitter, HostListener, Input, OnDestroy, OnInit, Output, Renderer2, ViewChild } from '@angular/core';
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
  @ViewChild("connectWindow", {static : false}) connectWindow !: ElementRef;
  @Output() openApp = new EventEmitter<number>();
  @Output() addNotification = new EventEmitter<{message : string, type : NotifType}>();
  openItems : Set<ElementRef<HTMLElement>> = new Set<ElementRef<HTMLElement>>;
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
  musicIsPlaying = true; nextMusic = false; prevMusic = false; musicTrackLength = 203; musicElapsedTime = 0; dragSeekBar = false;
  selectedWeather = ''; weatherIcon = ''; weatherDegree = 0; weatherCardDate = '';
  
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
            this.openItems.add(spanItem);
            this.renderer.setProperty(revealButton, 'textContent', '▲');
            this.renderer.setStyle(subItemsContainerDiv, 'max-height', `${menuItem.content.length*25}px`);
          } else {
            this.openItems.delete(spanItem);
            this.renderer.setProperty(revealButton, 'textContent', '▼');
            this.renderer.setStyle(subItemsContainerDiv, 'max-height', '0');
          }
        })
      } else {
        this.renderer.setStyle(spanItem, 'cursor', 'pointer');
        this.renderer.listen(spanItem, 'click', () => {
          this.open(menuItem.item_name);
          this.menuToggle();
        })
      }
      this.renderer.appendChild(el, container);
    }
  }

  onMouseDown(event : MouseEvent, bar : HTMLElement) {
    const barWidth = bar.getBoundingClientRect().width;
    const pxPerSec = barWidth / this.musicTrackLength;
    const startX = event.clientX;
    const startSec = this.musicElapsedTime;
    this.dragSeekBar = true;
    
    const onMouseMove = (event : MouseEvent) => {
      const deltaPx = event.clientX - startX;
      const deltaSec = Math.floor(deltaPx / pxPerSec);
      if(deltaSec<0) {
        this.musicElapsedTime = Math.max(0, startSec + deltaSec);
      } else {
        this.musicElapsedTime = Math.min(this.musicTrackLength, startSec + deltaSec);
      }
    }

    const onMouseUp = () => {
      this.dragSeekBar = false;
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    }

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  }

  moveSeekBar(event : MouseEvent) {
    const el = event.currentTarget as HTMLElement;
    const rect = el.getBoundingClientRect();
    const width = rect.width;
    const x = event.clientX - rect.left;

    this.musicElapsedTime = Math.floor(this.musicTrackLength * x / width);
  }

  menuToggle(){
    if(this.showMenu) {
      this.openItems.forEach((item : any) => {
        const el = item.nativeElement || item;
        el.dispatchEvent(new MouseEvent('click', {bubbles : true}));
      })
    }
    this.showMenu = !this.showMenu;
    
  }

  get trackLength() : string {
    const minutes = Math.floor(this.musicTrackLength / 60);
    const seconds = this.musicTrackLength - 60*minutes;
    if(seconds < 10) return '0' + minutes+':0'+seconds;
    return '0' + minutes+':'+seconds;
  }

  get elapsedTime() : string {
    const minutes = Math.floor(this.musicElapsedTime / 60);
    const seconds = this.musicElapsedTime - 60*minutes;
    if(seconds < 10) return '0' + minutes+':0'+seconds;
    return '0' + minutes+':'+seconds;
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
    if(this.musicIsPlaying) this.playingMusic();
  }

  playingMusic() {
    if(this.musicElapsedTime === this.musicTrackLength) {
      this.playNextMusic();
      this.musicElapsedTime = 0;
    }
    if(!this.musicIsPlaying) return;
    if(!this.dragSeekBar) this.musicElapsedTime++;
    
    setTimeout(()=>{
      this.playingMusic();
    },1000);
  }

  playPrevMusic() {
    if(this.prevMusic || this.nextMusic) return;
    this.prevMusic = true;
    this.musicElapsedTime = 0;
    this.musicTrackLength = Math.floor(Math.random()*121) + 120;
    setTimeout(() => {this.prevMusic = false;}, 400);
  }

  playNextMusic() {
    if(this.prevMusic || this.nextMusic) return;
    this.nextMusic = true;
    this.musicElapsedTime = 0;
    this.musicTrackLength = Math.floor(Math.random()*121) + 120;
    setTimeout(() => {this.nextMusic = false;}, 400);
  }

  powerOff() {
    this.cover = true;
    this.menuToggle();
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
    this.menuToggle();
    this.setWatch();
    this.setWeather();
    this.playingMusic();
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

  setWeather() {
    const weatherList = ['sunny', 'night time', 'cloudy', 'rainy'];
    const weatherIconList = ['sunny.png', 'night-time.png', 'cloudy.png', 'rainy.png'];
    const minDegree = [20, 10, 6, 10];
    const maxDegree = [40, 25, 25, 20];
    const randInt = Math.floor(Math.random() * 4);
    
    this.selectedWeather = weatherList[randInt];
    this.weatherIcon = weatherIconList[randInt];
    this.weatherDegree = Math.floor(Math.random() * (maxDegree[randInt] - minDegree[randInt] + 1)) + minDegree[randInt];

    const months = ["January", "February", "Mars", "April", "May", "June", "Jully", "August", "Sptember", "October", "November", "December"]; 
    const weekdays: string[] = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const today = new Date();

    this.weatherCardDate = weekdays[today.getDay()] + ' ' + today.getDate() + ' ' + months[today.getMonth()] ;

  }

  open(appName : string) {
    switch (appName) {
      case "bloDest" : 
        this.openApp.emit(-999);
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
      if(this.showMenu) {
        this.openItems.forEach((item : any) => {
          const el = item.nativeElement || item;
          el.dispatchEvent(new MouseEvent('click', {bubbles : true}));
        })
        this.showMenu = false;
      }
    }
  }

  @HostListener('document:keydown')
  onKeyPressed(){
    if(this.cover && !this.shuttingDown && !this.showConnectWindow) {
      this.connectWindow.nativeElement.focus();
      this.showConnectWindow = true;
      setTimeout(()=>this.connectWindow.nativeElement.value = "", 50);
    }
  }
}
