import { Component, Input } from '@angular/core';
import { OpenInstance } from '../../models/OpenInstance';

@Component({
  selector: 'app-whoami',
  imports: [],
  templateUrl: './whoami.component.html',
  styleUrl: './whoami.component.scss'
})
export class WhoamiComponent {
  @Input() instanceData !: OpenInstance;
}
