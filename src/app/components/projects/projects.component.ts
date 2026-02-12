import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Project } from '../../models/Project';
import { ProjectComponent } from "../project/project.component";
import { NgClass, NgFor, NgStyle } from '@angular/common';

@Component({
  selector: 'app-projects',
  imports: [ProjectComponent, NgClass, NgFor, NgStyle],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.scss'
})
export class ProjectsComponent implements OnInit {
  projects!: Project[];
  projectBeforeIndex!:number;
  projectIndex!:number;
  projectCarouselIndex!:number;
  projectAfterIndex!:number;
  slideLeft = false;
  slideRight = false;

  constructor(private http : HttpClient) {}

  ngOnInit(): void {
    this.http.get<Project[]>("./projects.json").subscribe({
      next: (response) => {
        this.projects = response;
        this.projectIndex = 0;
        this.projectCarouselIndex = 0;
        this.projectBeforeIndex = this.projects.length-1;
        if(this.projects.length !=0) {
          this.projectAfterIndex = 1;
        } else {
          this.projectAfterIndex = 0;
        }
        
      }
    })
  }

  toLeft() {
    if(this.slideLeft || this.slideRight) return;
    this.slideLeft=true;
    this.projectCarouselIndex = this.projectAfterIndex;
    setTimeout(()=>{
      this.slideLeft=false;

      if(this.projects.length > 0) {
        const temp = this.projectIndex;
        this.projectIndex = this.projectAfterIndex;
        this.projectAfterIndex = (this.projectAfterIndex+1)%this.projects.length;
        this.projectBeforeIndex = temp;
      }
    }, 300);
  }

  toRight() {
    if(this.slideLeft || this.slideRight) return;
    this.slideRight=true;
    this.projectCarouselIndex = this.projectBeforeIndex;
    setTimeout(()=>{
      this.slideRight=false;

      if(this.projects.length > 0) {
        const temp = this.projectIndex;
        this.projectIndex=this.projectBeforeIndex;
        this.projectBeforeIndex = (this.projects.length+this.projectBeforeIndex-1)%this.projects.length;
        this.projectAfterIndex = temp;
      }
    }, 300);
  }

  goto(i : number) {
    if(i === this.projectIndex) return;
    if(i<this.projectIndex) {
      this.toRight();
      setTimeout(()=>{this.goto(i)}, 320);
    }else{
      this.toLeft();
      setTimeout(()=>{this.goto(i) }, 320);
    }
  }
}
