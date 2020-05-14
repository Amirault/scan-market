import { ScanInMemoryComponent } from './scan-in-memory.component';
import { ReactiveFormsModule } from '@angular/forms';
import { render } from '@testing-library/angular';

describe('ScanInMemoryComponent', () => {
  it('should display the component', async () => {
    await render(ScanInMemoryComponent, {
      imports: [ReactiveFormsModule],
    });
  });
});
