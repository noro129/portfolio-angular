import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import ContextMenuItem from '../models/ContextMenuItem';

@Injectable({
  providedIn: 'root'
})
export class ContextMenuService {
  private state = new BehaviorSubject<{x : number, y : number , items : ContextMenuItem[]} | null>(null);
  state$ = this.state.asObservable();

  open(x : number, y : number, items : ContextMenuItem[]) {
    this.state.next({x , y , items});
  }

  close() {
    this.state.next(null);
  }
  
}
