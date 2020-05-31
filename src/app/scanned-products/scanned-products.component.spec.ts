import { fireEvent, render, screen } from '@testing-library/angular';
import { ReactiveFormsModule } from '@angular/forms';
import { EAN13Barcode } from '../core/scan/scan.entity';
import { ScannedProduct } from '../core/scan/product.entity';
import { ScannedProductsComponent } from './scanned-products.component';
import { ScanManuallyComponent } from './scan-manually/scan-manually.component';
import { ScanUseCases } from '../core/scan/scan.use-cases';
import { ProductInMemorySource } from '../core/scan/adapters/product-in-memory.source';
import { CodeSource } from '../core/scan/code.source';
import { fakeAsync } from '@angular/core/testing';
import { CodeInMemorySource } from '../core/scan/adapters/code-in-memory.source';
import { ProductSource } from '../core/scan/product.source';

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
  }: {
    products?: ScannedProduct[];
  } = { products: [] }
) {
  return {
    imports: [ReactiveFormsModule],
    declarations: [ScanManuallyComponent],
    providers: [
      ScanUseCases,
      {
        provide: CodeSource,
        useValue: new CodeInMemorySource(products.map((_) => _.code)),
      },
      {
        provide: ProductSource,
        useValue: new ProductInMemorySource(products),
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
    it('should display nothing when not having products', fakeAsync(async () => {
      // GIVEN
      await render(ScannedProductsComponent, scanPageOptions({ products: [] }));
      await expect(screen.queryByText(productA.code.toString())).toBeNull();
      await expect(screen.queryByText(productA.name.toString())).toBeNull();
      await expect(screen.queryByText(productA.price.toString())).toBeNull();
    }));

    it('should have name, code and price', fakeAsync(async () => {
      // GIVEN
      await render(
        ScannedProductsComponent,
        scanPageOptions({ products: [productA] })
      );
      // THEN
      await expect(screen.queryByText(productA.code.toString())).not.toBeNull();
      await expect(screen.queryByText(productA.name)).not.toBeNull();
      await expect(
        screen.queryAllByText(`${productA.price.toString()}€`)
      ).not.toBeNull();
    }));

    it('should display empty when not having corresponding name', fakeAsync(async () => {
      // GIVEN
      const productWithoutName = productFake({
        code: EAN13BarcodeFake('3270190207924'),
        name: undefined,
        price: 1.5,
      });
      await render(
        ScannedProductsComponent,
        scanPageOptions({ products: [productWithoutName] })
      );
      // THEN
      await expect(
        screen.queryByText(productWithoutName.code.toString())
      ).not.toBeNull();
      await expect(
        screen.queryAllByText(`${productWithoutName.price}€`)
      ).not.toBeNull();
      await expect(screen.queryByText('-')).not.toBeNull();
    }));

    it('should display empty when not having corresponding price', fakeAsync(async () => {
      // GIVEN
      const productWithoutPrice = productFake({
        code: EAN13BarcodeFake('3270190207924'),
        name: 'eau',
        price: undefined,
      });
      await render(
        ScannedProductsComponent,
        scanPageOptions({
          products: [productWithoutPrice],
        })
      );
      // THEN
      await expect(
        screen.queryByText(productWithoutPrice.code.toString())
      ).not.toBeNull();
      await expect(screen.queryByText(productWithoutPrice.name)).not.toBeNull();
      await expect(screen.queryByText('-€')).not.toBeNull();
    }));

    it('should display all the scanned product', fakeAsync(async () => {
      // GIVEN
      await render(
        ScannedProductsComponent,
        scanPageOptions({ products: [productA, productB] })
      );
      // THEN
      await expect(screen.queryByText(productA.name)).not.toBeNull();
      await expect(screen.queryByText(productB.name)).not.toBeNull();
    }));
  });

  describe('scanned product actions', () => {
    it('should be possible to remove a scanned product', fakeAsync(async () => {
      // GIVEN
      await render(
        ScannedProductsComponent,
        scanPageOptions({ products: [productA, productB] })
      );
      // WHEN
      fireEvent.click(
        screen.getByTestId(`remove-action-${productA.code.toString()}`)
      );
      // THEN
      await expect(screen.queryByText(productA.name)).toBeNull();
      await expect(screen.queryByText(productB.name)).not.toBeNull();
    }));
  });

  describe('basket information', () => {
    it('should display 0 in basket total when not having scanned product', fakeAsync(async () => {
      // GIVEN
      await render(ScannedProductsComponent, scanPageOptions({ products: [] }));
      // THEN
      await expect(screen.queryByText(`Total :`)).toBeNull();
    }));

    it('should display the sum of the product in basket total when having scanned products', fakeAsync(async () => {
      // GIVEN
      await render(
        ScannedProductsComponent,
        scanPageOptions({
          products: [
            { ...productA, price: 10 },
            { ...productB, price: 0.75 },
          ],
        })
      );
      // THEN
      await expect(screen.queryByText(`Total :`)).not.toBeNull();
      await expect(screen.queryByText(`10.75€`)).not.toBeNull();
    }));
  });
});
