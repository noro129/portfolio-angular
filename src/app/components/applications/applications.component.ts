import { Component, Input } from '@angular/core';
import { OpenInstance } from '../../models/OpenInstance';
import { NgFor, KeyValuePipe, NgSwitch, NgSwitchCase } from '@angular/common';
import { AppType } from '../../models/AppType';
import { BlodestComponent } from "../blodest/blodest.component";

@Component({
  selector: 'app-applications',
  imports: [NgFor, KeyValuePipe, NgSwitch, NgSwitchCase, BlodestComponent],
  templateUrl: './applications.component.html',
  styleUrl: './applications.component.scss'
})
export class ApplicationsComponent {
  @Input() openedAplications!: Map<string, OpenInstance[]>;
  AppType = AppType;
  keepOrder = () => 0;
}
