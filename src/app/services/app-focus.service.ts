import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable()
export class AppFocusService {
  private activeSubject = new Subject<boolean>();
  activeSubject$: Observable<boolean> = this.activeSubject.asObservable();

  notifyApp(active : boolean) {
    this.activeSubject.next(active);
  }
}
