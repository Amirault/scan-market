import { Component, Inject, OnInit } from '@angular/core';
import { environment } from '../../environments/environment';
import { ScanUseCases } from '../core/scan/scan.use-cases';
import { Router } from '@angular/router';

@Component({
  selector: 'app-scan-page',
  templateUrl: './scan-page.component.html',
  styleUrls: ['./scan-page.component.scss'],
})
export class ScanPageComponent implements OnInit {
  constructor(
    @Inject('ENV') readonly env: typeof environment,
    private readonly scanUseCases: ScanUseCases,
    private readonly router: Router
  ) {}

  ngOnInit(): void {}

  onScannedCode(scannedCode: string) {
    this.scanUseCases.saveProductCode(scannedCode).subscribe(async () => {
      await this.router.navigate(['/scanned-products']);
    });
  }
}
