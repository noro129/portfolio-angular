import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstancesStackComponent } from './instances-stack.component';

describe('InstancesStackComponent', () => {
  let component: InstancesStackComponent;
  let fixture: ComponentFixture<InstancesStackComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InstancesStackComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InstancesStackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
