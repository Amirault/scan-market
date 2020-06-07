import { Component, OnInit } from '@angular/core';
import { EAN13Barcode } from '../core/scan/scan.entity';
import { ScannedProduct } from '../core/scan/product.entity';
import { ScanUseCases } from '../core/scan/scan.use-cases';

@Component({
  selector: 'app-scanned-products',
  templateUrl: './scanned-products.component.html',
  styleUrls: ['./scanned-products.component.scss'],
})
export class ScannedProductsComponent implements OnInit {
  scannedProducts: ScannedProduct[];

  constructor(public scanUseCases: ScanUseCases) {
    this.scannedProducts = [];
  }

  ngOnInit(): void {
    this.scanUseCases
      .scannedProducts()
      .subscribe((_) => (this.scannedProducts = _));
  }

  onScannedCode(scannedCode: string) {
    this.scanUseCases.saveProductCode(scannedCode).subscribe();
  }

  onRemoveProduct(productCode: EAN13Barcode) {
    this.scanUseCases.removeProduct(productCode).subscribe();
  }

  onAddProduct(productCode: EAN13Barcode) {
    this.scanUseCases.saveProductCode(productCode).subscribe();
  }

  productTotal() {
    return this.scanUseCases.productTotal(this.scannedProducts);
  }
}
