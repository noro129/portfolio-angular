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
  @Input() exit !: (key: string, key2: string) => void;
  @Input() key1 = '';
  @Input() key2 = '';
  isActive = true;
  focusSubscriber !: Subscription;
  commandsResult : Map<string,string[]> = new Map<string, string[]>;
  enteredCommands : string[] = [];
  currentCommand : string = '';
  readonly shellPrompt = 'guest@tealOs:~$';

  constructor(private appFocusService : AppFocusService) {}
  
  ngOnInit(): void {
    this.setCommandResultData();

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
    const command = event.target.innerText.trim();
    if(command.toLocaleLowerCase() === 'clear') {
      this.enteredCommands = [];
    } else if (command.toLocaleLowerCase() === 'exit') {
      this.exit(this.key1, this.key2);
    } else {
      this.enteredCommands.push(command);
    }
    
    event.target.innerText = '';
  }

  setCommandResultData() {
    this.commandsResult.set('', ['']);

    this.commandsResult.set('help', [
                                         'Available commands:',
                                         ' ',
                                         'help         Display this manual.',
                                         'print <arg>  Print user contact or profile information.',
                                         '             arg : github | email | phone | linkedin.',
                                         'whoami       Show user information (name, education, skills, languages).',
                                         'clear        Clear the terminal screen.',
                                         'exit         Exit the session.',
                                         ' '
    ]);

    this.commandsResult.set('whoami', [
                                        '_____________________________USER______________________________',
                                        ' ',
                                        'full_name :         Oussama Errazi',
                                        'profile   :         Software Engineer',
                                        '___________________________EDUCATION___________________________',
                                        ' ',
                                        'software engineering degree          (ENSIAS, Rabat)',
                                        'mathematics & physics branch         (CPGE Reda Slaoui, Agadir)',
                                        '____________________________SKILLS_____________________________',
                                        ' ',
                                        'Java · Python · Spring Boot · Angular · SQL · GIT · Docker ...',
                                        '___________________________LANGUAGES___________________________',
                                        ' ',
                                        '                    Arabic    :     Native Language',
                                        '                    English   :     Proficient',
                                        '                    French    :     Fluent',
                                        'use whoami app for more details.'
    ]);

    this.commandsResult.set('print github', ['https://github.com/noro129']);
    this.commandsResult.set('print phone', ['+212694105029']);
    this.commandsResult.set('print linkedin', ['https://www.linkedin.com/in/oussama-errazi/']);
    this.commandsResult.set('print email', ['errazi111@gmail.com']);
  }

  commandToKey(command : string) {
    if(this.commandsResult.has(command)) return command;
    if(command.toLocaleLowerCase().startsWith('print')){
      return command.replace(/\s+/g, " ");
    }
    return command;
  }

  getErrorMessage(command : string) {
    if (command.toLocaleLowerCase().startsWith('print')) {
      if (command.toLocaleLowerCase() === 'print') return 'missing arg for command print.'
      const args = command.split(/\s+/g);
      if(args.length === 2) {
        return 'invalid argument for command print.'
      } else {
        return 'invalid usage for print command — expected only one argument.'
      }

    }
    return command + ' is not recognized as an available command.'
  }
}
