import { AppComponent } from './app.component';
import { render } from '@testing-library/angular';
import { RouterModule } from '@angular/router';

describe('AppComponent', async () => {
  await render(AppComponent, {
    declarations: [RouterModule],
  });
});
