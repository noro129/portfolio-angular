import { Component, Input, OnInit } from '@angular/core';
import { Experience } from '../../models/Experience';
import { HttpClient } from '@angular/common/http';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-experience',
  imports: [NgFor],
  templateUrl: './experience.component.html',
  styleUrl: './experience.component.scss'
})
export class ExperienceComponent implements OnInit {
  experience !: Experience[];
  @Input() open !: (id : number) => void;

  constructor(private http : HttpClient) {}


  ngOnInit(): void {
    this.http.get<Experience[]>("./experience.json").subscribe({
      next: (response) => {
        this.experience = response;
      },
      error: (error) => {
        console.log(error);
      }
    })
  }

  openFile(index : number) {
    this.open(index);
  }
}
