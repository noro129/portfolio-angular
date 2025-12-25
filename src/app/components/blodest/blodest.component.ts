import { Component, Input } from '@angular/core';
import { OpenInstance } from '../../models/OpenInstance';
import { NgStyle } from '@angular/common';

@Component({
  selector: 'app-blodest',
  imports: [NgStyle],
  templateUrl: './blodest.component.html',
  styleUrl: './blodest.component.scss'
})
export class BlodestComponent {
  @Input() instanceData!: OpenInstance;

  hide() {}
  close() {}
}
