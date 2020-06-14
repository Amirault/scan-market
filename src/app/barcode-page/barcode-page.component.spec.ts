import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BarcodePageComponent } from './barcode-page.component';

describe('BarcodePageComponent', () => {
  let component: BarcodePageComponent;
  let fixture: ComponentFixture<BarcodePageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BarcodePageComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BarcodePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
