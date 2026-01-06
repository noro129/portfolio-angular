import { Component, Input } from '@angular/core';
import { OpenInstance } from '../../models/OpenInstance';
import { NgFor, NgClass, NgIf } from '@angular/common';

@Component({
  selector: 'app-whoami',
  imports: [NgFor, NgClass, NgIf],
  templateUrl: './whoami.component.html',
  styleUrl: './whoami.component.scss'
})
export class WhoamiComponent {
  @Input() instanceData !: OpenInstance;
  readonly tabs = ['User Info', 'Education', 'Skills', 'Languages'];
  tabI =0;



  onTabClick(i : number) {
    this.tabI = i;
  }
}
