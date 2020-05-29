import { EAN13Barcode } from './scan.entity';
import { productFakeData } from './fakeProductData';
import { ProductService } from './product.service';
import { Injectable } from '@angular/core';
import { ScannedProduct } from './product.entity';

@Injectable({
  providedIn: 'root',
})
export class ProductInMemoryService implements ProductService {
  constructor(private readonly products = productFakeData) {}

  product(code: EAN13Barcode): ScannedProduct | undefined {
    const find = this.products.find((_) => _.code === code);
    return find ? { name: find.name, price: find.price, code } : undefined;
  }
}
