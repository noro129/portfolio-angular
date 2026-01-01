import { Component, Input } from '@angular/core';
import { OpenInstance } from '../../models/OpenInstance';

@Component({
  selector: 'app-cmd',
  imports: [],
  templateUrl: './cmd.component.html',
  styleUrl: './cmd.component.scss'
})
export class CMDComponent {
  @Input() instanceData !: OpenInstance;

}
