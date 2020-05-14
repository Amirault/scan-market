import { ScanPageComponent } from './scan-page.component';
import { fireEvent, render, screen } from '@testing-library/angular';
import { ScanInMemoryComponent } from '../scan/lib/scan-in-memory/scan-in-memory.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ScanComponent } from '../scan/scan.component';
import { ScanditComponent } from '../scan/lib/scandit/scandit.component';
import { ScanQuaggaComponent } from '../scan/lib/scanquagga/scan-quagga.component';

describe('ScanPageComponent', () => {
  it('should display manual scan the the env is fake', async () => {
    await render(ScanPageComponent, {
      imports: [ReactiveFormsModule],
      declarations: [ScanComponent, ScanInMemoryComponent],
      providers: [
        {
          provide: 'ENV',
          useValue: { scanMode: 'manual' },
        },
      ],
    });
    const buttonAddCode = screen.queryByText('+');
    await expect(buttonAddCode).not.toBeNull();
  });

  it('should display accurate scan the the env is prod', async () => {
    await render(ScanPageComponent, {
      imports: [ReactiveFormsModule],
      declarations: [ScanComponent, ScanditComponent],
      providers: [
        {
          provide: 'ENV',
          useValue: { scanMode: 'accurate' },
        },
      ],
    });
    const accurateScan = screen.queryByTestId('accurate-scan');
    await expect(accurateScan).not.toBeNull();
  });

  it('should display basic scan the the env is dev', async () => {
    await render(ScanPageComponent, {
      imports: [ReactiveFormsModule],
      declarations: [ScanComponent, ScanQuaggaComponent],
      providers: [
        {
          provide: 'ENV',
          useValue: { scanMode: 'basic' },
        },
      ],
    });
    const accurateScan = screen.queryByTestId('basic-scan');
    await expect(accurateScan).not.toBeNull();
  });

  it('should display the scanned barcode', async () => {
    // GIVEN
    const scanPage = await render(ScanPageComponent, {
      imports: [ReactiveFormsModule],
      declarations: [ScanComponent, ScanInMemoryComponent],
      providers: [
        {
          provide: 'ENV',
          useValue: { scanMode: 'manual' },
        },
      ],
    });
    await expect(screen.queryByText('3257971309114')).toBeNull();
    // WHEN
    await scanPage.type(
      screen.getByTestId('manual-scan-input'),
      '3257971309114'
    );
    fireEvent.click(screen.getByText('+'));
    // THEN
    await expect(screen.queryByText('3257971309114')).not.toBeNull();
  });

  it('should display all the scanned barcode', async () => {
    // GIVEN
    const scanPage = await render(ScanPageComponent, {
      imports: [ReactiveFormsModule],
      declarations: [ScanComponent, ScanInMemoryComponent],
      providers: [
        {
          provide: 'ENV',
          useValue: { scanMode: 'manual' },
        },
      ],
    });
    await expect(screen.queryByText('3257971309114')).toBeNull();
    await expect(screen.queryByText('3270190207924')).toBeNull();
    // WHEN
    await scanPage.type(
      screen.getByTestId('manual-scan-input'),
      '3270190207924'
    );
    fireEvent.click(screen.getByText('+'));
    await scanPage.type(
      screen.getByTestId('manual-scan-input'),
      '3257971309114'
    );
    fireEvent.click(screen.getByText('+'));
    // THEN
    await expect(screen.queryByText('3257971309114')).not.toBeNull();
    await expect(screen.queryByText('3270190207924')).not.toBeNull();
  });
});
