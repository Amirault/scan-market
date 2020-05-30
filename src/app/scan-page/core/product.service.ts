import { EAN13Barcode } from './scan.entity';
import { ScannedProduct } from './product.entity';
import { Observable } from 'rxjs';

export interface ProductService {
  product(code: EAN13Barcode): Observable<ScannedProduct | undefined>;
}
