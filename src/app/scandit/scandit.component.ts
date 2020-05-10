import { Component, OnInit } from '@angular/core';
import { Barcode, ScanSettings } from 'scandit-sdk';

@Component({
  selector: 'app-scan-market',
  template:
    '<div><h1>Real</h1><scandit-sdk-barcode-picker [scanSettings]="settings" (scan)="onScan($event)"></scandit-sdk-barcode-picker></div>',
})
export class ScanditComponent implements OnInit {
  public settings = new ScanSettings({
    enabledSymbologies: [Barcode.Symbology.EAN13],
  });

  constructor() {}

  onScan(s) {
    alert(JSON.stringify(s));
  }

  ngOnInit(): void {}
}
