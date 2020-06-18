import { Observable, of } from 'rxjs';
import { PurchaseSource } from '../purchaseSource';
import { Purchase } from '../product.entity';
import { EAN13Barcode } from '../scan.entity';
import { map } from 'rxjs/operators';

export class PurchaseLocalStorageSource implements PurchaseSource {
  create(purchase: Purchase): Observable<Purchase> {
    const purchases = this.readFromLocalStorage();
    const updatedPurchases = [...purchases, purchase];
    this.write(updatedPurchases);
    return of(purchase);
  }

  update(updatedPurchase: Purchase): Observable<Purchase> {
    const purchases = this.readFromLocalStorage();
    const updatedPurchases = purchases.map((_) =>
      _.code === updatedPurchase.code ? updatedPurchase : _
    );
    this.write(updatedPurchases);
    return of(updatedPurchase);
  }

  all(): Observable<Purchase[]> {
    return of(this.readFromLocalStorage());
  }

  read(code: EAN13Barcode): Observable<Purchase | undefined> {
    return this.all().pipe(map((purchases) => purchases.find((_) => _.code)));
  }

  delete(code: EAN13Barcode): Observable<void> {
    const purchases = this.readFromLocalStorage();
    const codeIndex = purchases.findIndex((_) => _.code === code);
    this.write(purchases.filter((_, i) => i !== codeIndex));
    return of(undefined);
  }

  private readFromLocalStorage(): Purchase[] {
    return JSON.parse(localStorage.getItem('purchases')) ?? [];
  }

  private write(purchaseProducts: Purchase[]): void {
    localStorage.setItem('purchases', JSON.stringify(purchaseProducts));
  }
}
