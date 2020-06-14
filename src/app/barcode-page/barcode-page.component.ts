import { Component, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-barcode-page',
  templateUrl: './barcode-page.component.html',
})
export class BarcodePageComponent implements OnInit {
  code: string;

  constructor(private readonly activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.paramMap
      .pipe(map((params) => params.get('code')))
      .subscribe((code) => {
        this.code = code;
      });
  }
}
