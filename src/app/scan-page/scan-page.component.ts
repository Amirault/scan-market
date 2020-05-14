import { Component, Inject, OnInit } from '@angular/core';
import { EAN13Barcode, parseToEAN13BarCode } from './core/scan.entity';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-scan-page',
  templateUrl: './scan-page.component.html',
  styleUrls: ['./scan-page.component.css'],
})
export class ScanPageComponent implements OnInit {
  scannedCodes: EAN13Barcode[] = [];
  constructor(@Inject('ENV') readonly env: typeof environment) {}

  ngOnInit(): void {}

  onScannedCode(scannedCode: string) {
    const code = parseToEAN13BarCode(scannedCode);
    if (code) {
      this.scannedCodes = [code, ...this.scannedCodes];
    } else {
      alert('Invalid ean 13 barcode !');
    }
  }
}
