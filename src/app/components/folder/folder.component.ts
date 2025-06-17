import { NgClass, NgFor, NgIf, NgStyle } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FolderStructure } from '../../models/FolderStructure';

@Component({
  selector: 'app-folder',
  imports: [NgStyle, NgClass, NgFor, NgIf],
  templateUrl: './folder.component.html',
  styleUrl: './folder.component.scss'
})
export class FolderComponent implements OnInit, AfterViewInit{
  @ViewChild("folderTab") folderTab!: ElementRef<HTMLDivElement>;
  @Input() name = '';
  @Input() iconLogo = '';
  @Input() positionX = 150;
  @Input() positionY = 150;
  foldersStructureFile = "/folders-structure.json";
  foldersStructure!: FolderStructure[];
  isDragging = false;
  xOffset=0;
  yOffset=0;

  constructor(private httpClient : HttpClient) {}

  ngOnInit(): void {
    this.httpClient.get<FolderStructure[]>(this.foldersStructureFile).subscribe({
      next: (response) => {
        this.foldersStructure = response;
      }
    })
  }

  ngAfterViewInit(): void {
    document.addEventListener('mousemove', this.onMouseMove);
    document.addEventListener('mouseup', this.endDrag);
  }

  startDrag(event : MouseEvent) {
    this.isDragging = true;
    const rect = this.folderTab.nativeElement.getBoundingClientRect();
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
    const el = this.folderTab.nativeElement;
    el.style.left = `${event.clientX - this.xOffset}px`;
    el.style.top = `${event.clientY - this.yOffset}px`;

  }
}
