import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FoldersStructurePanelComponent } from './folders-structure-panel.component';

describe('FoldersStructurePanelComponent', () => {
  let component: FoldersStructurePanelComponent;
  let fixture: ComponentFixture<FoldersStructurePanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FoldersStructurePanelComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FoldersStructurePanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
