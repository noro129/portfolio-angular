
import { NgStyle, NgFor, NgIf } from '@angular/common';
import { AfterViewInit, Component, ElementRef, Input } from '@angular/core';
import Script from '../../models/Script';
import { Experience } from '../../models/Experience';
import { ConfirmationWindowService } from '../../services/confirmation-window.service';

@Component({
  selector: 'app-file-reader',
  imports: [NgStyle, NgFor, NgIf],
  templateUrl: './file-reader.component.html',
  styleUrl: './file-reader.component.scss'
})
export class FileReaderComponent implements AfterViewInit{

  @Input() experience !: Experience;
  @Input() script !: Script | undefined;

  constructor(private el : ElementRef, private confirmationWindowService : ConfirmationWindowService) {}

  ngAfterViewInit(): void {
    if(this.experience) {
      const desc = this.el.nativeElement.querySelector(".description");
      requestAnimationFrame(() => desc.focus());
      requestAnimationFrame(() => this.placeCaretAtEnd(desc));
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

  placeCaretAtEnd(el : HTMLElement) {
    const range = document.createRange();
    const selection = window.getSelection();

    range.selectNodeContents(el);
    range.collapse(false);

    selection?.removeAllRanges();
    selection?.addRange(range);
  }

  boldEffect() {
    this.experience.isBold = !this.experience.isBold;
  }

  italicEffect() {
    this.experience.isItalic = !this.experience.isItalic;
  }

  underlineEffect() {
    this.experience.isUnderlined = !this.experience.isUnderlined;
  }
}
