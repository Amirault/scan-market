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

  saveProductCodeAndRefresh(
    code: string,
    scannedProducts: ScannedProduct[]
  ): Observable<ScannedProduct[]> {
    const EAN13BarCode = parseToEAN13BarCode(code);
    if (EAN13BarCode) {
      return this.codeSource.save(EAN13BarCode).pipe(
        flatMap(() => this.productSource.product(EAN13BarCode)),
        map((product) => {
          const existingProduct = scannedProducts.find((_) => _.code === code);
          const otherProducts = scannedProducts.filter((_) => _.code !== code);
          if (existingProduct) {
            return [
              ...otherProducts,
              { ...existingProduct, quantity: existingProduct.quantity + 1 },
            ];
          } else {
            return [...otherProducts, { ...product, quantity: 1 }];
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
        const productRemoved = scannedProducts.find((_) => _.code === code);
        const otherScannedProducts = scannedProducts.filter(
          (_) => _.code !== code
        );
        if (productRemoved.quantity > 1) {
          return [
            ...otherScannedProducts,
            { ...productRemoved, quantity: productRemoved.quantity - 1 },
          ];
        } else {
          return otherScannedProducts;
        }
      })
    );
  }

  productTotal(products: ScannedProduct[]): number {
    return products.reduce((acc, c) => acc + (c.price ?? 0) * c.quantity, 0);
  }
}
