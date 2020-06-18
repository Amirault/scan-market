import { EAN13Barcode } from './scan.entity';
import { Observable } from 'rxjs';
import { Purchase } from './product.entity';

export abstract class PurchaseSource {
  abstract create(
    purchaseProduct: Purchase & { quantity: 1 }
  ): Observable<Purchase>;

  abstract update(updatedPurchaseProduct: Purchase): Observable<Purchase>;

  abstract all(): Observable<Purchase[]>;

  abstract read(code: EAN13Barcode): Observable<Purchase | undefined>;

  abstract delete(code: EAN13Barcode): Observable<void>;
}
