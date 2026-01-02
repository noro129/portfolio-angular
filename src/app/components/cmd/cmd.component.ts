import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { OpenInstance } from '../../models/OpenInstance';
import { NgFor } from '@angular/common';
import { AppFocusService } from '../../services/app-focus.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-cmd',
  imports: [NgFor],
  templateUrl: './cmd.component.html',
  styleUrl: './cmd.component.scss'
})
export class CMDComponent implements OnInit, OnDestroy {
  @Input() instanceData !: OpenInstance;
  isActive = true;
  focusSubscriber !: Subscription;
  commands : string[] = ['help', 'whoami', 'print', 'clear', 'exit'];
  enteredCommands : string[] = ['help'];
  currentCommand : string = '';
  readonly shellPrompt = 'guest@tealos:~$';

  constructor(private appFocusService : AppFocusService) {}
  
  ngOnInit(): void {
    this.focusSubscriber = this.appFocusService.activeSubject$.subscribe(data => {
      if (this.isActive != data) {
        this.isActive = data;
      }
    })
  }

  ngOnDestroy(): void {
    this.focusSubscriber.unsubscribe();
  }
}
