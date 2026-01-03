import { Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { OpenInstance } from '../../models/OpenInstance';
import { NgFor, NgIf } from '@angular/common';
import { AppFocusService } from '../../services/app-focus.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-cmd',
  imports: [NgFor, NgIf],
  templateUrl: './cmd.component.html',
  styleUrl: './cmd.component.scss'
})
export class CMDComponent implements OnInit, OnDestroy {
  @ViewChild("commandInput") commandInput !: ElementRef;
  @Input() instanceData !: OpenInstance;
  isActive = true;
  focusSubscriber !: Subscription;
  commands : string[] = ['help', 'whoami', 'print', 'clear', 'exit'];
  commandsResultText !: Map<string,string[]>;
  commandsResultTable !: Map<string,Map<string, string>>;
  enteredCommands : string[] = [];
  currentCommand : string = '';
  readonly shellPrompt = 'guest@tealos:~$';

  constructor(private appFocusService : AppFocusService) {}
  
  ngOnInit(): void {
    this.commandsResultText = new Map<string, string[]>;
    this.commandsResultTable = new Map<string, Map<string, string>>;


    setTimeout(()=>this.commandInput.nativeElement.focus(), 0);
    this.focusSubscriber = this.appFocusService.activeSubject$.subscribe(data => {
      this.isActive = data;
      console.log(data);
      if(this.isActive) {
        setTimeout(()=>this.commandInput.nativeElement.focus(), 0);
      } else {
        this.commandInput.nativeElement.blur();
      }
    })
  }

  ngOnDestroy(): void {
    this.focusSubscriber.unsubscribe();
  }

  executeCommand(event : any) {
    event.preventDefault();
    const command = event.target.innerText;
    this.enteredCommands.push(command);
    event.target.innerText = '';
  }
}
