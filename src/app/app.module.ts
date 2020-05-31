import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { RouterModule } from '@angular/router';
import { ScanditSdkModule } from 'scandit-sdk-angular';
import { ScanditComponent } from './scan/lib/scandit/scandit.component';
import { ScanComponent } from './scan/scan.component';
import { ScanQuaggaComponent } from './scan/lib/scanquagga/scan-quagga.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ScanInMemoryComponent } from './scan/lib/scan-in-memory/scan-in-memory.component';
import { ScanPageComponent } from './scan-page/scan-page.component';
import { environment } from '../environments/environment';
import { NgxBarcode6Module } from 'ngx-barcode6';
import { ProductSource } from './core/scan/product.source';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ProductRestSource } from './core/scan/adapters/product-rest.source';
import { ScannedProductsComponent } from './scanned-products/scanned-products.component';
import { ScanManuallyComponent } from './scanned-products/scan-manually/scan-manually.component';
import { ScanUseCases } from './core/scan/scan.use-cases';
import { CodeSource } from './core/scan/code.source';
import { CodeInMemorySource } from './core/scan/adapters/code-in-memory.source';
import { MenuComponent } from './menu/menu.component';

const routes = [
  { path: 'scanned-products', component: ScannedProductsComponent },
  { path: '', component: ScannedProductsComponent },
  {
    path: 'scan',
    component: ScanPageComponent,
  },
];

const licenseKey =
  'AYZOWTgGJ8kJOjnAC0H0qMs0m/6tPx0y3CSq96k5c6j1D9FskB4bFx4gPXb5aklg5mEVn8ZKo/wOfpliM0wIyMFMF8RIBHpb8VO+NWdx0cBgRoAuBkG1YDd+Q1m+YNPNvWjMKS4o9yzaEgqqWQx56rNPgUax1/3qHlHp2eni6+Q3GO0pKOondACt99xiT6toOyHD+voPKqs2dnLxDezfV47VhcMMgdqeR9QHotKD+TxLuXyimDn6T9YFN93/36E2jcXszTd78o7sX6j4iIvk9oKix4NWXClZxpRpzsx4VQ2YIe6vtMA1xShjYgL1FtrBjLsjJPaMhT04dvwzdLjwJ6LYOyhCiOXWb7SAU4QRHL/y89Mhi18kWaRsjaU7RWTSwHp0wHET6+ZrdZdc2xTyQAWUfPd3DkTYGUV0jQLDTdWDiDGYqVOIcfMocWwxpJY9zGpiWhNR2TAuobaEbqRwkfp3k46f1LY6GtJIE6Hg0rxlL1JOC0Rvc/13A7HI9gz31RXeYdzObv1o/7lcNclUFFw22NtW1160hjDiekxyixfLQvokwmBZJMzdZbKi0lo0XGLnrFWxiI/6HglTFsVkXELSrZ0ubEcLyJdssfskfcsNA/O1486e6MonYkQ6VCo9wgODZAR1FCPgKKC/kuYesIO3HGgEL4LAjyC8jDKtkUBJS7ijsiaBwjg9aYxJmOpablLGSlSXSgBfH1STRA2JRLzqXOZfOiOlos3kURmGqQpM+D8xFFbEcBHYMmOGOid42nZcmpwJwtloYxsBRCkFu1C9CApaWy5+wDmzrhUuSn2EE3lZ5Q0Wgx6GqwJ+f75LRg==';
const engineLocation = 'assets/';

@NgModule({
  declarations: [
    AppComponent,
    ScanditComponent,
    ScanPageComponent,
    ScanComponent,
    ScanQuaggaComponent,
    ScanInMemoryComponent,
    ScanPageComponent,
    ScannedProductsComponent,
    ScanManuallyComponent,
    MenuComponent,
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes),
    ScanditSdkModule.forRoot(licenseKey, engineLocation),
    ReactiveFormsModule,
    NgxBarcode6Module,
    HttpClientModule,
  ],
  providers: [
    { provide: 'ENV', useValue: environment },
    {
      provide: ProductSource,
      useFactory: (httpClient: HttpClient) => {
        return new ProductRestSource(httpClient);
      },
      deps: [HttpClient],
    },
    ScanUseCases,
    {
      provide: CodeSource,
      useValue: new CodeInMemorySource([]),
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
