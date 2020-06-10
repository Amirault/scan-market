import { EAN13Barcode } from '../scan.entity';
import { ProductSource } from '../product.source';
import { Product } from '../product.entity';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable, zip } from 'rxjs';

export class ProductRestSource implements ProductSource {
  constructor(private readonly httpClient: HttpClient) {
    console.log('ProductRestService instantiated');
  }

  product(code: EAN13Barcode): Observable<Product | undefined> {
    return zip(this.productInformation(code), this.productPrice(code)).pipe(
      map(([{ product: { product_name: name } }, price]) => ({
        code,
        name,
        price,
      }))
    );
  }

  private productInformation(code: EAN13Barcode) {
    return this.httpClient.get<{ product: { product_name: string } }>(
      `/api/info/${code.toString()}`
    );
  }

  private productPrice(code: EAN13Barcode): Observable<number | undefined> {
    return this.httpClient
      .get(`/api/price/${code}`, {
        responseType: 'text',
      })
      .pipe(
        map((_) => {
          return parsePrice(_);
        })
      );
  }
}

function parsePrice(dom: string) {
  const domElement = document.createElement('html');
  domElement.innerHTML = dom;

  const element = domElement.querySelector('.product-card-price');
  if (element) {
    const price = element.textContent.trim().replace('€', '').replace(',', '.');
    return Number(price);
  } else {
    return undefined;
  }
}
