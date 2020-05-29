import { Component, Inject, OnInit } from '@angular/core';
import { EAN13Barcode, parseToEAN13BarCode } from './core/scan.entity';
import { environment } from '../../environments/environment';
import { ProductService } from './core/product.service';
import { ScannedProduct } from './core/product.entity';

@Component({
  selector: 'app-scan-page',
  templateUrl: './scan-page.component.html',
  styleUrls: ['./scan-page.component.css'],
})
export class ScanPageComponent implements OnInit {
  scannedProducts: ScannedProduct[] = [];
  constructor(
    @Inject('ENV') readonly env: typeof environment,
    @Inject('ProductService') public productService: ProductService
  ) {}

  ngOnInit(): void {}

  onScannedCode(scannedCode: string) {
    const code = parseToEAN13BarCode(scannedCode);
    if (code) {
      const product = this.productService.product(code);
      this.scannedProducts = [product, ...this.scannedProducts];
    } else {
      alert('Invalid ean 13 barcode !');
    }
  }

  onRemoveProduct(productCode: EAN13Barcode) {
    this.scannedProducts = this.scannedProducts.filter(
      (_) => _.code !== productCode
    );
  }
}
