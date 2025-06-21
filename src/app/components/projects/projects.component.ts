import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Project } from '../../models/Project';
import { ProjectComponent } from "../project/project.component";
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-projects',
  imports: [NgFor, ProjectComponent],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.scss'
})
export class ProjectsComponent implements OnInit {
  projects!: Project[];
  projectBefore !: Project;
  project !: Project;
  projectAfter !: Project;

  constructor(private http : HttpClient) {}

  ngOnInit(): void {
    this.http.get<Project[]>("./projects.json").subscribe({
      next: (response) => {
        this.projects = response;
        this.project = this.projects[0];
          this.projectBefore = this.projects[this.projects.length-1];
        if(this.projects.length !=0) {
          this.projectAfter = this.projects[1];
        } else {
          this.projectAfter = this.projects[0];
        }
        
      }
    })
  }

  toLeft() {}

  toRight() {}
}
