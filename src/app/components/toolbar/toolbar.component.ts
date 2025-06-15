import { NgClass } from '@angular/common';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-toolbar',
  imports: [NgClass],
  templateUrl: './toolbar.component.html',
  styleUrl: './toolbar.component.scss'
})
export class ToolbarComponent implements OnInit {
  dateDay = "12";
  dateMonth = "06";
  dateYear = "2025";
  time = "12:09";
  showMenu = false;
  private interval : any;
  


  ngOnInit(): void {
    this.interval = setInterval(
      ()=>{
        const now = new Date();
        this.dateYear = now.getFullYear().toString();
        this.dateMonth = (now.getMonth()+1).toString();
        if(this.dateMonth.length == 1) this.dateMonth = "0"+this.dateMonth;
        this.dateDay = now.getDate().toString();
        if(this.dateDay.length === 1) this.dateDay = "0"+this.dateDay;

        this.time = now.getMinutes().toString();
        if(now.getMinutes()<10) this.time = ":0"+this.time;
        else this.time = ":"+this.time;
        this.time = now.getHours()+this.time;
        if(this.time.length===4) this.time="0"+this.time;
      },
      1000
    );
  }
  

  menuToggle(){
    this.showMenu = !this.showMenu;
  }
}
