import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { OpenInstance } from '../../models/OpenInstance';
import { NgClass, NgFor, NgIf, NgStyle } from '@angular/common';

@Component({
  selector: 'app-instances-stack',
  imports: [NgFor, NgClass, NgStyle],
  templateUrl: './instances-stack.component.html',
  styleUrl: './instances-stack.component.scss'
})
export class InstancesStackComponent {
  @ViewChild("instancesStack") instancesStack !: ElementRef<HTMLDivElement>;
  @Input() stack !:OpenInstance[];
  expand = false;

  hoverStart(event : MouseEvent) {
    if(this.stack.length == 1) return;
    this.expand = true;
    const el = this.instancesStack.nativeElement;
    const expandedHeight = 10+ 24*this.stack.length + 5*(this.stack.length-1);
    el.style.minHeight = `${expandedHeight}px`;
    el.style.transform = `translateY(-${expandedHeight-24}px)`;
  }

  hoverEnd(event : MouseEvent) {
    this.expand = false;
    const el = this.instancesStack.nativeElement;
    console.log("shrink")
    el.style.minHeight = "24px";
    el.style.transform = `translateY(0)`;
  }
}
