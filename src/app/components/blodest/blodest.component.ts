import { Component, Input } from '@angular/core';
import { OpenInstance } from '../../models/OpenInstance';

@Component({
  selector: 'app-blodest',
  imports: [],
  templateUrl: './blodest.component.html',
  styleUrl: './blodest.component.scss'
})
export class BlodestComponent {
  @Input() instanceData!: OpenInstance;
}
