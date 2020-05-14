import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import * as Quagga from 'quagga';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-scan-quagga',
  template: '<div data-testid="basic-scan" id="quagga-scan-zone"></div>',
})
export class ScanQuaggaComponent implements OnInit {
  @Output()
  code = new EventEmitter<string>();

  constructor(@Inject(DOCUMENT) private readonly document) {}

  ngOnInit() {
    const config = {
      ...DEFAULT_CONFIG,
      inputStream: {
        ...DEFAULT_CONFIG.inputStream,
        target: this.document.getElementById('quagga-scan-zone'),
      },
    };
    Quagga.init(config, (err) => {
      if (err) {
        console.log(err);
      } else {
        console.log('Initialization finished. Ready to start');
        Quagga.start();
      }
    });
    Quagga.onDetected((d) => {
      console.log(`quagga detected code: ${JSON.stringify(d)}`);
      const code = d?.codeResult?.code;
      this.code.emit(code);
    });
  }
}

export const DEFAULT_CONFIG = {
  inputStream: {
    name: 'Live',
    type: 'LiveStream',
    target: null,
    constraints: {
      width: { min: 640 },
      height: { min: 480 },
      aspectRatio: { min: 1, max: 100 },
      facingMode: 'user',
    },
    singleChannel: false,
  },
  locator: {
    patchSize: 'medium',
    halfSample: true,
  },
  locate: true,
  numOfWorkers: navigator.hardwareConcurrency,
  decoder: {
    readers: ['ean_reader'],
  },
} as QuaggaConfig;

export interface QuaggaConfig {
  inputStream: {
    name: string;
    type: string;
    target: any;
    constraints: {
      width: { min: number };
      height: { min: number };
      aspectRatio: { min: number; max: number };
      facingMode: string; // or user
      deviceId: string;
    };
    singleChannel: boolean; // true: only the red color-channel is read
  };
  locator: {
    patchSize: string;
    halfSample: boolean;
  };
  locate: boolean;
  numOfWorkers: number;
  decoder: {
    readers: string[];
  };
}
