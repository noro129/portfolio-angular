import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { OpenInstance } from '../../models/OpenInstance';
import { NgClass, NgFor, NgStyle } from '@angular/common';

@Component({
  selector: 'app-instances-stack',
  imports: [NgFor, NgClass, NgStyle],
  templateUrl: './instances-stack.component.html',
  styleUrl: './instances-stack.component.scss'
})
export class InstancesStackComponent {
  @ViewChild("instancesStack") instancesStack !: ElementRef<HTMLDivElement>;
  @Input() stack !:OpenInstance[];
  @Input() stackId !:string;
  @Input() removeStackElement!: (i: string, j: string)=> void;
  expand = false;

  hoverStart(event : MouseEvent) {
    this.expand = true;
    const el = this.instancesStack.nativeElement;
    const expandedHeight = this.stack.length === 1 ? 24 : 10+ 24*this.stack.length + 5*(this.stack.length-1);
    el.style.minHeight = `${expandedHeight}px`;
    el.style.transform = `translateY(-${expandedHeight-24}px)`;
  }

  hoverEnd(event : MouseEvent) {
    this.expand = false;
    const el = this.instancesStack.nativeElement;
    el.style.minHeight = "24px";
    el.style.transform = `translateY(0)`;
  }

  close(itemId : string) {
    this.removeStackElement(this.stackId, itemId);
  }
}
