import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { OpenInstance } from '../../models/OpenInstance';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-cmd',
  imports: [NgFor],
  templateUrl: './cmd.component.html',
  styleUrl: './cmd.component.scss'
})
export class CMDComponent {
  @Input() instanceData !: OpenInstance;
  isActive = true;
  commands : string[] = ['help', 'whoami', 'print', 'clear', 'exit'];
  enteredCommands : string[] = ['help'];
  currentCommand : string = '';
  readonly shellPrompt = 'guest@tealos:~$';

  
}
