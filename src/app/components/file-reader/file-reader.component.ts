import { NgStyle, NgForOf, NgFor } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { Experience } from '../../models/Experience';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-file-reader',
  imports: [NgStyle, NgFor],
  templateUrl: './file-reader.component.html',
  styleUrl: './file-reader.component.scss'
})
export class FileReaderComponent implements OnInit{
  bold = false;
  italic = false;
  underline = false;
  @Input() company!: string;

  experience !: Experience | undefined;

  constructor(private http : HttpClient) {}

  ngOnInit(): void {
    this.http.get<Experience[]>("./experience.json").subscribe({
      next: (response) => {
            for(let res of response) {
              if (res.company === this.company) {
                this.experience = res;
              } 
            }
          },
      error: (error) => {
            console.log(error);
          }
    });
  }

  boldEffect() {
    this.bold = !this.bold;
  }

  italicEffect() {
    this.italic = !this.italic;
  }

  underlineEffect() {
    this.underline = !this.underline;
  }
}
