import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActiveItemsPanelComponent } from './active-items-panel.component';

describe('ActiveItemsPanelComponent', () => {
  let component: ActiveItemsPanelComponent;
  let fixture: ComponentFixture<ActiveItemsPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActiveItemsPanelComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActiveItemsPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
