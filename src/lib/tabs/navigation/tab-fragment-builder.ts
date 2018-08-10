/** Builds the fragment for the url from a set of ids */
export class DtTabsRouterFragmentBuilder {
  static build(ids: Set<string>): string {
    return ids.size > 0 ? Array.from(ids).join(',') : '';
  }
}
