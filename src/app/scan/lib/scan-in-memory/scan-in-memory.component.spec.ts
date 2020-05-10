import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ScanInMemoryComponent } from './scan-in-memory.component';

describe('ScanInMemoryComponent', () => {
  let component: ScanInMemoryComponent;
  let fixture: ComponentFixture<ScanInMemoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ScanInMemoryComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScanInMemoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
