import { EAN13Barcode } from '../scan.entity';
import { BehaviorSubject, Observable, of, Subject } from 'rxjs';
import { CodeSource } from '../code.source';

export class CodeInMemorySource implements CodeSource {
  constructor(private codes: EAN13Barcode[] = []) {}

  save(code: EAN13Barcode): Observable<void> {
    this.codes.push(code);
    return of(undefined);
  }

  all(): Observable<EAN13Barcode[]> {
    return of(this.codes);
  }

  deleteOne(code: EAN13Barcode): Observable<void> {
    const codeIndex = this.codes.findIndex((_) => _ === code);
    this.codes = this.codes.filter((_, i) => i !== codeIndex);
    return of(undefined);
  }
}
