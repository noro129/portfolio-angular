import { AfterViewInit, Component, ElementRef, HostListener, Input, Renderer2, ViewChild } from '@angular/core';
import { OpenInstance } from '../../models/OpenInstance';
import { NgStyle, NgIf } from '@angular/common';
import { AppFocusService } from '../../services/app-focus.service';

@Component({
  selector: 'app-window',
  imports: [NgStyle, NgIf],
  templateUrl: './window.component.html',
  styleUrl: './window.component.scss',
  providers: [AppFocusService]
})
export class WindowComponent implements AfterViewInit{
  @ViewChild("window") window!: ElementRef<HTMLDivElement>;
  @ViewChild("header") header!: ElementRef;
  @ViewChild("contextmenu", {static : false}) contextmenu!: ElementRef;
  @Input() openInstance !: OpenInstance;
  @Input() instanceType !: string;
  @Input() removeOpenInstance !: (key : string, openInstanceId : string) => void;
  @Input() putFront !: (key : string, openInstanceId : string) => void;
  isDragging = false;
  xOffset=0;
  yOffset=0;
  showContextMenu = false;

  @HostListener('document:click', ['$event'])
  onClick(event : MouseEvent) {
    if(this.el.nativeElement.contains(event.target)) {
      this.putFront(this.instanceType, this.openInstance.id);
      this.appFocusService.notifyApp(true);
    } else {
      this.appFocusService.notifyApp(false);
    }
    this.showContextMenu = false;
  }

  @HostListener('document:contextmenu', ['$event'])
  onRightClick(event : MouseEvent) {
    if(!this.header) return;
    const headerRect = this.header.nativeElement.getBoundingClientRect();
    const x = event.clientX;
    const y = event.clientY;
    if(x>=headerRect.left && x<=headerRect.right && y>=headerRect.top && y<=headerRect.bottom) {
      event.preventDefault();
      this.showContextMenu = true;
      requestAnimationFrame(()=> {
        this.renderer.setStyle(this.contextmenu.nativeElement, 'left', `${event.clientX}px`);
        this.renderer.setStyle(this.contextmenu.nativeElement, 'top', `${event.clientY}px`);
      });
    } else {
      this.showContextMenu = false;
    }
    
    
  }

  constructor(private el : ElementRef, private appFocusService : AppFocusService, private renderer : Renderer2) {}

  ngAfterViewInit(): void {
    document.addEventListener('mousemove', this.onMouseMove);
    document.addEventListener('mouseup', this.endDrag);
  }
  
  startDrag(event : MouseEvent) {
    this.isDragging = true;
    this.putFront(this.instanceType, this.openInstance.id);
    const rect = this.window.nativeElement.getBoundingClientRect();
    this.xOffset = event.clientX - rect.left;
    this.yOffset = event.clientY - rect.top;
  }

  endDrag = () => {
    this.isDragging = false;
    this.xOffset=0;
    this.yOffset=0;
  }

  onMouseMove = (event : MouseEvent) => {
    if(!this.isDragging) return;
    const el = this.window.nativeElement;
    el.style.left = `${event.clientX - this.xOffset}px`;
    el.style.top = `${event.clientY - this.yOffset}px`;
  }

  hide() {
    this.openInstance.hidden = true;
  }

  close() {
    this.removeOpenInstance(this.instanceType, this.openInstance.id);
  }
}
