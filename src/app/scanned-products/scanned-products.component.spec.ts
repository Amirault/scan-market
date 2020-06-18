import { fireEvent, render, screen } from '@testing-library/angular';
import { ReactiveFormsModule } from '@angular/forms';
import { EAN13Barcode } from '../core/scan/scan.entity';
import { Product, Purchase } from '../core/scan/product.entity';
import { ScannedProductsComponent } from './scanned-products.component';
import { ScanManuallyComponent } from './scan-manually/scan-manually.component';
import { ScanUseCases } from '../core/scan/scan.use-cases';
import { ProductInMemorySource } from '../core/scan/adapters/product-in-memory.source';
import { PurchaseSource } from '../core/scan/purchaseSource';
import { fakeAsync } from '@angular/core/testing';
import { PurchaseInMemorySource } from '../core/scan/adapters/purchase-in-memory.source';
import { ProductSource } from '../core/scan/product.source';

function EAN13BarcodeFake(code: string = '3270190207924') {
  return (code as unknown) as EAN13Barcode;
}
function productFake(
  props: Partial<{ code: EAN13Barcode; name: string; price: number }>
): Product {
  return {
    code: EAN13BarcodeFake(),
    name: 'Eau',
    price: 0.75,
    ...props,
  };
}

function scanPageOptions(
  {
    purchases = [],
    products = [],
  }: {
    purchases?: Purchase[];
    products?: Product[];
  } = { purchases: [], products: [] }
) {
  return {
    imports: [ReactiveFormsModule],
    declarations: [ScanManuallyComponent],
    providers: [
      ScanUseCases,
      {
        provide: PurchaseSource,
        useValue: new PurchaseInMemorySource(purchases),
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
  const purchaseA = {
    code: productA.code,
    quantity: 1,
  } as const;
  const purchaseB = {
    code: productB.code,
    quantity: 1,
  } as const;
  describe('product purchase display', () => {
    it('should display nothing when not having product purchase', fakeAsync(async () => {
      // GIVEN
      await render(
        ScannedProductsComponent,
        scanPageOptions({ purchases: [], products: [productA, productB] })
      );
      await expect(screen.queryByText(productA.code.toString())).toBeNull();
      await expect(screen.queryByText(productA.name.toString())).toBeNull();
      await expect(screen.queryByText(productA.price.toString())).toBeNull();
    }));

    it('should have name, code and price of the purchase', fakeAsync(async () => {
      // GIVEN
      await render(
        ScannedProductsComponent,
        scanPageOptions({
          purchases: [purchaseA],
          products: [productA, productB],
        })
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
        scanPageOptions({
          purchases: [{ code: productWithoutName.code, quantity: 1 }],
          products: [productWithoutName],
        })
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
          purchases: [{ code: productWithoutPrice.code, quantity: 1 }],
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

    it('should display the quantity when single purchase', fakeAsync(async () => {
      // GIVEN
      await render(
        ScannedProductsComponent,
        scanPageOptions({
          purchases: [{ code: productA.code, quantity: 1 }],
          products: [productA, productB],
        })
      );
      // THEN
      await expect(screen.queryByText(`Qty: 1`)).not.toBeNull();
    }));

    it('should display the quantity when multiple same product purchase', fakeAsync(async () => {
      // GIVEN
      await render(
        ScannedProductsComponent,
        scanPageOptions({
          purchases: [{ code: productA.code, quantity: 3 }],
          products: [productA, productB],
        })
      );
      // THEN
      await expect(screen.queryByText(`Qty: 3`)).not.toBeNull();
    }));

    it('should display only one product information when multiple of the same product', fakeAsync(async () => {
      // GIVEN
      await render(
        ScannedProductsComponent,
        scanPageOptions({
          purchases: [{ code: productA.code, quantity: 3 }],
          products: [productA, productB],
        })
      );
      // THEN
      await expect(screen.getAllByText(productA.name).length).toEqual(1);
    }));
  });

  describe('scanned product actions', () => {
    it('should be possible to remove a product purchase', fakeAsync(async () => {
      // GIVEN
      await render(
        ScannedProductsComponent,
        scanPageOptions({
          purchases: [
            { code: productA.code, quantity: 1 },
            { code: productB.code, quantity: 1 },
          ],
          products: [productA, productB],
        })
      );
      // WHEN
      fireEvent.click(
        screen.getByTestId(`remove-action-${productA.code.toString()}`)
      );
      // THEN
      await expect(screen.queryByText(productA.name)).toBeNull();
      await expect(screen.queryByText(productB.name)).not.toBeNull();
    }));

    it('should be possible to add more quantity', fakeAsync(async () => {
      // GIVEN
      await render(
        ScannedProductsComponent,
        scanPageOptions({
          purchases: [{ code: productA.code, quantity: 1 }],
          products: [productA, productB],
        })
      );
      await expect(screen.queryByText(productA.name)).not.toBeNull();
      await expect(screen.queryByText(`Qty: 1`)).not.toBeNull();
      // WHEN
      fireEvent.click(
        screen.getByTestId(`add-action-${productA.code.toString()}`)
      );
      // THEN
      await expect(screen.queryByText(productA.name)).not.toBeNull();
      await expect(screen.queryByText(`Qty: 2`)).not.toBeNull();
    }));

    it('should be possible to remove quantity', fakeAsync(async () => {
      // GIVEN
      await render(
        ScannedProductsComponent,
        scanPageOptions({
          purchases: [{ code: productA.code, quantity: 2 }],
          products: [productA, productB],
        })
      );
      await expect(screen.queryByText(productA.name)).not.toBeNull();
      await expect(screen.queryByText(`Qty: 2`)).not.toBeNull();
      // WHEN
      fireEvent.click(
        screen.getByTestId(`remove-action-${productA.code.toString()}`)
      );
      // THEN
      await expect(screen.queryByText(productA.name)).not.toBeNull();
      await expect(screen.queryByText(`Qty: 1`)).not.toBeNull();
    }));
  });

  describe('basket information', () => {
    it('should display 0 in basket total when not having purchases', fakeAsync(async () => {
      // GIVEN
      await render(
        ScannedProductsComponent,
        scanPageOptions({ purchases: [], products: [productA, productB] })
      );
      // THEN
      await expect(screen.queryByText(`Total :`)).toBeNull();
    }));

    it('should display the sum of the product in basket total when having multiple products purchase', fakeAsync(async () => {
      // GIVEN
      await render(
        ScannedProductsComponent,
        scanPageOptions({
          purchases: [purchaseA, purchaseB],
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

    it('should have the total corresponding to the product quantity', fakeAsync(async () => {
      // GIVEN
      await render(
        ScannedProductsComponent,
        scanPageOptions({
          purchases: [{ ...purchaseA, quantity: 2 }, purchaseB],
          products: [
            { ...productA, price: 10 },
            { ...productB, price: 0.75 },
          ],
        })
      );
      // THEN
      await expect(screen.queryByText(`Total :`)).not.toBeNull();
      await expect(screen.queryByText(`20.75€`)).not.toBeNull();
    }));
  });
});
