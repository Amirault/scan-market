import { EAN13Barcode } from '../scan.entity';
import { Observable, of } from 'rxjs';
import { PurchaseSource } from '../purchaseSource';
import { Purchase } from '../product.entity';

export class PurchaseInMemorySource implements PurchaseSource {
  constructor(private purchases: Purchase[] = []) {}

  create(purchase: Purchase): Observable<Purchase> {
    this.purchases.push(purchase);
    return of(purchase);
  }

  update(updatedPurchase: Purchase): Observable<Purchase> {
    this.purchases = this.purchases.map((_) =>
      _.code === updatedPurchase.code ? updatedPurchase : _
    );
    return of(updatedPurchase);
  }

  all(): Observable<Purchase[]> {
    return of(this.purchases);
  }

  read(code: EAN13Barcode): Observable<Purchase | undefined> {
    return of(this.purchases.find((_) => _.code === code));
  }

  delete(code: EAN13Barcode): Observable<void> {
    const codeIndex = this.purchases.findIndex((_) => _.code === code);
    this.purchases = this.purchases.filter((_, i) => i !== codeIndex);
    return of(undefined);
  }
}
