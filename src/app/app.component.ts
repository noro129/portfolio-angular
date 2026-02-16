import { Component, ViewChild } from '@angular/core';
import { DesktopComponent } from "./components/desktop/desktop.component";
import { ToolbarComponent } from "./components/toolbar/toolbar.component";
import { NotifType } from './models/NotifType';

@Component({
  selector: 'app-root',
  imports: [DesktopComponent, ToolbarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'portfolio';
  @ViewChild("desktop") desktop !: DesktopComponent;

  openApp(id: number) {
    this.desktop.openWithId(id);
  }

  addNotification(messageObject : {message : string, type : NotifType}) {
    this.desktop.addNotification(messageObject.message, messageObject.type);
  }
}
