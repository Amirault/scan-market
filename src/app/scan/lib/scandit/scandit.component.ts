import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Barcode, ScanResult, ScanSettings } from 'scandit-sdk';

@Component({
  selector: 'app-scandit',
  template:
    '<div data-testid="accurate-scan"><scandit-sdk-barcode-picker [scanSettings]="this.settings" (scan)="onScan($event)"></scandit-sdk-barcode-picker></div>',
})
export class ScanditComponent implements OnInit {
  @Output()
  code = new EventEmitter<string>();

  readonly settings = new ScanSettings({
    enabledSymbologies: [Barcode.Symbology.EAN13],
  });

  constructor() {}

  onScan(scanResult: ScanResult) {
    const barcodes = scanResult?.barcodes ?? [];
    const codeRead = barcodes[0]?.data;
    if (codeRead) {
      this.code.emit(codeRead);
    }
  }

  ngOnInit(): void {}
}
