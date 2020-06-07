import { EAN13Barcode } from '../scan.entity';
import { BehaviorSubject, Observable, of, Subject } from 'rxjs';
import { CodeSource } from '../code.source';

export class CodeInMemorySource implements CodeSource {
  private codesPipe;

  constructor(private codes: EAN13Barcode[] = []) {
    this.codesPipe = new BehaviorSubject<EAN13Barcode[]>(codes);
  }

  save(code: EAN13Barcode): Observable<void> {
    this.codes.push(code);
    this.codesPipe.next(this.codes);
    return of(undefined);
  }

  all(): Observable<EAN13Barcode[]> {
    return this.codesPipe.asObservable();
  }

  deleteOne(code: EAN13Barcode): Observable<void> {
    const codeIndex = this.codes.findIndex((_) => _ === code);
    this.codes = this.codes.filter((_, i) => i !== codeIndex);
    this.codesPipe.next(this.codes);
    return of(undefined);
  }
}
