import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Project } from '../../models/Project';
import { ProjectComponent } from "../project/project.component";
import { NgClass, NgFor } from '@angular/common';

@Component({
  selector: 'app-projects',
  imports: [ProjectComponent, NgFor],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.scss'
})
export class ProjectsComponent implements OnInit {
  projects!: Project[];

  constructor(private http : HttpClient) {}

  ngOnInit(): void {
    this.http.get<Project[]>("./projects.json").subscribe({
      next: (response) => {
        this.projects = response;
      }
    });
  }
}
