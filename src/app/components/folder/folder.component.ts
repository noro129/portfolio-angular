import { NgClass, NgFor, NgIf, NgStyle } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { FolderStructure } from '../../models/FolderStructure';

@Component({
  selector: 'app-folder',
  imports: [NgStyle, NgClass, NgFor, NgIf],
  templateUrl: './folder.component.html',
  styleUrl: './folder.component.scss'
})
export class FolderComponent implements OnInit{
  @Input() name = '';
  @Input() iconLogo = '';
  @Input() positionX = 150;
  @Input() positionY = 150;
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
}
