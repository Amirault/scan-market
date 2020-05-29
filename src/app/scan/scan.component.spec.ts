import { ScanComponent } from './scan.component';
import { render, screen } from '@testing-library/angular';
import { ScanInMemoryComponent } from './lib/scan-in-memory/scan-in-memory.component';
import { ScanditComponent } from './lib/scandit/scandit.component';
import { ScanQuaggaComponent } from './lib/scanquagga/scan-quagga.component';
import { ReactiveFormsModule } from '@angular/forms';

describe('ScanComponent', () => {
  it('should display manual scan when the env is fake', async () => {
    await render(ScanComponent, {
      imports: [ReactiveFormsModule],
      componentProperties: {
        scannerType: 'manual',
      },
      declarations: [ScanInMemoryComponent],
    });
    const buttonAddCode = screen.queryByText('+');
    await expect(buttonAddCode).not.toBeNull();
  });

  it('should display accurate scan when the env is prod', async () => {
    await render(ScanComponent, {
      componentProperties: {
        scannerType: 'accurate',
      },
      declarations: [ScanditComponent],
    });
    const accurateScan = screen.queryByTestId('accurate-scan');
    await expect(accurateScan).not.toBeNull();
  });

  it('should display basic scan when the env is dev', async () => {
    await render(ScanComponent, {
      componentProperties: {
        scannerType: 'basic',
      },
      declarations: [ScanQuaggaComponent],
    });
    const accurateScan = screen.queryByTestId('basic-scan');
    await expect(accurateScan).not.toBeNull();
  });
});
