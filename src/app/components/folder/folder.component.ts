import { NgClass, NgFor, NgIf } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FolderStructure } from '../../models/FolderStructure';
import { ProjectsComponent } from "../projects/projects.component";
import { ExperienceComponent } from "../experience/experience.component";
import { OpenInstance } from '../../models/OpenInstance';
import { WindowComponent } from "../window/window.component";

@Component({
  selector: 'app-folder',
  imports: [NgClass, NgFor, NgIf, ProjectsComponent, ExperienceComponent, WindowComponent],
  templateUrl: './folder.component.html',
  styleUrl: './folder.component.scss'
})
export class FolderComponent implements OnInit{
  @ViewChild("folderTab") folderTab!: ElementRef<HTMLDivElement>;
  @Input() folder !: OpenInstance;
  @Input() removeFolder !: (key : string, folderId : string) => void;
  @Input() putFront !: (key : string, folderId : string) => void;
  foldersStructureFile = "/folders-structure.json";
  foldersStructure!: FolderStructure[];

  constructor(private httpClient : HttpClient) {}

  ngOnInit(): void {
    this.httpClient.get<FolderStructure[]>(this.foldersStructureFile).subscribe({
      next: (response) => {
        this.foldersStructure = response;
      }
    })
  }

  changeFolder(folderName : string) {
    if(folderName === this.folder.name) return;
    this.folder.name = folderName;
  }
}
