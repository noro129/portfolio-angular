import { NgFor, NgIf } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, Input, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FolderStructure } from '../../models/FolderStructure';
import { ProjectsComponent } from "../projects/projects.component";
import { ExperienceComponent } from "../experience/experience.component";
import { OpenInstance } from '../../models/OpenInstance';
import { FoldersStructurePanelComponent } from '../folders-structure-panel/folders-structure-panel.component';

@Component({
  selector: 'app-folder',
  imports: [ NgFor, NgIf, ProjectsComponent, ExperienceComponent, FoldersStructurePanelComponent],
  templateUrl: './folder.component.html',
  styleUrl: './folder.component.scss'
})
export class FolderComponent{
  @ViewChild("folderTab") folderTab!: ElementRef<HTMLDivElement>;
  @Input() folder !: OpenInstance;
  @Input() open !: (id : number) => void;
  @Input() desktopFolders !: Set<string>;
  @Input() dragOver !: (event : DragEvent) => void;
  @Input() dropToMove !: (event : DragEvent) => void;
  @Input() foldersStructure!: FolderStructure[];

  changeFolder = (folderName : string) => {
    if(folderName === this.folder.name) return;
    this.folder.name = folderName;
  }
}
