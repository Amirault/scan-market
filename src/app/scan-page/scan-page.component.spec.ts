import { ScanPageComponent } from './scan-page.component';
import { fireEvent, render, screen } from '@testing-library/angular';
import { ScanInMemoryComponent } from '../scan/lib/scan-in-memory/scan-in-memory.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ScanComponent } from '../scan/scan.component';
import { ProductInMemoryService } from './core/product-in-memory.service';
import { ScannedProduct } from './core/product.entity';
import { EAN13Barcode } from './core/scan.entity';

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
    products = [],
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
      {
        provide: 'ProductService',
        useValue: new ProductInMemoryService(products),
      },
      {
        provide: 'ENV',
        useValue: { scanMode },
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

  describe('scanned product display', () => {
    it('should have name, code and price', async () => {
      // GIVEN
      const scanPage = await render(
        ScanPageComponent,
        scanPageOptions({ products: [productA] })
      );
      await expect(screen.queryByText(productA.code.toString())).toBeNull();
      await expect(screen.queryByText(productA.name.toString())).toBeNull();
      await expect(screen.queryByText(productA.price.toString())).toBeNull();
      // WHEN
      await scanPage.type(
        screen.getByTestId('manual-scan-input'),
        productA.code.toString()
      );
      fireEvent.click(screen.getByText('+'));
      await expect(screen.queryByText(productA.code.toString())).not.toBeNull();
      await expect(screen.queryByText(productA.name.toString())).not.toBeNull();
      await expect(
        screen.queryByText(productA.price.toString())
      ).not.toBeNull();
    });
  });

  it('should display all the scanned product', async () => {
    // GIVEN
    const scanPage = await render(
      ScanPageComponent,
      scanPageOptions({ products: [productA, productB] })
    );
    await expect(screen.queryByText(productA.name.toString())).toBeNull();
    await expect(screen.queryByText(productB.name.toString())).toBeNull();
    // WHEN
    await scanPage.type(
      screen.getByTestId('manual-scan-input'),
      productA.code.toString()
    );
    fireEvent.click(screen.getByText('+'));
    await scanPage.type(
      screen.getByTestId('manual-scan-input'),
      productB.code.toString()
    );
    fireEvent.click(screen.getByText('+'));
    // THEN
    await expect(screen.queryByText(productA.name.toString())).not.toBeNull();
    await expect(screen.queryByText(productB.name.toString())).not.toBeNull();
  });

  describe('scanned product actions', () => {
    it('should be possible to remove a scanned product', async () => {
      // GIVEN
      const scanPage = await render(
        ScanPageComponent,
        scanPageOptions({ products: [productA, productB] })
      );
      await expect(screen.queryByText(productA.code.toString())).toBeNull();
      await expect(screen.queryByText(productB.code.toString())).toBeNull();
      await scanPage.type(
        screen.getByTestId('manual-scan-input'),
        productA.code.toString()
      );
      fireEvent.click(screen.getByText('+'));
      await expect(screen.queryByText(productA.code.toString())).not.toBeNull();
      await expect(screen.queryByText(productA.name.toString())).not.toBeNull();
      // WHEN
      fireEvent.click(
        screen.getByTestId(`remove-action-${productA.code.toString()}`)
      );
      // THEN
      await expect(screen.queryByText(productA.code.toString())).toBeNull();
      await expect(screen.queryByText(productA.name.toString())).toBeNull();
    });
  });

  describe('basket information', () => {
    it('should display 0 in basket total when not having scanned product', async () => {
      // GIVEN
      await render(
        ScanPageComponent,
        scanPageOptions({ products: [productA, productB] })
      );
      await expect(screen.queryByText(`Total: 0 Euro(s)`)).not.toBeNull();
    });

    it('should display the sum of the product in basket total when having scanned products', async () => {
      // GIVEN
      const scanPage = await render(
        ScanPageComponent,
        scanPageOptions({
          products: [
            { ...productA, price: 10 },
            { ...productB, price: 0.75 },
          ],
        })
      );
      // WHEN
      await scanPage.type(
        screen.getByTestId('manual-scan-input'),
        productA.code.toString()
      );
      fireEvent.click(screen.getByText('+'));
      await scanPage.type(
        screen.getByTestId('manual-scan-input'),
        productB.code.toString()
      );
      fireEvent.click(screen.getByText('+'));
      // THEN
      await expect(screen.queryByText(`Total: 10.75 Euro(s)`)).not.toBeNull();
    });
  });
});
