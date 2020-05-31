import { Component, Inject, OnInit } from '@angular/core';
import { environment } from '../../environments/environment';
import { ScanUseCases } from '../core/scan/scan.use-cases';

@Component({
  selector: 'app-scan-page',
  templateUrl: './scan-page.component.html',
  styleUrls: ['./scan-page.component.scss'],
})
export class ScanPageComponent implements OnInit {
  constructor(
    @Inject('ENV') readonly env: typeof environment,
    private readonly scanUseCases: ScanUseCases
  ) {}

  ngOnInit(): void {}

  onScannedCode(scannedCode: string) {
    this.scanUseCases.saveProductCode(scannedCode).subscribe();
  }
}
