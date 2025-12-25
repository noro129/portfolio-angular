import { AfterViewInit, Component, ElementRef, HostListener, Input, ViewChild } from '@angular/core';
import { OpenInstance } from '../../models/OpenInstance';
import { NgStyle } from '@angular/common';
import { AppType } from '../../models/AppType';

@Component({
  selector: 'app-window',
  imports: [NgStyle],
  templateUrl: './window.component.html',
  styleUrl: './window.component.scss'
})
export class WindowComponent implements AfterViewInit{
  @ViewChild("window") window!: ElementRef<HTMLDivElement>;
  @Input() openInstance !: OpenInstance;
  @Input() positionX = 150;
  @Input() positionY = 150;
  @Input() removeOpenInstance !: (key : string, openInstanceId : string) => void;
  @Input() putFront !: (key : string, openInstanceId : string) => void;
  isDragging = false;
  xOffset=0;
  yOffset=0;

  @HostListener('click')
  onClick() {
    this.putFront(AppType.Folder.toString(), this.openInstance.id);
  }

  ngAfterViewInit(): void {
    document.addEventListener('mousemove', this.onMouseMove);
    document.addEventListener('mouseup', this.endDrag);
  }
  
  startDrag(event : MouseEvent) {
    this.isDragging = true;
    this.putFront(AppType.Folder.toString(), this.openInstance.id);
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
    this.removeOpenInstance(AppType.Folder.toString(), this.openInstance.id);
  }
}
