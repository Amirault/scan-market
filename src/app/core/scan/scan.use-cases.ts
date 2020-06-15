import { Injectable } from '@angular/core';
import { CodeSource } from './code.source';
import { EAN13Barcode, parseToEAN13BarCode } from './scan.entity';
import { ProductSource } from './product.source';
import { forkJoin, Observable, of } from 'rxjs';
import { flatMap, map } from 'rxjs/operators';
import { Product, ScannedProduct } from './product.entity';

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

  saveProductCodeAndRefresh(
    code: string,
    scannedProducts: ScannedProduct[]
  ): Observable<ScannedProduct[]> {
    const EAN13BarCode = parseToEAN13BarCode(code);
    if (EAN13BarCode) {
      const existingProductIndex = scannedProducts.findIndex(
        (_) => _.code === EAN13BarCode
      );
      return this.codeSource.save(EAN13BarCode).pipe(
        flatMap(() => {
          return existingProductIndex === -1
            ? this.productSource.product(EAN13BarCode)
            : of(undefined);
        }),
        map((product: Product | undefined) => {
          if (product) {
            return [...scannedProducts, { ...product, quantity: 1 }];
          } else {
            const p = scannedProducts[existingProductIndex];
            const newScannedProducts = [...scannedProducts];
            newScannedProducts[existingProductIndex] = {
              ...p,
              quantity: p.quantity + 1,
            };
            return newScannedProducts;
          }
        })
      );
    } else {
      alert('Unknown product code...');
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

  removeProduct(
    code: EAN13Barcode,
    scannedProducts: ScannedProduct[]
  ): Observable<ScannedProduct[]> {
    return this.codeSource.deleteOne(code).pipe(
      map(() => {
        const productRemovedIndex = scannedProducts.findIndex(
          (_) => _.code === code
        );
        if (productRemovedIndex) {
          const p = scannedProducts[productRemovedIndex];
          const newScannedProducts = [...scannedProducts];
          newScannedProducts[productRemovedIndex] = {
            ...p,
            quantity: p.quantity - 1,
          };
          return newScannedProducts;
        } else {
          const otherScannedProducts = scannedProducts.filter(
            (_) => _.code !== code
          );
          return otherScannedProducts;
        }
      })
    );
  }

  productTotal(products: ScannedProduct[]): number {
    return products.reduce((acc, c) => acc + (c.price ?? 0) * c.quantity, 0);
  }
}
