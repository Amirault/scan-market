import { ScanPageComponent } from './scan-page.component';
import { fireEvent, render, screen } from '@testing-library/angular';
import { ScanInMemoryComponent } from '../scan/lib/scan-in-memory/scan-in-memory.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ScanComponent } from '../scan/scan.component';
import { ScannedProduct } from '../core/scan/product.entity';
import { EAN13Barcode } from '../core/scan/scan.entity';
import { ScanUseCases } from '../core/scan/scan.use-cases';
import { fakeAsync, TestBed } from '@angular/core/testing';
import { CodeSource } from '../core/scan/code.source';
import { ProductInMemorySource } from '../core/scan/adapters/product-in-memory.source';
import { CodeInMemorySource } from '../core/scan/adapters/code-in-memory.source';
import { ProductSource } from '../core/scan/product.source';
import { RouterModule } from '@angular/router';
import { ScannedProductsComponent } from '../scanned-products/scanned-products.component';

function EAN13BarcodeFake(code: string = '3270190207924') {
  return (code as unknown) as EAN13Barcode;
}
function productFake(
  props: Partial<{ code: EAN13Barcode; name: string; price: number }>
): ScannedProduct {
  return {
    code: EAN13BarcodeFake(),
    name: 'Eau',
    price: 0.75,
    ...props,
  };
}

function scanPageOptions(
  {
    scanMode = 'manual',
  }: {
    products?: ScannedProduct[];
    scanMode?: 'manual' | 'basic' | 'accurate';
  } = { products: [], scanMode: 'manual' }
) {
  return {
    imports: [ReactiveFormsModule],
    declarations: [ScanComponent, ScanInMemoryComponent],
    providers: [
      ScanUseCases,
      {
        provide: CodeSource,
        useValue: new CodeInMemorySource(),
      },
      {
        provide: ProductSource,
        useValue: new ProductInMemorySource(),
      },
      {
        provide: 'ENV',
        useValue: { scanMode },
      },
    ],
    routes: [
      {
        path: 'scanned-products',
        component: ScannedProductsComponent,
      },
    ],
  };
}

describe('ScanPageComponent', () => {
  const productA = productFake({
    code: EAN13BarcodeFake('3270190207924'),
    name: 'Eau',
    price: 0.75,
  });
  const productB = productFake({
    code: EAN13BarcodeFake('3257971309114'),
    name: 'Brioche',
    price: 3,
  });

  describe('scanned product actions', () => {
    it('should save the scanned product', fakeAsync(async () => {
      // GIVEN
      const scanPage = await render(
        ScanPageComponent,
        scanPageOptions({ products: [] })
      );
      const scanUseCases = TestBed.inject(ScanUseCases);
      // WHEN
      await scanPage.type(
        screen.getByTestId('manual-scan-input'),
        productA.code.toString()
      );
      fireEvent.click(screen.getByText('+'));
      // THEN
      await scanUseCases
        .scannedProducts()
        .subscribe((products) => expect(products.length === 1).toBeTrue());
    }));
  });
});
