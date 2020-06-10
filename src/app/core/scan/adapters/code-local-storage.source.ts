import { EAN13Barcode } from '../scan.entity';
import { BehaviorSubject, Observable, of, Subject } from 'rxjs';
import { CodeSource } from '../code.source';

export class CodeLocalStorageSource implements CodeSource {
  save(code: EAN13Barcode): Observable<void> {
    const codes = this.read();
    this.write([...codes, code]);
    return of(undefined);
  }

  all(): Observable<EAN13Barcode[]> {
    return of(this.read());
  }

  deleteOne(code: EAN13Barcode): Observable<void> {
    const codes = this.read();
    const codeIndex = codes.findIndex((_) => _ === code);
    this.write(codes.filter((_, i) => i !== codeIndex));
    return of(undefined);
  }

  private read(): EAN13Barcode[] {
    return JSON.parse(localStorage.getItem('codes')) ?? [];
  }

  private write(codes: EAN13Barcode[]): void {
    localStorage.setItem('codes', JSON.stringify(codes));
  }
}
