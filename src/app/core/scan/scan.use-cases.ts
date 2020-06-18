import { Injectable } from '@angular/core';
import { PurchaseSource } from './purchaseSource';
import { EAN13Barcode, parseToEAN13BarCode } from './scan.entity';
import { ProductSource } from './product.source';
import { forkJoin, Observable, of } from 'rxjs';
import { flatMap, map } from 'rxjs/operators';
import { ProductPurchase, Purchase } from './product.entity';

@Injectable()
export class ScanUseCases {
  constructor(
    private readonly purchaseSource: PurchaseSource,
    private readonly productSource: ProductSource
  ) {}

  public scanPurchase(code: string): Observable<void> {
    const EAN13BarCode = parseToEAN13BarCode(code);
    if (EAN13BarCode) {
      return this.addPurchase(EAN13BarCode).pipe(map(() => {}));
    } else {
      alert('Invalid ean 13 barcode !');
    }
  }

  public addPurchaseAndRefresh(
    code: string,
    displayedProductPurchase: ProductPurchase[]
  ): Observable<ProductPurchase[]> {
    const EAN13BarCode = parseToEAN13BarCode(code);
    if (EAN13BarCode) {
      return this.addPurchase(EAN13BarCode).pipe(
        flatMap((_) => this.readProductPurchase(_)),
        map((productPurchase) => {
          const existingProductPurchase = displayedProductPurchase.findIndex(
            (_) => _.code === productPurchase.code
          );
          if (existingProductPurchase === -1) {
            return [...displayedProductPurchase, productPurchase];
          } else {
            const news = [...displayedProductPurchase];
            news[existingProductPurchase] = productPurchase;
            return news;
          }
        })
      );
    } else {
      alert('Unknown product code...');
    }
  }

  public increaseQuantityAndRefresh(
    code: EAN13Barcode,
    displayedProductPurchase: ProductPurchase[]
  ): Observable<ProductPurchase[]> {
    return this.purchaseSource.read(code).pipe(
      flatMap((_) => this.increasePurchaseQuantity(_)),
      map((purchase) => {
        return displayedProductPurchase.map((_) => {
          return _.code === code ? { ..._, ...purchase } : _;
        });
      })
    );
  }

  public decreaseQuantityAndRefresh(
    code: EAN13Barcode,
    displayedProductPurchase: ProductPurchase[]
  ): Observable<ProductPurchase[]> {
    return this.purchaseSource.read(code).pipe(
      flatMap((_) => this.decreasePurchaseQuantity(_)),
      map((purchase) => {
        return displayedProductPurchase
          .map((_) => {
            return _.code === purchase.code ? { ..._, ...purchase } : _;
          })
          .filter((_) => _.quantity > 0);
      })
    );
  }

  public readAllProductsPurchase(): Observable<ProductPurchase[]> {
    return this.purchaseSource.all().pipe(
      map((purchases) => purchases.filter((_) => _.quantity > 0)),
      flatMap((purchases) => {
        return purchases.length > 0
          ? forkJoin(purchases.map((_) => this.readProductPurchase(_)))
          : of([]);
      })
    );
  }

  public productTotal(products: ProductPurchase[]): number {
    return products.reduce((acc, c) => acc + (c.price ?? 0) * c.quantity, 0);
  }

  private addPurchase(EAN13BarCode: EAN13Barcode) {
    return this.purchaseSource.read(EAN13BarCode).pipe(
      flatMap((existingPurchase) => {
        if (existingPurchase) {
          return this.increasePurchaseQuantity(existingPurchase);
        } else {
          return this.purchaseSource.create({
            code: EAN13BarCode,
            quantity: 1,
          });
        }
      })
    );
  }

  private readProductPurchase(purchase: Purchase) {
    return this.productSource.product(purchase.code).pipe(
      map((product) => {
        return { ...product, ...purchase };
      })
    );
  }

  private increasePurchaseQuantity(purchase: Purchase) {
    const updatedPurchase = {
      code: purchase.code,
      quantity: purchase.quantity + 1,
    };
    return this.purchaseSource.update(updatedPurchase);
  }

  private decreasePurchaseQuantity(purchase) {
    const updatedPurchase = {
      code: purchase.code,
      quantity: purchase.quantity > 0 ? purchase.quantity - 1 : 0,
    };
    return this.purchaseSource.update(updatedPurchase);
  }
}
