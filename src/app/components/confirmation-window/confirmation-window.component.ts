import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { ConfirmationWindowService } from '../../services/confirmation-window.service';

@Component({
  selector: 'app-confirmation-window',
  imports: [NgIf],
  templateUrl: './confirmation-window.component.html',
  styleUrl: './confirmation-window.component.scss'
})
export class ConfirmationWindowComponent {

  constructor(public confirmationWindowService : ConfirmationWindowService) {}

  onYes() {
    this.confirmationWindowService.answer(true);
  }

  onNo() {
    this.confirmationWindowService.answer(false);
  }
}
