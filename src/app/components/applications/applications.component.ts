import { Component, Input } from '@angular/core';
import { OpenInstance } from '../../models/OpenInstance';
import { NgFor, KeyValuePipe, NgIf, NgSwitch } from '@angular/common';
import { AppType } from '../../models/AppType';

@Component({
  selector: 'app-applications',
  imports: [NgFor, KeyValuePipe, NgIf, NgSwitch],
  templateUrl: './applications.component.html',
  styleUrl: './applications.component.scss'
})
export class ApplicationsComponent {
  @Input() openedAplications!: Map<string, OpenInstance[]>;
  AppType = AppType;
  keepOrder = () => 0;
}
