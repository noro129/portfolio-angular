
import { NgStyle, NgFor, NgIf } from '@angular/common';
import { AfterViewInit, Component, ElementRef, Input } from '@angular/core';
import Script from '../../models/Script';
import { Experience } from '../../models/Experience';

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

  @Input() experience !: Experience;
  @Input() script !: Script | undefined;

  constructor(private el : ElementRef) {}

  ngAfterViewInit(): void {
    if(this.experience) {
      requestAnimationFrame(() => this.el.nativeElement.querySelector(".wrapper").focus());
      requestAnimationFrame(() => this.placeCaretAtEnd(this.el.nativeElement.querySelector(".wrapper")));
    }
  }

  preventNewLine(event : KeyboardEvent) {
    if(event.key === 'Enter') {
      event.preventDefault();
    }
  }

  onInput(event : Event) {
    const el = event.target as HTMLElement;
    if(el.innerHTML === '<br>' || el.innerHTML === '<br/>' || el.innerHTML === '<div><br></div>' || el.innerHTML === '<div></div>') {
      el.innerHTML = '';
    }
  }

  // onKeyDown(event : KeyboardEvent) {
  //   if(event.key === 'Enter') {
  //     event.preventDefault();
  //     const el = event.target as HTMLElement;
  //     el.innerText = el.innerText + '\n';
  //   }
  // }

  placeCaretAtEnd(el : HTMLElement) {
    const range = document.createRange();
    const selection = window.getSelection();

    range.selectNodeContents(el);
    range.collapse(false);

    selection?.removeAllRanges();
    selection?.addRange(range);
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
