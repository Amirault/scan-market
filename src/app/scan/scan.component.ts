import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-scan',
  templateUrl: './scan.component.html',
  styleUrls: ['./scan.component.css'],
})
export class ScanComponent implements OnInit {
  @Input()
  scannerType: 'manual' | 'basic' | 'accurate';

  @Output()
  scannedCode = new EventEmitter<string>();

  isCameraAvailable: boolean;

  constructor() {
    this.isCameraAvailable = false;
  }

  ngOnInit(): void {
    navigator.mediaDevices.enumerateDevices().then((devices) => {
      this.isCameraAvailable = devices.some(
        (device) => 'videoinput' === device.kind
      );
    });
  }

  onCodeAvailable(scannedCode: string) {
    this.scannedCode.emit(scannedCode);
  }

  isManual() {
    return this.scannerType === 'manual';
  }

  isBasic() {
    return this.scannerType === 'basic';
  }

  isAccurate() {
    return this.scannerType === 'accurate';
  }
}
