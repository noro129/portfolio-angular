import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CMDComponent } from './cmd.component';

describe('CMDComponent', () => {
  let component: CMDComponent;
  let fixture: ComponentFixture<CMDComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CMDComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CMDComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
