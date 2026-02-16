import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppTileComponent } from './app-tile.component';

describe('AppTileComponent', () => {
  let component: AppTileComponent;
  let fixture: ComponentFixture<AppTileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppTileComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppTileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
