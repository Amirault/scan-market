import { Component, OnInit } from '@angular/core';
import { EAN13Barcode } from '../core/scan/scan.entity';
import { ProductPurchase } from '../core/scan/product.entity';
import { ScanUseCases } from '../core/scan/scan.use-cases';

@Component({
  selector: 'app-scanned-products',
  templateUrl: './scanned-products.component.html',
  styleUrls: ['./scanned-products.component.scss'],
})
export class ScannedProductsComponent implements OnInit {
  scannedProducts: ProductPurchase[];

  constructor(public scanUseCases: ScanUseCases) {
    this.scannedProducts = [];
  }

  ngOnInit(): void {
    this.scanUseCases
      .readAllProductsPurchase()
      .subscribe((_) => (this.scannedProducts = _));
  }

  onScannedCode(scannedCode: string) {
    this.scanUseCases
      .addPurchaseAndRefresh(scannedCode, this.scannedProducts)
      .subscribe((_) => (this.scannedProducts = _));
  }

  onRemoveProduct(productCode: EAN13Barcode) {
    this.scanUseCases
      .decreaseQuantityAndRefresh(productCode, this.scannedProducts)
      .subscribe((_) => (this.scannedProducts = _));
  }

  onAddProduct(productCode: EAN13Barcode) {
    this.scanUseCases
      .increaseQuantityAndRefresh(productCode, this.scannedProducts)
      .subscribe((_) => (this.scannedProducts = _));
  }

  productTotal() {
    return this.scanUseCases.productTotal(this.scannedProducts);
  }
}
