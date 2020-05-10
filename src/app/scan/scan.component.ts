import { Component, OnInit } from '@angular/core';
import { environment } from '../../environments/environment';
type Dev = 'dev';
type Fake = 'fake';
type Prod = 'prod';
type Mode = Dev | Fake | Prod;
const DevMode: Dev = 'dev';
const FakeMode: Fake = 'fake';
const ProdMode: Prod = 'prod';

@Component({
  selector: 'app-scan',
  templateUrl: './scan.component.html',
  styleUrls: ['./scan.component.css'],
})
export class ScanComponent implements OnInit {
  private readonly mode: Mode = environment.mode as Mode;

  constructor() {}

  ngOnInit(): void {}

  onCodeAvailable(code: string) {
    alert(code);
  }

  isDev() {
    return this.mode === DevMode;
  }

  isFake() {
    return this.mode === FakeMode;
  }

  isProd() {
    return this.mode === ProdMode;
  }
}
