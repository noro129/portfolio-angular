import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConfirmationWindowService {

  private resolver !: (v : boolean) => void;

  question : string | null = null;

  constructor() { }

  ask(q : string) : Promise<boolean> {
    this.question = q;

    return new Promise<boolean>((resolve)=> {
      this.resolver = resolve;
    })
  }

  answer(v : boolean) {
    this.question = null;
    this.resolver(v);
  }
}
