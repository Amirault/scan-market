import { Component, Input, OnInit } from '@angular/core';
import * as JsBarcode from 'jsbarcode';
import { EAN13Barcode } from '../core/scan/scan.entity';

@Component({
  selector: 'app-barcode',
  template:
    '<div style="height:100%; display: flex; align-items: center; justify-content: center;}"><img id="barcode" /></div>',
})
export class BarcodeComponent implements OnInit {
  @Input()
  code: EAN13Barcode;

  constructor() {}

  ngOnInit(): void {
    JsBarcode('#barcode', this.code, { format: 'EAN13' });
  }
}
