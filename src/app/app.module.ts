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
import { ProductInMemorySource } from './core/scan/adapters/product-in-memory.source';
import { CodeLocalStorageSource } from './core/scan/adapters/code-local-storage.source';

const routes = [
  { path: 'scanned-products', component: ScannedProductsComponent },
  {
    path: 'scan',
    component: ScanPageComponent,
  },
  { path: '', component: ScannedProductsComponent },
];

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
    RouterModule.forRoot(routes, {
      onSameUrlNavigation: 'reload',
    }),
    ScanditSdkModule.forRoot(environment.scanditKey, engineLocation),
    ReactiveFormsModule,
    NgxBarcode6Module,
    HttpClientModule,
  ],
  providers: [
    { provide: 'ENV', useValue: environment },
    {
      provide: ProductSource,
      useFactory: (httpClient: HttpClient) => {
        return environment.production
          ? new ProductRestSource(httpClient)
          : new ProductInMemorySource();
      },
      deps: [HttpClient],
    },
    ScanUseCases,
    {
      provide: CodeSource,
      useValue: environment.production
        ? new CodeLocalStorageSource()
        : new CodeInMemorySource([]),
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
