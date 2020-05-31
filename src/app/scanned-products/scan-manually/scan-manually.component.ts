import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-manually',
  templateUrl: './scan-manually.component.html',
  styleUrls: ['./scan-manually.component.scss'],
})
export class ScanManuallyComponent implements OnInit {
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
    this.code.emit(submittedCode);
  }
}
