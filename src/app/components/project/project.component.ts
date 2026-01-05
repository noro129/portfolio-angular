import { NgStyle, NgClass } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-project',
  imports: [NgStyle, NgClass],
  templateUrl: './project.component.html',
  styleUrl: './project.component.scss'
})
export class ProjectComponent {
  @Input() projectName = '';
  @Input() projectDescription = '';
  @Input() carousel = false;
}
