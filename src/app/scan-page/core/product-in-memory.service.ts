import { EAN13Barcode } from './scan.entity';
import { productFakeData } from './fakeProductData';
import { ProductService } from './product.service';
import { ScannedProduct } from './product.entity';
import { Observable, of } from 'rxjs';

export class ProductInMemoryService implements ProductService {
  constructor(private readonly products = productFakeData) {}

  product(code: EAN13Barcode): Observable<ScannedProduct | undefined> {
    const find = this.products.find((_) => _.code === code);
    return find
      ? of({ name: find.name, price: find.price, code })
      : of(undefined);
  }
}
