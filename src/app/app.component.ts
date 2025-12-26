import { Component, ViewChild } from '@angular/core';
import { DesktopComponent } from "./components/desktop/desktop.component";
import { ToolbarComponent } from "./components/toolbar/toolbar.component";

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
    this.desktop.open(id);
  }
}
