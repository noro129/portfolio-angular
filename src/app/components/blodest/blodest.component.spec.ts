import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlodestComponent } from './blodest.component';

describe('BlodestComponent', () => {
  let component: BlodestComponent;
  let fixture: ComponentFixture<BlodestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BlodestComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BlodestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
