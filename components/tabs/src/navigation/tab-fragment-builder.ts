/** Builds the fragment for the url */
export class DtTabsRouterFragmentBuilder {
  /** Builds the fragment for the url from a set of ids */
  static build(ids: Set<string>): string {
    return ids.size > 0 ? Array.from(ids).join(',') : '';
  }
}
