import { EAN13Barcode } from './scan.entity';
import { ScannedProduct } from './product.entity';

export interface ProductService {
  product(code: EAN13Barcode): ScannedProduct | undefined;
}
