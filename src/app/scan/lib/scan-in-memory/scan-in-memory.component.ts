import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { isValidBarcode } from '../../core/scan.entity';

@Component({
  selector: 'app-scan-in-memory',
  templateUrl: './scan-in-memory.component.html',
  styleUrls: ['./scan-in-memory.component.css'],
})
export class ScanInMemoryComponent implements OnInit {
  @Output()
  code = new EventEmitter<string>();
  scanForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.scanForm = this.fb.group({
      code: ['3257971309114', Validators.required],
    });
  }

  ngOnInit() {}

  submitCode() {
    const submittedCode = this.scanForm.value.code;
    if (isValidBarcode(submittedCode)) {
      this.code.emit(submittedCode);
    } else {
      alert('invalid ean 13 barcode !');
    }
  }
}
