import { Component, ViewChild } from '@angular/core';
import { DesktopComponent } from "./components/desktop/desktop.component";
import { ToolbarComponent } from "./components/toolbar/toolbar.component";
import { NotifType } from './models/NotifType';
import { ContextMenuService } from './services/context-menu.service';

@Component({
  selector: 'app-root',
  imports: [DesktopComponent, ToolbarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'portfolio';
  @ViewChild("desktop") desktop !: DesktopComponent;

  constructor(private contextmenuService : ContextMenuService) {}

  openApp(id: number) {
    this.desktop.openWithId(id);
  }

  addNotification(messageObject : {message : string, type : NotifType}) {
    this.desktop.addNotification(messageObject.message, messageObject.type);
  }

  onRightClick(event : MouseEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.contextmenuService.close();
  }
}
