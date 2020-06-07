import { EAN13Barcode } from './scan.entity';
import { Observable } from 'rxjs';

export abstract class CodeSource {
  abstract save(code: EAN13Barcode): Observable<void>;

  abstract all(): Observable<EAN13Barcode[]>;

  abstract deleteOne(code: EAN13Barcode): Observable<void>;
}
