import { ScanPageComponent } from './scan-page.component';
import { fireEvent, render, screen } from '@testing-library/angular';
import { ScanInMemoryComponent } from '../scan/lib/scan-in-memory/scan-in-memory.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ScanComponent } from '../scan/scan.component';
import { ProductPurchase } from '../core/scan/product.entity';
import { EAN13Barcode, parseToEAN13BarCode } from '../core/scan/scan.entity';
import { ScanUseCases } from '../core/scan/scan.use-cases';
import { fakeAsync, TestBed } from '@angular/core/testing';
import { PurchaseSource } from '../core/scan/purchaseSource';
import { ProductInMemorySource } from '../core/scan/adapters/product-in-memory.source';
import { PurchaseInMemorySource } from '../core/scan/adapters/purchase-in-memory.source';
import { ProductSource } from '../core/scan/product.source';
import { ScannedProductsComponent } from '../scanned-products/scanned-products.component';

function EAN13BarcodeFake(code: string = '3270190207924') {
  return parseToEAN13BarCode(code);
}
function productFake(
  props: Partial<{ code: EAN13Barcode; name: string; price: number }>
): ProductPurchase {
  return {
    quantity: 0,
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
    products?: ProductPurchase[];
    scanMode?: 'manual' | 'basic' | 'accurate';
  } = { products: [], scanMode: 'manual' }
) {
  return {
    imports: [ReactiveFormsModule],
    declarations: [ScanComponent, ScanInMemoryComponent],
    providers: [
      ScanUseCases,
      {
        provide: PurchaseSource,
        useValue: new PurchaseInMemorySource(),
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

  describe('scanned product actions', () => {
    it('should save the scanned product', fakeAsync(async () => {
      // GIVEN
      const scanPage = await render(ScanPageComponent, scanPageOptions());
      const scanUseCases = TestBed.inject(ScanUseCases);
      // WHEN
      await scanPage.type(
        screen.getByTestId('manual-scan-input'),
        productA.code.toString()
      );
      fireEvent.click(screen.getByText('+'));
      // THEN
      await scanUseCases
        .readAllProductsPurchase()
        .subscribe((products) => expect(products.length === 1).toBeTrue());
    }));
  });
});
