import { NgStyle, NgForOf, NgFor, NgIf } from '@angular/common';
import { AfterViewInit, Component, ElementRef, Input, OnInit } from '@angular/core';
import { Experience } from '../../models/Experience';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-file-reader',
  imports: [NgStyle, NgFor, NgIf],
  templateUrl: './file-reader.component.html',
  styleUrl: './file-reader.component.scss'
})
export class FileReaderComponent implements AfterViewInit{
  bold = false;
  italic = false;
  underline = false;

  @Input() experience !: any;

  constructor(private el : ElementRef) {}

  ngAfterViewInit(): void {
    this.el.nativeElement.querySelector(".wrapper").focus();
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
