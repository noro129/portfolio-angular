import { AfterViewInit, Component, ElementRef, HostListener, Input, Renderer2, ViewChild } from '@angular/core';
import { OpenInstance } from '../../models/OpenInstance';
import { NgStyle } from '@angular/common';
import { AppFocusService } from '../../services/app-focus.service';
import { ContextMenuService } from '../../services/context-menu.service';

@Component({
  selector: 'app-window',
  imports: [NgStyle],
  templateUrl: './window.component.html',
  styleUrl: './window.component.scss',
  providers: [AppFocusService]
})
export class WindowComponent implements AfterViewInit{
  @ViewChild("window") window!: ElementRef<HTMLDivElement>;
  @ViewChild("header") header!: ElementRef;
  @Input() openInstance !: OpenInstance;
  @Input() instanceType !: string;
  @Input() removeOpenInstance !: (key : string, openInstanceId : string) => void;
  @Input() putFront !: (key : string, openInstanceId : string) => void;
  @Input() icon !: string | undefined;
  isDragging = false;
  xOffset=0;
  yOffset=0;

  @HostListener('document:click', ['$event'])
  onClick(event : MouseEvent) {
    if(this.el.nativeElement.contains(event.target)) {
      this.putFront(this.instanceType, this.openInstance.id);
      this.appFocusService.notifyApp(true);
    } else {
      this.appFocusService.notifyApp(false);
    }
  }

  constructor(private el : ElementRef, private appFocusService : AppFocusService, private contextmenuService : ContextMenuService) {}

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

  hide = () => {
    this.openInstance.hidden = true;
  }

  close = () => {
    this.removeOpenInstance(this.instanceType, this.openInstance.id);
  }

  onRightClick(event : MouseEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.contextmenuService.open(event.clientX, event.clientY,
      [
        {
          label : 'hide',
          icon : './hide.png',
          action : this.hide,
          disabled : false
        },
        {
          label : 'close',
          icon : './delete.png',
          action : this.close,
          disabled : false
        }
    ]);
  }
}
