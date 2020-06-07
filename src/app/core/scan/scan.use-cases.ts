import { Injectable } from '@angular/core';
import { CodeSource } from './code.source';
import { EAN13Barcode, parseToEAN13BarCode } from './scan.entity';
import { ProductSource } from './product.source';
import { forkJoin, Observable, of } from 'rxjs';
import { flatMap, map } from 'rxjs/operators';
import { ScannedProduct } from './product.entity';

function toCodesWithOccurrence(c: EAN13Barcode[]): Map<EAN13Barcode, number> {
  return c.reduce((acc, c) => {
    return acc.set(c, acc.has(c) ? acc.get(c) + 1 : 1);
  }, new Map<EAN13Barcode, number>());
}

@Injectable()
export class ScanUseCases {
  constructor(
    private readonly codeSource: CodeSource,
    private readonly productSource: ProductSource
  ) {}

  saveProductCode(code: string): Observable<void> {
    const EAN13BarCode = parseToEAN13BarCode(code);
    if (EAN13BarCode) {
      return this.codeSource.save(EAN13BarCode);
    } else {
      alert('Invalid ean 13 barcode !');
    }
  }

  scannedProducts(): Observable<ScannedProduct[]> {
    const codesWithOccurrence = this.codeSource
      .all()
      .pipe(map(toCodesWithOccurrence));
    return codesWithOccurrence.pipe(
      flatMap((codes) => {
        return codes.size > 0
          ? forkJoin(
              Array.from(codes.keys()).map((code) => {
                return this.productSource.product(code).pipe(
                  map((_) => {
                    return { quantity: codes.get(code), ..._ };
                  })
                );
              })
            )
          : of([]);
      })
    );
  }

  removeProduct(code: EAN13Barcode): Observable<void> {
    return this.codeSource.deleteOne(code);
  }

  productTotal(products: ScannedProduct[]): number {
    return products.reduce((acc, c) => acc + (c.price ?? 0) * c.quantity, 0);
  }
}
