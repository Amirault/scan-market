import { EAN13Barcode } from '../scan.entity';
import { productFakeData } from './fakeProductData';
import { ProductSource } from '../product.source';
import { Product } from '../product.entity';
import { Observable, of } from 'rxjs';

export class ProductInMemorySource implements ProductSource {
  constructor(private readonly products = productFakeData) {}

  product(code: EAN13Barcode): Observable<Product | undefined> {
    const find = this.products.find((_) => _.code === code);
    return find
      ? of({ name: find.name, price: find.price, code })
      : of(undefined);
  }
}
