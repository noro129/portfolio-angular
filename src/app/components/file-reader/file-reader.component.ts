
import { NgStyle, NgFor, NgIf } from '@angular/common';
import { AfterViewInit, Component, ElementRef, Input } from '@angular/core';
import Script from '../../models/Script';

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
  @Input() script !: Script | undefined;

  constructor(private el : ElementRef) {}

  ngAfterViewInit(): void {
    if(this.experience) this.el.nativeElement.querySelector(".wrapper").focus();
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
