import { Injectable } from '@angular/core';
import { CodeSource } from './code.source';
import { EAN13Barcode, parseToEAN13BarCode } from './scan.entity';
import { ProductSource } from './product.source';
import { forkJoin, Observable, of } from 'rxjs';
import { flatMap, map } from 'rxjs/operators';
import { ScannedProduct } from './product.entity';

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
    return this.codeSource.all().pipe(
      flatMap((codes) => {
        return codes.length > 0
          ? forkJoin(codes.map((_) => this.productSource.product(_)))
          : of([]);
      })
    );
  }

  removeProduct(code: EAN13Barcode): Observable<void> {
    return this.codeSource.delete(code);
  }

  productTotal(products: ScannedProduct[]): number {
    return products.reduce((acc, c) => acc + (c.price ?? 0), 0);
  }
}
