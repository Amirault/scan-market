import { EAN13Barcode } from './scan.entity';
import { Product } from './product.entity';
import { Observable } from 'rxjs';

export abstract class ProductSource {
  abstract product(code: EAN13Barcode): Observable<Product | undefined>;
}
