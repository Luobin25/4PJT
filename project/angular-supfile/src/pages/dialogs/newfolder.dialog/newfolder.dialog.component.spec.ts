import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewfolderDialogComponent } from './newfolder.dialog.component';

describe('NewfolderDialogComponent', () => {
  let component: NewfolderDialogComponent;
  let fixture: ComponentFixture<NewfolderDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewfolderDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewfolderDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
