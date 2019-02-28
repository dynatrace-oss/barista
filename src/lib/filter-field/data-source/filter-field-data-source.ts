import { Observable } from 'rxjs';
import { DtNodeDef } from '../types';

export abstract class DtFilterFieldDataSource {
  /**
   * Used by the DtFilterFieldControl. Called when it connects to the data source.
   * Should return a stream of data that will be transformed, filtered and
   * displayed by the DtFilterField and the DtFilterFieldControl.
   */
  abstract connect(): Observable<DtNodeDef | null>;

  /** Used by the DtFilterField. Called when it is destroyed. */
  abstract disconnect(): void;
}
