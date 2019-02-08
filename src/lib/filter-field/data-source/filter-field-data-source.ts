import { Observable } from 'rxjs';
import { NodeDef } from '../types';

export abstract class DtFilterFieldDataSource {

  /**
   * Used by the DtFilterField. Filter term that should be used to filter out objects from the autocomplete
   * data array.
   * To override how data objects match to this filter string, provide a custom function for autocompleteFilterPredicate.
   */
  abstract autocompleteFilter: string;

  /**
   * Used by the DtFilterField.
   * Checks if an autocomplete option or group object matches the data source's filter string.
   */
  abstract autocompleteFilterPredicate: (optionOrGroup: NodeDef, filter: string) => boolean;

  /**
   * Used by the DtFilterFieldControll. Called when it connects to the data source.
   * Should return a stream of data that will be transformed, filtered and
   * displayed by the DtFilterField.
   */
  abstract connect(): Observable<NodeDef>;

  /** Used by the DtFilterField. Called when it is destroyed. No-op. */
  abstract disconnect(): void;
}
